export interface CryptoService {
  deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey>;
  encrypt(key: CryptoKey, plaintext: string): Promise<{ ciphertext: string; iv: string }>;
  decrypt(key: CryptoKey, ciphertext: string, iv: string): Promise<string>;
  /** IVを先頭12bytesに埋め込んで暗号化する */
  encryptBinary(key: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer>;
  /** 先頭12bytesをIVとして使用して復号する */
  decryptBinary(key: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer>;
  generateSalt(): Uint8Array;
}
