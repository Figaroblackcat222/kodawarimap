import { authService, API_BASE } from "@infrastructure/sync/auth-service";

export interface AdminUser {
  id: string;
  email: string;
  plan: "free" | "pro";
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface ListUsersResult {
  users: AdminUser[];
  total: number;
  limit: number;
  offset: number;
}

async function adminFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = await authService.getValidAccessToken();
  if (!token) throw new Error("Unauthenticated");

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");

  return fetch(`${API_BASE}${path}`, { ...init, headers });
}

export const adminApiClient = {
  async listUsers(query = "", limit = 50, offset = 0): Promise<ListUsersResult> {
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });
    if (query) params.set("q", query);

    const res = await adminFetch(`/api/admin/users?${params.toString()}`);
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error ?? `listUsers failed: ${res.status}`);
    }
    return res.json() as Promise<ListUsersResult>;
  },

  async updateUserPlan(userId: string, plan: "free" | "pro"): Promise<void> {
    const res = await adminFetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ plan }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error ?? `updateUserPlan failed: ${res.status}`);
    }
  },
};
