import { describe, it, expect, vi, beforeEach } from "vitest";
import { pushSync } from "./push-sync";
import type { SyncRepository, PinSyncRecord } from "@application/ports/sync-repository";
import type { PinRepository } from "@application/ports/pin-repository";
import type { PhotoRepository } from "@application/ports/photo-repository";
import type { CryptoService } from "@application/ports/crypto-service";
import type { SyncQueueRepository, SyncQueueItem } from "@application/ports/sync-queue-repository";
import type { Pin } from "@domain/entities/pin";
import type { Photo } from "@domain/entities/photo";
import { createHlc as _createHlc } from "@domain/value-objects/hlc";

// ---------------------------------------------------------------------------
// モック作成ヘルパー
// ---------------------------------------------------------------------------

function createMockPin(overrides: Partial<Pin> = {}): Pin {
  const hlc = { physical: Date.now() + 5000, logical: 0, nodeId: "node-local" };
  return {
    id: "pin-1",
    coordinates: { lng: 139.7, lat: 35.7 },
    title: "テストピン",
    hlc,
    createdAt: new Date("2025-01-01T00:00:00Z"),
    ...overrides,
  };
}

function createMockPinRepository(pins: Pin[] = [], deletedPins: Pin[] = []): PinRepository {
  const allPins = [...pins, ...deletedPins];
  return {
    save: vi.fn().mockResolvedValue(undefined),
    findAll: vi.fn().mockResolvedValue(pins),
    findDeleted: vi.fn().mockResolvedValue(deletedPins),
    softDelete: vi.fn().mockResolvedValue(undefined),
    restore: vi.fn().mockResolvedValue(undefined),
    hardDelete: vi.fn().mockResolvedValue(undefined),
    purgeExpired: vi.fn().mockResolvedValue(undefined),
    findModifiedSince: vi.fn().mockImplementation(async (physical: number, logical: number) => {
      return allPins.filter(
        (p) => p.hlc.physical > physical || (p.hlc.physical === physical && p.hlc.logical > logical)
      );
    }),
  };
}

function createMockSyncRepository(): SyncRepository {
  return {
    register: vi.fn().mockResolvedValue(undefined),
    requestRegistration: vi.fn().mockResolvedValue(undefined),
    login: vi.fn().mockResolvedValue({ accessToken: "at", refreshToken: "rt", salt: "salt" }),
    refreshToken: vi.fn().mockResolvedValue({ accessToken: "at2", refreshToken: "rt2" }),
    logout: vi.fn().mockResolvedValue(undefined),
    fetchPinsSince: vi.fn().mockResolvedValue([]),
    pushPin: vi.fn().mockResolvedValue({ serverHlcPhysical: Date.now(), serverHlcLogical: 0 }),
    fetchPhotoList: vi.fn().mockRejectedValue(new Error("Not implemented")),
    pushPhotoBinary: vi.fn().mockRejectedValue(new Error("Not implemented")),
    fetchPhotoBinary: vi.fn().mockRejectedValue(new Error("Not implemented")),
    deletePhoto: vi.fn().mockRejectedValue(new Error("Not implemented")),
    beginPasskeyRegistration: vi.fn().mockRejectedValue(new Error("Not implemented")),
    completePasskeyRegistration: vi.fn().mockRejectedValue(new Error("Not implemented")),
    verifyPasskeyAuth: vi.fn().mockRejectedValue(new Error("Not implemented")),
    listPasskeyCredentials: vi.fn().mockResolvedValue([]),
    deletePasskeyCredential: vi.fn().mockResolvedValue(undefined),
    getInviteInfo: vi.fn().mockResolvedValue({ email: "", isPendingSetup: false }),
    activateInvite: vi
      .fn()
      .mockResolvedValue({ accessToken: "", refreshToken: "", salt: "", plan: "free", role: "user" }),
  };
}

function createMockSyncQueueRepository(dueItems: SyncQueueItem[] = []): SyncQueueRepository {
  return {
    enqueue: vi.fn().mockResolvedValue(undefined),
    peekDue: vi.fn().mockResolvedValue(dueItems),
    markRetry: vi.fn().mockResolvedValue(undefined),
    remove: vi.fn().mockResolvedValue(undefined),
    coalesce: vi.fn().mockResolvedValue(undefined),
  };
}

function createMockCryptoService(): CryptoService {
  return {
    deriveKey: vi.fn().mockResolvedValue({} as CryptoKey),
    encrypt: vi.fn().mockImplementation(async (_key, plaintext: string) => ({
      ciphertext: `encrypted:${plaintext}`,
      iv: "mock-iv",
    })),
    decrypt: vi.fn().mockImplementation(async (_key, ciphertext: string) => {
      return ciphertext.replace(/^encrypted:/, "");
    }),
    encryptBinary: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
    decryptBinary: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
    generateSalt: vi.fn().mockReturnValue(new Uint8Array(32)),
  };
}

// ---------------------------------------------------------------------------
// テスト本体
// ---------------------------------------------------------------------------

describe("pushSync", () => {
  const mockKey = {} as CryptoKey;
  const since = { physical: 0, logical: 0 };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("変更済み Pin がない場合は pushedCount 0 を返す", async () => {
    const syncRepo = createMockSyncRepository();
    const pinRepo = createMockPinRepository([], []);
    const cryptoService = createMockCryptoService();
    const queueRepo = createMockSyncQueueRepository();

    const result = await pushSync(syncRepo, pinRepo, cryptoService, mockKey, queueRepo, since);

    expect(result.pushedCount).toBe(0);
    expect(syncRepo.pushPin).not.toHaveBeenCalled();
  });

  it("変更済み Pin を暗号化して pushPin を呼ぶ", async () => {
    const pin = createMockPin();
    const syncRepo = createMockSyncRepository();
    const pinRepo = createMockPinRepository([pin]);
    const cryptoService = createMockCryptoService();
    const queueRepo = createMockSyncQueueRepository();

    const result = await pushSync(syncRepo, pinRepo, cryptoService, mockKey, queueRepo, since);

    expect(result.pushedCount).toBe(1);
    expect(syncRepo.pushPin).toHaveBeenCalledOnce();

    const pushedRecord = vi.mocked(syncRepo.pushPin).mock.calls[0][0] as PinSyncRecord;
    expect(pushedRecord.id).toBe(pin.id);
    expect(pushedRecord.isDeleted).toBe(false);
    expect(pushedRecord.hlcPhysical).toBe(pin.hlc.physical);
    expect(pushedRecord.hlcNodeId).toBe(pin.hlc.nodeId);

    // ペイロードに schemaVersion が含まれている
    const payload = JSON.parse(pushedRecord.encryptedPayload.replace("encrypted:", ""));
    expect(payload.schemaVersion).toBe(1);
    expect(payload.data.id).toBe(pin.id);
  });

  it("softDelete 済み Pin は isDeleted=true で push する", async () => {
    const deletedPin = createMockPin({
      id: "pin-deleted",
      deletedAt: new Date(),
    });

    const syncRepo = createMockSyncRepository();
    const pinRepo = createMockPinRepository([], [deletedPin]);
    const cryptoService = createMockCryptoService();
    const queueRepo = createMockSyncQueueRepository();

    const result = await pushSync(syncRepo, pinRepo, cryptoService, mockKey, queueRepo, since);

    expect(result.pushedCount).toBe(1);
    const pushedRecord = vi.mocked(syncRepo.pushPin).mock.calls[0][0] as PinSyncRecord;
    expect(pushedRecord.isDeleted).toBe(true);
  });

  it("pushPin 失敗時は SyncQueue に enqueue する", async () => {
    const pin = createMockPin();
    const syncRepo = createMockSyncRepository();
    vi.mocked(syncRepo.pushPin).mockRejectedValue(new Error("Network error"));

    const pinRepo = createMockPinRepository([pin]);
    const cryptoService = createMockCryptoService();
    const queueRepo = createMockSyncQueueRepository();

    const result = await pushSync(syncRepo, pinRepo, cryptoService, mockKey, queueRepo, since);

    expect(result.pushedCount).toBe(0);
    expect(queueRepo.enqueue).toHaveBeenCalledOnce();
    expect(queueRepo.enqueue).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "pin",
        recordId: pin.id,
        operation: "put",
      })
    );
  });

  it("SyncQueue の due items をリトライ処理する", async () => {
    const pin = createMockPin({ id: "pin-retry" });

    const dueItem: SyncQueueItem = {
      id: "queue-1",
      type: "pin",
      recordId: "pin-retry",
      operation: "put",
      retries: 1,
      nextAttemptAt: Date.now() - 1000,
      createdAt: new Date(),
    };

    const syncRepo = createMockSyncRepository();
    const pinRepo = createMockPinRepository([pin]);
    const cryptoService = createMockCryptoService();
    const queueRepo = createMockSyncQueueRepository([dueItem]);

    await pushSync(syncRepo, pinRepo, cryptoService, mockKey, queueRepo, since);

    // 通常 push + リトライ push の両方が成功
    // (pin は since=0,0 より新しいので findModifiedSince で引っかかる)
    expect(syncRepo.pushPin).toHaveBeenCalled();
    expect(queueRepo.remove).toHaveBeenCalledWith("queue-1");
  });

  it("リトライ時に Pin が存在しない場合はキューから除去する", async () => {
    const dueItem: SyncQueueItem = {
      id: "queue-ghost",
      type: "pin",
      recordId: "pin-nonexistent",
      operation: "put",
      retries: 2,
      nextAttemptAt: Date.now() - 1000,
      createdAt: new Date(),
    };

    const syncRepo = createMockSyncRepository();
    // pin-nonexistent は存在しない
    const pinRepo = createMockPinRepository([]);
    const cryptoService = createMockCryptoService();
    const queueRepo = createMockSyncQueueRepository([dueItem]);

    await pushSync(syncRepo, pinRepo, cryptoService, mockKey, queueRepo, since);

    expect(queueRepo.remove).toHaveBeenCalledWith("queue-ghost");
  });

  it("Pin の exif.takenAt は ISO 文字列でシリアライズされる", async () => {
    const takenAt = new Date("2024-06-15T10:30:00Z");
    const pin = createMockPin({
      exif: { takenAt, cameraMake: "Sony" },
    });

    const syncRepo = createMockSyncRepository();
    const pinRepo = createMockPinRepository([pin]);
    const cryptoService = createMockCryptoService();
    const queueRepo = createMockSyncQueueRepository();

    await pushSync(syncRepo, pinRepo, cryptoService, mockKey, queueRepo, since);

    const pushedRecord = vi.mocked(syncRepo.pushPin).mock.calls[0][0] as PinSyncRecord;
    const payload = JSON.parse(pushedRecord.encryptedPayload.replace("encrypted:", ""));
    expect(payload.data.exif.takenAt).toBe("2024-06-15T10:30:00.000Z");
    expect(payload.data.exif.cameraMake).toBe("Sony");
  });
});

// ---------------------------------------------------------------------------
// 写真同期テスト
// ---------------------------------------------------------------------------

function createMockPhoto(overrides: Partial<Photo> = {}): Photo {
  const hlc = { physical: Date.now() + 5000, logical: 0, nodeId: "node-local" };
  return {
    id: "photo-1",
    pinId: "pin-1",
    blob: new Blob(["dummy"], { type: "image/jpeg" }),
    mimeType: "image/jpeg",
    createdAt: new Date("2025-01-01T00:00:00Z"),
    hlc,
    ...overrides,
  };
}

function createMockPhotoRepository(
  unsyncedPhotos: Photo[] = [],
  allPhotos: Photo[] = []
): PhotoRepository {
  return {
    save: vi.fn().mockResolvedValue(undefined),
    saveForShoppingItem: vi.fn().mockResolvedValue(undefined),
    restore: vi.fn().mockResolvedValue(undefined),
    findByPinId: vi.fn().mockResolvedValue(allPhotos),
    updateComment: vi.fn().mockResolvedValue(undefined),
    updateExif: vi.fn().mockResolvedValue(undefined),
    delete: vi.fn().mockResolvedValue(undefined),
    deleteByPinId: vi.fn().mockResolvedValue(undefined),
    findModifiedSince: vi.fn().mockResolvedValue([]),
    markSynced: vi.fn().mockResolvedValue(undefined),
    findUnsyncedPhotos: vi.fn().mockResolvedValue(unsyncedPhotos),
  };
}

describe("pushSync (写真同期)", () => {
  const mockKey = {} as CryptoKey;
  const since = { physical: 0, logical: 0 };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("未同期写真を暗号化して pushPhotoBinary を呼ぶ", async () => {
    const photo = createMockPhoto();
    const syncRepo = createMockSyncRepository();
    vi.mocked(syncRepo.pushPhotoBinary).mockResolvedValue(undefined);

    const pinRepo = createMockPinRepository();
    const cryptoService = createMockCryptoService();
    const queueRepo = createMockSyncQueueRepository();
    const photoRepo = createMockPhotoRepository([photo]);

    const result = await pushSync(
      syncRepo,
      pinRepo,
      cryptoService,
      mockKey,
      queueRepo,
      since,
      photoRepo
    );

    expect(result.pushedPhotoCount).toBe(1);
    expect(syncRepo.pushPhotoBinary).toHaveBeenCalledOnce();
    const [calledPhotoId, , calledMeta] = vi.mocked(syncRepo.pushPhotoBinary).mock.calls[0];
    expect(calledPhotoId).toBe(photo.id);
    expect(calledMeta.pinId).toBe(photo.pinId);
    expect(calledMeta.hlcPhysical).toBe(photo.hlc.physical);
    expect(photoRepo.markSynced).toHaveBeenCalledWith(photo.id, expect.any(Date));
  });

  it("写真がない場合は pushedPhotoCount 0 を返す", async () => {
    const syncRepo = createMockSyncRepository();
    const pinRepo = createMockPinRepository();
    const cryptoService = createMockCryptoService();
    const queueRepo = createMockSyncQueueRepository();
    const photoRepo = createMockPhotoRepository([]);

    const result = await pushSync(
      syncRepo,
      pinRepo,
      cryptoService,
      mockKey,
      queueRepo,
      since,
      photoRepo
    );

    expect(result.pushedPhotoCount).toBe(0);
    expect(syncRepo.pushPhotoBinary).not.toHaveBeenCalled();
  });

  it("photoRepo が未指定の場合は写真同期をスキップする", async () => {
    const syncRepo = createMockSyncRepository();
    const pinRepo = createMockPinRepository();
    const cryptoService = createMockCryptoService();
    const queueRepo = createMockSyncQueueRepository();

    const result = await pushSync(syncRepo, pinRepo, cryptoService, mockKey, queueRepo, since);

    expect(result.pushedPhotoCount).toBe(0);
    expect(syncRepo.pushPhotoBinary).not.toHaveBeenCalled();
  });

  it("pushPhotoBinary 失敗時は SyncQueue に photo タイプで enqueue する", async () => {
    const photo = createMockPhoto();
    const syncRepo = createMockSyncRepository();
    vi.mocked(syncRepo.pushPhotoBinary).mockRejectedValue(new Error("Network error"));

    const pinRepo = createMockPinRepository();
    const cryptoService = createMockCryptoService();
    const queueRepo = createMockSyncQueueRepository();
    const photoRepo = createMockPhotoRepository([photo]);

    const result = await pushSync(
      syncRepo,
      pinRepo,
      cryptoService,
      mockKey,
      queueRepo,
      since,
      photoRepo
    );

    expect(result.pushedPhotoCount).toBe(0);
    expect(queueRepo.enqueue).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "photo",
        recordId: photo.id,
        operation: "put",
      })
    );
    // markSynced は呼ばれない
    expect(photoRepo.markSynced).not.toHaveBeenCalled();
  });

  it("写真メタデータが JSON でシリアライズされ encryptedMeta に含まれる", async () => {
    const takenAt = new Date("2024-08-01T09:00:00Z");
    const photo = createMockPhoto({
      exif: { takenAt, cameraMake: "Canon" },
    });
    const syncRepo = createMockSyncRepository();
    vi.mocked(syncRepo.pushPhotoBinary).mockResolvedValue(undefined);

    const pinRepo = createMockPinRepository();
    const cryptoService = createMockCryptoService();
    const queueRepo = createMockSyncQueueRepository();
    const photoRepo = createMockPhotoRepository([photo]);

    await pushSync(syncRepo, pinRepo, cryptoService, mockKey, queueRepo, since, photoRepo);

    const [, , calledMeta] = vi.mocked(syncRepo.pushPhotoBinary).mock.calls[0];
    // encryptedMeta は "encrypted:" プレフィクスの後に JSON が続く形式
    const decodedMeta = JSON.parse(calledMeta.encryptedMeta.replace(/^encrypted:/, "")) as {
      schemaVersion: number;
      data: { exif?: { takenAt?: string; cameraMake?: string } };
    };
    expect(decodedMeta.schemaVersion).toBe(1);
    expect(decodedMeta.data.exif?.takenAt).toBe("2024-08-01T09:00:00.000Z");
    expect(decodedMeta.data.exif?.cameraMake).toBe("Canon");
  });
});
