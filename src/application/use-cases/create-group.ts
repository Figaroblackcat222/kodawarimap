/**
 * 家族グループを作成する。
 *
 * - AES-256-GCM グループ鍵を生成
 * - グループ名をグループ鍵で暗号化（サーバー復号不可）
 * - 自分の公開鍵でグループ鍵を wrap してサーバーに送信
 * - グループ鍵を IndexedDB key_store に保存
 */
import type { KeyManagementService } from "@application/ports/key-management-service";
import type { KeySyncRepository } from "@application/ports/key-sync-repository";
import type { GroupSyncRepository } from "@application/ports/group-sync-repository";

export interface CreateGroupDeps {
  keyManagementService: KeyManagementService;
  keySyncRepository: KeySyncRepository;
  groupSyncRepository: GroupSyncRepository;
  getPrivateKey: () => Promise<CryptoKey | null>;
  saveGroupKey: (groupId: string, key: CryptoKey) => Promise<void>;
}

export async function createGroup(
  groupName: string,
  deps: CreateGroupDeps
): Promise<{ groupId: string }> {
  const {
    keyManagementService,
    keySyncRepository,
    groupSyncRepository,
    getPrivateKey,
    saveGroupKey,
  } = deps;

  const privateKey = await getPrivateKey();
  if (!privateKey) throw new Error("秘密鍵が見つかりません。鍵ペアを先に生成してください。");

  // 自分の公開鍵を取得
  const myPublicKeyData = await keySyncRepository.fetchPublicKey("me");
  if (!myPublicKeyData) throw new Error("公開鍵が登録されていません。");

  // グループ鍵生成
  const groupKey = await keyManagementService.generateGroupKey();

  // グループ名を暗号化
  const { ciphertext: encryptedName, iv: nameIv } = await keyManagementService.encryptWithGroupKey(
    groupKey,
    groupName
  );

  // 自分の公開鍵でグループ鍵を wrap
  const wrappedGroupKey = await keyManagementService.wrapGroupKeyForMember(
    groupKey,
    myPublicKeyData.publicKey
  );

  // サーバーに送信
  const { groupId } = await groupSyncRepository.createGroup({
    encryptedName,
    nameIv,
    wrappedGroupKey,
  });

  // グループ鍵をローカルに保存
  await saveGroupKey(groupId, groupKey);

  return { groupId };
}
