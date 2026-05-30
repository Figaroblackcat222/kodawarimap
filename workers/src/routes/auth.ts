/**
 * 認証ルートハンドラ
 *
 * エンドポイント:
 *   POST /api/auth/register
 *   POST /api/auth/login
 *   POST /api/auth/refresh
 *   POST /api/auth/logout
 *   DELETE /api/account
 */
import type { Env } from "../types";
import { signJwt } from "../lib/jwt";
import { requireAuth } from "../middleware/auth";
import { jsonResponse, emptyResponse, corsHeaders } from "../middleware/cors";
import { issuePasskeySession } from "./webauthn";

const ACCESS_TOKEN_TTL = 15 * 60; // 15分（秒）
const REFRESH_TOKEN_TTL_DAYS = 30;
const LOGIN_RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5分
const LOGIN_RATE_LIMIT_MAX = 5;

// ---------------------------------------------------------------------------
// ヘルパー
// ---------------------------------------------------------------------------

function getOrigin(request: Request): string | null {
  return request.headers.get("Origin");
}

/** クライアントIPを取得する（Cloudflare Workers 環境） */
function getIp(request: Request): string {
  return request.headers.get("CF-Connecting-IP") ?? "unknown";
}

/** IPアドレスを SHA-256 でハッシュ化する（プライバシー配慮） */
async function hashIp(ip: string): Promise<string> {
  const enc = new TextEncoder();
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(ip));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ---------------------------------------------------------------------------
// POST /api/auth/register
// ---------------------------------------------------------------------------

async function handleRegister(request: Request, env: Env): Promise<Response> {
  const origin = getOrigin(request);

  // 登録受付フラグが 'true' でなければ新規登録を拒否
  if (env.REGISTRATION_OPEN !== "true") {
    return jsonResponse({ error: "registration_closed" }, 403, origin, env.CORS_ORIGIN);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, origin, env.CORS_ORIGIN);
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>)["email"] !== "string" ||
    typeof (body as Record<string, unknown>)["passwordHash"] !== "string" ||
    typeof (body as Record<string, unknown>)["salt"] !== "string"
  ) {
    return jsonResponse(
      { error: "email, passwordHash, salt are required" },
      400,
      origin,
      env.CORS_ORIGIN
    );
  }

  const { email, passwordHash, salt } = body as {
    email: string;
    passwordHash: string;
    salt: string;
  };

  // メールアドレスの簡易バリデーション
  if (!email.includes("@") || email.length > 254) {
    return jsonResponse({ error: "Invalid email address" }, 400, origin, env.CORS_ORIGIN);
  }

  // 既存ユーザーチェック
  const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?")
    .bind(email.toLowerCase())
    .first<{ id: string }>();

  if (existing !== null) {
    return jsonResponse({ error: "Email already registered" }, 409, origin, env.CORS_ORIGIN);
  }

  const userId = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO users (id, email, password_hash, salt, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(userId, email.toLowerCase(), passwordHash, salt, now, now)
    .run();

  return jsonResponse({ ok: true }, 201, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// POST /api/auth/login
// ---------------------------------------------------------------------------

async function handleLogin(request: Request, env: Env): Promise<Response> {
  const origin = getOrigin(request);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, origin, env.CORS_ORIGIN);
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>)["email"] !== "string" ||
    typeof (body as Record<string, unknown>)["passwordHash"] !== "string"
  ) {
    return jsonResponse(
      { error: "email and passwordHash are required" },
      400,
      origin,
      env.CORS_ORIGIN
    );
  }

  const { email, passwordHash } = body as {
    email: string;
    passwordHash: string;
  };

  // レートリミット: 5分以内のログイン失敗が5回以上
  const windowStart = new Date(Date.now() - LOGIN_RATE_LIMIT_WINDOW_MS).toISOString();
  const attemptCount = await env.DB.prepare(
    `SELECT COUNT(*) as cnt FROM login_attempts
     WHERE email = ? AND attempted_at > ?`
  )
    .bind(email.toLowerCase(), windowStart)
    .first<{ cnt: number }>();

  if (attemptCount !== null && attemptCount.cnt >= LOGIN_RATE_LIMIT_MAX) {
    return jsonResponse(
      { error: "Too many login attempts. Try again later." },
      429,
      origin,
      env.CORS_ORIGIN
    );
  }

  // ユーザー取得（family_seats の有無も確認して effectivePlan を算出）
  const user = await env.DB.prepare(
    `SELECT u.id, u.password_hash, u.salt, u.plan, u.role, u.status,
       EXISTS(SELECT 1 FROM family_seats WHERE member_user_id = u.id) AS has_seat
     FROM users u WHERE u.email = ?`
  )
    .bind(email.toLowerCase())
    .first<{
      id: string;
      password_hash: string;
      salt: string;
      plan: string;
      role: string;
      status: string;
      has_seat: number;
    }>();

  // 定数時間での比較（タイミング攻撃対策）
  // ユーザーが存在しない場合もダミーハッシュと比較して時間を揃える
  const storedHash = user?.password_hash ?? "dummy-hash-for-timing-safety";
  const isValid = user !== null && timingSafeEqual(storedHash, passwordHash);

  if (!isValid) {
    // 失敗をログに記録
    const ip = getIp(request);
    const ipHash = await hashIp(ip);
    const now = new Date().toISOString();
    await env.DB.prepare(
      `INSERT INTO login_attempts (email, attempted_at, ip_hash) VALUES (?, ?, ?)`
    )
      .bind(email.toLowerCase(), now, ipHash)
      .run();

    return jsonResponse({ error: "Invalid email or password" }, 401, origin, env.CORS_ORIGIN);
  }

  // 仮アカウント（招待経由で作成・パスフレーズ未設定）はログイン不可
  if (user!.status === "pending_setup") {
    return jsonResponse({ error: "account_pending_setup" }, 403, origin, env.CORS_ORIGIN);
  }

  const rawPlan = user!.plan ?? "free";
  // family_seats が付与されていれば "pro" 相当として扱う（クライアントの同期ガード対応）
  const plan =
    rawPlan === "family" || rawPlan === "pro" ? rawPlan : user!.has_seat === 1 ? "pro" : rawPlan;
  const role = user!.role ?? "user";

  // パスキー登録済みならパスキーセッションを返す（2FA ステップへ）
  const passkeyCount = await env.DB.prepare(
    "SELECT COUNT(*) as cnt FROM webauthn_credentials WHERE user_id = ?"
  )
    .bind(user!.id)
    .first<{ cnt: number }>();

  if (passkeyCount !== null && passkeyCount.cnt > 0) {
    return issuePasskeySession(user!.id, plan, role, user!.salt, env, request, origin);
  }

  // パスキー未登録: トークン発行（従来フロー）
  const accessToken = await signJwt(
    { sub: user!.id, plan, role },
    env.JWT_SECRET,
    ACCESS_TOKEN_TTL
  );
  const refreshToken = crypto.randomUUID();
  const refreshExpiry = new Date(
    Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO refresh_tokens (token, user_id, expires_at, revoked)
     VALUES (?, ?, ?, 0)`
  )
    .bind(refreshToken, user!.id, refreshExpiry)
    .run();

  return jsonResponse(
    { accessToken, refreshToken, salt: user!.salt, plan, role },
    200,
    origin,
    env.CORS_ORIGIN
  );
}

// ---------------------------------------------------------------------------
// POST /api/auth/refresh
// ---------------------------------------------------------------------------

async function handleRefresh(request: Request, env: Env): Promise<Response> {
  const origin = getOrigin(request);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, origin, env.CORS_ORIGIN);
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>)["refreshToken"] !== "string"
  ) {
    return jsonResponse({ error: "refreshToken is required" }, 400, origin, env.CORS_ORIGIN);
  }

  const { refreshToken } = body as { refreshToken: string };

  // DB から refreshToken を検索
  const record = await env.DB.prepare(
    `SELECT user_id, expires_at, revoked FROM refresh_tokens WHERE token = ?`
  )
    .bind(refreshToken)
    .first<{ user_id: string; expires_at: string; revoked: number }>();

  if (record === null) {
    return jsonResponse({ error: "Invalid refresh token" }, 401, origin, env.CORS_ORIGIN);
  }

  // revoked チェック
  if (record.revoked === 1) {
    return jsonResponse({ error: "Refresh token has been revoked" }, 401, origin, env.CORS_ORIGIN);
  }

  // 有効期限チェック
  if (new Date(record.expires_at) < new Date()) {
    return jsonResponse({ error: "Refresh token has expired" }, 401, origin, env.CORS_ORIGIN);
  }

  // トークンローテーション: 古いものを revoke
  await env.DB.prepare(`UPDATE refresh_tokens SET revoked = 1 WHERE token = ?`)
    .bind(refreshToken)
    .run();

  // 最新の plan / role を取得して新しいトークンを発行（family_seats も考慮した effectivePlan を返す）
  const userRecord = await env.DB.prepare(
    `SELECT u.plan, u.role,
       EXISTS(SELECT 1 FROM family_seats WHERE member_user_id = u.id) AS has_seat
     FROM users u WHERE u.id = ?`
  )
    .bind(record.user_id)
    .first<{ plan: string; role: string; has_seat: number }>();

  const rawPlan = userRecord?.plan ?? "free";
  const plan =
    rawPlan === "family" || rawPlan === "pro"
      ? rawPlan
      : (userRecord?.has_seat ?? 0) === 1
        ? "pro"
        : rawPlan;
  const role = userRecord?.role ?? "user";
  const newAccessToken = await signJwt(
    { sub: record.user_id, plan, role },
    env.JWT_SECRET,
    ACCESS_TOKEN_TTL
  );
  const newRefreshToken = crypto.randomUUID();
  const newExpiry = new Date(
    Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  await env.DB.prepare(
    `INSERT INTO refresh_tokens (token, user_id, expires_at, revoked)
     VALUES (?, ?, ?, 0)`
  )
    .bind(newRefreshToken, record.user_id, newExpiry)
    .run();

  return jsonResponse(
    { accessToken: newAccessToken, refreshToken: newRefreshToken, plan, role },
    200,
    origin,
    env.CORS_ORIGIN
  );
}

// ---------------------------------------------------------------------------
// POST /api/auth/logout
// ---------------------------------------------------------------------------

async function handleLogout(request: Request, env: Env): Promise<Response> {
  const origin = getOrigin(request);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, origin, env.CORS_ORIGIN);
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>)["refreshToken"] !== "string"
  ) {
    return jsonResponse({ error: "refreshToken is required" }, 400, origin, env.CORS_ORIGIN);
  }

  const { refreshToken } = body as { refreshToken: string };

  // revoke（存在しなくてもエラーにしない）
  await env.DB.prepare(`UPDATE refresh_tokens SET revoked = 1 WHERE token = ?`)
    .bind(refreshToken)
    .run();

  return emptyResponse(204, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// DELETE /api/account
// ---------------------------------------------------------------------------

async function handleDeleteAccount(request: Request, env: Env): Promise<Response> {
  const origin = getOrigin(request);

  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) {
    // CORS ヘッダーを付け直す
    const body = await authResult.text();
    return new Response(body, {
      status: authResult.status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders(origin, env.CORS_ORIGIN),
      },
    });
  }

  const { userId } = authResult;

  // R2 オブジェクト一括削除
  let cursor: string | undefined;
  do {
    const list = await env.PHOTOS.list({
      prefix: `photos/${userId}/`,
      cursor,
    });
    for (const obj of list.objects) {
      await env.PHOTOS.delete(obj.key);
    }
    cursor = list.truncated ? list.cursor : undefined;
  } while (cursor !== undefined);

  // D1 データ削除（外部キー参照があるので順序に注意）
  const stmts = [
    env.DB.prepare(`DELETE FROM photos_sync WHERE user_id = ?`).bind(userId),
    env.DB.prepare(`DELETE FROM pins_sync WHERE user_id = ?`).bind(userId),
    env.DB.prepare(`DELETE FROM refresh_tokens WHERE user_id = ?`).bind(userId),
    env.DB.prepare(
      `DELETE FROM login_attempts WHERE email = (SELECT email FROM users WHERE id = ?)`
    ).bind(userId),
    env.DB.prepare(`DELETE FROM users WHERE id = ?`).bind(userId),
  ];

  await env.DB.batch(stmts);

  return emptyResponse(204, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// POST /api/auth/request-registration
// ---------------------------------------------------------------------------

async function handleRequestRegistration(request: Request, env: Env): Promise<Response> {
  const origin = getOrigin(request);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, origin, env.CORS_ORIGIN);
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>)["email"] !== "string" ||
    typeof (body as Record<string, unknown>)["passwordHash"] !== "string" ||
    typeof (body as Record<string, unknown>)["salt"] !== "string"
  ) {
    return jsonResponse(
      { error: "email, passwordHash, salt are required" },
      400,
      origin,
      env.CORS_ORIGIN
    );
  }

  const { email, passwordHash, salt } = body as {
    email: string;
    passwordHash: string;
    salt: string;
  };

  if (!email.includes("@") || email.length > 254) {
    return jsonResponse({ error: "Invalid email address" }, 400, origin, env.CORS_ORIGIN);
  }

  const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?")
    .bind(email.toLowerCase())
    .first<{ id: string }>();
  if (existing !== null) {
    return jsonResponse({ error: "email_already_registered" }, 409, origin, env.CORS_ORIGIN);
  }

  const pending = await env.DB.prepare("SELECT id FROM registration_requests WHERE email = ?")
    .bind(email.toLowerCase())
    .first<{ id: string }>();
  if (pending !== null) {
    return jsonResponse({ error: "request_already_pending" }, 409, origin, env.CORS_ORIGIN);
  }

  const id = crypto.randomUUID();
  await env.DB.prepare(
    `INSERT INTO registration_requests (id, email, password_hash, salt) VALUES (?, ?, ?, ?)`
  )
    .bind(id, email.toLowerCase(), passwordHash, salt)
    .run();

  return jsonResponse({ ok: true }, 200, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// GET /api/auth/invite-info?token=TOKEN
// 招待トークンに紐づくメールアドレスとアカウント状態を返す（認証不要）
// ---------------------------------------------------------------------------

async function handleInviteInfo(request: Request, env: Env): Promise<Response> {
  const origin = getOrigin(request);
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return jsonResponse({ error: "token required" }, 400, origin, env.CORS_ORIGIN);
  }

  const invite = await env.DB.prepare(
    `SELECT gi.invitee_email, gi.status AS invite_status,
            u.status AS user_status
     FROM group_invites gi
     LEFT JOIN users u ON u.email = gi.invitee_email
     WHERE gi.token = ?`
  )
    .bind(token)
    .first<{ invitee_email: string; invite_status: string; user_status: string | null }>();

  if (!invite) return jsonResponse({ error: "invite_not_found" }, 404, origin, env.CORS_ORIGIN);
  if (invite.invite_status !== "pending") {
    return jsonResponse({ error: "invite_already_used" }, 422, origin, env.CORS_ORIGIN);
  }

  return jsonResponse(
    {
      email: invite.invitee_email,
      isPendingSetup: invite.user_status === "pending_setup",
    },
    200,
    origin,
    env.CORS_ORIGIN
  );
}

// ---------------------------------------------------------------------------
// POST /api/auth/activate-invite
// 仮アカウントのパスフレーズ設定 + 招待承認を1リクエストで完結（認証不要）
// ---------------------------------------------------------------------------

async function handleActivateInvite(request: Request, env: Env): Promise<Response> {
  const origin = getOrigin(request);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, origin, env.CORS_ORIGIN);
  }

  const { token, passwordHash, salt } = body as Record<string, unknown>;
  if (typeof token !== "string" || typeof passwordHash !== "string" || typeof salt !== "string") {
    return jsonResponse(
      { error: "token, passwordHash, salt required" },
      400,
      origin,
      env.CORS_ORIGIN
    );
  }

  // トークン検証
  const invite = await env.DB.prepare(
    `SELECT group_id, invitee_email, status, expires_at FROM group_invites WHERE token = ?`
  )
    .bind(token)
    .first<{ group_id: string; invitee_email: string; status: string; expires_at: string }>();

  if (!invite) return jsonResponse({ error: "invite_not_found" }, 404, origin, env.CORS_ORIGIN);
  if (invite.status !== "pending") {
    return jsonResponse({ error: "invite_already_used" }, 422, origin, env.CORS_ORIGIN);
  }
  if (new Date(invite.expires_at) < new Date()) {
    return jsonResponse({ error: "invite_expired" }, 422, origin, env.CORS_ORIGIN);
  }

  // 仮アカウント取得
  const user = await env.DB.prepare(
    `SELECT id, status FROM users WHERE email = ? AND status = 'pending_setup'`
  )
    .bind(invite.invitee_email)
    .first<{ id: string; status: string }>();

  if (!user) {
    return jsonResponse({ error: "account_not_pending" }, 422, origin, env.CORS_ORIGIN);
  }

  const now = new Date().toISOString();

  // アカウント有効化 + 招待承認 + トークン発行をバッチで
  const refreshToken = crypto.randomUUID();
  const refreshExpiry = new Date(
    Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  await env.DB.batch([
    // パスフレーズ設定・アカウント有効化
    env.DB.prepare(
      `UPDATE users SET password_hash = ?, salt = ?, status = 'active', updated_at = ? WHERE id = ?`
    ).bind(passwordHash, salt, now, user.id),
    // グループメンバーシップ作成
    env.DB.prepare(
      `INSERT INTO group_memberships (group_id, user_id, role, status, joined_at)
       VALUES (?, ?, 'member', 'pending_key', ?)`
    ).bind(invite.group_id, user.id, now),
    // 招待トークン消費
    env.DB.prepare(`UPDATE group_invites SET status = 'accepted' WHERE token = ?`).bind(token),
    // リフレッシュトークン発行
    env.DB.prepare(
      `INSERT INTO refresh_tokens (token, user_id, expires_at, revoked) VALUES (?, ?, ?, 0)`
    ).bind(refreshToken, user.id, refreshExpiry),
  ]);

  const accessToken = await signJwt(
    { sub: user.id, plan: "free", role: "user" },
    env.JWT_SECRET,
    ACCESS_TOKEN_TTL
  );

  return jsonResponse(
    { accessToken, refreshToken, salt, plan: "free", role: "user" },
    200,
    origin,
    env.CORS_ORIGIN
  );
}

// ---------------------------------------------------------------------------
// ルーター
// ---------------------------------------------------------------------------

export async function handleAuth(request: Request, env: Env, path: string): Promise<Response> {
  const method = request.method;
  const origin = getOrigin(request);

  if (path === "/api/auth/register" && method === "POST") {
    return handleRegister(request, env);
  }
  if (path === "/api/auth/request-registration" && method === "POST") {
    return handleRequestRegistration(request, env);
  }
  if (path === "/api/auth/login" && method === "POST") {
    return handleLogin(request, env);
  }
  if (path === "/api/auth/refresh" && method === "POST") {
    return handleRefresh(request, env);
  }
  if (path === "/api/auth/logout" && method === "POST") {
    return handleLogout(request, env);
  }
  if (path === "/api/account" && method === "DELETE") {
    return handleDeleteAccount(request, env);
  }
  if (path === "/api/auth/invite-info" && method === "GET") {
    return handleInviteInfo(request, env);
  }
  if (path === "/api/auth/activate-invite" && method === "POST") {
    return handleActivateInvite(request, env);
  }

  return jsonResponse({ error: "Not Found" }, 404, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// 内部ユーティリティ
// ---------------------------------------------------------------------------

/**
 * タイミングセーフな文字列比較。
 * 長さが異なる場合でも同程度の時間がかかるように実装。
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // 長さが違っても比較を続けてから false を返す（タイミング一定化）
    let diff = 0;
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
      diff |= a.charCodeAt(i % a.length) ^ b.charCodeAt(i % b.length);
    }
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
