import { motion } from "framer-motion";
import { Cloud, Database, Layers, Layout, Server, Wrench } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { skillCategories } from "@/data/resume";
import { fadeUp, stagger, viewportOnce } from "@/utils/motion";
import type { SkillCategory } from "@/types";

const icons: Record<SkillCategory["icon"], typeof Server> = {
  server: Server,
  database: Database,
  layers: Layers,
  cloud: Cloud,
  wrench: Wrench,
  layout: Layout,
};

const all = skillCategories.flatMap((c) => c.skills.map((s) => s.name));

export function Skills() {
  return (
    <Section id="skills" tone="black" wide className="overflow-hidden">
      <div className="shell !px-0">
        <SectionHeader
          eyebrow="Skills"
          title="A deliberate stack."
          sub="Depth where it matters."
          description={
            <span className="text-white/60">
              Core strength in the service and data layers. Comfortable across the
              rest of the stack when a project needs it.
            </span>
          }
        />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid gap-px overflow-hidden rounded-4xl bg-white/10 sm:grid-cols-2 lg:grid-cols-3"
      >
        {skillCategories.map((cat) => {
          const Icon = icons[cat.icon];
          return (
            <motion.div key={cat.category} variants={fadeUp} className="bg-black p-8 sm:p-10">
              <Icon size={26} strokeWidth={1.5} className="text-white/60" />
              <h3 className="mt-6 text-[21px] font-semibold tracking-tight">{cat.category}</h3>
              <ul className="mt-5 space-y-2.5">
                {cat.skills.map((s) => (
                  <li
                    key={s.name}
                    className={
                      s.strong
                        ? "text-[17px] font-medium text-white"
                        : "text-[17px] text-white/45"
                    }
                  >
                    {s.name}
                    {s.strong && (
                      <span className="ml-2 align-middle text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2997ff]">
                        core
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Marquee */}
      <div
        className="relative mt-20 -mx-6"
        style={{
          maskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
        }}
        aria-hidden
      >
        <div className="marquee gap-4">
          {[...all, ...all].map((s, i) => (
            <span
              key={i}
              className="whitespace-nowrap rounded-full border border-white/10 px-5 py-2.5 text-[15px] text-white/70"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}
