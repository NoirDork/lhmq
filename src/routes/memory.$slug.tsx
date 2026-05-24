import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Heart } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function imageUrl(slug: string, index: number): string {
  return `https://picsum.photos/seed/${slug}-${index}/800/600`;
}

const memories: Record<
  string,
  { title: string; caption: string; detail: string; hue: string; images: number }
> = {
  "university-memories": {
    title: "University Memories",
    caption: "From lectures to late nights — every moment shaped who I am today.",
    detail:
      "The university years were a whirlwind of new experiences. From the very first lecture hall to the final exam, every day brought something new — friendships, knowledge, challenges, and triumphs. The library sessions, the group projects, the cafeteria laughs — all of it built the foundation for who I've become.",
    hue: "from-amber-200 to-rose-300 dark:from-amber-900/60 dark:to-rose-900/60",
    images: 5,
  },
  "friends-classmates": {
    title: "Friends & Classmates",
    caption: "The people who made the journey unforgettable.",
    detail:
      "None of this would have been the same without the incredible people I met along the way. Classmates who became study partners, then became friends, then became family. The shared stress before exams, the celebrations after deadlines, and the countless memories in between — these bonds will last a lifetime.",
    hue: "from-emerald-200 to-teal-400 dark:from-emerald-900/60 dark:to-teal-900/60",
    images: 5,
  },
  "graduation-moments": {
    title: "Graduation Moments",
    caption: "The cap toss, the smiles, and the pride of reaching this day.",
    detail:
      "Walking across that stage, diploma in hand, was the culmination of years of dedication. The applause, the cheers from family in the crowd, the weight of the graduation gown — every second was surreal. This is the moment we all worked toward, and it was everything we dreamed it would be.",
    hue: "from-slate-300 to-slate-500 dark:from-slate-700 dark:to-slate-900",
    images: 5,
  },
  "behind-the-journey": {
    title: "Behind the Journey",
    caption: "The sweat, tears, and perseverance that led to this milestone.",
    detail:
      "What you see on graduation day is just the tip of the iceberg. Behind every cap and gown are countless all-nighters, moments of doubt, pages of notes, cups of coffee, and the quiet determination to keep going when things got hard. This journey taught me resilience, patience, and the value of hard work.",
    hue: "from-stone-200 to-stone-400 dark:from-stone-700 dark:to-stone-900",
    images: 4,
  },
  "family-support": {
    title: "Family Support",
    caption: "To my family — thank you for believing in me every step of the way.",
    detail:
      "My family has been my anchor through it all. From the late-night pep talks to the unwavering belief in my potential, they never let me give up. They celebrated my small victories and lifted me during my low moments. This diploma is as much theirs as it is mine.",
    hue: "from-indigo-200 to-violet-300 dark:from-indigo-900/60 dark:to-violet-900/60",
    images: 3,
  },
  "new-beginning": {
    title: "New Beginning",
    caption: "One chapter ends — a new adventure begins.",
    detail:
      "Graduation isn't just an ending — it's a doorway to everything that comes next. Armed with knowledge, memories, and the support of those who believed in me, I'm ready to step into the world and build the future. The best is yet to come.",
    hue: "from-sky-200 to-cyan-300 dark:from-sky-900/60 dark:to-cyan-900/60",
    images: 3,
  },
};

export const Route = createFileRoute("/memory/$slug")({
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold text-foreground">Memory not found</h1>
        <p className="mt-4 text-muted-foreground">This memory doesn't seem to exist.</p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <ArrowLeft size={16} />
          Back home
        </Link>
      </div>
    </div>
  ),
  component: MemoryDetail,
});

function MemoryDetail() {
  const { slug } = Route.useParams();
  const memory = memories[slug];

  if (!memory) return null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8"
        >
          <Carousel className="w-full">
            <CarouselContent>
              {Array.from({ length: memory.images }).map((_, i) => (
                <CarouselItem key={i}>
                  <div className="relative aspect-[16/9] overflow-hidden rounded-3xl">
                    <div className={`absolute inset-0 bg-gradient-to-br ${memory.hue}`} />
                    <img
                      src={imageUrl(slug, i)}
                      alt={`${memory.title} — photo ${i + 1}`}
                      className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-70"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,transparent,rgba(0,0,0,0.35))]" />
                    <div className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full bg-card/80 px-4 py-2 text-sm backdrop-blur">
                      <Heart size={14} className="text-signature" />
                      <span>
                        {i + 1} / {memory.images}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1 className="mt-10 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            {memory.title}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 text-lg leading-relaxed text-muted-foreground"
        >
          {memory.detail}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 flex justify-center"
        >
          <Link
            to="/"
            hash="memories"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to all memories
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
