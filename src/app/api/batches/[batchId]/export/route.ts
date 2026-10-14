import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import ExcelJS from "exceljs";
import { connectDB } from "@/lib/db";
import { Batch } from "@/models/Batch";
import { QRCode } from "@/models/QRCode";

interface RouteParams {
  params: {
    batchId: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
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

    // Base URL for verification link
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      batch.websiteUrl ||
      "https://phongtrieu.com";
    const cleanBaseUrl = baseUrl.replace(/\/+$/, "");

    // Create Excel Workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Nước Mắm Truyền Thống Phong Triều";
    workbook.lastModifiedBy = "Phong Triều Admin";
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet = workbook.addWorksheet(`Lô ${batch.batchCode}`, {
      views: [{ showGridLines: true }],
      properties: { defaultRowHeight: 22 },
    });

    // Define Columns according to specification:
    // [STT, Mã Lô, Dòng Sản Phẩm, Dung Tích, Mã UUID, Link Xác Minh]
    worksheet.columns = [
      { header: "STT", key: "stt", width: 8 },
      { header: "Mã Lô", key: "batchCode", width: 22 },
      { header: "Dòng Sản Phẩm", key: "productLine", width: 22 },
      { header: "Dung Tích", key: "volume", width: 14 },
      { header: "Mã UUID", key: "codeId", width: 42 },
      { header: "Link Xác Minh", key: "verifyUrl", width: 65 },
    ];

    // Style the header row (Row 1)
    const headerRow = worksheet.getRow(1);
    headerRow.height = 30;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF8C3A21" }, // Phong Triều Brand Maroon / Nâu đỏ cánh gián
      };
      cell.font = {
        name: "Calibri",
        size: 11,
        bold: true,
        color: { argb: "FFFFFFFF" },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FFE0D5C9" } },
        bottom: { style: "medium", color: { argb: "FF4A281C" } },
        left: { style: "thin", color: { argb: "FFE0D5C9" } },
        right: { style: "thin", color: { argb: "FFE0D5C9" } },
      };
    });

    // Populate data rows
    qrCodes.forEach((qr, index) => {
      const verifyUrl = `${cleanBaseUrl}/xac-thuc/${qr.codeId}`;
      const row = worksheet.addRow({
        stt: index + 1,
        batchCode: batch.batchCode,
        productLine: batch.productLine,
        volume: batch.volume,
        codeId: qr.codeId,
        verifyUrl,
      });

      row.height = 24;

      // Align and format row cells
      row.getCell("stt").alignment = { vertical: "middle", horizontal: "center" };
      row.getCell("batchCode").alignment = { vertical: "middle", horizontal: "center" };
      row.getCell("productLine").alignment = { vertical: "middle", horizontal: "center" };
      row.getCell("volume").alignment = { vertical: "middle", horizontal: "center" };
      row.getCell("codeId").alignment = { vertical: "middle", horizontal: "center" };
      row.getCell("verifyUrl").alignment = { vertical: "middle", horizontal: "left" };

      // Optional alternating row color for readability
      if (index % 2 === 1) {
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFBF8F4" }, // Subtle warm cream
          };
        });
      }

      // Add light borders
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FFE8DFD5" } },
          bottom: { style: "thin", color: { argb: "FFE8DFD5" } },
          left: { style: "thin", color: { argb: "FFE8DFD5" } },
          right: { style: "thin", color: { argb: "FFE8DFD5" } },
        };
      });
    });

    // Generate Excel Buffer
    const buffer = await workbook.xlsx.writeBuffer();

    const safeFilename = `PhongTrieu_${batch.batchCode}_${batch.productLine.replace(/\s+/g, "_")}.xlsx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(safeFilename)}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Lỗi khi xuất file Excel:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Đã xảy ra lỗi máy chủ trong quá trình xuất Excel.",
      },
      { status: 500 }
    );
  }
}
