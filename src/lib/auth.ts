/**
 * Xác thực phiên quản trị bằng token ký HMAC-SHA256 (Web Crypto).
 * Chỉ dùng API có sẵn ở cả Node.js lẫn Edge runtime để middleware dùng chung được.
 *
 * Định dạng token:  base64url(JSON payload) . base64url(HMAC-SHA256(payload))
 * payload = { u: tên đăng nhập, iat: thời điểm cấp (giây), exp: hết hạn (giây) }
 */

export const SESSION_COOKIE = "pt_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 ngày

const MIN_SECRET_LENGTH = 32;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

export interface AuthConfig {
  user: string;
  pass: string;
  secret: string;
}

/**
 * Đọc cấu hình quản trị từ biến môi trường. Trả về null nếu thiếu hoặc không hợp lệ
 * (không có giá trị mặc định nào trong mã nguồn).
 */
export function getAuthConfig(): AuthConfig | null {
  const user = process.env.ADMIN_USER?.trim();
  const pass = process.env.ADMIN_PASS;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!user || !pass || !secret || secret.length < MIN_SECRET_LENGTH) {
    return null;
  }
  return { user, pass, secret };
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> | null {
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
    const binary = atob(padded);
    const bytes = new Uint8Array(new ArrayBuffer(binary.length));
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/** Tạo token phiên đã ký cho người dùng quản trị. */
export async function createSessionToken(user: string, secret: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload = toBase64Url(
    encoder.encode(JSON.stringify({ u: user, iat: now, exp: now + SESSION_MAX_AGE }))
  );
  const key = await importKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
}

/**
 * Kiểm tra chữ ký (so sánh thời gian không đổi), thời hạn và tên người dùng.
 * Trả về true chỉ khi token hợp lệ.
 */
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  const config = getAuthConfig();
  if (!config || !token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;

  const signatureBytes = fromBase64Url(signature);
  if (!signatureBytes) return false;

  const key = await importKey(config.secret);
  const valid = await crypto.subtle.verify("HMAC", key, signatureBytes, encoder.encode(payload));
  if (!valid) return false;

  const payloadBytes = fromBase64Url(payload);
  if (!payloadBytes) return false;

  try {
    const data = JSON.parse(decoder.decode(payloadBytes)) as { u?: unknown; exp?: unknown };
    if (typeof data.u !== "string" || typeof data.exp !== "number") return false;
    if (data.u !== config.user) return false; // đổi ADMIN_USER sẽ vô hiệu hóa phiên cũ
    return data.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
