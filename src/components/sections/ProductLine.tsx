"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { QrCode } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    name: "Di Sản",
    degree: "40 N",
    description: "Hương vị đậm đà theo phong cách truyền thống, dành cho người yêu thích nước mắm nguyên bản và làm quà tặng đặc sản.",
    color: "bg-amber-100",
    textColor: "text-amber-700",
    image: "/Phong Triều Di Sản.jpg",
  },
  {
    name: "Thanh Vị",
    degree: "30 N",
    description: "Dòng chủ lực, hướng đến vị dịu hơn cho nấu ăn và làm nước chấm hằng ngày - giảm 16% độ mặn so với nền truyền thống.",
    color: "bg-emerald-100",
    textColor: "text-emerald-700",
    image: "/Phong triều thanh vị.jpg",
  },
  {
    name: "Dưỡng Vị",
    degree: "20 N",
    description: "Lựa chọn định hướng giảm mặn (24%) cho người quan tâm lượng muối trong khẩu phần ăn, vẫn giữ trọn hương vị biển cả.",
    color: "bg-cyan-100",
    textColor: "text-cyan-700",
    image: "/Phong Triều Dưỡng Vị.jpg",
  },
];

export default function ProductLine() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".product-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
      
      gsap.fromTo(
        ".qr-banner",
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".qr-banner",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="products" ref={sectionRef} className="section-padding bg-background">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-label uppercase text-primary flex items-center justify-center gap-2">
            Sản phẩm
          </span>
          <h2 className="section-title font-lora mt-3">
            Ba dòng hương vị, một di sản nghề mắm
          </h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {products.map((product) => (
            <div
              key={product.name}
              className="product-card bg-card border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover flex flex-col items-center text-center"
            >
              <div className="relative w-full aspect-[4/5] mb-6 rounded-xl overflow-hidden bg-cream">
                <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-500 hover:scale-105" />
                <div className={`absolute top-4 right-4 w-12 h-12 rounded-full ${product.color} flex items-center justify-center shadow-sm`}>
                  <span className={`font-lora font-bold text-sm ${product.textColor}`}>
                    {product.degree}
                  </span>
                </div>
              </div>
              <h3 className="font-lora text-2xl font-bold text-foreground mb-4">
                {product.name}
              </h3>
              <p className="font-epilogue text-text-muted">
                {product.description}
              </p>
            </div>
          ))}
        </div>

        {/* QR Code Banner */}
        <div className="qr-banner bg-cream rounded-3xl p-8 md:p-12 border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="flex-1 text-center md:text-left">
            <h4 className="font-lora text-2xl font-bold text-foreground mb-3">
              Từ truyền thống đến trải nghiệm hiện đại
            </h4>
            <p className="font-epilogue text-text-muted">
              Mỗi sản phẩm Phong Triều được định hướng kết nối với nền tảng thông tin số. Khách hàng có thể <strong>quét QR Code trên bao bì</strong> để tìm hiểu câu chuyện thương hiệu, thông tin sản phẩm và nội dung liên quan đến quá trình sản xuất - minh bạch từ biển cả đến bàn ăn.
            </p>
          </div>
          <div className="w-40 h-40 bg-card p-4 rounded-2xl shadow-sm flex items-center justify-center shrink-0">
            <QrCode size={100} className="text-foreground" />
          </div>
        </div>
      </div>
    </section>
  );
}
