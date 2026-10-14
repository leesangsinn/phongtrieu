import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ExcelJS from "exceljs";
import { ZipArchive } from "archiver";
import QRCode_ from "qrcode";
import { PassThrough, Readable } from "stream";
import { connectDB } from "@/lib/db";
import { Batch } from "@/models/Batch";
import { QRCode } from "@/models/QRCode";
import { requireAdmin } from "@/lib/require-admin";
import { getAppUrl } from "@/lib/app-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface RouteParams {
  params: {
    batchId: string;
  };
}

/** Chỉ giữ ký tự an toàn cho tên file/sheet (mã lô do người dùng nhập, tránh "/" hoặc ".." trong ZIP). */
function safeName(value: string): string {
  return String(value).replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^\.+/, "_") || "LO";
}

interface ExportRow {
  stt: number;
  codeId: string;
  fileName: string;
  verifyUrl: string;
}

async function buildExcel(
  batchCode: string,
  productLine: string,
  volume: string,
  rows: ExportRow[]
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Nước Mắm Truyền Thống Phong Triều";
  workbook.created = new Date();

  const ws = workbook.addWorksheet(`Lô ${safeName(batchCode)}`.slice(0, 31));
  ws.columns = [
    { header: "STT", key: "stt", width: 8 },
    { header: "Mã Lô", key: "batchCode", width: 22 },
    { header: "Dòng Sản Phẩm", key: "productLine", width: 22 },
    { header: "Dung Tích", key: "volume", width: 14 },
    { header: "Tên File Ảnh QR", key: "fileName", width: 36 },
  ];

  const headerRow = ws.getRow(1);
  headerRow.height = 30;
  headerRow.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF8C3A21" } };
    cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  // File Excel gửi nhà in chỉ có thông tin cần để in và xếp tem. Mã UUID và link xác minh
  // KHÔNG đưa vào đây (mã nằm sẵn trong ảnh QR; hệ thống tự phát hiện mã bị quét quá giới hạn).
  for (const r of rows) {
    ws.addRow({ stt: r.stt, batchCode, productLine, volume, fileName: r.fileName });
  }

  return Buffer.from(await workbook.xlsx.writeBuffer());
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    await connectDB();

    const { batchId } = params;

    if (!batchId) {
      return NextResponse.json(
        { success: false, message: "Thiếu ID hoặc mã lô hàng." },
        { status: 400 }
      );
    }

    // Support both MongoDB ObjectId and BatchCode string
    let batch = null;
    if (mongoose.Types.ObjectId.isValid(batchId)) {
      batch = await Batch.findById(batchId);
    }
    if (!batch) {
      batch = await Batch.findOne({ batchCode: batchId.toUpperCase() });
    }

    if (!batch) {
      return NextResponse.json(
        { success: false, message: `Không tìm thấy thông tin lô hàng "${batchId}".` },
        { status: 404 }
      );
    }

    // Query all QR codes for this batch
    const qrCodes = await QRCode.find({ batchId: batch._id }).sort({ createdAt: 1 }).lean();

    if (!qrCodes.length) {
      return NextResponse.json(
        { success: false, message: "Lô hàng này chưa có mã QR nào được tạo." },
        { status: 404 }
      );
    }

    // Link xác minh luôn dùng tên miền chính thức từ NEXT_PUBLIC_APP_URL (ném lỗi nếu thiếu)
    const cleanBaseUrl = getAppUrl();

    const total = qrCodes.length;
    const pad = Math.max(String(total).length, 4);
    const rows = qrCodes.map((qr, index) => ({
      stt: index + 1,
      codeId: qr.codeId as string,
      fileName: `${safeName(batch.batchCode)}_${String(index + 1).padStart(pad, "0")}.png`,
      verifyUrl: `${cleanBaseUrl}/xac-thuc/${qr.codeId}`,
    }));

    const excelBuffer = await buildExcel(batch.batchCode, batch.productLine, batch.volume, rows);

    // PNG is already compressed -> store only (level 0) to save CPU on serverless.
    const archive = new ZipArchive({ store: true });
    const output = new PassThrough();
    archive.pipe(output);
    archive.on("warning", (w) => console.warn("archiver warning:", w));
    archive.on("error", (e) => output.destroy(e));

    // Producer: generate one QR at a time, wait until archiver has consumed it
    // (backpressure) so memory stays flat regardless of batch size.
    void (async () => {
      try {
        for (const row of rows) {
          const png = await QRCode_.toBuffer(row.verifyUrl, {
            type: "png",
            width: 300,
            margin: 2,
            errorCorrectionLevel: "M",
          });
          const done = new Promise<void>((resolve) => {
            archive.once("entry", () => resolve());
          });
          archive.append(png, { name: row.fileName });
          await done;
          if (output.destroyed) return; // client aborted
        }
        archive.append(excelBuffer, { name: `DanhSach_${safeName(batch.batchCode)}.xlsx` });
        await archive.finalize();
      } catch (e) {
        console.error("Lỗi khi tạo file ZIP:", e);
        archive.abort();
        output.destroy(e as Error);
      }
    })();

    const safeFilename = `QRCodes_${safeName(batch.batchCode)}.zip`;

    return new NextResponse(Readable.toWeb(output) as unknown as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(safeFilename)}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Lỗi khi xuất file ZIP:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Đã xảy ra lỗi máy chủ trong quá trình xuất file ZIP.",
      },
      { status: 500 }
    );
  }
}
