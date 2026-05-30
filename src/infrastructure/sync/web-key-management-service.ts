/**
 * KeyManagementService の WebCrypto API 実装
 *
 * RSA-OAEP 2048 鍵ペア生成・エクスポート・フィンガープリント計算・
 * 秘密鍵バックアップ暗号化/復号を担当する。
 *
 * 設計上の注意:
 * - 秘密鍵バックアップは「PKCS8 を AES-GCM で暗号化」する方式を採用。
 *   wrapKey/unwrapKey API ではなく encrypt/decrypt を使うため、
 *   個人 AES 鍵（usages: ["encrypt","decrypt"]）をそのまま流用できる。
 * - グループ鍵の wrap/unwrap (Phase 1) では RSA-OAEP の wrapKey/unwrapKey を使う。
 *   そのため秘密鍵の usages は ["unwrapKey"] を含む。
 */
import type { KeyManagementService } from "@application/ports/key-management-service";
import { formatFingerprint } from "@domain/value-objects/key-fingerprint";

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

export const webKeyManagementService: KeyManagementService = {
  async generateUserKeypair() {
    const keypair = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["wrapKey", "unwrapKey"]
    );
    return { publicKey: keypair.publicKey, privateKey: keypair.privateKey };
  },

  async exportPublicKey(publicKey: CryptoKey): Promise<string> {
    const spki = await crypto.subtle.exportKey("spki", publicKey);
    return base64Encode(spki);
  },

  async importPublicKey(spki: string): Promise<CryptoKey> {
    const keyData = base64Decode(spki);
    return crypto.subtle.importKey("spki", keyData, { name: "RSA-OAEP", hash: "SHA-256" }, true, [
      "wrapKey",
    ]);
  },

  async computeFingerprint(publicKey: CryptoKey): Promise<string> {
    const spki = await crypto.subtle.exportKey("spki", publicKey);
    const digest = await crypto.subtle.digest("SHA-256", spki);
    return formatFingerprint(new Uint8Array(digest));
  },

  async wrapPrivateKeyForBackup(
    privateKey: CryptoKey,
    aesKey: CryptoKey
  ): Promise<{ wrappedKey: string; iv: string }> {
    // PKCS8 にエクスポートして AES-GCM で暗号化する
    const pkcs8 = await crypto.subtle.exportKey("pkcs8", privateKey);
    const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
    const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, aesKey, pkcs8);
    return {
      wrappedKey: base64Encode(encrypted),
      iv: base64Encode(iv.buffer),
    };
  },

  async unwrapPrivateKeyBackup(
    wrappedKey: string,
    iv: string,
    aesKey: CryptoKey
  ): Promise<CryptoKey> {
    const ciphertext = base64Decode(wrappedKey);
    const ivBuf = base64Decode(iv);
    // AES-GCM 復号して PKCS8 バイトを取得
    const pkcs8 = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(ivBuf) },
      aesKey,
      ciphertext
    );
    // PKCS8 を RSA-OAEP 秘密鍵として再インポート
    return crypto.subtle.importKey("pkcs8", pkcs8, { name: "RSA-OAEP", hash: "SHA-256" }, true, [
      "unwrapKey",
    ]);
  },

  async generateGroupKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
      "encrypt",
      "decrypt",
    ]);
  },

  async wrapGroupKeyForMember(groupKey: CryptoKey, memberPublicKeySpki: string): Promise<string> {
    const publicKey = await crypto.subtle.importKey(
      "spki",
      base64Decode(memberPublicKeySpki),
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["wrapKey"]
    );
    const wrapped = await crypto.subtle.wrapKey("raw", groupKey, publicKey, "RSA-OAEP");
    return base64Encode(wrapped);
  },

  async unwrapGroupKey(wrapped: string, privateKey: CryptoKey): Promise<CryptoKey> {
    return crypto.subtle.unwrapKey(
      "raw",
      base64Decode(wrapped),
      privateKey,
      "RSA-OAEP",
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  },

  async encryptBinaryWithGroupKey(groupKey: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer> {
    const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
    const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, groupKey, data);
    const result = new Uint8Array(IV_BYTES + encrypted.byteLength);
    result.set(iv, 0);
    result.set(new Uint8Array(encrypted), IV_BYTES);
    return result.buffer;
  },

  async decryptBinaryWithGroupKey(groupKey: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer> {
    const bytes = new Uint8Array(data);
    const iv = bytes.slice(0, IV_BYTES);
    const ciphertext = bytes.slice(IV_BYTES);
    return crypto.subtle.decrypt({ name: "AES-GCM", iv }, groupKey, ciphertext);
  },

  async encryptWithGroupKey(
    groupKey: CryptoKey,
    plaintext: string
  ): Promise<{ ciphertext: string; iv: string }> {
    const enc = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
    const buf = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      groupKey,
      enc.encode(plaintext)
    );
    return { ciphertext: base64Encode(buf), iv: base64Encode(iv.buffer) };
  },

  async decryptWithGroupKey(groupKey: CryptoKey, ciphertext: string, iv: string): Promise<string> {
    const dec = new TextDecoder();
    const buf = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(base64Decode(iv)) },
      groupKey,
      base64Decode(ciphertext)
    );
    return dec.decode(buf);
  },
};
