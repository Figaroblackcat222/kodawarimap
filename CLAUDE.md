# kodawarimap

「他人の評価」ではなく「自分のこだわり」を地図に刻み資産化する、MapLibreベースのローカルファースト型趣味記録PWA。

## 技術スタック

| 領域           | 採用                                       |
| -------------- | ------------------------------------------ |
| 言語           | TypeScript                                 |
| フロントエンド | React + Vite（SPA / PWA）                  |
| 地図エンジン   | MapLibre GL JS                             |
| ローカルDB     | IndexedDB + Dexie.js                       |
| オフライン     | Service Worker（vite-plugin-pwa）          |
| バックエンド   | なし（MVPは100%クライアント）              |
| タイル供給     | Protomaps PMTiles 自己ホスト               |
| ホスティング   | Cloudflare Pages + R2                      |
| 設計パターン   | プラグマティック Clean Architecture（4層） |
| ユニットテスト | Vitest                                     |
| E2Eテスト      | Playwright                                 |

## ディレクトリ構成

```
src/
├── domain/          # 純粋TS・依存ゼロ（entities / value-objects）
├── application/     # Use Cases + ports（interface）
├── infrastructure/  # port の実装（Dexie / ExifParser / MapLibre / SW）
└── presentation/    # React components / hooks
docs/
├── service-overview.md
├── architecture.md
├── architecture-decisions/  # ADR-001〜006
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
- `docs/architecture-decisions/` — 技術判断の根拠（ADR-001〜006）
- `docs/specs/` — 機能仕様書（Phase Bで追加予定）
