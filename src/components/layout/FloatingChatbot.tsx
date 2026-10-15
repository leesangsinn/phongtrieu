"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Send, Bot, Sparkles, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatLeadForm from "@/components/layout/ChatLeadForm";

interface Message {
  id: string;
  role: "bot" | "user";
  text: string;
  time: string;
  /** Bài viết dùng làm nguồn cho câu trả lời (chỉ có ở tin nhắn của bot) */
  sources?: { title: string; slug: string }[];
  /** Bot không chắc hoặc khách cần người thật: hiện nút gọi hotline */
  handoff?: boolean;
}

/** Câu hỏi gợi ý hiện khi khách chưa hỏi gì */
const QUICK_QUESTIONS = [
  "Nên chọn Di Sản, Thanh Vị hay Dưỡng Vị?",
  "Kiểm tra hàng thật bằng QR thế nào?",
  "Cho mình báo giá mua số lượng lớn",
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "bot",
    text: "Xin chào! Mình là Bé Cá, trợ lý của Phong Triều 🐟 Bạn có thể hỏi mình về nước mắm, cách chọn mua, cách pha nước chấm, cách bảo quản, đọc nhãn, mã QR...",
    time: "", // gán sau khi mount để không lệch giữa server và client
  },
];

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const now = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) => prev.map((m) => (m.time ? m : { ...m, time: now })));
  }, []);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, leadOpen]);

  const nowTime = () => new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  // Dự phòng khi trợ lý AI không phản hồi được: luôn dẫn khách tới hotline thay vì để họ chờ vô ích
  const FALLBACK_REPLY =
    "Xin lỗi, hiện mình chưa trả lời được câu hỏi này. Bạn vui lòng gọi hotline 0979 425 607 hoặc gửi lời nhắn ở trang Liên hệ để đội ngũ Phong Triều hỗ trợ nhé!";

  const send = async (raw: string) => {
    const question = raw.trim();
    if (!question || isTyping) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text: question, time: nowTime() };
    // Gửi kèm vài lượt gần nhất (không gồm lời chào ban đầu) để bot hiểu câu hỏi nối tiếp
    const history = messages
      .filter((m) => m.id !== "1")
      .slice(-6)
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, userMsg]);
    setSuggestions([]);
    setInput("");
    setIsTyping(true);

    let botMsg: Message;
    let askLead = false;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, history }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success && typeof data.reply === "string") {
        botMsg = { id: `b-${Date.now()}`, role: "bot", text: data.reply, time: nowTime(), sources: data.sources };
        askLead = data.askLead === true;
        botMsg.handoff = data.handoff === true;
        if (Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions.filter((q: unknown): q is string => typeof q === "string").slice(0, 3));
        }
      } else {
        // 429: hiển thị đúng thông báo của máy chủ; lỗi khác: dùng câu dự phòng
        const text = res.status === 429 && data.message ? data.message : FALLBACK_REPLY;
        botMsg = { id: `b-${Date.now()}`, role: "bot", text, time: nowTime(), handoff: true };
      }
    } catch {
      botMsg = { id: `b-${Date.now()}`, role: "bot", text: FALLBACK_REPLY, time: nowTime(), handoff: true };
    }

    setIsTyping(false);
    setMessages((prev) => [...prev, botMsg]);
    if (askLead) setLeadOpen(true);
  };

  const handleSend = () => send(input);

  // Điền sẵn nội dung khách đã hỏi để nhân viên nắm nhu cầu khi gọi lại
  const leadNote = messages
    .filter((m) => m.role === "user")
    .slice(-3)
    .map((m) => m.text)
    .join(" / ")
    .slice(0, 600);

  const finishLead = (text: string) => {
    setLeadOpen(false);
    setMessages((prev) => [...prev, { id: `b-${Date.now()}`, role: "bot", text, time: nowTime() }]);
  };

  return (
    <>
      {/* ===== CHAT WINDOW ===== */}
      <div
        className={cn(
          "fixed bottom-24 right-4 sm:right-6 z-50 w-[340px] sm:w-[380px]",
          "transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          isOpen
            ? "visible opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "invisible opacity-0 scale-90 translate-y-4 pointer-events-none"
        )}
        id="chatbot-window"
        role="dialog"
        aria-label="Trò chuyện với Bé Cá Phong Triều"
        aria-hidden={!isOpen}
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
                <span className="text-white/70 text-xs">{isTyping ? "đang gõ..." : "trực tuyến"}</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Đóng khung trò chuyện"
              className="text-white/70 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* AI Badge */}
          <div className="px-4 py-2 bg-primary/5 border-b border-primary/10">
            <div className="flex items-center gap-1.5 text-xs text-primary font-epilogue">
              <Sparkles size={12} />
              <span>Trả lời tự động từ tài liệu của Phong Triều, có thể chưa đầy đủ. Cần chắc chắn hãy gọi hotline 0979 425 607.</span>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[280px] overflow-y-auto p-4 space-y-3 bg-background" aria-live="polite">
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
                  <p className={cn("whitespace-pre-line break-words", msg.role === "bot" ? "text-foreground" : "text-white")}>
                    {msg.text}
                  </p>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 border-t border-primary/10 pt-2 text-xs">
                      <span className="text-text-muted">Xem thêm: </span>
                      {msg.sources.map((src, i) => (
                        <span key={src.slug}>
                          {i > 0 && " · "}
                          <Link href={`/tin-tuc/${src.slug}`} className="font-medium text-primary underline underline-offset-2">
                            {src.title}
                          </Link>
                        </span>
                      ))}
                    </div>
                  )}
                  {msg.handoff && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <a
                        href="tel:0979425607"
                        className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-white hover:bg-primary-hover transition-colors"
                      >
                        <Phone size={12} /> Gọi 0979 425 607
                      </a>
                      {!leadOpen && (
                        <button
                          type="button"
                          onClick={() => setLeadOpen(true)}
                          className="rounded-full border border-primary/30 px-2.5 py-1 text-xs text-primary hover:bg-primary/5 transition-colors"
                        >
                          Nhờ nhân viên gọi lại
                        </button>
                      )}
                    </div>
                  )}
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
            {leadOpen && <ChatLeadForm defaultNote={leadNote} onDone={finishLead} onCancel={() => setLeadOpen(false)} />}
            <div ref={messagesEndRef} />
          </div>

          {/* Gợi ý nhanh + nút để lại thông tin */}
          {!leadOpen && (
            <div className="px-3 pt-2 bg-card border-t border-primary/10 flex flex-wrap gap-1.5">
              {(messages.length <= 1 ? QUICK_QUESTIONS : suggestions).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    disabled={isTyping}
                    className="text-xs text-primary border border-primary/25 rounded-full px-2.5 py-1 hover:bg-primary/5 transition-colors disabled:opacity-40"
                  >
                    {q}
                  </button>
                ))}
              <button
                type="button"
                onClick={() => setLeadOpen(true)}
                className="text-xs text-white bg-primary hover:bg-primary-hover rounded-full px-2.5 py-1 transition-colors"
              >
                Để lại thông tin để được gọi lại
              </button>
            </div>
          )}

          {/* Input */}
          <div className="p-3 bg-card" style={leadOpen ? { borderTop: "1px solid rgb(0 0 0 / 0.06)" } : undefined}>
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
                maxLength={500}
                aria-label="Câu hỏi của bạn"
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 text-sm text-foreground placeholder:text-text-muted bg-background
                           rounded-full px-4 py-2.5 outline-none border border-primary/15
                           focus:border-primary transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                aria-label="Gửi câu hỏi"
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
        aria-label={isOpen ? "Đóng chatbot hỗ trợ" : "Mở chatbot hỗ trợ"}
        aria-expanded={isOpen}
        aria-controls="chatbot-window"
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
