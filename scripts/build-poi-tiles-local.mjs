#!/usr/bin/env node
/**
 * ローカルの Japan OSM PBF から POI z8 タイルを生成する。
 * Overpass API 不使用・レート制限なし・全国を数分で処理。
 *
 * 前提条件:
 *   brew install osmium-tool
 *   curl -L -o japan-latest.osm.pbf https://download.geofabrik.de/asia/japan-latest.osm.pbf
 *
 * 使い方:
 *   node scripts/build-poi-tiles-local.mjs
 *   node scripts/build-poi-tiles-local.mjs --pbf /path/to/japan-latest.osm.pbf
 *
 * 出力先: output/poi/z8/{x}/{y}.geojson
 *
 * R2 アップロード例（wrangler）:
 *   find output/poi -name "*.geojson" | while read f; do
 *     key=${f#output/}
 *     wrangler r2 object put <バケット名>/$key --file $f --content-type application/json
 *   done
 */

import { writeFileSync, mkdirSync, createReadStream, existsSync } from "fs";
import { join } from "path";
import { createInterface } from "readline";
import { spawnSync } from "child_process";
import { tmpdir } from "os";

const ZOOM = 8;
const OUTPUT_DIR = "./output/poi/z8";

const pbfArg = process.argv.findIndex((a) => a === "--pbf");
const PBF_PATH = pbfArg >= 0 ? process.argv[pbfArg + 1] : "./japan-latest.osm.pbf";

const TMP_FILTERED = join(tmpdir(), "kodawarimap-poi-filtered.osm.pbf");
const TMP_GEOJSONSEQ = join(tmpdir(), "kodawarimap-poi.geojsonseq");

// ---- タイルユーティリティ ----

function lngLatToTile(lng, lat, zoom) {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
  return { x, y };
}

// ---- カテゴリー解決 ----

function resolveCategoryId(props) {
  if (props.natural === "peak" || props.tourism === "alpine_hut") return "hiking";
  if (props.tourism === "viewpoint") return "hiking";
  if (props.amenity === "place_of_worship") {
    if (props.religion === "shinto" || props.religion === "buddhist") return "shrine_temple";
    return null;
  }
  if (props.tourism === "theme_park" || props.leisure === "water_park") return "theme_park";
  if (props.tourism === "camp_site") return "camping";
  if (props.amenity === "bath_house" || props.natural === "hot_spring") return "onsen";
  if (props.natural === "beach" || props.leisure === "beach_resort") return "beach";
  if (props.leisure === "park" || props.leisure === "nature_reserve") return "nature";
  if (props.shop === "department_store" || props.shop === "mall") return "shopping";
  if (props.amenity === "restaurant" || props.amenity === "cafe" || props.amenity === "fast_food")
    return "food";
  if (props.tourism === "museum" || props.tourism === "hotel" || props.tourism === "guest_house")
    return "travel";
  if (props.leisure === "fishing") return "fishing";
  if (props.tourism === "attraction") return "travel";
  if (props.historic === "shrine" || props.historic === "temple") return "shrine_temple";
  if ("historic" in props) return "travel";
  return null;
}

// ---- osmium 実行 ----

function runOsmium(args, label) {
  process.stdout.write(`${label}...`);
  const start = Date.now();
  const result = spawnSync("osmium", args, { stdio: ["ignore", "ignore", "pipe"] });
  if (result.status !== 0) {
    console.error("\nエラー:", result.stderr?.toString());
    process.exit(1);
  }
  console.log(` ${((Date.now() - start) / 1000).toFixed(1)}秒`);
}

// ---- メイン ----

if (!existsSync(PBF_PATH)) {
  console.error(`\nエラー: PBFファイルが見つかりません: ${PBF_PATH}`);
  console.error("以下のコマンドでダウンロードしてください:");
  console.error(
    "  curl -L -o japan-latest.osm.pbf https://download.geofabrik.de/asia/japan-latest.osm.pbf\n"
  );
  process.exit(1);
}

console.log(`\nPBF: ${PBF_PATH}`);
console.log(`出力先: ${OUTPUT_DIR}/{x}/{y}.geojson\n`);

// Step 1: POIノードを抽出
runOsmium(
  [
    "tags-filter",
    PBF_PATH,
    "n/tourism=attraction,viewpoint,museum,theme_park,alpine_hut,camp_site,hotel,guest_house",
    "n/historic",
    "n/natural=peak,hot_spring,beach",
    "n/leisure=fishing,water_park,beach_resort,nature_reserve,park",
    "n/amenity=place_of_worship,bath_house,restaurant,cafe,fast_food",
    "n/shop=department_store,mall",
    "-o",
    TMP_FILTERED,
    "--overwrite",
  ],
  "[1/3] POIノードを抽出"
);

// Step 2: GeoJSONSeq に変換
runOsmium(
  [
    "export",
    TMP_FILTERED,
    "--geometry-types=point",
    "-f",
    "geojsonseq",
    "-o",
    TMP_GEOJSONSEQ,
    "--overwrite",
  ],
  "[2/3] GeoJSONSeqに変換"
);

// Step 3: z8 タイルに仕分け
const { statSync } = await import("fs");
const geojsonSize = statSync(TMP_GEOJSONSEQ).size;
console.log(`  GeoJSONSeqサイズ: ${(geojsonSize / 1024 / 1024).toFixed(1)} MB`);
if (geojsonSize === 0) {
  console.error("エラー: GeoJSONSeqファイルが空です。osmiumの出力を確認してください。");
  process.exit(1);
}

process.stdout.write("[3/3] z8タイルに仕分け中...");
const start = Date.now();

const tiles = new Map();
let total = 0;
let skipped = 0;
let parseErrors = 0;

const rl = createInterface({ input: createReadStream(TMP_GEOJSONSEQ), crlfDelay: Infinity });

for await (const line of rl) {
  // GeoJSONSeq の行頭レコードセパレーター（0x1E）を除去
  const cleanLine = line.replace(/^\x1e/, "").trim();
  if (!cleanLine) continue;

  let feature;
  try {
    feature = JSON.parse(cleanLine);
  } catch {
    parseErrors++;
    continue;
  }

  const props = feature.properties ?? {};
  const name = props["name"] || props["name:ja"];
  if (!name) {
    skipped++;
    continue;
  }

  const categoryId = resolveCategoryId(props);
  if (!categoryId) {
    skipped++;
    continue;
  }

  const [lng, lat] = feature.geometry.coordinates;
  const { x, y } = lngLatToTile(lng, lat, ZOOM);
  const key = `${x}/${y}`;

  if (!tiles.has(key)) tiles.set(key, []);
  tiles.get(key).push({
    type: "Feature",
    geometry: { type: "Point", coordinates: [lng, lat] },
    properties: { name, categoryId },
  });
  total++;
}

for (const [key, features] of tiles) {
  const [x, y] = key.split("/");
  const dir = join(OUTPUT_DIR, x);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${y}.geojson`), JSON.stringify({ type: "FeatureCollection", features }));
}

console.log(` ${((Date.now() - start) / 1000).toFixed(1)}秒`);

console.log(`\n完了!`);
console.log(`  タイル数: ${tiles.size}`);
console.log(`  POI件数: ${total.toLocaleString()}`);
console.log(`  スキップ: ${skipped.toLocaleString()}（名前なし・対象外）`);
if (parseErrors > 0) console.log(`  パースエラー: ${parseErrors}行（GeoJSONSeq形式の問題）`);
console.log(`\nR2アップロード（wrangler）:`);
console.log(`  find output/poi -name "*.geojson" | while read f; do`);
console.log(
  `    wrangler r2 object put <バケット名>/\${f#output/} --file \$f --content-type application/json`
);
console.log(`  done\n`);
