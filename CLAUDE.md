# kodawarimap

「他人の評価」ではなく「自分のこだわり」を地図に刻み資産化する、MapLibreベースのローカルファースト型趣味記録PWA。

## 技術スタック

| 領域           | 採用                                           |
| -------------- | ---------------------------------------------- |
| 言語           | TypeScript                                     |
| フロントエンド | React + Vite（SPA / PWA）                      |
| 地図エンジン   | MapLibre GL JS                                 |
| ローカルDB     | IndexedDB + Dexie.js                           |
| オフライン     | Service Worker（vite-plugin-pwa）              |
| バックエンド   | なし（MVPは100%クライアント）                  |
| タイル供給     | Protomaps PMTiles（Cloudflare R2配信・実装済） |
| ホスティング   | Cloudflare Pages + R2                          |
| 設計パターン   | プラグマティック Clean Architecture（4層）     |
| ユニットテスト | Vitest                                         |
| E2Eテスト      | Playwright                                     |

## ディレクトリ構成

```
src/
├── domain/
│   ├── entities/        # Pin（+ PinExif + PinReaction）, Category, Photo
│   └── value-objects/   # ExifData
├── application/
│   ├── ports/           # PinRepository, PhotoRepository（restore含む）インターフェース
│   └── use-cases/       # add-pin, update-pin（title/category/comment/url/videoUrl/exif/reaction/event/location）,
                         # soft-delete-pin, restore-pin, hard-delete-pin, add-photo, delete-photo
├── infrastructure/
│   ├── persistence/     # db.ts（Dexie v4, schema v9: reaction・event・location追加）,
                         # dexie-pin-repository.ts, dexie-photo-repository.ts（restore実装）
│   ├── exif/            # exif-parser.ts（exifr: GPS・F値・SS・焦点距離・ISO）
│   ├── image/           # normalize-photo.ts（heic-to: HEIC/HEIF → JPEG変換）,
                         # write-exif.ts（piexifjs: EXIF書き戻し + ダウンロード実行）
│   ├── map/             # use-map.ts（MapLibre初期化・PMTilesプロトコル登録・click/dblclickハンドリング。マーカー長押し削除はmap-view.tsxのcreateMarker内）,
                         # protomaps-style.ts（Protomapsスタイル生成: light/dark/grayscale・日本語ラベル・R2 PMTilesソース）
│   ├── poi/             # r2-poi-client.ts（R2から poi/z8/{x}/{y}.geojson を取得・404は null で返す）,
                         # overpass-client.ts（Overpass API呼び出し・名前付きPOIのみ取得・OSMタグ→categoryIdマッピング（12カテゴリー）・GeoJSON変換）,
                         # poi-loader.ts（ローカルキャッシュ→R2タイル→Overpassの優先順で取得・z8タイル単位でlocalStorageキャッシュ）,
                         # tile-utils.ts（lngLatToTile / tileToBbox: z8タイル座標計算ユーティリティ）
│   └── cache/           # TileCache（未実装・PMTiles移行後）
└── presentation/
    └── components/      # map-view（GPS仮置きモード・マージ確認・地図範囲追跡・カテゴリー絵文字バッジ（白丸中央配置 top:13.5px;left:13.5px・font-size:22px・全ピン常時表示）・リッチツールチップ（写真2枚以上で右下に枚数バッジ）・POI取得中インジケーター（地図左下スピナーpill）・起動時POIロード（loadPoiForStartup: loadedTilesRef非汚染）・ピン作成時POIロード（loadPoiForPin: loadedTilesRef+fetchedTilesRefで重複防止）・昼夜自動テーマ計算・getPlaceName()で地名自動取得・selectedPin変化時に対応マーカーをz-index:1000で最前面表示・eventKeywordsをuseMemoで集計してPinListSheet/PinDetailSheetに渡す含む）,
                         # photo-upload-button（スマホ・PCともにテキスト常時表示）,
                         # category-selector（タップで2列グリッド展開・選択後に縮小・スマホ/PCともに絵文字＋名前表示・カテゴリー追加時は行が自動増加）,
                         # pin-list-sheet（3段階スナップ44px/40%/80%・ピルハンドル中央・ソート・表示範囲・カテゴリー/reaction/イベントフィルター・フィルターpillsはflexWrap折り返し表示・イベントフィルターはマルチセレクトドロップダウン+選択済みタグ表示（外クリックで閉じる）・フィルター展開時にシート自動最大化・フィルター適用中はFilterXアイコンボタンをフィルターボタン左隣に表示・タイトル行にreaction絵文字インライン表示・撮影日時右隣にevent表示・キーワード検索がevent対象・ピン選択で地図マーカー最前面含む）,
                         # pin-detail-sheet（高さ75%固定・フッターボタン固定・lightboxスワイプ/矢印/キーボード/ピンチズーム・写真別EXIF・写真下に撮影日時（月/日 HH:mm）表示・補足情報accordion先頭に撮影場所（location）フィールド・ダウンロード許可トグル・写真一括追加・関連動画リンク・撮影日時左寄せ（columnレイアウト）・イベント入力欄（コメント下）にドロップダウンサジェスト（過去イベントをインクリメンタル絞り込み）含む）,
                         # cluster-sheet, current-location-button, settings-sheet（地図情報更新（POIキャッシュclr+SW更新チェック）・ソート順・表示範囲設定・Overpass POI をR2タイル形式でZIPエクスポート（poi-tiles.zip・進捗表示付き）・昼夜自動テーマ切り替えトグル＋時刻設定含む）,
                         # map-view（R2配置POI GeoJSONレイヤー: カテゴリー別絵文字アイコン・ピン作成時にz8タイル単位で取得・カテゴリー切替でフィルタリング・styledata再セットアップ）
public/                      # PWA静的アセット（アイコン・favicon）
scripts/
├── generate-icons.mjs           # PWAアイコン生成スクリプト（Node.js）
├── build-poi-tiles-local.mjs    # ローカルOSM PBFからPOI z8タイルを一括生成（osmium-tool使用・Overpass API不使用・全12カテゴリー・日本全国を数分で処理）
│                                # 使い方: brew install osmium-tool → curl -L -o japan-latest.osm.pbf https://download.geofabrik.de/asia/japan-latest.osm.pbf → node scripts/build-poi-tiles-local.mjs
└── fetch-poi-tiles.mjs          # Overpass APIからz8タイル単位でPOI取得（カテゴリー別クエリ・overpass.private.coffee・--countフラグ・504時bbox4分割リトライ）
docs/
├── service-overview.md
├── architecture.md
├── architecture-decisions/  # ADR-001〜007
└── specs/                   # 機能仕様書（Phase B以降）
```

依存の向き: presentation → infrastructure → application → domain（内向きのみ）。

## 重要なルール

### Clean Architecture

- `domain/` と `application/` は React / Dexie / MapLibre を import しない
- Use Caseは `ports/` のインターフェース経由でのみ外部リソースにアクセスする
- 新しい外部依存はまず `ports/` にインターフェースを定義してから実装する

### コーディング規約

- フォーマッター: Prettier（ファイル編集時に自動適用・`.prettierrc` + Hook設定済み）
- Linter: ESLint（`eslint.config.js` 設定済み）
- 命名: ファイル名はkebab-case、クラス・型はPascalCase、関数・変数はcamelCase

### テスト

- **Vitest**: domain / application のユニットテスト（ブラウザ依存なし・高速）
- **Playwright**: presentation / 主要フローのE2Eテスト
- domain / application のテストに MapLibre / Dexie / ブラウザAPIを import しない
- コミット前にユニットテストとリントを通す

### PMTilesファイル

- 日本全域PMTiles（数GB）はリポジトリにコミットしない（`.gitignore` 設定済み）
- 開発時は小さな地域抽出版を使う

## セキュリティルール

- `.env` ファイルは絶対にコミットしない（`.gitignore` 設定済み）
- APIキー・パスワードをコードにハードコードしない
- 認証情報は環境変数経由で取得する
- ユーザーの写真・位置データはIndexedDBから自動でクラウドに出さない

## 参照ドキュメント

- `docs/service-overview.md` — サービス概要・MVP・ビジョン
- `docs/architecture.md` — 技術スタック・設計パターン・ディレクトリ構成
- `docs/architecture-decisions/` — 技術判断の根拠（ADR-001〜007）
- `docs/specs/` — 機能仕様書（Phase Bで追加予定）
