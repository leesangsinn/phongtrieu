import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { requireAdmin } from "@/lib/require-admin";
import { getAppUrl } from "@/lib/app-url";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_SIZE = 256;
const MAX_SIZE = 4000;

/**
 * Sinh mã QR trỏ tới trang landing page (tên miền chính thức) để Sale gửi xưởng in.
 *  GET /api/landing-qr?format=png|svg&size=1200&download=1
 *  - png: ảnh điểm, size = số pixel cạnh (mặc định 1200)
 *  - svg: vector, in khổ nào cũng không vỡ nét
 *  - download=1: trả về dạng tải file, ngược lại hiển thị trực tiếp (dùng cho xem trước)
 */
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const params = req.nextUrl.searchParams;
  const format = params.get("format") === "svg" ? "svg" : "png";
  const rawSize = Number.parseInt(params.get("size") ?? "1200", 10);
  const size = Number.isFinite(rawSize)
    ? Math.min(MAX_SIZE, Math.max(MIN_SIZE, rawSize))
    : 1200;

  let url: string;
  try {
    url = getAppUrl();
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : "Không xác định được tên miền." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  // Mức sửa lỗi cao (H) để mã vẫn quét được khi in nhỏ hoặc bị xước/bẩn.
  const options = {
    errorCorrectionLevel: "H" as const,
    margin: 4,
    color: { dark: "#000000", light: "#FFFFFF" },
  };

  const headers: Record<string, string> = {
    "Cache-Control": "no-store",
    "X-QR-Target": url,
  };
  if (params.get("download") === "1") {
    const filename = format === "svg" ? "qr-landing-page.svg" : `qr-landing-page-${size}px.png`;
    headers["Content-Disposition"] = `attachment; filename="${filename}"`;
  }

  if (format === "svg") {
    const svg = await QRCode.toString(url, { ...options, type: "svg", width: size });
    return new NextResponse(svg, {
      headers: { ...headers, "Content-Type": "image/svg+xml; charset=utf-8" },
    });
  }

  const png = await QRCode.toBuffer(url, { ...options, type: "png", width: size });
  return new NextResponse(new Uint8Array(png), {
    headers: { ...headers, "Content-Type": "image/png" },
  });
}
