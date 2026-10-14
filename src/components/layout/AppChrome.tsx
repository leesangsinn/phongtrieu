"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingChatbot from "@/components/layout/FloatingChatbot";
import FloatingMascot from "@/components/layout/FloatingMascot";

interface AppChromeProps {
  children: React.ReactNode;
}

/**
 * AppChrome controls the global site chrome (Navbar, Footer, Floating widgets).
 * Automatically excludes all public chrome elements when navigating to /admin/*
 * to prevent layout overlapping and design conflicts.
 */
export default function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    // Render clean content without website Navbar, Footer or Floating mascots
    return <>{children}</>;
  }

  return (
    <>
      {/* Global Public Navigation */}
      <Navbar />

      {/* Main Public Page Content */}
      <main className="min-h-screen">{children}</main>

      {/* Global Public Footer */}
      <Footer />

      {/* Floating AI Chatbot */}
      <FloatingChatbot />

      {/* Floating Mascot */}
      <FloatingMascot />
    </>
  );
}
