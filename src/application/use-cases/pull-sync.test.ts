import { describe, it, expect, vi, beforeEach } from "vitest";
import { pullSync } from "./pull-sync";
import type { SyncRepository, PinSyncRecord } from "@application/ports/sync-repository";
import type { PinRepository } from "@application/ports/pin-repository";
import type { CryptoService } from "@application/ports/crypto-service";
import type { Pin } from "@domain/entities/pin";
import { createHlc } from "@domain/value-objects/hlc";

// ---------------------------------------------------------------------------
// モック作成ヘルパー
// ---------------------------------------------------------------------------

function createMockPin(overrides: Partial<Pin> = {}): Pin {
  const hlc = createHlc("node-local");
  return {
    id: "pin-1",
    coordinates: { lng: 139.7, lat: 35.7 },
    title: "テストピン",
    hlc,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    ...overrides,
  };
}

function createMockSyncRecord(overrides: Partial<PinSyncRecord> = {}): PinSyncRecord {
  return {
    id: "pin-1",
    encryptedPayload: "encrypted-data",
    iv: "base64-iv",
    hlcPhysical: Date.now() + 1000,
    hlcLogical: 0,
    hlcNodeId: "node-remote",
    isDeleted: false,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function createMockPinRepository(pins: Pin[] = [], deletedPins: Pin[] = []): PinRepository {
  return {
    save: vi.fn().mockResolvedValue(undefined),
    findAll: vi.fn().mockResolvedValue(pins),
    findDeleted: vi.fn().mockResolvedValue(deletedPins),
    softDelete: vi.fn().mockResolvedValue(undefined),
    restore: vi.fn().mockResolvedValue(undefined),
    hardDelete: vi.fn().mockResolvedValue(undefined),
    purgeExpired: vi.fn().mockResolvedValue(undefined),
    findModifiedSince: vi.fn().mockResolvedValue([]),
  };
}

function createMockSyncRepository(records: PinSyncRecord[] = []): SyncRepository {
  return {
    register: vi.fn().mockResolvedValue(undefined),
    requestRegistration: vi.fn().mockResolvedValue(undefined),
    login: vi.fn().mockResolvedValue({ accessToken: "at", refreshToken: "rt", salt: "salt" }),
    refreshToken: vi.fn().mockResolvedValue({ accessToken: "at2", refreshToken: "rt2" }),
    logout: vi.fn().mockResolvedValue(undefined),
    fetchPinsSince: vi.fn().mockResolvedValue(records),
    pushPin: vi.fn().mockResolvedValue({ serverHlcPhysical: 1000, serverHlcLogical: 0 }),
    fetchPhotoList: vi.fn().mockRejectedValue(new Error("Not implemented")),
    pushPhotoBinary: vi.fn().mockRejectedValue(new Error("Not implemented")),
    fetchPhotoBinary: vi.fn().mockRejectedValue(new Error("Not implemented")),
    deletePhoto: vi.fn().mockRejectedValue(new Error("Not implemented")),
    beginPasskeyRegistration: vi.fn().mockRejectedValue(new Error("Not implemented")),
    completePasskeyRegistration: vi.fn().mockRejectedValue(new Error("Not implemented")),
    verifyPasskeyAuth: vi.fn().mockRejectedValue(new Error("Not implemented")),
    listPasskeyCredentials: vi.fn().mockResolvedValue([]),
    deletePasskeyCredential: vi.fn().mockResolvedValue(undefined),
  };
}

/** CryptoService のモック（実際の暗号化は行わずプレーンテキストを返す） */
function createMockCryptoService(): CryptoService {
  const storedPayloads = new Map<string, string>();

  return {
    deriveKey: vi.fn().mockResolvedValue({} as CryptoKey),
    encrypt: vi.fn().mockImplementation(async (_key, plaintext: string) => {
      const id = crypto.randomUUID();
      storedPayloads.set(id, plaintext);
      return { ciphertext: id, iv: "mock-iv" };
    }),
    decrypt: vi.fn().mockImplementation(async (_key, ciphertext: string, _iv) => {
      const result = storedPayloads.get(ciphertext);
      if (result !== undefined) return result;
      // テスト用: ciphertext が JSON 文字列ならそのまま返す
      return ciphertext;
    }),
    encryptBinary: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
    decryptBinary: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
    generateSalt: vi.fn().mockReturnValue(new Uint8Array(32)),
  };
}

// ---------------------------------------------------------------------------
// テスト本体
// ---------------------------------------------------------------------------

describe("pullSync", () => {
  const mockKey = {} as CryptoKey;
  const since = { physical: 0, logical: 0 };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("サーバーにレコードがない場合はマージ件数 0 を返す", async () => {
    const syncRepo = createMockSyncRepository([]);
    const pinRepo = createMockPinRepository();
    const cryptoService = createMockCryptoService();

    const result = await pullSync(syncRepo, pinRepo, cryptoService, mockKey, since);

    expect(result.mergedCount).toBe(0);
    expect(result.lastHlc).toEqual(since);
    expect(pinRepo.save).not.toHaveBeenCalled();
  });

  it("新規リモート Pin を IndexedDB に upsert する", async () => {
    const remoteHlcPhysical = Date.now() + 5000;
    const pinPayload = JSON.stringify({
      schemaVersion: 1,
      data: {
        id: "pin-new",
        coordinates: { lng: 135.0, lat: 34.0 },
        title: "新規ピン",
        hlc: { physical: remoteHlcPhysical, logical: 0, nodeId: "node-remote" },
        createdAt: new Date().toISOString(),
      },
    });

    const record = createMockSyncRecord({
      id: "pin-new",
      encryptedPayload: pinPayload,
      iv: "mock-iv",
      hlcPhysical: remoteHlcPhysical,
      hlcLogical: 0,
      hlcNodeId: "node-remote",
    });

    const syncRepo = createMockSyncRepository([record]);
    const pinRepo = createMockPinRepository([]);
    const cryptoService = createMockCryptoService();
    // decrypt はペイロードをそのまま返すよう設定
    vi.mocked(cryptoService.decrypt).mockResolvedValue(pinPayload);

    const result = await pullSync(syncRepo, pinRepo, cryptoService, mockKey, since);

    expect(result.mergedCount).toBe(1);
    expect(pinRepo.save).toHaveBeenCalledOnce();
    expect(pinRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "pin-new",
        title: "新規ピン",
        coordinates: { lng: 135.0, lat: 34.0 },
      })
    );
  });

  it("ローカルが新しい場合はスキップする（LWW）", async () => {
    const futureTime = Date.now() + 10000;
    const localPin = createMockPin({
      id: "pin-conflict",
      hlc: { physical: futureTime, logical: 5, nodeId: "node-local" },
    });

    const remotePayload = JSON.stringify({
      schemaVersion: 1,
      data: {
        id: "pin-conflict",
        coordinates: { lng: 0, lat: 0 },
        title: "古いリモートピン",
        hlc: { physical: futureTime - 1000, logical: 0, nodeId: "node-remote" },
        createdAt: new Date().toISOString(),
      },
    });

    const record = createMockSyncRecord({
      id: "pin-conflict",
      encryptedPayload: remotePayload,
      iv: "mock-iv",
      hlcPhysical: futureTime - 1000,
      hlcLogical: 0,
      hlcNodeId: "node-remote",
    });

    const syncRepo = createMockSyncRepository([record]);
    const pinRepo = createMockPinRepository([localPin]);
    const cryptoService = createMockCryptoService();
    vi.mocked(cryptoService.decrypt).mockResolvedValue(remotePayload);

    const result = await pullSync(syncRepo, pinRepo, cryptoService, mockKey, since);

    // ローカルが新しいためスキップ
    expect(result.mergedCount).toBe(0);
    expect(pinRepo.save).not.toHaveBeenCalled();
  });

  it("復号失敗のレコードはスキップする", async () => {
    const record = createMockSyncRecord({
      id: "pin-bad",
      encryptedPayload: "corrupted-data",
      iv: "mock-iv",
      hlcPhysical: Date.now() + 3000,
    });

    const syncRepo = createMockSyncRepository([record]);
    const pinRepo = createMockPinRepository([]);
    const cryptoService = createMockCryptoService();
    vi.mocked(cryptoService.decrypt).mockRejectedValue(new Error("Decryption failed"));

    const result = await pullSync(syncRepo, pinRepo, cryptoService, mockKey, since);

    expect(result.mergedCount).toBe(0);
    expect(pinRepo.save).not.toHaveBeenCalled();
  });

  it("削除済み(isDeleted=true)のリモート Pin も upsert する", async () => {
    const deletedAt = new Date().toISOString();
    const remotePayload = JSON.stringify({
      schemaVersion: 1,
      data: {
        id: "pin-deleted",
        coordinates: { lng: 0, lat: 0 },
        title: "削除済みピン",
        hlc: { physical: Date.now() + 2000, logical: 0, nodeId: "node-remote" },
        createdAt: new Date().toISOString(),
        deletedAt,
      },
    });

    const record = createMockSyncRecord({
      id: "pin-deleted",
      encryptedPayload: remotePayload,
      iv: "mock-iv",
      hlcPhysical: Date.now() + 2000,
      hlcLogical: 0,
      hlcNodeId: "node-remote",
      isDeleted: true,
    });

    const syncRepo = createMockSyncRepository([record]);
    const pinRepo = createMockPinRepository([]);
    const cryptoService = createMockCryptoService();
    vi.mocked(cryptoService.decrypt).mockResolvedValue(remotePayload);

    const result = await pullSync(syncRepo, pinRepo, cryptoService, mockKey, since);

    expect(result.mergedCount).toBe(1);
    expect(pinRepo.save).toHaveBeenCalledWith(expect.objectContaining({ id: "pin-deleted" }));
  });

  it("lastHlc は最も新しいレコードの HLC を返す", async () => {
    const payloads = [
      { physical: 1000, logical: 0 },
      { physical: 2000, logical: 5 },
      { physical: 1500, logical: 3 },
    ];

    const records = payloads.map(({ physical, logical }, i) => {
      const data = JSON.stringify({
        schemaVersion: 1,
        data: {
          id: `pin-${i}`,
          coordinates: { lng: 0, lat: 0 },
          title: `ピン${i}`,
          hlc: { physical, logical, nodeId: "node-remote" },
          createdAt: new Date().toISOString(),
        },
      });
      return createMockSyncRecord({
        id: `pin-${i}`,
        encryptedPayload: data,
        iv: "mock-iv",
        hlcPhysical: physical,
        hlcLogical: logical,
        hlcNodeId: "node-remote",
      });
    });

    const syncRepo = createMockSyncRepository(records);
    const pinRepo = createMockPinRepository([]);
    const cryptoService = createMockCryptoService();
    vi.mocked(cryptoService.decrypt).mockImplementation(async (_key, ciphertext) => ciphertext);

    const result = await pullSync(syncRepo, pinRepo, cryptoService, mockKey, since);

    expect(result.mergedCount).toBe(3);
    expect(result.lastHlc).toEqual({ physical: 2000, logical: 5 });
  });
});
