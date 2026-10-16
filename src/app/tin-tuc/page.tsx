import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Waves } from "lucide-react";
import ScrollReveal from "@/components/story/ScrollReveal";
import NewsExplorer from "@/components/news/NewsExplorer";
import { posts } from "@/lib/news";

export const metadata: Metadata = {
  title: "Tin tức & Kiến thức",
  description:
    "Những kiến thức hữu ích, câu chuyện thú vị và cập nhật mới nhất về nước mắm truyền thống cùng Phong Triều.",
};

export default function NewsPage() {
  const summaries = posts.map(({ slug, title, excerpt, group, image, readMinutes }) => ({
    slug,
    title,
    excerpt,
    group,
    image,
    readMinutes,
  }));

  return (
    <>
      <ScrollReveal />

      {/* ───────── 1. HERO ───────── */}
      <section className="relative overflow-hidden bg-background pt-28 pb-24 md:pt-36">
        <div className="container-custom grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span data-reveal className="section-label !text-sm !mb-5">
              <Waves size={16} />
              Tin tức &amp; kiến thức
            </span>
            <h1
              data-reveal="0.1"
              className="font-playfair text-4xl italic leading-[1.15] text-primary md:text-5xl lg:text-6xl"
            >
              Chuyện làng biển, chuyện nghề làm mắm.
            </h1>
            <p data-reveal="0.2" className="mt-6 max-w-md text-lg">
              Cùng Phong Triều khám phá những kiến thức hữu ích, những câu chuyện thú vị và cập nhật
              mới nhất về nước mắm truyền thống.
            </p>
          </div>

          <div data-reveal="0.2" className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[32px] shadow-brand">
            <Image
              src="/tintucbanner.jpg"
              alt="Chuyện làng biển, chuyện nghề làm mắm"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Sóng chuyển section */}
        <svg
          className="absolute inset-x-0 bottom-0 h-12 w-full text-primary/10"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path fill="currentColor" d="M0 48V28C240 4 480 0 720 14c240 14 480 22 720 2v32H0Z" />
        </svg>
        <svg
          className="absolute inset-x-0 bottom-0 h-8 w-full text-background"
          viewBox="0 0 1440 32"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path fill="currentColor" d="M0 32V20C240 2 480 0 720 10c240 10 480 14 720 0v22H0Z" />
        </svg>
      </section>

      {/* ───────── 2-4. LỌC, BÀI NỔI BẬT, LƯỚI ───────── */}
      <section className="bg-background pb-20 md:pb-28">
        <div className="container-custom" data-reveal>
          <NewsExplorer posts={summaries} />
        </div>
      </section>

      {/* ───────── 5. CTA HỖ TRỢ ───────── */}
      <section className="bg-background px-4 pb-16">
        <div
          data-reveal
          className="container-custom flex flex-col items-center justify-center gap-8 rounded-3xl bg-surface p-10 text-center md:flex-row md:p-12 md:text-left"
        >
          <Image
            src="/linh-vat-cutout.png"
            alt="Bé cá cơm Phong Triều ôm chai nước mắm"
            width={776}
            height={898}
            sizes="180px"
            className="w-36 shrink-0 animate-float drop-shadow-lg md:w-44"
          />
          <div>
            <h2 className="font-playfair text-2xl leading-snug text-foreground md:text-3xl">
              Bạn có thắc mắc về nước mắm? Hãy để Phong Triều giải đáp!
            </h2>
            <p className="mt-3">Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn.</p>
            <Link href="/lien-he" className="btn-primary mt-6">
              Liên hệ ngay
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
