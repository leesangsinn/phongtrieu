"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Fade-up mượt cho mọi phần tử có thuộc tính data-reveal trong trang.
 * data-reveal="<delay giây>" (tuỳ chọn) để so le các phần tử cùng hàng.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: Number(el.dataset.reveal) || 0,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return null;
}
