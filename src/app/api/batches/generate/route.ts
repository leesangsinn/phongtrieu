import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "@/lib/db";
import { Batch, ProductLine, Volume } from "@/models/Batch";
import { QRCode } from "@/models/QRCode";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      batchCode,
      productLine,
      volume,
      bottlingDate,
      quantity,
      websiteUrl,
      contactPhone,
    } = body;

    // 1. Validation
    if (!batchCode || !productLine || !volume || !bottlingDate || !quantity) {
      return NextResponse.json(
        {
          success: false,
          message: "Vui lòng cung cấp đầy đủ: Mã lô, Dòng sản phẩm, Dung tích, Ngày đóng chai và Số lượng tem.",
        },
        { status: 400 }
      );
    }

    const validLines: ProductLine[] = ["Di Sản", "Thanh Vị", "Dưỡng Vị"];
    if (!validLines.includes(productLine as ProductLine)) {
      return NextResponse.json(
        {
          success: false,
          message: `Dòng sản phẩm không hợp lệ. Chọn một trong: ${validLines.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const validVolumes: Volume[] = ["500ml", "300ml", "100ml", "60ml", "30ml"];
    if (!validVolumes.includes(volume as Volume)) {
      return NextResponse.json(
        {
          success: false,
          message: `Dung tích không hợp lệ. Chọn một trong: ${validVolumes.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const parsedQty = parseInt(quantity, 10);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Số lượng tem cần in phải là số nguyên dương lớn hơn 0.",
        },
        { status: 400 }
      );
    }

    if (parsedQty > 10000) {
      return NextResponse.json(
        {
          success: false,
          message: "Số lượng tem mỗi lần tạo tối đa là 10.000 để đảm bảo hiệu năng máy chủ.",
        },
        { status: 400 }
      );
    }

    // 2. Check if batchCode already exists
    const normalizedBatchCode = String(batchCode).trim().toUpperCase();
    const existingBatch = await Batch.findOne({ batchCode: normalizedBatchCode });
    if (existingBatch) {
      return NextResponse.json(
        {
          success: false,
          message: `Mã lô sản xuất "${normalizedBatchCode}" đã tồn tại. Vui lòng chọn mã lô khác.`,
        },
        { status: 400 }
      );
    }

    // 3. Create Batch
    const newBatch = await Batch.create({
      batchCode: normalizedBatchCode,
      productLine,
      volume,
      bottlingDate: new Date(bottlingDate),
      websiteUrl: websiteUrl?.trim() || "https://phongtrieu.com",
      contactPhone: contactPhone?.trim() || "0979425607",
    });

    // 4. Generate QRCode records with UUID v4
    const qrRecords = new Array(parsedQty);
    for (let i = 0; i < parsedQty; i++) {
      qrRecords[i] = {
        codeId: uuidv4(),
        batchId: newBatch._id,
        scanCount: 0,
        isScanned: false,
      };
    }

    // Insert all QR codes in bulk
    await QRCode.insertMany(qrRecords, { ordered: false });

    return NextResponse.json(
      {
        success: true,
        message: `Đã khởi tạo thành công Lô ${newBatch.batchCode} với ${parsedQty} mã QR định danh duy nhất.`,
        data: {
          batch: newBatch,
          quantity: parsedQty,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Lỗi khi tạo lô và sinh mã QR:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Đã xảy ra lỗi máy chủ trong quá trình sinh mã QR.",
      },
      { status: 500 }
    );
  }
}
