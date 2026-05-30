import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import handSig from "/images/hand-sig/hand-sig.png";

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const inner = containerRef.current.querySelector("div");
    if (!inner) return;

    gsap.fromTo(
      inner,
      { opacity: 0, y: reduceMotion ? 0 : 40 },
      {
        opacity: 1,
        y: 0,
        duration: reduceMotion ? 0 : 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      },
    );
  }, []);

  return (
    <footer ref={containerRef} className="px-4 pb-10 pt-20 sm:px-6">
      <div className="mx-auto max-w-7xl rounded-3xl border border-border bg-card p-8 sm:p-12">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              — Với lòng biết ơn
            </p>
            <p className="mt-3 text-4xl font-bold tracking-[-0.02em] sm:text-6xl">
              cảm ơn bạn đã đến.
            </p>
          </div>
          <img
            src={handSig}
            alt=""
            aria-hidden
            className="h-20 w-auto translate-y-1 select-none sm:h-24 sm:translate-y-2 lg:h-28 lg:translate-y-3"
          />
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Lâm Hồng Minh Quân — Tốt Nghiệp 2026</p>
          <p>Đại học Kinh tế - Luật, ĐHQG-HCM · Tài chính – Ngân hàng</p>
        </div>
      </div>
    </footer>
  );
}
