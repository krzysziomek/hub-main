import { motion } from "framer-motion";
import type { Project } from "@/data/projects";

const accentMap: Record<Project["accent"], { bg: string; ring: string; chip: string }> = {
  pink: {
    bg: "from-[oklch(0.92_0.12_340)] to-[oklch(0.85_0.18_340)]",
    ring: "group-hover:shadow-[0_20px_50px_-15px_oklch(0.7_0.22_340/0.6)]",
    chip: "bg-[oklch(0.7_0.22_340)] text-white",
  },
  sky: {
    bg: "from-[oklch(0.92_0.1_220)] to-[oklch(0.82_0.16_220)]",
    ring: "group-hover:shadow-[0_20px_50px_-15px_oklch(0.7_0.18_220/0.6)]",
    chip: "bg-[oklch(0.65_0.18_220)] text-white",
  },
  mint: {
    bg: "from-[oklch(0.94_0.08_165)] to-[oklch(0.85_0.16_165)]",
    ring: "group-hover:shadow-[0_20px_50px_-15px_oklch(0.7_0.16_165/0.6)]",
    chip: "bg-[oklch(0.6_0.16_165)] text-white",
  },
  sunny: {
    bg: "from-[oklch(0.95_0.12_90)] to-[oklch(0.88_0.18_90)]",
    ring: "group-hover:shadow-[0_20px_50px_-15px_oklch(0.78_0.18_70/0.6)]",
    chip: "bg-[oklch(0.7_0.2_60)] text-white",
  },
  grape: {
    bg: "from-[oklch(0.9_0.12_300)] to-[oklch(0.78_0.2_300)]",
    ring: "group-hover:shadow-[0_20px_50px_-15px_oklch(0.62_0.22_300/0.6)]",
    chip: "bg-[oklch(0.62_0.22_300)] text-white",
  },
};

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const a = accentMap[project.accent];

  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative block overflow-hidden rounded-3xl bg-gradient-to-br ${a.bg} p-6 sm:p-8 shadow-card transition-shadow ${a.ring}`}
    >
      <div
        className="absolute -right-10 -top-10 h-40 w-40 bg-white/30 animate-blob"
        aria-hidden
      />
      <div className="relative flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-3xl shadow-sm transition-transform group-hover:rotate-6 group-hover:scale-110"
          aria-hidden
        >
          {project.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-xl sm:text-2xl font-bold text-[oklch(0.22_0.05_300)]">
              {project.name}
            </h3>
          </div>
          <p className="mt-2 text-sm sm:text-base text-[oklch(0.22_0.05_300/0.78)] leading-relaxed">
            {project.description}
          </p>
        </div>
      </div>
      <div className="relative mt-6 flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${a.chip}`}
        >
          live
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/90 animate-pulse" />
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-[oklch(0.22_0.05_300/0.75)] transition-transform group-hover:translate-x-1">
          odwiedź
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="h-4 w-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </motion.a>
  );
}
