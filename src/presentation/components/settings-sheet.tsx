import { useState, useEffect } from "react";
import { createHlc } from "@domain/value-objects/hlc";
import { getNodeId } from "@infrastructure/sync/node-id";
import {
  X,
  Download,
  Upload,
  Clock,
  Map as MapIcon,
  Shield,
  Globe,
  Sun,
  RefreshCw,
  Newspaper,
  Search,
  AlertCircle,
  CheckCircle,
  Cloud,
  LogOut,
  KeyRound,
  AlertTriangle,
  Fingerprint,
  Trash2,
  Plus,
} from "lucide-react";
import type { PinRepository } from "@application/ports/pin-repository";
import type { PhotoRepository } from "@application/ports/photo-repository";
import { TICKER_ENABLED_KEY, TICKER_COLLAPSED_KEY } from "./message-ticker";
import { authService } from "@infrastructure/sync/auth-service";
import { cloudflareSyncRepository } from "@infrastructure/sync/cloudflare-sync-repository";
import type { SyncState } from "@presentation/hooks/use-sync";
import type {
  PasskeyCredential,
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON,
} from "@application/ports/sync-repository";
import type { AuthenticatorTransportFuture } from "@simplewebauthn/types";

const LAST_EXPORT_AT_KEY = "kdm:last-export-at";
const BACKUP_REMINDER_KEY = "kdm:backup-reminder-dismissed";

interface Props {
  pinRepo: PinRepository;
  photoRepo: PhotoRepository;
  onClose: () => void;
  onImportComplete: () => void;
  trashRetentionDays: number;
  onTrashRetentionChange: (days: number) => void;
  autoNightMode: boolean;
  onAutoNightModeChange: (v: boolean) => void;
  nightStart: string;
  onNightStartChange: (v: string) => void;
  nightEnd: string;
  onNightEndChange: (v: string) => void;
  geocoderEnabled: boolean;
  onGeocoderEnabledChange: (v: boolean) => void;
  /** 現在の同期状態（未設定の場合は同期セクションを非表示） */
  syncState?: SyncState;
  /** 手動同期トリガー */
  onTriggerSync?: () => void;
  /** 同期設定シートを開く */
  onOpenSyncSetup?: () => void;
  /** 同期の最終実行日時 */
  lastSyncAt?: Date | null;
  /** ログイン済みかつ鍵あり */
  hasSyncKey?: boolean;
  /** ログアウト完了時に呼ばれる */
  onLogout?: () => void;
  /** パスキー操作用 SyncRepository（Pro ユーザーのみ） */
  syncRepository?: typeof cloudflareSyncRepository;
}

const RETENTION_OPTIONS = [7, 14, 30, 60, 90] as const;

export function SettingsSheet({
  pinRepo,
  photoRepo,
  onClose,
  onImportComplete,
  trashRetentionDays,
  onTrashRetentionChange,
  autoNightMode,
  onAutoNightModeChange,
  nightStart,
  onNightStartChange,
  nightEnd,
  onNightEndChange,
  geocoderEnabled,
  onGeocoderEnabledChange,
  syncState,
  onTriggerSync,
  onOpenSyncSetup,
  lastSyncAt,
  hasSyncKey = false,
  onLogout,
  syncRepository,
}: Props) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [mapUpdateStatus, setMapUpdateStatus] = useState<"idle" | "checking" | "done">("idle");
  const [tickerEnabled, setTickerEnabled] = useState(
    () => localStorage.getItem(TICKER_ENABLED_KEY) !== "false"
  );
  const [tickerCollapsed, setTickerCollapsed] = useState(
    () => localStorage.getItem(TICKER_COLLAPSED_KEY) === "true"
  );
  const [showGeocoderConsent, setShowGeocoderConsent] = useState(false);
  const [infoDialog, setInfoDialog] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // バックアップ通知: 30日以上経過 & ログイン済み & 今日未却下
  const [showBackupReminder] = useState<boolean>(() => {
    if (!authService.isLoggedIn()) return false;
    const lastExport = localStorage.getItem(LAST_EXPORT_AT_KEY);
    const dismissed = localStorage.getItem(BACKUP_REMINDER_KEY);
    const today = new Date().toISOString().split("T")[0];
    if (dismissed === today) return false;
    if (!lastExport) return true;
    const diffMs = Date.now() - new Date(lastExport).getTime();
    return diffMs > 30 * 24 * 60 * 60 * 1000;
  });
  const [backupReminderDismissed, setBackupReminderDismissed] = useState(false);

  const lastExportAt = localStorage.getItem(LAST_EXPORT_AT_KEY);

  // パスキー管理
  const [passkeyCredentials, setPasskeyCredentials] = useState<PasskeyCredential[]>([]);
  const [passkeySetupPhase, setPasskeySetupPhase] = useState<
    "idle" | "creating" | "naming" | "saving"
  >("idle");
  const [newDeviceName, setNewDeviceName] = useState("");
  const [pendingCredential, setPendingCredential] = useState<RegistrationResponseJSON | null>(null);
  const [passkeyError, setPasskeyError] = useState<string | null>(null);

  useEffect(() => {
    if (hasSyncKey && syncRepository) {
      syncRepository
        .listPasskeyCredentials()
        .then(setPasskeyCredentials)
        .catch(() => {});
    }
  }, [hasSyncKey, syncRepository]);

  const handlePasskeySetupBegin = async () => {
    if (!syncRepository) return;
    setPasskeyError(null);
    setPasskeySetupPhase("creating");
    try {
      const options = await syncRepository.beginPasskeyRegistration();
      const credential = await createPasskeyCredential(options);
      setPendingCredential(credential);
      setNewDeviceName(getDefaultDeviceName());
      setPasskeySetupPhase("naming");
    } catch (e) {
      setPasskeyError(e instanceof Error ? e.message : "パスキーの作成に失敗しました");
      setPasskeySetupPhase("idle");
    }
  };

  const handlePasskeySetupComplete = async () => {
    if (!syncRepository || !pendingCredential) return;
    setPasskeyError(null);
    setPasskeySetupPhase("saving");
    try {
      await syncRepository.completePasskeyRegistration(
        pendingCredential,
        newDeviceName || getDefaultDeviceName()
      );
      authService.savePasskeyEnabled(true);
      const updated = await syncRepository.listPasskeyCredentials();
      setPasskeyCredentials(updated);
      setPasskeySetupPhase("idle");
      setPendingCredential(null);
    } catch (e) {
      setPasskeyError(e instanceof Error ? e.message : "パスキーの保存に失敗しました");
      setPasskeySetupPhase("idle");
    }
  };

  const handlePasskeyDelete = async (credentialId: string) => {
    if (!syncRepository) return;
    try {
      await syncRepository.deletePasskeyCredential(credentialId);
      const updated = await syncRepository.listPasskeyCredentials();
      setPasskeyCredentials(updated);
      if (updated.length === 0) authService.savePasskeyEnabled(false);
    } catch (e) {
      setPasskeyError(e instanceof Error ? e.message : "削除に失敗しました");
    }
  };

  const handleLogout = async () => {
    try {
      const rt = authService.getRefreshToken();
      if (rt) await cloudflareSyncRepository.logout(rt).catch(() => {});
    } catch {
      // ignore
    }
    authService.clearAll();
    onLogout?.();
    setInfoDialog({ type: "success", message: "ログアウトしました" });
  };

  const handleMapUpdate = async () => {
    setMapUpdateStatus("checking");
    // POIタイルキャッシュをすべて削除
    const keysToDelete: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("kodawarimap:poi-tile:")) keysToDelete.push(key);
    }
    keysToDelete.forEach((k) => localStorage.removeItem(k));

    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.getRegistration().catch(() => undefined);
      if (reg) {
        try {
          // サーバーに新しいSWバージョンを確認しに行く
          await reg.update();
          // インストール中のSWがあれば waiting 状態になるまで最大3秒待機
          if (reg.installing) {
            await new Promise<void>((resolve) => {
              const sw = reg.installing!;
              const timeout = setTimeout(resolve, 3000);
              sw.addEventListener("statechange", () => {
                if (sw.state === "installed" || sw.state === "redundant") {
                  clearTimeout(timeout);
                  resolve();
                }
              });
            });
          }
          // waiting 状態のSWがあれば pwa-update-dialog に任せる（SKIP_WAITINGは送らない）
          const freshReg = await navigator.serviceWorker.getRegistration().catch(() => undefined);
          if (freshReg?.waiting) {
            setMapUpdateStatus("idle");
            return;
          }
        } catch {
          // エラー時は無視して完了扱いに
        }
      }
    }

    // 新バージョンなし: 設定画面に留まり「完了」を表示
    setMapUpdateStatus("done");
    setTimeout(() => setMapUpdateStatus("idle"), 3000);
  };

  const handleExportJson = async () => {
    setIsExporting(true);
    try {
      const pins = await pinRepo.findAll();
      const data = pins.map((p) => ({
        ...p,
        coordinates: p.coordinates,
        exif: p.exif ? { ...p.exif, takenAt: p.exif.takenAt?.toISOString() } : undefined,
        createdAt: p.createdAt.toISOString(),
        deletedAt: p.deletedAt?.toISOString(),
      }));
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      downloadBlob(blob, `kodawarimap-pins-${dateStr()}.json`);
      localStorage.setItem(LAST_EXPORT_AT_KEY, new Date().toISOString());
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportZip = async () => {
    setIsExporting(true);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();

      const pins = await pinRepo.findAll();
      const pinsData = pins.map((p) => ({
        ...p,
        exif: p.exif ? { ...p.exif, takenAt: p.exif.takenAt?.toISOString() } : undefined,
        createdAt: p.createdAt.toISOString(),
        deletedAt: p.deletedAt?.toISOString(),
      }));
      zip.file("pins.json", JSON.stringify(pinsData, null, 2));

      const photosFolder = zip.folder("photos");
      const allPhotoMeta: object[] = [];
      for (const pin of pins) {
        const photos = await photoRepo.findByPinId(pin.id);
        for (const photo of photos) {
          const ext = photo.mimeType === "image/png" ? "png" : "jpg";
          photosFolder!.file(`${photo.id}.${ext}`, photo.blob);
          allPhotoMeta.push({
            id: photo.id,
            pinId: photo.pinId,
            mimeType: photo.mimeType,
            createdAt: photo.createdAt.toISOString(),
            exif: photo.exif
              ? { ...photo.exif, takenAt: photo.exif.takenAt?.toISOString() }
              : undefined,
            fileInfo: photo.fileInfo,
          });
        }
      }
      zip.file("photos.json", JSON.stringify(allPhotoMeta, null, 2));

      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, `kodawarimap-backup-${dateStr()}.zip`);
      localStorage.setItem(LAST_EXPORT_AT_KEY, new Date().toISOString());
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      if (file.name.endsWith(".zip")) {
        await importZip(file);
      } else {
        await importJson(file);
      }
      onImportComplete();
    } catch {
      setInfoDialog({
        type: "error",
        message: "インポートに失敗しました。正しいファイルを選択してください。",
      });
    } finally {
      setIsImporting(false);
      e.target.value = "";
    }
  };

  const importJson = async (file: File) => {
    const text = await file.text();
    const data = JSON.parse(text) as Array<Record<string, unknown>>;
    if (!Array.isArray(data)) throw new Error("Invalid format");
    let count = 0;
    for (const item of data) {
      try {
        await pinRepo.save({
          id: item.id as string,
          coordinates: item.coordinates as { lng: number; lat: number },
          title: item.title as string,
          categoryId: item.categoryId as string | undefined,
          comment: item.comment as string | undefined,
          exif: item.exif
            ? {
                ...(item.exif as object),
                takenAt: (item.exif as { takenAt?: string }).takenAt
                  ? new Date((item.exif as { takenAt: string }).takenAt)
                  : undefined,
              }
            : undefined,
          createdAt: new Date(item.createdAt as string),
          deletedAt: item.deletedAt ? new Date(item.deletedAt as string) : undefined,
          hlc: createHlc(getNodeId()),
        });
        count++;
      } catch {
        // スキップ
      }
    }
    setInfoDialog({ type: "success", message: `${count}件のピンをインポートしました` });
  };

  const importZip = async (file: File) => {
    const { default: JSZip } = await import("jszip");
    const zip = await JSZip.loadAsync(file);

    // pins.json を復元
    const pinsFile = zip.file("pins.json");
    if (!pinsFile) throw new Error("pins.json not found");
    const pinsData = JSON.parse(await pinsFile.async("text")) as Array<Record<string, unknown>>;
    let pinCount = 0;
    for (const item of pinsData) {
      try {
        await pinRepo.save({
          id: item.id as string,
          coordinates: item.coordinates as { lng: number; lat: number },
          title: item.title as string,
          categoryId: item.categoryId as string | undefined,
          comment: item.comment as string | undefined,
          exif: item.exif
            ? {
                ...(item.exif as object),
                takenAt: (item.exif as { takenAt?: string }).takenAt
                  ? new Date((item.exif as { takenAt: string }).takenAt)
                  : undefined,
              }
            : undefined,
          createdAt: new Date(item.createdAt as string),
          deletedAt: item.deletedAt ? new Date(item.deletedAt as string) : undefined,
          hlc: createHlc(getNodeId()),
        });
        pinCount++;
      } catch {
        // スキップ
      }
    }

    // photos.json を復元
    const photosMetaFile = zip.file("photos.json");
    let photoCount = 0;
    if (photosMetaFile) {
      const photosMeta = JSON.parse(await photosMetaFile.async("text")) as Array<
        Record<string, unknown>
      >;
      for (const meta of photosMeta) {
        try {
          const ext = (meta.mimeType as string) === "image/png" ? "png" : "jpg";
          const imageFile = zip.file(`photos/${meta.id as string}.${ext}`);
          if (!imageFile) continue;
          const blob = await imageFile.async("blob");
          const rawExif = meta.exif as Record<string, unknown> | undefined;
          await photoRepo.restore({
            id: meta.id as string,
            pinId: meta.pinId as string,
            blob,
            mimeType: meta.mimeType as string,
            createdAt: new Date(meta.createdAt as string),
            hlc: createHlc(getNodeId()),
            exif: rawExif
              ? {
                  takenAt: rawExif.takenAt ? new Date(rawExif.takenAt as string) : undefined,
                  takenAtEstimated: rawExif.takenAtEstimated ? true : undefined,
                  cameraMake: rawExif.cameraMake as string | undefined,
                  cameraModel: rawExif.cameraModel as string | undefined,
                  fNumber: rawExif.fNumber as number | undefined,
                  exposureTime: rawExif.exposureTime as number | undefined,
                  focalLength: rawExif.focalLength as number | undefined,
                  iso: rawExif.iso as number | undefined,
                }
              : undefined,
            fileInfo: meta.fileInfo as
              | {
                  originalFileName?: string;
                  originalFileSize?: number;
                  originalLastModified?: number;
                }
              | undefined,
          });
          photoCount++;
        } catch {
          // スキップ
        }
      }
    }

    setInfoDialog({
      type: "success",
      message: `${pinCount}件のピンと${photoCount}枚の写真をインポートしました`,
    });
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 40,
          background: "var(--bg-primary)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 16px 12px",
            borderBottom: "1px solid var(--border-light)",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>設定</span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
              padding: 4,
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* コンテンツ */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
          {/* 地図情報 */}
          <SectionTitle label="地図情報" />

          <SettingRow
            icon={<RefreshCw size={18} />}
            label="最新情報に更新"
            description="POIキャッシュをクリアしてサーバーから最新の地図データを取得"
          >
            <button
              onClick={handleMapUpdate}
              disabled={mapUpdateStatus === "checking" || mapUpdateStatus === "done"}
              style={btnStyle(mapUpdateStatus === "done" ? "#16a34a" : "#6366f1")}
            >
              {mapUpdateStatus === "checking"
                ? "確認中…"
                : mapUpdateStatus === "done"
                  ? "完了 ✓"
                  : "更新する"}
            </button>
          </SettingRow>

          <div style={{ marginTop: 20 }} />

          {/* 地図検索 */}
          <SectionTitle label="地図検索" />

          <SettingRow
            icon={<Search size={18} />}
            label="地名・ランドマーク検索"
            description="地名や施設名で地図を移動できます（OpenStreetMap財団のサーバーに検索語が送信されます）"
          >
            <button
              role="switch"
              aria-checked={geocoderEnabled}
              onClick={() => {
                if (!geocoderEnabled) {
                  setShowGeocoderConsent(true);
                } else {
                  onGeocoderEnabledChange(false);
                }
              }}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                border: "none",
                background: geocoderEnabled ? "#6366f1" : "var(--border)",
                position: "relative",
                cursor: "pointer",
                transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: geocoderEnabled ? 23 : 3,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.2s",
                }}
              />
            </button>
          </SettingRow>

          <div style={{ marginTop: 20 }} />

          {/* クラウド同期セクション */}
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            クラウド同期
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                background: "#6366f1",
                color: "#fff",
                padding: "1px 6px",
                borderRadius: 4,
                letterSpacing: 0.5,
                textTransform: "none",
              }}
            >
              Pro
            </span>
            {/* 将来の「アップグレード」導線はここに追加 */}
          </p>

          {/* バックアップリマインダー */}
          {showBackupReminder && !backupReminderDismissed && (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                padding: "10px 12px",
                marginBottom: 12,
                background: "#fffbeb",
                border: "1px solid #fbbf24",
                borderRadius: 8,
              }}
            >
              <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ flex: 1, fontSize: 14, color: "#92400e", lineHeight: 1.5 }}>
                バックアップから30日以上経過しています。大切なデータを守るためにエクスポートを実行してください。
              </div>
              <button
                onClick={() => {
                  const today = new Date().toISOString().split("T")[0];
                  localStorage.setItem(BACKUP_REMINDER_KEY, today);
                  setBackupReminderDismissed(true);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#92400e",
                  flexShrink: 0,
                  padding: 2,
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          <SettingRow
            icon={<Cloud size={18} />}
            label="同期状態"
            description={
              authService.isLoggedIn()
                ? lastSyncAt
                  ? `最終同期: ${formatDateTime(lastSyncAt)}`
                  : "同期待機中"
                : "未設定"
            }
          >
            {authService.isLoggedIn() && hasSyncKey && onTriggerSync && (
              <button
                onClick={onTriggerSync}
                disabled={syncState === "syncing"}
                style={btnStyle("#6366f1")}
              >
                {syncState === "syncing" ? "同期中…" : "今すぐ同期"}
              </button>
            )}
          </SettingRow>

          {authService.isLoggedIn() ? (
            <>
              <SettingRow
                icon={<KeyRound size={18} />}
                label="パスフレーズ"
                description={hasSyncKey ? "鍵が設定されています" : "パスフレーズが必要です"}
              >
                <button onClick={onOpenSyncSetup} style={btnStyle("#6366f1")}>
                  {hasSyncKey ? "再入力" : "入力する"}
                </button>
              </SettingRow>

              {/* パスキー（2段階認証）管理 */}
              {hasSyncKey && syncRepository && (
                <div style={{ marginTop: 4 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 0",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <Fingerprint size={18} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                        2段階認証（パスキー）
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                        {passkeyCredentials.length === 0
                          ? "未設定"
                          : `${passkeyCredentials.length}台のデバイスで設定済み`}
                      </div>
                    </div>
                    {passkeySetupPhase === "idle" && (
                      <button onClick={handlePasskeySetupBegin} style={btnStyle("#6366f1")}>
                        <Plus size={13} style={{ marginRight: 2 }} />
                        追加
                      </button>
                    )}
                    {passkeySetupPhase === "creating" && (
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>作成中…</span>
                    )}
                  </div>

                  {/* 命名フェーズ */}
                  {passkeySetupPhase === "naming" && (
                    <div
                      style={{
                        padding: "10px 12px",
                        background: "var(--bg-secondary, #f5f5f5)",
                        borderRadius: 8,
                        marginBottom: 8,
                      }}
                    >
                      <p
                        style={{ margin: "0 0 8px", fontSize: 13, color: "var(--text-secondary)" }}
                      >
                        このデバイスの名前を入力してください
                      </p>
                      <input
                        type="text"
                        value={newDeviceName}
                        onChange={(e) => setNewDeviceName(e.target.value)}
                        placeholder="例: iPhone 15"
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          border: "1px solid var(--border)",
                          borderRadius: 6,
                          fontSize: 14,
                          background: "var(--input-bg)",
                          color: "var(--text-primary)",
                          boxSizing: "border-box",
                          marginBottom: 8,
                        }}
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => {
                            setPasskeySetupPhase("idle");
                            setPendingCredential(null);
                          }}
                          style={{ ...btnStyle("#888"), flex: 1 }}
                        >
                          キャンセル
                        </button>
                        <button
                          onClick={handlePasskeySetupComplete}
                          style={{ ...btnStyle("#6366f1"), flex: 2 }}
                        >
                          保存する
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 登録済みデバイス一覧 */}
                  {passkeyCredentials.map((cred) => (
                    <div
                      key={cred.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 0 6px 26px",
                        borderTop: "1px solid var(--border)",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: "var(--text-primary)" }}>
                          {cred.deviceName || "デバイス"}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                          {new Date(cred.createdAt).toLocaleDateString("ja-JP")}登録
                        </div>
                      </div>
                      <button
                        onClick={() => handlePasskeyDelete(cred.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 4,
                          color: "#ef4444",
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}

                  {passkeyError && (
                    <p style={{ margin: "6px 0 0", fontSize: 12, color: "#dc2626" }}>
                      {passkeyError}
                    </p>
                  )}
                </div>
              )}

              <SettingRow
                icon={<LogOut size={18} />}
                label="ログアウト"
                description={`${authService.getEmail() ?? ""}`}
              >
                <button onClick={handleLogout} style={btnStyle("#ef4444")}>
                  ログアウト
                </button>
              </SettingRow>
            </>
          ) : (
            <SettingRow
              icon={<Cloud size={18} />}
              label="同期を設定する"
              description="スマホとPCでデータを同期"
            >
              <button onClick={onOpenSyncSetup} style={btnStyle("#6366f1")}>
                設定する
              </button>
            </SettingRow>
          )}

          <div style={{ marginTop: 20 }} />

          {/* バックアップ */}
          <SectionTitle label="バックアップ" />

          <div
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              marginBottom: 8,
            }}
          >
            {lastExportAt
              ? `最終バックアップ: ${formatDateTime(new Date(lastExportAt))}`
              : "バックアップ未実施"}
          </div>

          {/* データ管理セクション */}
          <SectionTitle label="データ管理" />

          <SettingRow
            icon={<Download size={18} />}
            label="エクスポート"
            description="ピンデータをJSONファイルとして保存"
          >
            <button onClick={handleExportJson} disabled={isExporting} style={btnStyle("#1a1a2e")}>
              ピンのみ
            </button>
            <button onClick={handleExportZip} disabled={isExporting} style={btnStyle("#6366f1")}>
              写真込みZIP
            </button>
          </SettingRow>

          <SettingRow
            icon={<Upload size={18} />}
            label="インポート"
            description="JSON（ピンのみ）またはZIP（写真込み）から復元"
          >
            <label style={{ ...btnStyle("#22c55e"), cursor: "pointer" }}>
              {isImporting ? "読み込み中…" : "ファイルを選択"}
              <input
                type="file"
                accept=".json,.zip"
                style={{ display: "none" }}
                onChange={handleImport}
              />
            </label>
          </SettingRow>

          <div style={{ marginTop: 20 }} />

          {/* 地図テーマ */}
          <SectionTitle label="地図テーマ" />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 0",
              borderBottom: autoNightMode ? "none" : "1px solid var(--border-light)",
            }}
          >
            <span style={{ color: "var(--text-secondary)", flexShrink: 0 }}>
              <Sun size={18} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
                昼夜自動切り替え
              </div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                時刻に応じてライト/ダークマップを自動切替
              </div>
            </div>
            <button
              role="switch"
              aria-checked={autoNightMode}
              onClick={() => onAutoNightModeChange(!autoNightMode)}
              style={{
                flexShrink: 0,
                width: 44,
                height: 24,
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                background: autoNightMode ? "#6366f1" : "var(--border)",
                position: "relative",
                transition: "background 0.2s",
                padding: 0,
              }}
            >
              <span
                style={{
                  display: "block",
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#fff",
                  position: "absolute",
                  top: 3,
                  left: autoNightMode ? 23 : 3,
                  transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                }}
              />
            </button>
          </div>

          {autoNightMode && (
            <div
              style={{
                borderBottom: "1px solid var(--border-light)",
                paddingBottom: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 0 8px 30px",
                }}
              >
                <div style={{ flex: 1, fontSize: 14, color: "var(--text-secondary)" }}>
                  夜間開始
                </div>
                <input
                  type="time"
                  value={nightStart}
                  onChange={(e) => onNightStartChange(e.target.value)}
                  style={selectStyle}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 0 0 30px",
                }}
              >
                <div style={{ flex: 1, fontSize: 14, color: "var(--text-secondary)" }}>
                  夜間終了
                </div>
                <input
                  type="time"
                  value={nightEnd}
                  onChange={(e) => onNightEndChange(e.target.value)}
                  style={selectStyle}
                />
              </div>
            </div>
          )}

          <div style={{ marginTop: 20 }} />

          {/* ガイドメッセージ */}
          <SectionTitle label="ガイドメッセージ" />

          <SettingRow
            icon={<Newspaper size={18} />}
            label="ガイドメッセージ"
            description="地図上部に操作ガイドをスクロール表示"
          >
            <button
              role="switch"
              aria-checked={tickerEnabled}
              onClick={() => {
                const next = !tickerEnabled;
                setTickerEnabled(next);
                localStorage.setItem(TICKER_ENABLED_KEY, next ? "true" : "false");
              }}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                border: "none",
                background: tickerEnabled ? "#6366f1" : "var(--border)",
                position: "relative",
                cursor: "pointer",
                transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: tickerEnabled ? 23 : 3,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.2s",
                }}
              />
            </button>
          </SettingRow>

          {tickerEnabled && tickerCollapsed && (
            <SettingRow
              icon={<Newspaper size={18} />}
              label="再表示"
              description="折りたたんだガイドメッセージを再表示"
            >
              <button
                onClick={() => {
                  localStorage.setItem(TICKER_COLLAPSED_KEY, "false");
                  setTickerCollapsed(false);
                }}
                style={btnStyle("#6366f1")}
              >
                再表示する
              </button>
            </SettingRow>
          )}

          <div style={{ marginTop: 20 }} />

          {/* ゴミ箱設定 */}
          <SectionTitle label="ゴミ箱" />

          <SettingRow
            icon={<Clock size={18} />}
            label="保持期間"
            description="削除したピンを保持する日数"
          >
            <select
              value={trashRetentionDays}
              onChange={(e) => onTrashRetentionChange(Number(e.target.value))}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                fontSize: 15,
                outline: "none",
                cursor: "pointer",
                background: "var(--input-bg)",
                color: "var(--text-primary)",
              }}
            >
              {RETENTION_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}日
                </option>
              ))}
            </select>
          </SettingRow>

          <div style={{ marginTop: 20 }} />

          {/* 将来の機能（実装予定） */}
          <SectionTitle label="将来の機能" />

          <ComingSoonRow
            icon={<MapIcon size={18} />}
            label="オフラインマップ"
            description="エリアを保存してオフラインで地図を閲覧"
          />
          <ComingSoonRow
            icon={<Shield size={18} />}
            label="プライバシーゾーン"
            description="自宅・職場など特定の場所を自動で非公開に"
          />
          <ComingSoonRow
            icon={<Globe size={18} />}
            label="他人の公開マップを表示"
            description="他のユーザーが公開したピンを地図上に表示"
          />
        </div>
      </div>

      {/* 地図検索 同意ダイアログ */}
      {showGeocoderConsent && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              background: "var(--bg-primary)",
              borderRadius: 16,
              padding: "24px 20px",
              maxWidth: 360,
              width: "100%",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <h3
              style={{
                margin: "0 0 12px",
                fontSize: 16,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              地図検索を有効にしますか？
            </h3>
            <p
              style={{
                margin: "0 0 20px",
                fontSize: 15,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              この機能を使うと、入力した地名・施設名が
              <strong>OpenStreetMap財団のサーバー（Nominatim）</strong>
              に送信されます。通信内容はGoogle検索・Yahoo検索と同等で、リクエスト元のIPアドレスが含まれます。検索のたびにインターネット接続が発生します。写真・ピン・その他のアプリ内データは一切送信されません。
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowGeocoderConsent(false)}
                style={{
                  padding: "8px 16px",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  background: "var(--bg-primary)",
                  color: "var(--text-secondary)",
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  onGeocoderEnabledChange(true);
                  setShowGeocoderConsent(false);
                }}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: 8,
                  background: "#6366f1",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                有効にする
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 通知ダイアログ（成功・エラー） */}
      {infoDialog && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              background: "var(--bg-primary)",
              borderRadius: 16,
              padding: "24px 20px",
              maxWidth: 360,
              width: "100%",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            <h3
              style={{
                margin: "0 0 12px",
                fontSize: 16,
                fontWeight: 600,
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {infoDialog.type === "success" ? (
                <CheckCircle size={18} color="#22c55e" />
              ) : (
                <AlertCircle size={18} color="#ef4444" />
              )}
              {infoDialog.type === "success" ? "完了" : "エラー"}
            </h3>
            <p
              style={{
                margin: "0 0 20px",
                fontSize: 15,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              {infoDialog.message}
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setInfoDialog(null)}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: 8,
                  background: "#6366f1",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function dateStr(): string {
  return new Date().toISOString().split("T")[0];
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function formatDateTime(dateOrStr: Date | string): string {
  const d = typeof dateOrStr === "string" ? new Date(dateOrStr) : dateOrStr;
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${m}/${day} ${h}:${min}`;
}

const selectStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid var(--border)",
  fontSize: 15,
  outline: "none",
  cursor: "pointer",
  background: "var(--input-bg)",
  color: "var(--text-primary)",
};

function btnStyle(bg: string): React.CSSProperties {
  return {
    background: bg,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}

function SectionTitle({ label }: { label: string }) {
  return (
    <p
      style={{
        fontSize: 12,
        fontWeight: 700,
        color: "var(--text-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: 8,
      }}
    >
      {label}
    </p>
  );
}

function SettingRow({
  icon,
  label,
  description,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  description: string | React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 0",
        borderBottom: "1px solid var(--border-light)",
      }}
    >
      <span style={{ color: "var(--text-secondary)", flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{label}</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{description}</div>
      </div>
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function ComingSoonRow({
  icon,
  label,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 0",
        borderBottom: "1px solid var(--border-light)",
        opacity: 0.55,
      }}
    >
      <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-secondary)" }}>{label}</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{description}</div>
      </div>
      <span
        style={{
          fontSize: 12,
          background: "var(--pill-bg)",
          color: "var(--text-muted)",
          borderRadius: 10,
          padding: "3px 8px",
          flexShrink: 0,
          whiteSpace: "nowrap",
        }}
      >
        実装予定
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// パスキー登録ヘルパー（settings-sheet 用）
// ---------------------------------------------------------------------------

function base64UrlToArrayBuffer(s: string): ArrayBuffer {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  const b64 = pad === 0 ? padded : padded + "====".slice(pad);
  const raw = atob(b64);
  const buf = new ArrayBuffer(raw.length);
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return buf;
}

function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function createPasskeyCredential(
  options: PublicKeyCredentialCreationOptionsJSON
): Promise<RegistrationResponseJSON> {
  const credential = (await navigator.credentials.create({
    publicKey: {
      ...options,
      challenge: base64UrlToArrayBuffer(options.challenge),
      user: {
        ...options.user,
        id: base64UrlToArrayBuffer(options.user.id),
      },
      excludeCredentials: options.excludeCredentials?.map((c) => ({
        id: base64UrlToArrayBuffer(c.id),
        type: "public-key" as const,
      })),
    },
  })) as PublicKeyCredential | null;

  if (!credential) throw new Error("パスキーの作成がキャンセルされました");

  if (typeof credential.toJSON === "function") {
    return credential.toJSON() as RegistrationResponseJSON;
  }
  const resp = credential.response as AuthenticatorAttestationResponse;
  return {
    id: credential.id,
    rawId: uint8ArrayToBase64Url(new Uint8Array(credential.rawId)),
    response: {
      clientDataJSON: uint8ArrayToBase64Url(new Uint8Array(resp.clientDataJSON)),
      attestationObject: uint8ArrayToBase64Url(new Uint8Array(resp.attestationObject)),
      transports: (resp.getTransports?.() ?? []) as AuthenticatorTransportFuture[],
    },
    type: "public-key",
    clientExtensionResults: credential.getClientExtensionResults() as Record<string, unknown>,
  };
}

function getDefaultDeviceName(): string {
  const ua = navigator.userAgent;
  if (/iPhone/.test(ua)) return "iPhone";
  if (/iPad/.test(ua)) return "iPad";
  if (/Android/.test(ua)) return "Android";
  if (/Mac/.test(ua)) return "Mac";
  if (/Windows/.test(ua)) return "Windows PC";
  return "デバイス";
}
