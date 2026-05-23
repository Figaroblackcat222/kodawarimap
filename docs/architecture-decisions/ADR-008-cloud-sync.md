# ADR-008: E2E暗号化クラウド同期（マルチデバイス対応）

## ステータス

採用済み（2026-05-24 実装完了）

## コンテキスト

MVP 完了後、スマホで記録したピン・写真を PC でも確認・編集できる「マルチデバイス同期」が要求された。
kodawarimap は個人開発のため以下の制約がある。

- 開発者の法的責任を最小化したい（サーバーに個人の写真・位置データを平文で持ちたくない）
- Cloudflare Pages + R2 をすでに使用しており、同じ環境を流用したい
- ローカルファースト設計は維持する（IndexedDB が Single Source of Truth）

## 決定

**Cloudflare Workers + D1 + R2 によるバックエンドを追加し、E2E暗号化（AES-256-GCM）で同期する。**

### 主要方針

| 項目             | 決定                                                                  |
| ---------------- | --------------------------------------------------------------------- |
| 認証             | メール + パスフレーズ → JWT（access 15分 / refresh 30日・rotation）   |
| 暗号化鍵         | PBKDF2(パスフレーズ, salt, 600_000, SHA-256, 256bit) → メモリのみ保持 |
| 暗号化           | AES-256-GCM、レコード/写真ごとにランダム12バイトIV                    |
| コンフリクト解決 | Hybrid Logical Clock（HLC）による LWW（Last-Write-Wins）              |
| 写真バイナリ     | R2 に `[12B IV][AES-GCM 暗号文]` 形式で保存                           |
| 同期タイミング   | 起動時 + 保存後（pushSync）+ 手動ボタン                               |
| マルチタブ競合   | Web Locks API リーダー選出 + BroadcastChannel 通知                    |

### コンフリクト解決（HLC）

```
HLC = { physical: number, logical: number, nodeId: string }

nextHlc(local): physical = max(Date.now(), local.physical)
                logical  = physical === local.physical ? local.logical + 1 : 0

mergeHlc(local, remote): 勝者は max(physical) → 同値なら max(logical) → 同値なら nodeId辞書順
```

サーバーは PUT 受信時に自身の HLC も更新してレスポンスに返す。
クライアントは次の変更時にそれを引き継ぐ（時計ズレによる逆転を防止）。

### D1 スキーマ概要

| テーブル         | 用途                                      |
| ---------------- | ----------------------------------------- |
| `users`          | 認証（email・password_hash・PBKDF2 salt） |
| `pins_sync`      | 暗号化ピンペイロード + HLC + tombstone    |
| `photos_sync`    | 写真メタ + R2キー + HLC + tombstone       |
| `refresh_tokens` | JWT リフレッシュトークン管理（rotation）  |
| `login_attempts` | ブルートフォース対策                      |

### Workers API

```
POST /api/auth/register, /login, /refresh, /logout
DELETE /api/account

GET  /api/pins/since/:hlc        差分プル（hlcPhysical:hlcLogical 以降）
PUT  /api/pins/:id               暗号化ペイロード UPSERT → serverHlc を返す

GET  /api/photos/list/:pinId     写真ID一覧（差分検出用）
PUT  /api/photos/:id             multipart: メタ + R2バイナリ
GET  /api/photos/:id             R2バイナリ取得
DELETE /api/photos/:id           tombstone + R2削除
```

## 採用しなかった代替案

### Firebase / Supabase 等 BaaS

- サーバー側が平文データを保持することになるため法的責任リスクが残る
- Cloudflare エコシステムから外れてコスト・構成が複雑化

### 暗号化なしクラウド同期

- 位置情報・写真という高感度データをサーバーに平文保存することは開発者の法的責任を高める
- ユーザーのプライバシー保護の観点からも不採用

### IndexedDB エクスポート/インポートのみ（既存機能）

- 手動作業が必要で実用性が低い
- デバイス間リアルタイム同期はできない

## 結果とトレードオフ

### メリット

- サーバー（D1/R2）に保存されるデータはすべて暗号文のみ → 開発者は復号不可
- Cloudflare 無料枠内で個人利用は完全に賄える（Workers 100K req/日・R2 10GB・D1 5GB）
- ローカルファースト設計を維持（オフライン時も全機能利用可）

### デメリット・注意点

- パスフレーズ紛失 = 新デバイスへの同期不可（既存デバイスのデータは無事）
  → 設定画面の「30日バックアップ警告」と ZIP エクスポートで緩和
- 初回同期の写真は全ピン分を一括ダウンロード（多数ピンの場合は時間がかかる）
  → 将来: 遅延ロード + プリフェッチトグルに最適化可能
- CORS_ORIGIN を Workers シークレットに正確に設定する必要がある（本番 URL と一致しないと「Load Failed」）

## 関連 ADR

- [ADR-002](ADR-002-no-backend-mvp.md): MVP ではバックエンドなしと決定した経緯
- [ADR-004](ADR-004-hosting.md): Cloudflare Pages + R2 を選定した経緯
- [ADR-006](ADR-006-cloud-data-strategy.md): クラウドデータ戦略（バックアップ vs 同期）
