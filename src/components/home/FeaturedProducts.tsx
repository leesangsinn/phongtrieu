"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    name: "Di Sản",
    lines: ["Đậm vị truyền thống", "40° đạm tổng"],
    image: "/disan-cutout.png",
    disc: "from-[#F1CDA8] to-[#C98456]",
    shadow: "shadow-[0_18px_40px_-12px_rgba(201,132,86,0.6)]",
    ring: "border-[#C98456]/60",
  },
  {
    name: "Thanh Vị",
    lines: ["Mặn êm hơn", "Nhẹ vị, dễ dùng"],
    image: "/thanhvi-cutout.png",
    disc: "from-[#DCE9D6] to-[#86A98A]",
    shadow: "shadow-[0_18px_40px_-12px_rgba(110,150,115,0.6)]",
    ring: "border-[#86A98A]/70",
  },
  {
    name: "Dưỡng Vị",
    lines: ["Hài hòa vị ngon", "Gần gũi bữa cơm Việt"],
    image: "/duongvi-cutout.png",
    disc: "from-[#CFE6E4] to-[#6FA5A6]",
    shadow: "shadow-[0_18px_40px_-12px_rgba(90,150,152,0.6)]",
    ring: "border-[#6FA5A6]/70",
  },
];

export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".featured-intro > *",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );
      gsap.fromTo(
        ".featured-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-cream relative overflow-hidden rounded-t-[48px] md:rounded-t-[80px]"
    >
      {/* Blob trang trí mờ */}
      <div className="absolute -left-24 -bottom-24 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute right-0 -top-20 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="container-custom relative grid lg:grid-cols-[1fr_2fr] gap-14 items-center">
        <div className="featured-intro">
          <span className="section-label !text-sm">Sản phẩm nổi bật</span>
          <h2 className="font-playfair text-4xl md:text-5xl text-deep-brown leading-tight mb-6">
            Mỗi giọt mắm, một vị thương.
          </h2>
          <p className="text-text-muted max-w-sm mb-8">
            Ba dòng sản phẩm, ba sắc vị riêng, cùng chung một giá trị: giữ trọn hương vị truyền
            thống, phù hợp với nhu cầu của gia đình hiện đại.
          </p>
          <Link href="/san-pham" className="btn-primary">
            Xem tất cả sản phẩm
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {products.map((p) => (
            <article key={p.name} className="featured-card group text-center">
              <div className="relative h-80 mb-6">
                {/* Vòng đĩa nâu: viền đứt quay chậm + đĩa gradient nét rõ + vòng sáng bên trong */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={`w-60 h-60 rounded-full border border-dashed ${p.ring} animate-spin`}
                    style={{ animationDuration: "50s" }}
                  />
                </div>
                <div
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full bg-gradient-to-br ${p.disc} ${p.shadow} ring-4 ring-white/70`}
                />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-white/50" />
                {/* Bóng đổ dưới chân chai */}
                <div className="absolute left-1/2 bottom-1 -translate-x-1/2 w-24 h-3 rounded-full bg-foreground/25 blur-md" />
                <Image
                  src={p.image}
                  alt={`Nước mắm Phong Triều ${p.name}`}
                  fill
                  sizes="200px"
                  className="object-contain drop-shadow-[0_12px_14px_rgba(61,40,23,0.18)] transition-transform duration-500 group-hover:-translate-y-2"
                />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-deep-brown mb-2">{p.name}</h3>
              <p className="text-sm text-text-muted">{p.lines[0]}</p>
              <p className="text-sm text-text-muted mb-5">– {p.lines[1]}</p>
              <Link
                href="/san-pham"
                className="inline-flex px-6 py-2 rounded-full border border-primary/40 text-primary text-sm font-medium transition-colors hover:bg-primary hover:text-white"
              >
                Xem chi tiết
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
