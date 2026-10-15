import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Batch } from "@/models/Batch"; // Ensure Batch model is registered for populate
import { QRCode } from "@/models/QRCode";
import { MAX_QR_SCANS } from "@/lib/qr-config";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: {
    codeId: string;
  };
}

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();

    const codeId = params.codeId?.trim();

    if (!codeId) {
      return NextResponse.json(
        {
          success: false,
          message: "Mã định danh sản phẩm không được để trống.",
        },
        { status: 400, headers: NO_STORE }
      );
    }

    // Ghi nhận lượt quét NGUYÊN TỬ: chỉ tăng khi scanCount còn dưới giới hạn, nên dù nhiều người
    // quét cùng lúc cũng không thể vượt quá MAX_QR_SCANS lần thành công.
    const now = new Date();
    const qr = await QRCode.findOneAndUpdate(
      { codeId, scanCount: { $lt: MAX_QR_SCANS } },
      [
        {
          $set: {
            scanCount: { $add: ["$scanCount", 1] },
            isScanned: true,
            lastScannedAt: now,
            firstScannedAt: { $ifNull: ["$firstScannedAt", now] },
            updatedAt: now,
          },
        },
      ],
      // Mongoose 9 yêu cầu bật updatePipeline khi cập nhật bằng aggregation pipeline
      { returnDocument: "after", updatePipeline: true }
    ).populate({
      path: "batchId",
      model: Batch,
      // Chỉ trả các trường cần hiển thị cho người mua
      select: "batchCode productLine volume bottlingDate websiteUrl contactPhone",
    });

    if (!qr) {
      // Không cập nhật được: hoặc mã không tồn tại, hoặc đã hết lượt quét
      const exists = await QRCode.exists({ codeId });

      if (!exists) {
        return NextResponse.json(
          {
            success: false,
            isAuthentic: false,
            message: "Cảnh báo: Mã tem này không tồn tại trong hệ thống chính hãng của Phong Triều.",
          },
          { status: 404, headers: NO_STORE }
        );
      }

      return NextResponse.json(
        {
          success: false,
          code: "SCAN_LIMIT_EXCEEDED",
          scanLimitReached: true,
          maxScans: MAX_QR_SCANS,
          message: `Mã QR này đã được quét tối đa ${MAX_QR_SCANS} lần nên không thể xác thực thêm. Nếu đây là lần đầu bạn quét tem trên sản phẩm của mình, sản phẩm có thể không phải hàng chính hãng hoặc mã tem đã bị sao chép. Vui lòng liên hệ hotline 0979 425 607 để được hỗ trợ.`,
        },
        { status: 403, headers: NO_STORE }
      );
    }

    const isFirstTime = qr.scanCount === 1;
    const remaining = MAX_QR_SCANS - qr.scanCount;

    let message: string;
    if (isFirstTime) {
      message = "Chúc mừng! Đây là lần đầu tiên mã sản phẩm này được quét xác thực.";
    } else {
      message = `Lưu ý: Mã này đã được quét ${qr.scanCount}/${MAX_QR_SCANS} lần.`;
      if (remaining === 0) {
        message += " Đây là lần quét cuối cùng, các lần sau mã sẽ bị từ chối.";
      }
    }

    return NextResponse.json(
      {
        success: true,
        isAuthentic: true,
        message,
        data: {
          codeId: qr.codeId,
          scanCount: qr.scanCount,
          maxScans: MAX_QR_SCANS,
          remainingScans: remaining,
          isFirstScan: isFirstTime,
          firstScannedAt: qr.firstScannedAt,
          lastScannedAt: qr.lastScannedAt,
          batch: qr.batchId,
        },
      },
      { headers: NO_STORE }
    );
  } catch (error: unknown) {
    console.error("Lỗi khi xác thực mã QR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Đã xảy ra lỗi máy chủ trong quá trình xác thực. Vui lòng thử lại sau.",
      },
      { status: 500, headers: NO_STORE }
    );
  }
}
