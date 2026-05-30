/**
 * 同期ロジックの React 統合フック
 *
 * tabCoordinator.acquireSyncLead でリーダータブのみ同期を実行し、
 * 完了後に BroadcastChannel 経由で他タブに通知する。
 *
 * Phase 2: privateKey が渡された場合、個人同期後にグループ同期も実行する。
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { tabCoordinator } from "@infrastructure/sync/tab-coordinator";
import { cloudflareSyncRepository } from "@infrastructure/sync/cloudflare-sync-repository";
import { cloudflareGroupSyncRepository } from "@infrastructure/sync/cloudflare-group-sync-repository";
import { dexiePinRepository } from "@infrastructure/persistence/dexie-pin-repository";
import { dexiePhotoRepository } from "@infrastructure/persistence/dexie-photo-repository";
import { dexieSyncQueueRepository } from "@infrastructure/persistence/dexie-sync-queue-repository";
import { webCryptoService } from "@infrastructure/sync/web-crypto-service";
import { webKeyManagementService } from "@infrastructure/sync/web-key-management-service";
import { pullSync } from "@application/use-cases/pull-sync";
import { pullPhotoSync } from "@application/use-cases/pull-photo-sync";
import { pushSync } from "@application/use-cases/push-sync";
import { pullGroupSync } from "@application/use-cases/pull-group-sync";
import { pushGroupSync } from "@application/use-cases/push-group-sync";
import { pullGroupPhotoSync } from "@application/use-cases/pull-group-photo-sync";
import { pushGroupPhotoSync } from "@application/use-cases/push-group-photo-sync";
import { grantPendingMemberKeys } from "@application/use-cases/grant-pending-member-keys";
import { authService } from "@infrastructure/sync/auth-service";
import { db } from "@infrastructure/persistence/db";
import { parseExif } from "@infrastructure/exif/exif-parser";
import type { PhotoExif } from "@domain/entities/photo";

export type SyncState = "idle" | "syncing" | "error" | "offline" | "unauthenticated";

async function extractExifFromBlob(blob: Blob): Promise<PhotoExif | undefined> {
  try {
    const data = await parseExif(blob);
    const hasFields =
      data.takenAt ||
      data.cameraMake ||
      data.fNumber != null ||
      data.exposureTime != null ||
      data.focalLength != null ||
      data.iso != null;
    if (!hasFields) return undefined;
    return {
      takenAt: data.takenAt,
      takenAtEstimated: undefined,
      cameraMake: data.cameraMake,
      cameraModel: data.cameraModel,
      fNumber: data.fNumber,
      exposureTime: data.exposureTime,
      focalLength: data.focalLength,
      iso: data.iso,
    };
  } catch {
    return undefined;
  }
}

const LS_LAST_HLC_PHYSICAL = "kdm:last-sync-hlc-physical";
const LS_LAST_HLC_LOGICAL = "kdm:last-sync-hlc-logical";

function loadLastHlc(): { physical: number; logical: number } {
  const physical = Number(localStorage.getItem(LS_LAST_HLC_PHYSICAL) ?? "0");
  const logical = Number(localStorage.getItem(LS_LAST_HLC_LOGICAL) ?? "0");
  return {
    physical: isNaN(physical) ? 0 : physical,
    logical: isNaN(logical) ? 0 : logical,
  };
}

function saveLastHlc(hlc: { physical: number; logical: number }): void {
  localStorage.setItem(LS_LAST_HLC_PHYSICAL, String(hlc.physical));
  localStorage.setItem(LS_LAST_HLC_LOGICAL, String(hlc.logical));
}

function loadGroupHlc(groupId: string): { physical: number; logical: number } {
  const physical = Number(localStorage.getItem(`kdm:group-hlc-${groupId}-physical`) ?? "0");
  const logical = Number(localStorage.getItem(`kdm:group-hlc-${groupId}-logical`) ?? "0");
  return {
    physical: isNaN(physical) ? 0 : physical,
    logical: isNaN(logical) ? 0 : logical,
  };
}

function saveGroupHlc(groupId: string, hlc: { physical: number; logical: number }): void {
  localStorage.setItem(`kdm:group-hlc-${groupId}-physical`, String(hlc.physical));
  localStorage.setItem(`kdm:group-hlc-${groupId}-logical`, String(hlc.logical));
}

interface UseSyncOptions {
  encryptionKey: CryptoKey | null;
  /** RSA-OAEP 秘密鍵。グループ鍵の unwrap に使用。グループ機能未使用時は null */
  privateKey?: CryptoKey | null;
}

interface UseSyncResult {
  syncState: SyncState;
  triggerSync: () => void;
}

export function useSync({ encryptionKey, privateKey }: UseSyncOptions): UseSyncResult {
  const [syncState, setSyncState] = useState<SyncState>("idle");
  const isSyncingRef = useRef(false);

  const runSync = useCallback(async () => {
    if (isSyncingRef.current) return;
    if (!encryptionKey) return;

    if (!authService.isLoggedIn()) {
      setSyncState("unauthenticated");
      return;
    }

    if (authService.getPlan() !== "pro") {
      setSyncState("unauthenticated");
      return;
    }

    if (!navigator.onLine) {
      setSyncState("offline");
      return;
    }

    isSyncingRef.current = true;
    setSyncState("syncing");

    try {
      await tabCoordinator.acquireSyncLead(async () => {
        const since = loadLastHlc();

        // Pull: サーバー → IndexedDB
        const pullResult = await pullSync(
          cloudflareSyncRepository,
          dexiePinRepository,
          webCryptoService,
          encryptionKey,
          since
        );

        let currentHlc = pullResult.lastHlc;
        if (
          currentHlc.physical > since.physical ||
          (currentHlc.physical === since.physical && currentHlc.logical > since.logical)
        ) {
          saveLastHlc(currentHlc);
        } else {
          currentHlc = since;
        }

        // Push: IndexedDB → サーバー（写真含む）
        await pushSync(
          cloudflareSyncRepository,
          dexiePinRepository,
          webCryptoService,
          encryptionKey,
          dexieSyncQueueRepository,
          currentHlc,
          dexiePhotoRepository
        );

        // Pull Photos
        await pullPhotoSync(
          cloudflareSyncRepository,
          dexiePinRepository,
          dexiePhotoRepository,
          webCryptoService,
          encryptionKey,
          extractExifFromBlob
        );

        // グループ同期（privateKey がある場合のみ）
        if (privateKey) {
          await runGroupSync(privateKey);
        }

        tabCoordinator.broadcastSyncComplete();
      });

      setSyncState("idle");
    } catch (err) {
      console.error("[use-sync] Sync failed:", err);

      if (!navigator.onLine) {
        setSyncState("offline");
      } else if (
        err instanceof Error &&
        (err.message === "Unauthenticated" || err.message.includes("401"))
      ) {
        setSyncState("unauthenticated");
      } else {
        setSyncState("error");
      }
    } finally {
      isSyncingRef.current = false;
    }
  }, [encryptionKey, privateKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // マウント時に同期を実行
  useEffect(() => {
    if (encryptionKey) {
      void runSync();
    }
  }, [encryptionKey, runSync]);

  // オンラインに戻ったら自動同期
  useEffect(() => {
    const handleOnline = () => {
      if (encryptionKey && syncState === "offline") {
        void runSync();
      }
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [encryptionKey, syncState, runSync]);

  useEffect(() => {
    const unsubscribe = tabCoordinator.onSyncComplete(() => {
      setSyncState("idle");
    });
    return unsubscribe;
  }, []);

  const triggerSync = useCallback(() => {
    void runSync();
  }, [runSync]);

  return { syncState, triggerSync };
}

/**
 * グループ同期サブルーティン。
 * 参加中の全グループに対して pull → grant-pending-keys → push を実行する。
 */
async function runGroupSync(privateKey: CryptoKey): Promise<void> {
  let groups: Awaited<ReturnType<typeof cloudflareGroupSyncRepository.listGroups>>;
  try {
    groups = await cloudflareGroupSyncRepository.listGroups();
  } catch {
    // グループ一覧取得失敗は非致命的（個人同期は完了済み）
    console.warn("[use-sync] listGroups failed, skipping group sync");
    return;
  }

  for (const group of groups) {
    try {
      await syncOneGroup(group.id, privateKey);
    } catch (err) {
      console.warn(`[use-sync] group sync failed for ${group.id}:`, err);
    }
  }
}

async function syncOneGroup(groupId: string, privateKey: CryptoKey): Promise<void> {
  // グループ鍵を key_store から取得（なければサーバーから unwrap）
  const storeKey = `group-key:${groupId}`;
  let groupKey: CryptoKey | null = null;
  let keyVersion = 1;

  const stored = await db.key_store.get(storeKey);
  if (stored) {
    groupKey = stored.key;
  } else {
    const remote = await cloudflareGroupSyncRepository.fetchMyGroupKey(groupId);
    if (!remote) return; // まだ鍵付与待ち
    try {
      groupKey = await webKeyManagementService.unwrapGroupKey(remote.wrappedGroupKey, privateKey);
      keyVersion = remote.keyVersion;
      await db.key_store.put({ id: storeKey, key: groupKey, createdAt: new Date() });
    } catch {
      console.warn(`[use-sync] unwrapGroupKey failed for group ${groupId}`);
      return;
    }
  }

  const groupSince = loadGroupHlc(groupId);

  // Pull: グループサーバー → IndexedDB
  const pullResult = await pullGroupSync(
    groupId,
    groupKey,
    cloudflareGroupSyncRepository,
    dexiePinRepository,
    webKeyManagementService,
    groupSince
  );

  if (
    pullResult.lastHlc.physical > groupSince.physical ||
    (pullResult.lastHlc.physical === groupSince.physical &&
      pullResult.lastHlc.logical > groupSince.logical)
  ) {
    saveGroupHlc(groupId, pullResult.lastHlc);
  }

  // pending_key メンバーへの鍵付与を試みる（失敗は無視）
  try {
    await grantPendingMemberKeys(
      groupId,
      groupKey,
      webKeyManagementService,
      cloudflareGroupSyncRepository
    );
  } catch {
    // 非致命的
  }

  // Push: ローカル変更 → グループサーバー
  await pushGroupSync(
    groupId,
    groupKey,
    keyVersion,
    cloudflareGroupSyncRepository,
    dexiePinRepository,
    webKeyManagementService,
    groupSince
  );

  // Pull Photos: グループ写真 R2 → Dexie
  await pullGroupPhotoSync(
    groupId,
    groupKey,
    cloudflareGroupSyncRepository,
    dexiePinRepository,
    dexiePhotoRepository,
    webKeyManagementService,
    extractExifFromBlob
  );

  // Push Photos: 未同期グループ写真 → グループ R2
  await pushGroupPhotoSync(
    groupId,
    groupKey,
    keyVersion,
    cloudflareGroupSyncRepository,
    dexiePinRepository,
    dexiePhotoRepository,
    webKeyManagementService
  );
}
