# kodawarimap

「他人の評価」ではなく「自分のこだわり」を地図に刻み資産化する、MapLibreベースのローカルファースト型趣味記録PWA。

## 技術スタック

| 領域           | 採用                                                        |
| -------------- | ----------------------------------------------------------- |
| 言語           | TypeScript                                                  |
| フロントエンド | React + Vite（SPA / PWA）                                   |
| 地図エンジン   | MapLibre GL JS                                              |
| ローカルDB     | IndexedDB + Dexie.js                                        |
| オフライン     | Service Worker（vite-plugin-pwa）                           |
| バックエンド   | Cloudflare Workers + D1 + R2（E2E暗号化マルチデバイス同期） |
| タイル供給     | Protomaps PMTiles（Cloudflare R2配信・実装済）              |
| ホスティング   | Cloudflare Pages + R2                                       |
| 設計パターン   | プラグマティック Clean Architecture（4層）                  |
| ユニットテスト | Vitest                                                      |
| E2Eテスト      | Playwright                                                  |

## ディレクトリ構成

```
src/
├── domain/
│   ├── entities/        # Pin（+ PinExif + PinReaction + hlc + thumbnailPhotoId + tag + shoppingItems）, ShoppingItem（id/name/checked/photoId）, Category,
│   │                    # Photo（+ comment + shoppingItemId + hlc + syncedAt）, sync-state.ts（SyncStatus型）
│   └── value-objects/   # ExifData, hlc.ts（HLC型・createHlc/nextHlc/mergeHlc/compareHlc）
├── application/
│   ├── ports/           # PinRepository（findModifiedSince追加）, PhotoRepository（findModifiedSince・markSynced・findUnsyncedPhotos追加）,
│   │                    # CryptoService（deriveKey/encrypt/decrypt/encryptBinary/decryptBinary/generateSalt）,
│   │                    # SyncRepository（認証・fetchPinsSince・pushPin・fetchPhotoList・pushPhotoBinary・fetchPhotoBinary・deletePhoto）,
│   │                    # SyncQueueRepository（enqueue/peekDue/markRetry/remove/coalesce）
│   └── use-cases/       # add-pin, update-pin（title/category/comment/url/videoUrl/exif/reaction/tag/location/thumbnailPhotoId/shoppingItems）,
│                        # soft-delete-pin, restore-pin, hard-delete-pin, add-photo, delete-photo,
│                        # pull-sync（サーバー→IndexedDB HLC LWW マージ）,
│                        # push-sync（IndexedDB→サーバー暗号化 + SyncQueue失敗時enqueue・写真pushも担当）,
│                        # pull-photo-sync（全ピン分のR2写真を一括ダウンロード・sync時に自動実行）
├── infrastructure/
│   ├── persistence/     # db.ts（Dexie v4, schema v13: v12にkey_storeテーブル追加（CryptoKey永続化）。hlcPhysical/hlcLogical/hlcNodeId/syncSchemaVersionをpins・photosに追加、sync_queueテーブルはv12新規）,
│   │                    # dexie-pin-repository.ts（findModifiedSince実装・shoppingItemsをJSONシリアライズ）,
│   │                    # dexie-photo-repository.ts（findModifiedSince・markSynced・findUnsyncedPhotos実装・restore・saveForShoppingItem）,
│   │                    # dexie-sync-queue-repository.ts（SyncQueueRepository実装・coalesceによる重複排除）
│   ├── sync/            # web-crypto-service.ts（PBKDF2 600K + AES-256-GCM。encryptBinary/decryptBinaryは先頭12bytesがIV）,
│   │                    # auth-service.ts（JWT管理・自動リフレッシュ・並行リフレッシュは同一Promise共有。plan/role をlocalStorage保存（kdm:user-plan/kdm:user-role）。API_BASE=https://kodawarimap-api.figaroblackcat.workers.dev）,
│   │                    # cloudflare-sync-repository.ts（Workers API fetch実装・401時自動リフレッシュ再試行・写真はmultipart/form-data・requestRegistration追加）,
│   │                    # tab-coordinator.ts（Web Locks APIでリーダー選出・BroadcastChannelで完了通知・localStorageフォールバック）,
│   │                    # node-id.ts（localStorage: kdm:node-id でデバイスID生成・取得）
│   ├── admin/           # admin-api-client.ts（管理画面API: listUsers/updateUserPlan/listRegistrationRequests/approveRegistration/rejectRegistration。認証はauthService.getValidAccessToken()流用）
│   ├── exif/            # exif-parser.ts（exifr: GPS・F値・SS・焦点距離・ISO）
│   ├── image/           # normalize-photo.ts（heic-to: HEIC/HEIF → JPEG変換）,
│   │                    # write-exif.ts（piexifjs: EXIF書き戻し + ダウンロード実行）
│   ├── map/             # use-map.ts（MapLibre初期化・PMTilesプロトコル登録・click/dblclickハンドリング。マーカー長押し削除はmap-view.tsxのcreateMarker内）,
│   │                    # protomaps-style.ts（Protomapsスタイル生成: light/dark/grayscale・日本語ラベル・R2 PMTilesソース・roads_onewayレイヤーのicon-imageを除去（MapLibre「arrow」画像警告抑止））
│   ├── poi/             # r2-poi-client.ts（R2から poi/z8/{x}/{y}.geojson を取得・404は null で返す）,
│   │                    # overpass-client.ts（Overpass API呼び出し・名前付きPOIのみ取得・OSMタグ→categoryIdマッピング（12カテゴリー）・GeoJSON変換）,
│   │                    # poi-loader.ts（ローカルキャッシュ→R2タイル→Overpassの優先順で取得・z8タイル単位でlocalStorageキャッシュ）,
│   │                    # tile-utils.ts（lngLatToTile / tileToBbox: z8タイル座標計算ユーティリティ）
│   └── cache/           # TileCache（未実装・PMTiles移行後）
└── presentation/
    ├── hooks/           # use-sync.ts（pull+push+pullPhotoSyncをtabCoordinator経由で実行・syncState管理・sync完了後にonSyncComplete通知。getPlan()!=='pro'なら同期をスキップ（クライアント保険））,
    │                    # use-key-derivation.ts（パスフレーズ→CryptoKey導出。saltはlocalStorage: kdm:sync-salt）
    ├── admin/           # admin-app.tsx（/admin ルート・ログイン→role='admin'チェック→RegistrationRequestsTable+UserListTable表示）,
    │                    # user-list-table.tsx（ユーザー一覧・email/plan/role/登録日・「Proに昇格」赤「Freeに降格」ボタン（降格は確認ダイアログ付き）・検索・ページング）,
    │                    # registration-requests-table.tsx（登録申請一覧・email/申請日時・承認（インジゴ）/拒否ボタン・承認でユーザー作成・拒否は申請削除のみ）
    └── components/      # map-view（useSync統合・encryptionKey state・起動時IndexedDB key_storeからCryptoKeyを読込（あればSyncSetupSheet非表示）・sync完了時にrefreshLists()でUI再描画・
    │                    #   設定ボタン top:48 right:8・SyncStatusIndicator top:92 right:8・softDeletePin/restorePin にgetNodeId()を渡す・
    │                    #   同期タイミング: 起動時1回・オンライン復帰時・保存/削除/復元後3秒デバウンス（debouncedSyncRef）・30分定期ポーリング（setInterval）・
    │                    #   現在地マーカー: locationMarkerRef で管理・青い点（18px 白ボーダー）+ location-pulseアニメーション（2秒周期パルス）・ボタン押下ごとに前の点を削除して更新），
    │                    # sync-setup-sheet（auth/申請（request）/reenterの3モード。authモード: ログイン専用 + 「お申し込みの方はこちら」リンク。requestモード: メール+パスフレーズ×2+salt生成してrequestRegistration送信・成功メッセージ表示。reenterモード: パスフレーズのみ）,
    │                    # sync-status-indicator（設定ボタン下 top:92 right:8・idle=緑チェック（タップで今すぐ同期）/syncing=スピナー/error=橙三角（タップ再試行）/offline=灰WifiOff・unauthenticatedは非表示・idle/errorのみクリック可）,
    │                    # photo-upload-button（左下配置・bottom: sheetHeight+8でボトムシートに追従・スマホ・PCともにテキスト常時表示・padding:8px 12px・fontSize:13）,
    │                    # category-selector（タップで2列グリッド展開・選択後に縮小・スマホ/PCともに絵文字＋名前表示・カテゴリー追加時は行が自動増加）,
    │                    # pin-list-sheet（11段階スナップ44px/25%/30%/35%/40%/45%/50%/55%/60%/65%/85%・展開縮小ボタンは44px↔65%のトグル・ピルハンドル下に全件/表示範囲トグル（onListScopeChangeコールバック経由）・件数表示はactivePins.length（フィルター適用後）・ソート・フィルターセクションボタン4色（カテゴリー=青 #3b82f6 LayoutGrid・リアクション=緑 #22c55e Smile・マイタグ=紫 #8b5cf6 Tag・撮影日=橙 #f59e0b Calendar）・SectionFilterButtonのpadding:10px 6px（タッチターゲット~44px確保）・FilterPillのpadding:8px 12px（タッチターゲット確保）・ドラッグに8pxデッドゾーン（dragRefにdraggingフラグ・8px超でsetPointerCapture）・フィルター展開時にシートが45%未満なら45%に自動拡張（sheetHeightRefで読み取り・openSection/isFilterBarOpen変化時のみ発火）・フィルターpillsはflexWrap折り返し表示・タグフィルターはマルチセレクトドロップダウン+選択済みタグ表示（外クリックで閉じる）・フィルター適用中はFilterXアイコンボタンをフィルターボタン左隣に表示・撮影日フィルター=toLocalDateStr()でローカルタイムゾーン基準・今週=日曜起点・今月=1日・今年=1月1日・プリセット選択状態を色で表示・タイトル行にreaction絵文字インライン表示・撮影日時右隣にtag表示・キーワード検索がtag対象・pin.thumbnailPhotoIdでサムネイル選択・handleFilteredPinsChangeをuseCallback([pins])でメモ化しPinListSheetに渡す（インライン関数による無限ループ防止）・onFilteredPinsChangeで地図マーカーフィルターと同期含む・ショッピングカテゴリーピン行に未チェック品目数バッジ「残りN件」（#d946ef）表示），
    │                    # pin-detail-sheet（高さ75%固定・フッターボタン固定・lightboxスワイプ/矢印/キーボード/ピンチズーム（写真コメントをlightboxに表示）・写真別EXIF・写真下に撮影日時（月/日 HH:mm）表示・補足情報accordion先頭に撮影場所（location）フィールド・ダウンロード許可トグル・写真一括追加・各写真に個別コメント入力・★/☆ボタンでサムネ選択（thumbnailPhotoId）・isDirtyによる保存ボタン活性化制御（isNew=trueは常時活性）・pendingAddIds/pendingItemPhotoIdsで閉じる時の未保存写真自動削除・マイタグ入力欄（コメント下）にドロップダウンサジェスト・フッター「閉じる」ボタン含む・ショッピングカテゴリー時のみ買い物リストセクション表示（コメント直後・マイタグ直前）：品目追加/チェック/削除・品目ごとに参照写真1枚（saveForShoppingItem経由・メインギャラリーから除外）・「チェック済みを削除」ボタン・「このリストをコピーして新規作成」ボタン（onCreateCopyコールバック経由）・syncRepository/encryptionKey/cryptoService props経由で遅延写真ロード（R2にありローカルにない写真を自動復元）），
    │                    # cluster-sheet, current-location-button（左側配置 top:160 left:8・取得後に地図を flyTo して現在地マーカー（青点）を表示），
    │                    # settings-sheet（地図情報更新（POIキャッシュclr+SW更新チェック）・ソート順・地図検索ON/OFF（Nominatim・同意ダイアログ付き）・ガイドメッセージON/OFF＋折りたたみ解除ボタン・昼夜自動テーマ切り替えトグル＋時刻設定・同期セクション（Proバッジ付きヘッダー・同期状態表示・今すぐ同期・パスフレーズ再入力・ログアウト（IndexedDB key_store削除）・onLogoutコールバック経由でmap-viewのencryptionKeyをクリア）・バックアップセクション（最終エクスポート日時・30日未バックアップ時に警告バナー）），
    │                    # pwa-update-dialog（新SW待機時にダイアログ表示・「後で」は1時間スキップ・タブ再オープン（ページロード）時はスヌーズ無視で即表示・visibilitychange+タイマーで再表示（スヌーズ尊重）・useRegisterSW使用）,
    │                    # message-ticker（地図上部ガイドメッセージ・height:40px・font-size:14px・左端に固定ラベル表示（【はじめに】【ヒント】）・静止3秒→左スクロール（1回）→onScrollEndで次メッセージのサイクル・静止中は左12px マージン付き・×で左端に折りたたみ（▶ボタン）・localStorage: ticker-enabled/ticker-collapsed・ピン選択中も含めて常時サイクル（selectedPin 時の固定メッセージなし）），
    │                    # geocoder-search（Nominatim地名検索・収縮/展開ボタン（top:48 right:52）・展開時 top:48 left:50 right:52（ズームコントロール・設定ボタン非重複）・debounce 400ms・flyTo・© OpenStreetMap contributors表示）,
    │                    # map-view（R2配置POI GeoJSONレイヤー: カテゴリー別絵文字アイコン・ピン作成時にz8タイル単位で取得・カテゴリー切替でフィルタリング・styledata再セットアップ・handleCreateCopyFromPin: ショッピングピンのリストをコピーして同座標に新ピン作成・再訪時にProvisionalPinDataへshoppingItems継承（チェックリセット）)
workers/
├── src/
│   ├── index.ts         # ルーティング + scheduled（30日tombstone削除・refresh_token期限切れ削除）
│   ├── types.ts         # Env型（DB: D1Database, PHOTOS: R2Bucket, JWT_SECRET, ENVIRONMENT, CORS_ORIGIN, REGISTRATION_OPEN）
│   ├── lib/
│   │   ├── jwt.ts       # HS256 sign/verify（crypto.subtle）・JwtPayloadにplan/role claim追加
│   │   └── hlc.ts       # サーバー側HLC計算（computeServerHlc）
│   ├── middleware/
│   │   ├── cors.ts      # CORS（localhost常時許可・CORS_ORIGINと完全一致で本番許可）
│   │   └── auth.ts      # JWT検証ミドルウェア（requireAuth → {userId, plan, role}・DBから毎回plan/roleを取得）,
│   │                    # requirePro(auth)（plan!=='pro'なら403 pro_required）,
│   │                    # requireAdmin(auth)（role!=='admin'なら403 admin_required）
│   └── routes/
│       ├── auth.ts      # POST /api/auth/register（REGISTRATION_OPEN='true'のみ受付）|login（plan/role返却）|refresh（plan/role再取得）|logout・DELETE /api/account・ブルートフォース対策（login_attempts）,
│       │                # POST /api/auth/request-registration（認証不要・email+passwordHash+salt受付・registration_requestsに保存）
│       ├── pins.ts      # GET /api/pins/since・PUT /api/pins/:id（UPSERT）・DELETE /api/pins/:id（tombstone）。全エンドポイントでrequireProを適用
│       ├── photos.ts    # GET /api/photos/list/:pinId・PUT /api/photos/:id（multipart R2アップロード）・GET /api/photos/:id（R2取得ETag対応）・DELETE /api/photos/:id。全エンドポイントでrequireProを適用
│       └── admin.ts     # 全エンドポイントrequireAdmin必須,
│                        # GET /api/admin/users?q=&limit=50&offset=0（email/plan/role/登録日）,
│                        # PATCH /api/admin/users/:id（{plan}更新）,
│                        # GET /api/admin/registrations（申請一覧）,
│                        # POST /api/admin/registrations/:id/approve（ユーザー作成plan='pro'+申請削除）,
│                        # DELETE /api/admin/registrations/:id（申請拒否・削除のみ）
├── migrations/
│   ├── 0001_initial.sql # users・pins_sync・photos_sync・refresh_tokens・login_attemptsテーブル
│   ├── 0002_add_plan_and_role.sql # usersにplan(DEFAULT 'pro')・role(DEFAULT 'user')追加（既存ユーザーgrandfather）
│   └── 0003_registration_requests.sql # registration_requestsテーブル（id/email/password_hash/salt/requested_at）
└── wrangler.toml        # name: kodawarimap-api・D1: kodawarimap-sync・R2: kodawarimap-photos・cron: 0 3 * * *
                         # REGISTRATION_OPEN='false'（vars）・デプロイ先: https://kodawarimap-api.figaroblackcat.workers.dev
                         # CORS_ORIGIN secret: https://kodawarimap.figaroblackcat.workers.dev
public/                      # PWA静的アセット（アイコン・favicon）
scripts/
├── generate-icons.mjs           # PWAアイコン生成スクリプト（Node.js）
├── build-poi-tiles-local.mjs    # ローカルOSM PBFからPOI z8タイルを一括生成（osmium-tool使用・Overpass API不使用・全12カテゴリー・日本全国を数分で処理）
│                                # 使い方: brew install osmium-tool → curl -L -o japan-latest.osm.pbf https://download.geofabrik.de/asia/japan-latest.osm.pbf → node scripts/build-poi-tiles-local.mjs
└── fetch-poi-tiles.mjs          # Overpass APIからz8タイル単位でPOI取得（カテゴリー別クエリ・overpass.private.coffee・--countフラグ・504時bbox4分割リトライ）
docs/
├── service-overview.md
├── architecture.md
├── architecture-decisions/  # ADR-001〜008
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
- クラウド同期はユーザーが明示的にアカウント登録・パスフレーズ入力した場合のみ有効になる（自動送信しない）
- サーバー（D1/R2）に保存するデータは必ずAES-256-GCMで暗号化する（サーバー側は復号不可）

## 参照ドキュメント

- `docs/service-overview.md` — サービス概要・MVP・ビジョン
- `docs/architecture.md` — 技術スタック・設計パターン・ディレクトリ構成
- `docs/architecture-decisions/` — 技術判断の根拠（ADR-001〜008）
- `docs/specs/` — 機能仕様書（Phase Bで追加予定）
