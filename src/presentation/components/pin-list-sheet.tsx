import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  SlidersHorizontal,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  List,
  FilterX,
  LayoutGrid,
  Smile,
  Tag,
  Calendar,
  Star,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import type { Pin, PinReaction } from "@domain/entities/pin";
import type { PhotoRepository } from "@application/ports/photo-repository";
import { PRESET_CATEGORIES } from "@domain/entities/category";
import { useMediaQuery } from "@presentation/hooks/use-media-query";

const REACTION_EMOJI_MAP: Record<string, string> = {
  want_to_revisit: "😊",
  once_was_enough: "😐",
  never_again: "😩",
};

const MIN_HEIGHT = 44;
const MAX_HEIGHT_RATIO = 0.85;

function snapHeights() {
  const h = window.innerHeight;
  return [
    MIN_HEIGHT,
    Math.round(h * 0.25),
    Math.round(h * 0.3),
    Math.round(h * 0.35),
    Math.round(h * 0.4),
    Math.round(h * 0.45),
    Math.round(h * 0.5),
    Math.round(h * 0.55),
    Math.round(h * 0.6),
    Math.round(h * 0.65),
    Math.round(h * MAX_HEIGHT_RATIO),
  ];
}

type MapBounds = { west: number; east: number; south: number; north: number };

interface Props {
  pins: Pin[];
  deletedPins: Pin[];
  photoRepo: PhotoRepository;
  onPinDetail: (pin: Pin) => void;
  onDelete: (pin: Pin) => void;
  onRestore: (pin: Pin) => void;
  onHardDelete: (pin: Pin) => void;
  onHardDeleteAll: () => void;
  onPinFlyTo: (pin: Pin) => void;
  sheetHeight: number;
  onSheetHeightChange: (h: number) => void;
  trashRetentionDays: number;
  sortOrder: "date" | "title" | "rating";
  onSortOrderChange: (order: "date" | "title" | "rating") => void;
  listScope: "all" | "visible";
  onListScopeChange: (v: "all" | "visible") => void;
  mapBounds: MapBounds | null;
  tagKeywords: string[];
  onFilteredPinsChange?: (pins: Pin[]) => void;
}

function toLocalDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function applyDatePreset(
  preset: "all" | "today" | "week" | "month" | "year",
  setFrom: (v: string) => void,
  setTo: (v: string) => void
) {
  if (preset === "all") {
    setFrom("");
    setTo("");
    return;
  }
  const now = new Date();
  if (preset === "today") {
    const s = toLocalDateStr(now);
    setFrom(s);
    setTo(s);
    return;
  }
  const start = new Date(now);
  if (preset === "week") {
    start.setDate(now.getDate() - now.getDay()); // 日曜起点
  } else if (preset === "month") {
    start.setDate(1);
  } else {
    start.setMonth(0, 1);
  }
  setFrom(toLocalDateStr(start));
  setTo("");
}

function PinThumb({
  pin,
  photoRepo,
  onClick,
}: {
  pin: Pin;
  photoRepo: PhotoRepository;
  onClick?: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;
    photoRepo.findByPinId(pin.id).then((photos) => {
      if (!cancelled && photos.length > 0) {
        const thumb = pin.thumbnailPhotoId
          ? (photos.find((p) => p.id === pin.thumbnailPhotoId) ?? photos[0])
          : photos[0];
        objectUrl = URL.createObjectURL(thumb.blob);
        setUrl(objectUrl);
        setCount(photos.length);
      }
    });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [pin.id, pin.thumbnailPhotoId, photoRepo]);

  if (!url) return null;
  return (
    <div
      style={{ position: "relative", flexShrink: 0, cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    >
      <img
        src={url}
        alt=""
        style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, display: "block" }}
      />
      {count > 1 && (
        <span
          style={{
            position: "absolute",
            bottom: 2,
            right: 2,
            background: "rgba(0,0,0,0.55)",
            color: "#fff",
            fontSize: 9,
            padding: "1px 3px",
            borderRadius: 3,
            lineHeight: 1.4,
          }}
        >
          {count}枚
        </span>
      )}
    </div>
  );
}

export function PinListSheet({
  pins,
  deletedPins,
  photoRepo,
  onPinDetail,
  onDelete,
  onRestore,
  onHardDelete,
  onHardDeleteAll,
  onPinFlyTo,
  sheetHeight,
  onSheetHeightChange,
  trashRetentionDays,
  sortOrder,
  onSortOrderChange,
  listScope,
  onListScopeChange,
  mapBounds,
  tagKeywords,
  onFilteredPinsChange,
}: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [keyword, setKeyword] = useState("");
  const [showTrash, setShowTrash] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [reactionFilter, setReactionFilter] = useState<PinReaction | "none" | "all">("all");
  const [ratingFilter, setRatingFilter] = useState<6 | 8 | 10 | null>(null);
  const [quickSort, setQuickSort] = useState<"rating" | null>(null);
  const [openSection, setOpenSection] = useState<
    "category" | "reaction" | "tag" | "date" | "rating" | null
  >(null);
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const [takenFrom, setTakenFrom] = useState("");
  const [takenTo, setTakenTo] = useState("");
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<
    { type: "all" } | { type: "one"; pin: Pin } | null
  >(null);

  const dragRef = useRef<{ startY: number; startHeight: number; dragging: boolean } | null>(null);
  const sheetHeightRef = useRef(sheetHeight);
  sheetHeightRef.current = sheetHeight;

  const handleCollapseToggle = useCallback(() => {
    if (sheetHeight <= MIN_HEIGHT) {
      onSheetHeightChange(Math.round(window.innerHeight * 0.65));
    } else {
      onSheetHeightChange(MIN_HEIGHT);
    }
  }, [sheetHeight, onSheetHeightChange]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      dragRef.current = { startY: e.clientY, startHeight: sheetHeight, dragging: false };
    },
    [sheetHeight]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      const moved = Math.abs(e.clientY - dragRef.current.startY);
      if (!dragRef.current.dragging) {
        if (moved < 8) return;
        dragRef.current.dragging = true;
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      const delta = dragRef.current.startY - e.clientY;
      const newHeight = dragRef.current.startHeight + delta;
      const maxH = Math.round(window.innerHeight * MAX_HEIGHT_RATIO);
      onSheetHeightChange(Math.max(MIN_HEIGHT, Math.min(newHeight, maxH)));
    },
    [onSheetHeightChange]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (dragRef.current?.dragging) {
        e.currentTarget.releasePointerCapture(e.pointerId);
        const snaps = snapHeights();
        const nearest = snaps.reduce((best, s) =>
          Math.abs(s - sheetHeight) < Math.abs(best - sheetHeight) ? s : best
        );
        onSheetHeightChange(nearest);
      }
      dragRef.current = null;
    },
    [sheetHeight, onSheetHeightChange]
  );

  useEffect(() => {
    const TARGET = Math.round(window.innerHeight * 0.45);
    if ((isFilterBarOpen || openSection !== null) && sheetHeightRef.current < TARGET) {
      onSheetHeightChange(TARGET);
    }
  }, [isFilterBarOpen, openSection, onSheetHeightChange]);

  const activePins = useMemo(() => {
    let result = pins;
    if (listScope === "visible" && mapBounds) {
      result = result.filter(
        (p) =>
          p.coordinates.lng >= mapBounds.west &&
          p.coordinates.lng <= mapBounds.east &&
          p.coordinates.lat >= mapBounds.south &&
          p.coordinates.lat <= mapBounds.north
      );
    }
    if (keyword.trim()) {
      const terms = keyword.toLowerCase().split(/\s+/).filter(Boolean);
      result = result.filter((p) =>
        terms.every(
          (t) =>
            p.title.toLowerCase().includes(t) ||
            (p.comment?.toLowerCase().includes(t) ?? false) ||
            (p.tag?.toLowerCase().includes(t) ?? false)
        )
      );
    }
    if (categoryFilter !== "all") {
      result = result.filter((p) => (p.categoryId ?? "general") === categoryFilter);
    }
    if (reactionFilter !== "all") {
      if (reactionFilter === "none") {
        result = result.filter((p) => !p.reaction);
      } else {
        result = result.filter((p) => p.reaction === reactionFilter);
      }
    }
    if (ratingFilter !== null) {
      result = result.filter((p) => (p.rating ?? 0) >= ratingFilter);
    }
    if (tagFilter.length > 0) {
      result = result.filter((p) => p.tag && tagFilter.includes(p.tag));
    }
    if (takenFrom || takenTo) {
      const from = takenFrom ? new Date(takenFrom) : null;
      const to = takenTo ? new Date(takenTo + "T23:59:59") : null;
      result = result.filter((p) => {
        const taken = p.exif?.takenAt;
        if (!taken) return false;
        if (from && taken < from) return false;
        if (to && taken > to) return false;
        return true;
      });
    }
    if (quickSort === "rating" || sortOrder === "rating") {
      result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sortOrder === "title") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title, "ja"));
    } else {
      result = [...result].sort((a, b) => {
        const ta = a.exif?.takenAt ?? a.createdAt;
        const tb = b.exif?.takenAt ?? b.createdAt;
        return tb.getTime() - ta.getTime();
      });
    }
    return result;
  }, [
    pins,
    keyword,
    categoryFilter,
    reactionFilter,
    ratingFilter,
    quickSort,
    tagFilter,
    takenFrom,
    takenTo,
    sortOrder,
    listScope,
    mapBounds,
  ]);

  // listScope を除いたフィルター結果をマップに通知する
  const filteredForMap = useMemo(() => {
    let result = pins;
    if (keyword.trim()) {
      const terms = keyword.toLowerCase().split(/\s+/).filter(Boolean);
      result = result.filter((p) =>
        terms.every(
          (t) =>
            p.title.toLowerCase().includes(t) ||
            (p.comment?.toLowerCase().includes(t) ?? false) ||
            (p.tag?.toLowerCase().includes(t) ?? false)
        )
      );
    }
    if (categoryFilter !== "all") {
      result = result.filter((p) => (p.categoryId ?? "general") === categoryFilter);
    }
    if (reactionFilter !== "all") {
      if (reactionFilter === "none") {
        result = result.filter((p) => !p.reaction);
      } else {
        result = result.filter((p) => p.reaction === reactionFilter);
      }
    }
    if (ratingFilter !== null) {
      result = result.filter((p) => (p.rating ?? 0) >= ratingFilter);
    }
    if (tagFilter.length > 0) {
      result = result.filter((p) => p.tag && tagFilter.includes(p.tag));
    }
    if (takenFrom || takenTo) {
      const from = takenFrom ? new Date(takenFrom) : null;
      const to = takenTo ? new Date(takenTo + "T23:59:59") : null;
      result = result.filter((p) => {
        const taken = p.exif?.takenAt;
        if (!taken) return false;
        if (from && taken < from) return false;
        if (to && taken > to) return false;
        return true;
      });
    }
    return result;
  }, [pins, keyword, categoryFilter, reactionFilter, ratingFilter, tagFilter, takenFrom, takenTo]);

  useEffect(() => {
    onFilteredPinsChange?.(filteredForMap);
  }, [filteredForMap, onFilteredPinsChange]);

  const currentList = showTrash ? deletedPins : activePins;
  const isExpanded = sheetHeight > MIN_HEIGHT;

  return (
    <>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          background: "var(--bg-primary)",
          borderRadius: "16px 16px 0 0",
          boxShadow: "0 -4px 20px var(--shadow)",
          height: sheetHeight,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ドラッグハンドル */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            cursor: "ns-resize",
            touchAction: "none",
            userSelect: "none",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 8 }}>
            <span
              style={{
                width: 40,
                height: 5,
                borderRadius: 3,
                background: "#999",
                display: "block",
              }}
            />
          </div>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px 16px 10px",
              fontSize: 14,
              color: "var(--text-secondary)",
            }}
          >
            {!showTrash && (
              <div
                onPointerDown={(e) => e.stopPropagation()}
                style={{
                  position: "absolute",
                  left: 8,
                  display: "flex",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  overflow: "hidden",
                  fontSize: 14,
                }}
              >
                <button
                  onClick={() => onListScopeChange("all")}
                  style={{
                    padding: "5px 12px",
                    border: "none",
                    background: listScope === "all" ? "#3b82f6" : "var(--bg-primary)",
                    color: listScope === "all" ? "#fff" : "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  全件
                </button>
                <button
                  onClick={() => onListScopeChange("visible")}
                  style={{
                    padding: "5px 12px",
                    border: "none",
                    background: listScope === "visible" ? "#3b82f6" : "var(--bg-primary)",
                    color: listScope === "visible" ? "#fff" : "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  表示範囲
                </button>
              </div>
            )}
            <span>
              {showTrash ? `ゴミ箱 ${deletedPins.length}件` : `ピン ${activePins.length}件`}
            </span>
            {!showTrash && (
              <div
                onPointerDown={(e) => e.stopPropagation()}
                style={{ position: "absolute", right: 52 }}
              >
                <button
                  onClick={() => setSortDropdownOpen((v) => !v)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "5px 12px",
                    border: `1px solid ${sortOrder !== "date" ? "#3b82f6" : "var(--border)"}`,
                    borderRadius: 14,
                    background: sortOrder !== "date" ? "#3b82f6" : "var(--bg-primary)",
                    color: sortOrder !== "date" ? "#fff" : "var(--text-secondary)",
                    cursor: "pointer",
                    fontSize: 14,
                    whiteSpace: "nowrap",
                  }}
                >
                  {sortOrder === "date"
                    ? "撮影日"
                    : sortOrder === "title"
                      ? "タイトル"
                      : "おすすめ"}
                  <ChevronDown size={13} />
                </button>
                {sortDropdownOpen && (
                  <>
                    <div
                      style={{ position: "fixed", inset: 0, zIndex: 29 }}
                      onClick={() => setSortDropdownOpen(false)}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "calc(100% + 4px)",
                        right: 0,
                        zIndex: 30,
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        boxShadow: "0 4px 12px var(--shadow)",
                        overflow: "hidden",
                        minWidth: 90,
                      }}
                    >
                      {(["date", "title", "rating"] as const).map((v) => (
                        <button
                          key={v}
                          onClick={() => {
                            onSortOrderChange(v);
                            setSortDropdownOpen(false);
                          }}
                          style={{
                            display: "block",
                            width: "100%",
                            textAlign: "left",
                            padding: "8px 12px",
                            border: "none",
                            background: sortOrder === v ? "#3b82f6" : "transparent",
                            color: sortOrder === v ? "#fff" : "var(--text-primary)",
                            fontSize: 13,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {v === "date" ? "撮影日" : v === "title" ? "タイトル" : "おすすめ"}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={handleCollapseToggle}
              style={{
                position: "absolute",
                right: 4,
                background: "none",
                border: "none",
                padding: 11,
                cursor: "pointer",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
              }}
              title="表示切替"
            >
              {isExpanded ? <ChevronDown size={22} /> : <ChevronUp size={22} />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <>
            {/* 検索ヘッダー（固定） */}
            <div
              style={{
                flexShrink: 0,
                padding: "0 12px 8px",
                borderBottom: "2px solid var(--border)",
                boxShadow: "0 2px 8px var(--shadow)",
              }}
            >
              {/* タブ */}
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <button
                  onClick={() => {
                    setShowTrash(false);
                    setKeyword("");
                  }}
                  style={{
                    flex: 1,
                    padding: "6px 0",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 14,
                    cursor: "pointer",
                    background: !showTrash ? "var(--text-primary)" : "var(--bg-tertiary)",
                    color: !showTrash ? "var(--bg-primary)" : "var(--text-secondary)",
                    fontWeight: !showTrash ? 700 : 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <List size={13} />
                  {isDesktop && " ピン一覧"}
                </button>
                <button
                  onClick={() => {
                    setShowTrash(true);
                    setKeyword("");
                  }}
                  style={{
                    flex: 1,
                    padding: "6px 0",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 14,
                    cursor: "pointer",
                    background: showTrash ? "var(--text-primary)" : "var(--bg-tertiary)",
                    color: showTrash ? "var(--bg-primary)" : "var(--text-secondary)",
                    fontWeight: showTrash ? 700 : 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <Trash2 size={13} />
                  {isDesktop && " ゴミ箱"}
                  {deletedPins.length > 0 && ` (${deletedPins.length})`}
                </button>
              </div>

              {!showTrash && (
                <div>
                  {/* キーワード検索 + フィルターリセット + 絞り込みトグル */}
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      marginBottom: isFilterBarOpen ? 8 : 0,
                    }}
                  >
                    <div style={{ position: "relative", flex: 1 }}>
                      <input
                        type="text"
                        placeholder="キーワードで絞り込み（スペース区切りでAND）"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        style={{
                          width: "100%",
                          padding: keyword ? "8px 32px 8px 12px" : "8px 12px",
                          borderRadius: 8,
                          border: "1.5px solid var(--border)",
                          fontSize: 15,
                          outline: "none",
                          boxSizing: "border-box",
                          background: "var(--input-bg)",
                          color: "var(--text-primary)",
                        }}
                      />
                      {keyword && (
                        <button
                          onClick={() => setKeyword("")}
                          style={{
                            position: "absolute",
                            right: 8,
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "none",
                            border: "none",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    {(categoryFilter !== "all" ||
                      reactionFilter !== "all" ||
                      ratingFilter !== null ||
                      tagFilter.length > 0 ||
                      takenFrom ||
                      takenTo) && (
                      <button
                        onClick={() => {
                          setCategoryFilter("all");
                          setReactionFilter("all");
                          setRatingFilter(null);
                          setQuickSort(null);
                          setTagFilter([]);
                          setTakenFrom("");
                          setTakenTo("");
                          setOpenSection(null);
                        }}
                        title="フィルターをリセット"
                        style={{
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          padding: "8px 10px",
                          border: "1.5px solid #ef4444",
                          borderRadius: 8,
                          cursor: "pointer",
                          background: "none",
                          color: "#ef4444",
                        }}
                      >
                        <FilterX size={15} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const next = !isFilterBarOpen;
                        setIsFilterBarOpen(next);
                        if (!next) setOpenSection(null);
                      }}
                      style={{
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "8px 10px",
                        border: "1.5px solid var(--border)",
                        borderRadius: 8,
                        fontSize: 13,
                        cursor: "pointer",
                        background: isFilterBarOpen ? "var(--text-primary)" : "var(--bg-primary)",
                        color: isFilterBarOpen ? "var(--bg-primary)" : "var(--text-secondary)",
                        boxShadow: isFilterBarOpen ? "none" : "var(--btn-shadow)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <SlidersHorizontal size={13} />
                      絞り込み
                    </button>
                  </div>

                  {/* フィルターセクションボタン（絞り込みバー展開時のみ表示） */}
                  {isFilterBarOpen && (
                    <div style={{ display: "flex", gap: 4 }}>
                      <SectionFilterButton
                        label="カテゴリー"
                        active={openSection === "category"}
                        hasFilter={categoryFilter !== "all"}
                        onClick={() =>
                          setOpenSection((s) => (s === "category" ? null : "category"))
                        }
                        color="#3b82f6"
                        icon={LayoutGrid}
                      />
                      <SectionFilterButton
                        label="★評価"
                        active={openSection === "rating"}
                        hasFilter={ratingFilter !== null}
                        onClick={() => setOpenSection((s) => (s === "rating" ? null : "rating"))}
                        color="#f59e0b"
                        icon={Star}
                      />
                      <SectionFilterButton
                        label="リアクション"
                        active={openSection === "reaction"}
                        hasFilter={reactionFilter !== "all"}
                        onClick={() =>
                          setOpenSection((s) => (s === "reaction" ? null : "reaction"))
                        }
                        color="#22c55e"
                        icon={Smile}
                      />
                      <SectionFilterButton
                        label="マイタグ"
                        active={openSection === "tag"}
                        hasFilter={tagFilter.length > 0}
                        onClick={() => setOpenSection((s) => (s === "tag" ? null : "tag"))}
                        color="#8b5cf6"
                        icon={Tag}
                      />
                      <SectionFilterButton
                        label="撮影日"
                        active={openSection === "date"}
                        hasFilter={!!(takenFrom || takenTo)}
                        onClick={() => setOpenSection((s) => (s === "date" ? null : "date"))}
                        color="#f59e0b"
                        icon={Calendar}
                      />
                    </div>
                  )}

                  {/* インライン展開エリア */}
                  {openSection !== null && (
                    <div
                      style={{
                        marginTop: 8,
                        paddingTop: 8,
                        borderTop: "1px solid var(--border-light)",
                      }}
                    >
                      {openSection === "category" && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          <FilterPill
                            label="すべて"
                            active={categoryFilter === "all"}
                            color="#1a1a2e"
                            onClick={() => setCategoryFilter("all")}
                          />
                          {PRESET_CATEGORIES.map((cat) => (
                            <FilterPill
                              key={cat.id}
                              label={`${cat.emoji} ${cat.name}`}
                              active={categoryFilter === cat.id}
                              color={cat.markerColor}
                              onClick={() => setCategoryFilter(cat.id)}
                            />
                          ))}
                        </div>
                      )}

                      {openSection === "reaction" && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          <FilterPill
                            label="すべて"
                            active={reactionFilter === "all"}
                            color="#6b7280"
                            onClick={() => setReactionFilter("all")}
                          />
                          <FilterPill
                            label="😊 また行きたい"
                            active={reactionFilter === "want_to_revisit"}
                            color="#22c55e"
                            onClick={() => setReactionFilter("want_to_revisit")}
                          />
                          <FilterPill
                            label="😐 一回でいいかな"
                            active={reactionFilter === "once_was_enough"}
                            color="#f59e0b"
                            onClick={() => setReactionFilter("once_was_enough")}
                          />
                          <FilterPill
                            label="😩 二度と行かない"
                            active={reactionFilter === "never_again"}
                            color="#ef4444"
                            onClick={() => setReactionFilter("never_again")}
                          />
                          <FilterPill
                            label="未設定"
                            active={reactionFilter === "none"}
                            color="#9ca3af"
                            onClick={() => setReactionFilter("none")}
                          />
                        </div>
                      )}

                      {openSection === "tag" && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {tagKeywords.length === 0 ? (
                            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
                              マイタグがまだ記録されていません
                            </p>
                          ) : (
                            tagKeywords.map((kw) => (
                              <FilterPill
                                key={kw}
                                label={kw}
                                active={tagFilter.includes(kw)}
                                color="#8b5cf6"
                                onClick={() =>
                                  setTagFilter((f) =>
                                    f.includes(kw) ? f.filter((x) => x !== kw) : [...f, kw]
                                  )
                                }
                              />
                            ))
                          )}
                        </div>
                      )}

                      {openSection === "rating" && (
                        <div>
                          <div
                            style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}
                          >
                            <FilterPill
                              label="すべて"
                              active={ratingFilter === null}
                              color="#6b7280"
                              onClick={() => setRatingFilter(null)}
                            />
                            <FilterPill
                              label="★3以上"
                              active={ratingFilter === 6}
                              color="#f59e0b"
                              onClick={() => setRatingFilter(6)}
                            />
                            <FilterPill
                              label="★4以上"
                              active={ratingFilter === 8}
                              color="#f59e0b"
                              onClick={() => setRatingFilter(8)}
                            />
                            <FilterPill
                              label="★5のみ"
                              active={ratingFilter === 10}
                              color="#f59e0b"
                              onClick={() => setRatingFilter(10)}
                            />
                          </div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                              ソート:
                            </span>
                            <button
                              onClick={() => setQuickSort(quickSort === "rating" ? null : "rating")}
                              style={{
                                padding: "4px 10px",
                                borderRadius: 12,
                                border: "none",
                                fontSize: 13,
                                cursor: "pointer",
                                background: quickSort === "rating" ? "#f59e0b" : "var(--pill-bg)",
                                color: quickSort === "rating" ? "#fff" : "var(--pill-text)",
                                fontWeight: quickSort === "rating" ? 600 : 400,
                              }}
                            >
                              ★評価順（高い順）
                            </button>
                          </div>
                        </div>
                      )}

                      {openSection === "date" && (
                        <div>
                          <div
                            style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}
                          >
                            {(["all", "today", "week", "month", "year"] as const).map((preset) => {
                              const now = new Date();
                              const todayStr = toLocalDateStr(now);
                              const weekStart = toLocalDateStr(
                                new Date(
                                  now.getFullYear(),
                                  now.getMonth(),
                                  now.getDate() - now.getDay()
                                )
                              );
                              const monthStart = toLocalDateStr(
                                new Date(now.getFullYear(), now.getMonth(), 1)
                              );
                              const yearStart = toLocalDateStr(new Date(now.getFullYear(), 0, 1));
                              const isActive =
                                preset === "all"
                                  ? !takenFrom && !takenTo
                                  : preset === "today"
                                    ? takenFrom === todayStr && takenTo === todayStr
                                    : preset === "week"
                                      ? takenFrom === weekStart && !takenTo
                                      : preset === "month"
                                        ? takenFrom === monthStart && !takenTo
                                        : takenFrom === yearStart && !takenTo;
                              return (
                                <FilterPill
                                  key={preset}
                                  label={
                                    preset === "all"
                                      ? "全期間"
                                      : preset === "today"
                                        ? "今日"
                                        : preset === "week"
                                          ? "今週"
                                          : preset === "month"
                                            ? "今月"
                                            : "今年"
                                  }
                                  active={isActive}
                                  color="#6366f1"
                                  onClick={() => applyDatePreset(preset, setTakenFrom, setTakenTo)}
                                />
                              );
                            })}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 12, color: "#999", flexShrink: 0 }}>期間</span>
                            <input
                              type="date"
                              value={takenFrom}
                              onChange={(e) => setTakenFrom(e.target.value)}
                              style={{
                                padding: "4px 6px",
                                borderRadius: 6,
                                border: "1.5px solid var(--border)",
                                fontSize: 13,
                                outline: "none",
                                background: "var(--input-bg)",
                                color: "var(--text-primary)",
                              }}
                            />
                            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>〜</span>
                            <input
                              type="date"
                              value={takenTo}
                              onChange={(e) => setTakenTo(e.target.value)}
                              style={{
                                padding: "4px 6px",
                                borderRadius: 6,
                                border: "1.5px solid var(--border)",
                                fontSize: 13,
                                outline: "none",
                                background: "var(--input-bg)",
                                color: "var(--text-primary)",
                              }}
                            />
                            {(takenFrom || takenTo) && (
                              <button
                                onClick={() => {
                                  setTakenFrom("");
                                  setTakenTo("");
                                }}
                                style={{
                                  flexShrink: 0,
                                  background: "none",
                                  border: "none",
                                  color: "#aaa",
                                  fontSize: 15,
                                  cursor: "pointer",
                                  padding: "0 2px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {showTrash && (
              <div
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 12px",
                }}
              >
                <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
                  削除後{trashRetentionDays}日で自動削除されます
                </p>
                {deletedPins.length > 0 && (
                  <button
                    onClick={() => setDeleteConfirm({ type: "all" })}
                    style={{
                      fontSize: 13,
                      color: "#ef4444",
                      background: "none",
                      border: "1px solid #ef4444",
                      borderRadius: 6,
                      padding: "4px 10px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    全削除
                  </button>
                )}
              </div>
            )}

            {/* スクロール可能なリスト */}
            <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 12px" }}>
              {currentList.length === 0 ? (
                <p
                  style={{
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: 14,
                    marginTop: 24,
                  }}
                >
                  {showTrash ? "ゴミ箱は空です" : "該当するピンがありません"}
                </p>
              ) : (
                currentList.map((pin) => {
                  const cat = PRESET_CATEGORIES.find((c) => c.id === (pin.categoryId ?? "general"));
                  return (
                    <div
                      key={pin.id}
                      style={{
                        borderBottom: "1px solid var(--border-light)",
                        padding: "10px 4px",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <PinThumb
                        pin={pin}
                        photoRepo={photoRepo}
                        onClick={!showTrash ? () => onPinFlyTo(pin) : undefined}
                      />
                      <button
                        onClick={() => {
                          if (!showTrash) {
                            onPinDetail(pin);
                            onPinFlyTo(pin);
                          }
                        }}
                        disabled={showTrash}
                        style={{
                          flex: 1,
                          textAlign: "left",
                          background: "none",
                          border: "none",
                          cursor: showTrash ? "default" : "pointer",
                          padding: 0,
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          minWidth: 0,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {cat && (
                            <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0 }}>
                              {cat.emoji}
                            </span>
                          )}
                          <span
                            style={{
                              fontSize: 15,
                              fontWeight: 600,
                              color: showTrash ? "var(--text-muted)" : "var(--text-primary)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {pin.title}
                          </span>
                          {pin.reaction && (
                            <span style={{ fontSize: 15, lineHeight: 1, flexShrink: 0 }}>
                              {REACTION_EMOJI_MAP[pin.reaction]}
                            </span>
                          )}
                          {pin.rating != null && (
                            <span
                              style={{
                                fontSize: 12,
                                color: "#f59e0b",
                                lineHeight: 1,
                                flexShrink: 0,
                              }}
                            >
                              {`★${(pin.rating / 2).toFixed(pin.rating % 2 === 0 ? 0 : 1)}`}
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            paddingLeft: 14,
                          }}
                        >
                          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                            {(pin.exif?.takenAt ?? pin.createdAt).toLocaleString("ja-JP", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {pin.exif?.takenAt && pin.exif.takenAtEstimated && "（推定）"}
                            {showTrash && pin.deletedAt && (
                              <> · 削除: {pin.deletedAt.toLocaleDateString("ja-JP")}</>
                            )}
                          </span>
                          {pin.tag && (
                            <span
                              style={{
                                fontSize: 12,
                                color: "var(--text-muted)",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {pin.tag}
                            </span>
                          )}
                          {pin.categoryId === "shopping" &&
                            (() => {
                              const unchecked = (pin.shoppingItems ?? []).filter(
                                (i) => !i.checked
                              ).length;
                              return unchecked > 0 ? (
                                <span
                                  style={{
                                    fontSize: 12,
                                    color: "#d946ef",
                                    fontWeight: 600,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  残り{unchecked}件
                                </span>
                              ) : null;
                            })()}
                        </div>
                        {pin.comment && (
                          <span
                            style={{
                              fontSize: 12,
                              color: "var(--text-secondary)",
                              paddingLeft: 14,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "100%",
                            }}
                          >
                            {pin.comment}
                          </span>
                        )}
                      </button>

                      {showTrash ? (
                        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                          <button
                            onClick={() => onRestore(pin)}
                            style={{
                              background: "#22c55e",
                              color: "#fff",
                              border: "none",
                              borderRadius: 6,
                              padding: "4px 10px",
                              fontSize: 13,
                              cursor: "pointer",
                            }}
                          >
                            復元
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: "one", pin })}
                            style={{
                              background: "#ef4444",
                              color: "#fff",
                              border: "none",
                              borderRadius: 6,
                              padding: "4px 10px",
                              fontSize: 13,
                              cursor: "pointer",
                            }}
                          >
                            完全削除
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onDelete(pin)}
                          style={{
                            flexShrink: 0,
                            background: "none",
                            color: "#ccc",
                            border: "none",
                            fontSize: 18,
                            cursor: "pointer",
                            padding: "0 4px",
                            lineHeight: 1,
                            display: "flex",
                            alignItems: "center",
                          }}
                          title="削除"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      {/* 完全削除確認ダイアログ */}
      {deleteConfirm && (
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
              <AlertTriangle size={18} color="#f59e0b" />
              {deleteConfirm.type === "all" ? "ゴミ箱を空にしますか？" : "完全削除しますか？"}
            </h3>
            <p
              style={{
                margin: "0 0 20px",
                fontSize: 15,
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              {deleteConfirm.type === "all"
                ? `${deletedPins.length}件を完全削除します。この操作は元に戻せません。`
                : `「${deleteConfirm.pin.title}」を完全削除します。この操作は元に戻せません。`}
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                onClick={() => setDeleteConfirm(null)}
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
                  if (deleteConfirm.type === "all") {
                    onHardDeleteAll();
                  } else {
                    onHardDelete(deleteConfirm.pin);
                  }
                  setDeleteConfirm(null);
                }}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: 8,
                  background: "#ef4444",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                完全削除
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FilterPill({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        border: "none",
        borderRadius: 14,
        padding: "8px 12px",
        fontSize: 13,
        cursor: "pointer",
        whiteSpace: "nowrap",
        background: active ? color : "var(--pill-bg)",
        color: active ? "#fff" : "var(--pill-text)",
        fontWeight: active ? 700 : 400,
        boxShadow: active ? "none" : "var(--btn-shadow)",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

function SectionFilterButton({
  label,
  active,
  hasFilter,
  onClick,
  color,
  icon: Icon,
}: {
  label: string;
  active: boolean;
  hasFilter: boolean;
  onClick: () => void;
  color: string;
  icon: LucideIcon;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        padding: "10px 6px",
        border: "1px solid",
        borderColor: hasFilter ? color : "var(--border)",
        borderRadius: 8,
        fontSize: 13,
        cursor: "pointer",
        background: active ? color : "var(--bg-primary)",
        color: active ? "#fff" : hasFilter ? color : "var(--text-secondary)",
        fontWeight: hasFilter ? 600 : 400,
        boxShadow: active ? "none" : "var(--btn-shadow)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        transition: "all 0.15s",
      }}
    >
      <Icon size={11} />
      {label}
      {active ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
    </button>
  );
}
