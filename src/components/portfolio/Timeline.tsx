import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { DoorOpen, Camera, Award } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { Reveal, revealVariants } from "./Reveal";

const timeline = [
  {
    icon: DoorOpen,
    title: "Đón Khách Mời",
    desc: "Khách mời làm thủ tục và ổn định chỗ ngồi tại hội trường.",
  },
  {
    icon: Camera,
    title: "Chụp Hình Với Khách Mời",
    desc: "Cùng nhau ghi lại những khoảnh khắc kỷ niệm trước buổi lễ.",
  },
  {
    icon: Award,
    title: "Làm Lễ",
    desc: "Nghi thức trao bằng và những giây phút trang trọng của buổi lễ.",
  },
  {
    icon: Camera,
    title: "Chụp Hình Với Khách Mời",
    desc: "Tiếp tục chụp hình lưu niệm cùng gia đình và bạn bè sau lễ.",
  },
];

function TimelineCard({ event, index }: { event: (typeof timeline)[number]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = event.icon;

  const isMobile = useRef(typeof window !== "undefined" && window.innerWidth < 768);

  const { scrollYProgress } = useScroll({
    target: isMobile.current ? undefined : cardRef,
    offset: ["start end", "end start"],
  });

  const rotateY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [index % 2 === 0 ? 6 : -6, 0, index % 2 === 0 ? -6 : 6],
  );
  const yOffset = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -30]);

  return (
    <motion.div
      ref={cardRef}
      variants={revealVariants.item}
      whileHover={{ scale: 1.03 }}
      style={isMobile.current ? {} : { rotateY, y: yOffset }}
      className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-7 transition-shadow hover:shadow-xl hover:bg-accent"
    >
      <div>
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background">
          <span className="text-sm font-bold text-signature">0{index + 1}</span>
        </div>
        <h3 className="mt-6 text-xl font-semibold tracking-tight">{event.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{event.desc}</p>
      </div>
    </motion.div>
  );
}

export function Timeline() {
  return (
    <section id="timeline" className="scroll-mt-24 px-4 py-20 sm:py-32 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="Chương Trình" title="Lịch trình sự kiện." />
        <Reveal
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          style={{ perspective: 1200 }}
        >
          {timeline.map((t, i) => (
            <TimelineCard key={t.title} event={t} index={i} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
