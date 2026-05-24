import { motion } from "framer-motion";
import { DoorOpen, Camera, Award, Users, GlassWater } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { Reveal, revealVariants } from "./Reveal";

const timeline = [
  {
    icon: DoorOpen,
    title: "Guest Arrival",
    desc: "Guests check in and find their seats in the main hall.",
  },
  {
    icon: Camera,
    title: "Photo Session",
    desc: "Graduates and families gather for commemorative photos.",
  },
  {
    icon: Award,
    title: "Graduation Ceremony",
    desc: "Degree conferral, speeches, and the moment we've all been waiting for.",
  },
  {
    icon: Users,
    title: "Family & Friends Gathering",
    desc: "A warm reception to celebrate with loved ones.",
  },
  {
    icon: GlassWater,
    title: "Celebration — Dinner",
    desc: "An intimate dinner to close the day with joy and gratitude.",
  },
];

export function Timeline() {
  return (
    <section id="timeline" className="px-4 py-32 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="Timeline" title="Event schedule." />
        <Reveal className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {timeline.map((t, i) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.title}
                variants={revealVariants.item}
                whileHover={{ scale: 1.02 }}
                className="group flex flex-col justify-between rounded-3xl border border-border bg-card p-7 transition-colors hover:bg-accent"
              >
                <div>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background">
                    <span className="text-sm font-bold text-signature">0{i + 1}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight">{t.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
