import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Batch } from "@/models/Batch";
import { QRCode } from "@/models/QRCode";

export async function GET() {
  try {
    await connectDB();

    const batches = await Batch.find().sort({ createdAt: -1 }).lean();

    if (!batches.length) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const batchIds = batches.map((b) => b._id);

    // Aggregate statistics for each batch: total QR, scanned count, scan interactions
    const stats = await QRCode.aggregate([
      { $match: { batchId: { $in: batchIds } } },
      {
        $group: {
          _id: "$batchId",
          totalQR: { $sum: 1 },
          scannedQR: { $sum: { $cond: ["$isScanned", 1, 0] } },
          totalScans: { $sum: "$scanCount" },
        },
      },
    ]);

    const statsMap = new Map<string, { totalQR: number; scannedQR: number; totalScans: number }>();
    stats.forEach((item) => {
      statsMap.set(item._id.toString(), {
        totalQR: item.totalQR || 0,
        scannedQR: item.scannedQR || 0,
        totalScans: item.totalScans || 0,
      });
    });

    const enrichedBatches = batches.map((batch) => {
      const stat = statsMap.get(batch._id.toString()) || {
        totalQR: 0,
        scannedQR: 0,
        totalScans: 0,
      };
      return {
        ...batch,
        ...stat,
      };
    });

    return NextResponse.json({
      success: true,
      data: enrichedBatches,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Lỗi khi tải danh sách lô hàng:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Đã xảy ra lỗi máy chủ khi tải danh sách lô hàng.",
      },
      { status: 500 }
    );
  }
}
