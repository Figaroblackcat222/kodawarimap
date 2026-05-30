/**
 * 新デバイスでサーバーから秘密鍵バックアップを復元する。
 *
 * 実行タイミング: ログイン成功後、IndexedDB に秘密鍵が見つからない場合。
 * パスフレーズが手元にあるうちに（encryptionKey が導出済みの状態で）呼ぶ。
 *
 * 副作用:
 * - IndexedDB key_store に秘密鍵を保存（id: "group-private-key"）
 */
import type { KeyManagementService } from "@application/ports/key-management-service";
import type { KeySyncRepository } from "@application/ports/key-sync-repository";

export interface RecoverUserKeypairDeps {
  keyManagementService: KeyManagementService;
  keySyncRepository: KeySyncRepository;
  encryptionKey: CryptoKey;
  savePrivateKey: (key: CryptoKey) => Promise<void>;
  getPrivateKey: () => Promise<CryptoKey | null>;
}

/**
 * @returns `true` なら復元成功、`false` ならサーバーにバックアップが存在しない（鍵未登録ユーザー）
 */
export async function recoverUserKeypair(deps: RecoverUserKeypairDeps): Promise<boolean> {
  const { keyManagementService, keySyncRepository, encryptionKey, savePrivateKey, getPrivateKey } =
    deps;

  // 既にローカルに鍵があればスキップ
  const existing = await getPrivateKey();
  if (existing) return true;

  // サーバーからバックアップ取得
  const backup = await keySyncRepository.fetchPrivateKeyBackup();
  if (!backup) return false;

  // 個人鍵で復号して秘密鍵を復元
  const privateKey = await keyManagementService.unwrapPrivateKeyBackup(
    backup.wrappedPrivateKey,
    backup.wrappedPrivateKeyIv,
    encryptionKey
  );

  await savePrivateKey(privateKey);
  return true;
}
