"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Waves } from "lucide-react";

const SLIDES = [
  { src: "/lienhe1.jpg", alt: "Ngư dân khiêng thúng chai vào bờ", caption: "Ngư dân đưa thúng chai vào bờ" },
  { src: "/lienhe2.jpg", alt: "Người làm muối cào muối trên đồi muối trắng", caption: "Mùa muối trắng" },
  { src: "/lienhe3.jpg", alt: "Người thợ chăm những hàng chum ủ nước mắm", caption: "Những hàng chum ủ mắm" },
  { src: "/lienhe4.jpg", alt: "Ngư dân kéo lưới lúc hoàng hôn", caption: "Kéo lưới lúc chiều về" },
];

const AUTOPLAY_MS = 4500;
const SWIPE_THRESHOLD = 40;

/** Vị trí tương đối so với ảnh đang xem: 0 = giữa, -1 = trái, 1 = phải, còn lại ẩn phía sau */
function offsetOf(i: number, index: number, total: number) {
  let d = (i - index + total) % total;
  if (d > total / 2) d -= total;
  return d;
}

/** Băng ảnh kiểu coverflow: ảnh giữa nổi bật, hai ảnh bên lùi về sau; tự chạy, có nút, chấm, vuốt */
export default function ContactGallery() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const total = SLIDES.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Tự chuyển ảnh; dừng khi rê chuột vào. Đếm lại từ đầu sau mỗi lần đổi ảnh.
  useEffect(() => {
    if (hovered || reducedMotion) return;
    const timer = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [hovered, reducedMotion, next, index]);

  const navButton =
    "absolute top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-foreground shadow-md transition-colors hover:bg-primary hover:text-white focus-visible:bg-primary focus-visible:text-white focus-visible:outline-none";

  return (
    <section className="overflow-hidden bg-surface pt-16 md:pt-24">
      <div className="container-custom">
        <div data-reveal className="mb-10 text-center">
          <span className="section-label !text-sm justify-center">
            <Waves size={16} />
            Từ làng biển
          </span>
          <h2 className="font-playfair text-3xl leading-tight text-foreground md:text-4xl">
            Nơi vị mắm bắt đầu
          </h2>
        </div>
      </div>

      {/* Băng ảnh trải hết chiều ngang để ảnh bên và mũi tên có chỗ */}
        <div
          data-reveal="0.1"
          role="region"
          aria-roledescription="carousel"
          aria-label="Hình ảnh làng biển và nghề làm mắm"
          className="relative mx-auto h-[var(--h)] touch-pan-y"
          // Chiều cao ảnh giữa; nút mũi tên đặt ngay ngoài mép hai ảnh bên (ảnh rộng = cao × 4/3)
          style={{ ["--h" as string]: "clamp(230px, 36vw, 460px)" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
          }}
          onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const delta = e.changedTouches[0].clientX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(delta) < SWIPE_THRESHOLD) return;
            if (delta < 0) next();
            else prev();
          }}
        >
          {SLIDES.map((slide, i) => {
            const d = offsetOf(i, index, total);
            const isActive = d === 0;
            const isSide = Math.abs(d) === 1;
            // Ảnh bên lùi sang hai phía và nhỏ lại; ảnh còn lại nằm khuất sau ảnh giữa
            const x = isActive ? 0 : isSide ? d * 62 : 0;
            const scale = isActive ? 1 : isSide ? 0.8 : 0.6;
            return (
              <button
                key={slide.src}
                type="button"
                tabIndex={isSide ? 0 : -1}
                aria-hidden={!isActive && !isSide}
                aria-label={isActive ? slide.alt : `Xem ảnh: ${slide.alt}`}
                onClick={() => !isActive && setIndex(i)}
                className={`absolute left-1/2 top-0 aspect-[4/3] h-full overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_-24px_rgba(44,26,20,0.45)] transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  isActive ? "z-30 cursor-default" : isSide ? "z-20 cursor-pointer" : "pointer-events-none z-10"
                }`}
                style={{
                  transform: `translateX(calc(-50% + ${x}%)) scale(${scale})`,
                  opacity: isActive ? 1 : isSide ? 1 : 0,
                }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 768px) 85vw, 680px"
                  className="object-cover"
                  priority={i === 0}
                />
                {/* Ảnh bên phủ lớp sáng nhạt cho lùi về sau */}
                <span
                  className={`pointer-events-none absolute inset-0 bg-surface transition-opacity duration-700 ${
                    isActive ? "opacity-0" : "opacity-45"
                  }`}
                />
                {/* Chú thích ảnh giữa */}
                <span
                  className={`pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-[#2C1A14]/70 via-[#2C1A14]/20 to-transparent px-6 pb-5 pt-16 text-left transition-opacity duration-700 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="font-playfair text-lg italic text-white drop-shadow md:text-xl">{slide.caption}</span>
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={prev}
            aria-label="Ảnh trước"
            className={navButton}
            style={{ left: "max(4px, calc(50% - var(--h) * 1.36 - 64px))" }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Ảnh kế tiếp"
            className={navButton}
            style={{ right: "max(4px, calc(50% - var(--h) * 1.36 - 64px))" }}
          >
            <ChevronRight size={20} />
          </button>
        </div>

      <div className="container-custom">
        <div className="mt-6 flex justify-center gap-2">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Xem ảnh ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === index ? "w-6 bg-primary" : "w-2 bg-primary/25 hover:bg-primary/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
