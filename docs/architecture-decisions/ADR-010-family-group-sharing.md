# ADR-010: 家族・信頼グループ共有（E2E暗号化・グループ鍵方式）

## ステータス

採用済み（Phase 1 + Phase 2 実装完了・2026-05-30）

## コンテキスト

kodawarimap は「他人の評価ではなく自分のこだわりを資産化する」個人完結型サービスとして設計された。
Proプランのクラウド同期もパスフレーズ由来の個人鍵（PBKDF2 → AES-256-GCM）でE2E暗号化されており、
サーバーは一切復号できない。

ユーザーからのフィードバックとして「家族とこだわりを共有したい」という要望が生じたが、
これは1人1鍵モデルと正面衝突する（アリスの暗号文はボブには復号できない）。

確定した設計方針：

- **対象は家族・信頼グループのみ**（クローズド・招待制）。不特定多数への公開コミュニティではない
- **共有データもE2E暗号化を維持**（サーバー復号不可）
- **閲覧＋共同編集の両方**をサポート
- **ピン単位の移動セマンティクス**：個人地図と家族スペースで重複表示しない

## 決定

### 課金モデル：席バンドル型 Family Plan

| プラン   | 内容                                   |
| -------- | -------------------------------------- |
| `free`   | ローカルのみ                           |
| `pro`    | 個人・マルチデバイス同期               |
| `family` | オーナー＋最大N席のPro相当権利バンドル |

- `family` プランのオーナーだけがグループスペースを作成できる（`requireFamilyOwner`）
- 被招待者には `family_seats` に席が付与され、実効プランが pro 相当になる（個人同期も解放）
- `requirePro` は `effectivePlan` で判定（`users.plan` + EXISTS(`family_seats`) の上位）

### 暗号設計

**ユーザー鍵ペア（RSA-OAEP 2048）**

```
generateKey("RSA-OAEP 2048", extractable=true, ["wrapKey","unwrapKey"])
```

- 公開鍵: SPKI base64 で `user_public_keys` テーブルに公開
- 秘密鍵のポータビリティ:
  - ローカル: IndexedDB `key_store`（id `group-private-key`）
  - サーバーバックアップ: PKCS8 を AES-GCM で encrypt（**wrapKey API は使わない**）してサーバー保存
    → 既存の `deriveKey`（extractable=false, usages:["encrypt","decrypt"]）をそのまま流用できる

**グループ鍵（AES-256-GCM、extractable=true）**

```
generateKey("AES-GCM 256", extractable=true, ["encrypt","decrypt"])
```

- グループ作成者が乱数生成
- 各メンバーの公開鍵で `wrapKey("raw", groupKey, memberPublicKey, "RSA-OAEP")` → `group_member_keys` に保存
- サーバーは unwrap 不可（E2E維持）
- IndexedDB `key_store` に `group-key:{groupId}` で永続化
- グループ名も同じグループ鍵で AES-GCM 暗号化（`encrypted_name + nameIv`）

**鍵配布フロー（オフラインギャップあり）**

```
1. オーナーが POST /api/groups（自分用 wrappedGroupKey 同梱）
2. POST /api/groups/:id/invites {inviteeEmail} → token 生成
3. 被招待者: POST /api/groups/invites/:token/accept → pending_key 登録
4. 既存メンバーが次回同期時に pending_key を検知
   → 被招待者の公開鍵で groupKey を wrap → grantMemberKey → active 化・席付与
```

**オフライン鍵受け渡しギャップは設計上の割り切り**：既存メンバーがオンラインになるまで被招待者は読めない。
UIで「アクセス権付与待ち」を明示することで許容する。

### D1 スキーマ設計

| 新テーブル          | 説明                                                                |
| ------------------- | ------------------------------------------------------------------- |
| `user_public_keys`  | SPKI公開鍵・fingerprint・暗号化秘密鍵バックアップ                   |
| `family_seats`      | owner→member の Pro相当席付与                                       |
| `family_groups`     | encrypted_name+iv・owner_id・key_version                            |
| `group_memberships` | status: pending_key \| active                                       |
| `group_member_keys` | per-member の wrappedGroupKey                                       |
| `group_invites`     | token PK・invitee_email・expires_at                                 |
| `group_pins_sync`   | (id, group_id) PK・author_id・encrypted_payload+iv・HLC・is_deleted |

`group_pins_sync` を既存 `pins_sync` と分離した理由：認可単位が異なる（個人=user_id スコープ、グループ=membership チェック）。
混在させるとチェック漏れが情報漏洩に直結するため、専用テーブルで footgun を排除する。

### 移動セマンティクス（重複表示防止）

- ピンをグループへ共有（`share-pin-to-group`）:
  1. グループ鍵で暗号化して `group_pins_sync` へ push
  2. 個人 `pins_sync` に tombstone を push（isDeleted=true）
  3. ローカル Pin の `space` を `{ kind: "group", groupId }` に更新
- ピンを個人地図へ戻す（`unshare-pin`）:
  1. グループ側に tombstone を push
  2. 個人 sync に pin を re-push
  3. ローカル `space` を undefined に更新
- 失敗時: push 失敗 → 後続の tombstone を実行しない（原子性を近似）

### 競合解決

- whole-pin LWW（既存 `compareHlc` / `computeServerHlc` を流用）
- グループ同期 HLC は localStorage でグループ別に追跡（`kdm:group-hlc-{groupId}-{physical|logical}`）

### マーカー表示

- グループピン（`pin.space?.kind === "group"`）: 紫色（`#8b5cf6`）
- 個人ピン: カテゴリー色（従来通り）

### 安全番号（safety number）

- 公開鍵のSHA-256 先頭12バイトを `AB:CD:EF:…` 形式で表示
- `family-group-sheet` のメンバー一覧に表示し、家族と口頭照合を推奨
- 強制ブロックは v1 では実施しない（TOFU）

## 採用しなかった代替案

### ECDH-P256 による鍵合意

- ephemeral 鍵管理が必要でグループ鍵配布の実装が複雑になる
- RSA-OAEP は「wrap する側が相手の公開鍵だけ持てば良い」という単純さがある
- ECDH-P256 は Phase 2 以降の候補

### グループ鍵を招待リンクに埋め込む

- リンクURLがキャッシュ・転送された場合に秘密鍵が漏洩するリスク
- オフラインギャップの回避策にならない（既存メンバーのオンライン化が必要な点は変わらない）
- 採用しない

### `pins_sync` に group_id カラムを追加する

- 既存クエリの全箇所に `group_id IS NULL` フィルタが必要になる
- チェック漏れ1件が情報漏洩に直結する
- 専用テーブルで認可単位を分離する方が安全

## 実装上の注意点

- **既存 `deriveKey` は wrap 不可**：`extractable=false`・usages `["encrypt","decrypt"]`。秘密鍵バックアップには PKCS8 を `encrypt()` で直接暗号化する（wrapKey API を経由しない）
- **グループ鍵だけ `extractable=true`**：各メンバーへ wrap するため必須。個人鍵は非抽出のまま
- **`family_seats` 削除時の効果**：被招待者の effectivePlan が free に戻り個人同期も停止する。ユーザーに事前通知すること
- **key_version 配管**：将来の鍵ローテーション（Phase 3）に備え、全暗号化レコードに `key_version` を付与済み

## ユーザーへの注意事項

`family-group-sheet` のオンボーディングで以下を通知する：

1. **パスフレーズの重要性**：忘れると共有データも復元不可
2. **招待後の待ち時間**：既存メンバーがオンラインになると共有データが見られる
3. **メンバー失効の限界**：ソフト失効は新しい変更へのアクセスを止めるだけ（完全な保護には鍵ローテーションが必要）
4. **安全番号の確認推奨**：なりすまし防止に口頭照合を推奨

## 段階リリース

| フェーズ | 内容                                         | 状態    |
| -------- | -------------------------------------------- | ------- |
| Phase 0  | RSA-OAEP 鍵ペア基盤・バックアップ            | ✅ 完了 |
| Phase 1  | グループ作成・招待・閲覧共有・Family Plan    | ✅ 完了 |
| Phase 2  | 共同編集・share/unshare UI・グループ同期統合 | ✅ 完了 |
| Phase 3  | ソフト失効・完全鍵ローテーション             | ✅ 完了 |
| Phase 4  | 共有写真（group_photos_sync・R2）            | ✅ 完了 |

## 関連 ADR

- [ADR-008](ADR-008-cloud-sync.md): E2E暗号化クラウド同期（個人鍵の設計根拠）
- [ADR-009](ADR-009-passkey-2fa.md): パスキー2FA（Proプラン認証強化）
