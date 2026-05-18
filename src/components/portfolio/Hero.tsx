import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Mail, Globe, Instagram } from "lucide-react";
import { Signature } from "./Signature";
import { Reveal, RevealItem } from "./Reveal";

const info = [
  { Icon: Instagram, text: "@studio.folio" },
  { Icon: Globe, text: "studiofolio.com" },
  { Icon: MapPin, text: "Lisbon, PT" },
  { Icon: Mail, text: "hello@studio.folio" },
];

export function Hero() {
  return (
    <section id="home" className="relative px-4 pt-32 sm:px-6 lg:pt-40">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signature" />
            <span>Available for work — 2026</span>
          </span>
          <span>Designer · Developer · Creative</span>
        </motion.div>

        <div className="relative mt-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[20vw] font-bold leading-[0.85] tracking-[-0.04em] lg:text-[16rem]"
          >
            portfolio
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: -6 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-signature"
          >
            <Signature className="h-[40%] w-[70%] -translate-y-2" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
        >
          <p className="max-w-md text-lg text-muted-foreground">
            An independent design & development studio crafting editorial digital
            experiences for ambitious brands.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <span>View Work</span>
              <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
            >
              Contact Me
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
