export interface Env {
  DB: D1Database;
  PHOTOS: R2Bucket;
  JWT_SECRET: string; // Workers secret（wrangler secret put JWT_SECRET）
  ENVIRONMENT: string;
  CORS_ORIGIN: string; // 許可するオリジン（例: https://kodawarimap.pages.dev）
  REGISTRATION_OPEN?: string; // 'true' のときのみ新規登録を受け付ける（デフォルト: 停止）
}
