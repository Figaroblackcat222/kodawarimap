-- 招待経由の仮アカウント対応
-- status: 'active'（通常）| 'pending_setup'（招待で作成された仮アカウント）
ALTER TABLE users ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
