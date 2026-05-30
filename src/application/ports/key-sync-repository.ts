/**
 * 公開鍵同期リポジトリのポート
 *
 * サーバー（Cloudflare Workers）との公開鍵・秘密鍵バックアップのやり取りを抽象化する。
 */
export interface KeySyncRepository {
  /**
   * 公開鍵 + 暗号化済み秘密鍵バックアップをサーバーに登録する。
   * 既存の場合は上書き（UPSERT）。
   */
  publishPublicKey(data: {
    publicKey: string;
    fingerprint: string;
    wrappedPrivateKey: string;
    wrappedPrivateKeyIv: string;
  }): Promise<void>;

  /** 指定ユーザーの公開鍵とフィンガープリントを取得する */
  fetchPublicKey(userId: string): Promise<{ publicKey: string; fingerprint: string } | null>;

  /** 自分の暗号化済み秘密鍵バックアップを取得する */
  fetchPrivateKeyBackup(): Promise<{
    wrappedPrivateKey: string;
    wrappedPrivateKeyIv: string;
  } | null>;
}
