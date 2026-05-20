# アーキテクチャ

## 技術スタック

| 領域           | 採用                                | 備考                                                       |
| -------------- | ----------------------------------- | ---------------------------------------------------------- |
| 言語           | TypeScript                          | 全レイヤー                                                 |
| フロントエンド | React + Vite（SPA / PWA）           | SSR不要のローカルファースト                                |
| 地図エンジン   | MapLibre GL JS v5                   | ベクタータイル＋動的スタイル切替                           |
| ローカルDB     | IndexedDB + Dexie.js v4             | 端末内永続化（スキーマv9）                                 |
| オフライン     | Service Worker（vite-plugin-pwa）   | タイルキャッシュ／エリア保存                               |
| バックエンド   | なし（MVPは100%クライアント）       | クラウド同期は将来                                         |
| ベクタータイル | Protomaps PMTiles（自己ホスト）     | Cloudflare R2配信・`pmtiles` + `@protomaps/basemaps`で描画 |
| ホスティング   | Cloudflare Pages + R2               | egress無料                                                 |
| 設計パターン   | プラグマティック Clean Architecture | 4層・依存は内向き                                          |
| Exif解析       | exifr                               | GPS・撮影情報・カメラ設定値を抽出                          |
| 画像変換       | heic-to（libheif 1.21.2）           | HEIC/HEIF → JPEG 変換（全ブラウザ対応）                    |
| ユニットテスト | Vitest                              | domain / application 層                                    |
| E2Eテスト      | Playwright                          | 主要フロー検証                                             |

## 選定理由（要約）

- **React + Vite**: MapLibre/Dexieのエコシステムが React 中心。ローカルファーストで SSR の恩恵がなく、Next.js は PWA 化を複雑化させるだけ。詳細は [ADR-001](architecture-decisions/ADR-001-frontend-stack.md)
- **バックエンドなし**: MVP要件が「ログイン不要・ローカル完結」。YAGNI。詳細は [ADR-002](architecture-decisions/ADR-002-no-backend-mvp.md)
- **Protomaps PMTiles**: オフラインキャッシュ権利・プライバシー・タイルサーバ不要が要件と完全合致。詳細は [ADR-003](architecture-decisions/ADR-003-vector-tile-source.md)
- **Cloudflare Pages + R2**: 地図は高帯域、R2はegress無料。Protomaps公式推奨構成。詳細は [ADR-004](architecture-decisions/ADR-004-hosting.md)
- **Clean Architecture**: Exif解析・ピンライフサイクル・ゴミ箱・オフライン計算が純粋ロジック。将来の公開サーフェス分離が自然に実現。詳細は [ADR-005](architecture-decisions/ADR-005-clean-architecture.md)
- **クラウド/公開のデータ戦略**: バックアップ＝メタ＋サムネ、公開＝別ストア。コストと核心価値（プライバシー）を両立。詳細は [ADR-006](architecture-decisions/ADR-006-cloud-data-strategy.md)
- **GPSマッチング戦略**: 半径30m＋同日判定で「同じ場所・同じ体験」を自動判別。誤マージへの安全弁として写真分割機能を提供。詳細は [ADR-007](architecture-decisions/ADR-007-gps-matching-strategy.md)

## ディレクトリ構成（Clean Architecture）

```
src/
├── domain/                        # 純粋TS、依存ゼロ
│   ├── entities/
│   │   ├── pin.ts                 # Pin, PinExif, Coordinates, createPin
│   │   ├── category.ts            # Category, PRESET_CATEGORIES, DEFAULT_CATEGORY
│   │   └── photo.ts               # Photo（id, pinId, blob, mimeType, createdAt）
│   └── value-objects/
│       └── exif-data.ts           # ExifData（パーサーの出力型）
├── application/                   # Use Cases + ports（interface）
│   ├── ports/
│   │   ├── pin-repository.ts      # PinRepository インターフェース
│   │   └── photo-repository.ts    # PhotoRepository インターフェース
│   └── use-cases/
│       ├── add-pin.ts             # ピン追加（Exif含む）
│       ├── update-pin.ts          # タイトル・カテゴリー・コメント・URL・videoUrl・Exif・reaction・event・location更新
│       ├── soft-delete-pin.ts     # 論理削除（ゴミ箱へ）
│       ├── restore-pin.ts         # ゴミ箱から復元
│       ├── hard-delete-pin.ts     # 物理削除（ゴミ箱内のピンを完全削除）
│       ├── add-photo.ts           # ピンへ写真を追加
│       └── delete-photo.ts        # 写真を削除
├── infrastructure/                # port の実装（adapter）
│   ├── persistence/
│   │   ├── db.ts                  # KodawarimapDB（Dexie, v9スキーマ: pins + photos）
│   │   ├── dexie-pin-repository.ts # PinRepository 実装
│   │   └── dexie-photo-repository.ts # PhotoRepository 実装
│   ├── exif/
│   │   └── exif-parser.ts         # exifr を使ったExif解析
│   ├── image/
│   │   ├── normalize-photo.ts     # HEIC/HEIF → JPEG 変換（heic-to）
│   │   └── write-exif.ts          # JPEGへのEXIF書き戻し（piexifjs）+ ダウンロード実行（showSaveFilePicker / Web Share API / <a download>）
│   ├── map/
│   │   ├── use-map.ts             # MapLibre初期化フック（PMTilesプロトコル登録・click/dblclick / スタイル切替）。マーカー長押し検出は map-view.tsx 内 createMarker で実装
│   │   └── protomaps-style.ts     # Protomapsスタイル生成（light/dark/grayscaleテーマ・日本語ラベル・R2 PMTilesソース）
│   ├── poi/
│   │   ├── r2-poi-client.ts       # R2から poi/z8/{x}/{y}.geojson を取得（404は null で返す）
│   │   ├── overpass-client.ts     # Overpass API呼び出し・OSMタグ→categoryIdマッピング・GeoJSON変換
│   │   ├── poi-loader.ts          # ローカルキャッシュ→R2タイル→Overpassの優先順で取得（z8タイル単位でlocalStorageキャッシュ）
│   │   └── tile-utils.ts          # lngLatToTile / tileToBbox（z8タイル座標計算ユーティリティ）
│   └── cache/                     # TileCacheAdapter（未実装）
└── presentation/                  # React コンポーネント / hooks
    ├── components/
    │   ├── map-view.tsx            # メインビュー（地図 + 全UIの統合・GPS仮置きモード・マージ確認・マーカー長押し削除・reactionバッジ（白丸中央配置）・リッチツールチップ遅延サムネイル（写真2枚以上で枚数バッジ）・ピン作成時z8タイルPOI取得・昼夜自動テーマ計算・getPlaceName()で地名自動取得・selectedPin変化時に対応マーカーをz-index:1000で最前面表示）
    │   ├── photo-upload-button.tsx # 写真追加ボタン（スマホ・PCともに「写真から記録」テキスト常時表示）
    │   ├── category-selector.tsx   # カテゴリー選択ピル（地図スタイル切替・固定白背景）
    │   ├── pin-list-sheet.tsx      # ボトムシート（3段階スナップ44px/40%/80%・ピルハンドル中央上部・一覧・フィルター・ソート・表示範囲・reactionフィルター・ゴミ箱・ダークモード対応・タイトル行にreaction絵文字インライン表示・撮影日時右隣にevent表示・キーワード検索がevent対象・ピン選択で対応マーカーを最前面）
    │   ├── pin-detail-sheet.tsx    # ピン詳細・編集・写真プレビュー・写真分割・関連動画リンク（高さ75%固定・フッターボタン固定・lightboxスワイプ/矢印/キーボード/ピンチズーム・写真別EXIF・写真下に撮影日時（月/日 HH:mm）表示・補足情報accordion先頭に撮影場所フィールド・ダウンロード許可トグル・写真一括追加・撮影日時左寄せ（columnレイアウト）・イベント入力欄（コメント下）・カテゴリー→評価→補足情報の順）
    │   ├── cluster-sheet.tsx       # 同座標ピン一覧シート（クラスターマーカークリック時）
    │   ├── current-location-button.tsx # 現在地flyToボタン
    │   └── settings-sheet.tsx      # 設定画面（エクスポート・インポート・Overpass POIをR2タイル形式でZIPエクスポート（poi-tiles.zip・ピンのz8タイル単位でOverpass APIを呼び出し・進捗表示付き）・ゴミ箱保持期間・ソート順・表示範囲・昼夜自動テーマ切り替えトグル＋夜間時刻設定）
    └── hooks/                      # カスタムフック（useMediaQuery）
```

**依存の向き**: presentation → infrastructure → application → domain（内向きのみ。内は外を知らない）。

## データモデル

### Pin エンティティ

```typescript
interface Pin {
  id: string;
  coordinates: { lng: number; lat: number };
  title: string;
  categoryId?: string; // PRESET_CATEGORIES の id
  comment?: string; // 自由記述テキスト
  url?: string; // 外部リンク（別タブで開く）
  videoUrl?: string; // 関連動画リンク（YouTube等、別タブで開く）
  exif?: {
    takenAt?: Date; // 撮影日時
    takenAtEstimated?: true; // file.lastModified からの推定値フラグ
    cameraMake?: string; // カメラメーカー
    cameraModel?: string; // カメラ機種
    fNumber?: number; // F値（例: 2.8）
    exposureTime?: number; // シャッタースピード秒数（例: 0.008 = 1/125s）
    focalLength?: number; // 焦点距離 mm
    iso?: number; // ISO感度
  };
  reaction?: "want_to_revisit" | "once_was_enough" | "never_again"; // 自己評価リアクション（任意）
  event?: string; // イベント名・行事など任意入力テキスト
  location?: string; // 撮影場所（地名）。PMTilesのplacesレイヤーから自動取得・任意編集可
  createdAt: Date;
  deletedAt?: Date; // ゴミ箱: 設定日時。undefined = アクティブ
}
```

### Photo エンティティ

```typescript
interface Photo {
  id: string;
  pinId: string; // 紐づく Pin の id
  blob: Blob; // 写真データ本体
  mimeType: string;
  createdAt: Date;
  exif?: {
    takenAt?: Date;
    takenAtEstimated?: true; // file.lastModified からの推定値フラグ
    cameraMake?: string;
    cameraModel?: string;
    fNumber?: number;
    exposureTime?: number;
    focalLength?: number;
    iso?: number;
  };
  fileInfo?: {
    originalFileName?: string;
    originalFileSize?: number; // bytes
    originalLastModified?: number; // Unix timestamp ms
  };
}
```

### IndexedDB スキーマ（v9）

**pins テーブル**  
インデックス: `id, createdAt, deletedAt, categoryId`  
フィールド: Exif全フィールド（フラット保存）＋ `comment` ＋ `url` ＋ `videoUrl` ＋ `takenAtEstimated` ＋ `reaction`（任意）＋ `event`（任意・イベント名）＋ `location`（任意・撮影場所地名）

**photos テーブル**  
インデックス: `id, pinId, createdAt`  
写真 Blob + Exifフィールド（`exifTakenAt`・`exifTakenAtEstimated` 等フラット）+ ファイル情報（`originalFileName` 等）を pinId で紐づけて保存。完全削除時は紐づく photos も一括削除。`restore()` メソッドで元の ID を保持したままインポート復元が可能。

### カテゴリープリセット

表示順・GPS マージ閾値（11カテゴリー）：

| id            | name         | emoji | 地図スタイル        | GPS閾値 |
| ------------- | ------------ | ----- | ------------------- | ------- |
| general       | 汎用         | 🗺️    | Protomaps light     | 50m     |
| food          | 食事         | 🍽️    | Protomaps light     | 5m      |
| hiking        | 登山         | ⛰️    | Protomaps grayscale | 100m    |
| fishing       | 釣り         | 🎣    | Protomaps light     | 30m     |
| travel        | 旅行         | 🧳    | Protomaps light     | 50m     |
| theme_park    | テーマパーク | 🎡    | Protomaps light     | 50m     |
| shrine_temple | 神社仏閣     | ⛩️    | Protomaps light     | 30m     |
| camping       | キャンプ     | ⛺    | Protomaps grayscale | 100m    |
| onsen         | 温泉         | ♨️    | Protomaps light     | 30m     |
| beach         | 海・ビーチ   | 🏖️    | Protomaps light     | 50m     |
| nature        | 公園・自然   | 🌿    | Protomaps grayscale | 50m     |

lightカテゴリーは「昼夜自動テーマ」ON・夜間時刻帯のとき Protomaps dark に切り替わる（grayscaleカテゴリーは常時固定）。

## ピン操作フロー

```
写真選択（地図ボタン経由）
  └─ parseExif(元ファイル) → GPS座標 + 撮影情報（Exif）を抽出
       ├─ GPS あり → normalizePhoto() → HEIC なら JPEG 変換（heic-to）
       │              ├─ photoExif / fileInfo / pinExif を構築
       │              │    takenAt: Exif値 ?? file.lastModified（推定）。推定時は takenAtEstimated: true を付与
       │              ├─ カテゴリー別閾値（汎用・旅行・テーマパーク・海ビーチ・公園自然50m/食事5m/登山・キャンプ100m/釣り・神社仏閣・温泉30m）以内のピンを取得（nearbyPins）
       │              ├─ 同日のピンが存在（takenAt あり）or 最近傍ピン（takenAt なし）→ マージ確認バー表示（青）
       │              │    ├─ 「追加する」→ photoRepo.save(…) → 既存ピンに写真追加
       │              │    └─ 「新規ピンを作成」→ 仮置きモードへ（GPS座標に琥珀色ドラッグ可能マーカー）
       │              └─ 閾値外 or 別日 → 仮置きモードへ（タイトル・カテゴリーは最近傍ピンから継承。最近傍なし → getPlaceName()で地名取得してタイトルに反映）
       │                   ├─ ユーザーがマーカーをドラッグして位置調整
       │                   ├─ 「ここに決定」→ addPin()（確定座標・title=地名・location=地名を保存・マージなし）
       │                   │                   └─ photoRepo.save(…) → setPins → syncMarkers
       │                   └─ 「キャンセル」→ 仮置きマーカー破棄
       └─ GPS なし → メッセージ表示（地図ダブルクリックで手動追加）

地図シングルクリック
  └─ longPressPin が表示中なら閉じる。それ以外は flyTo（現在ズーム +1）

地図ダブルクリック
  └─ getPlaceName(map, lng, lat) → `places_subplace` / `places_locality` レイヤーから地名取得
       └─ addPin()（title = 地名 or 空文字）→ IndexedDB保存 → setPins → syncMarkers

マーカーホバー（PC）
  └─ リッチ Popup を表示（タイトル + reaction ラベル + 遅延読み込みサムネイル）
       初回 mouseenter 時に getFirstPhotoUrl() で IndexedDB から先頭写真を取得しキャッシュ
       getPhotoInfo() で写真枚数も取得し、2枚以上の場合はサムネイル右下に「n枚」バッジを表示

マーカークリック（単一ピン）
  └─ setSelectedPin(pin) → 詳細シートを表示。flyTo（padding + offset でカテゴリセレクター付近に配置）

マーカー長押し（600ms・移動量10px以内）
  └─ 削除確認バーを表示（赤背景・ピン名・「削除」「キャンセル」ボタン）
       ├─ 「削除」→ softDeletePin() → ゴミ箱に移動 → refreshLists → syncMarkers
       └─ 「キャンセル」or 地図クリック → バーを閉じる

クラスターマーカークリック（同座標に複数ピン）
  └─ setClusterPins(pins) → ClusterSheet を表示 → ピン選択 → 詳細シートを表示

詳細シートで写真追加
  └─ normalizePhoto() → HEIC なら JPEG 変換（heic-to）
       └─ parseExif → photoExif / fileInfo 構築
            └─ photoRepo.save(…, photoExif, fileInfo) → photos テーブルに Blob + Exif 保存 → サムネイル更新

詳細シートで写真を「✕」削除
  └─ pendingDeleteIds に追加（UI から即時非表示。DBは未削除）
       └─ 「保存」ボタン押下 → photoRepo.delete() 実行 → DB から削除
          「閉じる」ボタン押下 → pendingDeleteIds 破棄 → DB 変更なし（写真は残る）

詳細シートでサムネをタップ
  └─ lightbox（createPortal → document.body）でフルサイズ表示
       ├─ スマホ: PointerEvents でスワイプ（左右）して前後写真に切り替え
       ├─ PC: 画面左右の ‹ › ボタンでクリック切り替え
       ├─ PC/スマホ共通: キーボード ←→ で切り替え・Escape で閉じる
       ├─ 背景タップで閉じる（スワイプ距離10px未満を「タップ」判定）
       ├─ 2本指ピンチズーム（0.5x〜5x）: scale > 1.05 のときスワイプナビゲーション無効・写真切替時にリセット
       ├─ 写真ごとの EXIF（カメラ機種・F値・SS・焦点距離・ISO・撮影日時）と位置インジケーター（n/m）を表示
       └─ ダウンロード許可ONのときダウンロードボタン（↓）を表示 → downloadPhoto()
            ├─ HEIC変換済みJPEG: writeExifToJpeg() でDBのEXIFを書き戻し（piexifjs）
            ├─ Chrome/Edge: showSaveFilePicker で保存先ダイアログ（AbortErrorは無視）
            ├─ iOS: navigator.share（Web Share API）
            └─ その他: <a download> フォールバック

詳細シートで写真を「分割」
  └─ photoRepo.delete(photo.id) → addPin()（同座標・タイトル継承）
       └─ photoRepo.save(newPin.id, …, photo.exif) → ExifをそのままDB保存 → refreshLists → 詳細シートを閉じる

ピン削除（論理削除）
  └─ softDeletePin() → deletedAt を設定 → refreshLists → syncMarkers

ゴミ箱復元
  └─ restorePin() → deletedAt を undefined に → refreshLists → syncMarkers

ゴミ箱完全削除（個別）
  └─ photoRepo.deleteByPinId() → 紐づく写真を一括削除
     hardDeletePin() → pins レコードを物理削除 → refreshLists → syncMarkers

ゴミ箱一括完全削除
  └─ deletedPins 全件を順次: photoRepo.deleteByPinId() + hardDeletePin()
     → refreshLists → syncMarkers

起動時
  └─ purgeExpired()（30日超過分を物理削除）→ findAll() → syncMarkers（全マーカー描画）
       syncMarkers: 同座標グループ → 単一ピンは通常マーカー / 複数ピンはクラスターマーカー
```

## ビルド・デプロイ設定

### コード分割（`vite.config.ts`）

`heic-to`（WebAssembly バンドル）が 2.7 MB あり Workbox のデフォルト上限（2 MiB）を超えるため、`manualChunks` で分割している。

| チャンク名 | 含むパッケージ                 | サイズ（gzip） |
| ---------- | ------------------------------ | -------------- |
| `maplibre` | maplibre-gl                    | ~285 KB        |
| `heic`     | heic-to                        | ~671 KB        |
| `vendor`   | react, react-dom, dexie, exifr | ~63 KB         |
| `index`    | アプリコード                   | ~76 KB         |

`heic-to` はさらなる分割が困難なため `workbox.maximumFileSizeToCacheInBytes: 5 MiB` で上限緩和。

### SPA ルーティング

Cloudflare Pages の Pretty URLs 機能（`.html` 拡張子を自動除去）により `_redirects` の `/* /index.html 200` が無限ループを引き起こす（code: 10021）。ビルドスクリプトで `dist/index.html → dist/404.html` にコピーし、ファイル未検出時に `404.html` を返す Cloudflare Pages の挙動を利用する。

```json
"build": "tsc -b && vite build && cp dist/index.html dist/404.html"
```

### Cloudflare Pages 設定

| 項目                   | 値                  |
| ---------------------- | ------------------- |
| Build command          | `npm run build`     |
| Build output directory | `dist`              |
| 環境変数               | `NODE_VERSION = 20` |

## 将来構成（記録のみ・MVP対象外）

```
MVP（今）         : React + Vite PWA（ローカルファースト）
                         │ UIコンポーネント共有（monorepo）
将来（公開機能）  : 別サーフェス（Astro or Next.js / SEO・OGP）
                         │ 読み取り
公開ストア        : Cloudflare R2（Web最適化画像・公開メタ）

クラウドバックアップ: メタデータ＋サムネのみ（原本は端末に残す）
フル解像度クラウド保管 : 上位課金プラン（将来）
```
