"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container, Soup, QrCode, Waves } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    icon: Container,
    title: "Tay nghề và tinh chỉnh chính trực",
    text: "Tôn trọng tri thức nghề, phương pháp ủ chượp truyền thống.",
  },
  {
    icon: Soup,
    title: "Lấy khách hàng làm trung tâm",
    text: "Lắng nghe sự khác biệt về khẩu vị, thói quen sử dụng và nhu cầu mua sắm.",
  },
  {
    icon: QrCode,
    title: "Minh bạch trong vận hành",
    text: "Rõ ràng thông tin nguyên liệu, quá trình sản xuất và dữ liệu truy xuất.",
  },
  {
    icon: Waves,
    title: "Đổi mới có mục đích",
    text: "Ứng dụng công nghệ để kiểm soát chất lượng và nâng cao trải nghiệm, không thay thế vai trò của người làm nghề.",
  },
];

export default function ValuesGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".value-head > *, .value-item",
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
    <section ref={sectionRef} className="section-padding bg-background">
      <div className="container-custom grid lg:grid-cols-[1fr_2.4fr] gap-12 items-center">
        <div className="value-head">
          <span className="section-label !text-sm">Giá trị cốt lõi</span>
          <h2 className="font-playfair text-4xl md:text-5xl text-deep-brown leading-tight">
            Những điều làm nên Phong Triều.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {values.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="value-item rounded-2xl bg-cream/60 px-5 py-8 text-center"
            >
              <Icon
                size={44}
                strokeWidth={1}
                className="mx-auto mb-5 text-primary/60"
                aria-hidden
              />
              <h3 className="font-playfair text-base font-semibold text-deep-brown mb-3 leading-snug">
                {title}
              </h3>
              <p className="text-xs leading-relaxed text-text-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
