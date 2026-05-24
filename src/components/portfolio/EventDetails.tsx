import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Shirt, Bell } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { Reveal, RevealItem } from "./Reveal";

const details = [
  { icon: Calendar, label: "Date", value: "Saturday, June 20, 2026" },
  { icon: Clock, label: "Time", value: "09:00 AM — 01:00 PM" },
  { icon: MapPin, label: "Venue", value: "Crestwood Convention Center" },
  { icon: Shirt, label: "Dress Code", value: "Formal / Graduation gown" },
  { icon: Bell, label: "Guest Note", value: "Please arrive early for check-in and photos" },
];

export function EventDetails() {
  return (
    <section id="details" className="px-4 py-32 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-6">
          <SectionTitle eyebrow="Event Details" title="Ceremony information." />
          <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
            Save the date and join us in celebrating this milestone.
          </p>
        </div>

        <Reveal className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {details.map((d) => {
            const Icon = d.icon;
            return (
              <RevealItem key={d.label}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col items-start gap-4 rounded-3xl border border-border bg-card p-7 transition-colors hover:bg-accent"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {d.label}
                    </p>
                    <p className="mt-1 text-lg font-semibold tracking-tight">{d.value}</p>
                  </div>
                </motion.div>
              </RevealItem>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
