import { SectionTitle } from "./SectionTitle";
import { ProjectCard, type Memory } from "./ProjectCard";
import { Reveal } from "./Reveal";

const memories: Memory[] = [
  { slug: "university-memories", title: "University Memories", caption: "From lectures to late nights — every moment shaped who I am today.", hue: "from-amber-200 to-rose-300 dark:from-amber-900/60 dark:to-rose-900/60" },
  { slug: "friends-classmates", title: "Friends & Classmates", caption: "The people who made the journey unforgettable.", hue: "from-emerald-200 to-teal-400 dark:from-emerald-900/60 dark:to-teal-900/60" },
  { slug: "graduation-moments", title: "Graduation Moments", caption: "The cap toss, the smiles, and the pride of reaching this day.", hue: "from-slate-300 to-slate-500 dark:from-slate-700 dark:to-slate-900" },
  { slug: "behind-the-journey", title: "Behind the Journey", caption: "The sweat, tears, and perseverance that led to this milestone.", hue: "from-stone-200 to-stone-400 dark:from-stone-700 dark:to-stone-900" },
  { slug: "family-support", title: "Family Support", caption: "To my family — thank you for believing in me every step of the way.", hue: "from-indigo-200 to-violet-300 dark:from-indigo-900/60 dark:to-violet-900/60" },
  { slug: "new-beginning", title: "New Beginning", caption: "One chapter ends — a new adventure begins.", hue: "from-sky-200 to-cyan-300 dark:from-sky-900/60 dark:to-cyan-900/60" },
];

export function Gallery() {
  return (
    <section id="memories" className="px-4 py-32 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-6">
          <SectionTitle eyebrow="Memories" title="A walk to remember." />
          <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
            A collection of moments that made this university journey special.
          </p>
        </div>

        <Reveal className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {memories.map((m) => (
            <ProjectCard key={m.title} project={m} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}