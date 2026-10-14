import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * Lớp bảo vệ thứ hai ngay trong route handler (bên cạnh middleware).
 * Trả về NextResponse 401 nếu chưa đăng nhập, ngược lại trả về null.
 *
 * Dùng:  const denied = await requireAdmin(req); if (denied) return denied;
 */
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (await verifySessionToken(token)) return null;

  return NextResponse.json(
    { success: false, message: "Chưa đăng nhập hoặc phiên làm việc đã hết hạn." },
    { status: 401, headers: { "Cache-Control": "no-store" } }
  );
}
