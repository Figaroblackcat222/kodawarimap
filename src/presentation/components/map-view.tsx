import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { useMediaQuery } from "@presentation/hooks/use-media-query";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Feature } from "geojson";
import { useMap } from "@infrastructure/map/use-map";
import { loadPoiTile } from "@infrastructure/poi/poi-loader";
import { lngLatToTile } from "@infrastructure/poi/tile-utils";
import type { Pin, PinExif, ShoppingItem } from "@domain/entities/pin";
import type { PhotoExif, PhotoFileInfo } from "@domain/entities/photo";
import { parseExif } from "@infrastructure/exif/exif-parser";
import { dexiePinRepository } from "@infrastructure/persistence/dexie-pin-repository";
import { addPin } from "@application/use-cases/add-pin";
import { createHlc } from "@domain/value-objects/hlc";
import { getNodeId } from "@infrastructure/sync/node-id";
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
import { MessageTicker } from "./message-ticker";
import { GeocoderSearch } from "./geocoder-search";
import { Settings, RotateCw } from "lucide-react";
import { useSync } from "@presentation/hooks/use-sync";
import { SyncSetupSheet } from "./sync-setup-sheet";
import { SyncStatusIndicator } from "./sync-status-indicator";
import { authService } from "@infrastructure/sync/auth-service";
import { cloudflareSyncRepository } from "@infrastructure/sync/cloudflare-sync-repository";
import { webCryptoService } from "@infrastructure/sync/web-crypto-service";
import { db } from "@infrastructure/persistence/db";
import { findAdminName } from "@infrastructure/geocoder/admin-geocoder";

const repo = dexiePinRepository;

const SHEET_HEIGHT_KEY = "kodawarimap:sheet-height";
const TRASH_RETENTION_KEY = "kodawarimap:trash-retention-days";
const SORT_ORDER_KEY = "kodawarimap:sort-order";
const LIST_SCOPE_KEY = "kodawarimap:list-scope";
const AUTO_NIGHT_MODE_KEY = "kodawarimap:auto-night-mode";
const NIGHT_START_KEY = "kodawarimap:night-start";
const NIGHT_END_KEY = "kodawarimap:night-end";
const GEOCODER_ENABLED_KEY = "kodawarimap:geocoder-enabled";

function getInitialSheetHeight(): number {
  const raw = parseInt(localStorage.getItem(SHEET_HEIGHT_KEY) ?? "0", 10);
  const fallback = Math.round(window.innerHeight * 0.25);
  return Math.max(44, Math.min(raw || fallback, window.innerHeight * 0.85));
}

function getInitialTrashRetentionDays(): number {
  return parseInt(localStorage.getItem(TRASH_RETENTION_KEY) ?? "30", 10);
}

type SortOrder = "date" | "title" | "rating";
type ListScope = "all" | "visible";

type MapBounds = { west: number; east: number; south: number; north: number };

const CATEGORY_MERGE_RADIUS: Record<string, number> = {
  general: 50,
  food: 5,
  hiking: 100,
  fishing: 30,
  travel: 50,
  theme_park: 50,
  shrine_temple: 30,
  camping: 100,
  onsen: 30,
  beach: 50,
  nature: 50,
  shopping: 30,
};

function getMergeRadius(categoryId: string): number {
  return CATEGORY_MERGE_RADIUS[categoryId] ?? 30;
}

function getEffectiveStyleUrl(
  styleUrl: string,
  autoNightMode: boolean,
  nightStart: string,
  nightEnd: string
): string {
  if (!autoNightMode || styleUrl !== "protomaps:light") return styleUrl;
  const now = new Date();
  const [startH, startM] = nightStart.split(":").map(Number);
  const [endH, endM] = nightEnd.split(":").map(Number);
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const startMins = startH * 60 + startM;
  const endMins = endH * 60 + endM;
  // 日をまたぐ場合（例: 18:00 〜 06:00）を考慮
  const isNight =
    startMins > endMins
      ? nowMins >= startMins || nowMins < endMins
      : nowMins >= startMins && nowMins < endMins;
  return isNight ? "protomaps:dark" : styleUrl;
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

const REACTION_LABEL_MAP: Record<string, string> = {
  want_to_revisit: "😊 また行きたい",
  once_was_enough: "😐 一回でいいかな",
  never_again: "😩 二度と行かない",
};

const CATEGORY_EMOJI: Record<string, string> = Object.fromEntries(
  PRESET_CATEGORIES.map((c) => [c.id, c.emoji])
);

function createEmojiImage(emoji: string, size = 48): ImageData {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.font = `${size * 0.8}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, size / 2, size / 2);
  return ctx.getImageData(0, 0, size, size);
}

function setupPoiLayer(map: maplibregl.Map): void {
  for (const [categoryId, emoji] of Object.entries(CATEGORY_EMOJI)) {
    if (!map.hasImage(`poi-${categoryId}`)) {
      map.addImage(`poi-${categoryId}`, createEmojiImage(emoji), { pixelRatio: 2 });
    }
  }
  if (!map.getSource("poi-data")) {
    map.addSource("poi-data", {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });
  }
  if (!map.getLayer("poi-icons")) {
    map.addLayer({
      id: "poi-icons",
      type: "symbol",
      source: "poi-data",
      layout: {
        "icon-image": ["concat", "poi-", ["coalesce", ["get", "categoryId"], "general"]],
        "icon-size": 0.7,
        "icon-allow-overlap": false,
        "text-field": ["get", "name"],
        "text-size": 11,
        "text-offset": [0, 1.5],
        "text-optional": true,
      },
      paint: {
        "text-color": "#333",
        "text-halo-color": "#fff",
        "text-halo-width": 1,
      },
    });
  }
}

function getPlaceName(map: maplibregl.Map, lng: number, lat: number): string | null {
  const point = map.project([lng, lat]);
  const features = map.queryRenderedFeatures(point, {
    layers: ["places_subplace", "places_locality"],
  });
  if (features.length === 0) return null;
  const props = features[0].properties ?? {};
  return (props["name:ja"] ?? props["name"] ?? null) as string | null;
}

async function getPhotoInfo(
  pinId: string,
  thumbnailPhotoId?: string
): Promise<{ url: string | null; count: number }> {
  const photos = await dexiePhotoRepository.findByPinId(pinId);
  const galleryPhotos = photos.filter((p) => !p.shoppingItemId);
  const thumb = thumbnailPhotoId
    ? (galleryPhotos.find((p) => p.id === thumbnailPhotoId) ?? galleryPhotos[0])
    : galleryPhotos[0];
  return {
    url: thumb ? URL.createObjectURL(thumb.blob) : null,
    count: galleryPhotos.length,
  };
}

function buildPopupContent(pin: Pin, thumbUrl: string | null, photoCount = 0): HTMLElement {
  const container = document.createElement("div");
  container.style.cssText = "display:flex;align-items:center;gap:8px;min-width:120px";

  if (thumbUrl) {
    const wrap = document.createElement("div");
    wrap.style.cssText = "position:relative;flex-shrink:0";
    const img = document.createElement("img");
    img.src = thumbUrl;
    img.style.cssText = "width:40px;height:40px;object-fit:cover;border-radius:4px;display:block";
    wrap.appendChild(img);
    if (photoCount > 1) {
      const badge = document.createElement("span");
      badge.textContent = `${photoCount}枚`;
      badge.style.cssText =
        "position:absolute;bottom:2px;right:2px;background:rgba(0,0,0,0.55);color:#fff;font-size:9px;padding:1px 3px;border-radius:3px;line-height:1.4";
      wrap.appendChild(badge);
    }
    container.appendChild(wrap);
  }

  const textDiv = document.createElement("div");
  textDiv.style.cssText = "display:flex;flex-direction:column;gap:2px";

  const titleEl = document.createElement("span");
  titleEl.textContent = pin.title;
  titleEl.style.cssText = "font-size:13px;font-weight:600";
  textDiv.appendChild(titleEl);

  if (pin.reaction) {
    const reactionEl = document.createElement("span");
    reactionEl.textContent = REACTION_LABEL_MAP[pin.reaction] ?? "";
    reactionEl.style.cssText = "font-size:11px;color:#888";
    textDiv.appendChild(reactionEl);
  }

  container.appendChild(textDiv);
  return container;
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

  const badge = document.createElement("div");
  badge.textContent = CATEGORY_EMOJI[pin.categoryId ?? "general"] ?? "🗺️";
  badge.style.cssText =
    "position:absolute;top:13.5px;left:13.5px;transform:translate(-50%,-50%);font-size:22px;line-height:1;pointer-events:none;user-select:none";
  el.style.overflow = "visible";
  el.appendChild(badge);

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

  const popup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: 30,
  }).setDOMContent(buildPopupContent(pin, null));

  let thumbUrl: string | null = null;
  let photoCount = 0;
  let thumbLoaded = false;

  el.addEventListener("mouseenter", () => {
    popup.setLngLat([pin.coordinates.lng, pin.coordinates.lat]).addTo(map);
    if (!thumbLoaded) {
      thumbLoaded = true;
      getPhotoInfo(pin.id, pin.thumbnailPhotoId).then(({ url, count }) => {
        thumbUrl = url;
        photoCount = count;
        if (popup.isOpen()) {
          popup.setDOMContent(buildPopupContent(pin, thumbUrl, photoCount));
        }
      });
    }
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
  titleIsFile: boolean;
  categoryId: string;
  pinExif: PinExif;
  initialCoordinates: { lng: number; lat: number };
  shoppingItems?: ShoppingItem[];
};

type MergeProposalData = {
  targetPin: Pin;
  blob: Blob;
  mimeType: string;
  photoExif: PhotoExif;
  fileInfo: PhotoFileInfo;
  provisionalData: ProvisionalPinData;
};

const INTRO_MESSAGES = [
  "[写真から記録] まずは1枚。GPS付き写真を選ぶと、撮影場所に自動でピンが生まれます",
  "[地図] GPS情報がない写真でも大丈夫。地図をダブルタップして手動でピンを置けます",
  "[カテゴリー] カテゴリーを選ぶと、地図が登山・食事・釣りなどの世界観に切り替わります",
  "[写真から記録] 写真1枚で撮影日時・場所・カメラ設定まで自動記録。入力の手間は最小限に",
  "[アプリ] データはすべてこのデバイスに保存されます。ログイン不要、あなたのこだわりは誰にも渡しません",
];

const CYCLE_MESSAGES = [
  "[地図] 地図のどこでも、ダブルタップして新しいピンを刻めます",
  "[写真から記録] GPS付き写真を選ぶだけで、撮影場所に自動でピンが生まれます",
  "[写真から記録] 同じ場所・同じ日の写真は、既存ピンへの追加を自動で提案します",
  "[地図マーカー > 削除] ピンをゆっくり長押しすると、削除の確認バーが表示されます",
  "[カテゴリー] カテゴリーを変えると地図が変わります。登山・食事・釣り、それぞれの世界観で",
  "[詳細画面 > リアクション] また行きたい・一回でいいかな・二度と行かない。3つのリアクションで本音を残しましょう",
  "[詳細画面 > マイタグ] マイタグは自分だけの言葉でいい。「夏祭り」「家族旅行」—なんでもOK",
  "[一覧] 画面下のバーをつかんで引き上げると、記録一覧を展開できます",
  "[一覧 > 検索] キーワードを入れると、タイトル・コメント・マイタグをまとめて検索できます",
  "[一覧 > フィルター] カテゴリー・リアクション・マイタグ・撮影日の4軸で、記録を絞り込めます",
  "[一覧 > 表示範囲] 「表示範囲」に切り替えると、今見えているエリアのピンだけ一覧表示します",
  "[詳細画面 > 写真追加] 写真は何枚でもまとめて追加できます。複数枚の変換・保存の進捗も確認できます",
  "[詳細画面 > 写真コメント] 各写真に一言コメントを添えられます。写真ビューアーで写真と一緒に表示されます",
  "[詳細画面 > サムネイル] 写真の★ボタンで、一覧に表示するサムネイルを選べます",
  "[詳細画面 > 写真ビューアー] 写真をタップするとフルスクリーンに。スワイプで前後の写真に切り替えられます",
  "[写真ビューアー > カメラ情報] 写真ビューアーにはF値・SS・焦点距離・ISOも表示されます。撮影設定の記録にも",
  "[写真ビューアー > ズーム] 写真ビューアーでは2本指ピンチで写真を拡大できます",
  "[写真から記録] iPhoneのHEIC写真もそのまま選ぶだけ。自動でJPEGに変換して保存されます",
  "[地図 > GPS調整] GPSにズレを感じたら、琥珀色のマーカーをドラッグして座標を微調整できます",
  "[詳細画面 > 撮影場所] 地名はピン作成時に自動で入力されます。もちろん自由に編集もできます",
  "[詳細画面 > 補足情報] お店のウェブサイトや関連動画のURLも、ピンに紐付けて保存できます",
  "[写真ビューアー > ダウンロード] 写真ビューアーのダウンロードボタンで、EXIF情報を保ったまま写真を端末に保存できます",
  "[ゴミ箱] 削除したピンは30日間ゴミ箱に残ります。うっかり消してしまっても安心です",
  "[写真から記録] 同じ場所でも、日が違えば別ピンに。再訪の記録が積み重なっていきます",
  "[地図マーカー > タップ] 地図のマーカーをタップすると、そのピンの詳細がすぐ開きます",
  "[地図マーカー > ホバー] マーカーにカーソルを合わせると、サムネイル付きのツールチップが浮かびます",
  "[地図マーカー > クラスター] 同じ座標に複数のピンがある場合は、数字バッジでまとめて表示されます",
  "[詳細画面 > 撮影日時] EXIFに日時がない写真はファイルの更新日時を使います。詳細画面から手動修正も可能です",
  "[設定 > エクスポート] 大切な記録は、設定画面からJSONやZIPでいつでもバックアップできます",
  "[設定 > インポート] ZIPをインポートすれば、写真込みで全データを別の端末でも復元できます",
  "[設定 > 昼夜テーマ] 設定で昼夜自動テーマをONにすると、夜間に地図が自動でダークモードに切り替わります",
  "[設定 > 地図検索] 地名・ランドマーク名で地図をすぐ移動できる地図検索機能があります（設定でON）",
  "[地図 > POI] カテゴリーに合ったスポット情報（POI）が地図上に重なって表示されます",
  "[設定 > 地図情報更新] 設定の「地図情報を更新」で、POIデータとアプリを最新状態にできます",
  "[設定 > ソート順] 一覧のソート順（日付順・タイトル順）は設定画面で切り替えられます",
  "[詳細画面 > 買い物リスト] ショッピングカテゴリーのピンには買い物リストが使えます。お店ごとに品物を管理しましょう",
  "[詳細画面 > 買い物リスト] 品物ごとに📷で写真を添付できます。「あのパッケージどれだっけ？」をその場で解決",
  "[詳細画面 > 買い物リスト] 「このリストをコピーして新規作成」で、家にいながら次回の買い物リストを事前準備できます",
];

export function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const clusterMarkersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const provisionalMarkerRef = useRef<maplibregl.Marker | null>(null);
  const locationMarkerRef = useRef<maplibregl.Marker | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [deletedPins, setDeletedPins] = useState<Pin[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>(DEFAULT_CATEGORY);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [isNewPin, setIsNewPin] = useState(false);
  const [filteredPinIds, setFilteredPinIds] = useState<Set<string> | null>(null);
  const [clusterPins, setClusterPins] = useState<Pin[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sheetHeight, setSheetHeight] = useState<number>(getInitialSheetHeight);
  const isDesktop = useMediaQuery("(min-width: 768px)");
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
  const allPoiFeaturesRef = useRef<Feature[] | null>(null);
  // ユーザーがピンを置いた際のセッション内重複排除（起動時ロードとは独立）
  const loadedTilesRef = useRef<Set<string>>(new Set());
  // 成功取得済みタイル（起動時・ユーザー操作を問わず重複追加を防ぐ）
  const fetchedTilesRef = useRef<Set<string>>(new Set());
  const [poiFeatures, setPoiFeatures] = useState<Feature[]>([]);
  const poiFeaturesRef = useRef<Feature[]>([]);
  const [poiLoadingCount, setPoiLoadingCount] = useState(0);
  const categoryIdRef = useRef(category.id);
  categoryIdRef.current = category.id;
  // 起動時ロード用 ref（loadedTilesRef を汚染しない専用関数）
  const loadPoiForStartupRef = useRef<(lng: number, lat: number) => Promise<void>>(async () => {});
  const [autoNightMode, setAutoNightMode] = useState(
    () => localStorage.getItem(AUTO_NIGHT_MODE_KEY) === "true"
  );
  const [nightStart, setNightStart] = useState(
    () => localStorage.getItem(NIGHT_START_KEY) ?? "18:00"
  );
  const [nightEnd, setNightEnd] = useState(() => localStorage.getItem(NIGHT_END_KEY) ?? "06:00");
  const [geocoderEnabled, setGeocoderEnabled] = useState(
    () => localStorage.getItem(GEOCODER_ENABLED_KEY) === "true"
  );

  // 同期
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
  const [, setIsLoadingKey] = useState(true);
  const [showSyncSetup, setShowSyncSetup] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);

  const tagKeywords = useMemo(() => {
    const set = new Set<string>();
    for (const p of pins) {
      if (p.tag?.trim()) set.add(p.tag.trim());
    }
    return [...set].sort();
  }, [pins]);

  // 同期フック
  const { syncState, triggerSync } = useSync({ encryptionKey });

  // 保存後デバウンス同期（3秒後）+ 定期ポーリング（30分ごと）
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedSyncRef = useRef(() => {});
  useEffect(() => {
    debouncedSyncRef.current = () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(triggerSync, 3000);
    };
  }, [triggerSync]);
  useEffect(() => {
    if (!encryptionKey) return;
    const id = setInterval(triggerSync, 30 * 60 * 1000);
    return () => clearInterval(id);
  }, [encryptionKey, triggerSync]);

  // 起動時チェック: IndexedDB から鍵を復元、なければセットアップシートを開く
  useEffect(() => {
    (async () => {
      try {
        if (authService.isLoggedIn()) {
          const record = await db.key_store.get("encryption-key");
          if (record) {
            setEncryptionKey(record.key);
          } else {
            setShowSyncSetup(true);
          }
        }
      } finally {
        setIsLoadingKey(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSheetHeightChange = useCallback((h: number) => {
    setSheetHeight(h);
    localStorage.setItem(SHEET_HEIGHT_KEY, String(h));
  }, []);

  const handleTrashRetentionChange = useCallback((days: number) => {
    setTrashRetentionDays(days);
    localStorage.setItem(TRASH_RETENTION_KEY, String(days));
  }, []);

  const handleAutoNightModeChange = useCallback((v: boolean) => {
    setAutoNightMode(v);
    localStorage.setItem(AUTO_NIGHT_MODE_KEY, String(v));
  }, []);
  const handleNightStartChange = useCallback((v: string) => {
    setNightStart(v);
    localStorage.setItem(NIGHT_START_KEY, v);
  }, []);
  const handleNightEndChange = useCallback((v: string) => {
    setNightEnd(v);
    localStorage.setItem(NIGHT_END_KEY, v);
  }, []);
  const handleGeocoderEnabledChange = useCallback((v: boolean) => {
    setGeocoderEnabled(v);
    localStorage.setItem(GEOCODER_ENABLED_KEY, String(v));
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

  // 同期完了時: ピン一覧を再読込 + lastSyncAt 更新
  const prevSyncStateRef = useRef<typeof syncState>("idle");
  useEffect(() => {
    if (prevSyncStateRef.current === "syncing" && syncState === "idle") {
      void refreshLists();
      setLastSyncAt(new Date());
    }
    prevSyncStateRef.current = syncState;
  }, [syncState, refreshLists]);

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

  const applyPoiFilter = useCallback((categoryId: string) => {
    if (categoryId === "general") {
      setPoiFeatures([]);
      return;
    }
    const all = allPoiFeaturesRef.current ?? [];
    setPoiFeatures(all.filter((f) => f.properties?.categoryId === categoryId));
  }, []);

  // ユーザーがピンを置いたとき呼ぶ（loadedTilesRef でセッション内重複排除）
  const loadPoiForPin = useCallback(
    async (lng: number, lat: number) => {
      const { x, y } = lngLatToTile(lng, lat, 8);
      const key = `${x}:${y}`;
      if (loadedTilesRef.current.has(key)) return;
      loadedTilesRef.current.add(key);
      // 起動時ロードで既に成功取得済みなら追加不要
      if (fetchedTilesRef.current.has(key)) return;
      setPoiLoadingCount((c) => c + 1);
      try {
        const features = await loadPoiTile(x, y, lng, lat);
        if (features.length === 0) {
          loadedTilesRef.current.delete(key);
          return;
        }
        fetchedTilesRef.current.add(key);
        allPoiFeaturesRef.current = [...(allPoiFeaturesRef.current ?? []), ...features];
        applyPoiFilter(categoryIdRef.current);
      } finally {
        setPoiLoadingCount((c) => c - 1);
      }
    },
    [applyPoiFilter]
  );

  // 起動時専用ローダー（loadedTilesRef を書かないのでユーザー操作を妨げない）
  const loadPoiForStartup = useCallback(
    async (lng: number, lat: number) => {
      const { x, y } = lngLatToTile(lng, lat, 8);
      const key = `${x}:${y}`;
      if (fetchedTilesRef.current.has(key)) return;
      setPoiLoadingCount((c) => c + 1);
      try {
        const features = await loadPoiTile(x, y, lng, lat);
        if (features.length === 0) return;
        fetchedTilesRef.current.add(key);
        allPoiFeaturesRef.current = [...(allPoiFeaturesRef.current ?? []), ...features];
        applyPoiFilter(categoryIdRef.current);
      } finally {
        setPoiLoadingCount((c) => c - 1);
      }
    },
    [applyPoiFilter]
  );
  loadPoiForStartupRef.current = loadPoiForStartup;

  const handleMapClick = useCallback(
    async (lng: number, lat: number) => {
      const map = mapRef.current;
      const placeName = map ? getPlaceName(map, lng, lat) : null;
      const adminName = await findAdminName(lng, lat);
      const location = adminName ? (placeName ? `${adminName}${placeName}` : adminName) : placeName;
      const title = placeName ?? adminName ?? `ピン ${pins.length + 1}`;
      let pin = await addPin(repo, { lng, lat }, title, createHlc(getNodeId()), category.id);
      if (location) {
        pin = { ...pin, location };
        await repo.save(pin);
      }
      setPins((prev) => [...prev, pin]);
      void loadPoiForPin(lng, lat);
      debouncedSyncRef.current();
    },
    [pins.length, category, loadPoiForPin]
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

        const titleIsFile = !nearbyPins[0];
        const title = nearbyPins[0]?.title ?? file.name.replace(/\.[^.]+$/, "");
        const inheritedCategoryId = nearbyPins[0]?.categoryId ?? category.id;

        const inheritedShoppingItems =
          nearbyPins[0]?.shoppingItems && nearbyPins[0].shoppingItems.length > 0
            ? nearbyPins[0].shoppingItems.map((item) => ({
                ...item,
                id: crypto.randomUUID(),
                checked: false,
                photoId: undefined,
              }))
            : undefined;

        const provisionalData: ProvisionalPinData = {
          blob,
          mimeType,
          photoExif,
          fileInfo,
          title,
          titleIsFile,
          categoryId: inheritedCategoryId,
          pinExif,
          initialCoordinates: { lng, lat },
          shoppingItems: inheritedShoppingItems,
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
            padding: { top: 40, bottom: 0, left: 0, right: 0 },
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
        map.flyTo({
          center: [lng, lat],
          zoom: 16,
          padding: { top: 40, bottom: 0, left: 0, right: 0 },
        });
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
    const {
      blob,
      mimeType,
      photoExif,
      fileInfo,
      title,
      titleIsFile,
      categoryId,
      pinExif,
      shoppingItems,
    } = provisionalPinData;
    const map = mapRef.current;
    const placeName = map ? getPlaceName(map, lng, lat) : null;
    const adminName = await findAdminName(lng, lat);
    const location = adminName ? (placeName ? `${adminName}${placeName}` : adminName) : placeName;
    const resolvedTitle =
      titleIsFile && (placeName ?? adminName) ? (placeName ?? adminName)! : title;
    try {
      let pin = await addPin(
        repo,
        { lng, lat },
        resolvedTitle,
        createHlc(getNodeId()),
        categoryId,
        pinExif
      );
      if (location || shoppingItems) {
        pin = {
          ...pin,
          ...(location ? { location } : {}),
          ...(shoppingItems ? { shoppingItems } : {}),
        };
        await repo.save(pin);
      }
      await dexiePhotoRepository.save(pin.id, blob, mimeType, photoExif, fileInfo);
      setPins((prev) => [...prev, pin]);
      void loadPoiForPin(lng, lat);
      marker.remove();
      provisionalMarkerRef.current = null;
      setProvisionalPinData(null);
      setSelectedPin(pin);
      setIsNewPin(true);
      debouncedSyncRef.current();
      showMessage(`📍 ${pin.title} をプロットしました`);
    } catch (err) {
      console.error("ピンの保存中にエラーが発生しました:", err);
      showMessage("保存に失敗しました");
    }
  }, [provisionalPinData, showMessage, loadPoiForPin]);

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
    map.flyTo({ center: [lng, lat], zoom: 16, padding: { top: 40, bottom: 0, left: 0, right: 0 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mergeProposalData, sheetHeight]);

  const handlePinFlyTo = useCallback(
    (pin: Pin) => {
      const map = mapRef.current;
      if (!map) return;
      const detailOverlap = Math.max(0, Math.round(window.innerHeight * 0.75) - sheetHeight);
      map.flyTo({
        center: [pin.coordinates.lng, pin.coordinates.lat],
        zoom: 16,
        padding: { top: 40, bottom: detailOverlap, left: 0, right: 0 },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sheetHeight]
  );

  const handleLocate = useCallback(
    (lng: number, lat: number) => {
      const map = mapRef.current;
      if (!map) return;

      map.flyTo({
        center: [lng, lat],
        zoom: 16,
        padding: { top: 40, bottom: 0, left: 0, right: 0 },
      });

      // 既存の現在地マーカーを削除
      locationMarkerRef.current?.remove();

      // 現在地マーカー（青い点）を作成
      const el = document.createElement("div");
      el.style.cssText = `
        width: 18px; height: 18px; border-radius: 50%;
        background: #3b82f6; border: 3px solid #fff;
        box-shadow: 0 0 0 2px #3b82f6;
        animation: location-pulse 2s ease-out infinite;
      `;
      locationMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sheetHeight]
  );

  const handleDelete = useCallback(
    async (pin: Pin) => {
      await softDeletePin(repo, pin.id, getNodeId());
      await refreshLists();
      debouncedSyncRef.current();
      showMessage(`「${pin.title}」をゴミ箱に移動しました`);
    },
    [refreshLists, showMessage]
  );

  const handleHardDelete = useCallback(
    async (pin: Pin) => {
      await dexiePhotoRepository.deleteByPinId(pin.id);
      await hardDeletePin(repo, pin.id);
      await refreshLists();
      debouncedSyncRef.current();
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
    debouncedSyncRef.current();
    showMessage("ゴミ箱を空にしました");
  }, [deletedPins, refreshLists, showMessage]);

  const handleRestore = useCallback(
    async (pin: Pin) => {
      await restorePin(repo, pin.id, getNodeId());
      await refreshLists();
      debouncedSyncRef.current();
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
        tag: updated.tag,
        location: updated.location,
        url: updated.url,
        videoUrl: updated.videoUrl,
        exif: updated.exif,
        allowPhotoDownload: updated.allowPhotoDownload,
        reaction: updated.reaction,
        thumbnailPhotoId: updated.thumbnailPhotoId,
        shoppingItems: updated.shoppingItems,
      });
      await refreshLists();
      setSelectedPin(null);
      debouncedSyncRef.current();
      showMessage(`「${updated.title}」を更新しました`);
    },
    [refreshLists, showMessage]
  );

  const handleCreateCopyFromPin = useCallback(
    async (sourcePin: Pin, items: ShoppingItem[]) => {
      setSelectedPin(null);
      setIsNewPin(false);
      const newPin = await addPin(
        repo,
        sourcePin.coordinates,
        sourcePin.title,
        createHlc(getNodeId()),
        sourcePin.categoryId
      );
      const pinWithList = { ...newPin, shoppingItems: items };
      await repo.save(pinWithList);
      setPins((prev) => [...prev, pinWithList]);
      setSelectedPin(pinWithList);
      setIsNewPin(true);
      debouncedSyncRef.current();
      showMessage(`「${newPin.title}」のリストをコピーしました`);
    },
    [showMessage]
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

  const effectiveStyleUrl = getEffectiveStyleUrl(
    category.styleUrl,
    autoNightMode,
    nightStart,
    nightEnd
  );
  const mapRef = useMap(
    containerRef,
    handleMapClickWithDismiss,
    effectiveStyleUrl,
    () => sheetHeight
  );

  // sheetHeight / 詳細パネル開閉時にMapLibreのキャンバスをリサイズ
  useEffect(() => {
    const timer = setTimeout(() => {
      mapRef.current?.resize();
    }, 320);
    return () => clearTimeout(timer);
  }, [sheetHeight, selectedPin, isDesktop, mapRef]);

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

      // 起動時：既存ピンのPOIをバックグラウンドでロード
      // loadedTilesRef は汚染しない専用ローダーを使い、ユーザーの新規ピン操作を妨げない
      const startupSeenTiles = new Set<string>();
      for (const pin of active) {
        const { x, y } = lngLatToTile(pin.coordinates.lng, pin.coordinates.lat, 8);
        const tileKey = `${x}:${y}`;
        if (!startupSeenTiles.has(tileKey)) {
          startupSeenTiles.add(tileKey);
          void loadPoiForStartupRef.current(pin.coordinates.lng, pin.coordinates.lat);
        }
      }

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
        const attachPoiLayer = (m: maplibregl.Map) => {
          setupPoiLayer(m);
          m.on("styledata", () => {
            setupPoiLayer(m);
            (m.getSource("poi-data") as maplibregl.GeoJSONSource)?.setData({
              type: "FeatureCollection",
              features: poiFeaturesRef.current,
            });
          });
        };

        if (!map.isStyleLoaded()) {
          map.once("load", () => {
            if (!cancelled) {
              syncMarkers(map, active);
              updateBounds(map);
              map.on("moveend", () => updateBounds(map));
              attachPoiLayer(map);
            }
          });
        } else {
          syncMarkers(map, active);
          updateBounds(map);
          map.on("moveend", () => updateBounds(map));
          attachPoiLayer(map);
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

  // pins / フィルター変化時にマーカーを再同期
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    const toShow = filteredPinIds ? pins.filter((p) => filteredPinIds.has(p.id)) : pins;
    syncMarkers(map, toShow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pins, filteredPinIds, syncMarkers]);

  // 詳細表示中は選択ピンのマーカーを非表示にする
  useEffect(() => {
    markersRef.current.forEach((m) => {
      m.getElement().style.zIndex = "";
      m.getElement().style.visibility = "";
    });
    if (selectedPin) {
      const m = markersRef.current.get(selectedPin.id);
      if (m) m.getElement().style.visibility = "hidden";
    }
  }, [selectedPin]);

  // カテゴリー変更時にPOIフィルターを再適用
  useEffect(() => {
    applyPoiFilter(category.id);
  }, [category.id, applyPoiFilter]);

  // poiFeatures 変化時にGeoJSONソースを更新
  useEffect(() => {
    poiFeaturesRef.current = poiFeatures;
    const map = mapRef.current;
    if (!map?.isStyleLoaded()) return;
    (map.getSource("poi-data") as maplibregl.GeoJSONSource)?.setData({
      type: "FeatureCollection",
      features: poiFeatures,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poiFeatures]);

  const handleFilteredPinsChange = useCallback(
    (filtered: Pin[]) => {
      setFilteredPinIds(filtered.length < pins.length ? new Set(filtered.map((p) => p.id)) : null);
    },
    [pins]
  );

  const [cycleIndex, setCycleIndex] = useState(0);

  const handleTickerScrollEnd = useCallback(() => {
    const messages = pins.length === 0 ? INTRO_MESSAGES : CYCLE_MESSAGES;
    setCycleIndex((i) => (i + 1) % messages.length);
  }, [pins.length]);

  const { tickerLabel, tickerMessage } = useMemo(() => {
    const messages = pins.length === 0 ? INTRO_MESSAGES : CYCLE_MESSAGES;
    const label = pins.length === 0 ? "【はじめに】" : "【ヒント】";
    return { tickerLabel: label, tickerMessage: messages[cycleIndex % messages.length] };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pins.length, cycleIndex]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <style>{`
        @keyframes location-pulse {
          0%   { box-shadow: 0 0 0 2px #3b82f6; }
          60%  { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
          100% { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
        }
      `}</style>
      <div
        ref={containerRef}
        style={{
          width: isDesktop && selectedPin ? `calc(100% - 400px)` : "100%",
          height: `calc(100vh - ${sheetHeight}px)`,
          transition: "width 0.3s ease",
        }}
      />
      <MessageTicker
        message={tickerMessage}
        label={tickerLabel}
        onScrollEnd={handleTickerScrollEnd}
      />
      {geocoderEnabled && <GeocoderSearch map={mapRef.current} />}
      <PhotoUploadButton onFile={handlePhoto} loading={isProcessing} bottom={sheetHeight + 8} />
      <CategorySelector selected={category} onChange={setCategory} bottom={sheetHeight + 8} />

      {/* 同期ステータスインジケーター（ログイン済み時のみ） */}
      {authService.isLoggedIn() && (
        <SyncStatusIndicator syncState={syncState} onRetry={triggerSync} />
      )}

      {/* リロードボタン */}
      <button
        onClick={() => window.location.reload()}
        style={{
          position: "absolute",
          top: 48,
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
        title="リロード"
      >
        <RotateCw size={18} color="var(--text-secondary)" />
      </button>

      {/* 設定ボタン */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        style={{
          position: "absolute",
          top: 48,
          right: 8,
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
        onSortOrderChange={handleSortOrderChange}
        listScope={listScope}
        onListScopeChange={handleListScopeChange}
        mapBounds={mapBounds}
        tagKeywords={tagKeywords}
        onFilteredPinsChange={handleFilteredPinsChange}
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
          isNew={isNewPin}
          photoRepo={dexiePhotoRepository}
          onSave={handleDetailSave}
          onClose={() => {
            setSelectedPin(null);
            setIsNewPin(false);
          }}
          onCreateCopy={(items) => handleCreateCopyFromPin(selectedPin, items)}
          tagKeywords={tagKeywords}
          syncRepository={encryptionKey ? cloudflareSyncRepository : undefined}
          encryptionKey={encryptionKey ?? undefined}
          cryptoService={encryptionKey ? webCryptoService : undefined}
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
          onImportComplete={refreshLists}
          trashRetentionDays={trashRetentionDays}
          onTrashRetentionChange={handleTrashRetentionChange}
          autoNightMode={autoNightMode}
          onAutoNightModeChange={handleAutoNightModeChange}
          nightStart={nightStart}
          onNightStartChange={handleNightStartChange}
          nightEnd={nightEnd}
          onNightEndChange={handleNightEndChange}
          geocoderEnabled={geocoderEnabled}
          onGeocoderEnabledChange={handleGeocoderEnabledChange}
          syncState={syncState}
          onTriggerSync={triggerSync}
          onOpenSyncSetup={() => {
            setIsSettingsOpen(false);
            setShowSyncSetup(true);
          }}
          lastSyncAt={lastSyncAt}
          hasSyncKey={!!encryptionKey}
          onLogout={async () => {
            await db.key_store.delete("encryption-key");
            setEncryptionKey(null);
          }}
        />
      )}
      <SyncSetupSheet
        isOpen={showSyncSetup}
        onClose={() => setShowSyncSetup(false)}
        onSuccess={async (key) => {
          await db.key_store.put({ id: "encryption-key", key, createdAt: new Date() });
          setEncryptionKey(key);
          setShowSyncSetup(false);
        }}
      />
      {poiLoadingCount > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 64,
            left: 12,
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: 12,
            fontSize: 12,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.4)",
              borderTopColor: "#fff",
              display: "inline-block",
              animation: "spin 0.8s linear infinite",
            }}
          />
          POI読み込み中…
        </div>
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
