"use client";

import React, { useEffect, useState } from "react";
import { QrCode, Download, Globe, AlertCircle, Printer } from "lucide-react";

const PNG_SIZES = [
  { value: 600, label: "600 px – xem trên màn hình" },
  { value: 1200, label: "1200 px – in tem nhỏ" },
  { value: 2400, label: "2400 px – in khổ vừa" },
  { value: 4000, label: "4000 px – in khổ lớn (banner, poster)" },
];

export default function AdminLandingQRPage() {
  const [size, setSize] = useState<number>(2400);
  const [targetUrl, setTargetUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [previewReady, setPreviewReady] = useState(false);

  // Lấy link đích thực tế từ máy chủ để Sale kiểm tra trước khi gửi xưởng in.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/landing-qr?format=svg&size=256", { cache: "no-store" });
        if (!res.ok) {
          const json = await res.json().catch(() => null);
          setError(json?.message || "Không tạo được mã QR.");
          return;
        }
        setTargetUrl(res.headers.get("X-QR-Target") || "");
        setPreviewReady(true);
      } catch {
        setError("Không kết nối được máy chủ.");
      }
    })();
  }, []);

  const pngHref = `/api/landing-qr?format=png&size=${size}&download=1`;
  const svgHref = `/api/landing-qr?format=svg&size=1024&download=1`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#2C1A14] flex items-center gap-2.5">
          <QrCode className="text-[#7A0221]" size={28} />
          Mã QR Trang Web
        </h1>
        <p className="text-sm text-[#6B5B50] mt-1.5">
          Tải mã QR dẫn tới landing page để gửi xưởng in ấn (tem, hộp, poster, danh thiếp...).
        </p>
      </div>

      {error ? (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[320px_1fr]">
          <div className="rounded-2xl border border-[#EADFCF] bg-white p-5 shadow-sm flex items-center justify-center">
            {previewReady ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/api/landing-qr?format=png&size=600"
                alt="Mã QR trang landing page"
                width={280}
                height={280}
                className="w-full max-w-[280px] h-auto"
              />
            ) : (
              <div className="w-12 h-12 rounded-full border-4 border-[#7A0221]/20 border-t-[#7A0221] animate-spin" />
            )}
          </div>

          <div className="rounded-2xl border border-[#EADFCF] bg-white p-5 shadow-sm space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#A8988C] mb-1.5">
                Quét mã sẽ dẫn tới
              </p>
              <p className="flex items-center gap-2 text-sm font-semibold text-[#2C1A14] break-all">
                <Globe size={16} className="text-[#7A0221] shrink-0" />
                {targetUrl || "..."}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-[#2C1A14]">
                1. Bản vector SVG <span className="text-emerald-700">(khuyên dùng cho xưởng in)</span>
              </p>
              <p className="text-xs text-[#6B5B50]">
                Phóng to bao nhiêu cũng sắc nét, xưởng in mở được bằng Illustrator, CorelDRAW.
              </p>
              <a
                href={svgHref}
                download
                className="inline-flex items-center gap-2 rounded-xl bg-[#7A0221] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5A0119] transition"
              >
                <Download size={16} /> Tải file SVG
              </a>
            </div>

            <hr className="border-[#EADFCF]" />

            <div className="space-y-3">
              <p className="text-sm font-semibold text-[#2C1A14]">2. Ảnh PNG</p>
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full rounded-xl border border-[#EADFCF] bg-[#FCF9F2] px-3 py-2.5 text-sm"
              >
                {PNG_SIZES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <a
                href={pngHref}
                download
                className="inline-flex items-center gap-2 rounded-xl border border-[#7A0221] px-4 py-2.5 text-sm font-semibold text-[#7A0221] hover:bg-[#7A0221]/5 transition"
              >
                <Download size={16} /> Tải ảnh PNG
              </a>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl bg-[#FCF9F2] p-3.5 text-xs text-[#6B5B50]">
              <Printer size={16} className="mt-0.5 shrink-0 text-[#7A0221]" />
              <span>
                Khi in, giữ nguyên viền trắng quanh mã, không đổi màu nền/mã và in tối thiểu 2×2 cm.
                Nên in thử một bản và quét kiểm tra trước khi in số lượng lớn.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
