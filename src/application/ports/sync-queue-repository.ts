export interface SyncQueueItem {
  id: string;
  type: "pin" | "photo";
  recordId: string;
  operation: "put" | "delete";
  retries: number;
  nextAttemptAt: number; // unix ms
  createdAt: Date;
  lastError?: string;
}

export interface SyncQueueRepository {
  enqueue(
    item: Omit<SyncQueueItem, "id" | "retries" | "nextAttemptAt" | "createdAt">
  ): Promise<void>;
  peekDue(): Promise<SyncQueueItem[]>;
  markRetry(id: string, nextAttemptAt: number, error: string): Promise<void>;
  remove(id: string): Promise<void>;
  /** 同一 recordId の古いエントリを削除してキューを圧縮する */
  coalesce(recordId: string): Promise<void>;
}
