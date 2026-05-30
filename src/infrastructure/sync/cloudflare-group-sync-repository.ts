/**
 * GroupSyncRepository の Cloudflare Workers API 実装
 */
import type {
  GroupSyncRepository,
  GroupPinSyncRecord,
} from "@application/ports/group-sync-repository";
import type { RawGroupRecord, GroupMember } from "@domain/entities/family-group";
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
    const h2 = new Headers(init.headers);
    h2.set("Authorization", `Bearer ${newToken}`);
    return fetch(input, { ...init, headers: h2 });
  }
  return res;
}

async function postJson(url: string, body: unknown): Promise<Response> {
  return fetchWithAuth(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export const cloudflareGroupSyncRepository: GroupSyncRepository = {
  async createGroup({ encryptedName, nameIv, wrappedGroupKey }) {
    const res = await postJson(`${API_BASE}/api/groups`, {
      encryptedName,
      nameIv,
      wrappedGroupKey,
    });
    if (!res.ok) {
      const d = (await res.json().catch(() => ({}))) as { detail?: string };
      throw new Error(d.detail ?? `createGroup failed: ${res.status}`);
    }
    return res.json() as Promise<{ groupId: string }>;
  },

  async listGroups() {
    const res = await fetchWithAuth(`${API_BASE}/api/groups`);
    if (!res.ok) throw new Error(`listGroups failed: ${res.status}`);
    const d = (await res.json()) as { groups: RawGroupRecord[] };
    return d.groups;
  },

  async listMembers(groupId) {
    const res = await fetchWithAuth(`${API_BASE}/api/groups/${groupId}/members`);
    if (!res.ok) throw new Error(`listMembers failed: ${res.status}`);
    const d = (await res.json()) as { members: GroupMember[] };
    return d.members;
  },

  async inviteMember(groupId, inviteeEmail) {
    const res = await postJson(`${API_BASE}/api/groups/${groupId}/invites`, { inviteeEmail });
    if (!res.ok) {
      const d = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(d.error ?? `inviteMember failed: ${res.status}`);
    }
    return res.json() as Promise<{ token: string }>;
  },

  async acceptInvite(token) {
    const res = await postJson(`${API_BASE}/api/groups/invites/${token}/accept`, {});
    if (!res.ok) {
      const d = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(d.error ?? `acceptInvite failed: ${res.status}`);
    }
    return res.json() as Promise<{ groupId: string }>;
  },

  async fetchMyGroupKey(groupId) {
    const res = await fetchWithAuth(`${API_BASE}/api/groups/${groupId}/my-key`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`fetchMyGroupKey failed: ${res.status}`);
    return res.json() as Promise<{ wrappedGroupKey: string; keyVersion: number }>;
  },

  async listPendingKeys(groupId) {
    const res = await fetchWithAuth(`${API_BASE}/api/groups/${groupId}/pending-keys`);
    if (!res.ok) throw new Error(`listPendingKeys failed: ${res.status}`);
    const d = (await res.json()) as {
      pending: Array<{ userId: string; publicKey: string; fingerprint: string }>;
    };
    return d.pending;
  },

  async grantMemberKey(groupId, userId, wrappedGroupKey) {
    const res = await postJson(`${API_BASE}/api/groups/${groupId}/member-keys`, {
      userId,
      wrappedGroupKey,
    });
    if (!res.ok) {
      const d = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(d.error ?? `grantMemberKey failed: ${res.status}`);
    }
  },

  async fetchGroupPinsSince(groupId, physical, logical) {
    const res = await fetchWithAuth(
      `${API_BASE}/api/groups/${groupId}/pins/since?physical=${physical}&logical=${logical}`
    );
    if (!res.ok) throw new Error(`fetchGroupPinsSince failed: ${res.status}`);
    const d = (await res.json()) as { pins: GroupPinSyncRecord[] };
    return d.pins;
  },

  async pushGroupPin(groupId, pinId, data) {
    const res = await fetchWithAuth(`${API_BASE}/api/groups/${groupId}/pins/${pinId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const d = (await res.json().catch(() => ({}))) as { detail?: string };
      throw new Error(d.detail ?? `pushGroupPin failed: ${res.status}`);
    }
    return res.json() as Promise<{ hlcPhysical: number; hlcLogical: number }>;
  },

  async fetchGroupPhotoList(groupId, pinId) {
    const res = await fetchWithAuth(`${API_BASE}/api/groups/${groupId}/photos/list/${pinId}`);
    if (!res.ok) throw new Error(`fetchGroupPhotoList failed: ${res.status}`);
    const d = (await res.json()) as {
      photos: Array<{
        id: string;
        hlcPhysical: number;
        hlcLogical: number;
        encryptedMeta: string;
        metaIv: string;
        keyVersion: number;
      }>;
    };
    return d.photos;
  },

  async pushGroupPhotoBinary(groupId, photoId, encryptedBlob, meta) {
    const form = new FormData();
    form.append("meta", JSON.stringify(meta));
    form.append("blob", new Blob([encryptedBlob], { type: "application/octet-stream" }));

    const token = await (await import("./auth-service")).authService.getValidAccessToken();
    if (!token) throw new Error("Unauthenticated");

    const res = await fetchWithAuth(`${API_BASE}/api/groups/${groupId}/photos/${photoId}`, {
      method: "PUT",
      body: form,
    });
    if (!res.ok) {
      const d = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(d.error ?? `pushGroupPhotoBinary failed: ${res.status}`);
    }
  },

  async fetchGroupPhotoBinary(groupId, photoId) {
    const res = await fetchWithAuth(`${API_BASE}/api/groups/${groupId}/photos/${photoId}`);
    if (!res.ok) throw new Error(`fetchGroupPhotoBinary failed: ${res.status}`);
    return res.arrayBuffer();
  },

  async deleteGroupPhoto(groupId, photoId) {
    const res = await fetchWithAuth(`${API_BASE}/api/groups/${groupId}/photos/${photoId}`, {
      method: "DELETE",
    });
    if (!res.ok && res.status !== 404) {
      const d = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(d.error ?? `deleteGroupPhoto failed: ${res.status}`);
    }
  },

  async revokeGroupMember(groupId, userId) {
    const res = await fetchWithAuth(`${API_BASE}/api/groups/${groupId}/members/${userId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const d = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(d.error ?? `revokeGroupMember failed: ${res.status}`);
    }
  },

  async fetchActivePublicKeys(groupId) {
    const res = await fetchWithAuth(`${API_BASE}/api/groups/${groupId}/active-keys`);
    if (!res.ok) throw new Error(`fetchActivePublicKeys failed: ${res.status}`);
    const d = (await res.json()) as {
      keys: Array<{ userId: string; publicKey: string; fingerprint: string }>;
    };
    return d.keys;
  },

  async rotateGroupKey(groupId, { newKeyVersion, wrappedKeys, encryptedName, nameIv }) {
    const res = await postJson(`${API_BASE}/api/groups/${groupId}/rotate-key`, {
      newKeyVersion,
      wrappedKeys,
      encryptedName,
      nameIv,
    });
    if (!res.ok) {
      const d = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(d.error ?? `rotateGroupKey failed: ${res.status}`);
    }
  },

  async deleteGroup(groupId) {
    const res = await fetchWithAuth(`${API_BASE}/api/groups/${groupId}`, { method: "DELETE" });
    if (!res.ok) {
      const d = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(d.error ?? `deleteGroup failed: ${res.status}`);
    }
  },
};
