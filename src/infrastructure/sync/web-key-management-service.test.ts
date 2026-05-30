/**
 * WebKeyManagementService のユニットテスト
 *
 * Node.js の WebCrypto（globalThis.crypto）を使用。ブラウザ API 不要。
 * Phase 0 DoD:
 *   - 鍵ペア生成 → 公開鍵エクスポート → インポート往復
 *   - 秘密鍵バックアップ wrap/unwrap 往復
 *   - 誤った AES 鍵での unwrap 失敗
 *   - フィンガープリントの決定性
 */
import { describe, it, expect } from "vitest";
import { webKeyManagementService } from "./web-key-management-service";

// テスト用の個人 AES-GCM 鍵を生成するヘルパー
async function makeAesKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

describe("webKeyManagementService", () => {
  describe("generateUserKeypair", () => {
    it("RSA-OAEP 2048 鍵ペアを生成できる", async () => {
      const { publicKey, privateKey } = await webKeyManagementService.generateUserKeypair();
      expect(publicKey.type).toBe("public");
      expect(privateKey.type).toBe("private");
      expect(publicKey.algorithm).toMatchObject({ name: "RSA-OAEP" });
    });
  });

  describe("exportPublicKey / importPublicKey", () => {
    it("SPKI base64 への往復エクスポート/インポートができる", async () => {
      const { publicKey } = await webKeyManagementService.generateUserKeypair();
      const spki = await webKeyManagementService.exportPublicKey(publicKey);
      expect(typeof spki).toBe("string");
      expect(spki.length).toBeGreaterThan(0);

      const imported = await webKeyManagementService.importPublicKey(spki);
      expect(imported.type).toBe("public");
      // 再エクスポートして一致確認
      const spki2 = await webKeyManagementService.exportPublicKey(imported);
      expect(spki2).toBe(spki);
    });
  });

  describe("computeFingerprint", () => {
    it("同じ公開鍵から常に同じフィンガープリントを返す（決定性）", async () => {
      const { publicKey } = await webKeyManagementService.generateUserKeypair();
      const fp1 = await webKeyManagementService.computeFingerprint(publicKey);
      const fp2 = await webKeyManagementService.computeFingerprint(publicKey);
      expect(fp1).toBe(fp2);
    });

    it("フィンガープリントは 'AB:CD:...' 形式（コロン区切り大文字16進）", async () => {
      const { publicKey } = await webKeyManagementService.generateUserKeypair();
      const fp = await webKeyManagementService.computeFingerprint(publicKey);
      expect(fp).toMatch(/^[0-9A-F]{2}(:[0-9A-F]{2}){11}$/);
    });

    it("異なる鍵ペアはほぼ確実に異なるフィンガープリントを持つ", async () => {
      const { publicKey: pk1 } = await webKeyManagementService.generateUserKeypair();
      const { publicKey: pk2 } = await webKeyManagementService.generateUserKeypair();
      const fp1 = await webKeyManagementService.computeFingerprint(pk1);
      const fp2 = await webKeyManagementService.computeFingerprint(pk2);
      expect(fp1).not.toBe(fp2);
    });
  });

  describe("wrapPrivateKeyForBackup / unwrapPrivateKeyBackup", () => {
    it("wrap → unwrap の往復で同じ秘密鍵を復元できる", async () => {
      const { publicKey, privateKey } = await webKeyManagementService.generateUserKeypair();
      const aesKey = await makeAesKey();

      const { wrappedKey, iv } = await webKeyManagementService.wrapPrivateKeyForBackup(
        privateKey,
        aesKey
      );
      expect(typeof wrappedKey).toBe("string");
      expect(typeof iv).toBe("string");

      const recovered = await webKeyManagementService.unwrapPrivateKeyBackup(
        wrappedKey,
        iv,
        aesKey
      );
      expect(recovered.type).toBe("private");

      // 復元した秘密鍵で公開鍵をラップできることを確認（Phase 1 相当の検証）
      const dummyGroupKey = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );
      const wrapped = await crypto.subtle.wrapKey("raw", dummyGroupKey, publicKey, "RSA-OAEP");
      const unwrapped = await crypto.subtle.unwrapKey(
        "raw",
        wrapped,
        recovered,
        "RSA-OAEP",
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );
      expect(unwrapped.type).toBe("secret");
    });

    it("誤った AES 鍵では unwrap が失敗する", async () => {
      const { privateKey } = await webKeyManagementService.generateUserKeypair();
      const correctKey = await makeAesKey();
      const wrongKey = await makeAesKey();

      const { wrappedKey, iv } = await webKeyManagementService.wrapPrivateKeyForBackup(
        privateKey,
        correctKey
      );

      await expect(
        webKeyManagementService.unwrapPrivateKeyBackup(wrappedKey, iv, wrongKey)
      ).rejects.toThrow();
    });

    it("IV が異なると unwrap が失敗する", async () => {
      const { privateKey } = await webKeyManagementService.generateUserKeypair();
      const aesKey = await makeAesKey();

      const { wrappedKey } = await webKeyManagementService.wrapPrivateKeyForBackup(
        privateKey,
        aesKey
      );
      // 別の wrap で生成した IV を流用（不一致 IV）
      const { iv: wrongIv } = await webKeyManagementService.wrapPrivateKeyForBackup(
        privateKey,
        aesKey
      );

      await expect(
        webKeyManagementService.unwrapPrivateKeyBackup(wrappedKey, wrongIv, aesKey)
      ).rejects.toThrow();
    });
  });
});
