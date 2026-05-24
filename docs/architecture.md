# アーキテクチャ

## 技術スタック

| 領域           | 採用                                | 備考                                                                                          |
| -------------- | ----------------------------------- | --------------------------------------------------------------------------------------------- |
| 言語           | TypeScript                          | 全レイヤー                                                                                    |
| フロントエンド | React + Vite（SPA / PWA）           | SSR不要のローカルファースト                                                                   |
| 地図エンジン   | MapLibre GL JS v5                   | ベクタータイル＋動的スタイル切替                                                              |
| ローカルDB     | IndexedDB + Dexie.js v4             | 端末内永続化（スキーマv13）                                                                   |
| オフライン     | Service Worker（vite-plugin-pwa）   | タイルキャッシュ／エリア保存                                                                  |
| バックエンド   | Cloudflare Workers + D1 + R2        | E2E暗号化マルチデバイス同期（詳細は [ADR-008](architecture-decisions/ADR-008-cloud-sync.md)） |
| ベクタータイル | Protomaps PMTiles（自己ホスト）     | Cloudflare R2配信・`pmtiles` + `@protomaps/basemaps`で描画                                    |
| ホスティング   | Cloudflare Pages + R2               | egress無料                                                                                    |
| 設計パターン   | プラグマティック Clean Architecture | 4層・依存は内向き                                                                             |
| Exif解析       | exifr                               | GPS・撮影情報・カメラ設定値を抽出                                                             |
| 画像変換       | heic-to（libheif 1.21.2）           | HEIC/HEIF → JPEG 変換（全ブラウザ対応）                                                       |
| ユニットテスト | Vitest                              | domain / application 層                                                                       |
| E2Eテスト      | Playwright                          | 主要フロー検証                                                                                |

## 選定理由（要約）

- **React + Vite**: MapLibre/Dexieのエコシステムが React 中心。ローカルファーストで SSR の恩恵がなく、Next.js は PWA 化を複雑化させるだけ。詳細は [ADR-001](architecture-decisions/ADR-001-frontend-stack.md)
- **バックエンドなし（MVP）→ Workers追加**: MVP完了後にマルチデバイス同期のため Cloudflare Workers + D1 + R2 を追加。E2E暗号化でサーバー側は復号不可。詳細は [ADR-002](architecture-decisions/ADR-002-no-backend-mvp.md) / [ADR-008](architecture-decisions/ADR-008-cloud-sync.md)
- **Protomaps PMTiles**: オフラインキャッシュ権利・プライバシー・タイルサーバ不要が要件と完全合致。詳細は [ADR-003](architecture-decisions/ADR-003-vector-tile-source.md)
- **Cloudflare Pages + R2**: 地図は高帯域、R2はegress無料。Protomaps公式推奨構成。詳細は [ADR-004](architecture-decisions/ADR-004-hosting.md)
- **Clean Architecture**: Exif解析・ピンライフサイクル・ゴミ箱・オフライン計算が純粋ロジック。将来の公開サーフェス分離が自然に実現。詳細は [ADR-005](architecture-decisions/ADR-005-clean-architecture.md)
- **クラウド/公開のデータ戦略**: バックアップ＝メタ＋サムネ、公開＝別ストア。コストと核心価値（プライバシー）を両立。詳細は [ADR-006](architecture-decisions/ADR-006-cloud-data-strategy.md)
- **GPSマッチング戦略**: 半径30m＋同日判定で「同じ場所・同じ体験」を自動判別。詳細は [ADR-007](architecture-decisions/ADR-007-gps-matching-strategy.md)

## ディレクトリ構成（Clean Architecture）

```
src/
├── domain/                        # 純粋TS、依存ゼロ
│   ├── entities/
│   │   ├── pin.ts                 # Pin（+ hlc・thumbnailPhotoId・tag・reaction・shoppingItems）, PinExif, Coordinates, createPin
│   │   ├── photo.ts               # Photo（+ hlc・syncedAt・comment）
│   │   ├── category.ts            # Category, PRESET_CATEGORIES, DEFAULT_CATEGORY
│   │   └── sync-state.ts          # SyncStatus = 'idle'|'syncing'|'error'|'offline'|'unauthenticated'
│   └── value-objects/
│       ├── exif-data.ts           # ExifData（パーサーの出力型）
│       └── hlc.ts                 # HLC型（physical/logical/nodeId）・createHlc/nextHlc/mergeHlc/compareHlc
├── application/                   # Use Cases + ports（interface）
│   ├── ports/
│   │   ├── pin-repository.ts      # PinRepository（findModifiedSince追加）
│   │   ├── photo-repository.ts    # PhotoRepository（findModifiedSince・markSynced・findUnsyncedPhotos・updateExif追加）
│   │   ├── crypto-service.ts      # CryptoService（deriveKey/encrypt/decrypt/encryptBinary/decryptBinary/generateSalt）
│   │   ├── sync-repository.ts     # SyncRepository（認証・fetchPinsSince・pushPin・fetchPhotoList・pushPhotoBinary・fetchPhotoBinary）
│   │   └── sync-queue-repository.ts # SyncQueueRepository（enqueue/peekDue/markRetry/remove/coalesce）
│   └── use-cases/
│       ├── add-pin.ts             # ピン追加（HLC初期化含む）
│       ├── update-pin.ts          # タイトル・カテゴリー・コメント・URL・videoUrl・Exif・reaction・tag・location・thumbnailPhotoId・HLC更新
│       ├── soft-delete-pin.ts     # 論理削除（ゴミ箱へ・HLC更新）
│       ├── restore-pin.ts         # ゴミ箱から復元（HLC更新）
│       ├── hard-delete-pin.ts     # 物理削除
│       ├── add-photo.ts           # ピンへ写真を追加
│       ├── delete-photo.ts        # 写真を削除
│       ├── pull-sync.ts           # サーバー→IndexedDB（HLC LWW マージ・復号・tombstone処理）
│       ├── push-sync.ts           # IndexedDB→サーバー（暗号化push・失敗時SyncQueueへenqueue・写真push含む）
│       └── pull-photo-sync.ts     # 全ピン分のR2写真を一括ダウンロード（sync時に自動実行）。extractExif? オプション callback で復号blobからEXIF再抽出・保存
├── infrastructure/                # port の実装（adapter）
│   ├── persistence/
│   │   ├── db.ts                  # KodawarimapDB（Dexie v4, v13スキーマ: v12にkey_storeテーブル追加（CryptoKey永続化）。sync_queue・pins/photosのhlcはv12新規）
│   │   ├── dexie-pin-repository.ts   # PinRepository実装（findModifiedSince追加）
│   │   ├── dexie-photo-repository.ts # PhotoRepository実装（findModifiedSince・markSynced・findUnsyncedPhotos・updateExif追加）
│   │   └── dexie-sync-queue-repository.ts # SyncQueueRepository実装（coalesceで重複排除）
│   ├── sync/
│   │   ├── web-crypto-service.ts  # CryptoService実装（PBKDF2 600K + AES-256-GCM。バイナリは先頭12bytesがIV）
│   │   ├── auth-service.ts        # JWT管理・自動リフレッシュ・並行リフレッシュは同一Promise共有。plan/role をlocalStorageに保存（kdm:user-plan/kdm:user-role）
│   │   ├── cloudflare-sync-repository.ts # Workers API実装（401時自動リフレッシュ・写真はmultipart・requestRegistration追加）
│   │   ├── tab-coordinator.ts     # Web Locks APIリーダー選出・BroadcastChannel完了通知
│   │   └── node-id.ts             # localStorage: kdm:node-id でデバイスID管理
│   ├── admin/
│   │   └── admin-api-client.ts    # 管理画面API（listUsers/updateUserPlan/listRegistrationRequests/approveRegistration/rejectRegistration）
│   ├── exif/
│   │   └── exif-parser.ts         # exifr を使ったExif解析（File | Blob 対応。sync復元時の再抽出にも使用）
│   ├── image/
│   │   ├── normalize-photo.ts     # HEIC/HEIF → JPEG 変換（heic-to）
│   │   └── write-exif.ts          # JPEGへのEXIF書き戻し（piexifjs）+ ダウンロード実行
│   ├── map/
│   │   ├── use-map.ts             # MapLibre初期化フック（PMTilesプロトコル登録・click/dblclick / スタイル切替）
│   │   └── protomaps-style.ts     # Protomapsスタイル生成（light/dark/grayscale・日本語ラベル・R2ソース）
│   ├── poi/
│   │   ├── r2-poi-client.ts       # R2から poi/z8/{x}/{y}.geojson を取得
│   │   ├── overpass-client.ts     # Overpass API・OSMタグ→categoryIdマッピング（12カテゴリー）
│   │   ├── poi-loader.ts          # ローカルキャッシュ→R2→Overpass優先順（localStorageキャッシュ）
│   │   └── tile-utils.ts          # lngLatToTile / tileToBbox
│   └── cache/                     # TileCacheAdapter（未実装）
└── presentation/                  # React コンポーネント / hooks
    ├── hooks/
    │   ├── use-sync.ts            # pull+push+pullPhotoSyncをtabCoordinator経由で実行・syncState管理・sync完了後refreshLists通知。getPlan()!=='pro'なら同期スキップ（クライアント保険）。extractExifFromBlob を pullPhotoSync に渡してサーバー復元写真のEXIFを保持
    │   └── use-key-derivation.ts  # パスフレーズ→CryptoKey導出（salt: localStorage kdm:sync-salt）
    ├── admin/
    │   ├── admin-app.tsx          # /admin ルート（ログイン→role='admin'確認→RegistrationRequestsTable＋UserListTable）
    │   ├── user-list-table.tsx    # ユーザー一覧（email/plan/role/登録日・昇格/赤降格ボタン・降格は確認ダイアログ・検索・ページング）
    │   └── registration-requests-table.tsx # 登録申請一覧（email/申請日時・承認→ユーザー作成/拒否→申請削除）
    └── components/
        ├── map-view.tsx            # メインビュー（起動時IndexedDB key_storeからCryptoKey読込→あればSyncSetupSheet非表示・ログアウト時key_store削除・useSync統合・設定ボタン top:48 right:8）
        │                           # 同期タイミング: 起動時1回・オンライン復帰時・保存/削除/復元後3秒デバウンス・30分定期ポーリング
        │                           # 現在地マーカー: locationMarkerRef 管理・青点(18px)＋2秒パルスアニメーション
        ├── sync-setup-sheet.tsx    # 同期セットアップ（auth/申請(request)/reenterの3モード。authモード: ログイン専用＋「申請する」リンク。requestモード: メール+パスフレーズ確認+salt生成→requestRegistration。reenterモード: パスフレーズのみ）
        ├── sync-status-indicator.tsx # 同期状態表示（top:92 right:8・設定ボタン下）
        │                           # idle=緑チェック（タップで即時同期）/syncing=スピナー/error=橙三角（タップ再試行）/offline=灰WifiOff
        │                           # idle/error のみクリック可・unauthenticated は非表示
        ├── photo-upload-button.tsx # 写真追加ボタン（左下・bottom: sheetHeight+8・テキスト常時表示）
        ├── category-selector.tsx   # カテゴリー選択ピル（タップで2列グリッド展開）
        ├── pin-list-sheet.tsx      # ボトムシート（11段階スナップ・フィルター・ソート・ショッピングバッジ）
        ├── pin-detail-sheet.tsx    # ピン詳細・編集・lightbox（syncRepository/encryptionKey props経由で遅延写真ロード。復元時に復号blobからEXIF再抽出して保存。初回ロード時にexif未保存の既存写真もblobから再抽出しupdateExif()でDB永続化）
        ├── cluster-sheet.tsx       # 同座標ピン一覧シート
        ├── current-location-button.tsx # 現在地flyToボタン（top:160 left:8）・取得後に flyTo＋青点マーカーを地図上に表示
        ├── settings-sheet.tsx      # 設定（地図・エクスポート・インポート・同期セクション（Proバッジ・ログアウト時onLogoutコールバックでkey_store削除）・バックアップ30日警告）
        ├── pwa-update-dialog.tsx   # PWA更新通知ダイアログ
        ├── message-ticker.tsx      # ガイドメッセージティッカー（常時サイクル・ピン選択中も同じメッセージを流し続ける）
        └── geocoder-search.tsx     # Nominatim地名検索（collapsed: top:48 right:96・expanded: top:48 left:50 right:96）
```

```
workers/                           # Cloudflare Workers バックエンド
├── src/
│   ├── index.ts                   # ルーティング + scheduled（tombstone・token期限切れ削除）
│   ├── types.ts                   # Env型（DB/PHOTOS/JWT_SECRET/CORS_ORIGIN/REGISTRATION_OPEN）
│   ├── lib/
│   │   ├── jwt.ts                 # HS256 sign/verify・JwtPayloadにplan/role claim追加
│   │   └── hlc.ts                 # サーバー側HLC計算
│   ├── middleware/
│   │   ├── cors.ts                # CORS（localhost常時許可・CORS_ORIGINで本番許可・Allow-Methods: GET/POST/PUT/PATCH/DELETE/OPTIONS）
│   │   └── auth.ts                # JWT検証（requireAuth → {userId, plan, role}・DBから毎回取得）・requirePro・requireAdmin
│   └── routes/
│       ├── auth.ts                # 認証API（register（REGISTRATION_OPEN制御）/login（plan/role返却）/refresh/logout/request-registration・ブルートフォース対策）
│       ├── pins.ts                # ピン同期API（since取得・UPSERT・tombstone）全エンドポイントrequirePro
│       ├── photos.ts              # 写真API（list・R2アップロード/取得/削除）全エンドポイントrequirePro
│       └── admin.ts               # 管理API（全エンドポイントrequireAdmin）: GET/PATCH /api/admin/users・GET /api/admin/registrations・POST approve・DELETE reject
├── migrations/
│   ├── 0001_initial.sql           # D1スキーマ（users・pins_sync・photos_sync・refresh_tokens・login_attempts）
│   ├── 0002_add_plan_and_role.sql # usersにplan(DEFAULT 'pro')・role(DEFAULT 'user')追加（既存ユーザーgrandfather）
│   └── 0003_registration_requests.sql # registration_requests（id/email/password_hash/salt/requested_at）
└── wrangler.toml                  # DB: kodawarimap-sync・R2: kodawarimap-photos・cron: 0 3 * * *・REGISTRATION_OPEN='false'
scripts/
├── build-poi-tiles-local.mjs  # ローカルOSM PBFからPOI z8タイルを一括生成
└── fetch-poi-tiles.mjs        # Overpass APIからz8タイル単位でPOI取得
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
  tag?: string; // マイタグ（旅行名・行事名等の任意ラベル。v9の event からリネーム）
  location?: string; // 撮影場所（地名）。PMTilesのplacesレイヤーから自動取得・任意編集可
  thumbnailPhotoId?: string; // 一覧サムネイルとして使う写真ID（未指定時は先頭写真）
  allowPhotoDownload?: boolean; // 写真ダウンロード許可フラグ
  shoppingItems?: ShoppingItem[]; // ショッピングカテゴリー専用・買い物リスト
  hlc: HLC; // Hybrid Logical Clock（マルチデバイス同期の順序保証）
  createdAt: Date;
  deletedAt?: Date; // ゴミ箱: 設定日時。undefined = アクティブ
}

interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
  photoId?: string; // 参照写真ID（メインギャラリーから除外）
}
```

### Photo エンティティ

```typescript
interface Photo {
  id: string;
  pinId: string; // 紐づく Pin の id
  blob: Blob; // 写真データ本体
  mimeType: string;
  comment?: string; // 写真個別コメント（任意）
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
  shoppingItemId?: string; // ShoppingItem紐づき写真（メインギャラリーから除外）
  hlc: HLC; // Hybrid Logical Clock（マルチデバイス同期の順序保証）
  syncedAt?: Date; // R2アップロード完了時刻（未設定 = 未同期）
}
```

### IndexedDB スキーマ（v13）

**pins テーブル**  
インデックス: `id, createdAt, deletedAt, categoryId, hlcPhysical`  
フィールド: Exif全フィールド（フラット保存）＋ `comment` ＋ `url` ＋ `videoUrl` ＋ `takenAtEstimated` ＋ `reaction`（任意）＋ `tag`（任意・マイタグ。v9の `event` からリネーム）＋ `location`（任意・撮影場所地名）＋ `thumbnailPhotoId`（任意・一覧サムネイル写真ID）＋ `shoppingItemsJson`（ShoppingItem配列のJSON文字列）＋ `hlcPhysical / hlcLogical / hlcNodeId / syncSchemaVersion`（v12追加・HLC同期フィールド）

**photos テーブル**  
インデックス: `id, pinId, createdAt, hlcPhysical`  
写真 Blob + Exifフィールド（`exifTakenAt`・`exifTakenAtEstimated` 等フラット）+ ファイル情報（`originalFileName` 等）+ `comment`（任意・写真個別コメント）+ `shoppingItemId`（任意・ShoppingItem紐づき）+ `hlcPhysical / hlcLogical / hlcNodeId / syncedAt / syncSchemaVersion`（v12追加）を pinId で紐づけて保存。完全削除時は紐づく photos も一括削除。`restore()` メソッドで元の ID を保持したままインポート復元が可能。

**sync_queue テーブル**（v12新規）  
インデックス: `id, recordId, nextAttemptAt`  
フィールド: `type('pin'|'photo'), recordId, operation('put'|'delete'), retries, nextAttemptAt, createdAt, lastError`  
同一 recordId は coalesce（最新操作のみ保持）。指数バックオフ（最大5回・失敗後は error 状態へ）。

**key_store テーブル**（v13新規）  
インデックス: `id`  
フィールド: `id('encryption-key'), key(CryptoKey), createdAt`  
ログイン後の AES-256-GCM CryptoKey を永続化し、リロード後のパスフレーズ再入力を不要にする。ログアウト時に削除。

### カテゴリープリセット

表示順・GPS マージ閾値（12カテゴリー）：

| id            | name         | emoji | 地図スタイル        | GPS閾値 | 備考                           |
| ------------- | ------------ | ----- | ------------------- | ------- | ------------------------------ |
| general       | 汎用         | 🗺️    | Protomaps light     | 50m     |                                |
| food          | 食事         | 🍽️    | Protomaps light     | 5m      |                                |
| hiking        | 登山         | ⛰️    | Protomaps grayscale | 100m    |                                |
| fishing       | 釣り         | 🎣    | Protomaps light     | 30m     |                                |
| travel        | 旅行／観光   | 🧳    | Protomaps light     | 50m     |                                |
| theme_park    | テーマパーク | 🎡    | Protomaps light     | 50m     |                                |
| shrine_temple | 神社仏閣     | ⛩️    | Protomaps light     | 30m     |                                |
| camping       | キャンプ     | ⛺    | Protomaps grayscale | 100m    |                                |
| onsen         | 温泉         | ♨️    | Protomaps light     | 30m     |                                |
| beach         | 海・ビーチ   | 🏖️    | Protomaps light     | 50m     |                                |
| nature        | 公園・自然   | 🌿    | Protomaps grayscale | 50m     |                                |
| shopping      | ショッピング | 🛍️    | Protomaps light     | 30m     | 買い物リスト機能付き（専用UI） |

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
            └─ photoRepo.save(…, photoExif, fileInfo) → photos テーブルに Blob + Exif 保存 → pendingAddIds に追加 → isDirty = true
                 ├─ 「保存」押下 → pendingAddIds クリア（写真はそのままDB保存）
                 └─ 「閉じる」押下（未保存）→ pendingAddIds の写真を photoRepo.delete() で削除（ロールバック）

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
       ├─ 写真ごとの EXIF（カメラ機種・F値・SS・焦点距離・ISO・撮影日時）と位置インジケーター（n/m）を表示（sync復元写真は復号blob再解析でEXIFを復元済み）
       └─ ダウンロード許可ONのときダウンロードボタン（↓）を表示 → downloadPhoto()
            ├─ HEIC変換済みJPEG: writeExifToJpeg() でDBのEXIFを書き戻し（piexifjs）
            ├─ Chrome/Edge: showSaveFilePicker で保存先ダイアログ（AbortErrorは無視）
            ├─ iOS: navigator.share（Web Share API）
            └─ その他: <a download> フォールバック

詳細シートで写真コメントを入力
  └─ 各写真テキストフィールドで即時編集（保存ボタン押下まで反映待ち）
       └─ 「保存」押下 → 変更があった写真のみ photoRepo.updateComment() → DB更新

詳細シートでサムネイルを変更（★/☆ボタン）
  └─ ★ボタン押下 → setThumbnailPhotoId(photo.id) → isDirty = true
       └─ 「保存」押下 → updatePin(pin, { thumbnailPhotoId }) → pins テーブルに保存 → 一覧サムネイル更新

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

### コード分割・PWA設定（`vite.config.ts`）

`registerType: "prompt"` — 新しい Service Worker を検知してもユーザー確認なしに自動適用せず、`PwaUpdateDialog` でダイアログを表示してから `updateServiceWorker()` で適用する。

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
