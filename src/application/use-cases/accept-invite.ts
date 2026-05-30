/**
 * 招待トークンを承認する。
 *
 * 承認後は pending_key 状態になり、既存メンバーがオンラインになって
 * グループ鍵を付与するまで共有ピンは見られない（仕様）。
 */
import type { GroupSyncRepository } from "@application/ports/group-sync-repository";

export async function acceptInvite(
  token: string,
  groupSyncRepository: GroupSyncRepository
): Promise<{ groupId: string }> {
  return groupSyncRepository.acceptInvite(token);
}
