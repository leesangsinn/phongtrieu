import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Batch } from "@/models/Batch"; // Ensure Batch model is registered for populate
import { QRCode } from "@/models/QRCode";

interface RouteParams {
  params: {
    codeId: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const { codeId } = params;

    if (!codeId?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Mã định danh sản phẩm không được để trống.",
        },
        { status: 400 }
      );
    }

    // Find the QR code document
    const qr = await QRCode.findOne({ codeId: codeId.trim() });

    if (!qr) {
      return NextResponse.json(
        {
          success: false,
          isAuthentic: false,
          message: "Cảnh báo: Mã tem này không tồn tại trong hệ thống chính hãng của Phong Triều.",
        },
        { status: 404 }
      );
    }

    const now = new Date();
    const isFirstTime = !qr.isScanned || qr.scanCount === 0;

    // Increment scan count and record scan timestamps
    qr.scanCount += 1;
    qr.lastScannedAt = now;

    if (isFirstTime) {
      qr.isScanned = true;
      qr.firstScannedAt = now;
    }

    await qr.save();

    // Populate Batch information
    await qr.populate({
      path: "batchId",
      model: Batch,
    });

    return NextResponse.json({
      success: true,
      isAuthentic: true,
      message: isFirstTime
        ? "Chúc mừng! Đây là lần đầu tiên mã sản phẩm này được quét xác thực."
        : `Lưu ý: Mã này đã được quét ${qr.scanCount} lần trước đó.`,
      data: {
        codeId: qr.codeId,
        scanCount: qr.scanCount,
        isFirstScan: isFirstTime,
        firstScannedAt: qr.firstScannedAt,
        lastScannedAt: qr.lastScannedAt,
        batch: qr.batchId,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Lỗi khi xác thực mã QR:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Đã xảy ra lỗi máy chủ trong quá trình xác thực.",
      },
      { status: 500 }
    );
  }
}
