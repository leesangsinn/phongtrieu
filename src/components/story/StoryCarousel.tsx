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

const AUTOPLAY_MS = 5500;
const SWIPE_THRESHOLD = 40;

/** Khung ảnh in cổ điển, trượt ngang, có nút điều hướng, chấm chỉ báo, vuốt trên điện thoại và tự chạy. */
export default function StoryCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
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

  // Tự chuyển ảnh; dừng khi rê chuột/focus vào khung hoặc khi người dùng giảm chuyển động
  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, next, index]);

  const onTouchEnd = (clientX: number) => {
    if (touchStartX.current === null) return;
    const delta = clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) next();
    else prev();
  };

  const navButton =
    "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white focus-visible:outline-none";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Hình ảnh nghề làm nước mắm vùng biển"
      className="mx-auto w-full max-w-md rotate-[-1.5deg] transition-transform duration-500 hover:rotate-0 lg:max-w-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }}
    >
      <div className="rounded-sm bg-white p-3 pb-4 shadow-xl">
        <div
          className="relative aspect-[4/5] w-full touch-pan-y overflow-hidden rounded-sm bg-surface"
          onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => onTouchEnd(e.changedTouches[0].clientX)}
        >
          {/* Dải ảnh trượt ngang */}
          <div
            className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {SLIDES.map((slide, i) => (
              <div
                key={slide.src}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${total}`}
                aria-hidden={i !== index}
                className="relative h-full w-full shrink-0"
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 1024px) 90vw, 34vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          {/* Lớp tối nhẹ ở đáy để số thứ tự luôn đọc được trên ảnh sáng */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
          <span className="pointer-events-none absolute bottom-3 right-4 font-playfair text-sm tracking-widest text-white/90">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>

          <button type="button" onClick={prev} aria-label="Ảnh trước" className={`${navButton} left-2`}>
            <ChevronLeft size={20} />
          </button>
          <button type="button" onClick={next} aria-label="Ảnh kế tiếp" className={`${navButton} right-2`}>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Chú thích kiểu ảnh in + chấm chỉ báo */}
        <div className="mt-3 flex items-center justify-between gap-4 px-1">
          <p key={index} aria-live="polite" className="font-playfair text-[15px] italic text-primary animate-fade-up">
            {SLIDES[index].caption}
          </p>
          <div className="flex shrink-0 items-center gap-1.5">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Xem ảnh ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-5 bg-primary" : "w-2 bg-primary/25 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
