import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export interface Project {
  title: string;
  category: string;
  year: string;
  description: string;
  hue: string;
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
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
