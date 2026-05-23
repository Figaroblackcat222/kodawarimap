/**
 * JWT ユーティリティ（Web Crypto API / SubtleCrypto のみ使用）
 * アルゴリズム: HS256 (HMAC-SHA256)
 */

function base64UrlEncode(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let str = "";
  for (const b of bytes) {
    str += String.fromCharCode(b);
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(s: string): Uint8Array {
  // Restore standard base64 padding
  const padded = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4;
  const b64 = pad === 0 ? padded : padded + "====".slice(pad);
  const raw = atob(b64);
  const buf = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    buf[i] = raw.charCodeAt(i);
  }
  return buf;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * JWT を生成する。
 * payload に sub（userId）・iat・exp を自動付与する。
 */
export async function signJwt(
  payload: Record<string, unknown>,
  secret: string,
  expiresInSeconds: number
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const claims: Record<string, unknown> = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const header = { alg: "HS256", typ: "JWT" };
  const enc = new TextEncoder();

  const headerB64 = base64UrlEncode(enc.encode(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(enc.encode(JSON.stringify(claims)));
  const signingInput = `${headerB64}.${payloadB64}`;

  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(signingInput));

  return `${signingInput}.${base64UrlEncode(signature)}`;
}

/**
 * JWT を検証する。
 * 署名検証・有効期限チェックを行い、有効なら payload を返す。
 * 無効なら null を返す。
 */
export async function verifyJwt(
  token: string,
  secret: string
): Promise<Record<string, unknown> | null> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const [headerB64, payloadB64, sigB64] = parts as [string, string, string];
  const signingInput = `${headerB64}.${payloadB64}`;

  // 署名検証
  const enc = new TextEncoder();
  const key = await importHmacKey(secret);
  const expectedSig = base64UrlDecode(sigB64);

  let valid: boolean;
  try {
    valid = await crypto.subtle.verify("HMAC", key, expectedSig, enc.encode(signingInput));
  } catch {
    return null;
  }

  if (!valid) {
    return null;
  }

  // ペイロードのデコードと有効期限チェック
  let claims: Record<string, unknown>;
  try {
    const decoded = new TextDecoder().decode(base64UrlDecode(payloadB64));
    claims = JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  if (typeof claims["exp"] === "number" && claims["exp"] < now) {
    return null;
  }

  return claims;
}
