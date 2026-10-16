"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  src: string;
  alt: string;
  caption: string;
}

// Thứ tự kể chuyện: ra khơi → đánh bắt → cá về → phơi cá → muối → ủ chượp trong chum
const SLIDES: Slide[] = [
  { src: "/cauchuyen5.jpg", alt: "Thuyền đánh cá neo đậu dưới bầu trời hoàng hôn", caption: "Gió đưa thuyền vươn khơi" },
  { src: "/cauchuyen3.jpg", alt: "Ngư dân quăng lưới trên mặt nước lúc hoàng hôn", caption: "Quăng lưới theo con nước" },
  { src: "/cauchuyen2.jpg", alt: "Ngư dân kéo lưới trên bãi biển lúc bình minh", caption: "Mẻ cá đầu ngày" },
  { src: "/cauchuyen7.jpg", alt: "Thúng chai đầy cá nhìn từ trên cao", caption: "Cá tươi về bến" },
  { src: "/cauchuyen8.jpg", alt: "Đàn thuyền đánh cá nhìn từ trên cao", caption: "Một vùng biển, bao mùa cá" },
  { src: "/cauchuyen6.jpg", alt: "Người phụ nữ phơi cá trên những khung tre", caption: "Nắng gió làm nên vị mặn" },
  { src: "/cauchuyen1.jpg", alt: "Người dân gánh muối dưới ánh hoàng hôn", caption: "Muối của biển" },
  { src: "/cauchuyen4.jpg", alt: "Người thợ khuấy chượp giữa hàng chum sành", caption: "Ủ chượp bền bỉ theo thời gian" },
];

const AUTOPLAY_MS = 4500;
const SWIPE_THRESHOLD = 40;

/**
 * Carousel ảnh không khung: ảnh chuyển mờ dần, tự chạy liên tục.
 * Chỉ tạm dừng khi rê chuột vào; mũi tên chỉ hiện khi rê chuột (luôn hiện trên thiết bị cảm ứng).
 */
export default function StoryCarousel() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const total = SLIDES.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  // Tự chuyển ảnh. Đặt lại bộ đếm mỗi khi đổi ảnh (kể cả khi người dùng bấm) để ảnh nào cũng được xem đủ lâu.
  useEffect(() => {
    if (hovered || reducedMotion) return;
    const timer = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [hovered, reducedMotion, next, index]);

  const onTouchEnd = (clientX: number) => {
    if (touchStartX.current === null) return;
    const delta = clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) next();
    else prev();
  };

  // Trên máy có chuột: ẩn mũi tên cho đến khi rê vào. Trên cảm ứng: luôn hiện (nhưng mờ).
  const navButton =
    "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-foreground shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white focus-visible:outline-none [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:focus-visible:opacity-100";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Hình ảnh nghề làm nước mắm vùng biển"
      className="group mx-auto w-full max-w-md lg:max-w-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }}
    >
      <div
        className="relative aspect-[4/5] w-full touch-pan-y overflow-hidden rounded-[1.75rem] bg-surface shadow-[0_24px_60px_-20px_rgba(61,40,23,0.35)]"
        onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => onTouchEnd(e.changedTouches[0].clientX)}
      >
        {/* Các ảnh xếp chồng, ảnh hiện tại mờ dần lên và zoom chậm */}
        {SLIDES.map((slide, i) => {
          const active = i === index;
          return (
            <div
              key={slide.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${total}`}
              aria-hidden={!active}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out motion-reduce:transition-none ${
                active ? "z-[1] opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(max-width: 1024px) 90vw, 34vw"
                className={`object-cover transition-transform ease-out motion-reduce:transition-none ${
                  active ? "scale-100 duration-[6000ms]" : "scale-[1.08] duration-0"
                }`}
                priority={i === 0}
              />
            </div>
          );
        })}

        {/* Lớp chuyển màu mờ dần ở đáy ảnh chứa chú thích và chấm chỉ báo */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32 bg-gradient-to-t from-[#2C1A14]/70 via-[#2C1A14]/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-[3] flex items-end justify-between gap-4 px-5 pb-4">
          <p key={index} aria-live="polite" className="animate-fade-up font-playfair text-base italic text-white drop-shadow">
            {SLIDES[index].caption}
          </p>
          <div className="flex shrink-0 items-center gap-1.5 pb-1.5">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Xem ảnh ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/45 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>

        <button type="button" onClick={prev} aria-label="Ảnh trước" className={`${navButton} left-3`}>
          <ChevronLeft size={20} />
        </button>
        <button type="button" onClick={next} aria-label="Ảnh kế tiếp" className={`${navButton} right-3`}>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
