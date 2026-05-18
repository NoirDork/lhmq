import { motion } from "framer-motion";
import { Reveal, RevealItem } from "./Reveal";

const milestones = [
  "First day on campus",
  "Late-night study sessions",
  "Amazing friendships made",
  "Countless projects built",
  "Lessons beyond the classroom",
  "A journey to remember",
];

export function About() {
  return (
    <section id="about" className="px-4 py-32 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl text-5xl font-bold leading-[1.02] tracking-[-0.03em] sm:text-7xl lg:text-8xl"
        >
          A journey of <span className="text-muted-foreground">growth, passion & friendship</span> — culminating in this special day.
        </motion.h2>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg leading-relaxed text-muted-foreground"
          >
            From the first day walking onto campus to the final submission of my thesis,
            these years have been filled with challenges, laughter, and growth. I am deeply
            grateful to every professor, friend, and family member who stood by me. This
            graduation is as much yours as it is mine.
          </motion.p>

          <Reveal as="ul" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {milestones.map((s) => (
              <RevealItem
                key={s}
                className="rounded-2xl border border-border bg-card px-4 py-5 text-sm font-medium transition-colors hover:bg-accent"
              >
                {s}
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
