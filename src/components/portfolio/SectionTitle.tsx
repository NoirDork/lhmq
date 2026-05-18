import { motion } from "framer-motion";

export function SectionTitle({
  eyebrow,
  title,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground"
        >
          — {eyebrow}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-bold leading-[0.95] tracking-[-0.03em] sm:text-6xl lg:text-7xl"
      >
        {title}
      </motion.h2>
    </div>
  );
}
