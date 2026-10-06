import type { Metadata } from "next";
import { Lora, Epilogue } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingChatbot from "@/components/layout/FloatingChatbot";

// ===== FONT CONFIGURATION =====
const lora = Lora({
  subsets: ["latin", "vietnamese"],
  variable: "--font-lora",
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
export const metadata: Metadata = {
  title: {
    default: "Phong Triều — Nước mắm truyền thống Huế",
    template: "%s | Phong Triều",
  },
  description:
    "Phong Triều — Nước mắm truyền thống từ biển Huế. Hương vị thuần khiết, giữ gìn di sản cha ông qua từng giọt mắm. Đặt hàng ngay hôm nay!",
  keywords: [
    "nước mắm",
    "nước mắm Huế",
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
    url: "https://phongtrieufish.vn",
    siteName: "Phong Triều",
    title: "Phong Triều — Nước mắm truyền thống Huế",
    description:
      "Hương vị thuần khiết từ biển cả — Giữ gìn di sản nghề mắm truyền thống",
  },
  twitter: {
    card: "summary_large_image",
    title: "Phong Triều — Nước mắm truyền thống Huế",
    description: "Hương vị thuần khiết từ biển cả Huế",
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
      className={`${lora.variable} ${epilogue.variable}`}
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
      </body>
    </html>
  );
}
