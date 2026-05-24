/**
 * SyncRepository の Cloudflare Workers API 実装
 *
 * Phase 4: 写真同期メソッドを実装。
 * 401 レスポンス時はトークンリフレッシュ後に1回リトライする。
 */
import type { SyncRepository, PinSyncRecord } from "@application/ports/sync-repository";
import { authService, API_BASE } from "./auth-service";

async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}): Promise<Response> {
  const token = await authService.getValidAccessToken();
  if (!token) {
    throw new Error("Unauthenticated");
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(input, { ...init, headers });

  // 401: トークンリフレッシュ後に1回リトライ
  if (res.status === 401) {
    authService.clearTokens();
    const newToken = await authService.getValidAccessToken();
    if (!newToken) {
      throw new Error("Unauthenticated");
    }
    const retryHeaders = new Headers(init.headers);
    retryHeaders.set("Authorization", `Bearer ${newToken}`);
    return fetch(input, { ...init, headers: retryHeaders });
  }

  return res;
}

/**
 * multipart/form-data リクエストに認証ヘッダーを付けて送信する。
 * FormData を body に指定すると Content-Type を自動設定できないため headers を別管理する。
 */
async function fetchWithAuthFormData(url: string, formData: FormData): Promise<Response> {
  const token = await authService.getValidAccessToken();
  if (!token) {
    throw new Error("Unauthenticated");
  }

  const res = await fetch(url, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (res.status === 401) {
    authService.clearTokens();
    const newToken = await authService.getValidAccessToken();
    if (!newToken) {
      throw new Error("Unauthenticated");
    }
    return fetch(url, {
      method: "PUT",
      headers: { Authorization: `Bearer ${newToken}` },
      body: formData,
    });
  }

  return res;
}

export const cloudflareSyncRepository: SyncRepository = {
  // ---------------------------------------------------------------------------
  // 認証
  // ---------------------------------------------------------------------------

  async register(email: string, passwordHash: string, salt: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, passwordHash, salt }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error ?? `Register failed: ${res.status}`);
    }
  },

  async requestRegistration(email: string, passwordHash: string, salt: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/auth/request-registration`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, passwordHash, salt }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error ?? `Request failed: ${res.status}`);
    }
  },

  async login(
    email: string,
    passwordHash: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    salt: string;
    plan: string;
    role: string;
  }> {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, passwordHash }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error ?? `Login failed: ${res.status}`);
    }
    const data = (await res.json()) as {
      accessToken: string;
      refreshToken: string;
      salt: string;
      plan: string;
      role: string;
    };
    authService.savePlan(data.plan ?? "free");
    authService.saveRole(data.role ?? "user");
    return data;
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error ?? `Refresh failed: ${res.status}`);
    }
    return res.json() as Promise<{ accessToken: string; refreshToken: string }>;
  },

  async logout(refreshToken: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error ?? `Logout failed: ${res.status}`);
    }
  },

  // ---------------------------------------------------------------------------
  // ピン同期
  // ---------------------------------------------------------------------------

  async fetchPinsSince(hlcPhysical: number, hlcLogical: number): Promise<PinSyncRecord[]> {
    const url = new URL(`${API_BASE}/api/pins/since`);
    url.searchParams.set("physical", String(hlcPhysical));
    url.searchParams.set("logical", String(hlcLogical));

    const res = await fetchWithAuth(url.toString(), { method: "GET" });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error ?? `fetchPinsSince failed: ${res.status}`);
    }

    const data = (await res.json()) as { pins: PinSyncRecord[] };
    return data.pins;
  },

  async pushPin(
    record: PinSyncRecord
  ): Promise<{ serverHlcPhysical: number; serverHlcLogical: number }> {
    const res = await fetchWithAuth(`${API_BASE}/api/pins/${record.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        encryptedPayload: record.encryptedPayload,
        iv: record.iv,
        hlcPhysical: record.hlcPhysical,
        hlcLogical: record.hlcLogical,
        hlcNodeId: record.hlcNodeId,
        isDeleted: record.isDeleted,
      }),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error ?? `pushPin failed: ${res.status}`);
    }

    return res.json() as Promise<{ serverHlcPhysical: number; serverHlcLogical: number }>;
  },

  // ---------------------------------------------------------------------------
  // 写真同期
  // ---------------------------------------------------------------------------

  async fetchPhotoList(
    pinId: string
  ): Promise<{ id: string; hlcPhysical: number; hlcLogical: number }[]> {
    const res = await fetchWithAuth(`${API_BASE}/api/photos/list/${pinId}`, { method: "GET" });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error ?? `fetchPhotoList failed: ${res.status}`);
    }
    const data = (await res.json()) as {
      photos: { id: string; hlcPhysical: number; hlcLogical: number }[];
    };
    return data.photos;
  },

  async pushPhotoBinary(
    photoId: string,
    encryptedBlob: ArrayBuffer,
    meta: {
      encryptedMeta: string;
      metaIv: string;
      pinId: string;
      hlcPhysical: number;
      hlcLogical: number;
      hlcNodeId: string;
    }
  ): Promise<void> {
    const formData = new FormData();
    formData.append("meta", JSON.stringify(meta));
    formData.append("blob", new Blob([encryptedBlob], { type: "application/octet-stream" }));

    const res = await fetchWithAuthFormData(`${API_BASE}/api/photos/${photoId}`, formData);
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error ?? `pushPhotoBinary failed: ${res.status}`);
    }
  },

  async fetchPhotoBinary(photoId: string): Promise<ArrayBuffer> {
    const res = await fetchWithAuth(`${API_BASE}/api/photos/${photoId}`, { method: "GET" });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error ?? `fetchPhotoBinary failed: ${res.status}`);
    }
    return res.arrayBuffer();
  },

  async deletePhoto(photoId: string): Promise<void> {
    const res = await fetchWithAuth(`${API_BASE}/api/photos/${photoId}`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error ?? `deletePhoto failed: ${res.status}`);
    }
  },
};
