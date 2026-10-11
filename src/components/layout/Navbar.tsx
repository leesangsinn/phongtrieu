"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, ShoppingBag } from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { navLinks, isActivePath } from "@/lib/nav";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Chỉ trang chủ có hero tối full-screen -> navbar trong suốt; các trang khác luôn dùng nền sáng
  const isScrolled = scrolled || pathname !== "/";
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // ----- Linh vật chạy theo tab đang active (desktop) -----
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const mascotRef = useRef<HTMLDivElement>(null); // lớp ngoài: trục x
  const hopRef = useRef<HTMLDivElement>(null); // lớp giữa: nảy y khi di chuyển
  const mascotImgRef = useRef<HTMLImageElement>(null); // lớp trong: lật mặt + idle
  const mascotX = useRef<number | null>(null);
  const activeIndex = navLinks.findIndex((l) => isActivePath(pathname, l.href));

  useEffect(() => {
    const mascot = mascotRef.current;
    const hop = hopRef.current;
    const img = mascotImgRef.current;
    const tab = tabRefs.current[activeIndex];
    if (!mascot || !hop || !img) return;

    // Trang không thuộc menu (404...) -> ẩn linh vật
    if (!tab) {
      gsap.set(mascot, { autoAlpha: 0 });
      mascotX.current = null;
      return;
    }

    const targetX = () => tab.offsetLeft + tab.offsetWidth / 2 - mascot.offsetWidth / 2;

    const ctx = gsap.context(() => {
      const startIdle = () =>
        gsap.to(img, { y: -3, duration: 1.5, ease: "sine.inOut", yoyo: true, repeat: -1 });

      if (mascotX.current === null) {
        // Lần đầu: đặt thẳng vào tab, không animate
        gsap.set(mascot, { x: targetX(), autoAlpha: 1 });
        mascotX.current = targetX();
        startIdle();
        return;
      }

      const from = mascotX.current;
      const to = targetX();
      gsap.set(mascot, { autoAlpha: 1 });
      if (to === from) {
        startIdle();
        return;
      }

      // Đi sang trái -> lật mặt, sang phải -> giữ nguyên
      gsap.set(img, { scaleX: to < from ? -1 : 1 });

      const dist = Math.abs(to - from);
      const duration = Math.min(1.1, 0.5 + dist / 1200);
      gsap
        .timeline({
          onComplete: () => {
            mascotX.current = to;
            startIdle();
          },
        })
        .to(mascot, { x: to, duration, ease: "power2.inOut" }, 0)
        // Nảy lên rồi đáp xuống (cung parabol)
        .to(hop, { y: -6, duration: duration / 2, ease: "power2.out" }, 0)
        .to(hop, { y: 0, duration: duration / 2, ease: "power2.in" }, duration / 2);
    }, tabsRef);

    // Giữ linh vật đúng tab khi đổi kích thước cửa sổ
    const onResize = () => {
      gsap.set(mascot, { x: targetX() });
      mascotX.current = targetX();
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
      gsap.killTweensOf([mascot, hop, img]);
      gsap.set(img, { y: 0 });
      gsap.set(hop, { y: 0 });
    };
  }, [activeIndex]);

  // Detect scroll to switch navbar style
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Đóng menu mobile khi chuyển trang
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "glass-light shadow-sm border-b border-primary/10"
          : "bg-transparent border-b border-white/10"
      )}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20 lg:h-[88px]">
          {/* ===== LOGO ===== */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-card">
              <Image alt="Phong Triều Logo" className="object-cover w-full h-full" height={120} src="/logo.jpg" width={120}/>
            </div>
            <div className="leading-tight">
              <span
                className={cn(
                  "block font-playfair font-bold text-lg transition-colors duration-300",
                  isScrolled ? "text-foreground" : "text-white"
                )}
              >
                Phong Triều
              </span>
              <span
                className={cn(
                  "block text-[10px] uppercase tracking-[0.2em] font-epilogue transition-colors duration-300",
                  isScrolled ? "text-text-muted" : "text-white/70"
                )}
              >
                Nước mắm truyền thống
              </span>
            </div>
          </Link>

          {/* ===== DESKTOP NAV LINKS ===== */}
          <div ref={tabsRef} className="relative hidden lg:flex items-center gap-1">
            {/* Linh vật bé cá chạy theo tab active (chỉ hiện từ lg trở lên) */}
            <div
              ref={mascotRef}
              className="invisible absolute left-0 -top-[26px] z-10 w-7 pointer-events-none"
              aria-hidden
            >
              <div ref={hopRef}>
                <Image
                  ref={mascotImgRef}
                  alt="Mascot"
                  src="/linh-vat-cutout.png"
                  width={776}
                  height={898}
                  sizes="28px"
                  className="w-7 h-auto drop-shadow-md"
                />
              </div>
            </div>
            {navLinks.map((link, i) => {
              const isActive = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  className={cn(
                    "relative px-4 py-2 font-epilogue text-sm font-medium rounded-full transition-all duration-300",
                    isScrolled
                      ? isActive
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:text-primary hover:bg-primary/5"
                      : isActive
                        ? "text-white bg-card/20"
                        : "text-white/80 hover:text-white hover:bg-card/10"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ===== CTA BUTTON + MOBILE TOGGLE ===== */}
          <div className="flex items-center gap-3">
            <Link
              href="/lien-he"
              className={cn(
                "hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full",
                "font-epilogue font-semibold text-sm tracking-wide",
                "transition-all duration-300 hover:-translate-y-0.5",
                isScrolled
                  ? "bg-primary text-white hover:bg-primary-hover transition-colors duration-300 hover:shadow-glow"
                  : "bg-card text-foreground hover:bg-cream hover:shadow-sm"
              )}
            >
              <ShoppingBag size={15} />
              <span>Đặt hàng</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className={cn(
                "lg:hidden p-2 rounded-lg transition-colors duration-300",
                isScrolled
                  ? "text-foreground hover:bg-primary/10"
                  : "text-white hover:bg-card/10"
              )}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ===== MOBILE MENU ===== */}
        <div
          ref={mobileMenuRef}
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-500 ease-in-out",
            isMobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="glass-light rounded-2xl mx-0 my-2 p-4 border border-primary/10">
            {navLinks.map((link) => {
              const isActive = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block w-full text-left px-4 py-3 rounded-xl font-epilogue text-sm font-medium",
                    "transition-all duration-200 mb-1",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-cream hover:text-primary"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-primary/10 mt-2">
              <Link href="/lien-he" className="w-full btn-primary justify-center">
                <ShoppingBag size={16} />
                Đặt hàng ngay
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
