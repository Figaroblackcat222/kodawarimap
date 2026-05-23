/**
 * Web Crypto API による暗号化サービス実装
 * PBKDF2 + AES-256-GCM
 */
import type { CryptoService } from "@application/ports/crypto-service";

const PBKDF2_ITERATIONS = 600_000;
const PBKDF2_HASH = "SHA-256";
const KEY_LENGTH_BITS = 256;
const IV_BYTES = 12;

function base64Encode(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64Decode(str: string): ArrayBuffer {
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export const webCryptoService: CryptoService = {
  /**
   * PBKDF2 でパスフレーズとソルトから AES-256-GCM 用の CryptoKey を導出する。
   * 600,000 イテレーションは計算コストが高いため、呼び出し元は
   * Web Worker 経由での実行を検討すること。
   */
  async deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(passphrase),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: PBKDF2_ITERATIONS,
        hash: PBKDF2_HASH,
      },
      keyMaterial,
      { name: "AES-GCM", length: KEY_LENGTH_BITS },
      false,
      ["encrypt", "decrypt"]
    );
  },

  /**
   * AES-256-GCM で文字列を暗号化する。
   * IV はランダム 12 bytes を生成し base64 で返す。
   */
  async encrypt(key: CryptoKey, plaintext: string): Promise<{ ciphertext: string; iv: string }> {
    const enc = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));

    const ciphertextBuffer = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      enc.encode(plaintext)
    );

    return {
      ciphertext: base64Encode(ciphertextBuffer),
      iv: base64Encode(iv.buffer),
    };
  },

  /**
   * AES-256-GCM で復号する。
   */
  async decrypt(key: CryptoKey, ciphertext: string, iv: string): Promise<string> {
    const dec = new TextDecoder();
    const ciphertextBuffer = base64Decode(ciphertext);
    const ivBuffer = base64Decode(iv);

    const plaintextBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(ivBuffer) },
      key,
      ciphertextBuffer
    );

    return dec.decode(plaintextBuffer);
  },

  /**
   * バイナリデータを AES-256-GCM で暗号化する。
   * 先頭 12 bytes に IV を埋め込んだ ArrayBuffer を返す。
   */
  async encryptBinary(key: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer> {
    const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));

    const ciphertextBuffer = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);

    // [IV(12bytes) | ciphertext] を結合
    const result = new Uint8Array(IV_BYTES + ciphertextBuffer.byteLength);
    result.set(iv, 0);
    result.set(new Uint8Array(ciphertextBuffer), IV_BYTES);
    return result.buffer;
  },

  /**
   * 先頭 12 bytes を IV として使用して復号する。
   */
  async decryptBinary(key: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer> {
    const bytes = new Uint8Array(data);
    const iv = bytes.slice(0, IV_BYTES);
    const ciphertext = bytes.slice(IV_BYTES);

    return crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  },

  /**
   * 32 bytes のランダムソルトを生成する。
   */
  generateSalt(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(32));
  },
};
