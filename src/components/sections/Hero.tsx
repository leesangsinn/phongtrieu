"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ChevronDown, Leaf, Waves } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ─── 1. TIMELINE XUẤT HIỆN BAN ĐẦU ───────────────────────────
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Badge + text stagger (y: 50 → 0, opacity: 0 → 1)
      tl.fromTo(
        ".hero-text-element",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2 }
      );

      // Linh vật xuất hiện từ phải sang, sau đó lơ lửng nhẹ (CSS animate-float)
      tl.fromTo(
        ".hero-mascot",
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2 },
        0.4
      );

      // Hiệu ứng lơ lửng vô hạn cho linh vật
      gsap.fromTo(
        ".hero-mascot-float",
        { y: -15 },
        { y: 15, duration: 2, ease: "sine.inOut", repeat: -1, yoyo: true }
      );


      // ─── 2. PARALLAX BACKGROUND khi scroll ────────────────────────
      if (bgImageRef.current) {
        gsap.to(bgImageRef.current, {
          yPercent: 30,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // ─── 3. SCROLL CTA BUTTON fade out ────────────────────────────
      gsap.to(".hero-scroll-cta", {
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "20% top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert(); // cleanup — tránh memory leak
  }, []);

  const scrollToIntro = () => {
    document.getElementById("intro")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* ─── BACKGROUND IMAGE + PARALLAX ──────────────────────────── */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-[130%] -top-[15%]"
      >
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ─── OVERLAY GRADIENT ──────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(44,26,20,0.9) 0%, rgba(140,58,33,0.5) 100%)",
        }}
      />

      {/* Decorative top vignette */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-deep-brown/40 to-transparent" />

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
          priority
          sizes="(max-width: 1500px) 20vw, 300px"
          className="hero-mascot-float drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)]"
        />
      </div>

      {/* ─── SCROLL DOWN CTA ───────────────────────────────────────── */}
      <button
        onClick={scrollToIntro}
        className="hero-scroll-cta absolute bottom-8 left-1/2 -translate-x-1/2 z-20
                   flex flex-col items-center gap-2 text-white/50 hover:text-white
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

      {/* ─── BOTTOM FADE ───────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
