"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Tài khoản hoặc mật khẩu không chính xác.");
      }

      // Phiên đăng nhập nằm trong cookie httpOnly do máy chủ cấp, không lưu gì ở trình duyệt

      // Redirect to Admin QR management
      router.push("/admin/qr");
      router.refresh();
    } catch (err: unknown) {
      const errorObj = err as Error;
      setErrorMessage(errorObj.message || "Đã xảy ra lỗi khi đăng nhập.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FCF9F2] via-[#F6EDE2] to-[#EBE0D2] text-[#2C1A14] flex items-center justify-center p-4 selection:bg-[#7A0221]/20">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-[#7A0221]/5 border border-[#EADFCF] relative overflow-hidden">
          {/* Subtle top brand accent line */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#7A0221] via-[#9C1A36] to-[#7A0221]" />

          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7A0221] to-[#5A0119] text-white flex items-center justify-center mx-auto shadow-md shadow-[#7A0221]/20">
              <ShieldCheck size={32} />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#7A0221]/10 text-[#7A0221] border border-[#7A0221]/15">
                <Sparkles size={12} />
                Quản Trị Thương Hiệu
              </span>
              <h1 className="font-playfair text-2xl md:text-3xl font-bold text-[#2C1A14] mt-2">
                Hệ Thống Quản Trị
              </h1>
              <p className="text-xs text-[#7A6458] mt-1 font-medium">
                Nước Mắm Truyền Thống Phong Triều
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div
              className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5 shadow-xs"
              role="alert"
            >
              <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="block text-xs font-semibold uppercase tracking-wider text-[#7A6458]"
              >
                Tài khoản quản trị
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6458]"
                />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập (VD: admin)"
                  className="w-full bg-[#FCF9F2] border border-[#E5D7C7] rounded-xl pl-10 pr-4 py-3 text-sm text-[#2C1A14] placeholder-[#7A6458]/60 focus:outline-none focus:ring-2 focus:ring-[#7A0221]/30 focus:border-[#7A0221] transition"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-[#7A6458]"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A6458]"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu quản trị"
                  className="w-full bg-[#FCF9F2] border border-[#E5D7C7] rounded-xl pl-10 pr-11 py-3 text-sm text-[#2C1A14] placeholder-[#7A6458]/60 focus:outline-none focus:ring-2 focus:ring-[#7A0221]/30 focus:border-[#7A0221] transition"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A6458] hover:text-[#2C1A14] transition p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#7A0221] to-[#9C1A36] hover:from-[#5A0119] hover:to-[#7A0221] text-white font-semibold text-sm shadow-md shadow-[#7A0221]/20 transition-all transform active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Đăng Nhập Quản Trị</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 pt-6 border-t border-[#F0E6DA] text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A6458] hover:text-[#7A0221] transition"
            >
              <ArrowLeft size={14} />
              <span>Quay lại trang chủ Phong Triều</span>
            </Link>
          </div>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-[#7A6458] mt-4">
          Bảo mật nội bộ &bull; Dành riêng cho ban quản trị thương hiệu Phong Triều
        </p>
      </div>
    </div>
  );
}
