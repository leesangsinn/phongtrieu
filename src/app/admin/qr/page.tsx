"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  QrCode,
  FileSpreadsheet,
  PlusCircle,
  RefreshCw,
  Calendar,
  CalendarDays,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Search,
  Tag,
  Trash2,
} from "lucide-react";

interface BatchItem {
  _id: string;
  batchCode: string;
  productLine: "Di Sản" | "Thanh Vị" | "Dưỡng Vị";
  volume: "500ml" | "300ml" | "100ml";
  bottlingDate: string;
  websiteUrl: string;
  contactPhone: string;
  createdAt: string;
  totalQR?: number;
  scannedQR?: number;
  totalScans?: number;
}

const PRODUCT_LINES = ["Di Sản", "Thanh Vị", "Dưỡng Vị"] as const;
const VOLUMES = ["500ml", "300ml", "100ml"] as const;

/** Ngày hôm nay theo giờ máy (yyyy-mm-dd), không lệch ngày như toISOString() dùng giờ UTC. */
function todayIso(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** yyyy-mm-dd → dd/mm/yyyy */
function isoToVn(iso: string): string {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}/${m}/${y}` : "";
}

/** dd/mm/yyyy → yyyy-mm-dd; trả null nếu không phải ngày có thật (vd 31/02/2026). */
function vnToIso(text: string): string | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  const valid =
    date.getFullYear() === Number(yyyy) && date.getMonth() === Number(mm) - 1 && date.getDate() === Number(dd);
  return valid && Number(yyyy) >= 2000 ? `${yyyy}-${mm}-${dd}` : null;
}

/** Chỉ giữ chữ số và tự chèn dấu "/" khi gõ: 16102026 → 16/10/2026. */
function formatVnDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export default function AdminQRPage() {
  // Form State
  const [productLine, setProductLine] = useState<string>("Di Sản");
  const [volume, setVolume] = useState<string>("500ml");
  const [batchCode, setBatchCode] = useState<string>("");
  // bottlingDate luôn là yyyy-mm-dd (gửi API); bottlingText là chuỗi dd/mm/yyyy người dùng thấy và gõ
  const [bottlingDate, setBottlingDate] = useState<string>(todayIso);
  const [bottlingText, setBottlingText] = useState<string>(() => isoToVn(todayIso()));
  const datePickerRef = useRef<HTMLInputElement>(null);
  const [quantity, setQuantity] = useState<number>(100);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingBatches, setIsLoadingBatches] = useState<boolean>(true);
  const [batches, setBatches] = useState<BatchItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Notification Banner
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fetch all batches
  const fetchBatches = useCallback(async () => {
    try {
      setIsLoadingBatches(true);
      const res = await fetch("/api/batches", { cache: "no-store" });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setBatches(json.data);
      }
    } catch (err) {
      console.error("Không thể tải danh sách lô:", err);
    } finally {
      setIsLoadingBatches(false);
    }
  }, []);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  // Suggest Batch Code Helper following PT-DS, PT-TV, PT-DV format
  const handleAutoGenerateCode = () => {
    const prefixMap: Record<string, string> = {
      "Di Sản": "PT-DS",
      "Thanh Vị": "PT-TV",
      "Dưỡng Vị": "PT-DV",
    };
    const prefix = prefixMap[productLine] || "PT-DS";
    const dateParts = (bottlingDate || todayIso()).split("-");
    const yy = dateParts[0].substring(2);
    const mm = dateParts[1];
    setBatchCode(`${prefix}-${yy}${mm}`);
  };

  // Submit Handler: Create Batch & Generate QR Codes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!batchCode.trim()) {
      setFeedback({ type: "error", message: "Vui lòng nhập Mã mẻ ủ (Mã lô sản xuất)." });
      return;
    }

    if (!bottlingDate) {
      setFeedback({ type: "error", message: "Ngày đóng chai chưa hợp lệ. Vui lòng nhập theo dạng ngày/tháng/năm, ví dụ 16/10/2026." });
      return;
    }

    if (quantity <= 0) {
      setFeedback({ type: "error", message: "Số lượng tem phải lớn hơn 0." });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/batches/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchCode: batchCode.trim(),
          productLine,
          volume,
          bottlingDate,
          quantity: Number(quantity),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Không thể tạo lô sản xuất.");
      }

      setFeedback({
        type: "success",
        message: data.message || `Đã tạo thành công lô ${batchCode} với ${quantity} mã QR!`,
      });

      // Reset Batch Code and refresh list
      setBatchCode("");
      await fetchBatches();
    } catch (error: unknown) {
      const err = error as Error;
      setFeedback({
        type: "error",
        message: err.message || "Đã xảy ra sự cố khi gọi API tạo lô.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Export Excel Download
  const handleExportExcel = async (batchId: string, bCode: string) => {
    try {
      setExportingId(batchId);
      const url = `/api/batches/${batchId}/export`;

      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể tải file ZIP.");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `QRCodes_${bCode}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error: unknown) {
      const err = error as Error;
      alert(`Lỗi khi tải file ZIP: ${err.message}`);
    } finally {
      setExportingId(null);
    }
  };

  // Xóa lô (kèm toàn bộ mã QR) sau khi người dùng xác nhận
  const handleDeleteBatch = async (batch: BatchItem) => {
    const scanned = batch.scannedQR || 0;
    const warning =
      scanned > 0
        ? `\n\n⚠ Lô này đã có ${scanned} mã được khách quét. Tem đã in sẽ không còn xác thực được.`
        : "";
    const ok = window.confirm(
      `Bạn có chắc chắn muốn xóa lô "${batch.batchCode}" (${batch.productLine} - ${batch.volume}) cùng ${(
        batch.totalQR || 0
      ).toLocaleString()} mã QR không?${warning}\n\nHành động này không thể hoàn tác.`
    );
    if (!ok) return;

    try {
      setDeletingId(batch._id);
      setFeedback(null);
      const res = await fetch(`/api/batches/${batch._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Không thể xóa lô.");
      }
      setFeedback({ type: "success", message: data.message });
      await fetchBatches();
    } catch (error: unknown) {
      const err = error as Error;
      setFeedback({ type: "error", message: err.message || "Đã xảy ra sự cố khi xóa lô." });
    } finally {
      setDeletingId(null);
    }
  };

  // Filter batches by search term
  const filteredBatches = batches.filter(
    (b) =>
      b.batchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.productLine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.volume.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Overall Statistics
  const totalBatches = batches.length;
  const totalQRCodes = batches.reduce((acc, curr) => acc + (curr.totalQR || 0), 0);
  const totalScanned = batches.reduce((acc, curr) => acc + (curr.scannedQR || 0), 0);

  return (
    <div className="space-y-8">
      {/* ───────── PAGE TITLE & SUMMARY ───────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-[#7A0221]/10 text-[#7A0221] border border-[#7A0221]/20 shadow-xs">
              <QrCode size={24} />
            </span>
            <h1 className="font-playfair text-2xl md:text-3xl font-bold tracking-tight text-[#2C1A14]">
              Quản Lý Lô Sản Xuất &amp; Tem Mã QR
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#7A6458]">
            Khởi tạo lô ủ mắm mới, tự động sinh mã QR định danh duy nhất (UUID v4) và xuất file Excel cho xưởng in tem.
          </p>
        </div>

        {/* Global Stats Counter Cards */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-white border border-[#EADFCF] shadow-xs text-center min-w-[90px]">
            <span className="text-[10px] font-bold text-[#7A6458] block uppercase tracking-wider">
              Tổng số Lô
            </span>
            <span className="text-lg font-bold text-[#2C1A14]">{totalBatches}</span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-white border border-[#EADFCF] shadow-xs text-center min-w-[100px]">
            <span className="text-[10px] font-bold text-[#7A6458] block uppercase tracking-wider">
              Mã QR Đã Sinh
            </span>
            <span className="text-lg font-bold text-[#7A0221]">
              {totalQRCodes.toLocaleString()}
            </span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-white border border-[#EADFCF] shadow-xs text-center min-w-[100px]">
            <span className="text-[10px] font-bold text-[#7A6458] block uppercase tracking-wider">
              Đã Quét Check
            </span>
            <span className="text-lg font-bold text-emerald-700">
              {totalScanned.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ───────── NOTIFICATION BANNER ───────── */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-start gap-3 border transition-all shadow-xs ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
          role="alert"
        >
          {feedback.type === "success" ? (
            <CheckCircle2 size={20} className="text-emerald-600 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={20} className="text-rose-600 mt-0.5 shrink-0" />
          )}
          <div className="flex-1 text-sm font-medium">{feedback.message}</div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 font-semibold uppercase tracking-wider"
          >
            Đóng
          </button>
        </div>
      )}

      {/* ───────── FORM: KHỞI TẠO LÔ MỚI & SINH MÃ QR (Card Trắng Kem) ───────── */}
      <section className="bg-white border border-[#EADFCF] rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-6 border-b border-[#F0E6DA]">
          <div>
            <h2 className="font-playfair text-xl font-bold text-[#2C1A14] flex items-center gap-2">
              <PlusCircle size={20} className="text-[#7A0221]" />
              Khởi Tạo Lô Mới &amp; Sinh Tem QR
            </h2>
            <p className="text-xs text-[#7A6458] mt-0.5">
              Nhập các thông số mẻ ủ nước mắm để hệ thống sinh chuỗi mã định danh chống hàng giả.
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-[#7A0221]/10 text-[#7A0221] border border-[#7A0221]/20 font-bold uppercase tracking-wider">
            Thuật toán UUID v4
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Dòng sản phẩm */}
            <div>
              <label
                htmlFor="productLine"
                className="block text-xs font-semibold uppercase tracking-wider text-[#7A6458] mb-2"
              >
                Dòng Sản Phẩm <span className="text-[#7A0221]">*</span>
              </label>
              <select
                id="productLine"
                value={productLine}
                onChange={(e) => setProductLine(e.target.value)}
                className="w-full bg-[#FCF9F2] border border-[#E5D7C7] rounded-xl px-4 py-2.5 text-sm text-[#2C1A14] font-medium focus:outline-none focus:ring-2 focus:ring-[#7A0221]/20 focus:border-[#7A0221] transition"
                required
              >
                {PRODUCT_LINES.map((line) => (
                  <option key={line} value={line}>
                    {line}
                  </option>
                ))}
              </select>
            </div>

            {/* Dung tích */}
            <div>
              <label
                htmlFor="volume"
                className="block text-xs font-semibold uppercase tracking-wider text-[#7A6458] mb-2"
              >
                Dung Tích <span className="text-[#7A0221]">*</span>
              </label>
              <select
                id="volume"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full bg-[#FCF9F2] border border-[#E5D7C7] rounded-xl px-4 py-2.5 text-sm text-[#2C1A14] font-medium focus:outline-none focus:ring-2 focus:ring-[#7A0221]/20 focus:border-[#7A0221] transition"
                required
              >
                {VOLUMES.map((vol) => (
                  <option key={vol} value={vol}>
                    {vol}
                  </option>
                ))}
              </select>
            </div>

            {/* Ngày đóng chai */}
            <div>
              <label
                htmlFor="bottlingDate"
                className="block text-xs font-semibold uppercase tracking-wider text-[#7A6458] mb-2"
              >
                Ngày Đóng Chai <span className="text-[#7A0221]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="bottlingDate"
                  inputMode="numeric"
                  placeholder="dd/mm/yyyy"
                  maxLength={10}
                  autoComplete="off"
                  value={bottlingText}
                  onChange={(e) => {
                    const text = formatVnDateInput(e.target.value);
                    setBottlingText(text);
                    setBottlingDate(vnToIso(text) ?? "");
                  }}
                  className="w-full bg-[#FCF9F2] border border-[#E5D7C7] rounded-xl pl-4 pr-11 py-2.5 text-sm text-[#2C1A14] font-medium focus:outline-none focus:ring-2 focus:ring-[#7A0221]/20 focus:border-[#7A0221] transition"
                  required
                />
                <button
                  type="button"
                  aria-label="Chọn ngày từ lịch"
                  onClick={() => datePickerRef.current?.showPicker?.()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6458] hover:text-[#7A0221]"
                >
                  <CalendarDays size={18} />
                </button>
                {/* Lịch của trình duyệt, chỉ dùng để chọn nhanh; giá trị hiển thị vẫn là dd/mm/yyyy */}
                <input
                  ref={datePickerRef}
                  type="date"
                  tabIndex={-1}
                  aria-hidden="true"
                  value={bottlingDate}
                  onChange={(e) => {
                    setBottlingDate(e.target.value);
                    setBottlingText(isoToVn(e.target.value));
                  }}
                  className="absolute right-3 bottom-0 w-0 h-0 opacity-0 pointer-events-none"
                />
              </div>
              {bottlingText.length === 10 && !bottlingDate && (
                <p className="text-xs text-red-600 mt-1.5">Ngày không hợp lệ.</p>
              )}
            </div>

            {/* Mã mẻ ủ (batchCode) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="batchCode"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#7A6458]"
                >
                  Mã Mẻ Ủ (Mã Lô) <span className="text-[#7A0221]">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAutoGenerateCode}
                  className="text-xs text-[#7A0221] hover:text-[#9C1A36] flex items-center gap-1 font-semibold hover:underline"
                >
                  <Sparkles size={12} />
                  Gợi ý mã
                </button>
              </div>
              <input
                type="text"
                id="batchCode"
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value.toUpperCase())}
                placeholder="VD: PT-DS-2409"
                className="w-full bg-[#FCF9F2] border border-[#E5D7C7] rounded-xl px-4 py-2.5 text-sm text-[#2C1A14] font-mono font-semibold placeholder-[#7A6458]/60 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#7A0221]/20 focus:border-[#7A0221] transition"
                required
              />
            </div>

            {/* Số lượng tem cần in */}
            <div>
              <label
                htmlFor="quantity"
                className="block text-xs font-semibold uppercase tracking-wider text-[#7A6458] mb-2"
              >
                Số Lượng Tem Cần In <span className="text-[#7A0221]">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                max="10000"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full bg-[#FCF9F2] border border-[#E5D7C7] rounded-xl px-4 py-2.5 text-sm text-[#2C1A14] font-medium focus:outline-none focus:ring-2 focus:ring-[#7A0221]/20 focus:border-[#7A0221] transition"
                required
              />
              <span className="text-[11px] text-[#7A6458] mt-1 block">
                Tối đa 10.000 mã/lần.
              </span>
            </div>

            {/* Nút Submit */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#7A0221] to-[#9C1A36] hover:from-[#5A0119] hover:to-[#7A0221] disabled:opacity-60 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md shadow-[#7A0221]/20 transition-all transform active:scale-[0.98] disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Đang tạo &amp; sinh mã...</span>
                  </>
                ) : (
                  <>
                    <QrCode size={18} />
                    <span>Tạo Lô &amp; Sinh Mã</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* ───────── DANH SÁCH CÁC LÔ ĐÃ TẠO (Card Trắng Kem) ───────── */}
      <section className="bg-white border border-[#EADFCF] rounded-3xl shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-6 border-b border-[#F0E6DA] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-playfair text-xl font-bold text-[#2C1A14] flex items-center gap-2">
              <Layers size={20} className="text-[#7A0221]" />
              Danh Sách Các Lô Đã Tạo
            </h2>
            <p className="text-xs text-[#7A6458] mt-0.5">
              Theo dõi tình trạng quét tem thực tế và tải file Excel cấp cho đơn vị in ấn.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6458]"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm mã lô, dòng SP..."
                className="bg-[#FCF9F2] border border-[#E5D7C7] rounded-xl pl-9 pr-4 py-2 text-xs text-[#2C1A14] placeholder-[#7A6458]/70 focus:outline-none focus:ring-1 focus:ring-[#7A0221] w-52 md:w-64 transition"
              />
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchBatches}
              disabled={isLoadingBatches}
              className="p-2 bg-[#FCF9F2] hover:bg-[#F4ECE1] text-[#7A6458] hover:text-[#2C1A14] rounded-xl border border-[#E5D7C7] transition disabled:opacity-50"
              title="Làm mới danh sách"
            >
              <RefreshCw
                size={16}
                className={isLoadingBatches ? "animate-spin text-[#7A0221]" : ""}
              />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#2C1A14]">
            <thead className="bg-[#F8F3EA] text-[11px] uppercase tracking-wider text-[#7A6458] border-b border-[#EADFCF]">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold">
                  Mã Lô
                </th>
                <th scope="col" className="px-6 py-4 font-bold">
                  Dòng Sản Phẩm
                </th>
                <th scope="col" className="px-6 py-4 font-bold">
                  Dung Tích
                </th>
                <th scope="col" className="px-6 py-4 font-bold">
                  Ngày Đóng Chai
                </th>
                <th scope="col" className="px-6 py-4 font-bold text-center">
                  Số Tem / Quét
                </th>
                <th scope="col" className="px-6 py-4 font-bold">
                  Ngày Khởi Tạo
                </th>
                <th scope="col" className="px-6 py-4 font-bold text-right">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EAE0]">
              {isLoadingBatches ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#7A6458]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <RefreshCw size={24} className="animate-spin text-[#7A0221]" />
                      <span className="text-sm">Đang tải dữ liệu lô hàng...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredBatches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#7A6458]">
                    <div className="max-w-sm mx-auto flex flex-col items-center gap-2">
                      <Tag size={32} className="text-[#C5B5A5]" />
                      <p className="font-semibold text-[#2C1A14]">
                        {searchTerm
                          ? "Không tìm thấy lô sản xuất phù hợp với từ khóa."
                          : "Chưa có lô sản xuất nào được khởi tạo."}
                      </p>
                      <p className="text-xs text-[#7A6458]">
                        Sử dụng form phía trên để khởi tạo lô đầu tiên và sinh tem QR.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBatches.map((b) => {
                  const lineBadge =
                    b.productLine === "Di Sản"
                      ? "bg-[#7A0221]/10 text-[#7A0221] border-[#7A0221]/20"
                      : b.productLine === "Thanh Vị"
                      ? "bg-amber-500/10 text-amber-800 border-amber-300/40"
                      : "bg-teal-500/10 text-teal-800 border-teal-300/40";

                  const isExportingThis = exportingId === b._id;

                  return (
                    <tr
                      key={b._id}
                      className="hover:bg-[#FAF6EE] transition-colors"
                    >
                      {/* Mã Lô */}
                      <td className="px-6 py-4 font-mono font-bold text-[#7A0221] tracking-wider text-sm">
                        {b.batchCode}
                      </td>

                      {/* Dòng Sản Phẩm */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${lineBadge}`}
                        >
                          {b.productLine}
                        </span>
                      </td>

                      {/* Dung Tích */}
                      <td className="px-6 py-4 text-[#2C1A14] font-medium text-xs">
                        {b.volume}
                      </td>

                      {/* Ngày Đóng Chai */}
                      <td className="px-6 py-4 text-[#7A6458] text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-[#A8988C]" />
                          <span>
                            {new Date(b.bottlingDate).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </td>

                      {/* Thống kê QR */}
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-bold text-[#2C1A14] text-xs">
                            {(b.totalQR || 0).toLocaleString()} tem
                          </span>
                          <span className="text-[11px] text-emerald-700 font-medium">
                            {b.scannedQR || 0} đã quét ({b.totalScans || 0} lượt)
                          </span>
                        </div>
                      </td>

                      {/* Ngày Tạo */}
                      <td className="px-6 py-4 text-[#7A6458] text-xs">
                        {new Date(b.createdAt).toLocaleDateString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Thao Tác (Nút Xuất Excel + Xóa lô) */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleExportExcel(b._id, b.batchCode)}
                          disabled={isExportingThis}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold transition active:scale-95 disabled:opacity-50"
                          title="Tải gói ZIP gồm ảnh QR PNG và file Excel danh sách để gửi xưởng in"
                        >
                          {isExportingThis ? (
                            <>
                              <RefreshCw size={13} className="animate-spin" />
                              <span>Đang xuất...</span>
                            </>
                          ) : (
                            <>
                              <FileSpreadsheet size={14} className="text-emerald-700" />
                              <span>Tải File ZIP (Ảnh QR + Excel)</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteBatch(b)}
                          disabled={deletingId === b._id || isExportingThis}
                          className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-300 text-red-800 text-xs font-semibold transition active:scale-95 disabled:opacity-50"
                          title="Xóa lô này cùng toàn bộ mã QR (dùng khi xuất thử hoặc xuất sai)"
                        >
                          {deletingId === b._id ? (
                            <RefreshCw size={13} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                          <span>Xóa</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
