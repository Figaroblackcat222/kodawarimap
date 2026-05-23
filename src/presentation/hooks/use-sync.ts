/**
 * 同期ロジックの React 統合フック
 *
 * tabCoordinator.acquireSyncLead でリーダータブのみ同期を実行し、
 * 完了後に BroadcastChannel 経由で他タブに通知する。
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { tabCoordinator } from "@infrastructure/sync/tab-coordinator";
import { cloudflareSyncRepository } from "@infrastructure/sync/cloudflare-sync-repository";
import { dexiePinRepository } from "@infrastructure/persistence/dexie-pin-repository";
import { dexieSyncQueueRepository } from "@infrastructure/persistence/dexie-sync-queue-repository";
import { webCryptoService } from "@infrastructure/sync/web-crypto-service";
import { pullSync } from "@application/use-cases/pull-sync";
import { pushSync } from "@application/use-cases/push-sync";
import { authService } from "@infrastructure/sync/auth-service";

export type SyncState = "idle" | "syncing" | "error" | "offline" | "unauthenticated";

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

interface UseSyncOptions {
  encryptionKey: CryptoKey | null;
}

interface UseSyncResult {
  syncState: SyncState;
  triggerSync: () => void;
}

export function useSync({ encryptionKey }: UseSyncOptions): UseSyncResult {
  const [syncState, setSyncState] = useState<SyncState>("idle");
  const isSyncingRef = useRef(false);

  const runSync = useCallback(async () => {
    if (isSyncingRef.current) return;
    if (!encryptionKey) return;

    if (!authService.isLoggedIn()) {
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

        // lastHlc を更新（pull で進んだ分）
        let currentHlc = pullResult.lastHlc;
        if (
          currentHlc.physical > since.physical ||
          (currentHlc.physical === since.physical && currentHlc.logical > since.logical)
        ) {
          saveLastHlc(currentHlc);
        } else {
          currentHlc = since;
        }

        // Push: IndexedDB → サーバー
        await pushSync(
          cloudflareSyncRepository,
          dexiePinRepository,
          webCryptoService,
          encryptionKey,
          dexieSyncQueueRepository,
          currentHlc
        );

        // 同期完了を他タブに通知
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
  }, [encryptionKey]);

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

  // 他タブの同期完了通知を受けたら IndexedDB を再読込
  // （現在は再読込のシグナルとして syncState を idle にリセット）
  useEffect(() => {
    const unsubscribe = tabCoordinator.onSyncComplete(() => {
      // 他タブが同期完了 → ページリロードなしでデータ更新は
      // 呼び出し元コンポーネントが watchQuery / useLiveQuery で対応する想定
      // ここでは syncState をリセットするだけ
      setSyncState("idle");
    });
    return unsubscribe;
  }, []);

  const triggerSync = useCallback(() => {
    void runSync();
  }, [runSync]);

  return { syncState, triggerSync };
}
