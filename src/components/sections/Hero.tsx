"use client";

import { useEffect, useRef } from "react";

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


      // Stats counter fade in
      tl.fromTo(
        ".hero-stat",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
        "-=0.5"
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

  const handleNavClick = (href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
            "linear-gradient(115deg, rgba(35,22,10,0.85) 0%, rgba(61,40,23,0.50) 45%, rgba(140,58,33,0.20) 100%)",
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
                <Leaf size={14} className="text-amber-300" />
                <span className="text-amber-300 text-xs font-epilogue font-semibold uppercase tracking-[0.15em]">
                  Di sản nghề mắm Nghệ An
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="hero-text-element opacity-0 font-lora text-4xl sm:text-5xl xl:text-6xl font-bold text-white leading-[1.1] mb-6">
                Gió đưa vị biển,{" "}
                <em className="text-amber-300 font-lora italic not-italic block mt-1">
                  quyện về vị quê
                </em>
              </h1>

              {/* Description */}
              <p className="hero-text-element opacity-0 font-epilogue text-base text-white/75 max-w-[500px] leading-relaxed mb-8">
                Từ tinh hoa nghề mắm truyền thống, Phong Triều mang hương vị biển cả đến gần hơn với những bữa cơm Việt hôm nay. Gìn giữ phương pháp ủ chượp tự nhiên, kết hợp tư duy đổi mới cho trải nghiệm hiện đại.
              </p>

              {/* CTA Buttons */}
              <div className="hero-text-element opacity-0 flex flex-wrap gap-4 mb-10">
                <button
                  onClick={() => handleNavClick("#products")}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full
                             bg-primary hover:bg-primary-hover transition-colors duration-300 text-white
                             font-epilogue font-semibold text-sm tracking-wide
                             transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow"
                >
                  <span>Khám phá sản phẩm</span>
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => handleNavClick("#story")}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full
                             border-2 border-white/50 hover:border-white text-white
                             font-epilogue font-semibold text-sm tracking-wide
                             transition-all duration-300 hover:bg-card/10 hover:-translate-y-0.5"
                >
                  <Waves size={16} />
                  <span>Câu chuyện Phong Triều</span>
                </button>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-8 pt-6 border-t border-white/15">
                {[
                  { value: "30+", label: "Năm kinh nghiệm" },
                  { value: "40°N", label: "Độ đạm cao nhất" },
                  { value: "100%", label: "Tự nhiên" },
                ].map((stat) => (
                  <div key={stat.label} className="hero-stat opacity-0">
                    <p className="font-lora text-2xl font-bold text-amber-300 leading-none">
                      {stat.value}
                    </p>
                    <p className="font-epilogue text-xs text-white/55 mt-1 whitespace-nowrap">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SCROLL DOWN CTA ───────────────────────────────────────── */}
      <button
        onClick={() => handleNavClick("#story")}
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
          className="animate-bounce group-hover:text-amber-300 transition-colors"
        />
      </button>

      {/* ─── BOTTOM FADE ───────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
