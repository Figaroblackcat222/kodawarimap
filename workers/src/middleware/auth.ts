/**
 * JWT 認証ミドルウェア
 */
import type { Env } from "../types";
import { verifyJwt } from "../lib/jwt";

export type AuthResult = { userId: string } | Response;

/**
 * Authorization: Bearer <token> ヘッダーを検証する。
 * 成功時は { userId } を返し、失敗時は 401 Response を返す。
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

  return { userId: sub };
}
