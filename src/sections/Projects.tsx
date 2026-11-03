import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { projects } from "@/data/resume";
import { viewportOnce } from "@/utils/motion";
import { Magnetic } from "@/components/fx/Magnetic";
import type { Project } from "@/types";

const accents = [
  ["#0a84ff", "#5e5ce6"],
  ["#30d158", "#64d2ff"],
  ["#ff9f0a", "#ff375f"],
];

/** Sticky stacking card: each one pins, then scales back as the next slides over. */
function Card({ p, i, total }: { p: Project; i: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, i === total - 1 ? 1 : 0.4]);
  const accent = accents[i % accents.length];

  return (
    <div ref={ref} className="sticky top-16 mb-8" style={{ top: `calc(4rem + ${i * 14}px)` }}>
      <motion.article
        style={{ scale, opacity }}
        className="relative grid overflow-hidden rounded-[2rem] bg-[#0c0c0d] text-white shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/10 lg:min-h-[560px] lg:grid-cols-2"
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-90"
          style={{
            background: `radial-gradient(80% 70% at 100% 0%, ${accent[0]}80, transparent 60%), radial-gradient(60% 60% at 0% 100%, ${accent[1]}66, transparent 60%)`,
          }}
        />
        <div className="grain absolute inset-0" />

        <div className="relative p-8 sm:p-12 lg:p-14">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[12px] text-white/40">0{i + 1} / 0{total}</span>
            <span className="h-px w-10 bg-white/20" />
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50">
              {p.tagline}{p.date && ` · ${p.date}`}
            </span>
          </div>
          <h3 className="mt-8 font-semibold leading-[1.02] tracking-tightest" style={{ fontSize: "clamp(2.25rem, 4.5vw, 4rem)" }}>
            {p.name}
          </h3>
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-white/65">{p.description}</p>

          <div className="mt-8 flex flex-wrap gap-2">
            {p.technologies.map((t) => (
              <Badge key={t} onDark>{t}</Badge>
            ))}
          </div>

          {p.github && (
            <div className="mt-10">
              <Magnetic strength={0.25}>
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn sheen bg-white text-black hover:bg-white"
                >
                  View on GitHub <ArrowUpRight size={16} />
                </a>
              </Magnetic>
            </div>
          )}
        </div>

        <div className="relative flex flex-col justify-end gap-3 p-8 sm:p-12 lg:p-14">
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/40">Architecture</p>
          {p.architecture.map((a, ai) => (
            <motion.div
              key={ai}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ delay: 0.1 + ai * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-[14px] leading-snug text-white/85 backdrop-blur-xl"
            >
              <span className="mr-3 font-mono text-[11px] text-white/40">0{ai + 1}</span>
              {a}
            </motion.div>
          ))}
          <ul className="mt-6 space-y-2 border-t border-white/10 pt-6 text-[14px] text-white/70">
            {p.achievements.map((ach, k) => (
              <li key={k} className="flex gap-3">
                <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full" style={{ background: accent[0] }} />
                {ach}
              </li>
            ))}
          </ul>
        </div>
      </motion.article>
    </div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-12 bg-light-bg py-24 dark:bg-dark-bg sm:py-32">
      <div className="shell">
        <SectionHeader eyebrow="Projects" title="Selected work." sub="Backend first, end to end." />
      </div>
      <div className="shell-wide">
        {projects.map((p, i) => (
          <Card key={p.name} p={p} i={i} total={projects.length} />
        ))}
      </div>
    </section>
  );
}
