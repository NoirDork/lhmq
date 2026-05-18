import { motion } from "framer-motion";
import { SectionTitle } from "./SectionTitle";
import { Reveal, RevealItem } from "./Reveal";
import { GraduationCap, BookOpen, Hash, Users } from "lucide-react";

const highlights = [
  { icon: GraduationCap, label: "University", value: "Crestwood University" },
  { icon: BookOpen, label: "Major", value: "Computer Science" },
  { icon: Hash, label: "Class", value: "CS2022A" },
  { icon: Users, label: "Student ID", value: "2021456789" },
];

export function Introduction() {
  return (
    <section id="invitation" className="px-4 py-32 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-amber-200 to-rose-300 dark:from-amber-900/60 dark:to-rose-900/60">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent,rgba(0,0,0,0.4))]" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-card/80 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Graduate</p>
                <p className="mt-1 font-semibold">Jordan Riley</p>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-7">
            <SectionTitle eyebrow="Invitation" title="My Graduation Day." />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              This graduation is not only the end of a university journey, but also a moment
              to thank my family, teachers, and friends who have supported me along the way.
            </motion.p>

            <Reveal className="mt-12 grid gap-4 sm:grid-cols-2">
              {highlights.map((h) => {
                const Icon = h.icon;
                return (
                  <RevealItem key={h.label} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                      <Icon size={16} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{h.label}</p>
                      <p className="text-sm font-medium">{h.value}</p>
                    </div>
                  </RevealItem>
                );
              })}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
