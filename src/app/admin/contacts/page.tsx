"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Mail,
  MailWarning,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import Pagination from "@/components/admin/Pagination";

type ContactStatus = "new" | "contacted" | "resolved";
type StatusFilter = "all" | ContactStatus;

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
  note?: string;
  contactedAt?: string;
  statusUpdatedAt?: string;
  createdAt: string;
}

interface PaginationInfo {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

type Counts = Record<StatusFilter, number>;

const PAGE_SIZE = 10;
const EMPTY_COUNTS: Counts = { all: 0, new: 0, contacted: 0, resolved: 0 };

const STATUS_META: Record<ContactStatus, { label: string; badge: string; dot: string }> = {
  new: { label: "Chưa liên hệ", badge: "bg-rose-50 text-rose-700 border-rose-200", dot: "bg-rose-500" },
  contacted: { label: "Đã liên hệ", badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  resolved: { label: "Đã xử lý", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
};

const TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "new", label: "Chưa liên hệ" },
  { key: "contacted", label: "Đã liên hệ" },
  { key: "resolved", label: "Đã xử lý" },
];

const formatDateTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

/** "Đã chờ 3 giờ" / "Đã chờ 2 ngày" cho khách chưa được liên hệ; cảnh báo đỏ khi quá 24 giờ. */
function waiting(iso: string): { text: string; late: boolean } {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (minutes < 60) return { text: `Đã chờ ${Math.max(minutes, 1)} phút`, late: false };
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return { text: `Đã chờ ${hours} giờ`, late: false };
  return { text: `Đã chờ ${Math.floor(hours / 24)} ngày`, late: true };
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ total: 0, totalPages: 0, page: 1, limit: PAGE_SIZE });
  const [counts, setCounts] = useState<Counts>(EMPTY_COUNTS);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(""); // giá trị tìm kiếm đã debounce, dùng để gọi API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [selected, setSelected] = useState<ContactItem | null>(null);
  const tableTop = useRef<HTMLDivElement>(null);

  // Debounce ô tìm kiếm 350ms rồi quay về trang 1
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // Tải dữ liệu mỗi khi đổi trang / bộ lọc / từ khóa / bấm làm mới. Hủy request cũ để không bị ghi đè sai thứ tự.
  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError("");
        const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) });
        if (query) params.set("q", query);
        if (statusFilter !== "all") params.set("status", statusFilter);

        const res = await fetch(`/api/leads/contact?${params}`, { cache: "no-store", signal: controller.signal });

        if (res.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.message || "Không thể tải danh sách liên hệ.");

        setContacts(result.data);
        setPagination(result.pagination);
        if (result.counts) setCounts(result.counts);
        // Trang hiện tại vượt quá tổng số trang (ví dụ vừa chuyển hết khách sang trạng thái khác): lùi về trang cuối
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
  }, [page, query, statusFilter, reloadKey]);

  // Thông báo ngắn tự tắt
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 2500);
    return () => clearTimeout(t);
  }, [notice]);

  const goToPage = useCallback((next: number) => {
    setPage(next);
    tableTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const changeFilter = (key: StatusFilter) => {
    setStatusFilter(key);
    setPage(1);
  };

  /** Gửi thay đổi lên máy chủ; cập nhật giao diện ngay (lạc quan) và hoàn lại nếu lỗi. */
  const updateContact = useCallback(
    async (id: string, patch: { status?: ContactStatus; note?: string }): Promise<boolean> => {
      const previous = contacts.find((c) => c._id === id);
      const apply = (c: ContactItem): ContactItem => ({ ...c, ...patch });

      setContacts((list) => list.map((c) => (c._id === id ? apply(c) : c)));
      setSelected((s) => (s && s._id === id ? apply(s) : s));

      try {
        const res = await fetch(`/api/leads/contact/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return false;
        }
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.message || "Không thể cập nhật.");

        const saved = result.data as ContactItem;
        setContacts((list) => list.map((c) => (c._id === id ? { ...c, ...saved } : c)));
        setSelected((s) => (s && s._id === id ? { ...s, ...saved } : s));

        if (patch.status) {
          setNotice(`Đã chuyển sang "${STATUS_META[patch.status].label}"`);
          // Tải lại để số đếm và danh sách (khi đang lọc theo trạng thái) luôn đúng
          setReloadKey((k) => k + 1);
        } else {
          setNotice("Đã lưu ghi chú");
        }
        return true;
      } catch (err) {
        if (previous) {
          setContacts((list) => list.map((c) => (c._id === id ? previous : c)));
          setSelected((s) => (s && s._id === id ? previous : s));
        }
        setError((err as Error).message || "Không thể cập nhật khách hàng.");
        return false;
      }
    },
    [contacts]
  );

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
            Theo dõi khách nào đã được liên hệ, khách nào còn chờ. Bấm vào một khách để xem chi tiết và ghi chú.
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

      {/* Bộ lọc theo trạng thái, có số lượng */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Lọc theo trạng thái">
        {TABS.map((tab) => {
          const active = statusFilter === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={active}
              onClick={() => changeFilter(tab.key)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                active
                  ? "border-[#8C3A21] bg-[#8C3A21] text-white shadow-sm"
                  : "border-[#E5D7C7] bg-white text-[#2C1A14] hover:bg-[#F4ECE1]"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] ${
                  active
                    ? "bg-white/20 text-white"
                    : tab.key === "new" && counts.new > 0
                      ? "bg-rose-100 text-rose-700"
                      : "bg-[#F4ECE1] text-[#7A6458]"
                }`}
              >
                {counts[tab.key]}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm text-rose-800"
        >
          <span>{error}</span>
          <button onClick={() => setError("")} aria-label="Đóng thông báo lỗi" className="shrink-0 text-rose-700">
            <X size={16} />
          </button>
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-[#2C1A14] px-4 py-3 text-xs font-medium text-white shadow-lg"
        >
          <CheckCircle2 size={16} className="text-emerald-400" />
          {notice}
        </div>
      )}

      <div className="bg-white border border-[#EADFCF] rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#2C1A14]">
            <thead className="bg-[#F8F3EA] text-[11px] uppercase tracking-wider text-[#7A6458] border-b border-[#EADFCF]">
              <tr>
                <th scope="col" className="px-5 py-4 font-bold">Khách Hàng</th>
                <th scope="col" className="px-5 py-4 font-bold">Liên Hệ</th>
                <th scope="col" className="px-5 py-4 font-bold">Lời Nhắn</th>
                <th scope="col" className="px-5 py-4 font-bold">Trạng Thái</th>
                <th scope="col" className="px-5 py-4 font-bold">Ngày Gửi</th>
                <th scope="col" className="px-5 py-4 font-bold text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y divide-[#F2EAE0] transition-opacity ${loading && contacts.length ? "opacity-50" : ""}`}
            >
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
                    {query
                      ? "Không tìm thấy khách hàng phù hợp với từ khóa."
                      : statusFilter === "new"
                        ? "Tuyệt vời, không còn khách nào đang chờ liên hệ."
                        : "Chưa có khách hàng nào trong mục này."}
                  </td>
                </tr>
              ) : (
                contacts.map((item) => {
                  const status: ContactStatus = item.status ?? "new"; // bản ghi rất cũ có thể chưa có status
                  const meta = STATUS_META[status] ?? STATUS_META.new;
                  const isNew = status === "new";
                  const wait = isNew ? waiting(item.createdAt) : null;
                  const phone = item.phone || item.contact;
                  return (
                    <tr
                      key={item._id}
                      className={`align-top transition-colors hover:bg-[#FAF6EE] ${isNew ? "bg-rose-50/30" : ""}`}
                    >
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-start gap-2">
                          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${meta.dot}`} aria-hidden />
                          <div>
                            <button
                              onClick={() => setSelected(item)}
                              className={`text-left text-[#2C1A14] hover:text-[#8C3A21] hover:underline ${isNew ? "font-bold" : "font-semibold"}`}
                            >
                              {item.name}
                            </button>
                            {item.note && (
                              <span className="mt-0.5 block text-[10px] text-[#7A6458]">Có ghi chú nội bộ</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs">
                        {phone && (
                          <a
                            href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                            className="flex items-center gap-1.5 font-mono font-semibold text-[#8C3A21] hover:underline"
                          >
                            <Phone size={12} /> {phone}
                          </a>
                        )}
                        {item.email && (
                          <a
                            href={`mailto:${item.email}`}
                            className="mt-1 flex items-center gap-1.5 break-all text-[#2C1A14] hover:underline"
                          >
                            <Mail size={12} className="shrink-0" /> {item.email}
                          </a>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-[#7A6458] max-w-xs">
                        <span className="mb-1.5 inline-block px-2 py-0.5 rounded-full bg-[#F4ECE1] border border-[#E5D7C7] text-[10px] font-medium text-[#2C1A14]">
                          {item.topic}
                        </span>
                        <p className="line-clamp-2 whitespace-pre-line break-words">{item.message}</p>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <label className="sr-only" htmlFor={`status-${item._id}`}>
                          Trạng thái của {item.name}
                        </label>
                        <select
                          id={`status-${item._id}`}
                          value={status}
                          onChange={(e) => updateContact(item._id, { status: e.target.value as ContactStatus })}
                          className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[#8C3A21]/40 ${meta.badge}`}
                        >
                          {(Object.keys(STATUS_META) as ContactStatus[]).map((s) => (
                            <option key={s} value={s}>
                              {STATUS_META[s].label}
                            </option>
                          ))}
                        </select>
                        {wait && (
                          <span
                            className={`mt-1.5 flex items-center gap-1 text-[10px] ${wait.late ? "font-semibold text-rose-600" : "text-[#7A6458]"}`}
                          >
                            <Clock size={11} /> {wait.text}
                          </span>
                        )}
                        {!isNew && item.contactedAt && (
                          <span className="mt-1.5 block text-[10px] text-[#7A6458]">
                            Liên hệ lúc {formatDateTime(item.contactedAt)}
                          </span>
                        )}
                        {item.emailSent === false && (
                          <span
                            className="mt-1.5 flex items-center gap-1 text-[10px] text-amber-700"
                            title="Email thông báo cho team Sale chưa gửi được. Hãy kiểm tra cấu hình SMTP."
                          >
                            <MailWarning size={11} /> Chưa gửi mail
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-[#7A6458] whitespace-nowrap">
                        {formatDateTime(item.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        {isNew && (
                          <button
                            onClick={() => updateContact(item._id, { status: "contacted" })}
                            className="mr-2 inline-flex items-center gap-1 rounded-lg bg-[#8C3A21] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#A95A32]"
                          >
                            <Check size={13} /> Đã liên hệ
                          </button>
                        )}
                        <button
                          onClick={() => setSelected(item)}
                          className="rounded-lg border border-[#E5D7C7] bg-white px-3 py-1.5 text-xs font-semibold text-[#2C1A14] transition hover:bg-[#F4ECE1]"
                        >
                          Chi tiết
                        </button>
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

      {selected && (
        <ContactDetail contact={selected} onClose={() => setSelected(null)} onUpdate={updateContact} />
      )}
    </div>
  );
}

/** Bảng chi tiết bên phải: xem đủ lời nhắn, liên hệ nhanh, đổi trạng thái và ghi chú nội bộ. */
function ContactDetail({
  contact,
  onClose,
  onUpdate,
}: {
  contact: ContactItem;
  onClose: () => void;
  onUpdate: (id: string, patch: { status?: ContactStatus; note?: string }) => Promise<boolean>;
}) {
  const [note, setNote] = useState(contact.note ?? "");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const phone = contact.phone || contact.contact || "";
  const dirty = note.trim() !== (contact.note ?? "").trim();

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const saveNote = async () => {
    setSaving(true);
    await onUpdate(contact._id, { note });
    setSaving(false);
  };

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* trình duyệt chặn clipboard: bỏ qua */
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-[#2C1A14]/40" onClick={onClose} aria-hidden />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Chi tiết khách hàng ${contact.name}`}
        className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-[#FCF9F2] shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-[#EADFCF] bg-white px-6 py-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#7A6458]">Khách hàng</p>
            <h2 className="font-playfair text-xl font-bold text-[#2C1A14]">{contact.name}</h2>
            <p className="mt-0.5 text-xs text-[#7A6458]">Gửi lúc {formatDateTime(contact.createdAt)}</p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Đóng"
            className="rounded-lg p-1.5 text-[#7A6458] hover:bg-[#F4ECE1]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6 px-6 py-6 text-sm text-[#2C1A14]">
          <section>
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#7A6458]">Liên hệ nhanh</h3>
            <div className="space-y-2">
              {phone && (
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                    className="inline-flex flex-1 items-center gap-2 rounded-xl bg-[#8C3A21] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#A95A32]"
                  >
                    <Phone size={15} /> Gọi {phone}
                  </a>
                  <button
                    onClick={copyPhone}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5D7C7] bg-white px-3 py-2.5 text-xs font-semibold hover:bg-[#F4ECE1]"
                  >
                    {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    {copied ? "Đã chép" : "Sao chép"}
                  </button>
                </div>
              )}
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 rounded-xl border border-[#E5D7C7] bg-white px-4 py-2.5 text-sm font-medium hover:bg-[#F4ECE1]"
                >
                  <Mail size={15} className="text-[#8C3A21]" />
                  <span className="break-all">{contact.email}</span>
                </a>
              )}
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#7A6458]">Lời nhắn</h3>
            <span className="mb-2 inline-block rounded-full border border-[#E5D7C7] bg-[#F4ECE1] px-2.5 py-0.5 text-[11px] font-medium">
              {contact.topic}
            </span>
            <p className="whitespace-pre-line break-words rounded-xl border border-[#EADFCF] bg-white p-4 text-[13px] leading-relaxed text-[#2C1A14]">
              {contact.message}
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#7A6458]">Trạng thái xử lý</h3>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(STATUS_META) as ContactStatus[]).map((s) => {
                const active = contact.status === s;
                return (
                  <button
                    key={s}
                    onClick={() => !active && onUpdate(contact._id, { status: s })}
                    aria-pressed={active}
                    className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition ${
                      active ? STATUS_META[s].badge + " ring-2 ring-[#8C3A21]/20" : "border-[#E5D7C7] bg-white hover:bg-[#F4ECE1]"
                    }`}
                  >
                    {STATUS_META[s].label}
                  </button>
                );
              })}
            </div>
            <dl className="mt-3 space-y-1 text-xs text-[#7A6458]">
              <div className="flex justify-between">
                <dt>Liên hệ lần đầu</dt>
                <dd className="font-medium text-[#2C1A14]">{formatDateTime(contact.contactedAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Cập nhật trạng thái gần nhất</dt>
                <dd className="font-medium text-[#2C1A14]">{formatDateTime(contact.statusUpdatedAt)}</dd>
              </div>
            </dl>
          </section>

          <section>
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#7A6458]">
              Ghi chú nội bộ <span className="font-normal normal-case">(khách không nhìn thấy)</span>
            </h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={1000}
              rows={4}
              placeholder="Ví dụ: Đã gọi lúc 10h, hẹn gọi lại chiều mai..."
              className="w-full rounded-xl border border-[#E5D7C7] bg-white px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#8C3A21]/40"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] text-[#7A6458]">{note.length}/1000</span>
              <button
                onClick={saveNote}
                disabled={!dirty || saving}
                className="rounded-lg bg-[#8C3A21] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#A95A32] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Đang lưu..." : "Lưu ghi chú"}
              </button>
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
