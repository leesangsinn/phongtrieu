"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, Send, Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "bot" | "user";
  text: string;
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "bot",
    text: "Xin chào! Tôi là trợ lý AI của Phong Triều 🐟 Tôi có thể giúp bạn tìm hiểu về sản phẩm, đặt hàng hoặc tư vấn loại nước mắm phù hợp!",
    time: "", // gán sau khi mount để không lệch giữa server và client
  },
];

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const now = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => prev.map((m) => (m.time ? m : { ...m, time: now })));
  }, []);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input.trim(),
      time: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response (placeholder for real API integration)
    setTimeout(() => {
      const botReplies: Record<string, string> = {
        mắm: "Phong Triều có 3 dòng sản phẩm: Di Sản, Thanh Vị và Dưỡng Vị. Bạn muốn tìm hiểu dòng nào?",
        giá: "Bạn vui lòng liên hệ hotline 0979 425 607 để được báo giá và tư vấn đặt số lượng lớn nhé!",
        "đặt hàng": "Bạn có thể gửi lời nhắn qua trang Liên hệ hoặc gọi hotline 0979 425 607 để được hỗ trợ đặt hàng.",
        default:
          "Cảm ơn bạn đã quan tâm! Vui lòng để lại thông tin qua trang Liên hệ hoặc gọi hotline 0979 425 607 để được tư vấn chi tiết.",
      };

      const lower = userMsg.text.toLowerCase();
      const reply =
        Object.entries(botReplies).find(([key]) => key !== "default" && lower.includes(key))?.[1] ||
        botReplies.default;

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          text: reply,
          time: new Date().toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 1200);
  };

  return (
    <>
      {/* ===== CHAT WINDOW ===== */}
      <div
        className={cn(
          "fixed bottom-24 right-4 sm:right-6 z-50 w-[340px] sm:w-[380px]",
          "transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-90 translate-y-4 pointer-events-none"
        )}
      >
        <div className="bg-card rounded-3xl shadow-sm overflow-hidden border border-primary/10">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-deep-brown to-primary p-4 flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-cream overflow-hidden shrink-0">
              <Image
                src="/linh-vat-cutout.png"
                alt="Bé Cá Phong Triều"
                fill
                sizes="40px"
                className="object-contain p-0.5"
              />
            </div>
            <div className="flex-1">
              <p className="font-epilogue font-semibold text-white text-sm">
                Bé Cá Phong Triều
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-white/70 text-xs">đang gõ...</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* AI Badge */}
          <div className="px-4 py-2 bg-primary/5 border-b border-primary/10">
            <div className="flex items-center gap-1.5 text-xs text-primary font-epilogue">
              <Sparkles size={12} />
              <span>Được hỗ trợ bởi AI — Tích hợp đầy đủ ở Phase tiếp theo</span>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[280px] overflow-y-auto p-4 space-y-3 bg-background">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {msg.role === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-auto">
                    <Bot size={14} className="text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    msg.role === "bot"
                      ? "bg-card text-foreground rounded-tl-sm shadow-sm border border-primary/5"
                      : "bg-primary text-white rounded-tr-sm"
                  )}
                >
                  <p className={msg.role === "bot" ? "text-foreground" : "text-white"}>{msg.text}</p>
                  <p
                    className={cn(
                      "text-[10px] mt-1",
                      msg.role === "bot" ? "text-text-muted" : "text-white/75"
                    )}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2 items-end">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-primary" />
                </div>
                <div className="bg-card rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-primary/5">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-text-muted animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-primary/10 bg-card">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 text-sm text-foreground placeholder:text-text-muted bg-background
                           rounded-full px-4 py-2.5 outline-none border border-primary/15
                           focus:border-primary transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-9 h-9 rounded-full bg-primary hover:bg-primary-hover transition-colors duration-300
                           flex items-center justify-center text-white transition-all duration-200
                           disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ===== FAB BUTTON ===== */}
      <button
        id="chatbot-fab"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Mở chatbot hỗ trợ"
        className={cn(
          "fixed bottom-6 right-4 sm:right-6 z-50",
          "w-14 h-14 rounded-full",
          "transition-transform duration-300",
          "hover:scale-110 active:scale-95"
        )}
      >
        {/* Linh vật (đóng) / nút đóng (mở) */}
        <div className={cn("relative w-full h-full", !isOpen && "animate-bounce")}>
          <div
            className={cn(
              "absolute inset-0 rounded-full overflow-hidden bg-cream border-2 border-white shadow-md transition-all duration-300",
              isOpen ? "opacity-0 scale-75" : "opacity-100 scale-100"
            )}
          >
            <Image
              src="/linh-vat-cutout.png"
              alt=""
              fill
              sizes="56px"
              className="rounded-full object-contain p-1"
            />
          </div>
          <div
            className={cn(
              "absolute inset-0 rounded-full bg-gradient-to-br from-primary to-deep-brown shadow-md flex items-center justify-center transition-all duration-300",
              isOpen ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-75 rotate-90"
            )}
          >
            <X size={22} className="text-white" />
          </div>
        </div>
      </button>
    </>
  );
}
