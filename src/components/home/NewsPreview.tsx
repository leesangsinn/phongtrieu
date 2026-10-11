"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export type NewsPreviewPost = {
  title: string;
  excerpt: string;
  image: string;
  href: string;
};

export default function NewsPreview({ posts }: { posts: NewsPreviewPost[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".news-head > *, .news-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-background pb-32">
      <div className="container-custom grid lg:grid-cols-4 gap-12">
        <div className="news-head lg:col-span-1">
          <span className="section-label !text-sm">Tin tức &amp; kiến thức</span>
          <h2 className="font-playfair text-3xl md:text-4xl text-deep-brown leading-tight mb-5">
            Câu chuyện nhỏ, giá trị lớn.
          </h2>
          <p className="text-sm text-text-muted mb-6">
            Cùng Phong Triều khám phá thêm những kiến thức, câu chuyện và mẹo hay về nước mắm
            truyền thống.
          </p>
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
          >
            Xem tất cả <ArrowRight size={16} />
          </Link>
        </div>

        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post.title} className="news-card group">
              <Link href={post.href} className="block">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-playfair text-lg font-bold text-deep-brown leading-snug mb-2">
                  {post.title}
                </h3>
                <p className="text-sm text-text-muted mb-3">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium">
                  Đọc thêm <ArrowRight size={14} />
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
