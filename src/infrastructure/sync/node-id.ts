const NODE_ID_KEY = "kdm:node-id";

/**
 * デバイス固有のノードIDを返す。
 * localStorage に保存済みであればそれを返し、なければ新規生成して保存する。
 */
export function getNodeId(): string {
  const stored = localStorage.getItem(NODE_ID_KEY);
  if (stored) {
    return stored;
  }
  const id = crypto.randomUUID();
  localStorage.setItem(NODE_ID_KEY, id);
  return id;
}
