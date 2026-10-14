import { motion, useReducedMotion } from "framer-motion";
import { ImageIcon } from "lucide-react";

const chapters = ["Gieo hạt", "Nảy mầm", "Đâm chồi", "Kết lá", "Nở hoa"];

export function Timeline() {
  const reduceMotion = useReducedMotion();
  return (
    <section
      id="journey"
      aria-labelledby="journey-title"
      className="scroll-mt-24 overflow-hidden px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-signature">
            Từng chút một, mình lớn lên
          </p>
          <h2 id="journey-title" className="mt-4 font-serif text-4xl font-bold sm:text-6xl">
            Hành trình rực rỡ
          </h2>
        </div>
        <ol className="relative space-y-16 before:absolute before:bottom-0 before:left-3 before:top-0 before:w-px before:bg-border md:space-y-24 md:before:left-1/2">
          {chapters.map((title, index) => (
            <motion.li
              key={title}
              initial={reduceMotion ? false : { opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65 }}
              className="relative grid items-center gap-8 pl-10 md:grid-cols-2 md:gap-20 md:pl-0"
            >
              <span
                aria-hidden="true"
                className="absolute left-1.5 top-10 h-3 w-3 rounded-full bg-signature ring-4 ring-background md:left-1/2 md:top-1/2 md:-translate-x-1/2"
              />
              <div className={index % 2 ? "md:col-start-2 md:row-start-1" : "md:text-right"}>
                <p className="text-xs uppercase tracking-[0.2em] text-signature">
                  Chương 0{index + 1}
                </p>
                <h3 className="mt-3 font-serif text-3xl font-bold sm:text-5xl">{title}</h3>
              </div>
              <div
                className={`flex aspect-[4/5] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card px-6 text-center text-muted-foreground ${index % 2 ? "md:col-start-1 md:row-start-1" : ""}`}
              >
                <ImageIcon size={32} strokeWidth={1} aria-hidden="true" />
                <p className="text-sm">Ảnh kỷ niệm đang được gom góp.</p>
                <span className="text-xs">{title} · Minh Quân sẽ bổ sung ảnh sau</span>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
