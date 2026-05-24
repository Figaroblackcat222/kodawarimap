/**
 * 写真同期ルートハンドラ
 *
 * エンドポイント:
 *   GET    /api/photos/list/:pinId
 *   PUT    /api/photos/:id   (multipart/form-data: meta + blob)
 *   GET    /api/photos/:id
 *   DELETE /api/photos/:id
 */
import type { Env } from "../types";
import { requireAuth, requirePro } from "../middleware/auth";
import { jsonResponse, emptyResponse, corsHeaders } from "../middleware/cors";

interface D1PhotoRow {
  id: string;
  pin_id: string;
  hlc_physical: number;
  hlc_logical: number;
  is_deleted: number;
  encrypted_meta: string;
  meta_iv: string;
}

interface PhotoListItem {
  id: string;
  hlcPhysical: number;
  hlcLogical: number;
  isDeleted: boolean;
  encryptedMeta: string;
  metaIv: string;
}

function getOrigin(request: Request): string | null {
  return request.headers.get("Origin");
}

/** 認証エラーレスポンスの CORS ヘッダーをそのまま渡すためのヘルパー */
function corsHeadersFrom(response: Response): Record<string, string> {
  const result: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    if (key.toLowerCase().startsWith("access-control-") || key.toLowerCase() === "vary") {
      result[key] = value;
    }
  });
  return result;
}

// ---------------------------------------------------------------------------
// GET /api/photos/list/:pinId
// ---------------------------------------------------------------------------

async function handleGetPhotoList(request: Request, env: Env, pinId: string): Promise<Response> {
  const origin = getOrigin(request);

  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) {
    const body = await authResult.text();
    return new Response(body, {
      status: authResult.status,
      headers: { "Content-Type": "application/json", ...corsHeadersFrom(authResult) },
    });
  }
  const proError = requirePro(authResult);
  if (proError) return proError;
  const { userId } = authResult;

  const rows = await env.DB.prepare(
    `SELECT id, pin_id, hlc_physical, hlc_logical, is_deleted, encrypted_meta, meta_iv
     FROM photos_sync
     WHERE user_id = ? AND pin_id = ? AND is_deleted = 0
     ORDER BY hlc_physical ASC, hlc_logical ASC`
  )
    .bind(userId, pinId)
    .all<D1PhotoRow>();

  const photos: PhotoListItem[] = (rows.results ?? []).map((r) => ({
    id: r.id,
    hlcPhysical: r.hlc_physical,
    hlcLogical: r.hlc_logical,
    isDeleted: r.is_deleted === 1,
    encryptedMeta: r.encrypted_meta,
    metaIv: r.meta_iv,
  }));

  return jsonResponse({ photos }, 200, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// PUT /api/photos/:id  (multipart/form-data: meta + blob)
// ---------------------------------------------------------------------------

async function handlePutPhoto(request: Request, env: Env, photoId: string): Promise<Response> {
  const origin = getOrigin(request);

  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) {
    const body = await authResult.text();
    return new Response(body, {
      status: authResult.status,
      headers: { "Content-Type": "application/json", ...corsHeadersFrom(authResult) },
    });
  }
  const proError = requirePro(authResult);
  if (proError) return proError;
  const { userId } = authResult;

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
      { error: "meta field (JSON string) is required" },
      400,
      origin,
      env.CORS_ORIGIN
    );
  }
  // blobField は File（Blob のサブクラス）であることを確認する
  if (blobField === null || typeof blobField === "string") {
    return jsonResponse({ error: "blob field (binary) is required" }, 400, origin, env.CORS_ORIGIN);
  }
  // FormDataEntryValue から File/Blob として扱えることを確認
  const blobEntry = blobField as File;

  let meta: {
    encryptedMeta: string;
    metaIv: string;
    pinId: string;
    hlcPhysical: number;
    hlcLogical: number;
    hlcNodeId: string;
  };
  try {
    meta = JSON.parse(metaField) as typeof meta;
  } catch {
    return jsonResponse({ error: "meta field must be valid JSON" }, 400, origin, env.CORS_ORIGIN);
  }

  if (
    typeof meta.encryptedMeta !== "string" ||
    typeof meta.metaIv !== "string" ||
    typeof meta.pinId !== "string" ||
    typeof meta.hlcPhysical !== "number" ||
    typeof meta.hlcLogical !== "number" ||
    typeof meta.hlcNodeId !== "string"
  ) {
    return jsonResponse(
      {
        error: "meta must contain encryptedMeta, metaIv, pinId, hlcPhysical, hlcLogical, hlcNodeId",
      },
      400,
      origin,
      env.CORS_ORIGIN
    );
  }

  // R2 にアップロード
  const r2Key = `photos/${userId}/${photoId}.enc`;
  const blobArrayBuffer = await blobEntry.arrayBuffer();
  await env.PHOTOS.put(r2Key, blobArrayBuffer);

  // D1 に UPSERT
  const now = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO photos_sync (id, user_id, pin_id, encrypted_meta, meta_iv, r2_key, size_bytes, hlc_physical, hlc_logical, hlc_node_id, is_deleted, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
     ON CONFLICT(id, user_id) DO UPDATE SET
       pin_id = excluded.pin_id,
       encrypted_meta = excluded.encrypted_meta,
       meta_iv = excluded.meta_iv,
       r2_key = excluded.r2_key,
       size_bytes = excluded.size_bytes,
       hlc_physical = excluded.hlc_physical,
       hlc_logical = excluded.hlc_logical,
       hlc_node_id = excluded.hlc_node_id,
       is_deleted = 0`
  )
    .bind(
      photoId,
      userId,
      meta.pinId,
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
// GET /api/photos/:id
// ---------------------------------------------------------------------------

async function handleGetPhoto(request: Request, env: Env, photoId: string): Promise<Response> {
  const origin = getOrigin(request);

  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) {
    const body = await authResult.text();
    return new Response(body, {
      status: authResult.status,
      headers: { "Content-Type": "application/json", ...corsHeadersFrom(authResult) },
    });
  }
  const proError = requirePro(authResult);
  if (proError) return proError;
  const { userId } = authResult;

  // D1 でレコード存在確認（userId の検証）
  const row = await env.DB.prepare(
    `SELECT r2_key FROM photos_sync WHERE id = ? AND user_id = ? AND is_deleted = 0`
  )
    .bind(photoId, userId)
    .first<{ r2_key: string }>();

  if (row === null) {
    return jsonResponse({ error: "Photo not found" }, 404, origin, env.CORS_ORIGIN);
  }

  const r2Key = `photos/${userId}/${photoId}.enc`;
  const obj = await env.PHOTOS.get(r2Key);

  if (obj === null) {
    return jsonResponse({ error: "Photo not found in storage" }, 404, origin, env.CORS_ORIGIN);
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/octet-stream",
    ...corsHeaders(origin, env.CORS_ORIGIN),
  };
  if (obj.etag) {
    headers["ETag"] = obj.etag;
  }

  return new Response(obj.body, { status: 200, headers });
}

// ---------------------------------------------------------------------------
// DELETE /api/photos/:id
// ---------------------------------------------------------------------------

async function handleDeletePhoto(request: Request, env: Env, photoId: string): Promise<Response> {
  const origin = getOrigin(request);

  const authResult = await requireAuth(request, env);
  if (authResult instanceof Response) {
    const body = await authResult.text();
    return new Response(body, {
      status: authResult.status,
      headers: { "Content-Type": "application/json", ...corsHeadersFrom(authResult) },
    });
  }
  const proError = requirePro(authResult);
  if (proError) return proError;
  const { userId } = authResult;

  // D1 の is_deleted を 1 に更新
  await env.DB.prepare(`UPDATE photos_sync SET is_deleted = 1 WHERE id = ? AND user_id = ?`)
    .bind(photoId, userId)
    .run();

  // R2 から削除
  const r2Key = `photos/${userId}/${photoId}.enc`;
  await env.PHOTOS.delete(r2Key);

  return emptyResponse(204, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// ルーター
// ---------------------------------------------------------------------------

export async function handlePhotos(request: Request, env: Env, path: string): Promise<Response> {
  const method = request.method;
  const origin = getOrigin(request);

  // GET /api/photos/list/:pinId
  const listMatch = path.match(/^\/api\/photos\/list\/([^/]+)$/);
  if (listMatch && listMatch[1] !== undefined && method === "GET") {
    return handleGetPhotoList(request, env, listMatch[1]);
  }

  // PUT /api/photos/:id  (multipart/form-data)
  const photoIdMatch = path.match(/^\/api\/photos\/([^/]+)$/);
  if (photoIdMatch && photoIdMatch[1] !== undefined) {
    if (method === "PUT") {
      return handlePutPhoto(request, env, photoIdMatch[1]);
    }
    if (method === "GET") {
      return handleGetPhoto(request, env, photoIdMatch[1]);
    }
    if (method === "DELETE") {
      return handleDeletePhoto(request, env, photoIdMatch[1]);
    }
  }

  return jsonResponse({ error: "Not Found" }, 404, origin, env.CORS_ORIGIN);
}
