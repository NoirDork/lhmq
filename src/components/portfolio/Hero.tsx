import { useCallback, useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, MapPin, Mail, Calendar, GraduationCap } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Reveal, RevealItem } from "./Reveal";
import { ParticleField } from "./ParticleField";
import handSig from "/images/hand-sig/hand-sig.png";

const info = [
  { Icon: GraduationCap, text: "Đại học Kinh tế - Luật, ĐHQG-HCM" },
  { Icon: Calendar, text: "Lễ Tốt Nghiệp — 2026" },
  { Icon: MapPin, text: "Trường Đại học Kinh tế - Luật, ĐHQG-HCM" },
  { Icon: Mail, text: "lamquan3005@gmail.com" },
];

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const prefersReduced = useReducedMotion();

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springMX = useSpring(mouseX, { stiffness: 150, damping: 30 });
  const springMY = useSpring(mouseY, { stiffness: 150, damping: 30 });

  const { scrollY } = useScroll({
    target: prefersReduced ? undefined : sectionRef,
    offset: ["start start", "end start"],
  });
  const scrollProgress = useTransform(scrollY, [0, 600], [0, 1]);

  const noMotion = prefersReduced ? 0 : undefined;
  const heroTextRotateX = useTransform(scrollProgress, [0, 1], [0, noMotion ?? 12]);
  const heroTextY = useTransform(scrollProgress, [0, 1], [0, noMotion ?? 100]);
  const heroTextOpacity = useTransform(scrollProgress, [0, 0.6], [1, noMotion ?? 0]);
  const badgeY = useTransform(scrollProgress, [0, 1], [0, noMotion ?? -60]);
  const ctaY = useTransform(scrollProgress, [0, 1], [0, noMotion ?? 80]);
  const ctaOpacity = useTransform(scrollProgress, [0, 0.5], [1, noMotion ?? 0]);

  const textLayerX = useTransform(springMX, [0, 1], [-20, 20]);
  const textLayerY = useTransform(springMY, [0, 1], [-15, 15]);
  const badgeLayerX = useTransform(springMX, [0, 1], [-10, 10]);
  const badgeLayerY = useTransform(springMY, [0, 1], [-8, 8]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY],
  );

  const onMouseLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  useGSAP(() => {
    if (prefersReduced) return;
    const tl = gsap.timeline({ defaults: { ease: "power1.inOut" } });
    tl.to(dotRef.current, { scale: 1.35, duration: 1.8, repeat: -1, yoyo: true }, 0);
    tl.to(shimmerRef.current, { backgroundPosition: "100% 0%", duration: 7, repeat: -1, ease: "none" }, 0);
  }, [prefersReduced]);

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative overflow-hidden px-4 pt-20 sm:pt-32 sm:px-6 lg:pt-40"
    >
      <ParticleField />
      <div className="relative z-10 mx-auto max-w-7xl" style={{ perspective: 1000 }}>
        <motion.div
          style={{ x: badgeLayerX, y: badgeLayerY }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1">
            <span
              ref={dotRef}
              className="inline-block h-1.5 w-1.5 rounded-full bg-signature"
            />
            <span>Bạn đã được mời — 2026</span>
          </span>
          <span>Khóa 2026 · Tài chính – Ngân hàng</span>
        </motion.div>

        <div className="relative mt-10" style={{ perspective: 1000 }}>
          <motion.h1
            style={{
              rotateX: heroTextRotateX,
              y: heroTextY,
              opacity: heroTextOpacity,
              x: textLayerX,
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative font-serif text-[16vw] font-bold leading-[0.85] tracking-[-0.04em] sm:text-[20vw] lg:text-[16rem]"
          >
            <span
              ref={shimmerRef}
              className="bg-[length:250%_100%] bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, var(--foreground) 35%, var(--signature) 50%, var(--foreground) 65%)',
                backgroundPosition: "0% 0%",
              }}
            >
              graduation
            </span>
            <img
              src={handSig}
              alt=""
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-auto w-[clamp(120px,22vw,300px)] -translate-x-1/2 -translate-y-[50%] select-none sm:w-[clamp(160px,22vw,300px)] sm:-translate-y-[44%]"
            />
          </motion.h1>
        </div>

        <motion.div
          style={{ y: ctaY, opacity: ctaOpacity }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <div className="max-w-md">
            <p className="text-lg text-muted-foreground">
              Bạn được mời đến dự lễ tốt nghiệp đại học của tôi.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Sau những năm tháng học tập, nỗ lực và kỷ niệm khó quên, ngày đặc biệt này
              đánh dấu sự khởi đầu của một hành trình mới. Sự hiện diện của bạn sẽ làm
              cho ngày này thêm ý nghĩa.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="#details"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <span>Xem Chi Tiết</span>
              <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
            </a>
            <a
              href="#rsvp"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
            >
              Gửi Lời Chúc
            </a>
          </div>
        </motion.div>

        <Reveal className="mt-16 grid grid-cols-2 gap-y-4 border-t border-border pt-6 text-sm text-muted-foreground md:grid-cols-4">
          {info.map(({ Icon, text }) => (
            <RevealItem key={text} className="flex items-center gap-2">
              <Icon size={14} />
              <span>{text}</span>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
