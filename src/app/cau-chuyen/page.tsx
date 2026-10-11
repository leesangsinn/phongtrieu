import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Container,
  Fish,
  Heart,
  Soup,
  QrCode,
  Sailboat,
  Waves,
} from "lucide-react";
import ScrollReveal from "@/components/story/ScrollReveal";

export const metadata: Metadata = {
  title: "Câu chuyện thương hiệu",
  description:
    "Từ nhịp gió và con nước, Phong Triều gìn giữ nghề nước mắm truyền thống Nghệ An và tiếp nối vị quê trong bữa cơm Việt.",
};

// Ảnh dùng trong trang (đều nằm trong /public)
const IMG = {
  sunset: "/thuyen-cauchuyen.jpg",
  fish: "/ca-com-tuoi-5.jpg",
  jars: "/chum-mam.jpg",
  stirring: "/1790930439418_5418089955404882545_g7806269425997013012_bbfcaca38aef6dda8de5faea44647bb4.jpg",
  bowl: "/doi-moi-co-chon-loc.jpg",
  village: "/di-san-nghe-mam.jpg",
  mascot: "/linh-vat-cutout.png",
};

const eyebrow = "section-label !text-sm !mb-5";
const h2 = "font-playfair text-3xl md:text-4xl lg:text-[2.6rem] leading-tight text-foreground";
const polaroid = "absolute bg-white p-1.5 pb-5 rounded-md shadow-lg border-4 border-white";

const meanings = [
  {
    icon: Sailboat,
    name: "Phong",
    tag: "Gió biển · Hành trình",
    text: "Tượng trưng cho hành trình vươn khơi, sự chuyển động và sức sống của người làm nghề.",
  },
  {
    icon: Waves,
    name: "Triều",
    tag: "Thủy triều · Tiếp nối",
    text: "Tượng trưng cho vòng tuần hoàn của biển cả và sự tiếp nối bền bỉ của nghề truyền thống.",
  },
];

const values = [
  {
    icon: Container,
    title: "Tay nghề và tính chính trực",
    text: "Tôn trọng tri thức nghề, phương pháp ủ chượp truyền thống và giá trị nguyên bản.",
  },
  {
    icon: Soup,
    title: "Lấy khách hàng làm trung tâm",
    text: "Lắng nghe sự khác biệt về khẩu vị, thói quen sử dụng và nhu cầu mua sắm.",
  },
  {
    icon: QrCode,
    title: "Minh bạch trong vận hành",
    text: "Hướng đến ghi nhận rõ ràng thông tin nguyên liệu, quá trình sản xuất và dữ liệu từng mẻ.",
  },
  {
    icon: Waves,
    title: "Đổi mới có mục đích",
    text: "Ứng dụng công nghệ để hỗ trợ kiểm soát chất lượng và nâng cao trải nghiệm, không thay thế vai trò của người làm nghề.",
  },
];

export default function StoryPage() {
  return (
    <>
      <ScrollReveal />

      {/* ───────── 1. HERO ───────── */}
      <section className="relative overflow-hidden bg-background pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="container-custom grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span data-reveal className={eyebrow}>
              <Waves size={16} />
              Câu chuyện thương hiệu
            </span>
            <h1
              data-reveal="0.1"
              className="font-playfair text-4xl leading-[1.15] text-foreground md:text-5xl lg:text-6xl"
            >
              Từ nhịp gió và con nước, lưu giữ vị quê nhà.
            </h1>
            <p data-reveal="0.2" className="mt-6 max-w-md text-lg">
              Một câu chuyện bắt đầu từ biển, được chắt chiu qua thời gian và tiếp nối trong những
              bữa cơm Việt.
            </p>
            <p data-reveal="0.3" className="mt-8 flex items-center gap-3">
              <Waves size={28} strokeWidth={1.25} className="text-primary/60" aria-hidden />
              <em className="font-playfair text-xl italic text-primary">
                Gió đưa vị biển, quyện về vị quê.
              </em>
            </p>
            <a
              href="#coi-nguon"
              aria-label="Cuộn xuống"
              className="mt-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <ChevronDown size={18} />
            </a>
          </div>

          {/* Mascot trên nền biển mờ */}
          <div data-reveal="0.2" className="relative mx-auto h-[360px] w-full max-w-xl md:h-[440px]">
            <div className="absolute inset-0 overflow-hidden rounded-[32px]">
              <Image
                src={IMG.sunset}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
            </div>
            <Image
              src={IMG.mascot}
              alt="Bé cá cơm Phong Triều ôm chai nước mắm"
              width={776}
              height={898}
              sizes="(max-width: 768px) 70vw, 380px"
              className="absolute bottom-0 right-4 z-10 w-[62%] max-w-[360px] animate-float drop-shadow-[0_20px_25px_rgba(44,26,20,0.3)]"
            />
            <Fish
              size={36}
              strokeWidth={1}
              className="absolute left-6 top-8 -rotate-12 text-primary/40"
              aria-hidden
            />
          </div>
        </div>
      </section>

      {/* ───────── 2. CỘI NGUỒN ───────── */}
      <section id="coi-nguon" className="bg-surface section-padding">
        <div className="container-custom grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div data-reveal className="lg:col-span-4">
            <span className={eyebrow}>
              <Waves size={16} />
              01. Cội nguồn
            </span>
            <h2 className={`${h2} mb-6`}>Mỗi ngọn gió mang theo một câu chuyện.</h2>
            <div className="space-y-4 text-[15px]">
              <p>
                Từ bao đời nay, cuộc sống của những người dân vùng biển gắn liền với nhịp gió và con
                nước. Gió đưa những con thuyền vươn khơi, con nước dẫn lối cho ngày trở về cùng những
                mẻ cá tươi. Từ cá và muối, qua quá trình ủ chượp bền bỉ theo thời gian, những giọt
                nước mắm dần hình thành, mang theo hương vị đặc trưng của biển cả và kinh nghiệm được
                truyền lại qua nhiều thế hệ.
              </p>
              <p>
                Phong Triều bắt đầu từ sự trân trọng những điều bình dị ấy: nguyên liệu từ biển, tri
                thức của người làm nghề và hương vị quen thuộc trong bữa cơm Việt.
              </p>
            </div>
          </div>

          {/* Collage 3 ảnh */}
          <div data-reveal="0.15" className="relative mx-auto h-[420px] w-full max-w-md lg:col-span-4 lg:max-w-none">
            <div className={`${polaroid} left-0 top-0 z-10 w-[88%] -rotate-2`}>
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm">
                <Image src={IMG.sunset} alt="Thuyền câu lúc hoàng hôn trên biển" fill sizes="(max-width: 1024px) 80vw, 30vw" className="object-cover" />
              </div>
            </div>
            <div className={`${polaroid} bottom-0 left-[2%] z-20 w-[48%] rotate-3`}>
              <div className="relative aspect-square overflow-hidden rounded-sm">
                <Image src={IMG.fish} alt="Rổ cá cơm tươi" fill sizes="20vw" className="object-cover" />
              </div>
            </div>
            <div className={`${polaroid} bottom-4 right-0 z-30 w-[48%] -rotate-2`}>
              <div className="relative aspect-square overflow-hidden rounded-sm">
                <Image src={IMG.jars} alt="Chum sành ủ nước mắm" fill sizes="20vw" className="object-cover" />
              </div>
            </div>
          </div>

          {/* Ý nghĩa tên gọi */}
          <div data-reveal="0.3" className="lg:col-span-4 lg:pl-6">
            <p className="mb-5 font-playfair text-sm uppercase tracking-[0.2em] text-text-muted">
              Ý nghĩa tên gọi
            </p>
            <div className="divide-y divide-primary/15">
              {meanings.map(({ icon: Icon, name, tag, text }) => (
                <div key={name} className="flex gap-5 py-6 first:pt-0 last:pb-0">
                  <Icon size={46} strokeWidth={1} className="mt-1 shrink-0 text-primary/60" aria-hidden />
                  <div>
                    <h3 className="font-playfair text-2xl italic text-foreground">{name}</h3>
                    <p className="mb-2 text-sm italic text-primary">{tag}</p>
                    <p className="text-sm">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 3. TRIẾT LÝ ───────── */}
      <section className="bg-background section-padding overflow-hidden">
        <div className="container-custom grid items-center gap-12 lg:grid-cols-3">
          <div data-reveal className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] shadow-brand">
              <Image src={IMG.bowl} alt="Rót nước mắm cốt" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
            </div>
            <Image
              src={IMG.mascot}
              alt="Bé cá cơm Phong Triều"
              width={776}
              height={898}
              sizes="140px"
              className="absolute -bottom-6 -left-3 z-10 w-28 -scale-x-100 drop-shadow-lg md:-left-6 md:w-36"
            />
            <Heart size={22} className="absolute -top-3 left-2 text-primary/40" aria-hidden />
          </div>

          <div data-reveal="0.15">
            <span className={eyebrow}>
              <Waves size={16} />
              02. Triết lý thương hiệu
            </span>
            <h2 className={`${h2} mb-6`}>Giữ gìn cốt vị, mở lối trải nghiệm.</h2>
            <p className="text-[15px]">
              Phong Triều mong muốn gìn giữ không chỉ hương vị nước mắm, mà còn cả những giá trị văn
              hóa, tri thức nghề và ký ức gắn với bữa cơm Việt. Đồng thời, thương hiệu hướng đến việc
              đưa những giá trị ấy đến gần hơn với người tiêu dùng hiện đại thông qua sản phẩm được
              quản lý chất lượng có trách nhiệm, minh bạch thông tin và trải nghiệm thuận tiện hơn.
            </p>
          </div>

          <div data-reveal="0.3" className="flex justify-center lg:justify-end">
            <div className="max-w-xs rotate-3 rounded-sm bg-white p-8 text-center shadow-xl transition-transform duration-500 hover:rotate-0">
              <p className="mb-1 font-playfair text-xs uppercase tracking-[0.3em] text-text-muted">Di sản</p>
              <p className="mb-4 font-playfair text-3xl italic text-primary">Giảm mặn</p>
              <p className="font-playfair text-sm italic leading-relaxed text-text-muted">
                Giữ trọn cốt vị truyền thống, giảm bớt vị mặn cho bữa cơm hiện đại.
              </p>
              <Heart size={18} className="mx-auto mt-5 text-primary/60" aria-hidden />
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 4. TẦM NHÌN 2031 ───────── */}
      <section className="relative overflow-hidden section-padding">
        <Image
          src="/nen-2031.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Phủ kem ở nửa trái cho chữ dễ đọc, nửa phải để lộ ảnh biển hoàng hôn */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-background/10" />
        <div className="container-custom relative grid items-center gap-8 lg:grid-cols-2">
          <div data-reveal>
            <span className={eyebrow}>
              <Waves size={16} />
              03. Tầm nhìn 2031
            </span>
            <h2 className={`${h2} mb-6`}>Đưa giá trị di sản đến gần hơn với cuộc sống hôm nay.</h2>
            <p className="max-w-lg text-[15px]">
              Phong Triều hướng đến trở thành thương hiệu nước mắm di sản từ Nghệ An được nhận diện
              trên thị trường, gắn với việc gìn giữ nghề truyền thống và đáp ứng nhu cầu ngày càng đa
              dạng của người tiêu dùng hiện đại.
            </p>
          </div>
          <p
            data-reveal="0.2"
            aria-label="Năm 2031"
            className="text-center font-playfair text-[6rem] italic leading-none text-primary opacity-80 sm:text-[8rem] lg:text-right lg:text-[12rem]"
          >
            2031
          </p>
        </div>
      </section>

      {/* ───────── 5. SỨ MỆNH & GIÁ TRỊ CỐT LÕI ───────── */}
      <section className="bg-surface section-padding">
        <div className="container-custom grid gap-12 lg:grid-cols-12">
          <div data-reveal className="relative lg:col-span-4">
            <span className={eyebrow}>
              <Waves size={16} />
              04. Sứ mệnh
            </span>
            <h2 className={`${h2} mb-6`}>
              Giữ nghề bằng sự trân trọng. Phát triển bằng sự thấu hiểu.
            </h2>
            <p className="text-[15px]">
              Gìn giữ nghề làm nước mắm truyền thống Nghệ An và phát triển sản phẩm phù hợp với nhu
              cầu hiện đại thông qua hợp tác với người làm nghề, quản lý chất lượng có trách nhiệm,
              minh bạch thông tin và đổi mới có chọn lọc.
            </p>
            <Image
              src={IMG.mascot}
              alt="Bé cá cơm Phong Triều ôm chai nước mắm"
              width={776}
              height={898}
              sizes="180px"
              className="mt-8 hidden w-40 drop-shadow-lg lg:block"
            />
          </div>

          <div className="lg:col-span-8">
            <div data-reveal="0.1">
              <span className={eyebrow}>
                <Waves size={16} />
                05. Giá trị cốt lõi
              </span>
              <h2 className={`${h2} mb-8`}>Những điều làm nên Phong Triều</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {values.map(({ icon: Icon, title, text }, i) => (
                <div
                  key={title}
                  data-reveal={0.1 + (i % 2) * 0.1}
                  className="flex gap-5 rounded-2xl bg-white/60 p-6 transition-shadow duration-300 hover:shadow-brand"
                >
                  <Icon size={44} strokeWidth={1} className="shrink-0 text-primary/60" aria-hidden />
                  <div>
                    <h3 className="mb-2 font-playfair text-lg font-semibold text-foreground">{title}</h3>
                    <p className="text-sm">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 6. LỜI KẾT ───────── */}
      <section className="relative overflow-hidden bg-background section-padding">
        <div className="pointer-events-none absolute -left-12 top-1/2 hidden h-60 w-60 -translate-y-1/2 xl:block">
          <Image src={IMG.bowl} alt="" fill sizes="320px" className="rounded-full object-cover opacity-90" />
        </div>
        <div className="pointer-events-none absolute -right-12 top-1/2 hidden h-60 w-60 -translate-y-1/2 xl:block">
          <Image src={IMG.village} alt="" fill sizes="288px" className="rounded-full object-cover opacity-90" />
        </div>

        <div data-reveal className="container-custom relative flex max-w-xl flex-col items-center text-center">
          <h2 className="font-playfair text-3xl italic leading-tight text-primary md:text-4xl">
            Gió đưa vị biển, quyện về vị quê.
          </h2>
          <p className="mt-5">
            Từ nhịp gió ngoài khơi đến hương vị trên mâm cơm, Phong Triều mong muốn tiếp nối những
            giá trị thân quen theo cách phù hợp với hôm nay.
          </p>
          <Link href="/san-pham" className="btn-primary mt-8">
            Khám phá sản phẩm
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
