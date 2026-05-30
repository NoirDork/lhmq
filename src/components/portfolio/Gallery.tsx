import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionTitle } from "./SectionTitle";
import { ProjectCard, type Memory } from "./ProjectCard";

gsap.registerPlugin(ScrollTrigger);

const memories: Memory[] = [
  {
    slug: "university-memories",
    title: "Kỷ Niệm Đại Học",
    caption: "Từ những buổi học đến đêm khuya — từng khoảnh khắc đã tạo nên tôi của ngày hôm nay.",
    hue: "from-amber-900/60 to-rose-900/60",
  },
  {
    slug: "friends-classmates",
    title: "Bạn Bè & Đồng Môn",
    caption: "Những người đã làm hành trình này thật khó quên.",
    hue: "from-emerald-900/60 to-teal-900/60",
  },
  {
    slug: "graduation-moments",
    title: "Khoảnh Khắc Tốt Nghiệp",
    caption: "Những nụ cười, niềm tự hào và chiếc mũ cử nhân tung bay.",
    hue: "from-slate-700 to-slate-900",
  },
  {
    slug: "behind-the-journey",
    title: "Hậu Trường Hành Trình",
    caption: "Mồ hôi, nước mắt và sự kiên trì dẫn đến cột mốc này.",
    hue: "from-stone-700 to-stone-900",
  },
  {
    slug: "family-support",
    title: "Hậu Phương Gia Đình",
    caption: "Gửi lời cảm ơn đến gia đình — những người luôn tin tưởng tôi từng bước trên đường đời.",
    hue: "from-indigo-900/60 to-violet-900/60",
  },
  {
    slug: "new-beginning",
    title: "Khởi Đầu Mới",
    caption: "Một chương kết thúc — một cuộc phiêu lưu mới bắt đầu.",
    hue: "from-sky-900/60 to-cyan-900/60",
  },
];

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

        <div
          ref={cardsRef}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {memories.map((m) => (
            <ProjectCard key={m.title} project={m} />
          ))}
        </div>
      </div>
    </section>
  );
}
