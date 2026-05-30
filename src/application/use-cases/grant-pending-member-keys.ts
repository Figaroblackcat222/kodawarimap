/**
 * pending_key 状態のメンバーにグループ鍵を付与する。
 *
 * 既存メンバーの同期時に実行される。
 * 各 pending メンバーの公開鍵でグループ鍵を wrap してサーバーに送信。
 */
import type { KeyManagementService } from "@application/ports/key-management-service";
import type { GroupSyncRepository } from "@application/ports/group-sync-repository";

export async function grantPendingMemberKeys(
  groupId: string,
  groupKey: CryptoKey,
  keyManagementService: KeyManagementService,
  groupSyncRepository: GroupSyncRepository
): Promise<number> {
  const pending = await groupSyncRepository.listPendingKeys(groupId);
  if (pending.length === 0) return 0;

  let granted = 0;
  for (const member of pending) {
    try {
      const wrapped = await keyManagementService.wrapGroupKeyForMember(groupKey, member.publicKey);
      await groupSyncRepository.grantMemberKey(groupId, member.userId, wrapped);
      granted++;
    } catch (e) {
      console.warn(`[grant-pending-member-keys] failed for ${member.userId}:`, e);
    }
  }
  return granted;
}
