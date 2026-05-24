/**
 * ピン同期ルートハンドラ
 *
 * エンドポイント:
 *   GET  /api/pins/since?physical=<number>&logical=<number>
 *   PUT  /api/pins/:id
 *   DELETE /api/pins/:id
 */
import type { Env } from "../types";
import { requireAuth, requirePro } from "../middleware/auth";
import { jsonResponse, emptyResponse } from "../middleware/cors";
import { computeServerHlc } from "../lib/hlc";

interface PinSyncRecord {
  id: string;
  encryptedPayload: string;
  iv: string;
  hlcPhysical: number;
  hlcLogical: number;
  hlcNodeId: string;
  isDeleted: boolean;
  createdAt: string;
}

interface D1PinRow {
  id: string;
  encrypted_payload: string;
  iv: string;
  hlc_physical: number;
  hlc_logical: number;
  hlc_node_id: string;
  is_deleted: number;
  created_at: string;
}

function getOrigin(request: Request): string | null {
  return request.headers.get("Origin");
}

// ---------------------------------------------------------------------------
// GET /api/pins/since
// ---------------------------------------------------------------------------

async function handleGetPinsSince(request: Request, env: Env): Promise<Response> {
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

  const url = new URL(request.url);
  const physicalParam = url.searchParams.get("physical");
  const logicalParam = url.searchParams.get("logical");

  const physical = physicalParam !== null ? Number(physicalParam) : 0;
  const logical = logicalParam !== null ? Number(logicalParam) : 0;

  if (isNaN(physical) || isNaN(logical)) {
    return jsonResponse(
      { error: "physical and logical must be numbers" },
      400,
      origin,
      env.CORS_ORIGIN
    );
  }

  const rows = await env.DB.prepare(
    `SELECT id, encrypted_payload, iv, hlc_physical, hlc_logical, hlc_node_id, is_deleted, created_at
     FROM pins_sync
     WHERE user_id = ?
       AND (hlc_physical > ? OR (hlc_physical = ? AND hlc_logical > ?))
     ORDER BY hlc_physical ASC, hlc_logical ASC
     LIMIT 1000`
  )
    .bind(userId, physical, physical, logical)
    .all<D1PinRow>();

  const pins: PinSyncRecord[] = (rows.results ?? []).map((r) => ({
    id: r.id,
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

// ---------------------------------------------------------------------------
// PUT /api/pins/:id
// ---------------------------------------------------------------------------

async function handlePutPin(request: Request, env: Env, pinId: string): Promise<Response> {
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, origin, env.CORS_ORIGIN);
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>)["encryptedPayload"] !== "string" ||
    typeof (body as Record<string, unknown>)["iv"] !== "string" ||
    typeof (body as Record<string, unknown>)["hlcPhysical"] !== "number" ||
    typeof (body as Record<string, unknown>)["hlcLogical"] !== "number" ||
    typeof (body as Record<string, unknown>)["hlcNodeId"] !== "string"
  ) {
    return jsonResponse(
      { error: "encryptedPayload, iv, hlcPhysical, hlcLogical, hlcNodeId are required" },
      400,
      origin,
      env.CORS_ORIGIN
    );
  }

  const {
    encryptedPayload,
    iv,
    hlcPhysical,
    hlcLogical,
    hlcNodeId,
    isDeleted = false,
  } = body as {
    encryptedPayload: string;
    iv: string;
    hlcPhysical: number;
    hlcLogical: number;
    hlcNodeId: string;
    isDeleted?: boolean;
  };

  const serverHlc = computeServerHlc(hlcPhysical, hlcLogical);
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO pins_sync (id, user_id, encrypted_payload, iv, hlc_physical, hlc_logical, hlc_node_id, is_deleted, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(id, user_id) DO UPDATE SET
       encrypted_payload = excluded.encrypted_payload,
       iv = excluded.iv,
       hlc_physical = excluded.hlc_physical,
       hlc_logical = excluded.hlc_logical,
       hlc_node_id = excluded.hlc_node_id,
       is_deleted = excluded.is_deleted`
  )
    .bind(
      pinId,
      userId,
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
    { serverHlcPhysical: serverHlc.physical, serverHlcLogical: serverHlc.logical },
    200,
    origin,
    env.CORS_ORIGIN
  );
}

// ---------------------------------------------------------------------------
// DELETE /api/pins/:id  (tombstone)
// ---------------------------------------------------------------------------

async function handleDeletePin(request: Request, env: Env, pinId: string): Promise<Response> {
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

  // 既存レコード確認
  const existing = await env.DB.prepare(
    `SELECT hlc_physical, hlc_logical FROM pins_sync WHERE id = ? AND user_id = ?`
  )
    .bind(pinId, userId)
    .first<{ hlc_physical: number; hlc_logical: number }>();

  if (existing === null) {
    return jsonResponse({ error: "Pin not found" }, 404, origin, env.CORS_ORIGIN);
  }

  const serverHlc = computeServerHlc(existing.hlc_physical, existing.hlc_logical);

  await env.DB.prepare(
    `UPDATE pins_sync SET is_deleted = 1, hlc_physical = ?, hlc_logical = ? WHERE id = ? AND user_id = ?`
  )
    .bind(serverHlc.physical, serverHlc.logical, pinId, userId)
    .run();

  return emptyResponse(204, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// ルーター
// ---------------------------------------------------------------------------

export async function handlePins(request: Request, env: Env, path: string): Promise<Response> {
  const method = request.method;
  const origin = getOrigin(request);

  // GET /api/pins/since
  if (path === "/api/pins/since" && method === "GET") {
    return handleGetPinsSince(request, env);
  }

  // PUT /api/pins/:id
  const pinIdMatch = path.match(/^\/api\/pins\/([^/]+)$/);
  if (pinIdMatch && pinIdMatch[1] !== undefined && method === "PUT") {
    return handlePutPin(request, env, pinIdMatch[1]);
  }

  // DELETE /api/pins/:id
  if (pinIdMatch && pinIdMatch[1] !== undefined && method === "DELETE") {
    return handleDeletePin(request, env, pinIdMatch[1]);
  }

  return jsonResponse({ error: "Not Found" }, 404, origin, env.CORS_ORIGIN);
}

// ---------------------------------------------------------------------------
// 内部ヘルパー
// ---------------------------------------------------------------------------

/** 認証エラーレスポンスのヘッダーをそのまま渡すためのヘルパー */
function corsHeadersFrom(response: Response): Record<string, string> {
  const result: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    if (key.toLowerCase().startsWith("access-control-") || key.toLowerCase() === "vary") {
      result[key] = value;
    }
  });
  return result;
}
