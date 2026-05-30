import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function ScrollProgress() {
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!lineRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.to(lineRef.current, {
      scaleY: 1,
      transformOrigin: "top center",
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    });
  }, []);

  return (
    <div
      ref={lineRef}
      className="fixed left-0 top-0 z-[60] h-full w-[2px] origin-top scale-y-0"
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, rgba(212,168,83,0.25) 20%, rgba(212,168,83,0.5) 50%, rgba(212,168,83,0.25) 80%, transparent 100%)",
      }}
      aria-hidden="true"
    />
  );
}
