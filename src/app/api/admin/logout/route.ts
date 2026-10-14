import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: "Đã đăng xuất thành công." },
    { headers: { "Cache-Control": "no-store" } }
  );

  // Xóa cookie phiên, dùng đúng các thuộc tính đã dùng khi tạo
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  // Dọn cookie của phiên bản cũ (không an toàn) nếu trình duyệt còn giữ
  response.cookies.set("pt_admin_token", "", { path: "/", maxAge: 0 });

  return response;
}
