"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { MailWarning, MessageSquare, RefreshCw, Search } from "lucide-react";
import Pagination from "@/components/admin/Pagination";

type ContactStatus = "new" | "contacted" | "resolved";

interface ContactItem {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  /** Trường cũ (SĐT hoặc email) của các bản ghi trước khi tách thành phone/email */
  contact?: string;
  topic: string;
  message: string;
  status: ContactStatus;
  emailSent?: boolean;
  createdAt: string;
}

interface PaginationInfo {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

const PAGE_SIZE = 10;

const STATUS_LABEL: Record<ContactStatus, { text: string; className: string }> = {
  new: { text: "Mới", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  contacted: { text: "Đã liên hệ", className: "bg-amber-50 text-amber-700 border-amber-200" },
  resolved: { text: "Đã xử lý", className: "bg-slate-100 text-slate-600 border-slate-200" },
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, totalPages: 0, page: 1, limit: PAGE_SIZE });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(""); // giá trị tìm kiếm đã debounce, dùng để gọi API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const tableTop = useRef<HTMLDivElement>(null);

  // Debounce ô tìm kiếm 350ms rồi quay về trang 1
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // Tải dữ liệu mỗi khi đổi trang / từ khóa / bấm làm mới. Hủy request cũ để không bị ghi đè sai thứ tự.
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError("");
        const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
        if (query) params.set("q", query);

        const res = await fetch(`/api/leads/contact?${params}`, { cache: "no-store", signal: controller.signal });

        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.message || "Không thể tải danh sách liên hệ.");

        setContacts(result.data);
        setPagination(result.pagination);
        // Trang hiện tại vượt quá tổng số trang (ví dụ vừa xóa bớt dữ liệu): lùi về trang cuối
        if (result.pagination.totalPages > 0 && page > result.pagination.totalPages) {
          setPage(result.pagination.totalPages);
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError((err as Error).message || "Đã xảy ra lỗi khi tải dữ liệu.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [page, query, reloadKey]);

  const goToPage = useCallback((next: number) => {
    setPage(next);
    tableTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="space-y-6" ref={tableTop}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-[#8C3A21]/10 text-[#8C3A21] border border-[#8C3A21]/15">
              <MessageSquare size={24} />
            </span>
            <h1 className="font-playfair text-2xl md:text-3xl font-bold tracking-tight text-[#2C1A14]">
              Khách Hàng Liên Hệ
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#7A6458]">
            Danh sách tin nhắn, câu hỏi và phản hồi của khách hàng gửi qua biểu mẫu liên hệ trên Website.
            {pagination.total > 0 && (
              <>
                {" "}
                Tổng cộng <strong className="text-[#2C1A14]">{pagination.total}</strong> liên hệ.
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6458]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, email, sđt..."
              aria-label="Tìm khách hàng"
              className="bg-white border border-[#E5D7C7] rounded-xl pl-9 pr-4 py-2 text-xs text-[#2C1A14] placeholder-[#7A6458]/70 focus:outline-none focus:ring-1 focus:ring-[#8C3A21] w-52 md:w-64 transition"
            />
          </div>
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            disabled={loading}
            className="p-2 bg-white hover:bg-[#F4ECE1] text-[#7A6458] hover:text-[#2C1A14] rounded-xl border border-[#E5D7C7] transition"
            title="Làm mới"
            aria-label="Làm mới danh sách"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-[#8C3A21]" : ""} />
          </button>
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      <div className="bg-white border border-[#EADFCF] rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#2C1A14]">
            <thead className="bg-[#F8F3EA] text-[11px] uppercase tracking-wider text-[#7A6458] border-b border-[#EADFCF]">
              <tr>
                <th scope="col" className="px-6 py-4 font-bold">Họ Tên</th>
                <th scope="col" className="px-6 py-4 font-bold">Số Điện Thoại</th>
                <th scope="col" className="px-6 py-4 font-bold">Email</th>
                <th scope="col" className="px-6 py-4 font-bold">Lời Nhắn</th>
                <th scope="col" className="px-6 py-4 font-bold text-center">Trạng Thái</th>
                <th scope="col" className="px-6 py-4 font-bold">Ngày Liên Hệ</th>
              </tr>
            </thead>
            <tbody className={`divide-y divide-[#F2EAE0] transition-opacity ${loading && contacts.length ? "opacity-50" : ""}`}>
              {loading && contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#7A6458]">
                    <RefreshCw size={24} className="animate-spin text-[#8C3A21] mx-auto mb-2" />
                    Đang tải danh sách liên hệ...
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#7A6458]">
                    {query ? "Không tìm thấy khách hàng phù hợp với từ khóa." : "Chưa có liên hệ nào từ khách hàng."}
                  </td>
                </tr>
              ) : (
                contacts.map((item) => {
                  const status = STATUS_LABEL[item.status] ?? STATUS_LABEL.new;
                  return (
                    <tr key={item._id} className="hover:bg-[#FAF6EE] transition-colors align-top">
                      <td className="px-6 py-4 font-bold text-[#2C1A14] whitespace-nowrap">{item.name}</td>
                      <td className="px-6 py-4 text-xs text-[#8C3A21] font-mono font-semibold whitespace-nowrap">
                        {item.phone || item.contact || "—"}
                      </td>
                      <td className="px-6 py-4 text-xs text-[#2C1A14] break-all">{item.email || "—"}</td>
                      <td className="px-6 py-4 text-xs text-[#7A6458] max-w-xs break-words">
                        <span className="mb-1.5 inline-block px-2 py-0.5 rounded-full bg-[#F4ECE1] border border-[#E5D7C7] text-[10px] font-medium text-[#2C1A14]">
                          {item.topic}
                        </span>
                        <p className="whitespace-pre-line">{item.message}</p>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${status.className}`}>
                          {status.text}
                        </span>
                        {item.emailSent === false && (
                          <span
                            className="mt-1.5 flex items-center justify-center gap-1 text-[10px] text-amber-700"
                            title="Email thông báo cho team Sale chưa gửi được. Hãy kiểm tra cấu hình SMTP."
                          >
                            <MailWarning size={11} /> Chưa gửi mail
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-[#7A6458] whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onChange={goToPage}
          disabled={loading}
        />
      </div>
    </div>
  );
}
