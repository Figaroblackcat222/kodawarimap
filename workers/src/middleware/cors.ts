/**
 * CORS ヘッダーユーティリティ
 */

export function corsHeaders(origin: string | null, allowedOrigin: string): Record<string, string> {
  // 開発環境では localhost も許容する
  const isAllowed =
    origin === allowedOrigin ||
    (origin !== null &&
      (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")));

  const effectiveOrigin = isAllowed && origin !== null ? origin : allowedOrigin;

  return {
    "Access-Control-Allow-Origin": effectiveOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function handleOptions(request: Request, allowedOrigin: string): Response {
  const origin = request.headers.get("Origin");
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin, allowedOrigin),
  });
}

/** JSON レスポンスに CORS ヘッダーを付けて返すヘルパー */
export function jsonResponse(
  body: unknown,
  status: number,
  origin: string | null,
  allowedOrigin: string
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin, allowedOrigin),
    },
  });
}

/** 本文なしのレスポンス（204 など）に CORS ヘッダーを付けて返すヘルパー */
export function emptyResponse(
  status: number,
  origin: string | null,
  allowedOrigin: string
): Response {
  return new Response(null, {
    status,
    headers: corsHeaders(origin, allowedOrigin),
  });
}
