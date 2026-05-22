#!/usr/bin/env node
/**
 * Overpass API から z8 タイル単位で POI を取得し poi/z8/{x}/{y}.geojson として出力する。
 *
 * 使い方:
 *   node scripts/fetch-poi-tiles.mjs list              # 地域一覧とタイル数を表示
 *   node scripts/fetch-poi-tiles.mjs kanto             # 関東を取得
 *   node scripts/fetch-poi-tiles.mjs kanto --force     # 既存ファイルを上書き
 *   node scripts/fetch-poi-tiles.mjs kanto --count     # 件数確認のみ（取得しない）
 *
 * 出力先: output/poi/z8/{x}/{y}.geojson
 *
 * R2 アップロード例（wrangler）:
 *   find output/poi -name "*.geojson" | while read f; do
 *     key=${f#output/}
 *     wrangler r2 object put <バケット名>/$key --file $f --content-type application/json
 *   done
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";

const ZOOM = 8;
const OUTPUT_DIR = "./output/poi/z8";
const OVERPASS_URL = "https://overpass.private.coffee/api/interpreter";
const OVERPASS_TIMEOUT_SEC = 30;
const CATEGORY_INTERVAL_MS = 5000; // カテゴリー間のインターバル（サーバーガイドライン：5秒以上）
const TILE_INTERVAL_MS = 5000; // タイル間のインターバル

// ---- タイルユーティリティ（tile-utils.ts と同ロジック） ----

function lngLatToTile(lng, lat, zoom) {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
  return { x, y };
}

function tileToBbox(x, y, zoom) {
  const n = Math.pow(2, zoom);
  const west = (x / n) * 360 - 180;
  const east = ((x + 1) / n) * 360 - 180;
  const north = (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n))) * 180) / Math.PI;
  const south = (Math.atan(Math.sinh(Math.PI * (1 - (2 * (y + 1)) / n))) * 180) / Math.PI;
  return { west, east, south, north };
}

function tilesInBbox(west, south, east, north, zoom) {
  const { x: x0, y: y0 } = lngLatToTile(west, north, zoom);
  const { x: x1, y: y1 } = lngLatToTile(east, south, zoom);
  const tiles = [];
  for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) tiles.push({ x, y });
  return tiles;
}

// ---- 地域プリセット [west, south, east, north] ----

const REGIONS = {
  hokkaido: { name: "北海道", bbox: [139.3, 41.3, 146.0, 45.6] },
  tohoku: { name: "東北", bbox: [139.4, 36.9, 141.9, 41.5] },
  kanto: { name: "関東", bbox: [138.5, 34.9, 141.0, 37.0] },
  chubu: { name: "中部", bbox: [136.0, 34.8, 139.0, 37.5] },
  kinki: { name: "近畿", bbox: [134.5, 33.8, 136.2, 35.7] },
  chugoku: { name: "中国", bbox: [131.0, 33.4, 134.6, 35.5] },
  shikoku: { name: "四国", bbox: [132.0, 32.4, 134.6, 34.5] },
  kyushu: { name: "九州", bbox: [129.5, 30.9, 132.0, 34.0] },
  okinawa: { name: "沖縄", bbox: [122.9, 24.0, 131.5, 27.5] },
};

// ---- カテゴリー別クエリ定義 ----

const CATEGORY_QUERIES = [
  {
    label: "観光スポット",
    nodes: [`["tourism"="attraction"]["name"]`, `["tourism"="museum"]["name"]`],
  },
  {
    label: "史跡・城",
    nodes: [`["historic"~"castle|ruins|archaeological_site"]["name"]`],
  },
  {
    label: "登山・展望台",
    nodes: [
      `["natural"="peak"]["name"]`,
      `["tourism"="viewpoint"]["name"]`,
      `["tourism"="alpine_hut"]["name"]`,
    ],
  },
  { label: "釣り", nodes: [`["leisure"="fishing"]["name"]`] },
  {
    label: "テーマパーク",
    nodes: [`["tourism"="theme_park"]["name"]`, `["leisure"="water_park"]["name"]`],
  },
  {
    label: "神社",
    nodes: [`["amenity"="place_of_worship"]["religion"="shinto"]["name"]`],
  },
  {
    label: "寺院",
    nodes: [`["amenity"="place_of_worship"]["religion"="buddhist"]["name"]`],
  },
  { label: "キャンプ", nodes: [`["tourism"="camp_site"]["name"]`] },
  {
    label: "温泉",
    nodes: [`["amenity"="bath_house"]["name"]`, `["natural"="hot_spring"]["name"]`],
  },
  {
    label: "海・ビーチ",
    nodes: [`["natural"="beach"]["name"]`, `["leisure"="beach_resort"]["name"]`],
  },
  { label: "自然保護区", nodes: [`["leisure"="nature_reserve"]["name"]`] },
  {
    label: "ショッピング",
    nodes: [`["shop"~"department_store|mall"]["name"]`],
  },
];

function buildCategoryQuery(bbox, nodes) {
  const { south: S, west: W, north: N, east: E } = bbox;
  const nodeLines = nodes.map((c) => `  node${c}(${S},${W},${N},${E});`).join("\n");
  return `[out:json][timeout:${OVERPASS_TIMEOUT_SEC}];\n(\n${nodeLines}\n);\nout body;`;
}

function buildCountQuery(bbox, nodes) {
  return buildCategoryQuery(bbox, nodes).replace("out body;", "out count;");
}

function resolveCategoryId(tags) {
  if (tags["natural"] === "peak" || tags["tourism"] === "alpine_hut") return "hiking";
  if (tags["tourism"] === "viewpoint") return "hiking";
  if (
    tags["amenity"] === "place_of_worship" &&
    (tags["religion"] === "shinto" || tags["religion"] === "buddhist")
  )
    return "shrine_temple";
  if (tags["tourism"] === "theme_park" || tags["leisure"] === "water_park") return "theme_park";
  if (tags["tourism"] === "camp_site") return "camping";
  if (tags["amenity"] === "bath_house" || tags["natural"] === "hot_spring") return "onsen";
  if (tags["natural"] === "beach" || tags["leisure"] === "beach_resort") return "beach";
  if (tags["leisure"] === "nature_reserve") return "nature";
  if (tags["shop"] === "department_store" || tags["shop"] === "mall") return "shopping";
  if (tags["tourism"] === "museum") return "travel";
  if (tags["leisure"] === "fishing") return "fishing";
  if (tags["tourism"] === "attraction") return "travel";
  if ("historic" in tags) return "travel";
  return "travel";
}

// ---- Overpass フェッチ ----

async function overpassFetch(query) {
  return fetch(OVERPASS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "kodawarimap-poi-fetcher/1.0",
    },
    body: `data=${encodeURIComponent(query)}`,
  });
}

// カテゴリー1件分の要素を取得（504時はz9サブタイルに分割して再試行）
async function fetchCategoryElements(bbox, nodes, depth = 0) {
  const query = buildCategoryQuery(bbox, nodes);
  const res = await overpassFetch(query);

  if (res.status === 504 && depth < 1) {
    // bbox を4分割して再試行
    const { west: W, east: E, south: S, north: N } = bbox;
    const midLng = (W + E) / 2;
    const midLat = (S + N) / 2;
    const subBboxes = [
      { west: W, east: midLng, south: midLat, north: N },
      { west: midLng, east: E, south: midLat, north: N },
      { west: W, east: midLng, south: S, north: midLat },
      { west: midLng, east: E, south: S, north: midLat },
    ];
    const elements = [];
    for (let i = 0; i < subBboxes.length; i++) {
      const sub = await fetchCategoryElements(subBboxes[i], nodes, depth + 1);
      elements.push(...sub);
      if (i < subBboxes.length - 1) await sleep(CATEGORY_INTERVAL_MS);
    }
    return elements;
  }

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()).elements;
}

// カテゴリー毎に取得してマージ
async function fetchTile(x, y) {
  const bbox = tileToBbox(x, y, ZOOM);
  const seenIds = new Set();
  const features = [];

  for (let ci = 0; ci < CATEGORY_QUERIES.length; ci++) {
    const { label, nodes } = CATEGORY_QUERIES[ci];
    try {
      const elements = await fetchCategoryElements(bbox, nodes);
      const added = [];
      for (const node of elements) {
        if (!seenIds.has(node.id)) {
          seenIds.add(node.id);
          features.push({
            type: "Feature",
            geometry: { type: "Point", coordinates: [node.lon, node.lat] },
            properties: {
              name: node.tags["name"] ?? node.tags["name:ja"] ?? "",
              categoryId: resolveCategoryId(node.tags),
            },
          });
          added.push(node.id);
        }
      }
      process.stdout.write(` ${label}:${added.length}`);
    } catch (err) {
      process.stdout.write(` ${label}:✗`);
    }
    if (ci < CATEGORY_QUERIES.length - 1) await sleep(CATEGORY_INTERVAL_MS);
  }

  return { type: "FeatureCollection", features };
}

// --count モード: カテゴリー別件数確認
async function countTile(x, y) {
  const bbox = tileToBbox(x, y, ZOOM);
  const results = [];
  for (let ci = 0; ci < CATEGORY_QUERIES.length; ci++) {
    const { label, nodes } = CATEGORY_QUERIES[ci];
    try {
      const res = await overpassFetch(buildCountQuery(bbox, nodes));
      if (!res.ok) {
        results.push({ label, count: -1 });
      } else {
        const data = await res.json();
        results.push({ label, count: parseInt(data.elements[0]?.tags?.total ?? "0", 10) });
      }
    } catch {
      results.push({ label, count: -1 });
    }
    if (ci < CATEGORY_QUERIES.length - 1) await sleep(CATEGORY_INTERVAL_MS);
  }
  return results;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ---- エントリーポイント ----

const arg = process.argv[2];
const force = process.argv.includes("--force");
const countMode = process.argv.includes("--count");

if (!arg || arg === "list") {
  console.log("\n地域一覧:\n");
  console.log("  キー".padEnd(14) + "地域名".padEnd(10) + "タイル数");
  console.log("  " + "─".repeat(30));
  let total = 0;
  for (const [key, { name, bbox }] of Object.entries(REGIONS)) {
    const count = tilesInBbox(...bbox, ZOOM).length;
    total += count;
    console.log(`  ${key.padEnd(12)}${name.padEnd(10)}${count}`);
  }
  console.log("  " + "─".repeat(30));
  console.log(`  ${"合計".padEnd(22)}${total}`);
  console.log("\n使い方: node scripts/fetch-poi-tiles.mjs <キー> [--force] [--count]\n");
  process.exit(0);
}

const region = REGIONS[arg];
if (!region) {
  console.error(`エラー: 地域 "${arg}" は存在しません。"list" で一覧を確認してください。`);
  process.exit(1);
}

const tiles = tilesInBbox(...region.bbox, ZOOM);

// --count モード
if (countMode) {
  console.log(`\n${region.name} (${arg}): ${tiles.length} タイルのカテゴリー別件数を確認します\n`);
  for (const [i, { x, y }] of tiles.entries()) {
    console.log(`[${String(i + 1).padStart(2)}/${tiles.length}] (${x},${y})`);
    const results = await countTile(x, y);
    let total = 0;
    for (const { label, count } of results) {
      if (count > 0) {
        console.log(`  ${label.padEnd(12)} ${count}件`);
        total += count;
      }
    }
    console.log(`  ${"合計".padEnd(12)} ${total}件`);
    if (i < tiles.length - 1) {
      console.log();
      await sleep(TILE_INTERVAL_MS);
    }
  }
  process.exit(0);
}

// 通常取得モード
console.log(`\n${region.name} (${arg}): ${tiles.length} タイルを取得します`);
if (force) console.log("--force: 既存ファイルを上書きします");
console.log(`出力先: ${OUTPUT_DIR}/{x}/{y}.geojson\n`);

let ok = 0,
  skipped = 0,
  failed = 0;

for (const [i, { x, y }] of tiles.entries()) {
  const filePath = join(OUTPUT_DIR, String(x), `${y}.geojson`);
  const label = `[${String(i + 1).padStart(2)}/${tiles.length}] (${x},${y})`;

  if (!force && existsSync(filePath)) {
    console.log(`${label} スキップ（既存）`);
    skipped++;
    continue;
  }

  try {
    process.stdout.write(label);
    const geojson = await fetchTile(x, y);
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, JSON.stringify(geojson));
    console.log(`\n  → 合計 ${geojson.features.length}件 ✓`);
    ok++;
  } catch (err) {
    console.error(
      `\n  → ✗ ${err.message}${err.cause ? ` (${err.cause.message ?? err.cause})` : ""}`
    );
    failed++;
  }

  if (i < tiles.length - 1) {
    console.log();
    await sleep(TILE_INTERVAL_MS);
  }
}

console.log(`\n完了: 取得${ok} / スキップ${skipped} / 失敗${failed}`);
console.log("\nR2アップロード（wrangler）:");
console.log(`  find output/poi -name "*.geojson" | while read f; do`);
console.log(
  `    wrangler r2 object put <バケット名>/\${f#output/} --file \$f --content-type application/json`
);
console.log(`  done\n`);
