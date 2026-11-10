import { motion } from "framer-motion";
import { Layer, Panel, SectionHeader } from "@/components/ui/Section";
import { skillCategories } from "@/data/resume";
import { scaleIn, stagger, viewportOnce } from "@/utils/motion";
import { CartTrain, Flyers, Ores, Torch } from "@/mc/Ambient";
import { gem, ingot } from "@/mc/sprites";

/** Each category is mined from its own ore. */
const ORE: Record<string, { name: string; color: string }> = {
  Backend: { name: "diamond", color: "#5fe0d8" },
  Databases: { name: "emerald", color: "#3fd16a" },
  Architecture: { name: "amethyst", color: "#b57bf0" },
  Cloud: { name: "lapis", color: "#4a7df0" },
  Tools: { name: "gold", color: "#f2c84b" },
  Frontend: { name: "ruby", color: "#ef5a4c" },
};

const all = skillCategories.flatMap((c) => c.skills.map((s) => s.name));

export function Skills() {
  return (
    <Layer
      id="skills"
      material="deep"
      above="stone"
      wide
      className="overflow-hidden"
      fx={
        <>
          <Ores kinds={Object.values(ORE).map((o) => o.name)} seed={5} density={0.6} />
          <Flyers kind="bat" count={3} />
          <Torch style={{ left: "5%", top: 220 }} />
          <Torch style={{ right: "5%", top: 640 }} />
        </>
      }
    >
      <SectionHeader
        eyebrow="Skills"
        title="A deliberate stack."
        sub="Depth where it matters."
        description="Core strength in the service and data layers — the gems. Comfortable across the rest of the stack when a project needs it."
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {skillCategories.map((cat) => {
          const ore = ORE[cat.category] ?? ORE.Tools;
          return (
            <motion.div key={cat.category} variants={scaleIn}>
              <Panel lift className="h-full p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-head text-[32px] font-bold leading-none">{cat.category}</h3>
                  <span className="label mute">{cat.skills.length} items</span>
                </div>
                <ul className="mt-5 space-y-2">
                  {cat.skills.map((s) => (
                    <li key={s.name} className="group flex items-center gap-3">
                      <span className="mc-inset grid h-12 w-12 shrink-0 place-items-center">
                        <img
                          src={s.strong ? gem(ore.color) : ingot("#aeb4bd")}
                          alt=""
                          width={36}
                          height={36}
                          className="transition-transform duration-200 group-hover:-translate-y-1 group-hover:rotate-[-8deg] group-hover:scale-110"
                        />
                      </span>
                      <span className={s.strong ? "font-head text-[25px]" : "mute text-[22px]"}>{s.name}</span>
                      {s.strong && <span className="chip chip-strong ml-auto !py-0.5 !text-[16px]">Core</span>}
                    </li>
                  ))}
                </ul>
              </Panel>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="-mx-5 mt-16 sm:-mx-6">
        <CartTrain labels={all} />
      </div>
    </Layer>
  );
}
