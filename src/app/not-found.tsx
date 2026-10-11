"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

export default function NotFound() {
  const mascotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Lắc nhẹ qua lại -5° ↔ 5°
      gsap.fromTo(
        mascotRef.current,
        { rotation: -5 },
        { rotation: 5, duration: 1.2, ease: "sine.inOut", repeat: -1, yoyo: true }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 pt-28 pb-16 text-center">
      <div ref={mascotRef} className="w-56 sm:w-72 origin-bottom">
        <Image
          src="/linh-vat-cutout.png"
          alt="Linh vật cá Phong Triều bị lạc"
          width={776}
          height={898}
          priority
          sizes="(max-width: 640px) 224px, 288px"
        />
      </div>
      <p className="mt-6 font-playfair text-sm font-semibold uppercase tracking-[0.3em] text-primary">
        Lỗi 404
      </p>
      <h1 className="mt-3 font-playfair text-3xl font-bold text-deep-brown sm:text-4xl">
        Ôi chao! Bé cá bơi lạc mất rồi...
      </h1>
      <Link href="/" className="btn-primary mt-8">
        Bơi về Trang chủ
      </Link>
    </section>
  );
}
