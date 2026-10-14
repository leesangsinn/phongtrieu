import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Contact } from "@/models/Contact";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, contact, topic, message } = body;

    if (!name?.trim() || !contact?.trim() || !message?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Vui lòng điền đầy đủ họ tên, thông tin liên hệ và nội dung lời nhắn.",
        },
        { status: 400 }
      );
    }

    const newContact = await Contact.create({
      name: name.trim(),
      contact: contact.trim(),
      topic: topic?.trim() || "Tư vấn sản phẩm",
      message: message.trim(),
      status: "new",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Cảm ơn bạn đã liên hệ với Phong Triều. Chúng tôi sẽ phản hồi sớm nhất!",
        data: newContact,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Lỗi khi lưu thông tin liên hệ:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Đã xảy ra lỗi máy chủ khi lưu liên hệ.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: contacts,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Lỗi khi lấy danh sách liên hệ:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Đã xảy ra lỗi máy chủ khi tải danh sách liên hệ.",
      },
      { status: 500 }
    );
  }
}
