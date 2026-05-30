/**
 * 管理画面APIルートハンドラ
 *
 * エンドポイント（全て admin ロール必須）:
 *   GET   /api/admin/users?q=&limit=50&offset=0
 *   PATCH /api/admin/users/:id
 */
import type { Env } from "../types";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { jsonResponse } from "../middleware/cors";

interface D1UserRow {
  id: string;
  email: string;
  plan: string;
  role: string;
  created_at: string;
  updated_at: string;
}

function getOrigin(request: Request): string | null {
  return request.headers.get("Origin");
}

function corsHeadersFrom(response: Response): Record<string, string> {
  const result: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    if (key.toLowerCase().startsWith("access-control-") || key.toLowerCase() === "vary") {
      result[key] = value;
    }
  });
  return result;
}

// ---------------------------------------------------------------------------
// GET /api/admin/users
// ---------------------------------------------------------------------------

async function handleListUsers(request: Request, env: Env): Promise<Response> {
  const origin = getOrigin(request);

  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) {
    const body = await authResult.text();
    return new Response(body, {
      status: authResult.status,
      headers: { "Content-Type": "application/json", ...corsHeadersFrom(authResult) },
    });
  }
  const adminError = requireAdmin(authResult);
  if (adminError) return adminError;

  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const limit = Math.min(Number(url.searchParams.get("limit") ?? "50"), 200);
  const offset = Number(url.searchParams.get("offset") ?? "0");

  const rows = q
    ? await env.DB.prepare(
        `SELECT id, email, plan, role, created_at, updated_at
         FROM users
         WHERE email LIKE ?
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`
      )
        .bind(`%${q}%`, limit, offset)
        .all<D1UserRow>()
    : await env.DB.prepare(
        `SELECT id, email, plan, role, created_at, updated_at
         FROM users
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`
      )
        .bind(limit, offset)
        .all<D1UserRow>();

  const countRow = q
    ? await env.DB.prepare(`SELECT COUNT(*) as cnt FROM users WHERE email LIKE ?`)
        .bind(`%${q}%`)
        .first<{ cnt: number }>()
    : await env.DB.prepare(`SELECT COUNT(*) as cnt FROM users`).first<{ cnt: number }>();

  const users = (rows.results ?? []).map((r) => ({
    id: r.id,
    email: r.email,
    plan: r.plan,
    role: r.role,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));

  return jsonResponse(
    { users, total: countRow?.cnt ?? 0, limit, offset },
    200,
    origin,
    env.CORS_ORIGIN
  );
}

// ---------------------------------------------------------------------------
// PATCH /api/admin/users/:id
// ---------------------------------------------------------------------------

async function handleUpdateUser(request: Request, env: Env, userId: string): Promise<Response> {
  const origin = getOrigin(request);

  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) {
    const body = await authResult.text();
    return new Response(body, {
      status: authResult.status,
      headers: { "Content-Type": "application/json", ...corsHeadersFrom(authResult) },
    });
  }
  const adminError = requireAdmin(authResult);
  if (adminError) return adminError;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, origin, env.CORS_ORIGIN);
  }

  const { plan } = body as { plan?: string };
  if (plan !== undefined && plan !== "free" && plan !== "pro" && plan !== "family") {
    return jsonResponse(
      { error: "plan must be 'free', 'pro', or 'family'" },
      400,
      origin,
      env.CORS_ORIGIN
    );
  }

  if (plan === undefined) {
    return jsonResponse({ error: "No updatable fields provided" }, 400, origin, env.CORS_ORIGIN);
  }

  const now = new Date().toISOString();
  const result = await env.DB.prepare(`UPDATE users SET plan = ?, updated_at = ? WHERE id = ?`)
    .bind(plan, now, userId)
    .run();

  if (result.meta.changes === 0) {
    return jsonResponse({ error: "User not found" }, 404, origin, env.CORS_ORIGIN);
  }

  return jsonResponse({ ok: true, plan }, 200, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// GET /api/admin/registrations
// ---------------------------------------------------------------------------

async function handleListRegistrations(request: Request, env: Env): Promise<Response> {
  const origin = getOrigin(request);

  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) {
    const body = await authResult.text();
    return new Response(body, {
      status: authResult.status,
      headers: { "Content-Type": "application/json", ...corsHeadersFrom(authResult) },
    });
  }
  const adminError = requireAdmin(authResult);
  if (adminError) return adminError;

  const rows = await env.DB.prepare(
    `SELECT id, email, requested_at FROM registration_requests ORDER BY requested_at DESC`
  ).all<{ id: string; email: string; requested_at: string }>();

  const requests = (rows.results ?? []).map((r) => ({
    id: r.id,
    email: r.email,
    requestedAt: r.requested_at,
  }));

  return jsonResponse({ requests }, 200, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// POST /api/admin/registrations/:id/approve
// ---------------------------------------------------------------------------

async function handleApproveRegistration(
  request: Request,
  env: Env,
  requestId: string
): Promise<Response> {
  const origin = getOrigin(request);

  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) {
    const body = await authResult.text();
    return new Response(body, {
      status: authResult.status,
      headers: { "Content-Type": "application/json", ...corsHeadersFrom(authResult) },
    });
  }
  const adminError = requireAdmin(authResult);
  if (adminError) return adminError;

  const reg = await env.DB.prepare(
    `SELECT id, email, password_hash, salt FROM registration_requests WHERE id = ?`
  )
    .bind(requestId)
    .first<{ id: string; email: string; password_hash: string; salt: string }>();

  if (reg === null) {
    return jsonResponse({ error: "Request not found" }, 404, origin, env.CORS_ORIGIN);
  }

  const existingUser = await env.DB.prepare("SELECT id FROM users WHERE email = ?")
    .bind(reg.email)
    .first<{ id: string }>();
  if (existingUser !== null) {
    await env.DB.prepare(`DELETE FROM registration_requests WHERE id = ?`).bind(requestId).run();
    return jsonResponse({ ok: true }, 200, origin, env.CORS_ORIGIN);
  }

  const userId = crypto.randomUUID();
  const now = new Date().toISOString();
  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO users (id, email, password_hash, salt, plan, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'pro', 'user', ?, ?)`
    ).bind(userId, reg.email, reg.password_hash, reg.salt, now, now),
    env.DB.prepare(`DELETE FROM registration_requests WHERE id = ?`).bind(requestId),
  ]);

  return jsonResponse({ ok: true }, 200, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// DELETE /api/admin/registrations/:id
// ---------------------------------------------------------------------------

async function handleRejectRegistration(
  request: Request,
  env: Env,
  requestId: string
): Promise<Response> {
  const origin = getOrigin(request);

  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) {
    const body = await authResult.text();
    return new Response(body, {
      status: authResult.status,
      headers: { "Content-Type": "application/json", ...corsHeadersFrom(authResult) },
    });
  }
  const adminError = requireAdmin(authResult);
  if (adminError) return adminError;

  await env.DB.prepare(`DELETE FROM registration_requests WHERE id = ?`).bind(requestId).run();

  return jsonResponse({ ok: true }, 200, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// ルーター
// ---------------------------------------------------------------------------

export async function handleAdmin(request: Request, env: Env, path: string): Promise<Response> {
  const method = request.method;
  const origin = getOrigin(request);

  if (path === "/api/admin/users" && method === "GET") {
    return handleListUsers(request, env);
  }

  const userIdMatch = path.match(/^\/api\/admin\/users\/([^/]+)$/);
  if (userIdMatch && userIdMatch[1] !== undefined && method === "PATCH") {
    return handleUpdateUser(request, env, userIdMatch[1]);
  }

  if (path === "/api/admin/registrations" && method === "GET") {
    return handleListRegistrations(request, env);
  }

  const approveMatch = path.match(/^\/api\/admin\/registrations\/([^/]+)\/approve$/);
  if (approveMatch && approveMatch[1] !== undefined && method === "POST") {
    return handleApproveRegistration(request, env, approveMatch[1]);
  }

  const rejectMatch = path.match(/^\/api\/admin\/registrations\/([^/]+)$/);
  if (rejectMatch && rejectMatch[1] !== undefined && method === "DELETE") {
    return handleRejectRegistration(request, env, rejectMatch[1]);
  }

  return jsonResponse({ error: "Not Found" }, 404, origin, env.CORS_ORIGIN);
}
