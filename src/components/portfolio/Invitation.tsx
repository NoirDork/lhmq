import { motion, useReducedMotion } from "framer-motion";
import { Reveal, RevealItem } from "./Reveal";
import { GraduationCap, BookOpen, Hash, Users } from "lucide-react";
import coverPhoto from "../../../images/bìa.jpg";
import { Countdown } from "./Countdown";
import { SCHOOL } from "@/lib/event";

const highlights = [
  { icon: GraduationCap, label: "Trường", value: SCHOOL },
  { icon: BookOpen, label: "Ngành", value: "Tài chính – Ngân hàng" },
  { icon: Hash, label: "Lớp", value: "K22404" },
  { icon: Users, label: "MSSV", value: "K224040541" },
];

export function Invitation() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="invitation"
      aria-labelledby="invitation-title"
      className="relative isolate scroll-mt-0 overflow-hidden bg-[#091423]"
    >
      <img
        src={coverPhoto}
        alt={`Lâm Hồng Minh Quân trong áo tốt nghiệp tại ${SCHOOL}`}
        width={1331}
        height={885}
        decoding="async"
        className="absolute inset-x-0 top-0 h-[720px] w-full object-cover object-[78%_35%] sm:h-[800px] lg:h-full lg:object-[center_35%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[720px] bg-[linear-gradient(0deg,#091423_0%,rgba(9,20,35,0.25)_45%,rgba(9,20,35,0.6)_100%)] sm:h-[800px] lg:h-full lg:bg-[linear-gradient(0deg,rgba(9,20,35,0.9)_0%,rgba(9,20,35,0)_60%,rgba(9,20,35,0.55)_100%),linear-gradient(90deg,rgba(9,20,35,0.9)_0%,rgba(9,20,35,0.7)_32%,rgba(9,20,35,0.1)_70%)]"
      />
      <div className="relative mx-auto flex min-h-svh max-w-7xl flex-col gap-10 px-6 pb-8 pt-[420px] sm:px-8 sm:pt-[460px] lg:min-h-[max(800px,100svh)] lg:px-6 lg:pb-10 lg:pt-40">
        <p className="absolute left-6 right-6 top-24 text-xs leading-relaxed tracking-[0.12em] text-white/85 sm:left-8 sm:right-8 lg:left-6">
          {SCHOOL} · KHÓA 2026
        </p>
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl lg:my-auto lg:max-w-[62%]"
        >
          <p className="mb-5 text-xs uppercase tracking-[0.28em] text-white/90 sm:text-sm">
            Thư mời tham dự
          </p>
          <h2
            id="invitation-title"
            className="font-serif text-[clamp(3rem,5.5vw,6rem)] font-bold leading-[1.2] tracking-[-0.03em] text-primary"
          >
            Lễ tốt nghiệp
          </h2>
          <div aria-hidden="true" className="my-6 h-px w-20 bg-white/40 sm:my-8" />
          <p className="max-w-2xl text-balance font-serif text-[clamp(2.25rem,4vw,4.5rem)] font-bold leading-[1.2] tracking-[-0.02em] text-white">
            Lâm Hồng Minh Quân
          </p>
          <div className="mt-8 max-w-md text-white">
            <p className="mb-3 text-sm text-white/90">Cùng đếm ngược đến 10:30 · 23.10.2026</p>
            <Countdown />
          </div>
        </motion.div>
        <div className="grid gap-6 border-t border-white/20 pt-6 lg:grid-cols-12 lg:gap-10">
          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-xl text-base leading-relaxed text-white/90 lg:col-span-4"
          >
            Tốt nghiệp không chỉ là kết thúc một hành trình đại học, mà còn là khoảnh khắc để cảm ơn
            gia đình, thầy cô và bạn bè đã luôn đồng hành cùng tôi trên chặng đường này.
          </motion.p>

          <Reveal className="grid grid-cols-2 gap-3 lg:col-span-8">
            {highlights.map((h) => {
              const Icon = h.icon;
              return (
                <RevealItem
                  key={h.label}
                  className="flex min-w-0 flex-col items-start gap-3 rounded-2xl border border-white/20 bg-slate-950/40 p-3 text-white sm:flex-row sm:items-center sm:p-4"
                >
                  <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-primary sm:h-10 sm:w-10">
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.2em] text-primary">{h.label}</p>
                    <p className="mt-1 break-words text-sm font-medium">{h.value}</p>
                  </div>
                </RevealItem>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
