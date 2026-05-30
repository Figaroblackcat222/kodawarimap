import type { Env } from "./types";
import { handleOptions, corsHeaders } from "./middleware/cors";
import { handleAuth } from "./routes/auth";
import { handlePins } from "./routes/pins";
import { handlePhotos } from "./routes/photos";
import { handleAdmin } from "./routes/admin";
import { handleWebAuthn } from "./routes/webauthn";
import { handleKeys } from "./routes/keys";
import { handleGroups } from "./routes/groups";
import { handleGroupPins } from "./routes/group-pins";
import { handleGroupPhotos } from "./routes/group-photos";

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return handleOptions(request, env.CORS_ORIGIN);
    }

    const origin = request.headers.get("Origin");

    // 全レスポンスに CORS ヘッダーを後付けするヘルパー（auth ミドルウェアの 401/403 を含む）
    const applyCors = (res: Response): Response => {
      const h = new Headers(res.headers);
      for (const [k, v] of Object.entries(corsHeaders(origin, env.CORS_ORIGIN))) h.set(k, v);
      return new Response(res.body, { status: res.status, headers: h });
    };

    const url = new URL(request.url);
    const path = url.pathname;

    // ルーティング
    if (path.startsWith("/api/auth/") || path === "/api/account") {
      return applyCors(await handleAuth(request, env, path));
    }

    if (path.startsWith("/api/pins")) {
      return applyCors(await handlePins(request, env, path));
    }

    if (path.startsWith("/api/photos")) {
      return applyCors(await handlePhotos(request, env, path));
    }

    if (path.startsWith("/api/admin")) {
      return applyCors(await handleAdmin(request, env, path));
    }

    if (path.startsWith("/api/webauthn")) {
      return applyCors(await handleWebAuthn(request, env, path));
    }

    if (path.startsWith("/api/keys")) {
      return applyCors(await handleKeys(request, env, path));
    }

    if (path.startsWith("/api/groups")) {
      // /api/groups/:id/pins/* は group-pins ハンドラに委譲
      const groupPinsMatch = path.match(/^\/api\/groups\/([^/]+)(\/pins.*)$/);
      if (groupPinsMatch) {
        return applyCors(
          await handleGroupPins(request, env, groupPinsMatch[1]!, groupPinsMatch[2]!)
        );
      }
      // /api/groups/:id/photos/* は group-photos ハンドラに委譲
      const groupPhotosMatch = path.match(/^\/api\/groups\/([^/]+)(\/photos.*)$/);
      if (groupPhotosMatch) {
        return applyCors(
          await handleGroupPhotos(request, env, groupPhotosMatch[1]!, groupPhotosMatch[2]!)
        );
      }
      return applyCors(await handleGroups(request, env, path));
    }

    return applyCors(
      new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    );
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
      await env.PHOTOS.delete(r2Key).catch(() => {});
      await env.DB.prepare(`DELETE FROM photos_sync WHERE id = ? AND user_id = ?`)
        .bind(row.id, row.user_id)
        .run();
    }

    // 論理削除後30日以上経過した group_photos_sync レコードの物理削除
    const expiredGroupPhotos = await env.DB.prepare(
      `SELECT id, group_id FROM group_photos_sync WHERE is_deleted = 1 AND created_at < ?`
    )
      .bind(thirtyDaysAgo)
      .all<{ id: string; group_id: string }>();

    for (const row of expiredGroupPhotos.results ?? []) {
      const r2Key = `group-photos/${row.group_id}/${row.id}.enc`;
      await env.PHOTOS.delete(r2Key).catch(() => {});
      await env.DB.prepare(`DELETE FROM group_photos_sync WHERE id = ? AND group_id = ?`)
        .bind(row.id, row.group_id)
        .run();
    }
  },
};
