/**
 * 国土数値情報 N03（行政区域）GeoJSON から市区町村重心点を生成する。
 *
 * 使い方:
 *   1. https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-2024.html
 *      から「全国」の GeoJSON をダウンロードして展開
 *   2. node scripts/build-admin-centroids.mjs N03_24_240101.geojson
 *   3. 生成された admin-centroids.geojson を R2 にアップロード:
 *      wrangler r2 object put kodawarimap-photos/admin/municipalities.geojson \
 *        --file admin-centroids.geojson --content-type application/json
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node scripts/build-admin-centroids.mjs <N03_GeoJSON_file>");
  process.exit(1);
}

console.log(`読み込み中: ${inputPath}`);
const data = JSON.parse(readFileSync(resolve(inputPath), "utf-8"));
console.log(`フィーチャー数: ${data.features.length}`);

// 行政区域コード (N03_007) でグループ化
const groups = new Map();
for (const feature of data.features) {
  const props = feature.properties;
  const code = props.N03_007;
  if (!code) continue;

  if (!groups.has(code)) {
    groups.set(code, { props, coords: [] });
  }
  collectCoords(feature.geometry, groups.get(code).coords);
}

function collectCoords(geom, out) {
  if (geom.type === "Polygon") {
    for (const ring of geom.coordinates) {
      for (const pt of ring) out.push(pt);
    }
  } else if (geom.type === "MultiPolygon") {
    for (const poly of geom.coordinates) {
      for (const ring of poly) {
        for (const pt of ring) out.push(pt);
      }
    }
  }
}

function bboxCenter(coords) {
  let minLng = Infinity,
    maxLng = -Infinity;
  let minLat = Infinity,
    maxLat = -Infinity;
  for (const [lng, lat] of coords) {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }
  return [
    Math.round(((minLng + maxLng) / 2) * 10000) / 10000,
    Math.round(((minLat + maxLat) / 2) * 10000) / 10000,
  ];
}

function buildName(props) {
  const pref = props.N03_001 ?? "";
  const city = props.N03_003 ?? ""; // 郡・政令市名
  const town = props.N03_004 ?? ""; // 市区町村名
  return `${pref}${city}${town}`;
}

const features = [];
for (const [, { props, coords }] of groups) {
  if (coords.length === 0) continue;
  const name = buildName(props);
  if (!name) continue;

  const [lng, lat] = bboxCenter(coords);
  features.push({
    type: "Feature",
    geometry: { type: "Point", coordinates: [lng, lat] },
    properties: { name },
  });
}

const output = { type: "FeatureCollection", features };
const outPath = "admin-centroids.geojson";
writeFileSync(outPath, JSON.stringify(output));

const sizeKB = Math.round(Buffer.byteLength(JSON.stringify(output)) / 1024);
console.log(`✅ ${features.length}件 → ${outPath} (${sizeKB} KB)`);
console.log(
  `\nR2 アップロード:\n  wrangler r2 object put kodawarimap-photos/admin/municipalities.geojson --file ${outPath} --content-type application/json`
);
