import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Share2, PlayCircle, Camera } from "lucide-react";
import { navLinks } from "@/lib/nav";

const socials = [
  { icon: Share2, label: "Facebook", href: "#" },
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: PlayCircle, label: "YouTube", href: "#" },
];

export default function Footer() {
  const half = Math.ceil(navLinks.length / 2);
  const columns = [navLinks.slice(0, half), navLinks.slice(half)];

  return (
    <footer className="relative bg-earth-dark text-background">
      {/* Viền lượn sóng phân cách với thân trang */}
      <svg
        className="absolute left-0 right-0 -top-[39px] w-full h-10 text-earth-dark"
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0 40V22C120 6 240 0 360 8c160 10 260 28 420 26 160-2 260-30 420-30 90 0 170 8 240 20v16H0Z"
        />
      </svg>

      <div className="container-custom pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1.2fr_1fr_1.2fr] gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-background/40 bg-card">
                <Image
                  alt="Phong Triều Logo"
                  className="object-cover w-full h-full"
                  height={120}
                  src="/logo.jpg"
                  width={120}
                />
              </div>
              <div className="leading-tight">
                <p className="font-playfair font-bold text-xl text-background">Phong Triều</p>
                <p className="text-xs tracking-wide text-background/70">Vị biển · Tình quê</p>
              </div>
            </Link>
            <p className="font-playfair italic text-background/70 max-w-xs">
              Gió đưa vị biển, quyện về vị quê.
            </p>
          </div>

          {/* Menu */}
          <div className="grid grid-cols-2 gap-6">
            {columns.map((col, i) => (
              <ul key={i} className="space-y-3">
                {col.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-background/80 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>

          {/* Social */}
          <div>
            <h4 className="font-playfair font-semibold text-background mb-4">Theo dõi chúng tôi</h4>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-background/10 hover:bg-background hover:text-earth-dark flex items-center justify-center transition-colors"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-playfair font-semibold text-background mb-4">Liên hệ</h4>
            <ul className="space-y-3 text-sm text-background/80">
              <li>
                <a
                  href="mailto:mamdisanphongtrieu@gmail.com"
                  className="flex items-center gap-2.5 hover:text-white break-all"
                >
                  <Mail size={16} className="shrink-0" />
                  mamdisanphongtrieu@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:0979425607" className="flex items-center gap-2.5 hover:text-white">
                  <Phone size={16} className="shrink-0" />
                  0979 425 607
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-background/15">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/80">
          <p>© {new Date().getFullYear()} Phong Triều. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-background">
              Chính sách bảo mật
            </Link>
            <span>·</span>
            <Link href="#" className="hover:text-background">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
