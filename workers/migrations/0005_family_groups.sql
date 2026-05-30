-- Phase 0: 公開鍵管理テーブル
-- Phase 1 以降のグループ関連テーブルはここに追記していく

-- ユーザーの RSA-OAEP 公開鍵 + パスフレーズ暗号化済み秘密鍵バックアップ
CREATE TABLE IF NOT EXISTS user_public_keys (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  -- 公開鍵 (SPKI base64)
  public_key TEXT NOT NULL,
  -- SHA-256 フィンガープリント (safety number 表示用)
  fingerprint TEXT NOT NULL,
  -- 秘密鍵バックアップ: パスフレーズ由来 AES-GCM で暗号化した PKCS8
  -- サーバーは平文を見られない。新デバイスでのログイン後復元に使用。
  wrapped_private_key TEXT,
  wrapped_private_key_iv TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
