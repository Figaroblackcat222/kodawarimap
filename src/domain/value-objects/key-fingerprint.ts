/**
 * 公開鍵フィンガープリントのフォーマット
 *
 * SHA-256 ダイジェスト（32 bytes）を "AB:CD:EF:..." 形式に変換する。
 * Signal の safety number と同じ考え方で家族が口頭照合できる。
 *
 * digestBytes: SHA-256 ダイジェストの Uint8Array（32 bytes）
 * 先頭 12 bytes（= 96 bits）を使い 12 組の16進ペアを返す。
 */
export function formatFingerprint(digestBytes: Uint8Array): string {
  return Array.from(digestBytes.slice(0, 12))
    .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
    .join(":");
}
