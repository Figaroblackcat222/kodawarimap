-- Phase 1: 家族グループ共有テーブル群
-- user_public_keys は 0005 で作成済み

-- 席付与テーブル: Family オーナーが付与したPro相当席
CREATE TABLE IF NOT EXISTS family_seats (
  owner_user_id TEXT NOT NULL REFERENCES users(id),
  member_user_id TEXT NOT NULL REFERENCES users(id),
  granted_at TEXT NOT NULL,
  PRIMARY KEY (owner_user_id, member_user_id)
);
CREATE INDEX IF NOT EXISTS idx_family_seats_member ON family_seats(member_user_id);

-- グループ本体: 名前はグループ鍵で暗号化（サーバー復号不可）
CREATE TABLE IF NOT EXISTS family_groups (
  id TEXT PRIMARY KEY,
  encrypted_name TEXT NOT NULL,
  name_iv TEXT NOT NULL,
  owner_id TEXT NOT NULL REFERENCES users(id),
  key_version INTEGER NOT NULL DEFAULT 1,
  max_seats INTEGER NOT NULL DEFAULT 5,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_family_groups_owner ON family_groups(owner_id);

-- メンバーシップ: status = 'pending_key' | 'active'
CREATE TABLE IF NOT EXISTS group_memberships (
  group_id TEXT NOT NULL REFERENCES family_groups(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  role TEXT NOT NULL DEFAULT 'member',   -- 'owner' | 'member'
  status TEXT NOT NULL DEFAULT 'active', -- 'pending_key' | 'active'
  joined_at TEXT NOT NULL,
  PRIMARY KEY (group_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_group_memberships_user ON group_memberships(user_id);

-- メンバーごとのラップ済みグループ鍵（RSA-OAEP）
-- サーバーは unwrap 不可 = E2E維持
CREATE TABLE IF NOT EXISTS group_member_keys (
  group_id TEXT NOT NULL REFERENCES family_groups(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  key_version INTEGER NOT NULL,
  wrapped_group_key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (group_id, user_id, key_version)
);

-- 招待トークン (リンク共有方式)
CREATE TABLE IF NOT EXISTS group_invites (
  token TEXT PRIMARY KEY,
  group_id TEXT NOT NULL REFERENCES family_groups(id),
  invitee_email TEXT NOT NULL,
  invited_by TEXT NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'accepted' | 'revoked'
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_group_invites_group ON group_invites(group_id);
CREATE INDEX IF NOT EXISTS idx_group_invites_email ON group_invites(invitee_email);

-- グループピン同期: 個人の pins_sync と分離（認可単位が group_id）
-- encrypted_payload / iv はグループ鍵で暗号化（サーバー復号不可）
CREATE TABLE IF NOT EXISTS group_pins_sync (
  id TEXT NOT NULL,
  group_id TEXT NOT NULL REFERENCES family_groups(id),
  author_id TEXT NOT NULL REFERENCES users(id),
  key_version INTEGER NOT NULL,
  encrypted_payload TEXT NOT NULL,
  iv TEXT NOT NULL,
  hlc_physical INTEGER NOT NULL,
  hlc_logical INTEGER NOT NULL,
  hlc_node_id TEXT NOT NULL,
  is_deleted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  PRIMARY KEY (id, group_id)
);
CREATE INDEX IF NOT EXISTS idx_group_pins_hlc ON group_pins_sync(group_id, hlc_physical, hlc_logical);
