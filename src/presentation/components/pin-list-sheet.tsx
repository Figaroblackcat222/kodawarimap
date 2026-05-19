import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { SlidersHorizontal, Trash2, X, ChevronDown, ChevronUp, List } from "lucide-react";
import type { Pin, PinReaction } from "@domain/entities/pin";
import type { PhotoRepository } from "@application/ports/photo-repository";
import { PRESET_CATEGORIES } from "@domain/entities/category";
import { useMediaQuery } from "@presentation/hooks/use-media-query";

const MIN_HEIGHT = 44;
const MAX_HEIGHT_RATIO = 0.8;

function snapHeights() {
  return [
    MIN_HEIGHT,
    Math.round(window.innerHeight * 0.4),
    Math.round(window.innerHeight * MAX_HEIGHT_RATIO),
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
  sortOrder: "date" | "title";
  listScope: "all" | "visible";
  mapBounds: MapBounds | null;
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
  const start = new Date(now);
  if (preset === "today") {
    start.setHours(0, 0, 0, 0);
    setFrom(start.toISOString().split("T")[0]);
    setTo(start.toISOString().split("T")[0]);
    return;
  }
  if (preset === "week") {
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
  } else if (preset === "month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  } else {
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
  }
  setFrom(start.toISOString().split("T")[0]);
  setTo("");
}

function PinThumb({ pinId, photoRepo }: { pinId: string; photoRepo: PhotoRepository }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;
    photoRepo.findByPinId(pinId).then((photos) => {
      if (!cancelled && photos.length > 0) {
        objectUrl = URL.createObjectURL(photos[0].blob);
        setUrl(objectUrl);
      }
    });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [pinId, photoRepo]);

  if (!url) return null;
  return (
    <img
      src={url}
      alt=""
      style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, flexShrink: 0 }}
    />
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
  listScope,
  mapBounds,
}: Props) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [keyword, setKeyword] = useState("");
  const [showTrash, setShowTrash] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [reactionFilter, setReactionFilter] = useState<PinReaction | "none" | "all">("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [takenFrom, setTakenFrom] = useState("");
  const [takenTo, setTakenTo] = useState("");

  const dragRef = useRef<{ startY: number; startHeight: number } | null>(null);

  const handleCollapseToggle = useCallback(() => {
    const snaps = snapHeights();
    const idx = snaps.reduce(
      (best, s, i) => (Math.abs(s - sheetHeight) < Math.abs(snaps[best] - sheetHeight) ? i : best),
      0
    );
    onSheetHeightChange(snaps[(idx + 1) % snaps.length]);
  }, [sheetHeight, onSheetHeightChange]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = { startY: e.clientY, startHeight: sheetHeight };
    },
    [sheetHeight]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      const delta = dragRef.current.startY - e.clientY;
      const newHeight = dragRef.current.startHeight + delta;
      const maxH = Math.round(window.innerHeight * MAX_HEIGHT_RATIO);
      onSheetHeightChange(Math.max(MIN_HEIGHT, Math.min(newHeight, maxH)));
    },
    [onSheetHeightChange]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.releasePointerCapture(e.pointerId);
      dragRef.current = null;
      const snaps = snapHeights();
      const nearest = snaps.reduce((best, s) =>
        Math.abs(s - sheetHeight) < Math.abs(best - sheetHeight) ? s : best
      );
      onSheetHeightChange(nearest);
    },
    [sheetHeight, onSheetHeightChange]
  );

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
            p.title.toLowerCase().includes(t) || (p.comment?.toLowerCase().includes(t) ?? false)
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
    if (sortOrder === "title") {
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
    takenFrom,
    takenTo,
    sortOrder,
    listScope,
    mapBounds,
  ]);

  const currentList = showTrash ? deletedPins : activePins;
  const isExpanded = sheetHeight > MIN_HEIGHT;

  return (
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
            style={{ width: 40, height: 5, borderRadius: 3, background: "#999", display: "block" }}
          />
        </div>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px 16px 8px",
            fontSize: 13,
            color: "var(--text-secondary)",
          }}
        >
          <span>{showTrash ? `ゴミ箱 ${deletedPins.length}件` : `ピン ${pins.length}件`}</span>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleCollapseToggle}
            style={{
              position: "absolute",
              right: 8,
              background: "none",
              border: "none",
              padding: 4,
              cursor: "pointer",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
            }}
            title="表示切替"
          >
            {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
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
              borderBottom: "1px solid var(--border-light)",
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
                  fontSize: 13,
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
                  fontSize: 13,
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
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
                      border: "1px solid var(--border)",
                      fontSize: 14,
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
                <button
                  onClick={() => setIsFilterOpen((v) => !v)}
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "8px 12px",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 13,
                    cursor: "pointer",
                    background: isFilterOpen ? "var(--text-primary)" : "var(--bg-primary)",
                    color: isFilterOpen ? "var(--bg-primary)" : "var(--text-secondary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <SlidersHorizontal size={14} />
                  {isDesktop && " フィルター"}
                </button>
              </div>
            )}
          </div>

          {/* フィルター展開エリア */}
          {!showTrash && isFilterOpen && (
            <div
              style={{
                flexShrink: 0,
                padding: "8px 12px",
                borderBottom: "1px solid var(--border-light)",
                background: "var(--bg-secondary)",
              }}
            >
              {/* カテゴリーフィルター */}
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginBottom: 8,
                  overflowX: "auto",
                  paddingBottom: 2,
                }}
              >
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

              {/* リアクションフィルター */}
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  marginBottom: 8,
                  overflowX: "auto",
                  paddingBottom: 2,
                }}
              >
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

              {/* 撮影日プリセット */}
              <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                {(["all", "today", "week", "month", "year"] as const).map((preset) => {
                  const todayStr = new Date().toISOString().split("T")[0];
                  const isActive =
                    preset === "all"
                      ? !takenFrom && !takenTo
                      : preset === "today"
                        ? takenFrom === todayStr && takenTo === todayStr
                        : false;
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

              {/* 撮影日カスタム範囲 */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: "#999", flexShrink: 0 }}>撮影日</span>
                <input
                  type="date"
                  value={takenFrom}
                  onChange={(e) => setTakenFrom(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "4px 6px",
                    borderRadius: 6,
                    border: "1px solid var(--border)",
                    fontSize: 12,
                    outline: "none",
                    background: "var(--input-bg)",
                    color: "var(--text-primary)",
                  }}
                />
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>〜</span>
                <input
                  type="date"
                  value={takenTo}
                  onChange={(e) => setTakenTo(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "4px 6px",
                    borderRadius: 6,
                    border: "1px solid var(--border)",
                    fontSize: 12,
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
                      fontSize: 14,
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

              {/* フィルターリセット */}
              {(categoryFilter !== "all" || reactionFilter !== "all" || takenFrom || takenTo) && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
                  <button
                    onClick={() => {
                      setCategoryFilter("all");
                      setReactionFilter("all");
                      setTakenFrom("");
                      setTakenTo("");
                    }}
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      background: "none",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      padding: "4px 10px",
                      cursor: "pointer",
                    }}
                  >
                    フィルターをリセット
                  </button>
                </div>
              )}
            </div>
          )}

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
              <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
                削除後{trashRetentionDays}日で自動削除されます
              </p>
              {deletedPins.length > 0 && (
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        `ゴミ箱の${deletedPins.length}件を全て完全削除しますか？\nこの操作は元に戻せません。`
                      )
                    ) {
                      onHardDeleteAll();
                    }
                  }}
                  style={{
                    fontSize: 12,
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
                  fontSize: 13,
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
                    <PinThumb pinId={pin.id} photoRepo={photoRepo} />
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
                            fontSize: 14,
                            fontWeight: 600,
                            color: showTrash ? "var(--text-muted)" : "var(--text-primary)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {pin.title}
                        </span>
                      </div>
                      <span style={{ fontSize: 12, color: "var(--text-muted)", paddingLeft: 14 }}>
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
                      {pin.comment && (
                        <span
                          style={{
                            fontSize: 11,
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
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                        >
                          復元
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `「${pin.title}」を完全削除しますか？\nこの操作は元に戻せません。`
                              )
                            ) {
                              onHardDelete(pin);
                            }
                          }}
                          style={{
                            background: "#ef4444",
                            color: "#fff",
                            border: "none",
                            borderRadius: 6,
                            padding: "4px 10px",
                            fontSize: 12,
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
        padding: "4px 12px",
        fontSize: 12,
        cursor: "pointer",
        whiteSpace: "nowrap",
        background: active ? color : "var(--pill-bg)",
        color: active ? "#fff" : "var(--pill-text)",
        fontWeight: active ? 700 : 400,
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}
