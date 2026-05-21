export interface Category {
  id: string;
  name: string;
  emoji: string;
  styleUrl: string;
  markerColor: string;
}

export const PRESET_CATEGORIES: Category[] = [
  { id: "general", name: "汎用", emoji: "🗺️", styleUrl: "protomaps:light", markerColor: "#3b82f6" },
  { id: "food", name: "食事", emoji: "🍽️", styleUrl: "protomaps:light", markerColor: "#f97316" },
  {
    id: "hiking",
    name: "登山",
    emoji: "⛰️",
    styleUrl: "protomaps:grayscale",
    markerColor: "#22c55e",
  },
  { id: "fishing", name: "釣り", emoji: "🎣", styleUrl: "protomaps:light", markerColor: "#06b6d4" },
  { id: "travel", name: "旅行", emoji: "🧳", styleUrl: "protomaps:light", markerColor: "#8b5cf6" },
  {
    id: "theme_park",
    name: "テーマパーク",
    emoji: "🎡",
    styleUrl: "protomaps:light",
    markerColor: "#ec4899",
  },
  {
    id: "shrine_temple",
    name: "神社仏閣",
    emoji: "⛩️",
    styleUrl: "protomaps:light",
    markerColor: "#ef4444",
  },
  {
    id: "camping",
    name: "キャンプ",
    emoji: "⛺",
    styleUrl: "protomaps:grayscale",
    markerColor: "#84cc16",
  },
  { id: "onsen", name: "温泉", emoji: "♨️", styleUrl: "protomaps:light", markerColor: "#f59e0b" },
  {
    id: "beach",
    name: "海・ビーチ",
    emoji: "🏖️",
    styleUrl: "protomaps:light",
    markerColor: "#0ea5e9",
  },
  {
    id: "nature",
    name: "公園・自然",
    emoji: "🌿",
    styleUrl: "protomaps:grayscale",
    markerColor: "#14b8a6",
  },
  {
    id: "shopping",
    name: "ショッピング",
    emoji: "🛍️",
    styleUrl: "protomaps:light",
    markerColor: "#d946ef",
  },
];

export const DEFAULT_CATEGORY = PRESET_CATEGORIES[0];
