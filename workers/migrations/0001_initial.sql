CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pins_sync (
  id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  encrypted_payload TEXT NOT NULL,
  iv TEXT NOT NULL,
  hlc_physical INTEGER NOT NULL,
  hlc_logical INTEGER NOT NULL,
  hlc_node_id TEXT NOT NULL,
  is_deleted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  PRIMARY KEY (id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_pins_sync_user_hlc ON pins_sync(user_id, hlc_physical, hlc_logical);

CREATE TABLE IF NOT EXISTS photos_sync (
  id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  pin_id TEXT NOT NULL,
  encrypted_meta TEXT NOT NULL,
  meta_iv TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  size_bytes INTEGER,
  hlc_physical INTEGER NOT NULL,
  hlc_logical INTEGER NOT NULL,
  hlc_node_id TEXT NOT NULL,
  is_deleted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  PRIMARY KEY (id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_photos_sync_pin ON photos_sync(user_id, pin_id);
CREATE INDEX IF NOT EXISTS idx_photos_sync_user_hlc ON photos_sync(user_id, hlc_physical, hlc_logical);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  expires_at TEXT NOT NULL,
  revoked INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);

CREATE TABLE IF NOT EXISTS login_attempts (
  email TEXT NOT NULL,
  attempted_at TEXT NOT NULL,
  ip_hash TEXT,
  PRIMARY KEY (email, attempted_at)
);
