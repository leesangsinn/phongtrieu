import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Contact } from "@/models/Contact";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

const STATUSES = ["new", "contacted", "resolved"] as const;
type Status = (typeof STATUSES)[number];
const MAX_NOTE_LENGTH = 1000;

interface RouteParams {
  params: { id: string };
}

function respond(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/**
 * Cập nhật xử lý khách hàng (chỉ admin): đổi trạng thái và/hoặc ghi chú nội bộ.
 * Body: { status?: "new" | "contacted" | "resolved", note?: string }
 */
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return respond({ success: false, message: "Mã khách hàng không hợp lệ." }, 400);
    }

    const body = (await req.json().catch(() => null)) as { status?: unknown; note?: unknown } | null;
    if (!body || typeof body !== "object") {
      return respond({ success: false, message: "Dữ liệu gửi lên không hợp lệ." }, 400);
    }

    const set: Record<string, unknown> = {};
    const now = new Date();

    if (body.status !== undefined) {
      if (typeof body.status !== "string" || !(STATUSES as readonly string[]).includes(body.status)) {
        return respond({ success: false, message: "Trạng thái không hợp lệ." }, 400);
      }
      set.status = body.status as Status;
      set.statusUpdatedAt = now;
    }

    if (body.note !== undefined) {
      if (typeof body.note !== "string") {
        return respond({ success: false, message: "Ghi chú không hợp lệ." }, 400);
      }
      const note = body.note.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "").trim();
      if (note.length > MAX_NOTE_LENGTH) {
        return respond({ success: false, message: `Ghi chú tối đa ${MAX_NOTE_LENGTH} ký tự.` }, 400);
      }
      set.note = note;
    }

    if (Object.keys(set).length === 0) {
      return respond({ success: false, message: "Không có thông tin nào để cập nhật." }, 400);
    }

    await connectDB();

    // Lần đầu chuyển sang "Đã liên hệ"/"Đã xử lý" thì ghi lại thời điểm liên hệ (không ghi đè lần sau)
    const update: Record<string, unknown> = { $set: set };
    if (set.status === "contacted" || set.status === "resolved") {
      update.$min = { contactedAt: now };
      // $min với trường chưa có sẽ đặt giá trị; trường đã có thì giữ mốc sớm hơn
    }

    const updated = await Contact.findByIdAndUpdate(params.id, update, { returnDocument: "after" })
      .select("name phone email contact topic message status emailSent note contactedAt statusUpdatedAt createdAt")
      .lean();

    if (!updated) {
      return respond({ success: false, message: "Không tìm thấy khách hàng." }, 404);
    }

    return respond({ success: true, data: updated });
  } catch (error: unknown) {
    console.error("Lỗi khi cập nhật khách hàng liên hệ:", error);
    return respond({ success: false, message: "Đã xảy ra lỗi máy chủ khi cập nhật." }, 500);
  }
}
