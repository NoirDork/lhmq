import { motion } from "framer-motion";
import { Layout, Code2, Sparkles, FileText, User, Palette, ArrowUpRight } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { Reveal, revealVariants } from "./Reveal";

const services = [
  { icon: Layout, title: "Web Design", desc: "Editorial sites and product pages designed with rhythm and craft." },
  { icon: Code2, title: "Frontend Development", desc: "Production-ready React, Tailwind, and motion implementations." },
  { icon: Sparkles, title: "UI/UX Design", desc: "Interfaces that balance clarity, brand, and conversion." },
  { icon: FileText, title: "Landing Page Design", desc: "High-converting launch pages built to move metrics." },
  { icon: User, title: "Portfolio Website", desc: "Personal sites for designers, founders, and creatives." },
  { icon: Palette, title: "Brand Identity", desc: "Logos, type systems, and visual languages with longevity." },
];

export function Services() {
  return (
    <section id="services" className="px-4 py-32 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="Services" title="What I do." />
        <Reveal className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                variants={revealVariants.item}
                whileHover={{ scale: 1.02 }}
                className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-7 transition-colors hover:bg-accent"
              >
                <div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
                <ArrowUpRight
                  size={18}
                  className="mt-8 text-muted-foreground transition-transform group-hover:rotate-45 group-hover:text-foreground"
                />
              </motion.div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
