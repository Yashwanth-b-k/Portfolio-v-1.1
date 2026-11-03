import { motion } from "framer-motion";
import { Database, Layers, MapPin, Server, ShieldCheck } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { profile, stats } from "@/data/resume";
import { scaleIn, stagger, viewportOnce } from "@/utils/motion";
import { Spotlight } from "@/components/fx/Spotlight";
import { CountUp } from "@/components/fx/CountUp";

export function About() {
  const [years, users, orgs, projects] = stats;

  return (
    <Section id="about" tone="white" wide>
      <div className="shell !px-0">
        <SectionHeader
          eyebrow="About"
          title="Reliable systems."
          sub="Engineered, not improvised."
          description={profile.summary}
        />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid gap-4 md:grid-cols-6 md:auto-rows-[220px]"
      >
        <motion.div variants={scaleIn} className="md:col-span-4 md:row-span-2">
          <Spotlight dark className="h-full">
            <div className="relative h-full p-8 text-white md:p-10">
              <div
                aria-hidden
                className="absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-80 blur-3xl"
                style={{ background: "radial-gradient(circle, #5e5ce6, #0a84ff 40%, transparent 70%)" }}
              />
              <div className="relative flex h-full flex-col justify-between gap-10">
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/50">Scale in production</p>
                <div>
                  <p className="text-gradient font-semibold tracking-tightest" style={{ fontSize: "clamp(4rem, 10vw, 8rem)", lineHeight: 0.95 }}>
                    <CountUp value={users.value} />
                  </p>
                  <p className="mt-3 text-[19px] text-white/70">
                    {users.label.toLowerCase()} across <span className="text-white">{orgs.value} organizations</span> on a CQRS-based CRM platform.
                  </p>
                </div>
              </div>
            </div>
          </Spotlight>
        </motion.div>

        {[years, projects].map((s, i) => (
          <motion.div key={s.label} variants={scaleIn} className="md:col-span-2">
            <Spotlight className="h-full">
              <div className="p-8">
                <p className="eyebrow">{i === 0 ? "Experience" : "Shipped"}</p>
                <p className="mt-4 text-6xl font-semibold tracking-tightest">
                  <CountUp value={s.value} duration={1.2} />
                </p>
                <p className="mt-1 text-light-muted dark:text-dark-muted">
                  {i === 0 ? "years, enterprise backend" : s.label.toLowerCase()}
                </p>
              </div>
            </Spotlight>
          </motion.div>
        ))}

        {[
          { icon: Server, t: "ASP.NET Core", d: "C#, MediatR, REST — the service layer." },
          { icon: Layers, t: "CQRS", d: "Commands write. Queries read. Nothing leaks." },
          { icon: Database, t: "Three databases", d: "PostgreSQL · MongoDB · SQL Server." },
        ].map(({ icon: Icon, t, d }) => (
          <motion.div key={t} variants={scaleIn} className="md:col-span-2">
            <Spotlight className="h-full">
              <div className="p-8">
                <Icon size={28} strokeWidth={1.6} className="text-light-accent dark:text-dark-accent" />
                <p className="mt-6 text-[21px] font-semibold tracking-tight">{t}</p>
                <p className="mt-1 text-[15px] text-light-muted dark:text-dark-muted">{d}</p>
              </div>
            </Spotlight>
          </motion.div>
        ))}

        <motion.div variants={scaleIn} className="md:col-span-4">
          <Spotlight className="h-full">
            <div className="flex h-full flex-col justify-between gap-6 p-8 sm:flex-row sm:items-end">
              <div className="max-w-md">
                <ShieldCheck size={28} strokeWidth={1.6} className="text-light-accent dark:text-dark-accent" />
                <p className="mt-6 text-[21px] font-semibold tracking-tight">Production, staging, development.</p>
                <p className="mt-1 text-[15px] text-light-muted dark:text-dark-muted">
                  Live-incident debugging through log analysis and root-cause work, with data integrity held across all three environments.
                </p>
              </div>
              <div className="flex gap-2">
                {["PROD", "STG", "DEV"].map((e, i) => (
                  <motion.span
                    key={e}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1 - i * 0.3, y: 0 }}
                    viewport={viewportOnce}
                    transition={{ delay: 0.3 + i * 0.12 }}
                    className="rounded-xl bg-light-text px-3 py-2 font-mono text-[11px] font-semibold text-white dark:bg-white dark:text-black"
                  >
                    {e}
                  </motion.span>
                ))}
              </div>
            </div>
          </Spotlight>
        </motion.div>

        <motion.div variants={scaleIn} className="md:col-span-2">
          <Spotlight className="h-full">
            <div className="p-8">
              <MapPin size={28} strokeWidth={1.6} className="text-light-accent dark:text-dark-accent" />
              <p className="mt-6 text-[21px] font-semibold tracking-tight">Bengaluru</p>
              <p className="mt-1 text-[15px] text-light-muted dark:text-dark-muted">Karnataka, India · open to relocation</p>
            </div>
          </Spotlight>
        </motion.div>
      </motion.div>
    </Section>
  );
}
