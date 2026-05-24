import type { FeatureCollection, Feature, Point } from "geojson";

const R2_BASE = "https://pub-f197ab02699a4defbc70bf3a7dccdbb9.r2.dev";

interface AdminPoint {
  name: string;
  lng: number;
  lat: number;
}

let cache: AdminPoint[] | null = null;

async function loadData(): Promise<AdminPoint[]> {
  if (cache) return cache;
  try {
    const res = await fetch(`${R2_BASE}/admin/municipalities.geojson`);
    if (!res.ok) {
      cache = [];
      return cache;
    }
    const fc = (await res.json()) as FeatureCollection;
    cache = fc.features
      .filter((f): f is Feature<Point> => f.geometry.type === "Point")
      .map((f) => ({
        name: (f.properties?.name as string) ?? "",
        lng: f.geometry.coordinates[0],
        lat: f.geometry.coordinates[1],
      }))
      .filter((p) => p.name.length > 0);
  } catch {
    cache = [];
  }
  return cache;
}

/**
 * 座標に最も近い市区町村名（例: "東京都渋谷区"）を返す。
 * データ未ロード時・R2 取得失敗時は null。
 */
export async function findAdminName(lng: number, lat: number): Promise<string | null> {
  const points = await loadData();
  if (points.length === 0) return null;

  let minDist = Infinity;
  let nearest: AdminPoint | null = null;
  for (const p of points) {
    const d = (p.lng - lng) ** 2 + (p.lat - lat) ** 2;
    if (d < minDist) {
      minDist = d;
      nearest = p;
    }
  }
  return nearest?.name ?? null;
}
