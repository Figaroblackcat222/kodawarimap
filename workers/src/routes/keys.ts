/**
 * 公開鍵管理ルートハンドラ
 *
 * エンドポイント:
 *   PUT /api/keys/public       - 公開鍵 + 秘密鍵バックアップをアップロード
 *   GET /api/keys/public/:uid  - 指定ユーザーの公開鍵を取得（グループ招待時に使用）
 *   GET /api/keys/private-backup - 自分の暗号化済み秘密鍵バックアップを取得
 */
import type { Env } from "../types";
import { requireAuth, requirePro } from "../middleware/auth";
import { jsonResponse, emptyResponse } from "../middleware/cors";

export async function handleKeys(request: Request, env: Env, path: string): Promise<Response> {
  const origin = request.headers.get("Origin");

  // PUT /api/keys/public
  // requirePro は不要: 公開鍵登録はグループ招待フローの前提条件であり、
  // free ユーザー（招待受諾直後）も実行できる必要がある
  if (request.method === "PUT" && path === "/api/keys/public") {
    const auth = await requireAuth(request, env);
    if (auth instanceof Response) return auth;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400, origin, env.CORS_ORIGIN);
    }

    const { publicKey, fingerprint, wrappedPrivateKey, wrappedPrivateKeyIv } = body as Record<
      string,
      unknown
    >;

    if (
      typeof publicKey !== "string" ||
      typeof fingerprint !== "string" ||
      typeof wrappedPrivateKey !== "string" ||
      typeof wrappedPrivateKeyIv !== "string"
    ) {
      return jsonResponse(
        { error: "publicKey, fingerprint, wrappedPrivateKey, wrappedPrivateKeyIv are required" },
        400,
        origin,
        env.CORS_ORIGIN
      );
    }

    const now = new Date().toISOString();
    await env.DB.prepare(
      `INSERT INTO user_public_keys
         (user_id, public_key, fingerprint, wrapped_private_key, wrapped_private_key_iv, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET
         public_key = excluded.public_key,
         fingerprint = excluded.fingerprint,
         wrapped_private_key = excluded.wrapped_private_key,
         wrapped_private_key_iv = excluded.wrapped_private_key_iv,
         updated_at = excluded.updated_at`
    )
      .bind(auth.userId, publicKey, fingerprint, wrappedPrivateKey, wrappedPrivateKeyIv, now, now)
      .run();

    return emptyResponse(204, origin, env.CORS_ORIGIN);
  }

  // GET /api/keys/private-backup
  if (request.method === "GET" && path === "/api/keys/private-backup") {
    const auth = await requireAuth(request, env);
    if (auth instanceof Response) return auth;

    const row = await env.DB.prepare(
      `SELECT wrapped_private_key, wrapped_private_key_iv FROM user_public_keys WHERE user_id = ?`
    )
      .bind(auth.userId)
      .first<{ wrapped_private_key: string | null; wrapped_private_key_iv: string | null }>();

    if (!row || !row.wrapped_private_key || !row.wrapped_private_key_iv) {
      return jsonResponse({ error: "not_found" }, 404, origin, env.CORS_ORIGIN);
    }

    return jsonResponse(
      {
        wrappedPrivateKey: row.wrapped_private_key,
        wrappedPrivateKeyIv: row.wrapped_private_key_iv,
      },
      200,
      origin,
      env.CORS_ORIGIN
    );
  }

  // GET /api/keys/public/:userId
  const publicKeyMatch = path.match(/^\/api\/keys\/public\/([^/]+)$/);
  if (request.method === "GET" && publicKeyMatch) {
    const auth = await requireAuth(request, env);
    if (auth instanceof Response) return auth;
    const denied = requirePro(auth);
    if (denied) return denied;

    const rawId = publicKeyMatch[1];
    const targetUserId = rawId === "me" ? auth.userId : rawId;

    const row = await env.DB.prepare(
      `SELECT public_key, fingerprint FROM user_public_keys WHERE user_id = ?`
    )
      .bind(targetUserId)
      .first<{ public_key: string; fingerprint: string }>();

    if (!row) {
      return jsonResponse({ error: "not_found" }, 404, origin, env.CORS_ORIGIN);
    }

    return jsonResponse(
      { publicKey: row.public_key, fingerprint: row.fingerprint },
      200,
      origin,
      env.CORS_ORIGIN
    );
  }

  return jsonResponse({ error: "Not Found" }, 404, origin, env.CORS_ORIGIN);
}
