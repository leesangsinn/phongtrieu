import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Batch } from "@/models/Batch";
import { QRCode } from "@/models/QRCode";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

/** Xóa một lô cùng toàn bộ mã QR của lô đó (dùng khi xuất thử hoặc xuất sai). */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ batchId: string }> }
) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const { batchId } = await params;
    if (!mongoose.Types.ObjectId.isValid(batchId)) {
      return NextResponse.json(
        { success: false, message: "ID lô hàng không hợp lệ." },
        { status: 400 }
      );
    }

    await connectDB();

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy lô hàng (có thể đã được xóa trước đó)." },
        { status: 404 }
      );
    }

    // Xóa mã QR trước để không bao giờ còn mã mồ côi trỏ tới lô đã mất
    const { deletedCount } = await QRCode.deleteMany({ batchId: batch._id });
    await batch.deleteOne();

    return NextResponse.json({
      success: true,
      message: `Đã xóa lô ${batch.batchCode} (${batch.volume}) cùng ${deletedCount} mã QR.`,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Lỗi khi xóa lô:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Đã xảy ra lỗi máy chủ khi xóa lô." },
      { status: 500 }
    );
  }
}
