/**
 * サーバー側 HLC ユーティリティ
 *
 * Workers はステートレスなため、リクエストごとに Date.now() を使ってサーバー側の
 * HLC を算出する。クライアントから受け取った HLC とマージして最新値を返す。
 */

export interface ServerHLC {
  physical: number;
  logical: number;
}

/**
 * クライアントから受け取った HLC とサーバー時刻をマージして、
 * サーバー側の最新 HLC を返す。
 *
 * ルール（mergeHlc と同じ論理・ただし nodeId は不要）:
 *   physical = Math.max(Date.now(), clientPhysical)
 *   logical:
 *     - clientPhysical == physical → clientLogical + 1
 *     - otherwise (now > clientPhysical) → 0
 */
export function computeServerHlc(clientPhysical: number, clientLogical: number): ServerHLC {
  const now = Date.now();
  const physical = Math.max(now, clientPhysical);

  let logical: number;
  if (clientPhysical === physical) {
    // クライアントの physical がサーバーの現在時刻以上
    logical = clientLogical + 1;
  } else {
    // サーバー時刻がクライアントより進んでいる
    logical = 0;
  }

  return { physical, logical };
}
