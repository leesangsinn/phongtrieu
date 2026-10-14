import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * Bảo vệ khu vực quản trị và các API nhạy cảm:
 *  - Trang /admin/*            (trừ /admin/login)  -> chưa đăng nhập: chuyển tới /admin/login
 *  - /api/batches/*            (mọi phương thức, gồm export)  -> 401
 *  - GET /api/leads/*          (danh sách khách hàng)  -> 401
 *
 * Công khai: POST /api/leads/* (form liên hệ, đăng ký đại lý), /api/verify/*, /api/admin/login.
 * Mỗi route handler nhạy cảm còn tự kiểm tra lại bằng requireAdmin() (phòng thủ nhiều lớp).
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isLoginPage = pathname === "/admin/login";
  const isBatchApi = pathname === "/api/batches" || pathname.startsWith("/api/batches/");
  const isLeadsRead = pathname.startsWith("/api/leads/") && req.method === "GET";

  const needsAuth = (isAdminPage && !isLoginPage) || isBatchApi || isLeadsRead;
  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (await verifySessionToken(token)) {
    const res = NextResponse.next();
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  if (isAdminPage) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.json(
    { success: false, message: "Chưa đăng nhập hoặc phiên làm việc đã hết hạn." },
    { status: 401, headers: { "Cache-Control": "no-store" } }
  );
}

export const config = {
  matcher: ["/admin/:path*", "/api/batches/:path*", "/api/leads/:path*"],
};
