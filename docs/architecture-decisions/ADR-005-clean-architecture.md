# ADR-005: プラグマティック Clean Architecture を採用

## 状況
保守性と「将来の公開サーフェス分離」を見据えた設計パターンが必要。

## 決定
**プラグマティック Clean Architecture（4層・依存は内向きのみ）**

## 理由
- Exif解析・ピンライフサイクル・ゴミ箱30日ルール・オフラインサイズ計算が、ブラウザ/Dexieに依存しない純粋ロジック。これを中心に置くと将来の公開サーフェス分離が自然に実現する
- 依存性逆転により、クラウド同期は `CloudPinRepository` を足すだけ、公開サイトは Domain+UseCase を再利用してRepositoryを差し替えるだけ

## 4層
```
Frameworks & Drivers : React / Vite / MapLibre / Dexie / SW / browser API
Interface Adapters   : DexiePinRepository, ExifParserAdapter,
                       MapLibreStyleAdapter, TileCacheAdapter, hooks
Use Cases            : RecordPinFromPhoto, MovePinToTrash, RestorePin,
                       FilterPins, SaveOfflineArea, SwitchMapStyle
Domain (中心)        : KodawariPin, Category, GeoLocation, ExifData, MapStyle
```
依存の向き: 外 → 内 のみ。内は外を知らない。

## プラグマティック方針（重要）
- 「依存の向き」と「port/adapter分離」は厳守
- ボイラープレート（全箇所のDTOマッパー等）は必要になるまで足さない
- ドグマではなくローカルファーストPWAに右サイズで適用する

## ディレクトリ構成
[architecture.md](../architecture.md#ディレクトリ構成clean-architecture) を参照。
