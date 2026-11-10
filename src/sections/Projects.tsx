import { useEffect, useRef, type CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Layer, Panel, SectionHeader } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { projects } from "@/data/resume";
import { fadeUp, viewportOnce } from "@/utils/motion";
import { Ores, Torch } from "@/mc/Ambient";
import { Chest } from "@/mc/models";
import { gem } from "@/mc/sprites";
import { play } from "@/mc/audio";
import type { Project } from "@/types";

const loot = ["#5fe0d8", "#3fd16a", "#f2c84b"];

/** A vault chest: the lid swings open and the loot floats up when the card scrolls into view. */
function Card({ p, i, total }: { p: Project; i: number; total: number }) {
  const head = useRef<HTMLDivElement>(null);
  // Open while the chest itself is comfortably on screen (not hidden behind the hotbar).
  const open = useInView(head, { amount: 1, margin: "-8% 0px -22% 0px" });
  const was = useRef(false);
  useEffect(() => {
    if (open !== was.current) play(open ? "chestOpen" : "chestClose");
    was.current = open;
  }, [open]);

  return (
    <motion.article variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce}>
      <Panel className="chest-host grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <div>
          <div ref={head} className="flex items-end gap-4" style={{ "--open": open ? 1 : 0 } as CSSProperties}>
            <Chest item={gem(loot[i % loot.length])} />
            <div className="pb-2">
              <p className="label mute">
                Chest 0{i + 1} / 0{total}
              </p>
              <p className="label mt-1" style={{ color: "var(--accent)" }}>
                {p.tagline}
                {p.date && ` · ${p.date}`}
              </p>
            </div>
          </div>

          <h3 className="mt-5 font-head font-bold leading-[0.95]" style={{ fontSize: "clamp(2.4rem, 4.8vw, 3.8rem)" }}>
            {p.name}
          </h3>
          <p className="mute mt-4 max-w-lg text-[23px] leading-tight">{p.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {p.technologies.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>

          {p.github && (
            <a href={p.github} target="_blank" rel="noopener noreferrer" className="mc-btn mc-btn-wood mt-8">
              View on GitHub <ArrowUpRight size={18} strokeWidth={3} />
            </a>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <p className="label mute mb-1">Architecture</p>
          {p.architecture.map((a, ai) => (
            <motion.div
              key={ai}
              initial={{ opacity: 0, x: 36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ delay: 0.1 + ai * 0.1, duration: 0.45, ease: [0.3, 1.5, 0.6, 1] }}
              className="mc-inset flex gap-3 px-4 py-3 leading-tight"
            >
              <span className="label mt-1" style={{ color: "var(--accent)" }}>0{ai + 1}</span>
              {a}
            </motion.div>
          ))}
          <ul className="mt-4 space-y-2.5 border-t-4 border-[#0e0e11]/25 pt-5">
            {p.achievements.map((ach, k) => (
              <li key={k} className="flex gap-3 leading-tight">
                <span className="bullet" />
                {ach}
              </li>
            ))}
          </ul>
        </div>
      </Panel>
    </motion.article>
  );
}

export function Projects() {
  return (
    <Layer
      id="projects"
      material="deep"
      wide
      fx={
        <>
          <Ores kinds={["gold", "diamond", "gold", "emerald"]} seed={14} density={0.35} />
          <Torch style={{ right: "3%", top: 200 }} />
          <Torch style={{ left: "2%", top: 980 }} />
          <Torch className="hidden md:block" style={{ right: "2%", top: 1760 }} />
        </>
      }
    >
      <SectionHeader eyebrow="Projects" title="Selected work." sub="Backend first, end to end." />
      <div className="space-y-10">
        {projects.map((p, i) => (
          <Card key={p.name} p={p} i={i} total={projects.length} />
        ))}
      </div>
    </Layer>
  );
}
