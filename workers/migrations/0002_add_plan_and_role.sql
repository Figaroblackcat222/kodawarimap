-- plan: 'free' | 'pro'  既存ユーザーは grandfather で 'pro'
-- role: 'user' | 'admin'  既存ユーザーは 'user'
ALTER TABLE users ADD COLUMN plan TEXT NOT NULL DEFAULT 'pro';
ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
