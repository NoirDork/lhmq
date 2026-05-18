import { SectionTitle } from "./SectionTitle";
import { ProjectCard, type Project } from "./ProjectCard";

const projects: Project[] = [
  { title: "Aurora", category: "Brand & Web", year: "2025", description: "Identity system and marketing site for a climate fintech.", hue: "from-amber-200 to-rose-300 dark:from-amber-900/60 dark:to-rose-900/60" },
  { title: "Northwind", category: "Editorial", year: "2025", description: "A long-form publishing platform with custom typography.", hue: "from-emerald-200 to-teal-400 dark:from-emerald-900/60 dark:to-teal-900/60" },
  { title: "Halo Studio", category: "Web Design", year: "2024", description: "Portfolio website for a motion design collective.", hue: "from-slate-300 to-slate-500 dark:from-slate-700 dark:to-slate-900" },
  { title: "Form & Field", category: "E-commerce", year: "2024", description: "Headless storefront for an independent ceramics brand.", hue: "from-stone-200 to-stone-400 dark:from-stone-700 dark:to-stone-900" },
  { title: "Cadence", category: "Product UI", year: "2023", description: "Dashboard and onboarding for a music analytics SaaS.", hue: "from-indigo-200 to-violet-300 dark:from-indigo-900/60 dark:to-violet-900/60" },
  { title: "Atlas Maps", category: "Brand", year: "2023", description: "Wordmark and editorial system for a travel publication.", hue: "from-sky-200 to-cyan-300 dark:from-sky-900/60 dark:to-cyan-900/60" },
];

export function Work() {
  return (
    <section id="work" className="px-4 py-32 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-6">
          <SectionTitle eyebrow="Selected Work" title="Recent projects." />
          <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
            A small selection of recent client work spanning brand, product, and editorial.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
