import type { Env } from "../types";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import { requireAuth, requirePro } from "../middleware/auth";
import { jsonResponse, emptyResponse, corsHeaders } from "../middleware/cors";
import { signJwt, verifyJwt } from "../lib/jwt";

const CHALLENGE_TTL_MS = 5 * 60 * 1000;
const PASSKEY_SESSION_TTL = 5 * 60;
const ACCESS_TOKEN_TTL = 15 * 60;
const REFRESH_TOKEN_TTL_DAYS = 30;

function getOrigin(request: Request): string | null {
  return request.headers.get("Origin");
}

function getRpInfo(request: Request, env: Env): { rpId: string; expectedOrigin: string } {
  const requestOrigin = request.headers.get("Origin") ?? env.CORS_ORIGIN;
  const isAllowed =
    requestOrigin === env.CORS_ORIGIN ||
    requestOrigin.startsWith("http://localhost:") ||
    requestOrigin.startsWith("http://127.0.0.1:");
  const effectiveOrigin = isAllowed ? requestOrigin : env.CORS_ORIGIN;
  const rpId = new URL(effectiveOrigin).hostname;
  return { rpId, expectedOrigin: effectiveOrigin };
}

function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToUint8Array(s: string): Uint8Array<ArrayBuffer> {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  const b64 = pad === 0 ? padded : padded + "====".slice(pad);
  const raw = atob(b64);
  const buf = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i);
  return buf;
}

function corsify(response: Response, origin: string | null, corsOrigin: string): Response {
  const hdrs = new Headers(response.headers);
  Object.entries(corsHeaders(origin, corsOrigin)).forEach(([k, v]) => hdrs.set(k, v));
  return new Response(response.body, { status: response.status, headers: hdrs });
}

// ---------------------------------------------------------------------------
// POST /api/webauthn/register/begin
// ---------------------------------------------------------------------------

async function handleRegisterBegin(request: Request, env: Env): Promise<Response> {
  const origin = getOrigin(request);
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return corsify(authResult, origin, env.CORS_ORIGIN);
  const proCheck = requirePro(authResult);
  if (proCheck) return corsify(proCheck, origin, env.CORS_ORIGIN);

  const { userId } = authResult;
  const { rpId } = getRpInfo(request, env);

  const existing = await env.DB.prepare("SELECT id FROM webauthn_credentials WHERE user_id = ?")
    .bind(userId)
    .all<{ id: string }>();
  const excludeCredentials = (existing.results ?? []).map((r) => ({
    id: r.id,
    type: "public-key" as const,
  }));

  const user = await env.DB.prepare("SELECT email FROM users WHERE id = ?")
    .bind(userId)
    .first<{ email: string }>();

  const options = await generateRegistrationOptions({
    rpName: "kodawarimap",
    rpID: rpId,
    userID: new TextEncoder().encode(userId) as Uint8Array<ArrayBuffer>,
    userName: user?.email ?? userId,
    attestationType: "none",
    excludeCredentials,
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      residentKey: "preferred",
      userVerification: "preferred",
    },
  });

  const expiresAt = new Date(Date.now() + CHALLENGE_TTL_MS).toISOString();
  // 同一ユーザーの古い challenge を削除してから新しいものを挿入（古いレコード残留バグ防止）
  await env.DB.prepare("DELETE FROM webauthn_challenges WHERE user_id = ?").bind(userId).run();
  await env.DB.prepare(
    "INSERT INTO webauthn_challenges (challenge, user_id, expires_at) VALUES (?, ?, ?)"
  )
    .bind(options.challenge, userId, expiresAt)
    .run();

  return jsonResponse(options, 200, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// POST /api/webauthn/register/complete
// ---------------------------------------------------------------------------

async function handleRegisterComplete(request: Request, env: Env): Promise<Response> {
  const origin = getOrigin(request);
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return corsify(authResult, origin, env.CORS_ORIGIN);
  const proCheck = requirePro(authResult);
  if (proCheck) return corsify(proCheck, origin, env.CORS_ORIGIN);

  const { userId } = authResult;
  const { rpId, expectedOrigin } = getRpInfo(request, env);

  let body: { credential: unknown; deviceName?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, origin, env.CORS_ORIGIN);
  }

  const challengeRow = await env.DB.prepare(
    "SELECT challenge, expires_at FROM webauthn_challenges WHERE user_id = ?"
  )
    .bind(userId)
    .first<{ challenge: string; expires_at: string }>();

  if (!challengeRow || new Date(challengeRow.expires_at) < new Date()) {
    console.error("[webauthn] challenge_expired: userId=", userId, "found=", !!challengeRow);
    return jsonResponse({ error: "challenge_expired" }, 400, origin, env.CORS_ORIGIN);
  }

  console.log(
    "[webauthn] register/complete rpId:",
    rpId,
    "expectedOrigin:",
    expectedOrigin,
    "challenge:",
    challengeRow.challenge
  );
  let verification: Awaited<ReturnType<typeof verifyRegistrationResponse>>;
  try {
    verification = await verifyRegistrationResponse({
      response: body.credential as Parameters<typeof verifyRegistrationResponse>[0]["response"],
      expectedChallenge: challengeRow.challenge,
      expectedOrigin,
      expectedRPID: rpId,
      requireUserVerification: false,
    });
  } catch (e) {
    console.error("[webauthn] verifyRegistrationResponse failed:", e);
    return jsonResponse(
      { error: "verification_failed", detail: String(e) },
      400,
      origin,
      env.CORS_ORIGIN
    );
  }

  if (!verification.verified || !verification.registrationInfo) {
    return jsonResponse({ error: "verification_failed" }, 400, origin, env.CORS_ORIGIN);
  }

  const { credential: cred } = verification.registrationInfo;
  const credentialId =
    typeof cred.id === "string" ? cred.id : uint8ArrayToBase64Url(cred.id as unknown as Uint8Array);
  const publicKey = uint8ArrayToBase64Url(cred.publicKey);

  await env.DB.prepare("DELETE FROM webauthn_challenges WHERE user_id = ?").bind(userId).run();

  const now = new Date().toISOString();
  await env.DB.prepare(
    `INSERT OR REPLACE INTO webauthn_credentials (id, user_id, public_key, counter, device_name, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(credentialId, userId, publicKey, cred.counter, body.deviceName ?? null, now)
    .run();

  return jsonResponse({ ok: true }, 200, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// POST /api/webauthn/auth/verify
// ---------------------------------------------------------------------------

async function handleAuthVerify(request: Request, env: Env): Promise<Response> {
  const origin = getOrigin(request);
  const { rpId, expectedOrigin } = getRpInfo(request, env);

  let body: { passkey_session: string; assertion: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, origin, env.CORS_ORIGIN);
  }

  const { passkey_session, assertion } = body;

  const sessionPayload = await verifyJwt(passkey_session, env.JWT_SECRET);
  if (!sessionPayload || sessionPayload["passkey_pending"] !== true) {
    return jsonResponse({ error: "Invalid session" }, 401, origin, env.CORS_ORIGIN);
  }

  const userId = sessionPayload["sub"] as string;
  const challenge = sessionPayload["challenge"] as string;
  const plan = sessionPayload["plan"] as string;
  const role = sessionPayload["role"] as string;

  const challengeRow = await env.DB.prepare(
    "SELECT user_id, expires_at FROM webauthn_challenges WHERE challenge = ?"
  )
    .bind(challenge)
    .first<{ user_id: string; expires_at: string }>();

  if (
    !challengeRow ||
    challengeRow.user_id !== userId ||
    new Date(challengeRow.expires_at) < new Date()
  ) {
    return jsonResponse({ error: "challenge_expired" }, 400, origin, env.CORS_ORIGIN);
  }

  const credentialId = (assertion as { id: string }).id;
  const credRow = await env.DB.prepare(
    "SELECT public_key, counter FROM webauthn_credentials WHERE id = ? AND user_id = ?"
  )
    .bind(credentialId, userId)
    .first<{ public_key: string; counter: number }>();

  if (!credRow) {
    return jsonResponse({ error: "credential_not_found" }, 404, origin, env.CORS_ORIGIN);
  }

  const publicKeyBytes = base64UrlToUint8Array(credRow.public_key);

  console.log(
    "[webauthn] auth/verify rpId:",
    rpId,
    "expectedOrigin:",
    expectedOrigin,
    "credentialId:",
    credentialId,
    "counter:",
    credRow.counter
  );
  let verification: Awaited<ReturnType<typeof verifyAuthenticationResponse>>;
  try {
    verification = await verifyAuthenticationResponse({
      response: assertion as Parameters<typeof verifyAuthenticationResponse>[0]["response"],
      expectedChallenge: challenge,
      expectedOrigin,
      expectedRPID: rpId,
      requireUserVerification: false,
      credential: {
        id: credentialId,
        publicKey: publicKeyBytes,
        counter: credRow.counter,
      },
    });
  } catch (e) {
    console.error("[webauthn] verifyAuthenticationResponse failed:", e);
    return jsonResponse(
      { error: "verification_failed", detail: String(e) },
      400,
      origin,
      env.CORS_ORIGIN
    );
  }

  if (!verification.verified) {
    return jsonResponse({ error: "verification_failed" }, 400, origin, env.CORS_ORIGIN);
  }

  await env.DB.prepare("UPDATE webauthn_credentials SET counter = ? WHERE id = ? AND user_id = ?")
    .bind(verification.authenticationInfo.newCounter, credentialId, userId)
    .run();

  await env.DB.prepare("DELETE FROM webauthn_challenges WHERE challenge = ?").bind(challenge).run();

  const accessToken = await signJwt({ sub: userId, plan, role }, env.JWT_SECRET, ACCESS_TOKEN_TTL);
  const refreshToken = crypto.randomUUID();
  const refreshExpiry = new Date(
    Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();
  await env.DB.prepare(
    "INSERT INTO refresh_tokens (token, user_id, expires_at, revoked) VALUES (?, ?, ?, 0)"
  )
    .bind(refreshToken, userId, refreshExpiry)
    .run();

  return jsonResponse({ accessToken, refreshToken, plan, role }, 200, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// GET /api/webauthn/credentials
// ---------------------------------------------------------------------------

async function handleListCredentials(request: Request, env: Env): Promise<Response> {
  const origin = getOrigin(request);
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return corsify(authResult, origin, env.CORS_ORIGIN);
  const proCheck = requirePro(authResult);
  if (proCheck) return corsify(proCheck, origin, env.CORS_ORIGIN);

  const { userId } = authResult;
  const rows = await env.DB.prepare(
    "SELECT id, device_name, created_at FROM webauthn_credentials WHERE user_id = ? ORDER BY created_at ASC"
  )
    .bind(userId)
    .all<{ id: string; device_name: string | null; created_at: string }>();

  return jsonResponse(
    {
      credentials: (rows.results ?? []).map((r) => ({
        id: r.id,
        deviceName: r.device_name ?? "",
        createdAt: r.created_at,
      })),
    },
    200,
    origin,
    env.CORS_ORIGIN
  );
}

// ---------------------------------------------------------------------------
// DELETE /api/webauthn/credentials/:id
// ---------------------------------------------------------------------------

async function handleDeleteCredential(
  request: Request,
  env: Env,
  credentialId: string
): Promise<Response> {
  const origin = getOrigin(request);
  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) return corsify(authResult, origin, env.CORS_ORIGIN);
  const proCheck = requirePro(authResult);
  if (proCheck) return corsify(proCheck, origin, env.CORS_ORIGIN);

  const { userId } = authResult;
  await env.DB.prepare("DELETE FROM webauthn_credentials WHERE id = ? AND user_id = ?")
    .bind(credentialId, userId)
    .run();

  return emptyResponse(204, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// ルーター
// ---------------------------------------------------------------------------

export async function handleWebAuthn(request: Request, env: Env, path: string): Promise<Response> {
  const method = request.method;
  const origin = getOrigin(request);

  if (path === "/api/webauthn/register/begin" && method === "POST") {
    return handleRegisterBegin(request, env);
  }
  if (path === "/api/webauthn/register/complete" && method === "POST") {
    return handleRegisterComplete(request, env);
  }
  if (path === "/api/webauthn/auth/verify" && method === "POST") {
    return handleAuthVerify(request, env);
  }
  if (path === "/api/webauthn/credentials" && method === "GET") {
    return handleListCredentials(request, env);
  }
  const deleteMatch = path.match(/^\/api\/webauthn\/credentials\/(.+)$/);
  if (deleteMatch && method === "DELETE") {
    return handleDeleteCredential(request, env, decodeURIComponent(deleteMatch[1] as string));
  }

  return jsonResponse({ error: "Not Found" }, 404, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// パスキーセッション発行（handleLogin から呼び出す）
// ---------------------------------------------------------------------------

export async function issuePasskeySession(
  userId: string,
  plan: string,
  role: string,
  salt: string,
  env: Env,
  request: Request,
  origin: string | null
): Promise<Response> {
  const { rpId } = getRpInfo(request, env);

  const challengeBytes = crypto.getRandomValues(new Uint8Array(32));
  const challenge = uint8ArrayToBase64Url(challengeBytes);
  const expiresAt = new Date(Date.now() + CHALLENGE_TTL_MS).toISOString();

  await env.DB.prepare("DELETE FROM webauthn_challenges WHERE user_id = ?").bind(userId).run();
  await env.DB.prepare(
    "INSERT INTO webauthn_challenges (challenge, user_id, expires_at) VALUES (?, ?, ?)"
  )
    .bind(challenge, userId, expiresAt)
    .run();

  const credRows = await env.DB.prepare("SELECT id FROM webauthn_credentials WHERE user_id = ?")
    .bind(userId)
    .all<{ id: string }>();
  const credentialIds = (credRows.results ?? []).map((r) => r.id);

  const passkeySession = await signJwt(
    { sub: userId, plan, role, passkey_pending: true, challenge, rpId },
    env.JWT_SECRET,
    PASSKEY_SESSION_TTL
  );

  return jsonResponse(
    {
      requires_passkey: true,
      passkey_session: passkeySession,
      challenge,
      credential_ids: credentialIds,
      salt,
    },
    200,
    origin,
    env.CORS_ORIGIN
  );
}
