import { useRef, useState, useCallback, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMap } from "@infrastructure/map/use-map";
import type { Pin, PinExif } from "@domain/entities/pin";
import type { Photo, PhotoExif, PhotoFileInfo } from "@domain/entities/photo";
import { parseExif } from "@infrastructure/exif/exif-parser";
import { dexiePinRepository } from "@infrastructure/persistence/dexie-pin-repository";
import { addPin } from "@application/use-cases/add-pin";
import { softDeletePin } from "@application/use-cases/soft-delete-pin";
import { restorePin } from "@application/use-cases/restore-pin";
import { hardDeletePin } from "@application/use-cases/hard-delete-pin";
import { updatePin } from "@application/use-cases/update-pin";
import { dexiePhotoRepository } from "@infrastructure/persistence/dexie-photo-repository";
import { normalizePhoto } from "@infrastructure/image/normalize-photo";
import { DEFAULT_CATEGORY, PRESET_CATEGORIES, type Category } from "@domain/entities/category";
import { PhotoUploadButton } from "./photo-upload-button";
import { CategorySelector } from "./category-selector";
import { PinListSheet } from "./pin-list-sheet";
import { PinDetailSheet } from "./pin-detail-sheet";
import { ClusterSheet } from "./cluster-sheet";
import { CurrentLocationButton } from "./current-location-button";
import { SettingsSheet } from "./settings-sheet";
import { Settings } from "lucide-react";

const repo = dexiePinRepository;

const SHEET_HEIGHT_KEY = "kodawarimap:sheet-height";
const TRASH_RETENTION_KEY = "kodawarimap:trash-retention-days";
const SORT_ORDER_KEY = "kodawarimap:sort-order";
const LIST_SCOPE_KEY = "kodawarimap:list-scope";

function getInitialSheetHeight(): number {
  const raw = parseInt(localStorage.getItem(SHEET_HEIGHT_KEY) ?? "0", 10);
  const fallback = Math.round(window.innerHeight * 0.4);
  return Math.max(44, Math.min(raw || fallback, window.innerHeight * 0.8));
}

function getInitialTrashRetentionDays(): number {
  return parseInt(localStorage.getItem(TRASH_RETENTION_KEY) ?? "30", 10);
}

type SortOrder = "date" | "title";
type ListScope = "all" | "visible";

type MapBounds = { west: number; east: number; south: number; north: number };

const CATEGORY_MERGE_RADIUS: Record<string, number> = {
  general: 50,
  hiking: 100,
  night: 30,
  fishing: 30,
  food: 5,
};

function getMergeRadius(categoryId: string): number {
  return CATEGORY_MERGE_RADIUS[categoryId] ?? 30;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function distanceMeters(a: { lng: number; lat: number }, b: { lng: number; lat: number }): number {
  const R = 6371000;
  const φ1 = (a.lat * Math.PI) / 180;
  const φ2 = (b.lat * Math.PI) / 180;
  const Δφ = ((b.lat - a.lat) * Math.PI) / 180;
  const Δλ = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function createMarker(
  map: maplibregl.Map,
  pin: Pin,
  color: string,
  onPinClick: (pin: Pin) => void,
  onPinLongPress: (pin: Pin) => void
): maplibregl.Marker {
  const marker = new maplibregl.Marker({ color })
    .setLngLat([pin.coordinates.lng, pin.coordinates.lat])
    .addTo(map);
  const el = marker.getElement();
  el.style.cursor = "pointer";

  let lpTimer: ReturnType<typeof setTimeout> | null = null;
  let didLongPress = false;

  el.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    didLongPress = false;
    lpTimer = setTimeout(() => {
      lpTimer = null;
      didLongPress = true;
      onPinLongPress(pin);
    }, 600);
  });
  el.addEventListener("pointerup", () => {
    if (lpTimer) {
      clearTimeout(lpTimer);
      lpTimer = null;
    }
  });
  el.addEventListener("pointermove", () => {
    if (lpTimer) {
      clearTimeout(lpTimer);
      lpTimer = null;
    }
  });
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    if (didLongPress) {
      didLongPress = false;
      return;
    }
    onPinClick(pin);
  });

  const titleEl = document.createElement("span");
  titleEl.textContent = pin.title;
  const popup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: 30,
  }).setDOMContent(titleEl);

  el.addEventListener("mouseenter", () => {
    popup.setLngLat([pin.coordinates.lng, pin.coordinates.lat]).addTo(map);
  });
  el.addEventListener("mouseleave", () => {
    popup.remove();
  });

  return marker;
}

function createClusterMarker(
  map: maplibregl.Map,
  lng: number,
  lat: number,
  clusterPins: Pin[],
  color: string,
  onClick: (pins: Pin[]) => void
): maplibregl.Marker {
  const el = document.createElement("div");
  el.style.cssText = [
    "width:36px",
    "height:36px",
    "border-radius:50%",
    `background:${color}`,
    "border:3px solid white",
    "box-shadow:0 2px 6px rgba(0,0,0,0.35)",
    "display:flex",
    "align-items:center",
    "justify-content:center",
    "cursor:pointer",
    "font-size:13px",
    "font-weight:700",
    "color:white",
    "user-select:none",
  ].join(";");
  el.textContent = String(clusterPins.length);
  el.addEventListener("pointerdown", (e) => e.stopPropagation());
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    onClick(clusterPins);
  });
  return new maplibregl.Marker({ element: el }).setLngLat([lng, lat]).addTo(map);
}

function categoryColor(categoryId?: string): string {
  return (
    PRESET_CATEGORIES.find((c) => c.id === categoryId)?.markerColor ?? DEFAULT_CATEGORY.markerColor
  );
}

type ProvisionalPinData = {
  blob: Blob;
  mimeType: string;
  photoExif: PhotoExif;
  fileInfo: PhotoFileInfo;
  title: string;
  categoryId: string;
  pinExif: PinExif;
  initialCoordinates: { lng: number; lat: number };
};

type MergeProposalData = {
  targetPin: Pin;
  blob: Blob;
  mimeType: string;
  photoExif: PhotoExif;
  fileInfo: PhotoFileInfo;
  provisionalData: ProvisionalPinData;
};

export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const clusterMarkersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const provisionalMarkerRef = useRef<maplibregl.Marker | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [deletedPins, setDeletedPins] = useState<Pin[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>(DEFAULT_CATEGORY);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [clusterPins, setClusterPins] = useState<Pin[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sheetHeight, setSheetHeight] = useState<number>(getInitialSheetHeight);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [trashRetentionDays, setTrashRetentionDays] = useState<number>(
    getInitialTrashRetentionDays
  );
  const [longPressPin, setLongPressPin] = useState<Pin | null>(null);
  const longPressPinRef = useRef<Pin | null>(null);
  longPressPinRef.current = longPressPin;
  const [provisionalPinData, setProvisionalPinData] = useState<ProvisionalPinData | null>(null);
  const [mergeProposalData, setMergeProposalData] = useState<MergeProposalData | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    () => (localStorage.getItem(SORT_ORDER_KEY) as SortOrder) ?? "date"
  );
  const [listScope, setListScope] = useState<ListScope>(
    () => (localStorage.getItem(LIST_SCOPE_KEY) as ListScope) ?? "all"
  );
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);

  const handleSheetHeightChange = useCallback((h: number) => {
    setSheetHeight(h);
    localStorage.setItem(SHEET_HEIGHT_KEY, String(h));
  }, []);

  const handleTrashRetentionChange = useCallback((days: number) => {
    setTrashRetentionDays(days);
    localStorage.setItem(TRASH_RETENTION_KEY, String(days));
  }, []);

  const handleSortOrderChange = useCallback((order: SortOrder) => {
    setSortOrder(order);
    localStorage.setItem(SORT_ORDER_KEY, order);
  }, []);

  const handleListScopeChange = useCallback((scope: ListScope) => {
    setListScope(scope);
    localStorage.setItem(LIST_SCOPE_KEY, scope);
  }, []);

  const showMessage = useCallback((text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const refreshLists = useCallback(async () => {
    const [active, deleted] = await Promise.all([repo.findAll(), repo.findDeleted()]);
    setPins(active);
    setDeletedPins(deleted);
    return active;
  }, []);

  const syncMarkers = useCallback((map: maplibregl.Map, currentPins: Pin[]) => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();
    clusterMarkersRef.current.forEach((m) => m.remove());
    clusterMarkersRef.current.clear();

    const groups = new Map<string, Pin[]>();
    for (const pin of currentPins) {
      const key = `${pin.coordinates.lng},${pin.coordinates.lat}`;
      const g = groups.get(key) ?? [];
      g.push(pin);
      groups.set(key, g);
    }

    for (const [key, group] of groups) {
      const [lng, lat] = key.split(",").map(Number);
      const color = categoryColor(group[0].categoryId);
      if (group.length === 1) {
        const m = createMarker(map, group[0], color, setSelectedPin, setLongPressPin);
        markersRef.current.set(group[0].id, m);
      } else {
        const m = createClusterMarker(map, lng, lat, group, color, setClusterPins);
        clusterMarkersRef.current.set(key, m);
      }
    }
  }, []);

  const handleMapClick = useCallback(
    async (lng: number, lat: number) => {
      const pin = await addPin(repo, { lng, lat }, `ピン ${pins.length + 1}`, category.id);
      setPins((prev) => [...prev, pin]);
    },
    [pins.length, category]
  );

  const handlePhoto = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      try {
        const exif = await parseExif(file);

        if (!exif.coordinates) {
          showMessage("GPS情報が見つかりませんでした。地図をタップして場所を指定してください。");
          return;
        }

        const { lng, lat } = exif.coordinates;
        const { blob, mimeType } = await normalizePhoto(file);

        const takenAtEstimated = exif.takenAt == null;
        const resolvedTakenAt = exif.takenAt ?? new Date(file.lastModified);

        const photoExif: PhotoExif = {
          takenAt: resolvedTakenAt,
          takenAtEstimated: takenAtEstimated ? true : undefined,
          cameraMake: exif.cameraMake,
          cameraModel: exif.cameraModel,
          fNumber: exif.fNumber,
          exposureTime: exif.exposureTime,
          focalLength: exif.focalLength,
          iso: exif.iso,
        };
        const fileInfo: PhotoFileInfo = {
          originalFileName: file.name,
          originalFileSize: file.size,
          originalLastModified: file.lastModified,
        };
        const pinExif: PinExif = {
          takenAt: resolvedTakenAt,
          takenAtEstimated: takenAtEstimated ? true : undefined,
          cameraMake: exif.cameraMake,
          cameraModel: exif.cameraModel,
          fNumber: exif.fNumber,
          exposureTime: exif.exposureTime,
          focalLength: exif.focalLength,
          iso: exif.iso,
        };

        // 近傍ピンを検索
        const mergeRadius = getMergeRadius(category.id);
        const nearbyPins = pins
          .map((p) => ({ pin: p, dist: distanceMeters(p.coordinates, { lng, lat }) }))
          .filter(({ dist }) => dist <= mergeRadius)
          .sort((a, b) => a.dist - b.dist)
          .map(({ pin }) => pin);

        const title = nearbyPins[0]?.title ?? file.name.replace(/\.[^.]+$/, "");
        const inheritedCategoryId = nearbyPins[0]?.categoryId ?? category.id;

        const provisionalData: ProvisionalPinData = {
          blob,
          mimeType,
          photoExif,
          fileInfo,
          title,
          categoryId: inheritedCategoryId,
          pinExif,
          initialCoordinates: { lng, lat },
        };

        // 同日の近傍ピンがあればマージ確認を表示
        const sameDayPin =
          nearbyPins.find((p) => p.exif?.takenAt && isSameDay(p.exif.takenAt, resolvedTakenAt)) ??
          (exif.takenAt == null ? nearbyPins[0] : undefined);

        const map = mapRef.current;
        if (!map) return;

        if (sameDayPin) {
          setMergeProposalData({
            targetPin: sameDayPin,
            blob,
            mimeType,
            photoExif,
            fileInfo,
            provisionalData,
          });
          map.flyTo({
            center: [sameDayPin.coordinates.lng, sameDayPin.coordinates.lat],
            zoom: 16,
            padding: { bottom: sheetHeight },
          });
          return;
        }

        // 近傍なし or 別日 → 仮置きモード
        if (provisionalMarkerRef.current) {
          provisionalMarkerRef.current.remove();
          provisionalMarkerRef.current = null;
        }
        const marker = new maplibregl.Marker({ color: "#f59e0b", draggable: true })
          .setLngLat([lng, lat])
          .addTo(map);
        provisionalMarkerRef.current = marker;

        setProvisionalPinData(provisionalData);
        map.flyTo({ center: [lng, lat], zoom: 16, padding: { bottom: sheetHeight } });
      } catch (err) {
        console.error("写真の処理中にエラーが発生しました:", err);
        showMessage("写真の読み込みに失敗しました。対応形式: JPEG, PNG, HEIC");
      } finally {
        setIsProcessing(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showMessage, category, pins, sheetHeight]
  );

  const handleConfirmProvisional = useCallback(async () => {
    const marker = provisionalMarkerRef.current;
    if (!provisionalPinData || !marker) return;
    const { lng, lat } = marker.getLngLat();
    const { blob, mimeType, photoExif, fileInfo, title, categoryId, pinExif } = provisionalPinData;
    try {
      const pin = await addPin(repo, { lng, lat }, title, categoryId, pinExif);
      await dexiePhotoRepository.save(pin.id, blob, mimeType, photoExif, fileInfo);
      setPins((prev) => [...prev, pin]);
      marker.remove();
      provisionalMarkerRef.current = null;
      setProvisionalPinData(null);
      setSelectedPin(pin);
      showMessage(`📍 ${pin.title} をプロットしました`);
    } catch (err) {
      console.error("ピンの保存中にエラーが発生しました:", err);
      showMessage("保存に失敗しました");
    }
  }, [provisionalPinData, showMessage]);

  const handleCancelProvisional = useCallback(() => {
    if (provisionalMarkerRef.current) {
      provisionalMarkerRef.current.remove();
      provisionalMarkerRef.current = null;
    }
    setProvisionalPinData(null);
  }, []);

  const handleConfirmMerge = useCallback(async () => {
    if (!mergeProposalData) return;
    const { targetPin, blob, mimeType, photoExif, fileInfo } = mergeProposalData;
    try {
      await dexiePhotoRepository.save(targetPin.id, blob, mimeType, photoExif, fileInfo);
      setMergeProposalData(null);
      setSelectedPin(targetPin);
      showMessage(`📸 「${targetPin.title}」に写真を追加しました`);
    } catch (err) {
      console.error("写真の追加中にエラーが発生しました:", err);
      showMessage("保存に失敗しました");
    }
  }, [mergeProposalData, showMessage]);

  const handleRejectMerge = useCallback(() => {
    if (!mergeProposalData) return;
    const { provisionalData } = mergeProposalData;
    setMergeProposalData(null);

    const map = mapRef.current;
    if (!map) return;

    if (provisionalMarkerRef.current) {
      provisionalMarkerRef.current.remove();
      provisionalMarkerRef.current = null;
    }
    const { lng, lat } = provisionalData.initialCoordinates;
    const marker = new maplibregl.Marker({ color: "#f59e0b", draggable: true })
      .setLngLat([lng, lat])
      .addTo(map);
    provisionalMarkerRef.current = marker;
    setProvisionalPinData(provisionalData);
    map.flyTo({ center: [lng, lat], zoom: 16, padding: { bottom: sheetHeight } });
  }, [mergeProposalData, sheetHeight]);

  const handlePinFlyTo = useCallback(
    (pin: Pin) => {
      const map = mapRef.current;
      if (!map) return;
      const detailHeight = Math.max(sheetHeight, Math.round(window.innerHeight * 0.5));
      const visibleHeight = window.innerHeight - detailHeight;
      map.flyTo({
        center: [pin.coordinates.lng, pin.coordinates.lat],
        zoom: 16,
        padding: { bottom: detailHeight },
        offset: [0, Math.round(visibleHeight * 0.25)],
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sheetHeight]
  );

  const handleLocate = useCallback(
    (lng: number, lat: number) => {
      const map = mapRef.current;
      if (map) map.flyTo({ center: [lng, lat], zoom: 16, padding: { bottom: sheetHeight } });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sheetHeight]
  );

  const handleDelete = useCallback(
    async (pin: Pin) => {
      await softDeletePin(repo, pin.id);
      await refreshLists();
      showMessage(`「${pin.title}」をゴミ箱に移動しました`);
    },
    [refreshLists, showMessage]
  );

  const handleHardDelete = useCallback(
    async (pin: Pin) => {
      await dexiePhotoRepository.deleteByPinId(pin.id);
      await hardDeletePin(repo, pin.id);
      await refreshLists();
      showMessage(`「${pin.title}」を完全削除しました`);
    },
    [refreshLists, showMessage]
  );

  const handleHardDeleteAll = useCallback(async () => {
    for (const pin of deletedPins) {
      await dexiePhotoRepository.deleteByPinId(pin.id);
      await hardDeletePin(repo, pin.id);
    }
    await refreshLists();
    showMessage("ゴミ箱を空にしました");
  }, [deletedPins, refreshLists, showMessage]);

  const handleRestore = useCallback(
    async (pin: Pin) => {
      await restorePin(repo, pin.id);
      await refreshLists();
      showMessage(`「${pin.title}」を復元しました`);
    },
    [refreshLists, showMessage]
  );

  const handleDetailSave = useCallback(
    async (updated: Pin) => {
      await updatePin(repo, updated, {
        title: updated.title,
        categoryId: updated.categoryId,
        comment: updated.comment,
        url: updated.url,
        videoUrl: updated.videoUrl,
        exif: updated.exif,
      });
      await refreshLists();
      setSelectedPin(null);
      showMessage(`「${updated.title}」を更新しました`);
    },
    [refreshLists, showMessage]
  );

  const handleSplitPhoto = useCallback(
    async (photo: Photo, sourcePin: Pin) => {
      await dexiePhotoRepository.delete(photo.id);
      const newPinExif = photo.exif
        ? {
            takenAt: photo.exif.takenAt,
            cameraMake: photo.exif.cameraMake,
            cameraModel: photo.exif.cameraModel,
            fNumber: photo.exif.fNumber,
            exposureTime: photo.exif.exposureTime,
            focalLength: photo.exif.focalLength,
            iso: photo.exif.iso,
          }
        : undefined;
      const newPin = await addPin(
        repo,
        sourcePin.coordinates,
        sourcePin.title,
        sourcePin.categoryId,
        newPinExif
      );
      await dexiePhotoRepository.save(newPin.id, photo.blob, photo.mimeType, photo.exif);
      await refreshLists();
      setSelectedPin(null);
      showMessage(`写真を新しいピンに分割しました`);
    },
    [refreshLists, showMessage]
  );

  const handleMapClickWithDismiss = useCallback(
    (lng: number, lat: number) => {
      if (longPressPinRef.current) {
        setLongPressPin(null);
        return;
      }
      handleMapClick(lng, lat);
    },
    [handleMapClick]
  );

  const mapRef = useMap(
    containerRef,
    handleMapClickWithDismiss,
    category.styleUrl,
    () => sheetHeight
  );

  // sheetHeight 変化時にMapLibreのキャンバスをリサイズ
  useEffect(() => {
    mapRef.current?.resize();
  }, [sheetHeight, mapRef]);

  // 起動時にDBからピンを復元 + 期限切れパージ
  useEffect(() => {
    let cancelled = false;
    const markers = markersRef.current;
    const clusterMarkers = clusterMarkersRef.current;

    repo.purgeExpired(trashRetentionDays).then(async () => {
      if (cancelled) return;
      const [active, deleted] = await Promise.all([repo.findAll(), repo.findDeleted()]);
      if (cancelled) return;
      setPins(active);
      setDeletedPins(deleted);

      const updateBounds = (map: maplibregl.Map) => {
        const b = map.getBounds();
        setMapBounds({
          west: b.getWest(),
          east: b.getEast(),
          south: b.getSouth(),
          north: b.getNorth(),
        });
      };

      const tryPlot = () => {
        if (cancelled) return;
        const map = mapRef.current;
        if (!map) {
          setTimeout(tryPlot, 100);
          return;
        }
        if (!map.isStyleLoaded()) {
          map.once("load", () => {
            if (!cancelled) {
              syncMarkers(map, active);
              updateBounds(map);
              map.on("moveend", () => updateBounds(map));
            }
          });
        } else {
          syncMarkers(map, active);
          updateBounds(map);
          map.on("moveend", () => updateBounds(map));
        }
      };
      tryPlot();
    });

    return () => {
      cancelled = true;
      markers.forEach((m) => m.remove());
      markers.clear();
      clusterMarkers.forEach((m) => m.remove());
      clusterMarkers.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // pins 変化時にマーカーを再同期（起動後の追加・削除・復元に対応）
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    syncMarkers(map, pins);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pins, syncMarkers]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={containerRef} style={{ width: "100%", height: `calc(100vh - ${sheetHeight}px)` }} />
      <PhotoUploadButton onFile={handlePhoto} loading={isProcessing} />
      <CategorySelector selected={category} onChange={setCategory} bottom={sheetHeight + 8} />

      {/* 設定ボタン */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        style={{
          position: "absolute",
          top: 16,
          right: 52,
          zIndex: 10,
          background: "var(--bg-primary)",
          border: "none",
          borderRadius: 8,
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 8px var(--shadow)",
        }}
        title="設定"
      >
        <Settings size={18} color="var(--text-secondary)" />
      </button>

      <CurrentLocationButton onLocate={handleLocate} onError={showMessage} />

      <PinListSheet
        pins={pins}
        deletedPins={deletedPins}
        photoRepo={dexiePhotoRepository}
        onPinDetail={setSelectedPin}
        onDelete={handleDelete}
        onRestore={handleRestore}
        onHardDelete={handleHardDelete}
        onHardDeleteAll={handleHardDeleteAll}
        sheetHeight={sheetHeight}
        onSheetHeightChange={handleSheetHeightChange}
        trashRetentionDays={trashRetentionDays}
        onPinFlyTo={handlePinFlyTo}
        sortOrder={sortOrder}
        listScope={listScope}
        mapBounds={mapBounds}
      />
      {longPressPin && (
        <div
          style={{
            position: "absolute",
            bottom: sheetHeight,
            left: 0,
            right: 0,
            zIndex: 25,
            background: "#ef4444",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.2)",
          }}
        >
          <span style={{ fontSize: 14 }}>「{longPressPin.title}」を削除しますか？</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setLongPressPin(null)}
              style={{
                background: "rgba(255,255,255,0.25)",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              キャンセル
            </button>
            <button
              onClick={() => {
                handleDelete(longPressPin);
                setLongPressPin(null);
              }}
              style={{
                background: "#fff",
                color: "#ef4444",
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              削除
            </button>
          </div>
        </div>
      )}
      {mergeProposalData && (
        <div
          style={{
            position: "absolute",
            bottom: sheetHeight,
            left: 0,
            right: 0,
            zIndex: 25,
            background: "#3b82f6",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.2)",
          }}
        >
          <span style={{ fontSize: 14 }}>
            📸 「{mergeProposalData.targetPin.title}」に追加しますか？
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleRejectMerge}
              style={{
                background: "rgba(255,255,255,0.25)",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              新規ピンを作成
            </button>
            <button
              onClick={handleConfirmMerge}
              style={{
                background: "#fff",
                color: "#3b82f6",
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              追加する
            </button>
          </div>
        </div>
      )}
      {provisionalPinData && (
        <div
          style={{
            position: "absolute",
            bottom: sheetHeight,
            left: 0,
            right: 0,
            zIndex: 25,
            background: "#f59e0b",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.2)",
          }}
        >
          <span style={{ fontSize: 14 }}>📍 ドラッグして場所を調整してください</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleCancelProvisional}
              style={{
                background: "rgba(255,255,255,0.25)",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              キャンセル
            </button>
            <button
              onClick={handleConfirmProvisional}
              style={{
                background: "#fff",
                color: "#f59e0b",
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              ここに決定
            </button>
          </div>
        </div>
      )}
      {selectedPin && (
        <PinDetailSheet
          key={selectedPin.id}
          pin={selectedPin}
          photoRepo={dexiePhotoRepository}
          onSave={handleDetailSave}
          onClose={() => setSelectedPin(null)}
          onFlyTo={handlePinFlyTo}
          onSplitPhoto={(photo) => handleSplitPhoto(photo, selectedPin)}
          sheetHeight={sheetHeight}
        />
      )}
      {clusterPins && (
        <ClusterSheet
          pins={clusterPins}
          photoRepo={dexiePhotoRepository}
          onPinDetail={(pin) => {
            setClusterPins(null);
            setSelectedPin(pin);
          }}
          onClose={() => setClusterPins(null)}
        />
      )}
      {isSettingsOpen && (
        <SettingsSheet
          pinRepo={repo}
          photoRepo={dexiePhotoRepository}
          onClose={() => setIsSettingsOpen(false)}
          trashRetentionDays={trashRetentionDays}
          onTrashRetentionChange={handleTrashRetentionChange}
          sortOrder={sortOrder}
          onSortOrderChange={handleSortOrderChange}
          listScope={listScope}
          onListScopeChange={handleListScopeChange}
        />
      )}
      {message && (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.75)",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 8,
            fontSize: 13,
            maxWidth: "80%",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
