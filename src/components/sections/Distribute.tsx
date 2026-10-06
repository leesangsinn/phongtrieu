"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Store, Globe, Truck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const channels = [
  {
    icon: Store,
    title: "Điểm bán trực tiếp",
    description: "Hệ thống hơn 500 siêu thị và cửa hàng tiện lợi trên toàn quốc.",
  },
  {
    icon: Globe,
    title: "Mua sắm trực tuyến",
    description: "Website chính thức, Shopee Mall và LazMall với nhiều ưu đãi độc quyền.",
  },
  {
    icon: Truck,
    title: "Giao hàng toàn quốc",
    description: "Đóng gói cẩn thận, vận chuyển nhanh chóng từ xưởng đến tận bếp nhà bạn.",
  },
];

export default function Distribute() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".distribute-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="distribute" ref={sectionRef} className="relative section-padding overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/Câu chuyện.jpg"
          alt="Hàng lu mắm dưới rặng dừa xanh"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(35,22,10,0.85)" }}
      />

      {/* Content */}
      <div className="relative z-10 container-custom text-center">
        <span className="section-label uppercase text-amber-300 flex items-center justify-center gap-2 distribute-item">
          Phân phối
        </span>
        <h2 className="section-title font-lora text-white mt-3 distribute-item">
          Mang hương vị truyền thống đi muôn nơi
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto mb-16 font-epilogue distribute-item">
          Với chiến lược đa kênh (Omnichannel), Phong Triều đảm bảo bạn luôn có thể dễ dàng tìm thấy và trải nghiệm những giọt nước mắm tinh túy nhất, dù ở bất cứ đâu.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {channels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <div key={index} className="distribute-item flex flex-col items-center p-6 rounded-2xl bg-card/5 backdrop-blur-sm border border-white/10">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-6">
                  <Icon size={32} className="text-white" />
                </div>
                <h3 className="font-lora text-xl font-bold text-white mb-3">
                  {channel.title}
                </h3>
                <p className="font-epilogue text-white/70">
                  {channel.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
