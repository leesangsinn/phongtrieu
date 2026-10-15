"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  QrCode,
  Users,
  MessageSquare,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface BatchStat {
  totalQR?: number;
  scannedQR?: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalBatches: 0,
    totalQR: 0,
    scannedQR: 0,
    totalContacts: 0,
    pendingContacts: 0,
    totalPartners: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const [batchesRes, contactsRes, partnersRes] = await Promise.allSettled([
          fetch("/api/batches", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/leads/contact", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/leads/partner", { cache: "no-store" }).then((r) => r.json()),
        ]);

        let batchesCount = 0;
        let qrCount = 0;
        let scannedCount = 0;

        if (batchesRes.status === "fulfilled" && batchesRes.value?.success) {
          const list = (batchesRes.value.data || []) as BatchStat[];
          batchesCount = list.length;
          qrCount = list.reduce((acc: number, curr: BatchStat) => acc + (curr.totalQR || 0), 0);
          scannedCount = list.reduce((acc: number, curr: BatchStat) => acc + (curr.scannedQR || 0), 0);
        }

        const contactsCount =
          contactsRes.status === "fulfilled" && contactsRes.value?.success
            ? contactsRes.value.pagination?.total ?? (contactsRes.value.data || []).length
            : 0;

        // Khách đã gửi liên hệ nhưng chưa được Sale liên hệ lại
        const pendingContacts =
          contactsRes.status === "fulfilled" && contactsRes.value?.success
            ? contactsRes.value.counts?.new ?? 0
            : 0;

        const partnersCount =
          partnersRes.status === "fulfilled" && partnersRes.value?.success
            ? (partnersRes.value.data || []).length
            : 0;

        setStats({
          totalBatches: batchesCount,
          totalQR: qrCount,
          scannedQR: scannedCount,
          totalContacts: contactsCount,
          pendingContacts,
          totalPartners: partnersCount,
        });
      } catch (err) {
        console.error("Lỗi khi tải số liệu tổng quan:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#8A2E1B] via-[#9E3721] to-[#6E2213] text-white p-8 md:p-10 shadow-lg shadow-[#8A2E1B]/15">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[#F5ECE1] text-xs font-semibold mb-4 backdrop-blur-xs">
            <Sparkles size={14} className="text-[#E9B98A]" />
            Hệ Thống Quản Trị Phong Triều
          </div>
          <h1 className="font-playfair text-3xl font-bold tracking-tight text-white md:text-4xl">
            Chào mừng trở lại, Quản trị viên
          </h1>
          <p className="mt-3 text-sm text-[#F5ECE1]/90 leading-relaxed">
            Hệ thống quản lý nguồn gốc xuất xứ mắm Nghệ An, kiểm soát tem QR chống giả và dữ liệu đối tác thương hiệu Phong Triều.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin/qr"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#FDF9F3] text-[#8A2E1B] text-sm font-bold shadow-md transition transform active:scale-95"
            >
              <QrCode size={16} />
              Quản Lý &amp; Sinh Tem QR
            </Link>
            <Link
              href="/admin/partners"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/20 hover:bg-black/30 border border-white/20 text-white text-sm font-semibold transition"
            >
              <Users size={16} />
              Xem Đơn Đại Lý Mới
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="bg-white border border-[#EADFCF] rounded-2xl p-6 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A6458]">
              Lô Sản Xuất
            </span>
            <span className="p-2.5 rounded-xl bg-[#8A2E1B]/10 text-[#8A2E1B] border border-[#8A2E1B]/15">
              <Layers size={18} />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-[#2C1A14]">
              {loading ? "..." : stats.totalBatches}
            </span>
            <p className="text-xs text-[#7A6458] mt-1 font-medium">Lô mẻ ủ đã khởi tạo</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-[#EADFCF] rounded-2xl p-6 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A6458]">
              Tem QR Đã Phát Hành
            </span>
            <span className="p-2.5 rounded-xl bg-[#8A2E1B]/10 text-[#8A2E1B] border border-[#8A2E1B]/15">
              <QrCode size={18} />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-[#8A2E1B]">
              {loading ? "..." : stats.totalQR.toLocaleString()}
            </span>
            <p className="text-xs text-[#7A6458] mt-1 font-medium">Mã UUID định danh duy nhất</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-[#EADFCF] rounded-2xl p-6 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A6458]">
              Lượt Quét Xác Thực
            </span>
            <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck size={18} />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-emerald-700">
              {loading ? "..." : stats.scannedQR.toLocaleString()}
            </span>
            <p className="text-xs text-[#7A6458] mt-1 font-medium">Tem đã người mua quét check</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-[#EADFCF] rounded-2xl p-6 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7A6458]">
              Đối Tác &amp; Khách Hàng
            </span>
            <span className="p-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
              <MessageSquare size={18} />
            </span>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-[#2C1A14]">
              {loading ? "..." : stats.totalPartners + stats.totalContacts}
            </span>
            <p className="text-xs text-[#7A6458] mt-1 font-medium">
              {stats.totalPartners} đại lý &bull; {stats.totalContacts} liên hệ
            </p>
            {!loading && stats.pendingContacts > 0 && (
              <Link
                href="/admin/contacts"
                className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden />
                {stats.pendingContacts} khách chưa liên hệ
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/qr"
          className="group p-6 rounded-3xl bg-white border border-[#EADFCF] hover:border-[#8A2E1B]/50 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="p-3 rounded-2xl bg-[#8A2E1B]/10 text-[#8A2E1B] border border-[#8A2E1B]/15">
                <QrCode size={22} />
              </span>
              <ArrowRight
                size={18}
                className="text-[#7A6458] group-hover:text-[#8A2E1B] group-hover:translate-x-1 transition-all"
              />
            </div>
            <h3 className="font-playfair text-xl font-bold text-[#2C1A14] mt-4 group-hover:text-[#8A2E1B] transition-colors">
              Quy trình Sinh Tem &amp; Xuất Excel Lô
            </h3>
            <p className="text-xs text-[#7A6458] mt-1.5 leading-relaxed">
              Tạo mẻ ủ nước mắm mới, tự động sinh mã định danh UUID v4 bảo mật và xuất trực tiếp file Excel định dạng chuẩn xưởng in.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#8A2E1B]">
            <span>Truy cập Quản lý QR</span>
            <ArrowRight size={14} />
          </div>
        </Link>

        <Link
          href="/admin/partners"
          className="group p-6 rounded-3xl bg-white border border-[#EADFCF] hover:border-[#8A2E1B]/50 hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="p-3 rounded-2xl bg-amber-500/10 text-amber-800 border border-amber-300/30">
                <Users size={22} />
              </span>
              <ArrowRight
                size={18}
                className="text-[#7A6458] group-hover:text-[#8A2E1B] group-hover:translate-x-1 transition-all"
              />
            </div>
            <h3 className="font-playfair text-xl font-bold text-[#2C1A14] mt-4 group-hover:text-[#8A2E1B] transition-colors">
              Hồ Sơ Đăng Ký Đại Lý &amp; Phân Phối
            </h3>
            <p className="text-xs text-[#7A6458] mt-1.5 leading-relaxed">
              Tiếp nhận và quản lý thông tin các nhà phân phối, cửa hàng thực phẩm, nhà hàng HORECA đăng ký hợp tác phân phối mắm Phong Triều.
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#8A2E1B]">
            <span>Xem danh sách đối tác</span>
            <ArrowRight size={14} />
          </div>
        </Link>
      </div>
    </div>
  );
}
