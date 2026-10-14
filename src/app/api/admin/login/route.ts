import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const validUser = process.env.ADMIN_USER || "admin";
    const validPass = process.env.ADMIN_PASS || "phongtrieu2026";

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập đầy đủ tài khoản và mật khẩu." },
        { status: 400 }
      );
    }

    if (username.trim() === validUser && password === validPass) {
      // Mock auth token
      const token = `pt_admin_${Date.now()}_auth_session`;

      const response = NextResponse.json({
        success: true,
        message: "Đăng nhập thành công!",
        token,
      });

      // Set cookie for 7 days
      response.cookies.set("pt_admin_token", token, {
        httpOnly: false, // Allow client JS access
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Tài khoản hoặc mật khẩu không chính xác." },
      { status: 401 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: err.message || "Lỗi máy chủ khi đăng nhập." },
      { status: 500 }
    );
  }
}
