"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  QrCode,
  MessageSquare,
  Handshake,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "Quản lý Mã QR",
    href: "/admin/qr",
    icon: QrCode,
  },
  {
    name: "Khách hàng Liên hệ",
    href: "/admin/contacts",
    icon: MessageSquare,
  },
  {
    name: "Đối tác Đại lý",
    href: "/admin/partners",
    icon: Handshake,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const isLoginPage = pathname === "/admin/login";

  // Việc xác thực do middleware (src/middleware.ts) bảo đảm ở phía máy chủ: không có phiên hợp lệ
  // thì request không bao giờ tới được layout này, nên ở đây chỉ cần bỏ trạng thái "đang kiểm tra".
  useEffect(() => {
    setIsAuthenticated(true);
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.replace("/admin/login");
  };

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  // If on login page, render full screen without admin sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading spinner while checking auth
  if (isAuthenticated === null || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FCF9F2] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#8A2E1B]/20 border-t-[#8A2E1B] animate-spin mb-3" />
        <p className="font-playfair text-lg text-[#2C1A14] font-semibold">
          Kiểm tra quyền truy cập quản trị...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCF9F2] text-[#2C1A14] flex flex-col md:flex-row antialiased font-epilogue">
      {/* ───────── MOBILE TOP BAR ───────── */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#2C1A14] text-[#FCF9F2] sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#8A2E1B] flex items-center justify-center text-white font-bold text-sm">
            PT
          </div>
          <span className="font-playfair font-bold tracking-wide text-white text-base">
            Phong Triều Admin
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-[#EADFCF] hover:text-white rounded-lg hover:bg-white/10 transition"
          aria-label="Toggle Menu"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* ───────── SIDEBAR NAVIGATION (Nâu sậm truyền thống #2C1A14) ───────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-[#2C1A14] text-[#FCF9F2] flex flex-col
          transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0
          shadow-xl
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand Logo Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8A2E1B] to-[#A95A32] flex items-center justify-center shadow-md shadow-black/30 group-hover:scale-105 transition">
              <ShieldCheck className="text-white" size={22} />
            </div>
            <div>
              <h1 className="font-playfair font-bold text-lg tracking-wide text-white leading-tight">
                Phong Triều
              </h1>
              <p className="text-[10px] text-[#E9B98A] font-bold tracking-widest uppercase mt-0.5">
                Hệ Thống Quản Trị
              </p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-[#EADFCF] hover:text-white p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#A8988C]">
            Menu Quản Lý
          </div>
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group
                  ${
                    active
                      ? "bg-[#8A2E1B] text-white shadow-md shadow-[#8A2E1B]/30 font-semibold"
                      : "text-[#E8DCD0] hover:text-white hover:bg-white/8"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={`transition-colors ${
                      active ? "text-white" : "text-[#D3C3B3] group-hover:text-white"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {active && <ChevronRight size={14} className="text-white/80" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 text-xs font-semibold text-[#E8DCD0] hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition"
          >
            <ExternalLink size={14} />
            <span>Xem Trang Chủ Website</span>
          </Link>

          {/* User profile & Logout */}
          <div className="flex items-center justify-between pt-2 px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#8A2E1B] flex items-center justify-center text-xs font-bold text-white shadow-xs">
                AD
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  Admin Quản Trị
                </p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Đang hoạt động
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-[#D3C3B3] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
              title="Đăng xuất quản trị"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
        />
      )}

      {/* ───────── MAIN CONTENT AREA (Nền kem sáng #FCF9F2) ───────── */}
      <main className="flex-1 min-w-0 bg-[#FCF9F2] min-h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
