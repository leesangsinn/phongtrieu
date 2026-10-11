"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const articles = [
  {
    id: 1,
    category: "Di sản nghề mắm",
    title: "Phong Triều – Gió đưa vị biển, quyện về vị quê",
    description: "Câu chuyện của người làm nghề và đời sống vùng biển, nơi nghề truyền thống được tiếp nối qua từng thế hệ.",
    image: "/di-san-nghe-mam.jpg",
    date: "15/10/2026",
  },
  {
    id: 2,
    category: "Di sản nghề mắm",
    title: "Từ cá và muối đến giọt nước mắm truyền thống",
    description: "Hành trình bền bỉ của người thợ ủ chượp từ những mẻ cá đầu tiên đến từng giọt nước mắm tinh túy.",
    image: "/cau-chuyen.jpg",
    date: "10/10/2026",
  },
  {
    id: 3,
    category: "Kiến thức nước mắm",
    title: "Độ đạm và độ mặn: Người tiêu dùng nên hiểu thế nào?",
    description: "Tìm hiểu ý nghĩa của độ đạm, độ mặn và cách đọc thông tin trên nhãn chai nước mắm để chọn đúng sản phẩm.",
    image: "/doi-moi-co-chon-loc.jpg",
    date: "05/10/2026",
  },
  {
    id: 4,
    category: "Bếp Việt",
    title: "Bữa cơm Việt và những hương vị thân quen",
    description: "Gợi ý những món ngon đậm đà bản sắc từ nguyên liệu sẵn có, kết hợp cùng nước mắm Phong Triều.",
    image: "/disan.png",
    date: "01/10/2026",
  },
];

export default function News() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".news-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
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
    <section id="news" ref={sectionRef} className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="section-label uppercase text-primary flex items-center justify-center gap-2">
            Góc Phong Triều
          </span>
          <h2 className="section-title font-playfair mt-3">
            Chia sẻ cảm hứng & tri thức
          </h2>
          <p className="text-text-muted font-epilogue mt-4">
            Những câu chuyện về nghề mắm, kiến thức về nước mắm và cảm hứng ẩm thực Việt được Phong Triều chia sẻ nhằm đưa giá trị truyền thống đến gần hơn với đời sống hiện đại.
          </p>
        </div>

        {/* Cột chính chứa tin tức */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Cột trái: Bài báo lớn nổi bật */}
          <div className="lg:col-span-7 news-item">
            <div className="group relative overflow-hidden rounded-3xl bg-card shadow-sm border border-primary/5 h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={articles[0].image}
                  alt={articles[0].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="font-epilogue text-xs font-bold text-primary uppercase tracking-wider">
                    {articles[0].category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <span className="font-epilogue text-xs text-text-muted mb-3">
                  {articles[0].date}
                </span>
                <h3 className="font-playfair text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {articles[0].title}
                </h3>
                <p className="font-epilogue text-text-muted mb-6 flex-1">
                  {articles[0].description}
                </p>
                <div className="flex items-center text-primary font-epilogue font-bold text-sm uppercase tracking-wider">
                  Đọc tiếp <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Các bài báo phụ */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {articles.slice(1).map((article) => (
              <div key={article.id} className="group relative overflow-hidden rounded-2xl bg-card shadow-sm border border-primary/5 flex h-full cursor-pointer hover:shadow-md transition-shadow news-item">
                <div className="relative w-1/3 aspect-[4/5] sm:aspect-square md:aspect-auto md:w-2/5 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1 justify-center">
                  <span className="font-epilogue text-[10px] font-bold text-primary uppercase tracking-wider mb-2">
                    {article.category}
                  </span>
                  <h3 className="font-playfair text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <span className="font-epilogue text-xs text-text-muted mt-auto">
                    {article.date}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
        
        {/* Nút Xem tất cả */}
        <div className="mt-12 text-center news-item">
          <button className="btn-secondary">
            Xem tất cả bài viết
          </button>
        </div>
      </div>
    </section>
  );
}
