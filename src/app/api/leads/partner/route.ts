import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Partner } from "@/models/Partner";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, phone, type, city, note } = body;

    if (!name?.trim() || !phone?.trim() || !type?.trim() || !city?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Vui lòng điền đầy đủ họ tên, số điện thoại, hình thức hợp tác và tỉnh/thành phố.",
        },
        { status: 400 }
      );
    }

    const newPartner = await Partner.create({
      name: name.trim(),
      phone: phone.trim(),
      type: type.trim(),
      city: city.trim(),
      note: note?.trim() || "",
      status: "pending",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Đăng ký đối tác thành công. Phong Triều sẽ sớm liên hệ tới bạn!",
        data: newPartner,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Lỗi khi lưu thông tin đối tác:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Đã xảy ra lỗi máy chủ khi lưu thông tin đối tác.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const partners = await Partner.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: partners,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Lỗi khi lấy danh sách đối tác:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Đã xảy ra lỗi máy chủ khi tải danh sách đối tác.",
      },
      { status: 500 }
    );
  }
}
