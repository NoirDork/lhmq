import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { revealVariants } from "./Reveal";

export interface Project {
  title: string;
  category: string;
  year: string;
  description: string;
  hue: string;
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      variants={revealVariants.item}
      whileHover={{ y: -4 }}
      className="group cursor-pointer rounded-3xl border border-border bg-card p-4 transition-shadow hover:shadow-xl"
    >
      <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br ${project.hue}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,transparent,rgba(0,0,0,0.35))]" />
        <div className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground transition-transform duration-500 group-hover:rotate-45">
          <ArrowUpRight size={16} />
        </div>
        <span className="absolute bottom-4 left-4 rounded-full bg-card/80 px-3 py-1 text-xs backdrop-blur">
          {project.category} · {project.year}
        </span>
      </div>
      <div className="px-2 pb-2 pt-5">
        <h3 className="text-xl font-semibold tracking-tight">{project.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
      </div>
    </motion.article>
  );
}
