export interface HLC {
  physical: number; // Date.now() ミリ秒
  logical: number; // 同一ms内の順序カウンタ
  nodeId: string; // デバイスID
}

/**
 * 新規イベント発生時に次のHLCを生成する。
 * physical が現在時刻より進んでいる場合はそれを維持し、logical をインクリメント。
 * そうでない場合は現在時刻を採用し、logical を 0 にリセット。
 */
export function nextHlc(local: HLC): HLC {
  const now = Date.now();
  if (local.physical >= now) {
    return { physical: local.physical, logical: local.logical + 1, nodeId: local.nodeId };
  }
  return { physical: now, logical: 0, nodeId: local.nodeId };
}

/**
 * サーバーまたは他デバイスからのHLCとマージする。
 * マージルール:
 *   physical = Math.max(Date.now(), local.physical, remote.physical)
 *   logical はどのノードが最大 physical を持つかで 4 ケース分岐:
 *     - nether (both < now): logical = 0
 *     - localOnly (local.physical == merged): local.logical + 1
 *     - remoteOnly (remote.physical == merged): remote.logical + 1
 *     - equal (local.physical == remote.physical == merged): Math.max(local.logical, remote.logical) + 1
 *   タイブレーカーは nodeId.localeCompare
 */
export function mergeHlc(local: HLC, remote: HLC): HLC {
  const now = Date.now();
  const physical = Math.max(now, local.physical, remote.physical);

  let logical: number;
  const localWins = local.physical === physical;
  const remoteWins = remote.physical === physical;

  if (localWins && remoteWins) {
    // equal: 両方とも最大 physical に等しい
    const maxLogical = Math.max(local.logical, remote.logical);
    logical = maxLogical + 1;
  } else if (localWins) {
    // localOnly
    logical = local.logical + 1;
  } else if (remoteWins) {
    // remoteOnly
    logical = remote.logical + 1;
  } else {
    // neither: 現在時刻が両方より大きい
    logical = 0;
  }

  return { physical, logical, nodeId: local.nodeId };
}

/**
 * HLC を比較する。
 * 戻り値: 負 = a < b、0 = 等値、正 = a > b
 * physical → logical → nodeId の順で比較。
 */
export function compareHlc(a: HLC, b: HLC): number {
  if (a.physical !== b.physical) {
    return a.physical - b.physical;
  }
  if (a.logical !== b.logical) {
    return a.logical - b.logical;
  }
  return a.nodeId.localeCompare(b.nodeId);
}

/**
 * 初期HLCを生成する（nodeId付き）。
 */
export function createHlc(nodeId: string): HLC {
  return { physical: Date.now(), logical: 0, nodeId };
}
