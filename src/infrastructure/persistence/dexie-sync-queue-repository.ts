/**
 * SyncQueueRepository の Dexie 実装
 */
import type { SyncQueueRepository, SyncQueueItem } from "@application/ports/sync-queue-repository";
import { db } from "./db";

/** 指数バックオフの最大待機時間 (ms) */
const MAX_BACKOFF_MS = 600_000; // 10分
/** 永続エラーとみなすリトライ回数の上限 */
const MAX_RETRIES = 5;

export const dexieSyncQueueRepository: SyncQueueRepository = {
  /**
   * SyncQueueItem を追加する。
   * 同一 recordId が既存なら古いものを削除して新しいものに置き換える（coalesce）。
   */
  async enqueue(
    item: Omit<SyncQueueItem, "id" | "retries" | "nextAttemptAt" | "createdAt">
  ): Promise<void> {
    // 既存エントリを coalesce（削除）
    await this.coalesce(item.recordId);

    const newItem: SyncQueueItem = {
      id: crypto.randomUUID(),
      type: item.type,
      recordId: item.recordId,
      operation: item.operation,
      retries: 0,
      nextAttemptAt: Date.now(),
      createdAt: new Date(),
    };

    await db.sync_queue.add(newItem);
  },

  /**
   * nextAttemptAt <= Date.now() の items を最大50件取得する。
   */
  async peekDue(): Promise<SyncQueueItem[]> {
    const now = Date.now();
    return db.sync_queue.where("nextAttemptAt").belowOrEqual(now).limit(50).toArray();
  },

  /**
   * リトライカウントをインクリメントし、指数バックオフで nextAttemptAt を更新する。
   * retries >= MAX_RETRIES の場合は nextAttemptAt = Infinity（UIで通知が必要な永続エラー）。
   */
  async markRetry(id: string, _nextAttemptAt: number, error: string): Promise<void> {
    const item = await db.sync_queue.get(id);
    if (!item) return;

    const newRetries = item.retries + 1;
    let nextAttemptAt: number;

    if (newRetries >= MAX_RETRIES) {
      nextAttemptAt = Infinity;
    } else {
      const backoffMs = Math.min(Math.pow(2, newRetries) * 1000, MAX_BACKOFF_MS);
      nextAttemptAt = Date.now() + backoffMs;
    }

    await db.sync_queue.update(id, {
      retries: newRetries,
      nextAttemptAt,
      lastError: error,
    });
  },

  /**
   * id で SyncQueueItem を削除する。
   */
  async remove(id: string): Promise<void> {
    await db.sync_queue.delete(id);
  },

  /**
   * 同一 recordId のエントリをすべて削除する（最新1件に絞るための事前削除用）。
   */
  async coalesce(recordId: string): Promise<void> {
    await db.sync_queue.where("recordId").equals(recordId).delete();
  },
};
