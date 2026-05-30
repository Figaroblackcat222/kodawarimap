/**
 * pull-group-sync ユースケースのユニットテスト
 *
 * pull-sync.test.ts のグループ版ミラー。
 * グループ鍵による復号・HLC LWW・authorId 搬送・鍵不一致スキップ を検証する。
 */
import { describe, it, expect, vi } from "vitest";
import { pullGroupSync } from "./pull-group-sync";
import type {
  GroupSyncRepository,
  GroupPinSyncRecord,
} from "@application/ports/group-sync-repository";
import type { PinRepository } from "@application/ports/pin-repository";
import type { KeyManagementService } from "@application/ports/key-management-service";
import type { Pin } from "@domain/entities/pin";
import { createHlc } from "@domain/value-objects/hlc";

// ---------------------------------------------------------------------------
// モック作成ヘルパー
// ---------------------------------------------------------------------------

const GROUP_ID = "group-abc123";

function makePayload(pin: Partial<Pin> = {}): string {
  const hlc = createHlc("node-remote");
  return JSON.stringify({
    schemaVersion: 1,
    data: {
      id: pin.id ?? "pin-1",
      coordinates: pin.coordinates ?? { lng: 139.7, lat: 35.7 },
      title: pin.title ?? "田中家の温泉",
      hlc,
      createdAt: new Date("2025-01-01T00:00:00Z").toISOString(),
    },
  });
}

function createMockGroupRecord(overrides: Partial<GroupPinSyncRecord> = {}): GroupPinSyncRecord {
  return {
    id: "pin-1",
    authorId: "user-author-001",
    keyVersion: 1,
    encryptedPayload: "encrypted-payload",
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

function createMockGroupSyncRepository(records: GroupPinSyncRecord[] = []): GroupSyncRepository {
  return {
    createGroup: vi.fn().mockResolvedValue({ groupId: GROUP_ID }),
    listGroups: vi.fn().mockResolvedValue([]),
    listMembers: vi.fn().mockResolvedValue([]),
    inviteMember: vi.fn().mockResolvedValue({ token: "tok" }),
    acceptInvite: vi.fn().mockResolvedValue({ groupId: GROUP_ID }),
    fetchMyGroupKey: vi.fn().mockResolvedValue(null),
    listPendingKeys: vi.fn().mockResolvedValue([]),
    grantMemberKey: vi.fn().mockResolvedValue(undefined),
    fetchGroupPinsSince: vi.fn().mockResolvedValue(records),
    pushGroupPin: vi.fn().mockResolvedValue({ hlcPhysical: 1000, hlcLogical: 0 }),
    revokeGroupMember: vi.fn().mockResolvedValue(undefined),
    fetchActivePublicKeys: vi.fn().mockResolvedValue([]),
    rotateGroupKey: vi.fn().mockResolvedValue(undefined),
    fetchGroupPhotoList: vi.fn().mockResolvedValue([]),
    pushGroupPhotoBinary: vi.fn().mockResolvedValue(undefined),
    fetchGroupPhotoBinary: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
    deleteGroupPhoto: vi.fn().mockResolvedValue(undefined),
  };
}

/** 復号をシミュレートするモック KeyManagementService */
function createMockKeyMgmt(returnPayload: string): KeyManagementService {
  return {
    generateUserKeypair: vi.fn(),
    exportPublicKey: vi.fn(),
    importPublicKey: vi.fn(),
    computeFingerprint: vi.fn(),
    wrapPrivateKeyForBackup: vi.fn(),
    unwrapPrivateKeyBackup: vi.fn(),
    generateGroupKey: vi.fn(),
    wrapGroupKeyForMember: vi.fn(),
    unwrapGroupKey: vi.fn(),
    encryptWithGroupKey: vi.fn(),
    decryptWithGroupKey: vi.fn().mockResolvedValue(returnPayload),
    encryptBinaryWithGroupKey: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
    decryptBinaryWithGroupKey: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
  };
}

// ---------------------------------------------------------------------------
// テスト
// ---------------------------------------------------------------------------

describe("pullGroupSync", () => {
  it("サーバーレコードがなければ 0 件を返す", async () => {
    const groupSyncRepo = createMockGroupSyncRepository([]);
    const pinRepo = createMockPinRepository();
    const keyMgmt = createMockKeyMgmt("");

    const result = await pullGroupSync(GROUP_ID, {} as CryptoKey, groupSyncRepo, pinRepo, keyMgmt, {
      physical: 0,
      logical: 0,
    });

    expect(result.mergedCount).toBe(0);
    expect(pinRepo.save).not.toHaveBeenCalled();
  });

  it("復号成功→ pin が保存され space に groupId/authorId が付与される", async () => {
    const record = createMockGroupRecord();
    const payload = makePayload({ id: record.id });
    const keyMgmt = createMockKeyMgmt(payload);
    const groupSyncRepo = createMockGroupSyncRepository([record]);
    const pinRepo = createMockPinRepository();

    const result = await pullGroupSync(GROUP_ID, {} as CryptoKey, groupSyncRepo, pinRepo, keyMgmt, {
      physical: 0,
      logical: 0,
    });

    expect(result.mergedCount).toBe(1);
    expect(pinRepo.save).toHaveBeenCalledOnce();

    const saved = vi.mocked(pinRepo.save).mock.calls[0][0];
    expect(saved.space).toEqual({ kind: "group", groupId: GROUP_ID, authorId: record.authorId });
    expect(saved.id).toBe(record.id);
  });

  it("HLC LWW: ローカルの方が新しければ上書きしない", async () => {
    const now = Date.now();
    const localHlc = createHlc("node-local");
    localHlc.physical = now + 9999;

    const localPin: Pin = {
      id: "pin-1",
      coordinates: { lng: 139.7, lat: 35.7 },
      title: "ローカルのタイトル",
      hlc: localHlc,
      createdAt: new Date(),
      space: { kind: "group", groupId: GROUP_ID },
    };

    const record = createMockGroupRecord({
      id: "pin-1",
      hlcPhysical: now,
      hlcLogical: 0,
    });
    const payload = makePayload({ id: "pin-1", title: "サーバーのタイトル" });
    const keyMgmt = createMockKeyMgmt(payload);
    const groupSyncRepo = createMockGroupSyncRepository([record]);
    const pinRepo = createMockPinRepository([localPin]);

    await pullGroupSync(GROUP_ID, {} as CryptoKey, groupSyncRepo, pinRepo, keyMgmt, {
      physical: 0,
      logical: 0,
    });

    expect(pinRepo.save).not.toHaveBeenCalled();
  });

  it("復号に失敗したレコードはスキップする（他は処理継続）", async () => {
    const record1 = createMockGroupRecord({ id: "pin-bad", hlcPhysical: 100 });
    const record2 = createMockGroupRecord({ id: "pin-good", hlcPhysical: 200 });

    const goodPayload = makePayload({ id: "pin-good" });
    const keyMgmt: KeyManagementService = {
      ...createMockKeyMgmt(goodPayload),
      decryptWithGroupKey: vi.fn().mockImplementation((_key, _ciphertext, _iv) => {
        // record1 の暗号文は "encrypted-payload" → throw する
        throw new Error("decrypt failed");
      }),
    };

    // 2回目は成功させるためにモックを上書き
    vi.mocked(keyMgmt.decryptWithGroupKey)
      .mockRejectedValueOnce(new Error("decrypt failed"))
      .mockResolvedValueOnce(goodPayload);

    const groupSyncRepo = createMockGroupSyncRepository([record1, record2]);
    const pinRepo = createMockPinRepository();

    const result = await pullGroupSync(GROUP_ID, {} as CryptoKey, groupSyncRepo, pinRepo, keyMgmt, {
      physical: 0,
      logical: 0,
    });

    expect(result.mergedCount).toBe(1);
    expect(pinRepo.save).toHaveBeenCalledOnce();
    const saved = vi.mocked(pinRepo.save).mock.calls[0][0];
    expect(saved.id).toBe("pin-good");
  });

  it("lastHlc が最も大きいレコードの HLC に更新される", async () => {
    const records = [
      createMockGroupRecord({ id: "pin-1", hlcPhysical: 1000, hlcLogical: 0 }),
      createMockGroupRecord({ id: "pin-2", hlcPhysical: 2000, hlcLogical: 5 }),
    ];

    let callCount = 0;
    const keyMgmt: KeyManagementService = {
      ...createMockKeyMgmt(""),
      decryptWithGroupKey: vi.fn().mockImplementation(async () => {
        callCount++;
        return makePayload({ id: `pin-${callCount}` });
      }),
    };

    const groupSyncRepo = createMockGroupSyncRepository(records);
    const pinRepo = createMockPinRepository();

    const result = await pullGroupSync(GROUP_ID, {} as CryptoKey, groupSyncRepo, pinRepo, keyMgmt, {
      physical: 0,
      logical: 0,
    });

    expect(result.lastHlc.physical).toBe(2000);
    expect(result.lastHlc.logical).toBe(5);
  });
});
