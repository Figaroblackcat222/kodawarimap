/**
 * グループピン同期ルートハンドラ
 *
 * GET    /api/groups/:id/pins/since?physical=&logical=   HLC 以降のグループピン取得
 * PUT    /api/groups/:id/pins/:pinId                     グループピン push
 * DELETE /api/groups/:id/pins/:pinId                     グループピン tombstone
 */
import type { Env } from "../types";
import { requireGroupMember } from "../middleware/group-auth";
import { jsonResponse, emptyResponse } from "../middleware/cors";
import { computeServerHlc } from "../lib/hlc";

function getOrigin(r: Request) {
  return r.headers.get("Origin");
}

export async function handleGroupPins(
  request: Request,
  env: Env,
  groupId: string,
  subPath: string
): Promise<Response> {
  const origin = getOrigin(request);

  // GET /pins/since
  if (request.method === "GET" && subPath === "/pins/since") {
    const auth = await requireGroupMember(request, env, groupId);
    if (auth instanceof Response) return auth;

    const url = new URL(request.url);
    const physical = Number(url.searchParams.get("physical") ?? "0");
    const logical = Number(url.searchParams.get("logical") ?? "0");

    if (isNaN(physical) || isNaN(logical)) {
      return jsonResponse(
        { error: "physical and logical must be numbers" },
        400,
        origin,
        env.CORS_ORIGIN
      );
    }

    const rows = await env.DB.prepare(
      `SELECT id, author_id, key_version, encrypted_payload, iv,
              hlc_physical, hlc_logical, hlc_node_id, is_deleted, created_at
       FROM group_pins_sync
       WHERE group_id = ?
         AND (hlc_physical > ? OR (hlc_physical = ? AND hlc_logical > ?))
       ORDER BY hlc_physical ASC, hlc_logical ASC
       LIMIT 1000`
    )
      .bind(groupId, physical, physical, logical)
      .all<{
        id: string;
        author_id: string;
        key_version: number;
        encrypted_payload: string;
        iv: string;
        hlc_physical: number;
        hlc_logical: number;
        hlc_node_id: string;
        is_deleted: number;
        created_at: string;
      }>();

    const pins = (rows.results ?? []).map((r) => ({
      id: r.id,
      authorId: r.author_id,
      keyVersion: r.key_version,
      encryptedPayload: r.encrypted_payload,
      iv: r.iv,
      hlcPhysical: r.hlc_physical,
      hlcLogical: r.hlc_logical,
      hlcNodeId: r.hlc_node_id,
      isDeleted: r.is_deleted === 1,
      createdAt: r.created_at,
    }));

    return jsonResponse({ pins }, 200, origin, env.CORS_ORIGIN);
  }

  // PUT /pins/:pinId
  const pinPutMatch = subPath.match(/^\/pins\/([^/]+)$/);
  if (request.method === "PUT" && pinPutMatch) {
    const pinId = pinPutMatch[1];
    const auth = await requireGroupMember(request, env, groupId);
    if (auth instanceof Response) return auth;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400, origin, env.CORS_ORIGIN);
    }

    const { encryptedPayload, iv, hlcPhysical, hlcLogical, hlcNodeId, isDeleted, keyVersion } =
      body as Record<string, unknown>;

    if (
      typeof encryptedPayload !== "string" ||
      typeof iv !== "string" ||
      typeof hlcPhysical !== "number" ||
      typeof hlcLogical !== "number" ||
      typeof hlcNodeId !== "string" ||
      typeof keyVersion !== "number"
    ) {
      return jsonResponse({ error: "Invalid body" }, 400, origin, env.CORS_ORIGIN);
    }

    // サーバー HLC で単調増加を保証
    const group = await env.DB.prepare(`SELECT key_version FROM family_groups WHERE id = ?`)
      .bind(groupId)
      .first<{ key_version: number }>();
    if (!group) return jsonResponse({ error: "group_not_found" }, 404, origin, env.CORS_ORIGIN);

    const serverHlc = computeServerHlc(hlcPhysical, hlcLogical);

    const now = new Date().toISOString();
    await env.DB.prepare(
      `INSERT INTO group_pins_sync
         (id, group_id, author_id, key_version, encrypted_payload, iv,
          hlc_physical, hlc_logical, hlc_node_id, is_deleted, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id, group_id) DO UPDATE SET
         author_id = excluded.author_id,
         key_version = excluded.key_version,
         encrypted_payload = excluded.encrypted_payload,
         iv = excluded.iv,
         hlc_physical = excluded.hlc_physical,
         hlc_logical = excluded.hlc_logical,
         hlc_node_id = excluded.hlc_node_id,
         is_deleted = excluded.is_deleted`
    )
      .bind(
        pinId,
        groupId,
        auth.userId,
        keyVersion,
        encryptedPayload,
        iv,
        serverHlc.physical,
        serverHlc.logical,
        hlcNodeId,
        isDeleted ? 1 : 0,
        now
      )
      .run();

    return jsonResponse(
      { hlcPhysical: serverHlc.physical, hlcLogical: serverHlc.logical },
      200,
      origin,
      env.CORS_ORIGIN
    );
  }

  // DELETE /pins/:pinId
  const pinDelMatch = subPath.match(/^\/pins\/([^/]+)$/);
  if (request.method === "DELETE" && pinDelMatch) {
    const pinId = pinDelMatch[1];
    const auth = await requireGroupMember(request, env, groupId);
    if (auth instanceof Response) return auth;

    // 作者のみ削除可（または将来的にオーナー）
    const existing = await env.DB.prepare(
      `SELECT author_id FROM group_pins_sync WHERE id = ? AND group_id = ?`
    )
      .bind(pinId, groupId)
      .first<{ author_id: string }>();

    if (!existing) return jsonResponse({ error: "not_found" }, 404, origin, env.CORS_ORIGIN);
    if (existing.author_id !== auth.userId && auth.groupRole !== "owner") {
      return jsonResponse({ error: "forbidden" }, 403, origin, env.CORS_ORIGIN);
    }

    await env.DB.prepare(`UPDATE group_pins_sync SET is_deleted = 1 WHERE id = ? AND group_id = ?`)
      .bind(pinId, groupId)
      .run();

    return emptyResponse(204, origin, env.CORS_ORIGIN);
  }

  return jsonResponse({ error: "Not Found" }, 404, origin, env.CORS_ORIGIN);
}
