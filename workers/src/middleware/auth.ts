/**
 * JWT 認証ミドルウェア
 */
import type { Env } from "../types";
import { verifyJwt } from "../lib/jwt";

export type UserPlan = "free" | "pro" | "family";
export type UserRole = "user" | "admin";

export type AuthSuccess = {
  userId: string;
  plan: UserPlan;
  /** family_seats 付与を加味した実効プラン。requirePro はこちらで判定する */
  effectivePlan: "free" | "pro";
  role: UserRole;
};
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

  // DBから最新の plan / role を取得し、family_seats 付与を加味した実効プランを計算
  const user = await env.DB.prepare(
    `SELECT u.plan, u.role,
       EXISTS(SELECT 1 FROM family_seats WHERE member_user_id = u.id) AS has_seat
     FROM users u WHERE u.id = ?`
  )
    .bind(sub)
    .first<{ plan: string; role: string; has_seat: number }>();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const plan = (user.plan as UserPlan) ?? "free";
  // family オーナー or 席付与メンバー は実効プラン 'pro'
  const effectivePlan: "free" | "pro" =
    plan === "pro" || plan === "family" || user.has_seat === 1 ? "pro" : "free";

  return {
    userId: sub,
    plan,
    effectivePlan,
    role: (user.role as UserRole) ?? "user",
  };
}

/**
 * 実効プランが 'pro' 以上でなければ 403 を返す。
 * family オーナー・席付与メンバーも通過する。
 */
export function requirePro(auth: AuthSuccess): Response | null {
  if (auth.effectivePlan !== "pro") {
    return forbidden("pro_required");
  }
  return null;
}

/**
 * plan が 'family' でなければ 403 を返す。
 * グループ作成（スペース所有）に使用。
 */
export function requireFamilyOwner(auth: AuthSuccess): Response | null {
  if (auth.plan !== "family") {
    return forbidden("family_plan_required");
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
