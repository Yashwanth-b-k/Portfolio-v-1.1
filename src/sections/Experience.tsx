import { useState } from "react";
import { motion } from "framer-motion";
import { Layer, Panel, SectionHeader } from "@/components/ui/Section";
import { experiences } from "@/data/resume";
import { fadeUp, viewportOnce } from "@/utils/motion";
import { BugField, Flyers, Ores, Torch } from "@/mc/Ambient";
import { Guide } from "@/mc/Guide";
import { ladder } from "@/mc/sprites";
import { css } from "@/mc/textures";

/** The stone mine. Each job is a landing on the way down — and the place is crawling with bugs. */
export function Experience() {
  const [squashed, setSquashed] = useState(0);

  return (
    <Layer
      id="experience"
      material="stone"
      fx={
        <>
          <Ores kinds={["iron", "coal", "iron"]} seed={9} density={0.4} />
          <Flyers kind="bat" count={2} />
          <Torch style={{ right: "6%", top: 180 }} />
          <Torch style={{ left: "3%", top: 760 }} />
          <Torch className="hidden md:block" style={{ right: "4%", top: 1300 }} />
        </>
      }
      over={<BugField count={6} onSquash={() => setSquashed((n) => n + 1)} />}
    >
      <SectionHeader eyebrow="Experience" title="Where the work happens." sub="Shipping to production since 2024." />

      <Guide
        look="miner"
        name="Shift lead"
        className="mb-12"
        say={["They come back. They always come back.", "Root cause first, patch second."]}
      >
        Careful — there are <b>production bugs</b> loose down here. Click one to squash it.
        <span className="mt-2 flex items-center gap-2">
          <motion.span
            key={squashed}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 14 }}
            className="chip chip-strong"
            aria-live="polite"
          >
            Squashed: {squashed}
          </motion.span>
          {squashed >= 5 && <span className="label text-[9px]">On-call hero!</span>}
        </span>
      </Guide>

      <ol className="relative space-y-10 md:pl-24">
        <span
          aria-hidden
          className="ladder absolute bottom-0 left-4 top-0 hidden w-12 md:block"
          style={{ backgroundImage: css(ladder()) }}
        />
        {experiences.map((exp, i) => (
          <motion.li key={exp.company} variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="relative">
            <span aria-hidden className="label absolute -left-24 top-6 hidden w-20 bg-[#0e0e11] py-2 text-center text-[#f2c84b] md:block">
              Lv {experiences.length - i}
            </span>
            <Panel lift className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className={i === 0 ? "chip chip-strong" : "chip"}>{exp.type}</span>
                <span className="label mute">{exp.duration}</span>
              </div>
              <h3 className="mt-4 font-head text-[clamp(2.1rem,3.6vw,2.9rem)] font-bold leading-none">{exp.company}</h3>
              <p className="mt-2 text-[28px] leading-tight">
                {exp.role} <span className="mute">· {exp.location}</span>
              </p>

              <ul className="mt-6 space-y-2.5">
                {exp.highlights.map((h, hi) => (
                  <li key={hi} className="flex gap-3">
                    <span className="bullet" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mc-inset mt-6 flex flex-wrap gap-2 p-3">
                {exp.impact.map((im) => (
                  <span key={im} className="chip">
                    {im}
                  </span>
                ))}
              </div>
            </Panel>
          </motion.li>
        ))}
      </ol>
    </Layer>
  );
}
