import type { FeatureCollection } from "geojson";
import { fetchTilePoi } from "./r2-poi-client";
import { fetchPoiFromOverpass } from "./overpass-client";

// キャッシュキー: kodawarimap:poi-tile:8:{x}:{y}
function tileKey(x: number, y: number): string {
  return `kodawarimap:poi-tile:8:${x}:${y}`;
}

function getCachedTile(x: number, y: number): FeatureCollection["features"] | null {
  try {
    const raw = localStorage.getItem(tileKey(x, y));
    if (!raw) return null;
    return JSON.parse(raw) as FeatureCollection["features"];
  } catch {
    return null;
  }
}

function saveTileCache(x: number, y: number, features: FeatureCollection["features"]): void {
  try {
    localStorage.setItem(tileKey(x, y), JSON.stringify(features));
  } catch {
    // QuotaExceededError は無視
  }
}

const OVERPASS_RADIUS = 0.05; // 約5km

// フロー: ローカルキャッシュ → R2タイル → Overpass（ピン周辺±0.05°）
export async function loadPoiTile(
  x: number,
  y: number,
  lng: number,
  lat: number
): Promise<FeatureCollection["features"]> {
  const cached = getCachedTile(x, y);
  if (cached) return cached;

  try {
    const fc = await fetchTilePoi(x, y);
    if (fc !== null) {
      saveTileCache(x, y, fc.features);
      return fc.features;
    }
  } catch {
    // R2失敗はOverpassにフォールバック
  }

  try {
    const bbox = {
      west: lng - OVERPASS_RADIUS,
      east: lng + OVERPASS_RADIUS,
      south: lat - OVERPASS_RADIUS,
      north: lat + OVERPASS_RADIUS,
    };
    const features = await fetchPoiFromOverpass(bbox);
    saveTileCache(x, y, features);
    return features;
  } catch {
    return [];
  }
}
