import { describe, it, expect, vi } from "vitest";
import { addPin } from "./add-pin";
import type { PinRepository } from "@application/ports/pin-repository";
import type { Pin } from "@domain/entities/pin";
import { createHlc } from "@domain/value-objects/hlc";

function createMockRepo(): PinRepository {
  return {
    save: vi.fn().mockResolvedValue(undefined),
    findAll: vi.fn().mockResolvedValue([]),
    findDeleted: vi.fn().mockResolvedValue([]),
    softDelete: vi.fn().mockResolvedValue(undefined),
    restore: vi.fn().mockResolvedValue(undefined),
    hardDelete: vi.fn().mockResolvedValue(undefined),
    purgeExpired: vi.fn().mockResolvedValue(undefined),
    findModifiedSince: vi.fn().mockResolvedValue([]),
  };
}

describe("addPin", () => {
  it("ピンを生成して repo.save を呼び出す", async () => {
    const repo = createMockRepo();
    const hlc = createHlc("node-test");
    const pin = await addPin(repo, { lng: 139.7, lat: 35.7 }, "テスト", hlc, "food");

    expect(repo.save).toHaveBeenCalledOnce();
    expect(repo.save).toHaveBeenCalledWith(
      expect.objectContaining<Partial<Pin>>({
        title: "テスト",
        categoryId: "food",
        coordinates: { lng: 139.7, lat: 35.7 },
      })
    );
    expect(pin.title).toBe("テスト");
    expect(pin.categoryId).toBe("food");
    expect(pin.hlc).toEqual(hlc);
  });

  it("hlc が pin に付与される", async () => {
    const repo = createMockRepo();
    const hlc = createHlc("node-abc");
    const pin = await addPin(repo, { lng: 0, lat: 0 }, "pin", hlc);

    expect(pin.hlc.nodeId).toBe("node-abc");
    expect(pin.hlc.logical).toBe(0);
  });

  it("カテゴリーなしで作成できる", async () => {
    const repo = createMockRepo();
    const hlc = createHlc("node-test");
    const pin = await addPin(repo, { lng: 0, lat: 0 }, "no-cat", hlc);

    expect(pin.categoryId).toBeUndefined();
  });
});
