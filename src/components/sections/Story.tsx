"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

export default function Story() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".story-content",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="story" ref={sectionRef} className="section-padding bg-cream">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Cột trái (Text) */}
          <div className="flex flex-col items-start story-content">
            <span className="section-label uppercase text-primary flex items-center gap-2">
              Câu chuyện thương hiệu
            </span>
            <h2 className="section-title font-playfair mt-3">
              Từ nhịp gió và con nước, lưu giữ hương vị quê nhà
            </h2>
            <div className="text-text-muted font-epilogue space-y-4">
              <p>
                Từ bao đời nay, cuộc sống của những người dân vùng biển gắn liền với nhịp gió và con nước. Gió đưa những con thuyền vươn khơi, con nước dẫn lối cho ngày trở về cùng những mẻ cá tươi. Từ cá và muối, qua quá trình ủ chượp bền bỉ theo thời gian, những giọt nước mắm dần hình thành - mang theo hương vị đặc trưng của biển cả và kinh nghiệm được truyền lại qua nhiều thế hệ.
              </p>
              <p>
                <strong>Tên gọi Phong Triều</strong> được khơi nguồn từ chính nhịp sống ấy. <em>&quot;Phong&quot;</em> là ngọn gió biển, tượng trưng cho hành trình vươn khơi, sự chuyển động và sức sống của người làm nghề. <em>&quot;Triều&quot;</em> là con nước lên xuống theo nhịp đại dương - biểu tượng cho vòng tuần hoàn của biển cả, nơi những mẻ cá ra đi rồi trở về, nơi nghề truyền thống được tiếp nối qua từng thế hệ.
              </p>
              <p>
                Phong Triều mong muốn gìn giữ không chỉ hương vị nước mắm, mà còn cả những giá trị văn hóa, tri thức nghề và ký ức gắn với bữa cơm Việt - đưa những giá trị ấy đến gần hơn với người tiêu dùng hiện đại.
              </p>
            </div>
          </div>

          {/* Cột phải (Hình ảnh) */}
          <div className="story-content h-full">
            <div className="relative h-[400px] lg:h-[500px] w-full rounded-2xl overflow-hidden shadow-sm">
              <Image
                src="/cau-chuyen.jpg"
                alt="Thợ khuấy lu mắm dưới ánh mặt trời"
                fill
                className="object-cover h-full"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
