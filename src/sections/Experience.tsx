import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/Section";
import { experiences } from "@/data/resume";
import { scaleIn, stagger, viewportOnce } from "@/utils/motion";

const gradients = [
  "radial-gradient(70% 80% at 80% 0%, rgba(10,132,255,0.55), transparent 70%)",
  "radial-gradient(70% 80% at 80% 0%, rgba(191,90,242,0.5), transparent 70%)",
  "radial-gradient(70% 80% at 80% 0%, rgba(255,159,10,0.45), transparent 70%)",
];

export function Experience() {
  const row = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) =>
    row.current?.scrollBy({ left: dir * 420, behavior: "smooth" });

  return (
    <section id="experience" className="panel scroll-mt-12 py-24 sm:py-32">
      <div className="shell-wide flex items-end justify-between gap-6">
        <SectionHeader
          eyebrow="Experience"
          title="Where the work happens."
          sub="Shipping to production since 2024."
          className="!mb-0"
        />
        <div className="hidden shrink-0 gap-2 pb-2 md:flex">
          {[-1, 1].map((d) => (
            <button
              key={d}
              onClick={() => scrollBy(d as 1 | -1)}
              aria-label={d === 1 ? "Next" : "Previous"}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/[0.06] text-light-text transition hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              {d === 1 ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        ref={row}
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="snap-row mt-12 cursor-grab active:cursor-grabbing sm:mt-16"
      >
        {experiences.map((exp, i) => (
          <motion.article
            key={exp.company}
            variants={scaleIn}
            className="snap-item relative flex w-[86vw] max-w-[420px] shrink-0 flex-col overflow-hidden rounded-4xl bg-black p-8 text-white shadow-tile-dark sm:min-h-[560px] sm:p-10"
          >
            <div aria-hidden className="absolute inset-0" style={{ background: gradients[i % 3] }} />
            <div className="relative flex h-full flex-col">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/55">
                {exp.type} · {exp.duration}
              </p>
              <h3 className="mt-5 text-[32px] font-semibold leading-[1.05] tracking-tight">
                {exp.company}
              </h3>
              <p className="mt-1 text-[17px] text-white/70">{exp.role}</p>
              <p className="text-[13px] text-white/45">{exp.location}</p>

              <ul className="mt-8 space-y-3 text-[15px] leading-snug text-white/80">
                {exp.highlights.map((h, hi) => (
                  <li key={hi} className="flex gap-3">
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-white/60" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap gap-2 pt-8">
                {exp.impact.map((im) => (
                  <span
                    key={im}
                    className="rounded-full bg-white/10 px-3 py-1 text-[12px] text-white/85 ring-1 ring-white/10"
                  >
                    {im}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
        <div className="w-2 shrink-0" />
      </motion.div>
    </section>
  );
}
