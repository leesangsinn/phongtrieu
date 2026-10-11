import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Waves } from "lucide-react";
import ScrollReveal from "@/components/story/ScrollReveal";
import ContactBlock from "@/components/contact/ContactBlock";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Gửi lời nhắn cho Phong Triều: tư vấn sản phẩm, hợp tác kinh doanh, góp ý và phản hồi.",
};

export default function ContactPage() {
  return (
    <>
      <ScrollReveal />

      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden bg-background pt-28 pb-24 md:pt-36">
        <div className="container-custom grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span data-reveal className="section-label !text-sm !mb-5">
              <Waves size={16} />
              Chúng tôi luôn ở đây
            </span>
            <h1
              data-reveal="0.1"
              className="font-playfair text-4xl italic leading-[1.15] text-primary md:text-5xl lg:text-6xl"
            >
              Gửi lời thương, trao kết nối.
            </h1>
            <p data-reveal="0.2" className="mt-6 max-w-md text-lg">
              Mỗi lời nhắn đều là cơ hội để Phong Triều lắng nghe, sẻ chia và mang đến cho bạn trải nghiệm
              tốt hơn.
            </p>
            <a data-reveal="0.3" href="#loi-nhan" className="btn-primary mt-8">
              Gửi lời nhắn cho chúng tôi
              <ArrowUpRight size={16} />
            </a>
          </div>

          <div data-reveal="0.2" className="relative mx-auto flex h-[320px] w-full max-w-md items-end justify-center md:h-[380px]">
            <div className="absolute inset-x-0 bottom-0 top-10 rounded-[40px] bg-gradient-to-br from-surface via-[#F1E3D3] to-[#E3D2C0]" />
            <Image
              src="/linh-vat-cutout.png"
              alt="Bé cá cơm Phong Triều"
              width={776}
              height={898}
              priority
              sizes="(max-width: 768px) 70vw, 340px"
              className="relative z-10 w-[74%] max-w-[340px] animate-float drop-shadow-[0_20px_25px_rgba(44,26,20,0.3)]"
            />
          </div>
        </div>

        <svg
          className="absolute inset-x-0 bottom-0 h-12 w-full text-background"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path fill="currentColor" d="M0 48V30C240 6 480 0 720 14c240 14 480 22 720 4v30H0Z" />
        </svg>
      </section>

      <ContactBlock />

      {/* ───────── LỜI KẾT ───────── */}
      <section className="bg-background section-padding">
        <div data-reveal className="container-custom max-w-xl text-center">
          <h2 className="font-playfair text-3xl italic leading-tight text-primary md:text-4xl">
            Cảm ơn bạn đã chọn Phong Triều.
          </h2>
          <p className="mt-5">
            Mỗi kết nối hôm nay là một câu chuyện đẹp trên hành trình gìn giữ hương vị truyền thống.
          </p>
        </div>
      </section>
    </>
  );
}
