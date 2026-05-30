# ADR-009: パスキー（WebAuthn/FIDO2）による2段階認証

## ステータス

採用済み（2026-05-30 実装完了）

## コンテキスト

Proプランは有料サービスであり、セキュリティへの信頼がユーザーの安心感に直結する。
ログイン認証を強化するにあたり、以下の選択肢を検討した。

- **TOTP（Google Authenticator等）**: 6桁コード入力。実装は単純だがユーザーが面倒に感じやすい
- **パスキー（WebAuthn/FIDO2）**: 指紋/Face ID のタップ一発。UX が良くデバイス登録の証明にもなる
- **SMS認証**: SMS インフラ費用・番号変更リスク・Cloudflare Workers との相性の悪さ

パスキーは「このデバイスでのみ同期できる」という信頼の宣言にもなり、
サービスの性格（プライバシー重視・自分のデータを守る）と完全に一致する。

## 決定

**パスキー（WebAuthn/FIDO2）をログイン後の2FA として Proプランに導入する。**

### 基本設計

| 項目                    | 決定                                                                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 認証フロー              | email + パスフレーズ → パスキー（2FA）→ 通常トークン発行                                                                                         |
| 対象                    | Proプランのみ（requirePro ミドルウェア適用）                                                                                                     |
| パスフレーズ            | 引き続き必須（PBKDF2 による暗号鍵導出に使用するため省略不可）                                                                                    |
| RP ID                   | Origin ヘッダーから動的導出（localhost 開発/本番を自動切り替え）                                                                                 |
| サーバーライブラリ      | `@simplewebauthn/server` v13（Web Crypto ベース・Workers 対応）                                                                                  |
| クライアント            | Web Authentication API 直接利用（追加ライブラリなし）                                                                                            |
| challenge 管理          | D1 の `webauthn_challenges` テーブルに保存（TTL 5分）・begin/issuePasskeySession 時に旧レコードを先に削除して挿入（古い challenge 残留バグ防止） |
| 検証オプション          | `requireUserVerification: false`（`userVerification: "preferred"` との整合）                                                                     |
| authenticatorAttachment | `"platform"` を指定（Face ID / Touch ID のみ選択肢に表示。未指定だとQRコード・セキュリティキーが出てしまう）                                     |
| 複数デバイス            | デバイス名付きで複数台登録可能                                                                                                                   |
| 管理者アカウント        | パスキー未対応（意図的制限・admin の特権操作に passkey 設定を強制しない）                                                                        |

### D1 スキーマ追加（migration 0004）

```sql
CREATE TABLE webauthn_credentials (
  id TEXT PRIMARY KEY,         -- credential ID（base64url）
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  public_key TEXT NOT NULL,    -- COSE 公開鍵（base64url）
  counter INTEGER NOT NULL DEFAULT 0,
  device_name TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE webauthn_challenges (
  challenge TEXT PRIMARY KEY,  -- base64url
  user_id TEXT NOT NULL,
  expires_at TEXT NOT NULL     -- TTL 5分
);
```

### ログインフロー

```
POST /api/auth/login
  パスワード認証 → webauthn_credentials を確認
    件数 = 0: 従来トークン返却
    件数 > 0: passkey_session JWT（TTL 5分・passkey_pending: true）を返却
              { requires_passkey, passkey_session, challenge, credential_ids, salt }

【件数 = 0 の場合（クライアント側で強制登録）】
  クライアント: listPasskeyCredentials() → 0件 → force-passkey-register モードへ遷移
    → beginPasskeyRegistration / navigator.credentials.create / completePasskeyRegistration
    → savePasskeyEnabled(true) → onSuccess(key)

【件数 > 0 の場合（2FA）】
  クライアント: navigator.credentials.get({ challenge, allowCredentials })
    → 生体認証 → assertion 取得

  POST /api/webauthn/auth/verify
    passkey_session 検証 → challenge 照合・削除
    → verifyAuthenticationResponse → counter 更新
    → 通常の accessToken / refreshToken を発行・返却
```

### パスキー登録フロー

```
POST /api/webauthn/register/begin（requireAuth + requirePro）
  旧 challenge 削除 → challenge 生成・D1 保存
  → generateRegistrationOptions を返却

クライアント: navigator.credentials.create(options)
  → 生体認証 → credential 取得

POST /api/webauthn/register/complete（requireAuth + requirePro）
  challenge 照合・削除
  → verifyRegistrationResponse（requireUserVerification: false）
  → webauthn_credentials に公開鍵・counter を保存
```

## 採用しなかった代替案

### TOTP

- 6桁コードの入力が必要でモバイルでは特に手間
- 認証器アプリのインストールが必要
- デバイス登録の証明にはならない

### パスキーをパスフレーズの代替にする

- パスフレーズは PBKDF2 による E2E 暗号鍵導出に必須
- パスキーはサーバー認証のみ担当、暗号鍵の導出は別概念
- パスフレーズを排除するとデータの復号が不可能になる

### バックアップコード

- 招待制の小規模サービスのため管理者が DB で直接救済可能
- 実装コストに対してメリットが小さいため不採用

## 実装上の注意点

- **`requireUserVerification: false`**: `userVerification: "preferred"` で登録した credential は UV フラグが必ずしも立たないため、verify 側も `required` にすると「User verification was required, but user could not be verified」で失敗する
- **古い challenge の残留**: `webauthn_challenges.challenge` が PRIMARY KEY のため `INSERT OR REPLACE` で同じユーザーの旧レコードが消えない。begin 前に `DELETE WHERE user_id = ?` を実行してから `INSERT` する
- **RP ID の一致**: 登録と認証で同じ RP ID を使わないと検証が失敗する。`getRpInfo()` で Origin ヘッダーから一貫して導出することで解決
- **platform authenticator の共有**: macOS では Chrome/Safari が同じ iCloud キーチェーンのパスキーを共有するため、同一 Mac の別ブラウザは「別デバイス」にならない
- **`authenticatorAttachment: "platform"` は必須**: 未指定だとブラウザが QR コード・セキュリティキーの選択肢を出してしまい Face ID / Touch ID が表示されない。`generateRegistrationOptions` の `authenticatorSelection` に必ず指定すること
- **既存 credential の移行**: `authenticatorAttachment` 未指定で登録した cross-platform credential が D1 に残っていると、ログイン時に QR/セキュリティキー UI が出続ける。`DELETE FROM webauthn_credentials` で一括削除後に再登録が必要

## 結果とトレードオフ

### メリット

- Touch ID / Face ID のタップ一発で完結（TOTP の6桁入力より UX が優れる）
- 登録済みデバイスのみ同期可能という信頼の宣言になる
- 業界標準（FIDO2/WebAuthn）への準拠でユーザーの安心感を醸成
- Cloudflare 無料枠のみで実現（追加インフラ不要）

### デメリット・注意点

- 新デバイスで最初にログインするときはパスキーが未登録 → force-passkey-register モードで即時登録を強制（任意登録から必須登録に変更済み）
- platform authenticator はデバイス/OS に依存するため、デバイス紛失時はパスキーが使えなくなる（パスキー未登録状態に戻すには管理者が DB から webauthn_credentials を削除する）
- Proプランはマルチデバイス同期前提のため複数デバイスへのパスキー登録を推奨（iCloud/Google キーチェーン経由で同エコシステム内のデバイスはパスキーが自動共有されるため実質的なリカバリになる）
- ローカル開発時は `workers/.dev.vars` に JWT_SECRET 等を設定する必要がある

## 関連 ADR

- [ADR-008](ADR-008-cloud-sync.md): E2E暗号化クラウド同期（パスフレーズが暗号鍵導出に必須である根拠）
