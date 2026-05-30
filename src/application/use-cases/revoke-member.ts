/**
 * グループメンバーをソフト失効する。
 *
 * - オーナーは任意のメンバーを失効できる。
 * - メンバー本人は自分自身を退会できる（ただしオーナーは不可）。
 * - サーバー側で group_memberships・group_member_keys・family_seats を削除する。
 *   削除後は group 同期 API が 403 を返し、新しいグループデータにアクセスできなくなる。
 */
import type { GroupSyncRepository } from "@application/ports/group-sync-repository";

export async function revokeMember(
  groupId: string,
  targetUserId: string,
  groupSyncRepository: GroupSyncRepository
): Promise<void> {
  await groupSyncRepository.revokeGroupMember(groupId, targetUserId);
}
