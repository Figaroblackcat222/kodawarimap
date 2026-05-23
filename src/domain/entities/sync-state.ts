export type SyncStatus = "idle" | "syncing" | "error" | "offline" | "unauthenticated";

export interface SyncState {
  status: SyncStatus;
  lastSyncAt?: Date;
  errorMessage?: string;
  pendingCount: number; // SyncQueue の件数
}
