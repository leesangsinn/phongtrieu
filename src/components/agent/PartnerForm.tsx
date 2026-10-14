"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";

const types = ["Cửa hàng thực phẩm", "Đại lý bán lẻ", "Nhà phân phối", "Nhà hàng HORECA", "Khác"];

const field =
  "w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-primary/40";
const label = "mb-1.5 block text-sm font-medium text-foreground";

export default function PartnerForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    const form = e.currentTarget;
    const d = new FormData(form);

    try {
      const res = await fetch("/api/leads/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: d.get("name"),
          phone: d.get("phone"),
          type: d.get("type"),
          city: d.get("city"),
          note: d.get("note") || "",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Không thể gửi đăng ký đối tác.");
      }

      setSent(true);
      form.reset();
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "Đã xảy ra lỗi khi gửi đăng ký.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="pf-name" className={label}>
            Họ và tên <span className="text-primary">*</span>
          </label>
          <input id="pf-name" name="name" required className={field} placeholder="Nguyễn Văn A" autoComplete="name" />
        </div>
        <div>
          <label htmlFor="pf-phone" className={label}>
            Số điện thoại <span className="text-primary">*</span>
          </label>
          <input
            id="pf-phone"
            name="phone"
            type="tel"
            required
            pattern="[0-9+\s.\-]{9,15}"
            title="Nhập số điện thoại hợp lệ"
            className={field}
            placeholder="09xx xxx xxx"
            autoComplete="tel"
          />
        </div>
        <div>
          <label htmlFor="pf-type" className={label}>
            Hình thức hợp tác <span className="text-primary">*</span>
          </label>
          <select id="pf-type" name="type" required defaultValue="" className={field}>
            <option value="" disabled>
              Chọn hình thức hợp tác
            </option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="pf-city" className={label}>
            Tỉnh / Thành phố kinh doanh <span className="text-primary">*</span>
          </label>
          <input id="pf-city" name="city" required className={field} placeholder="Ví dụ: Nghệ An" autoComplete="address-level1" />
        </div>
      </div>
      <div>
        <label htmlFor="pf-note" className={label}>
          Ghi chú nhu cầu hợp tác
        </label>
        <textarea id="pf-note" name="note" rows={4} className={field} placeholder="Chia sẻ nhu cầu, khu vực hoặc quy mô bạn quan tâm" />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-primary py-3 font-bold text-white transition-all hover:bg-accent-secondary disabled:opacity-60"
      >
        <Send size={16} />
        {submitting ? "Đang gửi đăng ký..." : "Đăng ký hợp tác ngay"}
      </button>
      {sent && (
        <p className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-center text-sm text-emerald-800" role="status">
          Cảm ơn bạn! Đăng ký hợp tác của bạn đã được ghi nhận vào hệ thống Phong Triều. Chúng tôi sẽ sớm liên hệ qua số điện thoại đã cung cấp!
        </p>
      )}
      {errorMsg && (
        <p className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-center text-sm text-rose-800" role="alert">
          {errorMsg}
        </p>
      )}
    </form>
  );
}
