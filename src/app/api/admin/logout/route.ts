import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Đã đăng xuất thành công.",
  });

  // Clear cookie
  response.cookies.set("pt_admin_token", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}
