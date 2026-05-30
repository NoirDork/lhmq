import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Calendar, Clock, MapPin, Shirt, Bell } from "lucide-react";
import { SectionTitle } from "./SectionTitle";

gsap.registerPlugin(ScrollTrigger);

const details = [
  { icon: Calendar, label: "Ngày", value: "Thứ Bảy, 20 tháng 6 năm 2026" },
  { icon: Clock, label: "Giờ", value: "09:00 — 13:00" },
  { icon: MapPin, label: "Địa Điểm", value: "Trường Đại học Kinh tế - Luật, ĐHQG-HCM" },
  { icon: Shirt, label: "Trang Phục", value: "Trang trọng / Áo cử nhân" },
  { icon: Bell, label: "Lưu Ý", value: "Vui lòng đến sớm để làm thủ tục và chụp ảnh" },
];

export function EventDetails() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = cardsRef.current?.children;
    if (!cards || cards.length === 0) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 24 },
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
    <section id="details" className="scroll-mt-24 px-4 py-20 sm:py-32 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-6">
          <SectionTitle eyebrow="Thông Tin" title="Thông tin buổi lễ." />
          <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
            Hãy lưu ngày và cùng chúng tôi kỷ niệm cột mốc quan trọng này.
          </p>
        </div>

        <div
          ref={cardsRef}
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {details.map((d) => {
            const Icon = d.icon;
            return (
              <motion.div
                key={d.label}
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-start gap-4 rounded-3xl border border-border bg-card p-7 transition-colors hover:bg-accent"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {d.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold tracking-tight">{d.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
