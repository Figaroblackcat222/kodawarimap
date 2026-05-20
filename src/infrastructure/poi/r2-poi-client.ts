import type { FeatureCollection } from "geojson";

const R2_BASE = "https://pub-f197ab02699a4defbc70bf3a7dccdbb9.r2.dev";

export async function fetchTilePoi(x: number, y: number): Promise<FeatureCollection | null> {
  const res = await fetch(`${R2_BASE}/poi/z8/${x}/${y}.geojson`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`POI tile fetch failed: ${res.status}`);
  return res.json() as Promise<FeatureCollection>;
}
