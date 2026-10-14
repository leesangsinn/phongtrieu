import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken, getAuthConfig } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MAX_FIELD_LENGTH = 200;
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_WINDOW_MS = 15 * 60 * 1000;

// Giới hạn đăng nhập sai theo IP. Lưu trong bộ nhớ của từng instance nên chỉ là lớp chặn
// cơ bản trên môi trường serverless; cần mật khẩu mạnh và nên bổ sung giới hạn ở tầng hạ tầng.
const attempts = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/** So sánh chuỗi trong thời gian không đổi (băm SHA-256 để hai bên cùng độ dài). */
function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

function json(body: Record<string, unknown>, status: number, extra?: HeadersInit) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...extra } });
}

export async function POST(req: NextRequest) {
  const config = getAuthConfig();
  if (!config) {
    console.error(
      "[admin/login] Thiếu hoặc sai cấu hình: cần ADMIN_USER, ADMIN_PASS và ADMIN_SESSION_SECRET (tối thiểu 32 ký tự)."
    );
    return json({ success: false, message: "Chức năng quản trị chưa được cấu hình trên máy chủ." }, 503);
  }

  const ip = clientIp(req);
  const now = Date.now();
  const record = attempts.get(ip);
  if (record && record.resetAt > now && record.count >= MAX_FAILED_ATTEMPTS) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return json(
      { success: false, message: "Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ít phút." },
      429,
      { "Retry-After": String(retryAfter) }
    );
  }

  const body = (await req.json().catch(() => null)) as { username?: unknown; password?: unknown } | null;
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!username || !password) {
    return json({ success: false, message: "Vui lòng nhập đầy đủ tài khoản và mật khẩu." }, 400);
  }
  if (username.length > MAX_FIELD_LENGTH || password.length > MAX_FIELD_LENGTH) {
    return json({ success: false, message: "Tài khoản hoặc mật khẩu không chính xác." }, 401);
  }

  // Luôn so sánh cả hai để thời gian phản hồi không tiết lộ tên đăng nhập đúng hay sai
  const userOk = safeEqual(username, config.user);
  const passOk = safeEqual(password, config.pass);

  if (!(userOk && passOk)) {
    const current = record && record.resetAt > now ? record : { count: 0, resetAt: now + LOCK_WINDOW_MS };
    current.count += 1;
    attempts.set(ip, current);
    return json({ success: false, message: "Tài khoản hoặc mật khẩu không chính xác." }, 401);
  }

  attempts.delete(ip);
  const token = await createSessionToken(config.user, config.secret);

  const response = json({ success: true, message: "Đăng nhập thành công!" }, 200);
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}
