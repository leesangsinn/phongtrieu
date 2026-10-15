"use client";

import { useState } from "react";
import { Loader2, Phone, X } from "lucide-react";

interface Props {
  /** Nội dung gợi ý điền sẵn (thường là các câu hỏi gần nhất của khách). */
  defaultNote: string;
  onDone: (text: string) => void;
  onCancel: () => void;
}

const FIELD =
  "w-full text-sm text-foreground placeholder:text-text-muted bg-background rounded-xl px-3 py-2 outline-none border border-primary/15 focus:border-primary transition-colors";

/** Form để lại thông tin ngay trong khung chat. Gửi qua cùng API với trang Liên hệ (lưu DB + email cho Sale). */
export default function ChatLeadForm({ defaultNote, onDone, onCancel }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState(defaultNote);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/leads/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          phone,
          topic: "Tư vấn sản phẩm",
          message: `[Từ chatbot] ${note.trim() || "Khách nhờ nhân viên liên hệ tư vấn."}`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        onDone("Cảm ơn bạn! Phong Triều đã nhận thông tin và sẽ liên hệ lại sớm. Cần gấp bạn có thể gọi hotline 0979 425 607 nhé.");
        return;
      }
      setError(typeof data.message === "string" ? data.message : "Chưa gửi được, vui lòng thử lại.");
    } catch {
      setError("Mất kết nối, vui lòng thử lại hoặc gọi hotline 0979 425 607.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-primary/15 bg-card p-3 space-y-2 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
          <Phone size={12} /> Để nhân viên gọi lại cho bạn
        </p>
        <button type="button" onClick={onCancel} aria-label="Đóng form" className="text-text-muted hover:text-foreground">
          <X size={14} />
        </button>
      </div>
      <input
        className={FIELD}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Họ tên"
        maxLength={100}
        required
        autoComplete="name"
      />
      <input
        className={FIELD}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Số điện thoại"
        type="tel"
        maxLength={30}
        required
        autoComplete="tel"
      />
      <textarea
        className={`${FIELD} resize-none`}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Bạn cần tư vấn gì? (không bắt buộc)"
        rows={2}
        maxLength={900}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={busy || !name.trim() || !phone.trim()}
        className="w-full rounded-full bg-primary hover:bg-primary-hover text-white text-sm py-2 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {busy && <Loader2 size={14} className="animate-spin" />}
        Gửi thông tin
      </button>
      <p className="text-[10px] text-text-muted">Chúng tôi chỉ dùng thông tin này để liên hệ tư vấn.</p>
    </form>
  );
}
