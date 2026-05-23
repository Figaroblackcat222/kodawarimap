import { describe, it, expect, vi, afterEach } from "vitest";
import { createHlc, nextHlc, mergeHlc, compareHlc, type HLC } from "./hlc";

describe("createHlc", () => {
  it("指定した nodeId でHLCを生成できる", () => {
    const hlc = createHlc("node-a");
    expect(hlc.nodeId).toBe("node-a");
    expect(hlc.logical).toBe(0);
    expect(hlc.physical).toBeGreaterThan(0);
  });
});

describe("nextHlc", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("localのphysicalが現在時刻より大きい場合はlogicalをインクリメント", () => {
    const now = Date.now();
    vi.spyOn(Date, "now").mockReturnValue(now - 1000); // 現在時刻を過去に設定
    const local: HLC = { physical: now, logical: 5, nodeId: "node-a" };
    const result = nextHlc(local);
    expect(result.physical).toBe(now);
    expect(result.logical).toBe(6);
    expect(result.nodeId).toBe("node-a");
  });

  it("現在時刻がlocalのphysicalより大きい場合はphysicalをリセットしlogicalを0にする", () => {
    const now = Date.now();
    vi.spyOn(Date, "now").mockReturnValue(now + 1000); // 現在時刻を未来に設定
    const local: HLC = { physical: now, logical: 5, nodeId: "node-a" };
    const result = nextHlc(local);
    expect(result.physical).toBe(now + 1000);
    expect(result.logical).toBe(0);
  });

  it("localのphysicalが現在時刻と等しい場合はlogicalをインクリメント", () => {
    const now = Date.now();
    vi.spyOn(Date, "now").mockReturnValue(now);
    const local: HLC = { physical: now, logical: 3, nodeId: "node-a" };
    const result = nextHlc(local);
    expect(result.physical).toBe(now);
    expect(result.logical).toBe(4);
  });
});

describe("mergeHlc", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("equal: local と remote の physical が等しく最大の場合、max(logical)+1 を使う", () => {
    const t = 1000;
    vi.spyOn(Date, "now").mockReturnValue(t - 100); // 現在時刻はどちらよりも小さい
    const local: HLC = { physical: t, logical: 3, nodeId: "node-a" };
    const remote: HLC = { physical: t, logical: 7, nodeId: "node-b" };
    const result = mergeHlc(local, remote);
    expect(result.physical).toBe(t);
    expect(result.logical).toBe(8); // max(3,7) + 1
    expect(result.nodeId).toBe("node-a"); // local の nodeId を維持
  });

  it("localOnly: local.physical のみ最大の場合、local.logical+1 を使う", () => {
    const t = 1000;
    vi.spyOn(Date, "now").mockReturnValue(t - 100);
    const local: HLC = { physical: t, logical: 5, nodeId: "node-a" };
    const remote: HLC = { physical: t - 10, logical: 99, nodeId: "node-b" };
    const result = mergeHlc(local, remote);
    expect(result.physical).toBe(t);
    expect(result.logical).toBe(6);
  });

  it("remoteOnly: remote.physical のみ最大の場合、remote.logical+1 を使う", () => {
    const t = 1000;
    vi.spyOn(Date, "now").mockReturnValue(t - 100);
    const local: HLC = { physical: t - 10, logical: 99, nodeId: "node-a" };
    const remote: HLC = { physical: t, logical: 5, nodeId: "node-b" };
    const result = mergeHlc(local, remote);
    expect(result.physical).toBe(t);
    expect(result.logical).toBe(6);
  });

  it("neither: 現在時刻が最大の場合、logical=0 になる", () => {
    const now = 2000;
    vi.spyOn(Date, "now").mockReturnValue(now);
    const local: HLC = { physical: now - 500, logical: 99, nodeId: "node-a" };
    const remote: HLC = { physical: now - 200, logical: 88, nodeId: "node-b" };
    const result = mergeHlc(local, remote);
    expect(result.physical).toBe(now);
    expect(result.logical).toBe(0);
  });
});

describe("compareHlc", () => {
  it("physical が大きい方が後", () => {
    const a: HLC = { physical: 1000, logical: 0, nodeId: "a" };
    const b: HLC = { physical: 2000, logical: 0, nodeId: "a" };
    expect(compareHlc(a, b)).toBeLessThan(0);
    expect(compareHlc(b, a)).toBeGreaterThan(0);
  });

  it("physical が等しい場合は logical で比較", () => {
    const a: HLC = { physical: 1000, logical: 1, nodeId: "a" };
    const b: HLC = { physical: 1000, logical: 5, nodeId: "a" };
    expect(compareHlc(a, b)).toBeLessThan(0);
    expect(compareHlc(b, a)).toBeGreaterThan(0);
  });

  it("physical も logical も等しい場合は nodeId で比較", () => {
    const a: HLC = { physical: 1000, logical: 0, nodeId: "aaa" };
    const b: HLC = { physical: 1000, logical: 0, nodeId: "zzz" };
    expect(compareHlc(a, b)).toBeLessThan(0);
    expect(compareHlc(b, a)).toBeGreaterThan(0);
  });

  it("すべて等しい場合は 0", () => {
    const a: HLC = { physical: 1000, logical: 0, nodeId: "node" };
    const b: HLC = { physical: 1000, logical: 0, nodeId: "node" };
    expect(compareHlc(a, b)).toBe(0);
  });
});
