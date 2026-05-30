/**
 * グループメンバー認証ミドルウェア
 */
import type { Env } from "../types";
import { requireAuth, requirePro, type AuthSuccess } from "./auth";

export type GroupAuthSuccess = AuthSuccess & { groupId: string; groupRole: string };
export type GroupAuthResult = GroupAuthSuccess | Response;

/**
 * requireAuth + requirePro + アクティブなグループメンバーシップ確認。
 * 通過すれば { ...auth, groupId, groupRole } を返す。
 */
export async function requireGroupMember(
  request: Request,
  env: Env,
  groupId: string
): Promise<GroupAuthResult> {
  const auth = await requireAuth(request, env);
  if (auth instanceof Response) return auth;

  const proErr = requirePro(auth);
  if (proErr) return proErr;

  const membership = await env.DB.prepare(
    `SELECT role FROM group_memberships
     WHERE group_id = ? AND user_id = ? AND status = 'active'`
  )
    .bind(groupId, auth.userId)
    .first<{ role: string }>();

  if (!membership) {
    return new Response(JSON.stringify({ error: "not_a_member" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  return { ...auth, groupId, groupRole: membership.role };
}
