/**
 * グループ管理ルートハンドラ
 *
 * POST   /api/groups                            グループ作成 (requireFamilyOwner)
 * GET    /api/groups                            参加グループ一覧
 * GET    /api/groups/:id/members                メンバー一覧
 * DELETE /api/groups/:id/members/:userId        メンバーをソフト失効（オーナーのみ）
 * POST   /api/groups/:id/invites                招待トークン発行
 * POST   /api/groups/invites/:token/accept      招待承認
 * GET    /api/groups/:id/pending-keys           鍵配布待ちメンバー一覧
 * POST   /api/groups/:id/member-keys            グループ鍵付与
 * GET    /api/groups/:id/my-key                 自分のラップ済みグループ鍵取得
 * GET    /api/groups/:id/active-keys            アクティブメンバーの公開鍵一覧（ローテーション用）
 * POST   /api/groups/:id/rotate-key             グループ鍵ローテーション
 */
import type { Env } from "../types";
import { requireAuth, requirePro, requireFamilyOwner } from "../middleware/auth";
import { requireGroupMember } from "../middleware/group-auth";
import { jsonResponse, emptyResponse } from "../middleware/cors";

const INVITE_TTL_DAYS = 7;
const MAX_SEATS_DEFAULT = 5;

function getOrigin(r: Request) {
  return r.headers.get("Origin");
}

export async function handleGroups(request: Request, env: Env, path: string): Promise<Response> {
  const origin = getOrigin(request);

  // -----------------------------------------------------------------------
  // POST /api/groups/invites/:token/accept  (invites より先に評価)
  // -----------------------------------------------------------------------
  const acceptMatch = path.match(
    /^\/api\/groups\/invites\/([^/]+)\/accept$/
  ) as RegExpMatchArray | null;
  if (request.method === "POST" && acceptMatch) {
    return handleAcceptInvite(request, env, acceptMatch[1]!);
  }

  // -----------------------------------------------------------------------
  // POST /api/groups
  // -----------------------------------------------------------------------
  if (request.method === "POST" && path === "/api/groups") {
    const auth = await requireAuth(request, env);
    if (auth instanceof Response) return auth;
    const famErr = requireFamilyOwner(auth);
    if (famErr) return famErr;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400, origin, env.CORS_ORIGIN);
    }
    const { encryptedName, nameIv, wrappedGroupKey } = body as Record<string, unknown>;
    if (
      typeof encryptedName !== "string" ||
      typeof nameIv !== "string" ||
      typeof wrappedGroupKey !== "string"
    ) {
      return jsonResponse(
        { error: "encryptedName, nameIv, wrappedGroupKey required" },
        400,
        origin,
        env.CORS_ORIGIN
      );
    }

    const groupId = crypto.randomUUID();
    const now = new Date().toISOString();

    await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO family_groups (id, encrypted_name, name_iv, owner_id, key_version, max_seats, created_at, updated_at)
         VALUES (?, ?, ?, ?, 1, ?, ?, ?)`
      ).bind(groupId, encryptedName, nameIv, auth.userId, MAX_SEATS_DEFAULT, now, now),

      env.DB.prepare(
        `INSERT INTO group_memberships (group_id, user_id, role, status, joined_at)
         VALUES (?, ?, 'owner', 'active', ?)`
      ).bind(groupId, auth.userId, now),

      env.DB.prepare(
        `INSERT INTO group_member_keys (group_id, user_id, key_version, wrapped_group_key, created_at)
         VALUES (?, ?, 1, ?, ?)`
      ).bind(groupId, auth.userId, wrappedGroupKey, now),
    ]);

    return jsonResponse({ groupId }, 201, origin, env.CORS_ORIGIN);
  }

  // -----------------------------------------------------------------------
  // DELETE /api/groups/:id  グループ削除（オーナーのみ）
  // -----------------------------------------------------------------------
  const deleteGroupMatch = path.match(/^\/api\/groups\/([^/]+)$/);
  if (request.method === "DELETE" && deleteGroupMatch) {
    const gId = deleteGroupMatch[1]!;
    const auth = await requireAuth(request, env);
    if (auth instanceof Response) return auth;
    const proErr = requirePro(auth);
    if (proErr) return proErr;

    const group = await env.DB.prepare(`SELECT owner_id FROM family_groups WHERE id = ?`)
      .bind(gId)
      .first<{ owner_id: string }>();
    if (!group) return jsonResponse({ error: "group_not_found" }, 404, origin, env.CORS_ORIGIN);
    if (group.owner_id !== auth.userId) {
      return jsonResponse({ error: "forbidden" }, 403, origin, env.CORS_ORIGIN);
    }

    await env.DB.batch([
      env.DB.prepare(`DELETE FROM group_pins_sync WHERE group_id = ?`).bind(gId),
      env.DB.prepare(`DELETE FROM group_photos_sync WHERE group_id = ?`).bind(gId),
      env.DB.prepare(`DELETE FROM group_invites WHERE group_id = ?`).bind(gId),
      env.DB.prepare(
        `DELETE FROM family_seats WHERE owner_user_id = ? AND member_user_id IN (SELECT user_id FROM group_memberships WHERE group_id = ?)`
      ).bind(auth.userId, gId),
      env.DB.prepare(`DELETE FROM group_member_keys WHERE group_id = ?`).bind(gId),
      env.DB.prepare(`DELETE FROM group_memberships WHERE group_id = ?`).bind(gId),
      env.DB.prepare(`DELETE FROM family_groups WHERE id = ?`).bind(gId),
    ]);

    return emptyResponse(204, origin, env.CORS_ORIGIN);
  }

  // -----------------------------------------------------------------------
  // GET /api/groups
  // -----------------------------------------------------------------------
  if (request.method === "GET" && path === "/api/groups") {
    const auth = await requireAuth(request, env);
    if (auth instanceof Response) return auth;
    const proErr = requirePro(auth);
    if (proErr) return proErr;

    const rows = await env.DB.prepare(
      `SELECT g.id, g.encrypted_name, g.name_iv, g.key_version, g.max_seats,
              m.role, m.status
       FROM family_groups g
       JOIN group_memberships m ON m.group_id = g.id
       WHERE m.user_id = ? AND m.status = 'active'
       ORDER BY g.created_at DESC`
    )
      .bind(auth.userId)
      .all<{
        id: string;
        encrypted_name: string;
        name_iv: string;
        key_version: number;
        max_seats: number;
        role: string;
        status: string;
      }>();

    const groups = (rows.results ?? []).map((r) => ({
      id: r.id,
      encryptedName: r.encrypted_name,
      nameIv: r.name_iv,
      keyVersion: r.key_version,
      maxSeats: r.max_seats,
      role: r.role,
    }));

    return jsonResponse({ groups }, 200, origin, env.CORS_ORIGIN);
  }

  // -----------------------------------------------------------------------
  // /:id 配下のルーティング
  // -----------------------------------------------------------------------
  const groupMatch = path.match(/^\/api\/groups\/([^/]+)(\/.*)?$/);
  if (!groupMatch) return jsonResponse({ error: "Not Found" }, 404, origin, env.CORS_ORIGIN);
  const groupId = groupMatch[1]!;
  const sub = groupMatch[2] ?? "";

  // DELETE /api/groups/:id/members/:userId  ソフト失効
  const memberRevoke = sub.match(/^\/members\/([^/]+)$/);
  if (request.method === "DELETE" && memberRevoke) {
    const targetUserId = memberRevoke[1]!;
    return handleRevokeMember(request, env, groupId, targetUserId, origin);
  }

  // GET /api/groups/:id/active-keys  ローテーション用
  if (request.method === "GET" && sub === "/active-keys") {
    const auth = await requireGroupMember(request, env, groupId);
    if (auth instanceof Response) return auth;

    const rows = await env.DB.prepare(
      `SELECT m.user_id, pk.public_key, pk.fingerprint
       FROM group_memberships m
       JOIN user_public_keys pk ON pk.user_id = m.user_id
       WHERE m.group_id = ? AND m.status = 'active'`
    )
      .bind(groupId)
      .all<{ user_id: string; public_key: string; fingerprint: string }>();

    const keys = (rows.results ?? []).map((r) => ({
      userId: r.user_id,
      publicKey: r.public_key,
      fingerprint: r.fingerprint,
    }));
    return jsonResponse({ keys }, 200, origin, env.CORS_ORIGIN);
  }

  // POST /api/groups/:id/rotate-key  鍵ローテーション（オーナーのみ）
  if (request.method === "POST" && sub === "/rotate-key") {
    return handleRotateKey(request, env, groupId, origin);
  }

  // POST /api/groups/:id/invites
  if (request.method === "POST" && sub === "/invites") {
    const auth = await requireGroupMember(request, env, groupId);
    if (auth instanceof Response) return auth;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400, origin, env.CORS_ORIGIN);
    }
    const { inviteeEmail } = body as Record<string, unknown>;
    if (typeof inviteeEmail !== "string" || !inviteeEmail.includes("@")) {
      return jsonResponse({ error: "inviteeEmail required" }, 400, origin, env.CORS_ORIGIN);
    }

    // 現在の有効メンバー数チェック
    const group = await env.DB.prepare(`SELECT max_seats FROM family_groups WHERE id = ?`)
      .bind(groupId)
      .first<{ max_seats: number }>();
    const activeCount = await env.DB.prepare(
      `SELECT COUNT(*) as cnt FROM group_memberships WHERE group_id = ? AND status != 'pending_key'`
    )
      .bind(groupId)
      .first<{ cnt: number }>();
    if (group && activeCount && activeCount.cnt >= group.max_seats) {
      return jsonResponse({ error: "seat_limit_reached" }, 422, origin, env.CORS_ORIGIN);
    }

    const token = crypto.randomUUID();
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 86400_000).toISOString();

    // 招待先メールのアカウントがなければ仮アカウントを作成する
    const existingUser = await env.DB.prepare(`SELECT id FROM users WHERE email = ?`)
      .bind(inviteeEmail.toLowerCase())
      .first<{ id: string }>();
    if (!existingUser) {
      const provisionalId = crypto.randomUUID();
      await env.DB.prepare(
        `INSERT INTO users (id, email, password_hash, salt, plan, role, status, created_at, updated_at)
         VALUES (?, ?, '', '', 'free', 'user', 'pending_setup', ?, ?)`
      )
        .bind(provisionalId, inviteeEmail.toLowerCase(), now, now)
        .run();
    }

    await env.DB.prepare(
      `INSERT INTO group_invites (token, group_id, invitee_email, invited_by, status, created_at, expires_at)
       VALUES (?, ?, ?, ?, 'pending', ?, ?)`
    )
      .bind(token, groupId, inviteeEmail, auth.userId, now, expiresAt)
      .run();

    return jsonResponse({ token }, 201, origin, env.CORS_ORIGIN);
  }

  // GET /api/groups/:id/members
  if (request.method === "GET" && sub === "/members") {
    const auth = await requireGroupMember(request, env, groupId);
    if (auth instanceof Response) return auth;

    const rows = await env.DB.prepare(
      `SELECT m.user_id, m.role, m.status, m.joined_at,
              u.email, pk.fingerprint
       FROM group_memberships m
       JOIN users u ON u.id = m.user_id
       LEFT JOIN user_public_keys pk ON pk.user_id = m.user_id
       WHERE m.group_id = ?
       ORDER BY m.joined_at ASC`
    )
      .bind(groupId)
      .all<{
        user_id: string;
        role: string;
        status: string;
        joined_at: string;
        email: string;
        fingerprint: string | null;
      }>();

    const members = (rows.results ?? []).map((r) => ({
      userId: r.user_id,
      role: r.role,
      status: r.status,
      joinedAt: r.joined_at,
      email: r.email,
      fingerprint: r.fingerprint,
    }));

    return jsonResponse({ members }, 200, origin, env.CORS_ORIGIN);
  }

  // GET /api/groups/:id/pending-keys
  if (request.method === "GET" && sub === "/pending-keys") {
    const auth = await requireGroupMember(request, env, groupId);
    if (auth instanceof Response) return auth;

    const rows = await env.DB.prepare(
      `SELECT m.user_id, pk.public_key, pk.fingerprint
       FROM group_memberships m
       JOIN user_public_keys pk ON pk.user_id = m.user_id
       WHERE m.group_id = ? AND m.status = 'pending_key'`
    )
      .bind(groupId)
      .all<{ user_id: string; public_key: string; fingerprint: string }>();

    const pending = (rows.results ?? []).map((r) => ({
      userId: r.user_id,
      publicKey: r.public_key,
      fingerprint: r.fingerprint,
    }));

    return jsonResponse({ pending }, 200, origin, env.CORS_ORIGIN);
  }

  // POST /api/groups/:id/member-keys  グループ鍵を pending メンバーに付与
  if (request.method === "POST" && sub === "/member-keys") {
    const auth = await requireGroupMember(request, env, groupId);
    if (auth instanceof Response) return auth;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400, origin, env.CORS_ORIGIN);
    }
    const { userId: targetUserId, wrappedGroupKey } = body as Record<string, unknown>;
    if (typeof targetUserId !== "string" || typeof wrappedGroupKey !== "string") {
      return jsonResponse(
        { error: "userId, wrappedGroupKey required" },
        400,
        origin,
        env.CORS_ORIGIN
      );
    }

    // 対象が pending_key メンバーか確認
    const membership = await env.DB.prepare(
      `SELECT status FROM group_memberships WHERE group_id = ? AND user_id = ?`
    )
      .bind(groupId, targetUserId)
      .first<{ status: string }>();
    if (!membership || membership.status !== "pending_key") {
      return jsonResponse({ error: "member_not_pending" }, 422, origin, env.CORS_ORIGIN);
    }

    const group = await env.DB.prepare(
      `SELECT key_version, owner_id FROM family_groups WHERE id = ?`
    )
      .bind(groupId)
      .first<{ key_version: number; owner_id: string }>();
    if (!group) return jsonResponse({ error: "group_not_found" }, 404, origin, env.CORS_ORIGIN);

    const now = new Date().toISOString();
    await env.DB.batch([
      env.DB.prepare(
        `INSERT OR REPLACE INTO group_member_keys (group_id, user_id, key_version, wrapped_group_key, created_at)
         VALUES (?, ?, ?, ?, ?)`
      ).bind(groupId, targetUserId, group.key_version, wrappedGroupKey, now),

      // メンバーを active 化
      env.DB.prepare(
        `UPDATE group_memberships SET status = 'active' WHERE group_id = ? AND user_id = ?`
      ).bind(groupId, targetUserId),

      // 席付与（オーナーから被招待者へ）
      env.DB.prepare(
        `INSERT OR IGNORE INTO family_seats (owner_user_id, member_user_id, granted_at)
         VALUES (?, ?, ?)`
      ).bind(group.owner_id, targetUserId, now),
    ]);

    return emptyResponse(204, origin, env.CORS_ORIGIN);
  }

  // GET /api/groups/:id/my-key
  if (request.method === "GET" && sub === "/my-key") {
    const auth = await requireGroupMember(request, env, groupId);
    if (auth instanceof Response) return auth;

    const group = await env.DB.prepare(`SELECT key_version FROM family_groups WHERE id = ?`)
      .bind(groupId)
      .first<{ key_version: number }>();
    if (!group) return jsonResponse({ error: "group_not_found" }, 404, origin, env.CORS_ORIGIN);

    const keyRow = await env.DB.prepare(
      `SELECT wrapped_group_key FROM group_member_keys
       WHERE group_id = ? AND user_id = ? AND key_version = ?`
    )
      .bind(groupId, auth.userId, group.key_version)
      .first<{ wrapped_group_key: string }>();

    if (!keyRow) return jsonResponse({ error: "not_found" }, 404, origin, env.CORS_ORIGIN);

    return jsonResponse(
      { wrappedGroupKey: keyRow.wrapped_group_key, keyVersion: group.key_version },
      200,
      origin,
      env.CORS_ORIGIN
    );
  }

  return jsonResponse({ error: "Not Found" }, 404, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// DELETE /api/groups/:id/members/:userId  ソフト失効
// ---------------------------------------------------------------------------
async function handleRevokeMember(
  request: Request,
  env: Env,
  groupId: string,
  targetUserId: string,
  origin: string | null
): Promise<Response> {
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;
  const proErr = requirePro(auth);
  if (proErr) return proErr;

  // グループとリクエスト者のロール確認
  const requestorMembership = await env.DB.prepare(
    `SELECT role FROM group_memberships WHERE group_id = ? AND user_id = ? AND status = 'active'`
  )
    .bind(groupId, auth.userId)
    .first<{ role: string }>();
  if (!requestorMembership) {
    return jsonResponse({ error: "not_a_member" }, 403, origin, env.CORS_ORIGIN);
  }

  // オーナー以外が他人を失効しようとしている場合は拒否
  if (auth.userId !== targetUserId && requestorMembership.role !== "owner") {
    return jsonResponse({ error: "forbidden" }, 403, origin, env.CORS_ORIGIN);
  }

  // オーナー自身は失効できない（グループごと削除するフローを別途用意）
  if (auth.userId === targetUserId && requestorMembership.role === "owner") {
    return jsonResponse({ error: "owner_cannot_leave" }, 422, origin, env.CORS_ORIGIN);
  }

  const group = await env.DB.prepare(`SELECT owner_id FROM family_groups WHERE id = ?`)
    .bind(groupId)
    .first<{ owner_id: string }>();
  if (!group) return jsonResponse({ error: "group_not_found" }, 404, origin, env.CORS_ORIGIN);

  await env.DB.batch([
    env.DB.prepare(`DELETE FROM group_memberships WHERE group_id = ? AND user_id = ?`).bind(
      groupId,
      targetUserId
    ),

    env.DB.prepare(`DELETE FROM group_member_keys WHERE group_id = ? AND user_id = ?`).bind(
      groupId,
      targetUserId
    ),

    // Pro 相当席を剥奪（被招待者のみ。オーナー自身の席はない）
    env.DB.prepare(`DELETE FROM family_seats WHERE owner_user_id = ? AND member_user_id = ?`).bind(
      group.owner_id,
      targetUserId
    ),
  ]);

  return emptyResponse(204, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// POST /api/groups/:id/rotate-key  鍵ローテーション（オーナーのみ）
// ---------------------------------------------------------------------------
async function handleRotateKey(
  request: Request,
  env: Env,
  groupId: string,
  origin: string | null
): Promise<Response> {
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;
  const proErr = requirePro(auth);
  if (proErr) return proErr;

  // オーナー確認
  const membership = await env.DB.prepare(
    `SELECT role FROM group_memberships WHERE group_id = ? AND user_id = ? AND status = 'active'`
  )
    .bind(groupId, auth.userId)
    .first<{ role: string }>();
  if (!membership || membership.role !== "owner") {
    return jsonResponse({ error: "forbidden" }, 403, origin, env.CORS_ORIGIN);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, origin, env.CORS_ORIGIN);
  }

  const { newKeyVersion, wrappedKeys, encryptedName, nameIv } = body as {
    newKeyVersion?: unknown;
    wrappedKeys?: unknown;
    encryptedName?: unknown;
    nameIv?: unknown;
  };
  if (
    typeof newKeyVersion !== "number" ||
    !Array.isArray(wrappedKeys) ||
    wrappedKeys.some(
      (k) => typeof k.userId !== "string" || typeof k.wrappedGroupKey !== "string"
    ) ||
    typeof encryptedName !== "string" ||
    typeof nameIv !== "string"
  ) {
    return jsonResponse(
      { error: "newKeyVersion, wrappedKeys, encryptedName, nameIv required" },
      400,
      origin,
      env.CORS_ORIGIN
    );
  }

  // 現在の key_version と整合性確認
  const group = await env.DB.prepare(`SELECT key_version FROM family_groups WHERE id = ?`)
    .bind(groupId)
    .first<{ key_version: number }>();
  if (!group) return jsonResponse({ error: "group_not_found" }, 404, origin, env.CORS_ORIGIN);
  if (newKeyVersion !== group.key_version + 1) {
    return jsonResponse({ error: "invalid_key_version" }, 422, origin, env.CORS_ORIGIN);
  }

  const now = new Date().toISOString();
  const statements = [
    env.DB.prepare(
      `UPDATE family_groups SET key_version = ?, encrypted_name = ?, name_iv = ? WHERE id = ?`
    ).bind(newKeyVersion, encryptedName, nameIv, groupId),
    ...(wrappedKeys as Array<{ userId: string; wrappedGroupKey: string }>).map((k) =>
      env.DB.prepare(
        `INSERT OR REPLACE INTO group_member_keys (group_id, user_id, key_version, wrapped_group_key, created_at)
         VALUES (?, ?, ?, ?, ?)`
      ).bind(groupId, k.userId, newKeyVersion, k.wrappedGroupKey, now)
    ),
  ];

  await env.DB.batch(statements);
  return jsonResponse({ keyVersion: newKeyVersion }, 200, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// POST /api/groups/invites/:token/accept
// ---------------------------------------------------------------------------
async function handleAcceptInvite(request: Request, env: Env, token: string): Promise<Response> {
  const origin = request.headers.get("Origin");

  // 招待トークンが承認であるため requirePro は不要。
  // フリーユーザーも招待を承認でき、オーナーが鍵を付与した時点で family_seats が作成される。
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

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

  // 公開鍵が登録されているか確認（未登録は鍵配布できない）
  const hasPubKey = await env.DB.prepare(`SELECT 1 FROM user_public_keys WHERE user_id = ?`)
    .bind(auth.userId)
    .first();
  if (!hasPubKey) {
    return jsonResponse({ error: "public_key_not_registered" }, 422, origin, env.CORS_ORIGIN);
  }

  // 既にメンバーか確認
  const existing = await env.DB.prepare(
    `SELECT status FROM group_memberships WHERE group_id = ? AND user_id = ?`
  )
    .bind(invite.group_id, auth.userId)
    .first<{ status: string }>();
  if (existing) {
    return jsonResponse({ error: "already_a_member" }, 422, origin, env.CORS_ORIGIN);
  }

  const now = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO group_memberships (group_id, user_id, role, status, joined_at)
       VALUES (?, ?, 'member', 'pending_key', ?)`
    ).bind(invite.group_id, auth.userId, now),

    env.DB.prepare(`UPDATE group_invites SET status = 'accepted' WHERE token = ?`).bind(token),
  ]);

  return jsonResponse({ groupId: invite.group_id }, 200, origin, env.CORS_ORIGIN);
}
