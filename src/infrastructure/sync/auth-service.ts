/**
 * JWT 管理・自動リフレッシュサービス
 *
 * localStorage にトークンを保存し、期限切れ時に自動でリフレッシュする。
 * 並行リフレッシュ呼び出しは同一 Promise を返す（競合防止）。
 */

export const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ??
  "https://kodawarimap-api.figaroblackcat.workers.dev";

const STORAGE_KEY = {
  ACCESS_TOKEN: "kdm:access-token",
  REFRESH_TOKEN: "kdm:refresh-token",
  USER_EMAIL: "kdm:user-email",
  SYNC_SALT: "kdm:sync-salt",
  USER_PLAN: "kdm:user-plan",
  USER_ROLE: "kdm:user-role",
  PASSKEY_ENABLED: "kdm:passkey-enabled",
} as const;

/** JWT ペイロードの型（最低限） */
interface JwtPayload {
  sub: string;
  exp?: number;
  iat?: number;
}

/** 進行中のリフレッシュ Promise（競合防止） */
let refreshingPromise: Promise<string | null> | null = null;

/** プラン変更リスナー */
const planChangeListeners = new Set<() => void>();

export const authService = {
  // ---------------------------------------------------------------------------
  // トークン操作
  // ---------------------------------------------------------------------------

  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(STORAGE_KEY.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEY.REFRESH_TOKEN, refreshToken);
  },

  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEY.REFRESH_TOKEN);
  },

  saveEmail(email: string): void {
    localStorage.setItem(STORAGE_KEY.USER_EMAIL, email);
  },

  getEmail(): string | null {
    return localStorage.getItem(STORAGE_KEY.USER_EMAIL);
  },

  clearTokens(): void {
    localStorage.removeItem(STORAGE_KEY.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEY.REFRESH_TOKEN);
  },

  isLoggedIn(): boolean {
    return localStorage.getItem(STORAGE_KEY.REFRESH_TOKEN) !== null;
  },

  getSalt(): string | null {
    return localStorage.getItem(STORAGE_KEY.SYNC_SALT);
  },

  saveSalt(salt: string): void {
    localStorage.setItem(STORAGE_KEY.SYNC_SALT, salt);
  },

  savePlan(plan: string): void {
    localStorage.setItem(STORAGE_KEY.USER_PLAN, plan);
    planChangeListeners.forEach((fn) => fn());
  },

  onPlanChange(fn: () => void): () => void {
    planChangeListeners.add(fn);
    return () => planChangeListeners.delete(fn);
  },

  getPlan(): "free" | "pro" | "family" | null {
    const v = localStorage.getItem(STORAGE_KEY.USER_PLAN);
    if (v === "free" || v === "pro" || v === "family") return v;
    return null;
  },

  saveRole(role: string): void {
    localStorage.setItem(STORAGE_KEY.USER_ROLE, role);
  },

  getRole(): "user" | "admin" | null {
    const v = localStorage.getItem(STORAGE_KEY.USER_ROLE);
    if (v === "user" || v === "admin") return v;
    return null;
  },

  savePasskeyEnabled(enabled: boolean): void {
    localStorage.setItem(STORAGE_KEY.PASSKEY_ENABLED, enabled ? "1" : "0");
  },

  isPasskeyEnabled(): boolean {
    return localStorage.getItem(STORAGE_KEY.PASSKEY_ENABLED) === "1";
  },

  clearAll(): void {
    this.clearTokens();
    localStorage.removeItem(STORAGE_KEY.USER_EMAIL);
    localStorage.removeItem(STORAGE_KEY.SYNC_SALT);
    localStorage.removeItem(STORAGE_KEY.USER_PLAN);
    localStorage.removeItem(STORAGE_KEY.USER_ROLE);
    localStorage.removeItem(STORAGE_KEY.PASSKEY_ENABLED);
  },

  // ---------------------------------------------------------------------------
  // JWT デコード・有効期限確認
  // ---------------------------------------------------------------------------

  /**
   * JWT のペイロード部分をデコードする（署名検証なし・有効期限確認のみ）。
   */
  decodePayload(token: string): JwtPayload | null {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const payload = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(payload) as JwtPayload;
    } catch {
      return null;
    }
  },

  /**
   * アクセストークンの有効期限を確認する。
   * exp が現在時刻より 30 秒以内なら期限切れと判定（余裕を持たせる）。
   */
  isAccessTokenExpired(token: string): boolean {
    const payload = this.decodePayload(token);
    if (!payload || payload.exp == null) return true;
    const nowSec = Math.floor(Date.now() / 1000);
    // 30秒のバッファを持って判定
    return payload.exp - 30 <= nowSec;
  },

  // ---------------------------------------------------------------------------
  // 有効なアクセストークン取得（自動リフレッシュ付き）
  // ---------------------------------------------------------------------------

  /**
   * 有効なアクセストークンを返す。
   * - トークンがなければ null
   * - 期限切れでなければそのまま返す
   * - 期限切れならリフレッシュを試みる（並行呼び出しは同一 Promise を共有）
   */
  async getValidAccessToken(): Promise<string | null> {
    const accessToken = this.getAccessToken();

    if (!accessToken) {
      return null;
    }

    if (!this.isAccessTokenExpired(accessToken)) {
      return accessToken;
    }

    // 期限切れ: リフレッシュが既に進行中なら同一 Promise を返す
    if (refreshingPromise !== null) {
      return refreshingPromise;
    }

    refreshingPromise = this._doRefresh().finally(() => {
      refreshingPromise = null;
    });

    return refreshingPromise;
  },

  /** 強制的にトークンをリフレッシュしてプランを更新する（バックグラウンド用） */
  forceRefresh(): Promise<void> {
    return this._doRefresh().then(() => undefined);
  },

  /**
   * リフレッシュ実行（内部メソッド）。
   */
  async _doRefresh(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearTokens();
      return null;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        // リフレッシュ失敗（revoked/expired）
        this.clearTokens();
        return null;
      }

      const data = (await res.json()) as {
        accessToken: string;
        refreshToken: string;
        plan?: string;
        role?: string;
      };
      this.saveTokens(data.accessToken, data.refreshToken);
      if (data.plan) this.savePlan(data.plan);
      if (data.role) this.saveRole(data.role);
      return data.accessToken;
    } catch {
      // ネットワークエラー: トークンは保持したまま null を返す
      return null;
    }
  },
};
