-- group_photos_sync: グループ共有ピンに紐付く写真（E2E暗号化・グループ鍵）
-- R2パス: group-photos/{group_id}/{photo_id}.enc
CREATE TABLE IF NOT EXISTS group_photos_sync (
  id          TEXT    NOT NULL,
  group_id    TEXT    NOT NULL,
  pin_id      TEXT    NOT NULL,
  author_id   TEXT    NOT NULL,
  key_version INTEGER NOT NULL DEFAULT 1,
  encrypted_meta TEXT NOT NULL DEFAULT '',
  meta_iv     TEXT    NOT NULL DEFAULT '',
  r2_key      TEXT    NOT NULL DEFAULT '',
  size_bytes  INTEGER NOT NULL DEFAULT 0,
  hlc_physical INTEGER NOT NULL DEFAULT 0,
  hlc_logical  INTEGER NOT NULL DEFAULT 0,
  hlc_node_id  TEXT   NOT NULL DEFAULT '',
  is_deleted   INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT    NOT NULL,
  PRIMARY KEY (id, group_id)
);
CREATE INDEX IF NOT EXISTS idx_group_photos_pin ON group_photos_sync (group_id, pin_id, is_deleted);
