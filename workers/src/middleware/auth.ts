/**
 * JWT 認証ミドルウェア
 */
import type { Env } from "../types";
import { verifyJwt } from "../lib/jwt";

export type UserPlan = "free" | "pro";
export type UserRole = "user" | "admin";

export type AuthSuccess = { userId: string; plan: UserPlan; role: UserRole };
export type AuthResult = AuthSuccess | Response;

function forbidden(message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 403,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Authorization: Bearer <token> ヘッダーを検証し、DBから plan / role を取得して返す。
 * 成功時は { userId, plan, role } を返し、失敗時は 401 Response を返す。
 */
export async function requireAuth(request: Request, env: Env): Promise<AuthResult> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = authHeader.slice(7).trim();
  const payload = await verifyJwt(token, env.JWT_SECRET);

  if (!payload) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const sub = payload["sub"];
  if (typeof sub !== "string") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // DBから最新の plan / role を取得（JWT発行後のプラン変更にも即時対応）
  const user = await env.DB.prepare("SELECT plan, role FROM users WHERE id = ?")
    .bind(sub)
    .first<{ plan: string; role: string }>();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return {
    userId: sub,
    plan: (user.plan as UserPlan) ?? "free",
    role: (user.role as UserRole) ?? "user",
  };
}

/**
 * plan が 'pro' でなければ 403 を返す。
 * requireAuth の結果を受け取って使う。
 */
export function requirePro(auth: AuthSuccess): Response | null {
  if (auth.plan !== "pro") {
    return forbidden("pro_required");
  }
  return null;
}

/**
 * role が 'admin' でなければ 403 を返す。
 * requireAuth の結果を受け取って使う。
 */
export function requireAdmin(auth: AuthSuccess): Response | null {
  if (auth.role !== "admin") {
    return forbidden("admin_required");
  }
  return null;
}
