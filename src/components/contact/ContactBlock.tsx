"use client";

import { useState, type FormEvent } from "react";
import {
  CheckCircle2,
  Handshake,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  ShieldCheck,
  Waves,
} from "lucide-react";
import { cn } from "@/lib/utils";

const topics = [
  { id: "Tư vấn sản phẩm", icon: MessageCircle, text: "Tìm hiểu các dòng nước mắm và cách lựa chọn phù hợp." },
  { id: "Hợp tác kinh doanh", icon: Handshake, text: "Kết nối đại lý, nhà phân phối và đối tác." },
  { id: "Góp ý và phản hồi", icon: Heart, text: "Chia sẻ trải nghiệm để chúng tôi phục vụ tốt hơn." },
];

// Hotline và email lấy từ Footer; địa chỉ và mạng xã hội chưa có thông tin chính thức
const info = [
  { icon: Phone, label: "Hotline", value: "0979 425 607", href: "tel:0979425607" },
  { icon: Mail, label: "Email", value: "mamdisanphongtrieu@gmail.com", href: "mailto:mamdisanphongtrieu@gmail.com" },
  { icon: MapPin, label: "Địa chỉ", value: "Đang cập nhật" },
  { icon: Share2, label: "Mạng xã hội", value: "Facebook, TikTok chính thức của Phong Triều" },
];

const field =
  "w-full rounded-xl border border-primary/15 bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-primary/40";
const label = "mb-1.5 block text-sm font-medium text-foreground";

export default function ContactBlock() {
  const [topic, setTopic] = useState(topics[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const pick = (id: string) => {
    setTopic(id);
    setSubmitted(false);
    setErrorMsg("");
    document.getElementById("loi-nhan")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/leads/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.get("fullName"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          topic,
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Không thể gửi lời nhắn.");
      }
      setSubmitted(true);
      form.reset();
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "Đã xảy ra lỗi khi gửi lời nhắn.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* ───────── Chúng tôi có thể giúp gì ───────── */}
      <section className="bg-background pb-16 md:pb-20">
        <div className="container-custom">
          <div data-reveal className="mx-auto mb-10 max-w-xl text-center">
            <h2 className="font-playfair text-3xl text-foreground md:text-4xl">Chúng tôi có thể giúp gì cho bạn?</h2>
            <p className="mt-3">Hãy chọn nội dung bạn muốn trao đổi để Phong Triều có thể hỗ trợ đúng nhu cầu.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {topics.map(({ id, icon: Icon, text }, i) => (
              <button
                key={id}
                type="button"
                data-reveal={i * 0.1}
                onClick={() => pick(id)}
                aria-pressed={topic === id}
                className={cn(
                  "group flex flex-col items-start rounded-3xl p-7 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-brand",
                  topic === id ? "bg-white shadow-brand ring-1 ring-primary/30" : "bg-white/70 shadow-sm"
                )}
              >
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-surface transition-colors group-hover:bg-primary/10">
                  <Icon size={26} strokeWidth={1.5} className="text-primary" />
                </span>
                <h3 className="font-playfair text-xl font-bold text-foreground">{id}</h3>
                <p className="mt-2 text-sm">{text}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Thông tin liên hệ + biểu mẫu ───────── */}
      <section id="loi-nhan" className="scroll-mt-24 bg-surface section-padding">
        <div className="container-custom grid items-start gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div data-reveal>
            <span className="section-label !text-sm !mb-5">
              <Waves size={16} />
              Thông tin liên hệ
            </span>
            <h2 className="mb-8 font-playfair text-3xl leading-tight text-foreground md:text-4xl">
              Kết nối cùng Phong Triều
            </h2>
            <div className="grid gap-4">
              {info.map(({ icon: Icon, label: l, value, href }) => {
                const body = (
                  <>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white">
                      <Icon size={22} strokeWidth={1.5} className="text-primary" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">{l}</span>
                      <span className="mt-0.5 block break-words text-foreground">{value}</span>
                    </span>
                  </>
                );
                return href ? (
                  <a key={l} href={href} className="flex items-center gap-4 rounded-2xl bg-white/60 p-4 transition-colors hover:bg-white">
                    {body}
                  </a>
                ) : (
                  <div key={l} className="flex items-center gap-4 rounded-2xl bg-white/60 p-4">
                    {body}
                  </div>
                );
              })}
            </div>
          </div>

          <div data-reveal="0.15" className="rounded-3xl bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-brand md:p-10">
            <h2 className="font-playfair text-2xl text-foreground md:text-3xl">Lời nhắn của bạn</h2>
            <p className="mb-7 mt-3 text-sm">
              Điền thông tin bên dưới, đội ngũ Phong Triều sẽ nhận được lời nhắn của bạn ngay lập tức và
              liên hệ lại sớm nhất.
            </p>
            <form onSubmit={onSubmit} className="grid gap-5">
              <div>
                <label htmlFor="ct-name" className={label}>Họ và tên</label>
                <input id="ct-name" name="fullName" required maxLength={100} className={field} placeholder="Nguyễn Văn A" autoComplete="name" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="ct-phone" className={label}>Số điện thoại</label>
                  <input
                    id="ct-phone"
                    name="phone"
                    type="tel"
                    required
                    maxLength={20}
                    pattern="[0-9+\s\(\)\.\-]{8,20}"
                    title="Nhập số điện thoại hợp lệ"
                    className={field}
                    placeholder="09xx xxx xxx"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <label htmlFor="ct-email" className={label}>
                    Email <span className="font-normal text-text-muted">(không bắt buộc)</span>
                  </label>
                  <input
                    id="ct-email"
                    name="email"
                    type="email"
                    maxLength={254}
                    className={field}
                    placeholder="email@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>
              {/* Ô bẫy chống bot: người dùng không thấy, bot tự động thường điền vào */}
              <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                <label htmlFor="ct-website">Website</label>
                <input id="ct-website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <div>
                <label htmlFor="ct-topic" className={label}>Bạn muốn trao đổi về</label>
                <select
                  id="ct-topic"
                  name="topic"
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    setSubmitted(false);
                  }}
                  className={field}
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>{t.id}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="ct-message" className={label}>Nội dung lời nhắn</label>
                <textarea id="ct-message" name="message" required rows={5} maxLength={2000} className={field} placeholder="Bạn muốn Phong Triều lắng nghe điều gì?" />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-primary py-3 font-bold text-white transition-all hover:bg-accent-secondary disabled:opacity-60"
              >
                <ShieldCheck size={17} />
                {submitting ? "Đang gửi lời nhắn..." : "Gửi lời nhắn ngay"}
              </button>
              {submitted && (
                <p className="flex items-start gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800" role="status">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                  Cảm ơn bạn! Lời nhắn đã được gửi thành công đến Phong Triều. Chúng tôi sẽ phản hồi sớm nhất.
                </p>
              )}
              {errorMsg && (
                <p className="flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-800" role="alert">
                  {errorMsg}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
