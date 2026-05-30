/**
 * KeySyncRepository の Cloudflare Workers API 実装
 */
import type { KeySyncRepository } from "@application/ports/key-sync-repository";
import { authService, API_BASE } from "./auth-service";

async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  const token = await authService.getValidAccessToken();
  if (!token) throw new Error("Unauthenticated");

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(input, { ...init, headers });

  if (res.status === 401) {
    authService.clearTokens();
    const newToken = await authService.getValidAccessToken();
    if (!newToken) throw new Error("Unauthenticated");
    const retryHeaders = new Headers(init.headers);
    retryHeaders.set("Authorization", `Bearer ${newToken}`);
    return fetch(input, { ...init, headers: retryHeaders });
  }

  return res;
}

export const cloudflarekeySyncRepository: KeySyncRepository = {
  async publishPublicKey({ publicKey, fingerprint, wrappedPrivateKey, wrappedPrivateKeyIv }) {
    const res = await fetchWithAuth(`${API_BASE}/api/keys/public`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicKey, fingerprint, wrappedPrivateKey, wrappedPrivateKeyIv }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { detail?: string };
      throw new Error(data.detail ?? `publishPublicKey failed: ${res.status}`);
    }
  },

  async fetchPublicKey(userId: string) {
    const res = await fetchWithAuth(`${API_BASE}/api/keys/public/${encodeURIComponent(userId)}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`fetchPublicKey failed: ${res.status}`);
    const data = (await res.json()) as { publicKey: string; fingerprint: string };
    return { publicKey: data.publicKey, fingerprint: data.fingerprint };
  },

  async fetchPrivateKeyBackup() {
    const res = await fetchWithAuth(`${API_BASE}/api/keys/private-backup`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`fetchPrivateKeyBackup failed: ${res.status}`);
    const data = (await res.json()) as {
      wrappedPrivateKey: string;
      wrappedPrivateKeyIv: string;
    };
    return {
      wrappedPrivateKey: data.wrappedPrivateKey,
      wrappedPrivateKeyIv: data.wrappedPrivateKeyIv,
    };
  },
};
