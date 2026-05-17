# ADR-004: ホスティング（Cloudflare Pages + R2）

## 状況

①静的PWA本体 ②巨大なPMTilesファイル（HTTPレンジリクエスト必須・高帯域）の配信先を決める。

## 選択肢

- Cloudflare Pages + R2
- Vercel + AWS S3/CloudFront
- Netlify + Backblaze B2

## 決定

**Cloudflare Pages + R2**

## 理由

- 地図タイルは閲覧のたびに大量転送が発生。**R2はegress（転送量）無料**で高帯域コストを潰せる
- S3/CloudFrontは転送量課金が積み上がる
- Protomaps公式がR2構成を推奨。地図PWAの定番で実装例が豊富
- R2は静的オブジェクト配信のみ → [ADR-002](ADR-002-no-backend-mvp.md)「バックエンドなし」と完全整合
- 日本全域のPMTiles抽出は数GB程度、R2ストレージ代はごくわずか

## 実装ノート（Cloudflare Pages デプロイ設定）

### Cloudflare Pages プロジェクト設定

| 項目                   | 値                  |
| ---------------------- | ------------------- |
| Framework preset       | None                |
| Build command          | `npm run build`     |
| Build output directory | `dist`              |
| 環境変数               | `NODE_VERSION = 20` |

### SPA ルーティング: `404.html` 方式

`_redirects` の `/* /index.html 200` は Cloudflare Pages の **Pretty URLs** 機能（`.html` 拡張子を自動除去）と干渉し、無限ループエラー（code: 10021）が発生する。

回避策として、ビルド後に `dist/index.html` を `dist/404.html` にコピーする。Cloudflare Pages はファイルが見つからない場合に `404.html` を返すため、React がクライアント側でルーティングを処理できる。

```json
"build": "tsc -b && vite build && cp dist/index.html dist/404.html"
```

### バンドル分割（Workbox 対応）

`heic-to`（WebAssembly バンドル）が 2.7 MB あり Workbox デフォルト上限（2 MiB）を超える。以下の対応を実施：

- `vite.config.ts` の `build.rollupOptions.output.manualChunks` で `maplibre-gl` / `heic-to` / `vendor`（react・react-dom・dexie・exifr）に分割
- `workbox.maximumFileSizeToCacheInBytes: 5 * 1024 * 1024`（5 MiB）に上限緩和

`heic-to` は内部構造上さらなる分割が困難なため、上限緩和で対処。

### PWA アイコン

`public/` 以下に配置。`scripts/generate-icons.mjs` でテーマカラー（`#1a1a2e`）の単色プレースホルダーを生成済み。本番リリース前にデザイン済みアイコンに差し替える。

## プライバシー上のトレードオフ（明記）

- ユーザーのピン・写真・位置はIndexedDBから出ない。プライバシーは「ホスト選び」ではなく「アーキテクチャ」が担保
- 唯一の残留リーク: 自己ホストPMTilesへのレンジリクエストで「おおよその閲覧エリア」がCloudflareに見える
- ただし商用タイルAPI（第三者の地図会社にAPIキー紐付きで毎タイル渡る）より良好。エリア保存／Service Workerキャッシュでネットに出るリクエスト自体も減る
- 完全な自己ホストはより厳格だが、低コスト・低運用・個人開発の制約と矛盾するため非採用
