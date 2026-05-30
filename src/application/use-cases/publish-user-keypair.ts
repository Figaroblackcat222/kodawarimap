/**
 * ユーザーの RSA-OAEP 鍵ペアを生成してサーバーに公開する。
 *
 * 実行タイミング: 初回ログイン成功後（パスフレーズが手元にあるうちに）。
 * 既に鍵ペアが IndexedDB に存在する場合はスキップする。
 *
 * 副作用:
 * - IndexedDB key_store に秘密鍵を保存（id: "group-private-key"）
 * - サーバーに公開鍵 + 暗号化済み秘密鍵バックアップをアップロード
 */
import type { KeyManagementService } from "@application/ports/key-management-service";
import type { KeySyncRepository } from "@application/ports/key-sync-repository";

export interface PublishUserKeypairDeps {
  keyManagementService: KeyManagementService;
  keySyncRepository: KeySyncRepository;
  /** 個人 AES-GCM 鍵（秘密鍵バックアップの暗号化に使う） */
  encryptionKey: CryptoKey;
  /** IndexedDB key_store アクセサ */
  savePrivateKey: (key: CryptoKey) => Promise<void>;
  /** 既存秘密鍵の有無を確認するアクセサ */
  getPrivateKey: () => Promise<CryptoKey | null>;
}

export async function publishUserKeypair(deps: PublishUserKeypairDeps): Promise<void> {
  const { keyManagementService, keySyncRepository, encryptionKey, savePrivateKey, getPrivateKey } =
    deps;

  // 既に鍵ペアがあればスキップ（冪等性）
  const existing = await getPrivateKey();
  if (existing) return;

  // 鍵ペア生成
  const { publicKey, privateKey } = await keyManagementService.generateUserKeypair();

  // 公開鍵の SPKI エクスポートとフィンガープリント計算
  const [spki, fingerprint] = await Promise.all([
    keyManagementService.exportPublicKey(publicKey),
    keyManagementService.computeFingerprint(publicKey),
  ]);

  // 秘密鍵を個人鍵で暗号化（サーバーバックアップ用）
  const { wrappedKey, iv } = await keyManagementService.wrapPrivateKeyForBackup(
    privateKey,
    encryptionKey
  );

  // IndexedDB に秘密鍵を保存（先にローカル保存して、サーバー失敗時もローカルは生き残る）
  await savePrivateKey(privateKey);

  // サーバーに公開鍵 + バックアップをアップロード
  await keySyncRepository.publishPublicKey({
    publicKey: spki,
    fingerprint,
    wrappedPrivateKey: wrappedKey,
    wrappedPrivateKeyIv: iv,
  });
}
