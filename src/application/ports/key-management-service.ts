/**
 * 非対称鍵管理サービスのポート
 *
 * RSA-OAEP 2048 鍵ペアの生成・エクスポート・ラッピングを担当。
 * グループ鍵の生成・ラッピングは Phase 1 で追加。
 */
export interface KeyManagementService {
  /** RSA-OAEP 2048 鍵ペアを生成する */
  generateUserKeypair(): Promise<{ publicKey: CryptoKey; privateKey: CryptoKey }>;

  /** 公開鍵を SPKI base64 形式でエクスポートする */
  exportPublicKey(publicKey: CryptoKey): Promise<string>;

  /** SPKI base64 から公開鍵を復元する */
  importPublicKey(spki: string): Promise<CryptoKey>;

  /** 公開鍵の SHA-256 フィンガープリントを "AB:CD:EF:..." 形式で返す */
  computeFingerprint(publicKey: CryptoKey): Promise<string>;

  /**
   * 秘密鍵を個人 AES-GCM 鍵で暗号化してサーバーバックアップ用に変換する。
   * PKCS8 をエクスポートして AES-GCM で暗号化する。サーバーは復号不可。
   */
  wrapPrivateKeyForBackup(
    privateKey: CryptoKey,
    aesKey: CryptoKey
  ): Promise<{ wrappedKey: string; iv: string }>;

  /**
   * サーバーバックアップから秘密鍵を復元する。
   * AES-GCM 復号後に PKCS8 として再インポート。
   */
  unwrapPrivateKeyBackup(wrappedKey: string, iv: string, aesKey: CryptoKey): Promise<CryptoKey>;

  // ── Phase 1: グループ鍵 ──────────────────────────────────────────────────

  /** グループ用 AES-256-GCM 鍵を生成する（extractable=true で wrap 可能） */
  generateGroupKey(): Promise<CryptoKey>;

  /**
   * グループ鍵をメンバーの RSA-OAEP 公開鍵でラップする。
   * memberPublicKeySpki: SPKI base64 文字列
   */
  wrapGroupKeyForMember(groupKey: CryptoKey, memberPublicKeySpki: string): Promise<string>;

  /**
   * 自分の RSA-OAEP 秘密鍵でラップされたグループ鍵を復元する。
   * wrapped: base64 文字列
   */
  unwrapGroupKey(wrapped: string, privateKey: CryptoKey): Promise<CryptoKey>;

  // ── Phase 4: グループ写真バイナリ暗号化 ────────────────────────────────────

  /**
   * グループ鍵でバイナリデータを暗号化する。
   * IV（12バイト）を先頭に埋め込んだ ArrayBuffer を返す（web-crypto-service の encryptBinary と同形式）。
   */
  encryptBinaryWithGroupKey(groupKey: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer>;

  /**
   * グループ鍵で暗号化バイナリを復号する。
   * 先頭12バイトを IV として使用する。
   */
  decryptBinaryWithGroupKey(groupKey: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer>;

  /**
   * グループ鍵で任意の文字列を暗号化する（グループ名の暗号化に使用）。
   */
  encryptWithGroupKey(
    groupKey: CryptoKey,
    plaintext: string
  ): Promise<{ ciphertext: string; iv: string }>;

  /**
   * グループ鍵で暗号文を復号する。
   */
  decryptWithGroupKey(groupKey: CryptoKey, ciphertext: string, iv: string): Promise<string>;
}
