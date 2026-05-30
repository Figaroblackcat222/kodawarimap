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
│   ├── entities/        # Pin（+ PinExif + PinReaction + hlc + thumbnailPhotoId + tag + shoppingItems + rating + space）,
│   │                    # PinSpace = {kind:"private"} | {kind:"group"; groupId:string; authorId?:string}（家族スペース共有用）,
│   │                    # ShoppingItem（id/name/checked/photoId）, Category,
│   │                    # Photo（+ comment + shoppingItemId + hlc + syncedAt）, sync-state.ts（SyncStatus型）,
│   │                    # family-group.ts（FamilyGroup・GroupMember・RawGroupRecord型）
│   └── value-objects/   # ExifData, hlc.ts（HLC型・createHlc/nextHlc/mergeHlc/compareHlc）,
│                        # key-fingerprint.ts（formatFingerprint: SHA-256 先頭12byte を "AB:CD:…" 形式に整形・safety number 表示用）,
│                        # pin-space.ts（isShared・groupIdOf ヘルパー）
├── application/
│   ├── ports/           # PinRepository（findModifiedSince追加）, PhotoRepository（findModifiedSince・markSynced・findUnsyncedPhotos・updateExif追加）,
│   │                    # CryptoService（deriveKey/encrypt/decrypt/encryptBinary/decryptBinary/generateSalt）,
│   │                    # SyncRepository（認証・fetchPinsSince・pushPin・fetchPhotoList（encryptedMeta/metaIv含む）・pushPhotoBinary・fetchPhotoBinary・deletePhoto・
│   │                    #   login()戻り値はLoginResult union（通常トークン | {requires_passkey,passkey_session,challenge,credential_ids,salt}）・
│   │                    #   beginPasskeyRegistration/completePasskeyRegistration/verifyPasskeyAuth/listPasskeyCredentials/deletePasskeyCredential）,
│   │                    # SyncQueueRepository（enqueue/peekDue/markRetry/remove/coalesce）,
│   │                    # KeyManagementService（generateUserKeypair/exportPublicKey/importPublicKey/computeFingerprint/wrapPrivateKeyForBackup/unwrapPrivateKeyBackup・
│   │                    #   generateGroupKey/wrapGroupKeyForMember/unwrapGroupKey/encryptWithGroupKey/decryptWithGroupKey）,
│   │                    # KeySyncRepository（publishPublicKey/fetchPublicKey/fetchPrivateKeyBackup）,
│   │                    # GroupSyncRepository（createGroup/listGroups/listMembers/inviteMember/acceptInvite/fetchMyGroupKey/listPendingKeys/grantMemberKey・
│   │                    #   fetchGroupPinsSince/pushGroupPin）
│   └── use-cases/       # add-pin, update-pin（title/category/comment/url/videoUrl/exif/reaction/rating/tag/location/thumbnailPhotoId/shoppingItems）,
│                        # soft-delete-pin, restore-pin, hard-delete-pin, add-photo, delete-photo,
│                        # pull-sync（サーバー→IndexedDB HLC LWW マージ。PinPayload に rating フィールド含む）,
│                        # push-sync（IndexedDB→サーバー暗号化 + SyncQueue失敗時enqueue・写真pushも担当。PinPayload に rating フィールド含む）,
│                        # pull-photo-sync（全ピン分のR2写真を一括ダウンロード・sync時に自動実行。encryptedMeta/metaIvを復号してshoppingItemIdを復元。extractExif? callback で復号blob からEXIF再抽出して保存）,
│                        # publish-user-keypair（RSA-OAEP 鍵ペア生成→SPKI公開→秘密鍵バックアップ→key_store保存・冪等）,
│                        # recover-user-keypair（サーバーから暗号化秘密鍵取得→AES復号→key_store保存）,
│                        # create-group（グループ鍵生成→名前暗号化→自分用wrap→サーバー作成→key_store保存）,
│                        # accept-invite（トークンで招待承認・pending_key状態になる）,
│                        # grant-pending-member-keys（pending_keyメンバーの公開鍵でグループ鍵をwrap→付与・被招待者がactiveになり席付与）,
│                        # share-pin-to-group（ピン→グループ暗号化push→個人sync tombstone→localのspace更新。移動セマンティクス・失敗時ロールバック近似）,
│                        # unshare-pin（グループ tombstone push→個人sync re-push→local space クリア。share の逆）,
│                        # pull-group-sync（グループサーバー→IndexedDB HLC LWW マージ。グループ鍵で復号・space:group/authorId付与）,
│                        # push-group-sync（IndexedDB→グループサーバー。since HLC でフィルタ・グループ鍵で暗号化）
├── infrastructure/
│   ├── persistence/     # db.ts（Dexie v15: v14にgroupId/authorIdフィールド＋groupIdインデックス追加。v14: rating。v13: key_storeテーブル。v12: HLC・sync_queue）,
│   │                    # dexie-pin-repository.ts（findModifiedSince・shoppingItems JSON・rating・groupId/authorId⇔space 変換（recordToPin/save両方））,
│   │                    # dexie-photo-repository.ts（findModifiedSince・markSynced・findUnsyncedPhotos・updateExif・restore・saveForShoppingItem）,
│   │                    # dexie-sync-queue-repository.ts（SyncQueueRepository実装・coalesceによる重複排除）
│   ├── sync/            # web-crypto-service.ts（PBKDF2 600K + AES-256-GCM。encryptBinary/decryptBinaryは先頭12bytesがIV）,
│   │                    # auth-service.ts（JWT管理・自動リフレッシュ・plan/role localStorage（kdm:user-plan/kdm:user-role）・API_BASE=VITE_API_BASE優先・
│   │                    #   kdm:passkey-enabled を savePasskeyEnabled/isPasskeyEnabled で管理・ログアウト時にクリア）,
│   │                    # cloudflare-sync-repository.ts（Workers API fetch・401時自動リフレッシュ・写真multipart・パスキー5メソッド・detailフィールドをエラーに含む）,
│   │                    # cloudflare-key-sync-repository.ts（publishPublicKey/fetchPublicKey/fetchPrivateKeyBackup。fetchWithAuth共通パターン）,
│   │                    # cloudflare-group-sync-repository.ts（createGroup/listGroups/listMembers/inviteMember/acceptInvite/fetchMyGroupKey/
│   │                    #   listPendingKeys/grantMemberKey/fetchGroupPinsSince/pushGroupPin）,
│   │                    # web-key-management-service.ts（RSA-OAEP 2048 鍵ペア生成・SPKI export/import・SHA-256 fingerprint・
│   │                    #   秘密鍵バックアップ: PKCS8→AES-GCM encrypt（wrapKeyではなくencrypt流用）・
│   │                    #   generateGroupKey（AES-256-GCM extractable=true）・wrapGroupKeyForMember（RSA-OAEP wrapKey）・
│   │                    #   unwrapGroupKey（RSA-OAEP unwrapKey）・encryptWithGroupKey/decryptWithGroupKey）,
│   │                    # tab-coordinator.ts（Web Locks APIでリーダー選出・BroadcastChannelで完了通知・localStorageフォールバック）,
│   │                    # node-id.ts（localStorage: kdm:node-id でデバイスID生成・取得）
│   ├── admin/           # admin-api-client.ts（管理画面API: listUsers/updateUserPlan/listRegistrationRequests/approveRegistration/rejectRegistration。認証はauthService.getValidAccessToken()流用）
│   ├── exif/            # exif-parser.ts（exifr: GPS・F値・SS・焦点距離・ISO。File | Blob を受け付け・sync復元時の再抽出にも使用）
│   ├── image/           # normalize-photo.ts（heic-to: HEIC/HEIF → JPEG変換）,
│   │                    # write-exif.ts（piexifjs: EXIF書き戻し + ダウンロード実行）
│   ├── map/             # use-map.ts（MapLibre初期化・PMTilesプロトコル登録・click/dblclickハンドリング。マーカー長押し削除はmap-view.tsxのcreateMarker内）,
│   │                    # protomaps-style.ts（Protomapsスタイル生成: light/dark/grayscale・日本語ラベル・R2 PMTilesソース・roads_onewayレイヤーのicon-imageを除去（MapLibre「arrow」画像警告抑止））
│   ├── poi/             # r2-poi-client.ts（R2から poi/z8/{x}/{y}.geojson を取得・404は null で返す）,
│   │                    # overpass-client.ts（Overpass API呼び出し・名前付きPOIのみ取得・OSMタグ→categoryIdマッピング（12カテゴリー）・GeoJSON変換）,
│   │                    # poi-loader.ts（ローカルキャッシュ→R2タイル→Overpassの優先順で取得・z8タイル単位でlocalStorageキャッシュ）,
│   │                    # tile-utils.ts（lngLatToTile / tileToBbox: z8タイル座標計算ユーティリティ）
│   ├── geocoder/        # admin-geocoder.ts（国土数値情報N03由来の市区町村重心点GeoJSONをR2から取得・メモリキャッシュ。findAdminName(lng,lat)で最寄り市区町村名（例:「東京都渋谷区」）を返す。R2パス: municipalities.geojson（kodawarimap-tilesバケット）。fetch失敗時はcacheをnullのまま維持してリトライ可能）
│   └── cache/           # TileCache（未実装・PMTiles移行後）
└── presentation/
    ├── hooks/           # use-sync.ts（pull+push+pullPhotoSync→runGroupSync（privateKey有り時）をtabCoordinator経由で実行・syncState管理・
    │                    #   グループ同期フロー: listGroups→各グループで key_store から groupKey 取得（なければ fetchMyGroupKey→unwrap→保存）→
    │                    #   pullGroupSync→grantPendingMemberKeys→pushGroupSync。
    │                    #   HLC追跡: 個人=kdm:last-sync-hlc-{physical|logical}、グループ=kdm:group-hlc-{groupId}-{physical|logical}）,
    │                    # use-key-derivation.ts（パスフレーズ→CryptoKey導出。saltはlocalStorage: kdm:sync-salt）
    ├── admin/           # admin-app.tsx（/admin ルート・ログイン→role='admin'チェック→RegistrationRequestsTable+UserListTable表示。login結果が requires_passkey の場合はエラー表示（管理者はパスキー2FA未対応））,
    │                    # user-list-table.tsx（ユーザー一覧・email/plan/role/登録日・「Proに昇格」赤「Freeに降格」ボタン（降格は確認ダイアログ付き）・検索・ページング）,
    │                    # registration-requests-table.tsx（登録申請一覧・email/申請日時・承認（インジゴ）/拒否ボタン・承認でユーザー作成・拒否は申請削除のみ）
    └── components/      # map-view（useSync統合・encryptionKey/privateKey state・起動時IndexedDB key_storeからCryptoKeyを読込（group-private-keyも）・
    │                    #   ?invite=TOKEN URL処理（起動時にacceptInvite呼び出し）・FamilyGroupSheet統合（showFamilyGroups state）・
    │                    #   グループピンマーカーは紫色(#8b5cf6)・個人ピンはカテゴリー色・availableGroupsをPinDetailSheetに渡す・
    │                    #   onShareToGroup/onUnshare callbacks（key_storeからgroupKey取得してuse-case呼び出し）・
    │                    #   ログアウト時にgroup-private-keyもkey_storeから削除・
    │                    #   sync完了時にrefreshLists()でUI再描画・設定ボタン top:48 right:8・SyncStatusIndicator top:92 right:8・
    │                    #   同期タイミング: 起動時1回・オンライン復帰時・保存/削除/復元後3秒デバウンス・30分定期ポーリング・
    │                    #   現在地マーカー: locationMarkerRef で管理・青い点（18px 白ボーダー）+ location-pulseアニメーション），
    │                    # family-group-sheet（グループ作成・メンバー一覧+safety number・招待トークン発行・アクセス権付与待ちバナー・注意事項4件・
    │                    #   onGroupsLoaded callback で availableGroups を親に通知・loadMembers時にpending_keyメンバーへ自動鍵付与）,
    │                    # sync-setup-sheet（auth/申請（request）/reenter/passkey/force-passkey-registerの5モード。authモード: ログイン専用 + 「お申し込みの方はこちら」リンク。requestモード: メール+パスフレーズ×2+salt生成してrequestRegistration送信・成功メッセージ表示。reenterモード: パスフレーズのみ（パスキーチェックなし）。passkeyモード: ログイン後に requires_passkey が返った場合に自動遷移・指紋アイコン＋「認証する」ボタン→navigator.credentials.get()→verifyPasskeyAuth()→onSuccess。force-passkey-registerモード: ログイン成功後にlistPasskeyCredentials()が0件の場合に強制遷移（パスキー必須化）・idle/creating/naming/savingの4フェーズ→beginPasskeyRegistration→navigator.credentials.create→completePasskeyRegistration→savePasskeyEnabled(true)→onSuccess・「ログアウトする」リンクのみエスケープハッチ），
    │                    # sync-status-indicator（設定ボタン下 top:92 right:8・idle=緑チェック（タップで今すぐ同期）/syncing=スピナー/error=橙三角（タップ再試行）/offline=灰WifiOff・unauthenticatedは非表示・idle/errorのみクリック可）,
    │                    # photo-upload-button（左下配置・bottom: sheetHeight+8でボトムシートに追従・スマホ・PCともにテキスト常時表示・padding:8px 12px・fontSize:13）,
    │                    # category-selector（タップで2列グリッド展開・選択後に縮小・スマホ/PCともに絵文字＋名前表示・カテゴリー追加時は行が自動増加）,
    │                    # pin-list-sheet（11段階スナップ44px/25%/30%/35%/40%/45%/50%/55%/60%/65%/85%・展開縮小ボタンは44px↔65%のトグル（icon:22px・padding:11px・44pxタッチターゲット）・ピルハンドル下に全件/表示範囲トグル（onListScopeChangeコールバック経由）・件数はセンター表示（activePins.length・フィルター適用後）・展開縮小ボタン左隣にソートカスタムドロップダウン（撮影日/タイトル/おすすめの3択・デフォルト以外は青色ハイライト・外クリックで閉じる・onSortOrderChangeコールバック経由・localStorageに永続化・fontSize:14・padding:"5px 12px"・borderRadius:14）・全件/表示範囲トグルも同サイズ（fontSize:14・padding:"5px 12px"）・ヘッダーdivのpadding:"6px 16px 10px"・フィルターセクションボタン5色（カテゴリー=青 #3b82f6 LayoutGrid・★評価=橙 #f59e0b Star・リアクション=緑 #22c55e Smile・マイタグ=紫 #8b5cf6 Tag・撮影日=橙 #f59e0b Calendar）・ボタン順序: カテゴリー→★評価→リアクション→マイタグ→撮影日・★評価フィルター値は内部値（6=★3以上/8=★4以上/10=★5のみ）・ピン行の★表示は「★2.5」「★4」形式・SectionFilterButtonのpadding:10px 6px（タッチターゲット~44px確保）・FilterPillのpadding:8px 12px（タッチターゲット確保）・ドラッグに8pxデッドゾーン（dragRefにdraggingフラグ・8px超でsetPointerCapture）・フィルター展開時にシートが45%未満なら45%に自動拡張（sheetHeightRefで読み取り・openSection/isFilterBarOpen変化時のみ発火）・フィルターpillsはflexWrap折り返し表示・タグフィルターはマルチセレクトドロップダウン+選択済みタグ表示（外クリックで閉じる）・フィルター適用中はFilterXアイコンボタンをフィルターボタン左隣に表示・撮影日フィルター=toLocalDateStr()でローカルタイムゾーン基準・今週=日曜起点・今月=1日・今年=1月1日・プリセット選択状態を色で表示・タイトル行にreaction絵文字インライン表示・撮影日時右隣にtag表示・キーワード検索がtag対象・pin.thumbnailPhotoIdでサムネイル選択・サムネイルタップで地図flyTo（詳細は開かない・ゴミ箱表示中は無効）・handleFilteredPinsChangeをuseCallback([pins])でメモ化しPinListSheetに渡す（インライン関数による無限ループ防止）・onFilteredPinsChangeで地図マーカーフィルターと同期含む・ショッピングカテゴリーピン行に未チェック品目数バッジ「残りN件」（#d946ef）表示），
    │                    # pin-detail-sheet（右スライドパネル（LINE風）：ピン選択時に右からスライドイン（0.3s ease・requestAnimationFrameによるmount state制御）・デスクトップ（≥768px）=幅400px固定・地図がcalc(100%-400px)に縮む（transition付き）・モバイル=全幅・半透明オーバーレイ+背景タップで閉じる・閉じるボタンはデスクトップ=×・モバイル=←（ChevronLeft）・ESCキーで閉じる（lightbox非表示時のみ）・sheetHeight prop削除・フッターボタン固定・lightboxスワイプ/矢印/キーボード/ピンチズーム（写真コメントをlightboxに表示）・写真別EXIF・写真下に撮影日時（月/日 HH:mm）表示・撮影日時行右端に「共有」ボタン（Share2＋ラベル）：タイトル/撮影場所/コメント+Google Maps URLをWeb Share API / クリップボードで共有（タイトルはbodyPartsに含む）・補足情報accordion先頭に撮影場所（location）フィールドと座標（共有ボタン削除済み）・ダウンロード許可トグル・写真一括追加・各写真に個別コメント入力・★/☆ボタンでサムネ選択（thumbnailPhotoId）・★おすすめ度: スライドジェスチャー10段階（内部値1〜10・0.5〜5.0★表示・半星はoverflow:hidden+display:blockクリップ・左端クリアで未設定・starsOnlyRefで星幅基準計算・starContainerRefはポインターキャプチャ用）・isDirtyによる保存ボタン活性化制御（isNew=trueは常時活性）・pendingAddIds/pendingItemPhotoIdsで閉じる時の未保存写真自動削除・マイタグ入力欄（コメント下）にドロップダウンサジェスト・フッター「閉じる」ボタン含む・ショッピングカテゴリー時のみ買い物リストセクション表示（コメント直後・マイタグ直前）：品目追加/チェック/削除・品目ごとに参照写真1枚（saveForShoppingItem経由・メインギャラリーから除外）・品目写真サムネイルタップでlightboxItemPhotoId経由の拡大表示モーダル・「チェック済みを削除」ボタン・「このリストをコピーして新規作成」ボタン（onCreateCopyコールバック経由）・syncRepository/encryptionKey/cryptoService props経由で遅延写真ロード（R2にありローカルにない写真を自動復元・遅延ロード時にencryptedMeta/metaIvを復号してshoppingItemIdを復元・復元時に復号blobからEXIF再抽出して保存）・handleSave時にpendingDeleteIdsをsyncRepository.deletePhoto()でサーバーからも削除・初回ロード時にexif未保存の既存写真もblobから再抽出してupdateExif()でDB永続化（2回目以降は即時表示）・家族共有セクション: グループピン=「家族スペースで共有中」バナー+authorId表示+「個人地図に戻す」ボタン、個人ピン=グループ選択ドロップダウン（確認ダイアログ付き）・groups/onShareToGroup/onUnshare props），
    │                    # cluster-sheet, current-location-button（左側配置 top:160 left:8・取得後に地図を flyTo して現在地マーカー（青点）を表示），
    │                    # settings-sheet（地図情報更新（POIキャッシュclr + reg.update()でサーバーに新SW確認 → 新バージョンあり=pwa-update-dialogに任せる・新バージョンなし=設定画面に留まり「完了 ✓」3秒表示。mapUpdateStatus: "idle"|"checking"|"done"）・地図検索ON/OFF（Nominatim・同意ダイアログ付き）・ガイドメッセージON/OFF＋折りたたみ解除ボタン・昼夜自動テーマ切り替えトグル＋時刻設定・同期セクション（Proバッジ付きヘッダー・同期状態表示・今すぐ同期・パスフレーズ再入力・パスキー管理UI・「家族共有」行（onOpenFamilyGroups prop・紫ボタン）・ログアウト（IndexedDB key_store の encryption-key+group-private-key 削除）・onLogoutコールバック経由でmap-viewのencryptionKey/privateKeyをクリア）・バックアップセクション（最終エクスポート日時・30日未バックアップ時に警告バナー）），
    │                    # pwa-update-dialog（新SW待機時にダイアログ表示・「後で」は1時間スキップ・タブ再オープン（ページロード）時はスヌーズ無視で即表示・visibilitychange+タイマーで再表示（スヌーズ尊重）・useRegisterSW使用）,
    │                    # message-ticker（地図上部ガイドメッセージ・height:40px・font-size:14px・左端に固定ラベル表示（【はじめに】【ヒント】）・静止3秒→左スクロール（1回）→onScrollEndで次メッセージのサイクル・静止中は左12px マージン付き・×で左端に折りたたみ（▶ボタン）・localStorage: ticker-enabled/ticker-collapsed・ピン選択中も含めて常時サイクル（selectedPin 時の固定メッセージなし）），
    │                    # geocoder-search（Nominatim地名検索・収縮/展開ボタン（top:48 right:52）・展開時 top:48 left:50 right:52（ズームコントロール・設定ボタン非重複）・debounce 400ms・flyTo・© OpenStreetMap contributors表示）,
    │                    # map-view（R2配置POI GeoJSONレイヤー: カテゴリー別絵文字アイコン・ピン作成時にz8タイル単位で取得・カテゴリー切替でフィルタリング・styledata再セットアップ・handleCreateCopyFromPin: ショッピングピンのリストをコピーして同座標に新ピン作成・再訪時にProvisionalPinDataへshoppingItems継承（チェックリセット）・リロードボタン削除済み（設定画面の「地図情報更新」で代替）・handleDetailSaveにrating含む全フィールドをupdatePinへ渡す（rating欠落バグ修正済み）・ratingはpush/pull-syncのPinPayloadにも含めて同期（sync時にratingが消えるバグ修正済み：push後のpullでHLC同値→上書きによりratingが失われていた）・ピン作成時（ダブルクリック・仮置き確定の両経路）にfindAdminNameで県市名を取得しPMTiles地区名と結合して location フィールドに設定（例:「東京都渋谷区恵比寿」・PMTiles地区名がadminNameに既に含まれる場合は重複しない（例:「東京都三鷹市」））・タイトルもlocationと同じ値を自動設定・getPhotoInfoがthumbnailPhotoIdを優先しshoppingItemId写真を除外してポップアップサムネイルを構築・createMarkerでmarker.remove()をオーバーライドしpopup.remove()を確実に実行（即削除時の吹き出し残留バグ修正済み）・SettingsSheetに syncRepository={encryptionKey ? cloudflareSyncRepository : undefined} を渡しパスキー管理UIを有効化）
workers/
├── src/
│   ├── index.ts         # ルーティング + scheduled（30日tombstone削除・refresh_token期限切れ削除）・/api/keys・/api/groups ディスパッチ追加
│   ├── types.ts         # Env型（DB: D1Database, PHOTOS: R2Bucket, JWT_SECRET, ENVIRONMENT, CORS_ORIGIN, REGISTRATION_OPEN）
│   ├── lib/
│   │   ├── jwt.ts       # HS256 sign/verify（crypto.subtle）・JwtPayloadにplan/role claim追加
│   │   └── hlc.ts       # サーバー側HLC計算（computeServerHlc）
│   ├── middleware/
│   │   ├── cors.ts      # CORS（localhost常時許可・CORS_ORIGINと完全一致で本番許可・Access-Control-Allow-Methods: GET/POST/PUT/PATCH/DELETE/OPTIONS）
│   │   ├── auth.ts      # JWT検証ミドルウェア（requireAuth → {userId, plan, effectivePlan, role}・DBから毎回plan/role取得・
│   │   │                # family_seats EXISTS チェックで effectivePlan を算出（pro/family/seat付与のいずれかなら "pro"）・
│   │   │                # requirePro(auth)（effectivePlan!=='pro'なら403）・requireAdmin・requireFamilyOwner（plan!=='family'なら403））
│   │   └── group-auth.ts # requireGroupMember（requireAuth→requirePro→group_memberships status='active' 確認→403/通過）
│   └── routes/
│       ├── auth.ts      # POST /api/auth/register（REGISTRATION_OPEN='true'のみ受付）|login（plan/role返却。パスキー登録済みユーザーは {requires_passkey,passkey_session,challenge,credential_ids,salt} を返す）|refresh|logout・DELETE /api/account・ブルートフォース対策（login_attempts）,
│       │                # POST /api/auth/request-registration（認証不要・email+passwordHash+salt受付・registration_requestsに保存）
│       ├── keys.ts      # PUT /api/keys/public（requirePro: SPKI公開鍵・fingerprint・暗号化秘密鍵バックアップをUPSERT）,
│       │                # GET /api/keys/private-backup（requireAuth: 自分の暗号化秘密鍵取得）,
│       │                # GET /api/keys/public/:userId（requirePro: 対象ユーザーの公開鍵取得）
│       ├── groups.ts    # POST /api/groups（requireFamilyOwner: グループ作成・encrypted_name+nameIv+wrappedGroupKey）,
│       │                # GET /api/groups（requirePro: 参加グループ一覧）,
│       │                # GET /api/groups/:id/members（requireGroupMember）,
│       │                # POST /api/groups/:id/invites（requireGroupMember: 招待トークン発行）,
│       │                # POST /api/groups/invites/:token/accept（requirePro: 招待承認→pending_key）,
│       │                # GET /api/groups/:id/pending-keys（requireGroupMember: pending_keyメンバーと公開鍵一覧）,
│       │                # POST /api/groups/:id/member-keys（requireGroupMember: グループ鍵付与→family_seats UPSERT→status=active）,
│       │                # GET /api/groups/:id/my-key（requirePro: 自分のwrappedGroupKey取得）
│       ├── group-pins.ts # GET /api/groups/:id/pins/since（requireGroupMember: HLC LWW pull）,
│       │                 # PUT /api/groups/:id/pins/:pinId（requireGroupMember: UPSERT・computeServerHlc流用）,
│       │                 # DELETE /api/groups/:id/pins/:pinId（requireGroupMember: tombstone・author or owner only）
│       ├── pins.ts      # GET /api/pins/since・PUT /api/pins/:id（UPSERT）・DELETE /api/pins/:id（tombstone）。全エンドポイントでrequireProを適用
│       ├── photos.ts    # GET /api/photos/list/:pinId（encryptedMeta/metaIv含む）・PUT /api/photos/:id（multipart R2アップロード）・GET /api/photos/:id（R2取得ETag対応）・DELETE /api/photos/:id。全エンドポイントでrequireProを適用
│       ├── webauthn.ts  # パスキー2FA（requirePro必須）。@simplewebauthn/server v13 使用。
│       │                # POST /api/webauthn/register/begin（challenge生成・D1保存。旧challengeは削除してから挿入。generateRegistrationOptionsに authenticatorAttachment:"platform" 指定でFace ID/Touch IDのみ選択肢に出す）,
│       │                # POST /api/webauthn/register/complete（verifyRegistrationResponse・requireUserVerification:false・公開鍵+counterをD1保存）,
│       │                # POST /api/webauthn/auth/verify（passkey_session JWT検証→challenge照合→verifyAuthenticationResponse→通常トークン発行）,
│       │                # GET /api/webauthn/credentials（登録済みデバイス一覧）,
│       │                # DELETE /api/webauthn/credentials/:id（デバイス削除）,
│       │                # issuePasskeySession()（handleLoginから呼び出し・challengeをD1保存・passkey_session JWT発行（TTL:5分・passkey_pending:true））
│       └── admin.ts     # 全エンドポイントrequireAdmin必須,
│                        # GET /api/admin/users?q=&limit=50&offset=0（email/plan/role/登録日）,
│                        # PATCH /api/admin/users/:id（{plan}更新・family/pro/free対応）,
│                        # GET /api/admin/registrations（申請一覧）,
│                        # POST /api/admin/registrations/:id/approve（ユーザー作成plan='pro'+申請削除）,
│                        # DELETE /api/admin/registrations/:id（申請拒否・削除のみ）
├── migrations/
│   ├── 0001_initial.sql # users・pins_sync・photos_sync・refresh_tokens・login_attemptsテーブル
│   ├── 0002_add_plan_and_role.sql # usersにplan(DEFAULT 'pro')・role(DEFAULT 'user')追加（既存ユーザーgrandfather）
│   ├── 0003_registration_requests.sql # registration_requestsテーブル（id/email/password_hash/salt/requested_at）
│   ├── 0004_webauthn.sql # webauthn_credentialsテーブル（id/user_id/public_key/counter/device_name/created_at）,
│   │                     # webauthn_challengesテーブル（challenge PK/user_id/expires_at）
│   ├── 0005_family_groups.sql # user_public_keysテーブル（user_id PK・public_key SPKI・fingerprint・wrapped_private_key+iv）
│   └── 0006_family_groups_phase1.sql # family_seatsテーブル（owner_user_id・member_user_id PK・granted_at）,
│                                     # family_groupsテーブル（id・encrypted_name+nameIv・owner_id・key_version・max_seats）,
│                                     # group_membershipsテーブル（group_id+user_id PK・role・status: pending_key|active）,
│                                     # group_member_keysテーブル（group_id+user_id+key_version PK・wrapped_group_key）,
│                                     # group_invitesテーブル（token PK・group_id・invitee_email・status・expires_at）,
│                                     # group_pins_syncテーブル（(id, group_id) PK・author_id・key_version・encrypted_payload+iv・HLC・is_deleted）
└── wrangler.toml        # name: kodawarimap-api・D1: kodawarimap-sync・R2: kodawarimap-photos・cron: 0 3 * * *
                         # REGISTRATION_OPEN='false'（vars）・デプロイ先: https://kodawarimap-api.figaroblackcat.workers.dev
                         # CORS_ORIGIN secret: https://kodawarimap.figaroblackcat.workers.dev
                         # ローカル開発: workers/.dev.vars（JWT_SECRET/CORS_ORIGIN/REGISTRATION_OPEN を設定・gitignore済み）
                         # クライアント側ローカル開発: .env.local（VITE_API_BASE=http://localhost:8787・gitignore済み）
public/                      # PWA静的アセット（アイコン・favicon）
scripts/
├── generate-icons.mjs           # PWAアイコン生成スクリプト（Node.js）
├── build-admin-centroids.mjs    # 国土数値情報N03 GeoJSONから市区町村重心点GeoJSONを生成（約1,900件・数十KB）
│                                # 使い方: N03_*.geojson をダウンロード → node scripts/build-admin-centroids.mjs N03_*.geojson → wrangler r2 object put kodawarimap-tiles/municipalities.geojson --file admin-centroids.geojson --remote
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
- グループデータ（ピン本文・グループ名）はグループ鍵で暗号化。グループ鍵はメンバーの公開鍵（RSA-OAEP）でwrap。平文で保存してよいのはHLC・is_deleted・各種ID・author_id・key_version・sizeなどの非機密メタのみ
- 個人RSA秘密鍵はPKCS8をパスフレーズ由来AES鍵でencrypt（wrapKey APIは不使用）してサーバーにバックアップ

## 参照ドキュメント

- `docs/service-overview.md` — サービス概要・MVP・ビジョン
- `docs/architecture.md` — 技術スタック・設計パターン・ディレクトリ構成
- `docs/architecture-decisions/` — 技術判断の根拠（ADR-001〜010）
- `docs/specs/` — 機能仕様書（Phase Bで追加予定）
