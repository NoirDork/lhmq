import { motion } from "framer-motion";

const skills = [
  "React",
  "UI/UX Design",
  "Frontend Development",
  "Motion Design",
  "Branding",
  "Web Performance",
];

export function About() {
  return (
    <section id="about" className="px-4 py-32 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl text-5xl font-bold leading-[1.02] tracking-[-0.03em] sm:text-7xl lg:text-8xl"
        >
          Hello, I'm <span className="text-muted-foreground">Alex Mercer</span> — a designer & developer building thoughtful digital work.
        </motion.h2>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <p className="text-lg leading-relaxed text-muted-foreground">
            Over the last decade I've helped startups and studios shape brands and
            ship interfaces — from early-stage product UI to fully-featured marketing
            sites. My work lives at the intersection of editorial design and
            engineering rigor.
          </p>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
            }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          >
            {skills.map((s) => (
              <motion.li
                key={s}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 },
                }}
                className="rounded-2xl border border-border bg-card px-4 py-5 text-sm font-medium transition-colors hover:bg-accent"
              >
                {s}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
