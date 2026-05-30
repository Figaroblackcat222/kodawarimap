import type { Env } from "./types";
import { handleOptions, corsHeaders } from "./middleware/cors";
import { handleAuth } from "./routes/auth";
import { handlePins } from "./routes/pins";
import { handlePhotos } from "./routes/photos";
import { handleAdmin } from "./routes/admin";
import { handleWebAuthn } from "./routes/webauthn";

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return handleOptions(request, env.CORS_ORIGIN);
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // ルーティング
    if (path.startsWith("/api/auth/") || path === "/api/account") {
      return handleAuth(request, env, path);
    }

    if (path.startsWith("/api/pins")) {
      return handlePins(request, env, path);
    }

    if (path.startsWith("/api/photos")) {
      return handlePhotos(request, env, path);
    }

    if (path.startsWith("/api/admin")) {
      return handleAdmin(request, env, path);
    }

    if (path.startsWith("/api/webauthn")) {
      return handleWebAuthn(request, env, path);
    }

    const origin = request.headers.get("Origin");
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders(origin, env.CORS_ORIGIN),
      },
    });
  },

  async scheduled(_event: ScheduledEvent, env: Env, _ctx: ExecutionContext): Promise<void> {
    const now = new Date();

    // 期限切れ refresh_token のクリーンアップ（毎日3時）
    await env.DB.prepare(`DELETE FROM refresh_tokens WHERE expires_at < ?`)
      .bind(now.toISOString())
      .run();

    // 論理削除後30日以上経過した photos_sync レコードの物理削除
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const expiredPhotos = await env.DB.prepare(
      `SELECT id, user_id FROM photos_sync WHERE is_deleted = 1 AND created_at < ?`
    )
      .bind(thirtyDaysAgo)
      .all<{ id: string; user_id: string }>();

    for (const row of expiredPhotos.results ?? []) {
      const r2Key = `photos/${row.user_id}/${row.id}.enc`;
      await env.PHOTOS.delete(r2Key).catch(() => {
        // R2 オブジェクトがなくても続行
      });
      await env.DB.prepare(`DELETE FROM photos_sync WHERE id = ? AND user_id = ?`)
        .bind(row.id, row.user_id)
        .run();
    }
  },
};
