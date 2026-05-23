import { describe, it, expect, vi } from "vitest";
import { updatePin } from "./update-pin";
import type { PinRepository } from "@application/ports/pin-repository";
import type { Pin } from "@domain/entities/pin";
import { createHlc, compareHlc } from "@domain/value-objects/hlc";

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

function makePin(overrides?: Partial<Pin>): Pin {
  return {
    id: "pin-1",
    coordinates: { lng: 139.7, lat: 35.7 },
    title: "元のタイトル",
    hlc: createHlc("node-test"),
    createdAt: new Date(),
    ...overrides,
  };
}

describe("updatePin", () => {
  it("変更を適用して repo.save を呼び出す", async () => {
    const repo = createMockRepo();
    const pin = makePin();
    const updated = await updatePin(repo, pin, { title: "新タイトル" });

    expect(repo.save).toHaveBeenCalledOnce();
    expect(updated.title).toBe("新タイトル");
    expect(updated.coordinates).toEqual(pin.coordinates);
  });

  it("updatePin 後の HLC は元より大きい（時間が進んでいる）", async () => {
    const repo = createMockRepo();
    const pin = makePin();
    const originalHlc = { ...pin.hlc };
    const updated = await updatePin(repo, pin, { title: "新タイトル" });

    // HLC は単調増加するはず
    expect(compareHlc(updated.hlc, originalHlc)).toBeGreaterThan(0);
  });

  it("複数フィールドを同時に変更できる", async () => {
    const repo = createMockRepo();
    const pin = makePin();
    const updated = await updatePin(repo, pin, {
      title: "新タイトル",
      comment: "コメント",
      categoryId: "food",
    });

    expect(updated.title).toBe("新タイトル");
    expect(updated.comment).toBe("コメント");
    expect(updated.categoryId).toBe("food");
  });

  it("id と createdAt は変更されない", async () => {
    const repo = createMockRepo();
    const pin = makePin();
    const updated = await updatePin(repo, pin, { title: "X" });

    expect(updated.id).toBe(pin.id);
    expect(updated.createdAt).toEqual(pin.createdAt);
  });
});
