"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, Mail, MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-animate",
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="relative section-padding bg-background overflow-hidden">
      {/* Background Image Decorative */}
      <div className="absolute -bottom-32 -right-32 w-1/2 h-[120%] opacity-[0.03] rotate-12 pointer-events-none">
        <Image
          src="/cau-chuyen-1.jpg"
          alt="Lu mắm dưới hoàng hôn"
          fill
          className="object-cover rounded-full blur-sm"
          sizes="50vw"
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Cột trái */}
          <div className="flex flex-col items-start contact-animate">
            <span className="section-label uppercase text-primary flex items-center gap-2">
              Liên hệ
            </span>
            <h2 className="section-title font-playfair mt-3 mb-6">
              Phong Triều luôn sẵn sàng lắng nghe
            </h2>
            <p className="text-text-muted font-epilogue mb-12">
              Hãy để lại lời nhắn, câu hỏi hoặc yêu cầu hợp tác. Đội ngũ chăm sóc khách hàng của Phong Triều sẽ phản hồi bạn trong thời gian sớm nhất.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-epilogue text-sm text-text-muted">Hotline</p>
                  <p className="font-playfair text-lg font-bold text-foreground">0979 425 607</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-epilogue text-sm text-text-muted">Email</p>
                  <p className="font-playfair text-lg font-bold text-foreground">mamdisanphongtrieu@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-epilogue text-sm text-text-muted">Văn phòng</p>
                  <p className="font-playfair text-lg font-bold text-foreground">cập nhật</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Form */}
          <div className="contact-animate">
            <form className="bg-card p-8 md:p-10 rounded-3xl shadow-sm border border-primary/10 flex flex-col gap-6 transition-shadow duration-300 hover:shadow-brand">
              <div>
                <label htmlFor="name" className="block font-epilogue text-sm font-semibold text-foreground mb-2">Họ và tên</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Nhập họ và tên của bạn"
                  className="w-full px-5 py-3 rounded-xl border border-primary/20 bg-background focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-epilogue text-sm"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block font-epilogue text-sm font-semibold text-foreground mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Nhập số điện thoại"
                    className="w-full px-5 py-3 rounded-xl border border-primary/20 bg-background focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-epilogue text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block font-epilogue text-sm font-semibold text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Nhập địa chỉ email"
                    className="w-full px-5 py-3 rounded-xl border border-primary/20 bg-background focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-epilogue text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block font-epilogue text-sm font-semibold text-foreground mb-2">Lời nhắn</label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Nhập lời nhắn của bạn"
                  className="w-full px-5 py-3 rounded-xl border border-primary/20 bg-background focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-epilogue text-sm resize-none"
                />
              </div>

              <button
                type="button"
                className="w-full py-4 rounded-xl bg-primary text-white font-epilogue font-bold uppercase tracking-wider hover:bg-primary-hover transition-colors duration-300 mt-2 shadow-sm shadow-primary/20 hover:shadow-sm hover:-translate-y-0.5"
              >
                Gửi lời nhắn
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
