import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionTitle } from "./SectionTitle";
import { ProjectCard } from "./ProjectCard";
import { memories } from "@/lib/memories";

gsap.registerPlugin(ScrollTrigger);

export function Gallery() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = cardsRef.current?.children;
    if (!cards || cards.length === 0) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      },
    );
  }, []);

  return (
    <section id="memories" className="scroll-mt-24 px-4 py-20 sm:py-32 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-6">
          <SectionTitle eyebrow="Kỷ Niệm" title="Những dấu chân đáng nhớ." />
          <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
            Một bộ sưu tập những khoảnh khắc đã làm nên chặng đường đại học đặc biệt này.
          </p>
        </div>

        <div ref={cardsRef} className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {memories.map((m) => (
            <ProjectCard key={m.title} project={m} />
          ))}
        </div>
      </div>
    </section>
  );
}
