"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Share2, PlayCircle, Camera } from "lucide-react";

const navLinks = [
  { href: "#home", label: "Trang chủ" },
  { href: "#story", label: "Câu chuyện" },
  { href: "#products", label: "Sản phẩm" },
  { href: "#news", label: "Tin tức" },
  { href: "#distribute", label: "Phân phối" },
  { href: "#contact", label: "Liên hệ" },
];

const products = [
  "Nước mắm Di Sản",
  "Nước mắm Thanh Vị",
  "Nước mắm Dưỡng Vị",
  "Bộ quà tặng cao cấp",
];

const socials = [
  { icon: Share2, label: "Facebook", href: "#" },
  { icon: PlayCircle, label: "YouTube", href: "#" },
  { icon: Camera, label: "Instagram", href: "#" },
];

export default function Footer() {
  const handleNavClick = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="bg-foreground text-white relative overflow-hidden">
      {/* Decorative background texture */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(180,83,9,0.4) 0%, transparent 50%),
                             radial-gradient(circle at 80% 50%, rgba(21,128,61,0.3) 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="relative z-10">
        {/* ===== MAIN FOOTER CONTENT ===== */}
        <div className="container-custom py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-card">
                  <Image alt="Phong Triều Logo" className="object-cover w-full h-full" height={120} src="/logo.jpg" width={120}/>
                </div>
                <div>
                  <p className="font-lora font-bold text-xl text-white leading-tight">
                    Phong Triều
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                    Nước mắm truyền thống
                  </p>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Giữ gìn hương vị biển cả qua từng giọt mắm — từ truyền thống
                cha ông đến bàn ăn gia đình Việt.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socials.map(({ icon: Icon, label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-9 h-9 rounded-full bg-card/10 hover:bg-primary flex items-center justify-center
                               transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow"
                  >
                    <Icon size={16} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Navigation Column */}
            <div>
              <h4 className="font-lora font-semibold text-base text-white mb-5 pb-3 border-b border-white/10">
                Điều hướng
              </h4>
              <ul className="space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => handleNavClick(link.href)}
                      className="text-white/60 hover:text-primary text-sm transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products Column */}
            <div>
              <h4 className="font-lora font-semibold text-base text-white mb-5 pb-3 border-b border-white/10">
                Sản phẩm
              </h4>
              <ul className="space-y-2.5">
                {products.map((product) => (
                  <li key={product}>
                    <Link
                      href="#products"
                      onClick={() => handleNavClick("#products")}
                      className="text-white/60 hover:text-primary text-sm transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                      {product}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h4 className="font-lora font-semibold text-base text-white mb-5 pb-3 border-b border-white/10">
                Liên hệ
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                  <span className="text-white/60 text-sm leading-relaxed">
                    cập nhật
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-primary shrink-0" />
                  <a
                    href="tel:0979425607"
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    0979 425 607
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-primary shrink-0" />
                  <a
                    href="mailto:mamdisanphongtrieu@gmail.com"
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    mamdisanphongtrieu@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ===== BOTTOM BAR ===== */}
        <div className="border-t border-white/10">
          <div className="container-custom py-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
              <p>
                © {new Date().getFullYear()} Phong Triều. Tất cả quyền được bảo lưu.
              </p>
              <div className="flex items-center gap-4">
                <Link href="#" className="hover:text-white/70 transition-colors">
                  Chính sách bảo mật
                </Link>
                <span>·</span>
                <Link href="#" className="hover:text-white/70 transition-colors">
                  Điều khoản sử dụng
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
