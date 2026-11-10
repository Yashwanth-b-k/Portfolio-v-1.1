import { motion } from "framer-motion";
import { Database, Layers, MapPin, Server, ShieldCheck } from "lucide-react";
import { Layer, Panel, SectionHeader } from "@/components/ui/Section";
import { CodeWindow } from "@/components/CodeWindow";
import { CountUp } from "@/components/fx/CountUp";
import { profile, stats } from "@/data/resume";
import { scaleIn, stagger, viewportOnce } from "@/utils/motion";
import { Ores, Torch } from "@/mc/Ambient";
import { Guide } from "@/mc/Guide";

const pillars = [
  { icon: Server, t: "ASP.NET Core", d: "C#, MediatR, REST — the service layer." },
  { icon: Layers, t: "CQRS", d: "Commands write. Queries read. Nothing leaks." },
  { icon: Database, t: "Three databases", d: "PostgreSQL · MongoDB · SQL Server." },
];

export function About() {
  const [years, users, orgs, projects] = stats;

  return (
    <Layer
      id="about"
      material="stone"
      above="dirt"
      wide
      fx={
        <>
          <Ores kinds={["coal", "iron"]} seed={3} density={0.45} />
          <Torch style={{ left: "4%", top: 260 }} />
          <Torch className="hidden md:block" style={{ right: "5%", top: 900 }} />
        </>
      }
    >
      <SectionHeader eyebrow="About" title="Reliable systems." sub="Engineered, not improvised." description={profile.summary} />

      <Guide look="yash" name="Yashwanth" className="mb-10" say={["Mind the torches.", "Yes, the headphones are always on."]}>
        <b>{users.value} people</b> clock in through services I help keep running. The numbers below are from
        that platform.
      </Guide>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid gap-5 md:grid-cols-6"
      >
        <motion.div variants={scaleIn} className="md:col-span-4 md:row-span-2">
          <Panel dark lift className="flex h-full flex-col justify-between gap-10 p-7 sm:p-9">
            <p className="label text-white/55">Scale in production</p>
            <div>
              <p className="font-pixel text-[#8fe34a]" style={{ fontSize: "clamp(2.6rem, 8vw, 6rem)", lineHeight: 1, textShadow: "5px 5px 0 #1d3a10" }}>
                <CountUp value={users.value} />
              </p>
              <p className="mt-5 text-[28px] leading-tight text-white/75">
                {users.label.toLowerCase()} across <span className="text-[#f2c84b]">{orgs.value} organizations</span> on a
                CQRS-based CRM platform.
              </p>
            </div>
          </Panel>
        </motion.div>

        {[years, projects].map((s, i) => (
          <motion.div key={s.label} variants={scaleIn} className="md:col-span-2">
            <Panel lift className="h-full p-7">
              <p className="label mute">{i === 0 ? "Experience" : "Shipped"}</p>
              <p className="mt-4 font-pixel text-[2.6rem] leading-none">
                <CountUp value={s.value} duration={1.2} />
              </p>
              <p className="mute mt-3">{i === 0 ? "years, enterprise backend" : s.label.toLowerCase()}</p>
            </Panel>
          </motion.div>
        ))}

        {pillars.map(({ icon: Icon, t, d }) => (
          <motion.div key={t} variants={scaleIn} className="md:col-span-2">
            <Panel lift className="h-full p-7">
              <span className="mc-inset inline-grid h-12 w-12 place-items-center">
                <Icon size={24} strokeWidth={2.5} style={{ color: "var(--accent)" }} />
              </span>
              <p className="mt-5 font-head text-[28px] font-bold leading-tight">{t}</p>
              <p className="mute mt-1">{d}</p>
            </Panel>
          </motion.div>
        ))}

        <motion.div variants={scaleIn} className="md:col-span-4">
          <Panel lift className="flex h-full flex-col justify-between gap-6 p-7 sm:flex-row sm:items-end">
            <div className="max-w-md">
              <span className="mc-inset inline-grid h-12 w-12 place-items-center">
                <ShieldCheck size={24} strokeWidth={2.5} style={{ color: "var(--accent)" }} />
              </span>
              <p className="mt-5 font-head text-[28px] font-bold leading-tight">Production, staging, development.</p>
              <p className="mute mt-1">
                Live-incident debugging through log analysis and root-cause work, with data integrity held across
                all three environments.
              </p>
            </div>
            <div className="flex gap-2">
              {["PROD", "STG", "DEV"].map((e, i) => (
                <motion.span
                  key={e}
                  initial={{ opacity: 0, y: -18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ delay: 0.3 + i * 0.12, ease: [0.3, 1.5, 0.6, 1] }}
                  className={i === 0 ? "chip chip-strong" : "chip"}
                >
                  {e}
                </motion.span>
              ))}
            </div>
          </Panel>
        </motion.div>

        <motion.div variants={scaleIn} className="md:col-span-2">
          <Panel lift className="h-full p-7">
            <span className="mc-inset inline-grid h-12 w-12 place-items-center">
              <MapPin size={24} strokeWidth={2.5} style={{ color: "var(--accent)" }} />
            </span>
            <p className="mt-5 font-head text-[28px] font-bold leading-tight">Bengaluru</p>
            <p className="mute mt-1">Karnataka, India · open to relocation</p>
          </Panel>
        </motion.div>

        <motion.div variants={scaleIn} className="md:col-span-6">
          <CodeWindow />
        </motion.div>
      </motion.div>
    </Layer>
  );
}
