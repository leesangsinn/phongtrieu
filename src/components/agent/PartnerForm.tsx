"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";

const EMAIL = "mamdisanphongtrieu@gmail.com";
const types = ["Cửa hàng thực phẩm", "Đại lý bán lẻ", "Nhà phân phối", "Nhà hàng HORECA", "Khác"];

const field =
  "w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-primary/40";
const label = "mb-1.5 block text-sm font-medium text-foreground";

export default function PartnerForm() {
  const [sent, setSent] = useState(false);

  // Chưa có backend: mở ứng dụng email của người dùng với nội dung điền sẵn
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const body = [
      `Họ và tên: ${d.get("name")}`,
      `Số điện thoại: ${d.get("phone")}`,
      `Hình thức hợp tác: ${d.get("type")}`,
      `Tỉnh / Thành phố kinh doanh: ${d.get("city")}`,
      `Ghi chú: ${d.get("note") || "(không có)"}`,
    ].join("\n");
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
      "Đăng ký hợp tác phân phối Phong Triều"
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
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
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-primary py-3 font-bold text-white transition-all hover:bg-accent-secondary"
      >
        <Send size={16} />
        Đăng ký hợp tác ngay
      </button>
      {sent && (
        <p className="text-center text-sm" role="status">
          Ứng dụng email đã được mở với thông tin của bạn. Hãy bấm gửi để hoàn tất, hoặc liên hệ trực tiếp
          qua {EMAIL}.
        </p>
      )}
    </form>
  );
}
