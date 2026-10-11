import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Gift, Waves } from "lucide-react";
import ScrollReveal from "@/components/story/ScrollReveal";
import ProductExplorer from "@/components/products/ProductExplorer";
import { giftSets } from "@/lib/products";

export const metadata: Metadata = {
  title: "Sản phẩm",
  description:
    "Ba dòng nước mắm Phong Triều: Di Sản, Thanh Vị, Dưỡng Vị cùng các bộ quà tặng gói trọn tình thân.",
};

const eyebrow = "section-label !text-sm !mb-5";

const reasons = [
  "Nguyên liệu cá cơm tuyển chọn, muối biển chọn lọc",
  "Ủ chượp truyền thống, thời gian lâu dài",
  "Minh bạch nguồn gốc, rõ ràng quy trình",
  "Hương vị thơm ngon, phù hợp nhiều món ăn",
];

export default function ProductsPage() {
  return (
    <>
      <ScrollReveal />

      {/* ───────── 1. HERO ───────── */}
      <section className="relative overflow-hidden bg-background pt-28 pb-24 md:pt-36">
        <div className="container-custom grid items-center gap-8 lg:grid-cols-2">
          <div>
            <span data-reveal className={eyebrow}>
              <Waves size={16} />
              Sản phẩm
            </span>
            <h1
              data-reveal="0.1"
              className="font-playfair text-4xl italic leading-[1.15] text-primary md:text-5xl lg:text-6xl"
            >
              Mỗi giọt mắm, một vị thương.
            </h1>
            <p data-reveal="0.2" className="mt-6 max-w-md text-lg">
              Từ nguyên liệu tuyển chọn và quy trình ủ chượp truyền thống, Phong Triều mang đến những
              dòng nước mắm phù hợp với nhu cầu của gia đình hiện đại.
            </p>
          </div>

          <div data-reveal="0.2" className="relative mx-auto flex h-[320px] w-full max-w-md items-end justify-center md:h-[400px]">
            <div className="absolute inset-x-0 bottom-0 top-10 rounded-[40px] bg-gradient-to-br from-surface via-[#F1E3D3] to-[#E3D2C0]" />
            <Image
              src="/linh-vat-cutout.png"
              alt="Bé cá cơm Phong Triều ôm chai nước mắm"
              width={776}
              height={898}
              priority
              sizes="(max-width: 768px) 70vw, 360px"
              className="relative z-10 w-[78%] max-w-[360px] animate-float drop-shadow-[0_20px_25px_rgba(44,26,20,0.3)]"
            />
          </div>
        </div>

        {/* Sóng chuyển section */}
        <svg
          className="absolute inset-x-0 bottom-0 h-12 w-full text-background"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path fill="currentColor" d="M0 48V30C240 6 480 0 720 14c240 14 480 22 720 4v30H0Z" />
        </svg>
      </section>

      {/* ───────── 2. FILTER & GRID ───────── */}
      <section id="danh-muc" className="scroll-mt-24 bg-background pb-20 md:pb-28">
        <div className="container-custom" data-reveal>
          <ProductExplorer />
        </div>
      </section>

      {/* ───────── 3. TẠI SAO CHỌN PHONG TRIỀU ───────── */}
      <section className="bg-background pb-20 md:pb-28">
        <div
          data-reveal
          className="container-custom grid items-center gap-10 rounded-3xl bg-surface p-8 md:p-12 lg:grid-cols-2"
        >
          <div>
            <h2 className="mb-6 font-playfair text-3xl leading-tight text-foreground md:text-4xl">
              Tại sao nên chọn nước mắm Phong Triều?
            </h2>
            <ul className="space-y-3">
              {reasons.map((r) => (
                <li key={r} className="flex items-start gap-3">
                  <Check size={18} className="mt-1 shrink-0 text-accent-primary" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 font-playfair text-lg italic text-foreground">
              Chọn vị mắm theo cách bạn thưởng thức
            </p>
            <Link href="/lien-he" className="btn-primary mt-4">
              Nhờ Phong Triều tư vấn
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="relative mx-auto h-[320px] w-full max-w-lg md:h-[360px]">
            <div className="absolute left-0 top-4 h-[62%] w-[56%] -rotate-3 overflow-hidden rounded-2xl border-4 border-white shadow-lg">
              <Image
                src="/ca-com-tuoi-5.jpg"
                alt="Rổ cá cơm tươi"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-2 right-0 h-[56%] w-[52%] rotate-2 overflow-hidden rounded-2xl border-4 border-white shadow-lg">
              <Image
                src="/doi-moi-co-chon-loc.jpg"
                alt="Rót nước mắm vào bát"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <Image
              src="/disan-cutout.png"
              alt="Chai nước mắm Phong Triều Di Sản"
              width={220}
              height={905}
              sizes="120px"
              className="absolute bottom-0 left-[34%] z-10 h-[78%] w-auto drop-shadow-[0_14px_16px_rgba(44,26,20,0.25)]"
            />
            <p className="absolute right-2 top-0 z-10 max-w-[10rem] text-right font-playfair text-base italic leading-snug text-primary">
              Tinh hoa từ biển cả và bàn tay người Việt
            </p>
          </div>
        </div>
      </section>

      {/* ───────── 4. BỘ QUÀ TẶNG ───────── */}
      <section className="bg-surface section-padding">
        <div className="container-custom">
          <div data-reveal className="mb-12 text-center">
            <span className={`${eyebrow} justify-center`}>
              <Gift size={16} />
              Bộ quà tặng
            </span>
            <h2 className="font-playfair text-3xl uppercase leading-tight tracking-wide text-foreground md:text-4xl">
              Những món quà gói trọn tình thân
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {giftSets.map((g, i) => (
              <article
                key={g.name}
                data-reveal={i * 0.1}
                className="group flex flex-col rounded-3xl border border-[#C9A27A]/50 bg-white/70 p-4 transition-all duration-300 hover:-translate-y-2 hover:shadow-brand"
              >
                <div className="relative aspect-[4/3.4] overflow-hidden rounded-2xl bg-background">
                  <Image
                    src={g.image}
                    alt={g.name}
                    fill
                    sizes="(max-width: 768px) 90vw, 30vw"
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col items-center px-3 pb-3 pt-6 text-center">
                  <h3 className="font-playfair text-2xl font-bold text-foreground">{g.name}</h3>
                  <p className="mt-2 flex-1 text-sm">{g.description}</p>
                  <Link
                    href="/lien-he"
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/40 px-6 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                  >
                    Tư vấn quà tặng <ArrowRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 5. LỜI KẾT ───────── */}
      <section className="bg-background section-padding">
        <div data-reveal className="container-custom max-w-2xl text-center">
          <h2 className="font-playfair text-3xl uppercase leading-snug tracking-wide text-primary md:text-5xl">
            Phong Triều
            <span className="mt-2 block text-xl normal-case italic tracking-normal text-foreground md:text-2xl">
              Gói vị biển, gửi tình quê
            </span>
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="#danh-muc" className="btn-primary">
              Khám phá sản phẩm
              <ArrowRight size={16} />
            </a>
            <Link href="/lien-he" className="btn-secondary">
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
