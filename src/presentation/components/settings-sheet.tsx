import { useState } from "react";
import { X, Download, Upload, Clock, Map, Shield, Globe, ArrowUpDown, Eye } from "lucide-react";
import type { PinRepository } from "@application/ports/pin-repository";
import type { PhotoRepository } from "@application/ports/photo-repository";

interface Props {
  pinRepo: PinRepository;
  photoRepo: PhotoRepository;
  onClose: () => void;
  trashRetentionDays: number;
  onTrashRetentionChange: (days: number) => void;
  sortOrder: "date" | "title";
  onSortOrderChange: (v: "date" | "title") => void;
  listScope: "all" | "visible";
  onListScopeChange: (v: "all" | "visible") => void;
}

const RETENTION_OPTIONS = [7, 14, 30, 60, 90] as const;

export function SettingsSheet({
  pinRepo,
  photoRepo,
  onClose,
  trashRetentionDays,
  onTrashRetentionChange,
  sortOrder,
  onSortOrderChange,
  listScope,
  onListScopeChange,
}: Props) {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

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
    } catch {
      alert("インポートに失敗しました。正しいファイルを選択してください。");
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
        });
        count++;
      } catch {
        // スキップ
      }
    }
    alert(`${count}件のピンをインポートしました`);
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

    alert(`${pinCount}件のピンと${photoCount}枚の写真をインポートしました`);
  };

  return (
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

        {/* 一覧設定 */}
        <SectionTitle label="一覧" />

        <SettingRow
          icon={<ArrowUpDown size={18} />}
          label="ソート順"
          description="ピン一覧の並び順"
        >
          <select
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as "date" | "title")}
            style={selectStyle}
          >
            <option value="date">日付順</option>
            <option value="title">タイトル順</option>
          </select>
        </SettingRow>

        <SettingRow
          icon={<Eye size={18} />}
          label="表示範囲"
          description="一覧に表示するピンの範囲"
        >
          <select
            value={listScope}
            onChange={(e) => onListScopeChange(e.target.value as "all" | "visible")}
            style={selectStyle}
          >
            <option value="all">すべて</option>
            <option value="visible">地図表示範囲のみ</option>
          </select>
        </SettingRow>

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
              fontSize: 14,
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
          icon={<Map size={18} />}
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

const selectStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderRadius: 8,
  border: "1px solid var(--border)",
  fontSize: 14,
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
    fontSize: 13,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
}

function SectionTitle({ label }: { label: string }) {
  return (
    <p
      style={{
        fontSize: 11,
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
  description: string;
  children: React.ReactNode;
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
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{label}</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{description}</div>
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
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)" }}>{label}</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{description}</div>
      </div>
      <span
        style={{
          fontSize: 11,
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
