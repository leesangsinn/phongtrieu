"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Fish, Waves } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const polaroid =
  "absolute bg-white p-2 pb-6 rounded-sm shadow-[0_10px_30px_rgba(61,40,23,0.15)]";

export default function StoryIntro() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".story-text",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
      gsap.fromTo(
        ".story-photo",
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="intro" ref={sectionRef} className="section-padding bg-background overflow-hidden">
      <div className="container-custom grid md:grid-cols-2 gap-14 lg:gap-24 items-center">
        {/* Collage */}
        <div className="relative h-[380px] sm:h-[460px] order-last md:order-first">
          <Waves
            size={64}
            strokeWidth={1}
            className="absolute -left-2 top-4 text-primary/15"
            aria-hidden
          />
          <Fish
            size={44}
            strokeWidth={1}
            className="absolute left-2 bottom-2 text-primary/20 -rotate-12"
            aria-hidden
          />
          <div className={`story-photo ${polaroid} left-[4%] top-0 w-[62%] -rotate-3 z-10`}>
            <div className="relative aspect-[4/3]">
              <Image
                src="/1790930439418_5418089955404882545_g7806269425997013012_bbfcaca38aef6dda8de5faea44647bb4.jpg"
                alt="Thợ khuấy lu mắm dưới ánh hoàng hôn"
                fill
                sizes="(max-width: 768px) 60vw, 28vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className={`story-photo ${polaroid} right-0 top-[18%] w-[48%] rotate-3`}>
            <div className="relative aspect-[3/4]">
              <Image
                src="/di-san-nghe-mam.jpg"
                alt="Hàng lu sành ủ chượp"
                fill
                sizes="(max-width: 768px) 45vw, 22vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className={`story-photo ${polaroid} left-[22%] bottom-0 w-[50%] rotate-2 z-20`}>
            <div className="relative aspect-[4/3]">
              <Image
                src="/1790927709320_1538596632979904027_g7806269425997013012_dff38a892ba96fd7ad4055a1fc5f6c29.jpg"
                alt="Hàng lu mắm dưới rặng dừa"
                fill
                sizes="(max-width: 768px) 50vw, 24vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Text */}
        <div>
          <span className="story-text section-label !text-sm">
            <Waves size={16} />
            Câu chuyện thương hiệu
          </span>
          <h2 className="story-text font-playfair text-4xl md:text-5xl text-deep-brown leading-tight mb-6">
            Từ nhịp gió và con nước, lưu giữ vị quê nhà.
          </h2>
          <p className="story-text text-text-muted max-w-md mb-8">
            Phong Triều bắt đầu từ sự trân trọng những điều bình dị: nguyên liệu từ biển, tri thức
            của người làm nghề và hương vị quen thuộc trong bữa cơm Việt.
          </p>
          <Link
            href="/cau-chuyen"
            className="story-text group inline-flex items-center gap-3 text-primary font-semibold border-b border-primary/40 pb-1 hover:border-primary"
          >
            Khám phá câu chuyện
            <span className="w-8 h-8 rounded-full border border-primary/40 flex items-center justify-center transition-transform group-hover:translate-x-1">
              <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
