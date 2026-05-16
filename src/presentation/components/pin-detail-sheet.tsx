import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Loader2, Map as MapIcon, Pencil, ExternalLink } from "lucide-react";
import { normalizePhoto } from "@infrastructure/image/normalize-photo";
import { parseExif } from "@infrastructure/exif/exif-parser";
import type { Pin } from "@domain/entities/pin";
import type { Photo, PhotoExif, PhotoFileInfo } from "@domain/entities/photo";
import type { PhotoRepository } from "@application/ports/photo-repository";
import { PRESET_CATEGORIES, DEFAULT_CATEGORY } from "@domain/entities/category";

interface Props {
  pin: Pin;
  photoRepo: PhotoRepository;
  onSave: (updated: Pin) => void;
  onClose: () => void;
  onFlyTo: (pin: Pin) => void;
  onSplitPhoto: (photo: Photo) => Promise<void>;
  sheetHeight: number;
}

function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function PinDetailSheet({
  pin,
  photoRepo,
  onSave,
  onClose,
  onFlyTo,
  onSplitPhoto,
  sheetHeight,
}: Props) {
  const [title, setTitle] = useState(pin.title);
  const [categoryId, setCategoryId] = useState(pin.categoryId ?? DEFAULT_CATEGORY.id);
  const [comment, setComment] = useState(pin.comment ?? "");
  const [url, setUrl] = useState(pin.url ?? "");
  const [videoUrl, setVideoUrl] = useState(pin.videoUrl ?? "");
  const [takenAt, setTakenAt] = useState<string>(
    pin.exif?.takenAt ? toDatetimeLocal(pin.exif.takenAt) : ""
  );
  const [isEditingTakenAt, setIsEditingTakenAt] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoUrls, setPhotoUrls] = useState<Map<string, string>>(new Map());
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentCategory = PRESET_CATEGORIES.find((c) => c.id === categoryId) ?? DEFAULT_CATEGORY;

  useEffect(() => {
    let cancelled = false;
    photoRepo.findByPinId(pin.id).then((result) => {
      if (!cancelled) setPhotos(result);
    });
    return () => {
      cancelled = true;
    };
  }, [pin.id, photoRepo]);

  useEffect(() => {
    const urls = new Map(photos.map((p) => [p.id, URL.createObjectURL(p.blob)]));
    setPhotoUrls(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [photos]);

  const handleSave = async () => {
    await Promise.all(pendingDeleteIds.map((id) => photoRepo.delete(id)));
    const updatedExif = pin.exif
      ? {
          ...pin.exif,
          takenAt: takenAt ? new Date(takenAt) : undefined,
          takenAtEstimated: undefined,
        }
      : undefined;
    onSave({
      ...pin,
      title: title.trim() || pin.title,
      categoryId,
      comment: comment.trim() || undefined,
      url: url.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      exif: updatedExif,
    });
  };

  const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsAddingPhoto(true);
    try {
      const { blob, mimeType } = await normalizePhoto(file);
      let photoExif: PhotoExif | undefined;
      try {
        const exifData = await parseExif(file);
        const takenAtEstimated = exifData.takenAt == null;
        photoExif = {
          takenAt: exifData.takenAt ?? new Date(file.lastModified),
          takenAtEstimated: takenAtEstimated ? true : undefined,
          cameraMake: exifData.cameraMake,
          cameraModel: exifData.cameraModel,
          fNumber: exifData.fNumber,
          exposureTime: exifData.exposureTime,
          focalLength: exifData.focalLength,
          iso: exifData.iso,
        };
      } catch {
        // Exif取得失敗は無視
      }
      const fileInfo: PhotoFileInfo = {
        originalFileName: file.name,
        originalFileSize: file.size,
        originalLastModified: file.lastModified,
      };
      const saved = await photoRepo.save(pin.id, blob, mimeType, photoExif, fileInfo);
      setPhotos((prev) => [...prev, saved]);
    } finally {
      setIsAddingPhoto(false);
      e.target.value = "";
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    setPendingDeleteIds((prev) => [...prev, photoId]);
  };

  const visiblePhotos = photos.filter((p) => !pendingDeleteIds.includes(p.id));

  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 30,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "rgba(0,0,0,0.4)",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          style={{
            background: "var(--bg-primary)",
            borderRadius: "16px 16px 0 0",
            display: "flex",
            flexDirection: "column",
            height: Math.max(sheetHeight, Math.round(window.innerHeight * 0.5)),
          }}
        >
          {/* ヘッダー（固定） */}
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
            <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
              {pin.title}の詳細
            </span>
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
              <X size={20} />
            </button>
          </div>

          {/* スクロール可能なコンテンツ */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 16px 32px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* 写真プレビュー */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>写真</label>

                <button
                  onClick={() => !isAddingPhoto && fileInputRef.current?.click()}
                  disabled={isAddingPhoto}
                  style={{
                    background: isAddingPhoto ? "var(--bg-tertiary)" : "var(--pill-bg)",
                    border: "none",
                    borderRadius: 6,
                    padding: "4px 10px",
                    fontSize: 12,
                    cursor: isAddingPhoto ? "default" : "pointer",
                    color: "var(--pill-text)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {isAddingPhoto ? (
                    <>
                      <Loader2 size={14} className="spin" />
                      変換中
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      追加
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.heic,.heif"
                  style={{ display: "none" }}
                  onChange={handleAddPhoto}
                />
              </div>
              {visiblePhotos.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    overflowX: "auto",
                    paddingBottom: 4,
                  }}
                >
                  {visiblePhotos.map((photo) => {
                    const url = photoUrls.get(photo.id);
                    if (!url) return null;
                    return (
                      <div key={photo.id} style={{ position: "relative", flexShrink: 0 }}>
                        <img
                          src={url}
                          alt=""
                          onClick={() => setLightboxUrl(url)}
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                            borderRadius: 8,
                            display: "block",
                            cursor: "zoom-in",
                          }}
                        />
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          style={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            background: "rgba(0,0,0,0.5)",
                            border: "none",
                            borderRadius: "50%",
                            width: 20,
                            height: 20,
                            color: "#fff",
                            fontSize: 10,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            lineHeight: 1,
                          }}
                        >
                          ✕
                        </button>
                        <button
                          onClick={() => onSplitPhoto(photo)}
                          style={{
                            position: "absolute",
                            top: 4,
                            left: 4,
                            background: "rgba(0,0,0,0.5)",
                            border: "none",
                            borderRadius: 4,
                            padding: "2px 5px",
                            color: "#fff",
                            fontSize: 9,
                            cursor: "pointer",
                            lineHeight: 1.4,
                          }}
                        >
                          分割
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    textAlign: "center",
                    margin: "8px 0",
                  }}
                >
                  写真がありません
                </p>
              )}
            </div>

            {/* タイトル編集 */}
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                タイトル
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1.5px solid var(--border)",
                  fontSize: 15,
                  outline: "none",
                  boxSizing: "border-box",
                  background: "var(--input-bg)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* コメント */}
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                コメント
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="メモを入力…"
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1.5px solid var(--border)",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                  resize: "vertical",
                  fontFamily: "inherit",
                  color: "var(--text-primary)",
                  background: "var(--input-bg)",
                }}
              />
            </div>

            {/* 外部リンク */}
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                外部リンク
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1.5px solid var(--border)",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    background: "var(--input-bg)",
                    color: "var(--text-primary)",
                  }}
                />
                {url.trim() && (
                  <a
                    href={url.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 42,
                      borderRadius: 8,
                      background: "var(--pill-bg)",
                      color: "var(--pill-text)",
                      flexShrink: 0,
                      textDecoration: "none",
                    }}
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* 関連動画リンク */}
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                関連動画
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1.5px solid var(--border)",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    background: "var(--input-bg)",
                    color: "var(--text-primary)",
                  }}
                />
                {videoUrl.trim() && (
                  <a
                    href={videoUrl.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 42,
                      borderRadius: 8,
                      background: "var(--pill-bg)",
                      color: "var(--pill-text)",
                      flexShrink: 0,
                      textDecoration: "none",
                    }}
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* カテゴリー選択 */}
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                カテゴリー
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {PRESET_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    style={{
                      border: "none",
                      borderRadius: 18,
                      padding: "6px 14px",
                      fontSize: 13,
                      cursor: "pointer",
                      fontWeight: categoryId === cat.id ? 700 : 400,
                      background: categoryId === cat.id ? cat.markerColor : "var(--pill-bg)",
                      color: categoryId === cat.id ? "#fff" : "var(--pill-text)",
                      transition: "all 0.15s",
                    }}
                  >
                    {cat.emoji} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 撮影情報 */}
            {pin.exif && (
              <div>
                <label
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  撮影情報
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>撮影日時</span>
                      {!isEditingTakenAt && (
                        <button
                          onClick={() => setIsEditingTakenAt(true)}
                          style={{
                            background: "none",
                            border: "none",
                            padding: 2,
                            cursor: "pointer",
                            color: "var(--text-muted)",
                            display: "flex",
                            alignItems: "center",
                          }}
                          title="撮影日時を編集"
                        >
                          <Pencil size={11} />
                        </button>
                      )}
                    </div>
                    {isEditingTakenAt ? (
                      <input
                        type="datetime-local"
                        value={takenAt}
                        onChange={(e) => setTakenAt(e.target.value)}
                        autoFocus
                        style={{
                          padding: "4px 8px",
                          borderRadius: 6,
                          border: "1.5px solid var(--border)",
                          fontSize: 12,
                          outline: "none",
                          background: "var(--input-bg)",
                          color: "var(--text-primary)",
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: 13, color: "var(--text-primary)" }}>
                        {takenAt ? new Date(takenAt).toLocaleString("ja-JP") : "—"}
                        {pin.exif.takenAtEstimated && (
                          <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 4 }}>
                            （推定）
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                  {(pin.exif.cameraMake || pin.exif.cameraModel) && (
                    <InfoRow
                      label="カメラ"
                      value={[pin.exif.cameraMake, pin.exif.cameraModel].filter(Boolean).join(" ")}
                    />
                  )}
                  {pin.exif.fNumber != null && (
                    <InfoRow label="F値" value={`f/${pin.exif.fNumber}`} />
                  )}
                  {pin.exif.exposureTime != null && (
                    <InfoRow label="シャッター" value={formatShutter(pin.exif.exposureTime)} />
                  )}
                  {pin.exif.focalLength != null && (
                    <InfoRow label="焦点距離" value={`${pin.exif.focalLength}mm`} />
                  )}
                  {pin.exif.iso != null && <InfoRow label="ISO" value={`ISO ${pin.exif.iso}`} />}
                </div>
              </div>
            )}

            {/* メタ情報 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <InfoRow label="作成日時" value={pin.createdAt.toLocaleString("ja-JP")} />
              <InfoRow
                label="座標"
                value={`${pin.coordinates.lat.toFixed(5)}, ${pin.coordinates.lng.toFixed(5)}`}
              />
            </div>

            {/* アクションボタン */}
            <button
              onClick={() => {
                onFlyTo(pin);
                onClose();
              }}
              style={{
                background: "var(--bg-tertiary)",
                border: "none",
                borderRadius: 10,
                padding: "12px 0",
                fontSize: 14,
                cursor: "pointer",
                color: "var(--text-primary)",
              }}
            >
              <MapIcon size={15} style={{ marginRight: 6, verticalAlign: "middle" }} />
              地図で見る
            </button>
            <button
              onClick={handleSave}
              style={{
                background: currentCategory.markerColor,
                border: "none",
                borderRadius: 10,
                padding: "12px 0",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                color: "#fff",
              }}
            >
              保存
            </button>
          </div>
        </div>
      </div>
      {lightboxUrl &&
        createPortal(
          <div
            onClick={() => setLightboxUrl(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(0,0,0,0.92)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={lightboxUrl}
              alt=""
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
            <button
              onClick={() => setLightboxUrl(null)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "50%",
                width: 36,
                height: 36,
                color: "#fff",
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>,
          document.body
        )}
    </>
  );
}

function formatShutter(v: number): string {
  if (v >= 1) return `${v}s`;
  return `1/${Math.round(1 / v)}s`;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{label}</span>
      <span style={{ fontSize: 13, color: "var(--text-primary)" }}>{value}</span>
    </div>
  );
}
