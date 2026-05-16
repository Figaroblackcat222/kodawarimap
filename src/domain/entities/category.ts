export interface Category {
  id: string;
  name: string;
  emoji: string;
  styleUrl: string;
  markerColor: string;
}

export const PRESET_CATEGORIES: Category[] = [
  {
    id: "general",
    name: "汎用",
    emoji: "🗺️",
    styleUrl: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
    markerColor: "#3b82f6",
  },
  {
    id: "food",
    name: "食事",
    emoji: "🍽️",
    styleUrl: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
    markerColor: "#f97316",
  },
  {
    id: "hiking",
    name: "登山",
    emoji: "⛰️",
    styleUrl: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
    markerColor: "#22c55e",
  },
  {
    id: "night",
    name: "夜景",
    emoji: "🌃",
    styleUrl: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
    markerColor: "#f59e0b",
  },
  {
    id: "fishing",
    name: "釣り",
    emoji: "🎣",
    styleUrl: "https://demotiles.maplibre.org/style.json",
    markerColor: "#06b6d4",
  },
];

export const DEFAULT_CATEGORY = PRESET_CATEGORIES[0];
