"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#home", label: "Trang chủ" },
  { href: "#story", label: "Câu chuyện" },
  { href: "#products", label: "Sản phẩm" },
  { href: "#news", label: "Tin tức" },
  { href: "#distribute", label: "Phân phối" },
  { href: "#contact", label: "Liên hệ" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Detect scroll to switch navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);

      // Active section tracking
      const sections = ["home", "story", "products", "news", "distribute", "contact"];
      const current = sections.find((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* ===== LOGO ===== */}
          <Link
            href="#home"
            onClick={() => handleNavClick("#home")}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-card">
              <Image alt="Phong Triều Logo" className="object-cover w-full h-full" height={120} src="/logo.jpg" width={120}/>
            </div>
            <div className="leading-tight">
              <span
                className={cn(
                  "block font-lora font-bold text-lg transition-colors duration-300",
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
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
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
                </button>
              );
            })}
          </div>

          {/* ===== CTA BUTTON + MOBILE TOGGLE ===== */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick("#contact")}
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
            </button>

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
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl font-epilogue text-sm font-medium",
                    "transition-all duration-200 mb-1",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-cream hover:text-primary"
                  )}
                >
                  {link.label}
                </button>
              );
            })}
            <div className="pt-3 border-t border-primary/10 mt-2">
              <button
                onClick={() => handleNavClick("#contact")}
                className="w-full btn-primary justify-center"
              >
                <ShoppingBag size={16} />
                Đặt hàng ngay
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
