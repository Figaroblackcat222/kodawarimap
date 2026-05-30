/**
 * グループ写真同期ルートハンドラ
 *
 * 全エンドポイントで requireGroupMember（active 確認）を適用。
 * 写真はグループ鍵で暗号化済みのバイナリを R2 に保存し、メタは D1 で管理する。
 *
 * GET    /photos/list/:pinId    ピンに紐づくグループ写真一覧
 * PUT    /photos/:photoId       グループ写真アップロード（multipart）
 * GET    /photos/:photoId       グループ写真ダウンロード
 * DELETE /photos/:photoId       グループ写真削除
 */
import type { Env } from "../types";
import { requireGroupMember } from "../middleware/group-auth";
import { jsonResponse, emptyResponse, corsHeaders } from "../middleware/cors";

interface D1GroupPhotoRow {
  id: string;
  pin_id: string;
  hlc_physical: number;
  hlc_logical: number;
  is_deleted: number;
  encrypted_meta: string;
  meta_iv: string;
  key_version: number;
}

function getOrigin(request: Request): string | null {
  return request.headers.get("Origin");
}

// ---------------------------------------------------------------------------
// GET /photos/list/:pinId
// ---------------------------------------------------------------------------
async function handleGetPhotoList(
  request: Request,
  env: Env,
  groupId: string,
  pinId: string
): Promise<Response> {
  const origin = getOrigin(request);
  const auth = await requireGroupMember(request, env, groupId);
  if (auth instanceof Response) return auth;

  const rows = await env.DB.prepare(
    `SELECT id, pin_id, hlc_physical, hlc_logical, is_deleted, encrypted_meta, meta_iv, key_version
     FROM group_photos_sync
     WHERE group_id = ? AND pin_id = ? AND is_deleted = 0
     ORDER BY hlc_physical ASC, hlc_logical ASC`
  )
    .bind(groupId, pinId)
    .all<D1GroupPhotoRow>();

  const photos = (rows.results ?? []).map((r) => ({
    id: r.id,
    hlcPhysical: r.hlc_physical,
    hlcLogical: r.hlc_logical,
    isDeleted: r.is_deleted === 1,
    encryptedMeta: r.encrypted_meta,
    metaIv: r.meta_iv,
    keyVersion: r.key_version,
  }));

  return jsonResponse({ photos }, 200, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// PUT /photos/:photoId  (multipart/form-data: meta + blob)
// ---------------------------------------------------------------------------
async function handlePutPhoto(
  request: Request,
  env: Env,
  groupId: string,
  photoId: string
): Promise<Response> {
  const origin = getOrigin(request);
  const auth = await requireGroupMember(request, env, groupId);
  if (auth instanceof Response) return auth;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse({ error: "Invalid multipart/form-data" }, 400, origin, env.CORS_ORIGIN);
  }

  const metaField = formData.get("meta");
  const blobField = formData.get("blob");

  if (typeof metaField !== "string") {
    return jsonResponse(
      { error: "meta field (JSON string) required" },
      400,
      origin,
      env.CORS_ORIGIN
    );
  }
  if (blobField === null || typeof blobField === "string") {
    return jsonResponse({ error: "blob field (binary) required" }, 400, origin, env.CORS_ORIGIN);
  }

  let meta: {
    encryptedMeta: string;
    metaIv: string;
    pinId: string;
    keyVersion: number;
    hlcPhysical: number;
    hlcLogical: number;
    hlcNodeId: string;
  };
  try {
    meta = JSON.parse(metaField) as typeof meta;
  } catch {
    return jsonResponse({ error: "meta must be valid JSON" }, 400, origin, env.CORS_ORIGIN);
  }

  if (
    typeof meta.encryptedMeta !== "string" ||
    typeof meta.metaIv !== "string" ||
    typeof meta.pinId !== "string" ||
    typeof meta.keyVersion !== "number" ||
    typeof meta.hlcPhysical !== "number" ||
    typeof meta.hlcLogical !== "number" ||
    typeof meta.hlcNodeId !== "string"
  ) {
    return jsonResponse({ error: "meta fields incomplete" }, 400, origin, env.CORS_ORIGIN);
  }

  const blobEntry = blobField as File;
  const blobArrayBuffer = await blobEntry.arrayBuffer();
  const r2Key = `group-photos/${groupId}/${photoId}.enc`;
  await env.PHOTOS.put(r2Key, blobArrayBuffer);

  const now = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO group_photos_sync
       (id, group_id, pin_id, author_id, key_version, encrypted_meta, meta_iv, r2_key,
        size_bytes, hlc_physical, hlc_logical, hlc_node_id, is_deleted, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
     ON CONFLICT(id, group_id) DO UPDATE SET
       pin_id = excluded.pin_id,
       encrypted_meta = excluded.encrypted_meta,
       meta_iv = excluded.meta_iv,
       r2_key = excluded.r2_key,
       size_bytes = excluded.size_bytes,
       key_version = excluded.key_version,
       hlc_physical = excluded.hlc_physical,
       hlc_logical = excluded.hlc_logical,
       hlc_node_id = excluded.hlc_node_id,
       is_deleted = 0`
  )
    .bind(
      photoId,
      groupId,
      meta.pinId,
      auth.userId,
      meta.keyVersion,
      meta.encryptedMeta,
      meta.metaIv,
      r2Key,
      blobArrayBuffer.byteLength,
      meta.hlcPhysical,
      meta.hlcLogical,
      meta.hlcNodeId,
      now
    )
    .run();

  return jsonResponse({ ok: true }, 200, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// GET /photos/:photoId
// ---------------------------------------------------------------------------
async function handleGetPhoto(
  request: Request,
  env: Env,
  groupId: string,
  photoId: string
): Promise<Response> {
  const origin = getOrigin(request);
  const auth = await requireGroupMember(request, env, groupId);
  if (auth instanceof Response) return auth;

  const row = await env.DB.prepare(
    `SELECT r2_key FROM group_photos_sync WHERE id = ? AND group_id = ? AND is_deleted = 0`
  )
    .bind(photoId, groupId)
    .first<{ r2_key: string }>();

  if (!row) return jsonResponse({ error: "Photo not found" }, 404, origin, env.CORS_ORIGIN);

  const obj = await env.PHOTOS.get(row.r2_key);
  if (!obj) {
    return jsonResponse({ error: "Photo not found in storage" }, 404, origin, env.CORS_ORIGIN);
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/octet-stream",
    ...corsHeaders(origin, env.CORS_ORIGIN),
  };
  if (obj.etag) headers["ETag"] = obj.etag;

  return new Response(obj.body, { status: 200, headers });
}

// ---------------------------------------------------------------------------
// DELETE /photos/:photoId
// ---------------------------------------------------------------------------
async function handleDeletePhoto(
  request: Request,
  env: Env,
  groupId: string,
  photoId: string
): Promise<Response> {
  const origin = getOrigin(request);
  const auth = await requireGroupMember(request, env, groupId);
  if (auth instanceof Response) return auth;

  // 著者またはオーナーのみ削除可能
  const row = await env.DB.prepare(
    `SELECT gp.author_id, gm.role
     FROM group_photos_sync gp
     JOIN group_memberships gm ON gm.group_id = gp.group_id AND gm.user_id = ?
     WHERE gp.id = ? AND gp.group_id = ?`
  )
    .bind(auth.userId, photoId, groupId)
    .first<{ author_id: string; role: string }>();

  if (!row) return jsonResponse({ error: "Photo not found" }, 404, origin, env.CORS_ORIGIN);
  if (row.author_id !== auth.userId && row.role !== "owner") {
    return jsonResponse({ error: "forbidden" }, 403, origin, env.CORS_ORIGIN);
  }

  const r2Key = `group-photos/${groupId}/${photoId}.enc`;
  await env.DB.prepare(`UPDATE group_photos_sync SET is_deleted = 1 WHERE id = ? AND group_id = ?`)
    .bind(photoId, groupId)
    .run();
  await env.PHOTOS.delete(r2Key);

  return emptyResponse(204, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// ルーター
// ---------------------------------------------------------------------------
export async function handleGroupPhotos(
  request: Request,
  env: Env,
  groupId: string,
  subPath: string
): Promise<Response> {
  const method = request.method;
  const origin = getOrigin(request);

  // GET /photos/list/:pinId
  const listMatch = subPath.match(/^\/list\/([^/]+)$/);
  if (listMatch && method === "GET") {
    return handleGetPhotoList(request, env, groupId, listMatch[1]!);
  }

  // PUT | GET | DELETE /photos/:photoId
  const photoMatch = subPath.match(/^\/([^/]+)$/);
  if (photoMatch) {
    const photoId = photoMatch[1]!;
    if (method === "PUT") return handlePutPhoto(request, env, groupId, photoId);
    if (method === "GET") return handleGetPhoto(request, env, groupId, photoId);
    if (method === "DELETE") return handleDeletePhoto(request, env, groupId, photoId);
  }

  return jsonResponse({ error: "Not Found" }, 404, origin, env.CORS_ORIGIN);
}
