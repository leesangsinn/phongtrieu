"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ChevronDown, Leaf, RotateCcw, SkipForward, Waves } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero "Hành trình của một con cá cơm": biển → thùng chượp → giọt mắm → mâm cơm quê → Phong Triều.
 * Dựng từ ảnh tĩnh bằng timeline GSAP (~12 giây): camera luôn trôi cùng một hướng (trái → phải) để tạo cảm giác
 * "match movement", các chuyển cảnh dùng xoáy nước, gợn sóng và ánh hổ phách thay vì cắt cứng.
 * Thay các ảnh trong SCENES bằng ảnh/video độ phân giải cao hơn khi có.
 */
const SCENES = [
  { key: "sea", src: "/hero/sea.jpg", alt: "Đàn cá cơm bơi dưới mặt biển có ánh nắng xuyên qua", position: "50% 40%" },
  { key: "pour", src: "/hero/pour.jpg", alt: "Cá cơm được đổ vào thùng chượp truyền thống", position: "50% 50%" },
  { key: "barrels", src: "/hero/barrels.jpg", alt: "Những thùng chượp gỗ lớn trong nhà ủ", position: "50% 50%" },
  { key: "drop", src: "/doi-moi-co-chon-loc.jpg", alt: "Giọt nước mắm cốt rơi vào chén", position: "60% 60%" },
] as const;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const idleRef = useRef<gsap.core.Tween[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const startIdle = () => {
        idleRef.current.forEach((t) => t.kill());
        idleRef.current = [
          // Chuyển động nhẹ như gió sau khi hành trình kết thúc
          gsap.to(".hero-meal-float", { y: -10, duration: 3.2, ease: "sine.inOut", repeat: -1, yoyo: true }),
          gsap.fromTo(".hero-mascot-float", { y: -15 }, { y: 15, duration: 2, ease: "sine.inOut", repeat: -1, yoyo: true }),
          gsap.to(".scene-drop .scene-cam", { scale: 1.12, xPercent: 1.5, duration: 9, ease: "sine.inOut", repeat: -1, yoyo: true }),
        ];
      };

      // ─── 1. TIMELINE HÀNH TRÌNH ───────────────────────────────────
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onUpdate: () => {
          if (progressRef.current) progressRef.current.style.transform = `scaleX(${tl.progress()})`;
        },
        onComplete: () => {
          setDone(true);
          startIdle();
        },
      });
      timelineRef.current = tl;

      // Trạng thái đầu
      tl.set(".hero-scene", { opacity: 0, rotate: 0, scale: 1, filter: "none" }, 0)
        .set(".scene-sea", { opacity: 1 }, 0)
        .set(".hero-overlay", { opacity: 0.3 }, 0)
        .set(".hero-text-element, .hero-mascot, .hero-scroll-cta", { opacity: 0 }, 0)
        .set(".hero-meal", { opacity: 0 }, 0)
        .set(".hero-amber", { opacity: 0 }, 0)
        .set(".hero-rings span", { opacity: 0 }, 0);

      // CẢNH 1 · 0–2.4s · BIỂN — camera bơi theo đàn cá (trôi sang phải), tia nắng lay động
      tl.fromTo(".scene-sea .scene-cam", { scale: 1.08, xPercent: -3 }, { scale: 1.2, xPercent: 3, duration: 3.6, ease: "none" }, 0)
        .fromTo(".hero-rays", { opacity: 0 }, { opacity: 0.55, duration: 1.2 }, 0)
        .to(".hero-rays", { xPercent: 8, duration: 3, ease: "sine.inOut" }, 0)
        .fromTo(".hero-cap-sea", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.5)
        .to(".hero-cap-sea", { opacity: 0, y: -12, duration: 0.6 }, 2.0);

      // CẢNH 2 · 2.4–3.9s · XOÁY NƯỚC — vùng nước xoáy kéo cảnh biển vào thùng chượp
      tl.to(".hero-rays", { opacity: 0, duration: 0.8 }, 2.4)
        .to(".scene-sea", { opacity: 0, rotate: 9, scale: 1.4, filter: "blur(10px)", duration: 1.5 }, 2.4)
        .fromTo(
          ".scene-pour",
          { opacity: 0, rotate: -10, scale: 1.35, filter: "blur(12px)" },
          { opacity: 1, rotate: 0, scale: 1, filter: "blur(0px)", duration: 1.5 },
          2.5
        )
        .to(".hero-amber", { opacity: 0.35, duration: 1.4 }, 3.0);

      // CẢNH 3 · 3.9–6.4s · THÙNG CHƯỢP — cá, muối, chượp; camera tiến chậm rồi kéo rộng ra
      tl.fromTo(".scene-pour .scene-cam", { scale: 1.02, xPercent: -2 }, { scale: 1.14, xPercent: 2, duration: 3, ease: "none" }, 3.4)
        .fromTo(
          ".scene-barrels",
          { opacity: 0, scale: 1.3 },
          { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" },
          5.4
        )
        .to(".scene-pour", { opacity: 0, duration: 1.2 }, 5.9)
        .fromTo(".scene-barrels .scene-cam", { scale: 1.02, xPercent: -2 }, { scale: 1.1, xPercent: 2, duration: 3, ease: "none" }, 5.6);

      // CẢNH 4 · 6.4–8.6s · THỜI GIAN → GIỌT MẮM — ánh hổ phách tràn lên rồi tan vào cận cảnh giọt mắm
      tl.to(".hero-amber", { opacity: 0.85, duration: 0.9, ease: "power1.in" }, 7.1)
        .fromTo(
          ".scene-drop",
          { opacity: 0, scale: 1.25 },
          { opacity: 1, scale: 1, duration: 1.3, ease: "power2.out" },
          7.6
        )
        .to(".scene-barrels", { opacity: 0, duration: 0.9 }, 7.7)
        .to(".hero-amber", { opacity: 0, duration: 1.3 }, 8.2)
        .fromTo(".scene-drop .scene-cam", { scale: 1.1, xPercent: -2 }, { scale: 1.2, xPercent: 2, duration: 3.4, ease: "none" }, 7.6);

      // CẢNH 5 · 8.6–10.2s · "TÕM" — giọt mắm tạo gợn sóng lan rộng
      tl.fromTo(
        ".hero-rings span",
        { opacity: 0.9, scale: 0.15 },
        { opacity: 0, scale: 3.2, duration: 1.9, stagger: 0.28, ease: "power2.out" },
        8.7
      );

      // CẢNH 6 · 9.9–12s · VỀ VỚI VỊ QUÊ — gợn sóng mở ra mâm cơm; lời chào xuất hiện
      tl.to(".hero-overlay", { opacity: 1, duration: 1.8 }, 9.5)
        .fromTo(
          ".hero-meal",
          { opacity: 1, clipPath: "circle(0% at 50% 50%)", scale: 0.88 },
          { clipPath: "circle(75% at 50% 50%)", scale: 1, duration: 1.6, ease: "power2.out" },
          9.9
        )
        .fromTo(".hero-meal-cam", { scale: 1.35, xPercent: -3 }, { scale: 1, xPercent: 0, duration: 3, ease: "power2.out" }, 9.9)
        .fromTo(
          ".hero-text-element",
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" },
          10.2
        )
        // CẢNH 7 · 10.5–12s · PHONG TRIỀU — linh vật và lời mời khám phá
        .fromTo(".hero-mascot", { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, 11.2)
        .to(".hero-scroll-cta", { opacity: 1, duration: 0.8 }, 11.8);

      // Người dùng giảm chuyển động: nhảy thẳng tới khung cuối, không chạy hiệu ứng
      if (reduceMotion) tl.progress(1);

      // ─── 2. PARALLAX BACKGROUND khi scroll ────────────────────────
      if (bgImageRef.current) {
        gsap.to(bgImageRef.current, {
          yPercent: 30,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
        });
      }

      // ─── 3. SCROLL CTA BUTTON fade out ────────────────────────────
      gsap.to(".hero-scroll-cta-wrap", {
        opacity: 0,
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "20% top", scrub: true },
      });
    }, sectionRef);

    return () => {
      idleRef.current.forEach((t) => t.kill());
      ctx.revert(); // cleanup — tránh memory leak
    };
  }, []);

  const skip = () => timelineRef.current?.progress(1);
  const replay = () => {
    idleRef.current.forEach((t) => t.kill());
    idleRef.current = [];
    setDone(false);
    timelineRef.current?.restart();
  };

  const scrollToIntro = () => {
    document.getElementById("intro")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#06202e]"
    >
      {/* ─── CÁC CẢNH TRONG HÀNH TRÌNH + PARALLAX ─────────────────── */}
      <div ref={bgImageRef} className="absolute inset-0 w-full h-[130%] -top-[15%]">
        {SCENES.map((scene, i) => (
          // Cảnh biển hiện ngay từ HTML đầu tiên (không chờ JS) để trang không bị trống
          <div
            key={scene.key}
            className={`hero-scene scene-${scene.key} absolute inset-0 will-change-transform ${i === 0 ? "opacity-100" : "opacity-0"}`}
          >
            <div className="scene-cam absolute inset-0 will-change-transform">
              <Image
                src={scene.src}
                alt={scene.alt}
                fill
                sizes="100vw"
                quality={85}
                priority={i === 0}
                className="object-cover"
                style={{ objectPosition: scene.position }}
              />
            </div>
          </div>
        ))}

        {/* Tia nắng xuyên mặt nước (chỉ ở cảnh biển) */}
        <div
          className="hero-rays pointer-events-none absolute -inset-x-[10%] inset-y-0 opacity-0 mix-blend-screen"
          style={{
            background:
              "repeating-linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.16) 5%, rgba(255,255,255,0) 11%, rgba(255,255,255,0) 17%)",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 75%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 75%)",
          }}
        />

        {/* Ánh hổ phách: chuyển từ biển sang chượp, rồi sang giọt mắm */}
        <div
          className="hero-amber pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light"
          style={{ background: "radial-gradient(circle at 50% 55%, rgba(255,170,60,0.95) 0%, rgba(190,90,20,0.75) 60%, rgba(90,40,10,0.7) 100%)" }}
        />

        {/* Gợn sóng khi giọt mắm rơi */}
        <div className="hero-rings pointer-events-none absolute left-[56%] top-[62%] h-0 w-0">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute -left-40 -top-40 block h-80 w-80 rounded-full border border-white/70 opacity-0"
              style={{ boxShadow: "0 0 24px rgba(255,220,160,0.35)" }}
            />
          ))}
        </div>
      </div>

      {/* ─── OVERLAY GRADIENT (đậm dần khi chữ xuất hiện) ──────────── */}
      <div
        className="hero-overlay absolute inset-0 opacity-30"
        style={{
          background:
            "linear-gradient(to right, rgba(44,26,20,0.9) 0%, rgba(122, 2, 33,0.5) 100%)",
        }}
      />

      {/* Decorative top vignette */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-deep-brown/40 to-transparent" />

      {/* ─── CHỮ DẪN CẢNH ĐẦU: "Từ biển..." ───────────────────────── */}
      <p
        aria-hidden
        className="hero-cap-sea pointer-events-none absolute left-0 right-0 top-1/2 z-10 -translate-y-1/2 opacity-0"
      >
        <span className="container-custom block font-playfair text-5xl italic text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)] md:text-6xl xl:text-7xl">
          Từ biển...
        </span>
      </p>

      {/* ─── MÂM CƠM QUÊ (đoạn kết) ────────────────────────────────── */}
      <div className="hero-meal opacity-0 pointer-events-none absolute right-[7%] top-1/2 z-[5] hidden w-[min(34vw,460px)] -translate-y-1/2 lg:block">
        <div className="hero-meal-float">
          <div className="relative aspect-square overflow-hidden rounded-[32px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/20">
            <div className="hero-meal-cam absolute inset-0">
              <Image
                src="/cauchuyen-triet-ly.jpg"
                alt="Mâm cơm quê với chai nước mắm Phong Triều Thanh Vị"
                fill
                sizes="(max-width: 1500px) 34vw, 460px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ──────────────────────────────────────────── */}
      <div className="relative z-10 w-full">
        <div className="container-custom py-32 md:py-40">
          <div className="max-w-3xl flex flex-col justify-center">

            {/* ─── CỘT TRÁI: TEXT CONTENT ──────────────────────────── */}
            <div className="flex flex-col items-start">

              {/* Badge */}
              <div className="hero-text-element opacity-0 flex items-center gap-2.5 mb-6 px-4 py-2 rounded-full border border-white/25 bg-card/10 backdrop-blur-sm">
                <Leaf size={14} className="text-accent-soft" />
                <span className="text-accent-soft text-xs font-epilogue font-semibold uppercase tracking-[0.15em]">
                  Mắm Phong Triều
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="hero-text-element opacity-0 font-playfair text-4xl sm:text-5xl xl:text-6xl font-bold text-white leading-[1.1] mb-6">
                Gió đưa vị biển,{" "}
                <em className="text-accent-soft font-playfair italic block mt-1">
                  quyện về vị quê.
                </em>
              </h1>

              {/* Description */}
              <p className="hero-text-element opacity-0 font-epilogue text-base text-white/75 max-w-[500px] leading-relaxed mb-8">
                Từ cá cơm vùng biển Nghệ An, qua thời gian ủ chượp truyền thống, chắt lọc nên vị mắm đậm đà và hậu vị ngọt thanh.
              </p>

              {/* CTA Buttons */}
              <div className="hero-text-element opacity-0 flex flex-wrap gap-4 mb-4">
                <Link
                  href="/san-pham"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full
                             bg-accent-primary hover:bg-accent-secondary text-white
                             font-epilogue font-semibold text-sm tracking-wide
                             transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow"
                >
                  <span>Khám phá sản phẩm</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/cau-chuyen"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full
                             border-2 border-white/50 hover:border-white text-white
                             font-epilogue font-semibold text-sm tracking-wide
                             transition-all duration-300 hover:bg-card/10 hover:-translate-y-0.5"
                >
                  <Waves size={16} />
                  <span>Câu chuyện Phong Triều</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── LINH VẬT ──────────────────────────────────────────────── */}
      <div className="hero-mascot opacity-0 hidden lg:block absolute right-[6%] bottom-[14%] z-10 w-[min(20vw,300px)] pointer-events-none">
        <Image
          src="/linh-vat-cutout.png"
          alt="Linh vật cá Phong Triều cầm chai nước mắm"
          width={776}
          height={898}
          sizes="(max-width: 1500px) 20vw, 300px"
          className="hero-mascot-float drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)]"
        />
      </div>

      {/* ─── ĐIỀU KHIỂN HÀNH TRÌNH: bỏ qua / xem lại ──────────────── */}
      <div className="absolute bottom-24 right-5 z-20 md:right-8">
        {done ? (
          <button
            type="button"
            onClick={replay}
            className="flex items-center gap-2 rounded-full border border-white/30 bg-black/25 px-4 py-2 text-xs font-epilogue font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm transition-colors hover:bg-black/45 hover:text-white"
          >
            <RotateCcw size={14} /> Xem lại
          </button>
        ) : (
          <button
            type="button"
            onClick={skip}
            className="flex items-center gap-2 rounded-full border border-white/30 bg-black/25 px-4 py-2 text-xs font-epilogue font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm transition-colors hover:bg-black/45 hover:text-white"
          >
            Bỏ qua <SkipForward size={14} />
          </button>
        )}
      </div>

      {/* ─── SCROLL DOWN CTA ───────────────────────────────────────── */}
      <div className="hero-scroll-cta-wrap absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
        <button
          onClick={scrollToIntro}
          className="hero-scroll-cta opacity-0 flex flex-col items-center gap-2 text-white/50 hover:text-white
                     transition-colors duration-300 group"
          aria-label="Cuộn xuống"
        >
          <span className="font-epilogue text-xs uppercase tracking-widest">
            Khám phá
          </span>
          <ChevronDown
            size={20}
            className="animate-bounce group-hover:text-accent-soft transition-colors"
          />
        </button>
      </div>

      {/* ─── THANH TIẾN TRÌNH HÀNH TRÌNH ───────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-[3px] bg-white/10">
        <div ref={progressRef} className="h-full origin-left scale-x-0 bg-accent-soft/80" />
      </div>

      {/* ─── BOTTOM FADE ───────────────────────────────────────────── */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
