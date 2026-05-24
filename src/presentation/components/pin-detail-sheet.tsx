import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Plus,
  Loader2,
  Pencil,
  ExternalLink,
  Download,
  Lock,
  AlertTriangle,
  Camera,
  Trash2,
  Square,
  CheckSquare,
} from "lucide-react";
import { normalizePhoto } from "@infrastructure/image/normalize-photo";
import { parseExif } from "@infrastructure/exif/exif-parser";
import { downloadPhoto } from "@infrastructure/image/write-exif";
import type { Pin, PinReaction, ShoppingItem } from "@domain/entities/pin";
import type { Photo, PhotoExif, PhotoFileInfo } from "@domain/entities/photo";
import type { PhotoRepository } from "@application/ports/photo-repository";
import type { SyncRepository } from "@application/ports/sync-repository";
import type { CryptoService } from "@application/ports/crypto-service";
import { PRESET_CATEGORIES, DEFAULT_CATEGORY } from "@domain/entities/category";

interface Props {
  pin: Pin;
  isNew?: boolean;
  photoRepo: PhotoRepository;
  onSave: (updated: Pin) => void;
  onClose: () => void;
  onCreateCopy?: (items: ShoppingItem[]) => void;
  sheetHeight: number;
  tagKeywords: string[];
  /** 写真遅延ロード用。未指定の場合はスキップ */
  syncRepository?: SyncRepository;
  /** 写真復号用暗号鍵。未指定の場合はスキップ */
  encryptionKey?: CryptoKey;
  /** 写真バイナリ復号サービス。未指定の場合はスキップ */
  cryptoService?: CryptoService;
}

const REACTION_OPTIONS: {
  value: PinReaction;
  emoji: string;
  label: string;
  color: string;
  bgColor: string;
}[] = [
  {
    value: "want_to_revisit",
    emoji: "😊",
    label: "また行きたい",
    color: "#22c55e",
    bgColor: "#f0fdf4",
  },
  {
    value: "once_was_enough",
    emoji: "😐",
    label: "一回でいいかな",
    color: "#f59e0b",
    bgColor: "#fffbeb",
  },
  {
    value: "never_again",
    emoji: "😩",
    label: "二度と行かない",
    color: "#ef4444",
    bgColor: "#fef2f2",
  },
];

function toDatetimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function PinDetailSheet({
  pin,
  isNew = false,
  photoRepo,
  onSave,
  onClose,
  onCreateCopy,
  tagKeywords,
  syncRepository,
  encryptionKey,
  cryptoService,
}: Props) {
  const [title, setTitle] = useState(pin.title);
  const [categoryId, setCategoryId] = useState(pin.categoryId ?? DEFAULT_CATEGORY.id);
  const [comment, setComment] = useState(pin.comment ?? "");
  const [tag, setTag] = useState(pin.tag ?? "");
  const [location, setLocation] = useState(pin.location ?? "");
  const [url, setUrl] = useState(pin.url ?? "");
  const [videoUrl, setVideoUrl] = useState(pin.videoUrl ?? "");
  const [takenAt, setTakenAt] = useState<string>(
    pin.exif?.takenAt ? toDatetimeLocal(pin.exif.takenAt) : ""
  );
  const [isEditingTakenAt, setIsEditingTakenAt] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoUrls, setPhotoUrls] = useState<Map<string, string>>(new Map());
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxItemPhotoId, setLightboxItemPhotoId] = useState<string | null>(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [pendingAddIds, setPendingAddIds] = useState<string[]>([]);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [addProgress, setAddProgress] = useState<{ current: number; total: number } | null>(null);
  const [allowPhotoDownload, setAllowPhotoDownload] = useState(pin.allowPhotoDownload ?? false);
  const [reaction, setReaction] = useState<PinReaction | undefined>(pin.reaction);
  const [thumbnailPhotoId, setThumbnailPhotoId] = useState<string | undefined>(
    pin.thumbnailPhotoId
  );
  const [isOtherInfoOpen, setIsOtherInfoOpen] = useState(false);
  const [photoComments, setPhotoComments] = useState<Map<string, string>>(new Map());
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(pin.shoppingItems ?? []);
  const [newItemName, setNewItemName] = useState("");
  const [pendingItemPhotoIds, setPendingItemPhotoIds] = useState<string[]>([]);
  const [activeItemPhotoId, setActiveItemPhotoId] = useState<string | null>(null);
  const itemFileInputRef = useRef<HTMLInputElement>(null);
  const [lbScale, setLbScale] = useState(1);
  const lbScaleRef = useRef(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const swipeDragRef = useRef<{ startX: number } | null>(null);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const filteredTagKeywords = useMemo(
    () =>
      tagKeywords.filter((kw) => tag.trim() === "" || kw.toLowerCase().includes(tag.toLowerCase())),
    [tagKeywords, tag]
  );
  const lbPointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchInitRef = useRef<{ dist: number; startScale: number } | null>(null);
  const initialPhotoCountRef = useRef<number | null>(null);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [isLoadingRemotePhotos, setIsLoadingRemotePhotos] = useState(false);

  const isDirty =
    title !== pin.title ||
    categoryId !== (pin.categoryId ?? DEFAULT_CATEGORY.id) ||
    comment !== (pin.comment ?? "") ||
    tag !== (pin.tag ?? "") ||
    location !== (pin.location ?? "") ||
    url !== (pin.url ?? "") ||
    videoUrl !== (pin.videoUrl ?? "") ||
    takenAt !== (pin.exif?.takenAt ? toDatetimeLocal(pin.exif.takenAt) : "") ||
    allowPhotoDownload !== (pin.allowPhotoDownload ?? false) ||
    reaction !== pin.reaction ||
    thumbnailPhotoId !== pin.thumbnailPhotoId ||
    pendingDeleteIds.length > 0 ||
    (initialPhotoCountRef.current !== null && photos.length > initialPhotoCountRef.current) ||
    Array.from(photoComments.entries()).some(
      ([id, c]) => c.trim() !== (photos.find((p) => p.id === id)?.comment?.trim() ?? "")
    ) ||
    JSON.stringify(shoppingItems) !== JSON.stringify(pin.shoppingItems ?? []);

  const doClose = async () => {
    const toDelete = [...pendingAddIds, ...pendingItemPhotoIds];
    if (toDelete.length > 0) {
      await Promise.all(toDelete.map((id) => photoRepo.delete(id)));
    }
    onClose();
  };

  const handleClose = () => {
    if (isDirty) {
      setShowCloseConfirm(true);
      return;
    }
    doClose();
  };

  const currentCategory = PRESET_CATEGORIES.find((c) => c.id === categoryId) ?? DEFAULT_CATEGORY;

  useEffect(() => {
    let cancelled = false;
    photoRepo.findByPinId(pin.id).then(async (result) => {
      if (!cancelled) {
        setPhotos(result);
        setPhotoComments(new Map(result.map((p) => [p.id, p.comment ?? ""])));
        initialPhotoCountRef.current = result.length;
      }

      // EXIFが未保存の写真はblobから再抽出してDBと状態を更新する
      const needsExif = result.filter((p) => !p.exif && p.blob);
      if (needsExif.length === 0) return;
      const updated = new Map(result.map((p) => [p.id, p]));
      let anyUpdated = false;
      for (const photo of needsExif) {
        if (cancelled) break;
        try {
          const exifData = await parseExif(photo.blob);
          const hasFields =
            exifData.takenAt ||
            exifData.cameraMake ||
            exifData.fNumber != null ||
            exifData.exposureTime != null ||
            exifData.focalLength != null ||
            exifData.iso != null;
          if (!hasFields) continue;
          const exif: PhotoExif = {
            takenAt: exifData.takenAt,
            takenAtEstimated: undefined,
            cameraMake: exifData.cameraMake,
            cameraModel: exifData.cameraModel,
            fNumber: exifData.fNumber,
            exposureTime: exifData.exposureTime,
            focalLength: exifData.focalLength,
            iso: exifData.iso,
          };
          await photoRepo.updateExif(photo.id, exif);
          updated.set(photo.id, { ...photo, exif });
          anyUpdated = true;
        } catch {
          // 個別写真の失敗は無視
        }
      }
      if (anyUpdated && !cancelled) {
        setPhotos(result.map((p) => updated.get(p.id) ?? p));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [pin.id, photoRepo]);

  // 遅延ロード: サーバー側にあってローカルにない写真を取得して復元する
  useEffect(() => {
    if (!syncRepository || !encryptionKey || !cryptoService) return;

    let cancelled = false;

    const loadRemotePhotos = async () => {
      setIsLoadingRemotePhotos(true);
      try {
        const [remoteList, localPhotos] = await Promise.all([
          syncRepository.fetchPhotoList(pin.id),
          photoRepo.findByPinId(pin.id),
        ]);

        const localIds = new Set(localPhotos.map((p) => p.id));
        const missingIds = remoteList.filter((r) => !localIds.has(r.id)).map((r) => r.id);

        if (missingIds.length === 0 || cancelled) return;

        const restoredPhotos: Photo[] = [];
        for (const photoId of missingIds) {
          if (cancelled) break;
          try {
            const encryptedBuffer = await syncRepository.fetchPhotoBinary(photoId);
            const decryptedBuffer = await cryptoService.decryptBinary(
              encryptionKey,
              encryptedBuffer
            );
            const blob = new Blob([decryptedBuffer], { type: "image/jpeg" });
            const remoteRecord = remoteList.find((r) => r.id === photoId);
            let restoredExif: PhotoExif | undefined;
            try {
              const exifData = await parseExif(blob);
              const hasFields =
                exifData.takenAt ||
                exifData.cameraMake ||
                exifData.fNumber != null ||
                exifData.exposureTime != null ||
                exifData.focalLength != null ||
                exifData.iso != null;
              if (hasFields) {
                restoredExif = {
                  takenAt: exifData.takenAt ?? new Date(remoteRecord?.hlcPhysical ?? Date.now()),
                  takenAtEstimated: exifData.takenAt == null ? true : undefined,
                  cameraMake: exifData.cameraMake,
                  cameraModel: exifData.cameraModel,
                  fNumber: exifData.fNumber,
                  exposureTime: exifData.exposureTime,
                  focalLength: exifData.focalLength,
                  iso: exifData.iso,
                };
              }
            } catch {
              // EXIF抽出失敗は無視
            }
            let restoredShoppingItemId: string | undefined;
            if (remoteRecord?.encryptedMeta && remoteRecord?.metaIv && cryptoService) {
              try {
                const metaJson = await cryptoService.decrypt(
                  encryptionKey!,
                  remoteRecord.encryptedMeta,
                  remoteRecord.metaIv
                );
                const meta = JSON.parse(metaJson) as { data?: { shoppingItemId?: string } };
                restoredShoppingItemId = meta.data?.shoppingItemId;
              } catch {
                // メタデータ復号失敗は無視
              }
            }
            const photo: Photo = {
              id: photoId,
              pinId: pin.id,
              blob,
              mimeType: "image/jpeg",
              exif: restoredExif,
              createdAt: new Date(remoteRecord?.hlcPhysical ?? Date.now()),
              hlc: {
                physical: remoteRecord?.hlcPhysical ?? Date.now(),
                logical: remoteRecord?.hlcLogical ?? 0,
                nodeId: "remote",
              },
              syncedAt: new Date(),
              shoppingItemId: restoredShoppingItemId,
            };
            await photoRepo.restore(photo);
            restoredPhotos.push(photo);
          } catch (err) {
            console.warn("[pin-detail-sheet] Failed to fetch remote photo:", photoId, err);
          }
        }

        if (!cancelled && restoredPhotos.length > 0) {
          const updated = await photoRepo.findByPinId(pin.id);
          setPhotos(updated);
          setPhotoComments((prev) => {
            const next = new Map(prev);
            restoredPhotos.forEach((p) => {
              if (!next.has(p.id)) next.set(p.id, p.comment ?? "");
            });
            return next;
          });
        }
      } catch (err) {
        if (!cancelled) {
          console.warn("[pin-detail-sheet] Failed to load remote photos:", err);
        }
      } finally {
        if (!cancelled) setIsLoadingRemotePhotos(false);
      }
    };

    loadRemotePhotos();

    return () => {
      cancelled = true;
    };
    // syncRepository / encryptionKey / cryptoService は起動時に固定されるため deps から除外
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin.id, photoRepo]);

  useEffect(() => {
    const urls = new Map(photos.map((p) => [p.id, URL.createObjectURL(p.blob)]));
    setPhotoUrls(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [photos]);

  const handleSave = async () => {
    setPendingAddIds([]);
    setPendingItemPhotoIds([]);
    await Promise.all(pendingDeleteIds.map((id) => photoRepo.delete(id)));
    if (syncRepository && pendingDeleteIds.length > 0) {
      await Promise.all(
        pendingDeleteIds.map((id) => syncRepository.deletePhoto(id).catch(() => {}))
      );
    }
    await Promise.all(
      Array.from(photoComments.entries())
        .filter(([id, c]) => c.trim() !== (photos.find((p) => p.id === id)?.comment?.trim() ?? ""))
        .map(([id, c]) => photoRepo.updateComment(id, c.trim() || undefined))
    );
    const updatedExif = pin.exif
      ? {
          ...pin.exif,
          takenAt: takenAt ? new Date(takenAt) : undefined,
          takenAtEstimated: undefined,
        }
      : takenAt
        ? { takenAt: new Date(takenAt), takenAtEstimated: undefined }
        : undefined;
    onSave({
      ...pin,
      title: title.trim() || pin.title,
      categoryId,
      comment: comment.trim() || undefined,
      tag: tag.trim() || undefined,
      location: location.trim() || undefined,
      url: url.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      exif: updatedExif,
      allowPhotoDownload,
      reaction,
      thumbnailPhotoId,
      shoppingItems: shoppingItems.length > 0 ? shoppingItems : undefined,
    });
  };

  const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setIsAddingPhoto(true);
    setAddProgress({ current: 0, total: files.length });
    try {
      for (let i = 0; i < files.length; i++) {
        setAddProgress({ current: i + 1, total: files.length });
        const file = files[i];
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
        setPendingAddIds((prev) => [...prev, saved.id]);
      }
    } finally {
      setIsAddingPhoto(false);
      setAddProgress(null);
      e.target.value = "";
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    setPendingDeleteIds((prev) => [...prev, photoId]);
  };

  const addShoppingItem = () => {
    const name = newItemName.trim();
    if (!name) return;
    setShoppingItems((prev) => [...prev, { id: crypto.randomUUID(), name, checked: false }]);
    setNewItemName("");
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const deleteShoppingItem = (id: string) => {
    const photo = itemPhotoMap.get(id);
    if (photo) {
      setPendingDeleteIds((prev) => [...prev, photo.id]);
    }
    setShoppingItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCheckedItems = () => {
    shoppingItems
      .filter((item) => item.checked)
      .forEach((item) => {
        const photo = itemPhotoMap.get(item.id);
        if (photo) setPendingDeleteIds((prev) => [...prev, photo.id]);
      });
    setShoppingItems((prev) => prev.filter((item) => !item.checked));
  };

  const handleItemPhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeItemPhotoId || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const { blob, mimeType } = await normalizePhoto(file);
    const existing = itemPhotoMap.get(activeItemPhotoId);
    if (existing) {
      setPendingDeleteIds((prev) => [...prev, existing.id]);
      setPhotos((prev) => prev.filter((p) => p.id !== existing.id));
    }
    const saved = await photoRepo.saveForShoppingItem(pin.id, activeItemPhotoId, blob, mimeType);
    setPhotos((prev) => [...prev, saved]);
    setPendingItemPhotoIds((prev) => [...prev, saved.id]);
    setShoppingItems((prev) =>
      prev.map((item) => (item.id === activeItemPhotoId ? { ...item, photoId: saved.id } : item))
    );
    setActiveItemPhotoId(null);
    e.target.value = "";
  };

  const visiblePhotos = photos.filter((p) => !pendingDeleteIds.includes(p.id) && !p.shoppingItemId);
  const itemPhotoMap = new Map(
    photos.filter((p) => p.shoppingItemId != null).map((p) => [p.shoppingItemId!, p])
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && lightboxIndex < visiblePhotos.length - 1) {
        setLightboxIndex(lightboxIndex + 1);
      } else if (e.key === "ArrowLeft" && lightboxIndex > 0) {
        setLightboxIndex(lightboxIndex - 1);
      } else if (e.key === "Escape") {
        setLightboxIndex(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, visiblePhotos.length]);

  useEffect(() => {
    lbScaleRef.current = 1;
    setLbScale(1);
    lbPointers.current.clear();
    pinchInitRef.current = null;
  }, [lightboxIndex]);

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
          background: "rgba(0,0,0,0.15)",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div
          style={{
            background: "var(--bg-primary)",
            borderRadius: "16px 16px 0 0",
            display: "flex",
            flexDirection: "column",
            height: Math.round(window.innerHeight * 0.75),
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
            <span style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
              {pin.title}の詳細
            </span>
            <button
              onClick={handleClose}
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
              padding: "16px 16px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* 撮影日時 */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                <label style={{ fontSize: 14, color: "var(--text-secondary)" }}>撮影日時</label>
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
                    border: "2px solid var(--border)",
                    fontSize: 12,
                    outline: "none",
                    background: "var(--input-bg)",
                    color: "var(--text-primary)",
                  }}
                />
              ) : (
                <span style={{ fontSize: 15, color: "var(--text-primary)" }}>
                  {takenAt ? new Date(takenAt).toLocaleString("ja-JP") : "未設定"}
                  {pin.exif?.takenAtEstimated && (
                    <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 4 }}>
                      （推定）
                    </span>
                  )}
                </span>
              )}
            </div>

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
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <label style={{ fontSize: 14, color: "var(--text-secondary)" }}>写真</label>
                  {isLoadingRemotePhotos && (
                    <Loader2
                      size={14}
                      className="spin"
                      style={{ color: "var(--text-secondary)" }}
                      aria-label="リモート写真を取得中"
                    />
                  )}
                </div>

                <button
                  onClick={() => !isAddingPhoto && fileInputRef.current?.click()}
                  disabled={isAddingPhoto}
                  style={{
                    background: isAddingPhoto ? "var(--bg-tertiary)" : "var(--pill-bg)",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 16px",
                    fontSize: 14,
                    cursor: isAddingPhoto ? "default" : "pointer",
                    color: "var(--pill-text)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {isAddingPhoto ? (
                    <>
                      <Loader2 size={16} className="spin" />
                      {addProgress && addProgress.total > 1
                        ? `${addProgress.current}/${addProgress.total}枚追加中...`
                        : "追加中..."}
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      写真を追加
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.heic,.heif"
                  multiple
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
                      <div
                        key={photo.id}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          flexShrink: 0,
                          gap: 4,
                        }}
                      >
                        <div style={{ position: "relative" }}>
                          <img
                            src={url}
                            alt=""
                            onClick={() => setLightboxIndex(visiblePhotos.indexOf(photo))}
                            style={{
                              width: 100,
                              height: 100,
                              objectFit: "cover",
                              borderRadius: 8,
                              display: "block",
                              cursor: "zoom-in",
                              outline:
                                (thumbnailPhotoId ?? visiblePhotos[0]?.id) === photo.id
                                  ? "2px solid #f59e0b"
                                  : "none",
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
                            onClick={() =>
                              setThumbnailPhotoId(
                                (thumbnailPhotoId ?? visiblePhotos[0]?.id) === photo.id
                                  ? undefined
                                  : photo.id
                              )
                            }
                            title="一覧のサムネイルに設定"
                            style={{
                              position: "absolute",
                              bottom: 4,
                              left: 4,
                              background: "rgba(0,0,0,0.45)",
                              border: "none",
                              borderRadius: 4,
                              padding: "1px 4px",
                              fontSize: 13,
                              cursor: "pointer",
                              lineHeight: 1,
                              color:
                                (thumbnailPhotoId ?? visiblePhotos[0]?.id) === photo.id
                                  ? "#f59e0b"
                                  : "rgba(255,255,255,0.6)",
                            }}
                          >
                            {(thumbnailPhotoId ?? visiblePhotos[0]?.id) === photo.id ? "★" : "☆"}
                          </button>
                        </div>
                        {photo.exif?.takenAt && (
                          <span
                            style={{
                              fontSize: 10,
                              color: "var(--text-muted)",
                              whiteSpace: "nowrap",
                              lineHeight: 1.3,
                              textAlign: "center",
                              maxWidth: 100,
                            }}
                          >
                            {photo.exif.takenAt.toLocaleString("ja-JP", {
                              month: "numeric",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {photo.exif.takenAtEstimated && (
                              <span style={{ color: "var(--text-muted)" }}> 推定</span>
                            )}
                          </span>
                        )}
                        <input
                          type="text"
                          value={photoComments.get(photo.id) ?? ""}
                          onChange={(e) =>
                            setPhotoComments((prev) => new Map(prev).set(photo.id, e.target.value))
                          }
                          placeholder="コメントを追加…"
                          style={{
                            width: 100,
                            padding: "3px 6px",
                            borderRadius: 5,
                            border: "1px solid var(--border)",
                            fontSize: 10,
                            outline: "none",
                            background: "var(--input-bg)",
                            color: "var(--text-primary)",
                            boxSizing: "border-box",
                          }}
                        />
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
                  fontSize: 14,
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
                  border: "2px solid var(--border)",
                  fontSize: 17,
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
                  fontSize: 14,
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
                  border: "2px solid var(--border)",
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

            {/* 買い物リスト（ショッピングカテゴリーのみ） */}
            {categoryId === "shopping" && (
              <div>
                <input
                  ref={itemFileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleItemPhotoSelect}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 8,
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: 16 }}>🛍️</span>
                  <span style={{ fontSize: 14, color: "var(--text-secondary)", fontWeight: 600 }}>
                    買い物リスト
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <input
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addShoppingItem();
                      }
                    }}
                    placeholder="品物を入力…"
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "2px solid var(--border)",
                      fontSize: 14,
                      outline: "none",
                      background: "var(--input-bg)",
                      color: "var(--text-primary)",
                    }}
                  />
                  <button
                    onClick={addShoppingItem}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: "none",
                      background: "#d946ef",
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    追加
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {shoppingItems.map((item) => {
                    const itemPhoto = itemPhotoMap.get(item.id);
                    const itemPhotoUrl = itemPhoto ? photoUrls.get(itemPhoto.id) : undefined;
                    return (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "6px 8px",
                          borderRadius: 8,
                          background: "var(--bg-secondary, rgba(0,0,0,.04))",
                        }}
                      >
                        <button
                          onClick={() => {
                            setActiveItemPhotoId(item.id);
                            itemFileInputRef.current?.click();
                          }}
                          title="写真を追加"
                          style={{
                            flexShrink: 0,
                            width: 32,
                            height: 32,
                            borderRadius: 6,
                            border: "1.5px dashed var(--border)",
                            background: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            padding: 0,
                          }}
                        >
                          {itemPhotoUrl ? (
                            <img
                              src={itemPhotoUrl}
                              style={{ width: 32, height: 32, objectFit: "cover" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (itemPhoto) setLightboxItemPhotoId(itemPhoto.id);
                              }}
                            />
                          ) : (
                            <Camera size={14} color="var(--text-secondary)" />
                          )}
                        </button>
                        <button
                          onClick={() => toggleShoppingItem(item.id)}
                          style={{
                            flexShrink: 0,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            color: item.checked ? "#d946ef" : "var(--text-secondary)",
                          }}
                        >
                          {item.checked ? <CheckSquare size={20} /> : <Square size={20} />}
                        </button>
                        <span
                          style={{
                            flex: 1,
                            fontSize: 14,
                            color: "var(--text-primary)",
                            textDecoration: item.checked ? "line-through" : "none",
                            opacity: item.checked ? 0.5 : 1,
                          }}
                        >
                          {item.name}
                        </span>
                        <button
                          onClick={() => deleteShoppingItem(item.id)}
                          style={{
                            flexShrink: 0,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 4,
                            display: "flex",
                            alignItems: "center",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  {shoppingItems.some((i) => i.checked) && (
                    <button
                      onClick={clearCheckedItems}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 8,
                        border: "1.5px solid var(--border)",
                        background: "none",
                        fontSize: 13,
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                      }}
                    >
                      チェック済みを削除
                    </button>
                  )}
                  {onCreateCopy && shoppingItems.length > 0 && !isNew && (
                    <button
                      onClick={() => {
                        const copied = shoppingItems.map((item) => ({
                          ...item,
                          id: crypto.randomUUID(),
                          checked: false,
                          photoId: undefined,
                        }));
                        onCreateCopy(copied);
                      }}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 8,
                        border: "1.5px solid #d946ef",
                        background: "none",
                        fontSize: 13,
                        color: "#d946ef",
                        cursor: "pointer",
                      }}
                    >
                      このリストをコピーして新規作成
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* マイタグ */}
            <div>
              <label
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                マイタグ
              </label>
              <div style={{ position: "relative" }}>
                <input
                  value={tag}
                  onChange={(e) => {
                    setTag(e.target.value);
                    setTagDropdownOpen(true);
                  }}
                  onFocus={() => setTagDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setTagDropdownOpen(false), 150)}
                  placeholder="例：夏祭り、家族旅行、卒業式…"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "2px solid var(--border)",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    background: "var(--input-bg)",
                    color: "var(--text-primary)",
                  }}
                />
                {tagDropdownOpen && filteredTagKeywords.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 100,
                      background: "var(--bg-primary)",
                      border: "2px solid var(--border)",
                      borderRadius: 8,
                      maxHeight: 180,
                      overflowY: "auto",
                      boxShadow: "0 4px 12px rgba(0,0,0,.15)",
                    }}
                  >
                    {filteredTagKeywords.map((kw) => (
                      <div
                        key={kw}
                        onMouseDown={() => {
                          setTag(kw);
                          setTagDropdownOpen(false);
                        }}
                        style={{
                          padding: "10px 12px",
                          cursor: "pointer",
                          fontSize: 14,
                          color: "var(--text-primary)",
                        }}
                      >
                        {kw}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* カテゴリー選択 */}
            <div>
              <label
                style={{
                  fontSize: 14,
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

            {/* リアクション */}
            <div>
              <label
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  display: "block",
                  marginBottom: 8,
                }}
              >
                評価
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                {REACTION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setReaction(reaction === opt.value ? undefined : opt.value)}
                    style={{
                      flex: 1,
                      border:
                        reaction === opt.value
                          ? `2px solid ${opt.color}`
                          : "2px solid var(--border)",
                      borderRadius: 10,
                      padding: "8px 4px",
                      fontSize: 13,
                      cursor: "pointer",
                      background: reaction === opt.value ? opt.bgColor : "var(--bg-primary)",
                      color: reaction === opt.value ? opt.color : "var(--text-secondary)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{opt.emoji}</span>
                    <span style={{ fontSize: 10, lineHeight: 1.3, textAlign: "center" }}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 補足情報（アコーディオン） */}
            <div>
              <button
                onClick={() => setIsOtherInfoOpen((v) => !v)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "none",
                  border: "none",
                  padding: "4px 0",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  fontSize: 14,
                }}
              >
                <span>補足情報</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {isOtherInfoOpen ? "▲" : "▼"}
                </span>
              </button>
              {isOtherInfoOpen && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 12 }}>
                  {/* 撮影場所 */}
                  <div>
                    <label
                      style={{
                        fontSize: 14,
                        color: "var(--text-secondary)",
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      撮影場所
                    </label>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="地名を入力…"
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: 8,
                        border: "2px solid var(--border)",
                        fontSize: 14,
                        outline: "none",
                        boxSizing: "border-box",
                        background: "var(--input-bg)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                  {/* 外部リンク */}
                  <div>
                    <label
                      style={{
                        fontSize: 14,
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
                          border: "2px solid var(--border)",
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
                  {/* 関連動画 */}
                  <div>
                    <label
                      style={{
                        fontSize: 14,
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
                          border: "2px solid var(--border)",
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
                  {/* ダウンロード許可トグル */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "4px 0",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Lock size={14} color="var(--text-secondary)" />
                      <span style={{ fontSize: 14, color: "var(--text-primary)" }}>
                        写真のダウンロードを許可
                      </span>
                    </div>
                    <div
                      onClick={() => setAllowPhotoDownload((v) => !v)}
                      style={{
                        width: 44,
                        height: 24,
                        borderRadius: 12,
                        background: allowPhotoDownload ? "#22c55e" : "var(--border)",
                        position: "relative",
                        cursor: "pointer",
                        flexShrink: 0,
                        transition: "background 0.2s",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 2,
                          left: allowPhotoDownload ? 22 : 2,
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "#fff",
                          transition: "left 0.2s",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        }}
                      />
                    </div>
                  </div>
                  {/* 記録情報 */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <InfoRow label="作成日時" value={pin.createdAt.toLocaleString("ja-JP")} />
                    <InfoRow
                      label="座標"
                      value={`${pin.coordinates.lat.toFixed(5)}, ${pin.coordinates.lng.toFixed(5)}`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* フッター固定ボタン */}
          <div
            style={{
              flexShrink: 0,
              borderTop: "1px solid var(--border)",
              padding: "12px 16px",
              display: "flex",
              gap: 8,
            }}
          >
            <button
              onClick={handleClose}
              style={{
                flex: 1,
                background: "var(--bg-tertiary)",
                border: "none",
                borderRadius: 10,
                padding: "12px 0",
                fontSize: 14,
                cursor: "pointer",
                color: "var(--text-primary)",
              }}
            >
              閉じる
            </button>
            <button
              onClick={handleSave}
              disabled={!isNew && !isDirty}
              style={{
                flex: 2,
                background: isNew || isDirty ? currentCategory.markerColor : "var(--bg-tertiary)",
                border: "none",
                borderRadius: 10,
                padding: "12px 0",
                fontSize: 15,
                fontWeight: 700,
                cursor: isNew || isDirty ? "pointer" : "default",
                color: isNew || isDirty ? "#fff" : "var(--text-muted)",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              保存
            </button>
          </div>
        </div>
      </div>
      {lightboxIndex !== null &&
        (() => {
          const lbPhoto = visiblePhotos[lightboxIndex];
          const lbUrl = lbPhoto ? photoUrls.get(lbPhoto.id) : undefined;
          const lbExif = lbPhoto?.exif;
          const lbComment = lbPhoto ? photoComments.get(lbPhoto.id) || undefined : undefined;
          return createPortal(
            <div
              onPointerDown={(e) => {
                lbPointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
                if (lbPointers.current.size === 2) {
                  const pts = Array.from(lbPointers.current.values());
                  const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
                  pinchInitRef.current = { dist, startScale: lbScaleRef.current };
                  swipeDragRef.current = null;
                } else {
                  swipeDragRef.current = { startX: e.clientX };
                }
              }}
              onPointerMove={(e) => {
                lbPointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
                if (pinchInitRef.current && lbPointers.current.size >= 2) {
                  const pts = Array.from(lbPointers.current.values());
                  const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
                  const newScale = Math.min(
                    5,
                    Math.max(
                      0.5,
                      (pinchInitRef.current.startScale * dist) / pinchInitRef.current.dist
                    )
                  );
                  lbScaleRef.current = newScale;
                  setLbScale(newScale);
                }
              }}
              onPointerUp={(e) => {
                lbPointers.current.delete(e.pointerId);
                if (lbPointers.current.size === 1) {
                  pinchInitRef.current = null;
                  swipeDragRef.current = { startX: e.clientX };
                  return;
                }
                if (lbPointers.current.size > 0) return;
                pinchInitRef.current = null;
                if (!swipeDragRef.current) return;
                const dx = e.clientX - swipeDragRef.current.startX;
                swipeDragRef.current = null;
                if (lbScaleRef.current > 1.05) return;
                if (dx < -50 && lightboxIndex < visiblePhotos.length - 1) {
                  setLightboxIndex(lightboxIndex + 1);
                } else if (dx > 50 && lightboxIndex > 0) {
                  setLightboxIndex(lightboxIndex - 1);
                } else if (Math.abs(dx) < 10) {
                  setLightboxIndex(null);
                }
              }}
              onPointerCancel={(e) => {
                lbPointers.current.delete(e.pointerId);
                swipeDragRef.current = null;
                pinchInitRef.current = null;
              }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                background: "rgba(0,0,0,0.92)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                touchAction: "none",
                userSelect: "none",
              }}
            >
              {lbUrl && (
                <img
                  src={lbUrl}
                  alt=""
                  style={{
                    maxWidth: "100%",
                    maxHeight: "80%",
                    objectFit: "contain",
                    transform: `scale(${lbScale})`,
                    transformOrigin: "center center",
                    transition: pinchInitRef.current ? "none" : "transform 0.1s",
                  }}
                />
              )}
              <button
                onClick={() => setLightboxIndex(null)}
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
              {allowPhotoDownload && (
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    downloadPhoto(visiblePhotos[lightboxIndex]).catch(() => {});
                  }}
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 60,
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Download size={18} />
                </button>
              )}
              {lightboxIndex > 0 && (
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => setLightboxIndex(lightboxIndex - 1)}
                  style={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    borderRadius: "50%",
                    width: 44,
                    height: 44,
                    color: "#fff",
                    fontSize: 24,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ‹
                </button>
              )}
              {lightboxIndex < visiblePhotos.length - 1 && (
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => setLightboxIndex(lightboxIndex + 1)}
                  style={{
                    position: "absolute",
                    right: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    borderRadius: "50%",
                    width: 44,
                    height: 44,
                    color: "#fff",
                    fontSize: 24,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ›
                </button>
              )}
              {visiblePhotos.length > 1 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: lbExif || lbComment ? 80 : 24,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 13,
                    pointerEvents: "none",
                  }}
                >
                  {lightboxIndex + 1} / {visiblePhotos.length}
                </div>
              )}
              {(lbComment || lbExif) && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    right: 16,
                    color: "rgba(255,255,255,0.75)",
                    fontSize: 11,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    pointerEvents: "none",
                  }}
                >
                  {lbComment && (
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.95)",
                        marginBottom: lbExif ? 4 : 0,
                      }}
                    >
                      {lbComment}
                    </span>
                  )}
                  {lbExif && (
                    <>
                      {(lbExif.cameraMake || lbExif.cameraModel) && (
                        <span>
                          {[lbExif.cameraMake, lbExif.cameraModel].filter(Boolean).join(" ")}
                        </span>
                      )}
                      {lbExif.fNumber != null && <span>f/{lbExif.fNumber}</span>}
                      {lbExif.exposureTime != null && (
                        <span>{formatShutter(lbExif.exposureTime)}</span>
                      )}
                      {lbExif.focalLength != null && <span>{lbExif.focalLength}mm</span>}
                      {lbExif.iso != null && <span>ISO {lbExif.iso}</span>}
                      {lbExif.takenAt && (
                        <span>{new Date(lbExif.takenAt).toLocaleString("ja-JP")}</span>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>,
            document.body
          );
        })()}
      {lightboxItemPhotoId !== null &&
        (() => {
          const lbUrl = photoUrls.get(lightboxItemPhotoId);
          return createPortal(
            <div
              onClick={() => setLightboxItemPhotoId(null)}
              onKeyDown={(e) => e.key === "Escape" && setLightboxItemPhotoId(null)}
              role="dialog"
              tabIndex={-1}
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
              {lbUrl && (
                <img
                  src={lbUrl}
                  alt=""
                  onClick={(e) => e.stopPropagation()}
                  style={{ maxWidth: "100%", maxHeight: "90%", objectFit: "contain" }}
                />
              )}
              <button
                onClick={() => setLightboxItemPhotoId(null)}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "rgba(0,0,0,0.5)",
                  border: "none",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                <X size={20} />
              </button>
            </div>,
            document.body
          );
        })()}
      {showCloseConfirm &&
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 10000,
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
                <AlertTriangle size={18} color="#f59e0b" />
                閉じますか？
              </h3>
              <p
                style={{
                  margin: "0 0 20px",
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                編集中の内容が保存されていません。閉じると変更は失われます。
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                  onClick={() => setShowCloseConfirm(false)}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    background: "var(--bg-primary)",
                    color: "var(--text-secondary)",
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  キャンセル
                </button>
                <button
                  onClick={() => {
                    setShowCloseConfirm(false);
                    doClose();
                  }}
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: 8,
                    background: "#ef4444",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  閉じる
                </button>
              </div>
            </div>
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
