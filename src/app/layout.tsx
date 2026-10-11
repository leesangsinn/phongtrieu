import type { Metadata } from "next";
import { Playfair_Display, Epilogue } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingChatbot from "@/components/layout/FloatingChatbot";
import FloatingMascot from "@/components/layout/FloatingMascot";

// ===== FONT CONFIGURATION =====
const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const epilogue = Epilogue({
  subsets: ["latin", "vietnamese"],
  variable: "--font-epilogue",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// ===== SEO METADATA =====
// Đặt NEXT_PUBLIC_SITE_URL (vd. https://tenmiencuaban.vn) khi có tên miền chính thức
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Phong Triều — Nước mắm truyền thống Nghệ An",
    template: "%s | Phong Triều",
  },
  description:
    "Phong Triều — Nước mắm truyền thống từ biển Nghệ An. Hương vị thuần khiết, giữ gìn di sản cha ông qua từng giọt mắm. Đặt hàng ngay hôm nay!",
  keywords: [
    "nước mắm",
    "nước mắm Nghệ An",
    "nước mắm cốt Nghệ An",
    "nước mắm truyền thống",
    "Phong Triều",
    "mắm nhĩ",
    "nước mắm ngon",
  ],
  authors: [{ name: "Phong Triều" }],
  creator: "Phong Triều",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Phong Triều",
    title: "Phong Triều — Nước mắm truyền thống Nghệ An",
    description:
      "Hương vị thuần khiết từ biển cả — Giữ gìn di sản nghề mắm truyền thống",
  },
  twitter: {
    card: "summary_large_image",
    title: "Phong Triều — Nước mắm truyền thống Nghệ An",
    description: "Hương vị thuần khiết từ biển cả Nghệ An",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${playfair.variable} ${epilogue.variable}`}
    >
      <body className="font-epilogue antialiased bg-background text-foreground">
        {/* Global Navigation */}
        <Navbar />

        {/* Page Content */}
        <main className="min-h-screen">{children}</main>

        {/* Global Footer */}
        <Footer />

        {/* Floating AI Chatbot FAB */}
        <FloatingChatbot />

        {/* Cursor-tracking mascot */}
        <FloatingMascot />
      </body>
    </html>
  );
}
