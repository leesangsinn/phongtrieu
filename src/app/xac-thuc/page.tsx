"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Search,
  ArrowRight,
  QrCode,
  Award,
} from "lucide-react";

export default function XacThucIndexPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      router.push(`/xac-thuc/${encodeURIComponent(code.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF9F2] text-[#2C1A14] font-epilogue antialiased pb-20 selection:bg-amber-200">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#FCF9F2]/90 backdrop-blur-md border-b border-[#EADFCF]">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#7A0221] flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition">
              PT
            </div>
            <span className="font-playfair font-bold text-lg text-[#7A0221] tracking-tight">
              Phong Triều
            </span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7A6458]">
            <ShieldCheck size={16} className="text-[#7A0221]" />
            <span>Xác Thực Nguồn Gốc</span>
          </div>
        </div>
      </header>

      {/* Main Form */}
      <main className="max-w-xl mx-auto px-4 pt-12 text-center space-y-8">
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-[#7A0221]/10 text-[#7A0221] flex items-center justify-center mx-auto border border-[#7A0221]/20 shadow-sm">
            <QrCode size={32} />
          </div>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#7A0221]">
            Xác Thực Tem Chống Giả
          </h1>
          <p className="text-sm text-[#7A6458] max-w-md mx-auto leading-relaxed">
            Nhập chuỗi mã tem định danh (UUID) in trên chai nước mắm Phong Triều của bạn để kiểm tra nguồn gốc xuất xứ và quy trình ủ chượp.
          </p>
        </div>

        <form onSubmit={handleSearch} className="bg-white rounded-3xl p-6 shadow-sm border border-[#EFE5D8] space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A6458]" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Nhập mã UUID tem (VD: e1b2c3d4-...)"
              className="w-full bg-[#FCF9F2] border border-[#EFE5D8] rounded-2xl pl-11 pr-4 py-3.5 text-sm text-[#2C1A14] placeholder-[#7A6458]/70 focus:outline-none focus:ring-2 focus:ring-[#7A0221]/40 focus:border-[#7A0221] transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#7A0221] hover:bg-[#9C1A36] text-white font-semibold text-sm shadow-md shadow-[#7A0221]/20 transition active:scale-95"
          >
            <ShieldCheck size={18} />
            <span>Tra Cứu Nguồn Gốc Sản Phẩm</span>
          </button>
        </form>

        <div className="p-6 rounded-3xl bg-white border border-[#EFE5D8] text-left space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7A0221]">
            <Award size={16} />
            <span>Cam kết chất lượng Phong Triều</span>
          </div>
          <p className="text-xs text-[#7A6458] leading-relaxed">
            Mỗi chai nước mắm Phong Triều xuất xưởng đều được dán một mã tem QR định danh riêng biệt tương ứng với mẻ ủ truyền thống tại Quỳnh Phú, Nghệ An. Quét mã giúp bạn kiểm tra chính xác ngày đóng chai, độ đạm và lịch sử xuất kho.
          </p>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#7A0221] hover:underline"
          >
            <span>Quay lại trang chủ Phong Triều</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>
    </div>
  );
}
