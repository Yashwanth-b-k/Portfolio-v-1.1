import { motion } from "framer-motion";
import { Layer, Panel, SectionHeader } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { CountUp } from "@/components/fx/CountUp";
import { education } from "@/data/resume";
import { fadeUp, scaleIn, stagger, viewportOnce } from "@/utils/motion";
import { Torch } from "@/mc/Ambient";
import { Guide } from "@/mc/Guide";

/** A library buried in the deep stone. */
export function Education() {
  return (
    <Layer
      id="education"
      material="deep"
      fx={
        <>
          <div className="shelf absolute inset-x-0 top-0" />
          <div className="shelf absolute inset-x-0 bottom-0" />
          <Torch style={{ left: "6%", top: 190 }} />
          <Torch style={{ right: "6%", top: 190 }} />
        </>
      }
      className="!py-40 sm:!py-48"
    >
      <SectionHeader eyebrow="Education" title="Foundations." sub="Built on fundamentals." />

      {education.map((e) => (
        <motion.div
          key={e.institution}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-6 md:grid-cols-[1fr_auto] md:items-stretch"
        >
          <motion.div variants={fadeUp}>
            <Panel className="h-full p-6 sm:p-8">
              <p className="label mute">{e.duration}</p>
              <h3 className="mt-3 font-head text-[clamp(2.1rem,3.6vw,3rem)] font-bold leading-none">{e.institution}</h3>
              <p className="mt-3 text-[28px] leading-tight">{e.degree}</p>
              <p className="mute">{e.location}</p>
              {e.courses && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {e.courses.map((c) => (
                    <Badge key={c}>{c}</Badge>
                  ))}
                </div>
              )}
            </Panel>
          </motion.div>

          {e.gpa && (
            <motion.div variants={scaleIn}>
              <Panel dark className="flex h-full min-w-[230px] flex-col justify-between gap-6 p-7">
                <p className="label flex items-center justify-between text-white/55">
                  CGPA <span className="orb" aria-hidden />
                </p>
                <p className="font-pixel text-[3.2rem] leading-none text-[#8fe34a]" style={{ textShadow: "4px 4px 0 #1d3a10" }}>
                  <CountUp value={e.gpa.split(" ")[0]} duration={1.4} />
                </p>
                <p className="text-white/55">out of 10</p>
              </Panel>
            </motion.div>
          )}
        </motion.div>
      ))}

      <Guide look="scholar" name="Librarian" flip className="mt-10 justify-start" say={["Shh.", "Operating Systems is on the third shelf."]}>
        Four years of fundamentals: data structures, algorithms, operating systems, databases. <b>I still read the docs.</b>
      </Guide>
    </Layer>
  );
}
