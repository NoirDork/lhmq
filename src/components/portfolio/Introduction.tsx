import { motion } from "framer-motion";
import { SectionTitle } from "./SectionTitle";
import { Reveal, RevealItem } from "./Reveal";

const previews = [
  { title: "Aurora — Brand System", tag: "Identity / 2025", hue: "from-neutral-300 to-neutral-500" },
  { title: "Northwind Editorial", tag: "Web / 2025", hue: "from-stone-300 to-stone-600" },
  { title: "Halo Studio Site", tag: "Web / 2024", hue: "from-zinc-300 to-zinc-600" },
];

export function Introduction() {
  return (
    <section className="px-4 py-32 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-200 to-neutral-400 dark:from-neutral-700 dark:to-neutral-900">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent,rgba(0,0,0,0.4))]" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-card/80 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Founder & Lead</p>
                <p className="mt-1 font-semibold">Alex Mercer</p>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-7">
            <SectionTitle eyebrow="Introduction" title="A studio for considered design." />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              We partner with founders and creative teams to design and build digital
              products with clarity and craft. Editorial layouts, motion, and code —
              shipped end-to-end.
            </motion.p>

            <Reveal className="mt-12 grid gap-5 sm:grid-cols-3">
              {previews.map((p) => (
                <RevealItem key={p.title} className="group cursor-pointer">
                  <div className={`aspect-square overflow-hidden rounded-2xl bg-gradient-to-br ${p.hue} transition-transform duration-500 group-hover:scale-[1.03]`} />
                  <p className="mt-3 text-sm font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.tag}</p>
                </RevealItem>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
