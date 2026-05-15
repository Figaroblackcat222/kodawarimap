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

## プライバシー上のトレードオフ（明記）

- ユーザーのピン・写真・位置はIndexedDBから出ない。プライバシーは「ホスト選び」ではなく「アーキテクチャ」が担保
- 唯一の残留リーク: 自己ホストPMTilesへのレンジリクエストで「おおよその閲覧エリア」がCloudflareに見える
- ただし商用タイルAPI（第三者の地図会社にAPIキー紐付きで毎タイル渡る）より良好。エリア保存／Service Workerキャッシュでネットに出るリクエスト自体も減る
- 完全な自己ホストはより厳格だが、低コスト・低運用・個人開発の制約と矛盾するため非採用
