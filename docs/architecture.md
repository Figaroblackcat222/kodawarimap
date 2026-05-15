# アーキテクチャ

## 技術スタック

| 領域           | 採用                                | 備考                             |
| -------------- | ----------------------------------- | -------------------------------- |
| 言語           | TypeScript                          | 全レイヤー                       |
| フロントエンド | React + Vite（SPA / PWA）           | SSR不要のローカルファースト      |
| 地図エンジン   | MapLibre GL JS                      | ベクタータイル＋動的スタイル切替 |
| ローカルDB     | IndexedDB + Dexie.js                | 端末内永続化                     |
| オフライン     | Service Worker（vite-plugin-pwa）   | タイルキャッシュ／エリア保存     |
| バックエンド   | なし（MVPは100%クライアント）       | クラウド同期は将来               |
| ベクタータイル | Protomaps（PMTiles 自己ホスト）     | 登山地形は将来 国土地理院を重畳  |
| ホスティング   | Cloudflare Pages + R2               | egress無料                       |
| 設計パターン   | プラグマティック Clean Architecture | 4層・依存は内向き                |

## 選定理由（要約）

- **React + Vite**: MapLibre/Dexieのエコシステムが React 中心。ローカルファーストで SSR の恩恵がなく、Next.js は PWA 化を複雑化させるだけ。詳細は [ADR-001](architecture-decisions/ADR-001-frontend-stack.md)
- **バックエンドなし**: MVP要件が「ログイン不要・ローカル完結」。YAGNI。詳細は [ADR-002](architecture-decisions/ADR-002-no-backend-mvp.md)
- **Protomaps PMTiles**: オフラインキャッシュ権利・プライバシー・タイルサーバ不要が要件と完全合致。詳細は [ADR-003](architecture-decisions/ADR-003-vector-tile-source.md)
- **Cloudflare Pages + R2**: 地図は高帯域、R2はegress無料。Protomaps公式推奨構成。詳細は [ADR-004](architecture-decisions/ADR-004-hosting.md)
- **Clean Architecture**: Exif解析・ピンライフサイクル・ゴミ箱・オフライン計算が純粋ロジック。将来の公開サーフェス分離が自然に実現。詳細は [ADR-005](architecture-decisions/ADR-005-clean-architecture.md)
- **クラウド/公開のデータ戦略**: バックアップ＝メタ＋サムネ、公開＝別ストア。コストと核心価値（プライバシー）を両立。詳細は [ADR-006](architecture-decisions/ADR-006-cloud-data-strategy.md)

## ディレクトリ構成（Clean Architecture）

```
src/
├── domain/              # 純粋TS、依存ゼロ
│   ├── entities/        # KodawariPin, Category, MapStyle
│   └── value-objects/   # GeoLocation, ExifData, DateRange
├── application/         # Use Cases + port (interface)
│   ├── use-cases/       # RecordPinFromPhoto, MovePinToTrash,
│   │                    # RestorePin, FilterPins, SaveOfflineArea,
│   │                    # SwitchMapStyle
│   └── ports/           # PinRepository, ExifParser, TileCache,
│                        # ImageOptimizer (interface)
├── infrastructure/      # port の実装（adapter）
│   ├── persistence/     # DexiePinRepository
│   ├── exif/            # ExifParserAdapter
│   ├── map/             # MapLibreStyleAdapter
│   └── cache/           # ServiceWorkerTileCacheAdapter
└── presentation/        # React: components / hooks / ボトムシートUI
```

**依存の向き**: presentation → infrastructure → application → domain（内向きのみ。内は外を知らない）。

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
