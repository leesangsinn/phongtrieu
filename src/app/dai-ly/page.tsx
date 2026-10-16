import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  Check,
  ChevronDown,
  Handshake,
  Megaphone,
  MapPin,
  PackageCheck,
  Waves,
} from "lucide-react";
import ScrollReveal from "@/components/story/ScrollReveal";
import StoreLocator from "@/components/agent/StoreLocator";
import PartnerForm from "@/components/agent/PartnerForm";

export const metadata: Metadata = {
  title: "Đại lý",
  description:
    "Tìm điểm bán nước mắm Phong Triều gần bạn hoặc đăng ký hợp tác phân phối cùng Phong Triều.",
};

const eyebrow = "section-label !text-sm !mb-5";

const paths = [
  {
    icon: MapPin,
    title: "Tìm nơi mua hàng",
    text: "Khám phá các điểm bán và đối tác phân phối Phong Triều.",
    cta: "Tìm điểm bán",
    href: "#tim-diem-ban",
  },
  {
    icon: Handshake,
    title: "Trở thành đại lý",
    text: "Kết nối cùng Phong Triều để tìm hiểu cơ hội hợp tác phân phối.",
    cta: "Đăng ký hợp tác",
    href: "#dang-ky",
  },
];

const benefits = [
  {
    icon: PackageCheck,
    title: "Danh mục sản phẩm rõ ràng",
    text: "Ba dòng Di Sản, Thanh Vị, Dưỡng Vị cùng các bộ quà tặng, kèm thông tin sản phẩm để dễ giới thiệu.",
  },
  {
    icon: Handshake,
    title: "Kết nối trực tiếp",
    text: "Trao đổi trực tiếp với Phong Triều về nhu cầu, quy cách và hình thức hợp tác phù hợp.",
  },
  {
    icon: Megaphone,
    title: "Hỗ trợ truyền thông & hình ảnh",
    text: "Cùng trao đổi về hình ảnh và thông tin sản phẩm phục vụ việc giới thiệu tại điểm bán.",
  },
];

const faqs = [
  {
    q: "Ai có thể đăng ký làm đại lý Phong Triều?",
    a: "Cửa hàng thực phẩm, đại lý bán lẻ, nhà phân phối, nhà hàng hoặc đơn vị khác quan tâm đến nước mắm truyền thống đều có thể để lại thông tin. Phong Triều sẽ liên hệ để trao đổi về nhu cầu hợp tác của bạn.",
  },
  {
    q: "Tôi có thể tìm hiểu chính sách nhập hàng ở đâu?",
    a: "Thông tin chi tiết về nhập hàng được trao đổi trực tiếp sau khi bạn gửi đăng ký ở biểu mẫu phía trên, hoặc liên hệ qua số 0979 425 607 và email mamdisanphongtrieu@gmail.com.",
  },
  {
    q: "Phong Triều đã có đại lý tại tỉnh của tôi chưa?",
    a: "Danh sách điểm bán chính thức đang được cập nhật ở khối tra cứu. Nếu chưa thấy khu vực của bạn, hãy liên hệ để được tư vấn và hướng dẫn nơi mua hàng gần nhất.",
  },
  {
    q: "Làm thế nào để mua sản phẩm chính hãng?",
    a: "Hãy ưu tiên các điểm bán và đối tác được Phong Triều công bố, đồng thời kiểm tra nhãn sản phẩm, thông tin đơn vị chịu trách nhiệm và mã QR nếu có. Bạn có thể tham khảo thêm hướng dẫn trong bài viết về cách kiểm tra nguồn gốc nước mắm trước khi mua.",
  },
];

export default function AgentPage() {
  return (
    <>
      <ScrollReveal />

      {/* ───────── 1. HERO ───────── */}
      <section className="bg-background pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="container-custom grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span data-reveal className={eyebrow}>
              <Waves size={16} />
              Hệ thống đại lý &amp; phân phối
            </span>
            <h1
              data-reveal="0.1"
              className="font-playfair text-4xl italic leading-[1.15] text-primary md:text-5xl lg:text-6xl"
            >
              Cùng lan tỏa vị mắm quê nhà
            </h1>
            <p data-reveal="0.2" className="mt-6 max-w-md text-lg">
              Trân trọng giá trị truyền thống, Phong Triều mong muốn kết nối những đối tác cùng chia sẻ
              hương vị mắm Nghệ An đến gần hơn với bữa cơm gia đình Việt.
            </p>
          </div>

          <div
            data-reveal="0.2"
            className="relative mx-auto aspect-[1216/708] w-full max-w-2xl overflow-hidden rounded-[32px] shadow-brand"
          >
            <Image
              src="/banner-daili.jpg"
              alt="Phong Triều – Nâng tầm mắm cốt Nghệ An: bé cá cơm cùng các dòng nước mắm và bộ quà tặng"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 640px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ───────── 2. PHÂN LUỒNG ───────── */}
      <section className="bg-background pb-10">
        <div className="container-custom grid gap-8 md:grid-cols-2">
          {paths.map(({ icon: Icon, title, text, cta, href }, i) => (
            <div
              key={title}
              data-reveal={i * 0.1}
              className="flex flex-col items-start rounded-3xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-brand"
            >
              <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-surface">
                <Icon size={26} strokeWidth={1.5} className="text-primary" />
              </span>
              <h2 className="font-playfair text-2xl font-bold text-foreground">{title}</h2>
              <p className="mt-2 flex-1">{text}</p>
              <a href={href} className="btn-primary mt-6">
                {cta}
                <ArrowDown size={16} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── 3. TRA CỨU ĐIỂM BÁN ───────── */}
      <section id="tim-diem-ban" className="scroll-mt-24 bg-background py-10">
        <div data-reveal className="container-custom rounded-3xl bg-surface p-8 md:p-10">
          <h2 className="text-center font-playfair text-3xl text-foreground">Tìm Phong Triều gần bạn</h2>
          <p className="mx-auto mb-8 mt-3 max-w-xl text-center">
            Chọn khu vực để khám phá các điểm bán sản phẩm chính hãng.
          </p>
          <StoreLocator />
        </div>
      </section>

      {/* ───────── 4. DÀNH CHO ĐỐI TÁC ───────── */}
      <section className="bg-background section-padding">
        <div className="container-custom grid items-center gap-12 lg:grid-cols-2">
          <div data-reveal className="relative aspect-[4/3] overflow-hidden rounded-[32px] shadow-brand">
            <Image
              src="/chum-mam.jpg"
              alt="Hàng chum sành ủ nước mắm Phong Triều"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <span data-reveal className={eyebrow}>
              <Waves size={16} />
              Dành cho đối tác
            </span>
            <h2 data-reveal="0.1" className="font-playfair text-3xl leading-tight text-foreground md:text-4xl">
              Từ một giọt mắm ngon đến những kết nối bền lâu
            </h2>
            <div className="mt-8 grid gap-4">
              {benefits.map(({ icon: Icon, title, text }, i) => (
                <div
                  key={title}
                  data-reveal={0.15 + i * 0.1}
                  className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm"
                >
                  <Icon size={30} strokeWidth={1.25} className="mt-0.5 shrink-0 text-primary" aria-hidden />
                  <div>
                    <h3 className="font-playfair text-lg font-semibold text-foreground">{title}</h3>
                    <p className="mt-1 text-sm">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 5. FORM ĐĂNG KÝ ───────── */}
      <section id="dang-ky" className="scroll-mt-24 bg-surface section-padding">
        <div data-reveal className="container-custom max-w-3xl rounded-3xl bg-white p-8 shadow-sm md:p-10">
          <h2 className="font-playfair text-3xl text-foreground">Đăng ký hợp tác phân phối</h2>
          <p className="mb-8 mt-3">
            Để lại thông tin, chúng tôi sẽ liên hệ trao đổi về nhu cầu hợp tác của bạn.
          </p>
          <PartnerForm />
        </div>
      </section>

      {/* ───────── 6. FAQ ───────── */}
      <section className="bg-background section-padding">
        <div className="container-custom max-w-3xl">
          <h2 data-reveal className="mb-8 text-center font-playfair text-3xl text-foreground">
            Câu hỏi thường gặp
          </h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details
                key={f.q}
                data-reveal={i * 0.05}
                className="group rounded-2xl bg-white shadow-sm open:shadow-brand"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-playfair text-lg text-foreground [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown
                    size={20}
                    className="shrink-0 text-primary transition-transform duration-300 group-open:rotate-180"
                  />
                </summary>
                <p className="px-6 pb-6 text-[15px]">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-10 flex items-center justify-center gap-2 text-sm">
            <Check size={16} className="text-primary" />
            Cần hỗ trợ thêm?{" "}
            <Link href="/lien-he" className="font-semibold text-primary underline underline-offset-4">
              Liên hệ Phong Triều
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
