import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  "Ngày đầu đến trường",
  "Đêm thức ôn bài",
  "Những tình bạn đẹp",
  "Bao đồ án hoàn thành",
  "Bài học ngoài giáo trình",
  "Hành trình đáng nhớ",
];

export function About() {
  const milestonesRef = useRef<HTMLUListElement>(null);

  useGSAP(() => {
    const items = milestonesRef.current?.children;
    if (!items || items.length === 0) return;
    gsap.fromTo(
      items,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: {
          trigger: milestonesRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      },
    );
  }, []);

  return (
    <section id="about" className="scroll-mt-24 px-4 py-20 sm:py-32 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl text-5xl font-bold leading-[1.02] tracking-[-0.03em] sm:text-7xl lg:text-8xl"
        >
          Một hành trình <span className="text-muted-foreground">trưởng thành, đam mê & tình bạn</span> —
          kết tinh trong ngày đặc biệt này.
        </motion.h2>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg leading-relaxed text-muted-foreground"
          >
            Từ ngày đầu bước chân vào giảng đường đến khi hoàn thành luận văn tốt nghiệp, những năm
            tháng này đầy ắp thử thách, tiếng cười và sự trưởng thành. Tôi biết ơn sâu sắc mỗi thầy
            cô, bạn bè và người thân đã luôn ở bên cạnh. Tấm bằng này thuộc về tất cả chúng ta.
          </motion.p>

          <ul
            ref={milestonesRef}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          >
            {milestones.map((s) => (
              <li
                key={s}
                className="rounded-2xl border border-border bg-card px-4 py-5 text-sm font-medium transition-colors hover:bg-accent"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
