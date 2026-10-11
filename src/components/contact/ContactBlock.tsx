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
  const [checked, setChecked] = useState(false);

  const pick = (id: string) => {
    setTopic(id);
    setChecked(false);
    document.getElementById("loi-nhan")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setChecked(true);
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
              Điền thông tin bên dưới, chúng tôi sẽ tiếp nhận yêu cầu qua hệ thống liên hệ của thương hiệu khi
              website được kết nối.
            </p>
            <form onSubmit={onSubmit} className="grid gap-5">
              <div>
                <label htmlFor="ct-name" className={label}>Họ và tên</label>
                <input id="ct-name" name="name" required className={field} placeholder="Nguyễn Văn A" autoComplete="name" />
              </div>
              <div>
                <label htmlFor="ct-contact" className={label}>Số điện thoại hoặc email</label>
                <input id="ct-contact" name="contact" required className={field} placeholder="09xx xxx xxx hoặc email@example.com" />
              </div>
              <div>
                <label htmlFor="ct-topic" className={label}>Bạn muốn trao đổi về</label>
                <select
                  id="ct-topic"
                  name="topic"
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    setChecked(false);
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
                <textarea id="ct-message" name="message" required rows={5} className={field} placeholder="Bạn muốn Phong Triều lắng nghe điều gì?" />
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-primary py-3 font-bold text-white transition-all hover:bg-accent-secondary"
              >
                <ShieldCheck size={17} />
                Kiểm tra thông tin
              </button>
              {checked && (
                <p className="flex items-start gap-2 rounded-xl bg-surface px-4 py-3 text-sm text-foreground" role="status">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary" />
                  Thông tin hợp lệ. Biểu mẫu này là bản minh họa giao diện, chưa gửi thông tin đến doanh nghiệp.
                </p>
              )}
              <p className="text-center text-xs">
                Biểu mẫu này là bản minh họa giao diện, chưa gửi thông tin đến doanh nghiệp.
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
