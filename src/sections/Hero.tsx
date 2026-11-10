import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Download } from "lucide-react";
import { profile } from "@/data/resume";
import { scrollToSection } from "@/utils";
import { FIELD, Habitat, useSmall, type MobSpec } from "@/mc/Habitat";
import { Sky } from "@/mc/Sky";
import { seeded } from "@/mc/sprites";

/** The surface crew. Each critter stands for a piece of the stack — click one. */
const MOBS: MobSpec[] = [
  {
    id: "yash", kind: "peep", look: "yash", name: "Yashwanth", at: [0.5, 0.8], greetAfter: 2500,
    say: ["Hi! I'm Yashwanth.", "I build backends that stay up.", "Scroll down — we're digging in.", "Tip: the moon button makes it night."],
  },
  { id: "capy", kind: "quad", look: "capy", name: "PostgreSQL", at: [0.2, 0.45], say: ["PostgreSQL. The source of truth.", "ACID, or nothing."] },
  { id: "fox", kind: "quad", look: "fox", name: "CQRS", at: [0.8, 0.55], speed: 54, say: ["Commands write. Queries read.", "I never mix the two."] },
  { id: "woolly", kind: "quad", look: "woolly", name: "MongoDB", at: [0.36, 0.15], say: ["MongoDB. Fluffy read models.", "Denormalized, on purpose."] },
  { id: "tester", kind: "peep", look: "tester", name: "QA", at: [0.66, 0.2], say: ["Looks good. Ship it.", "Found one. Sorry."] },
  { id: "capy2", kind: "quad", look: "capy", name: "SQL Server", at: [0.92, 0.85], say: ["SQL Server. Still on call."] },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const small = useSmall();
  const dim = small ? FIELD.sm : FIELD.lg;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const r = seeded(4);

  return (
    <section ref={ref} id="home" className="relative flex min-h-[100svh] flex-col overflow-hidden" aria-label="Introduction">
      <Sky horizon={dim.S - dim.floorY + dim.lip + 76} />

      <motion.div style={{ y: textY, opacity: textOpacity }} className="shell relative z-[4] pt-28 text-center">
        <motion.p
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="chip mx-auto"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping bg-[#3fd16a] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 bg-[#3fd16a]" />
          </span>
          {profile.role}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.6, ease: [0.3, 1.5, 0.6, 1] }}
          className="title-3d mt-4 sm:mt-6"
        >
          {profile.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 2.0, ease: [0.3, 1.7, 0.6, 1] }}
          className="mt-3 sm:mt-5"
        >
          <span className="splash inline-block" style={{ fontSize: "clamp(1.9rem, 4.8vw, 3.3rem)" }}>
            Backend. Built to last.
          </span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.15 }}
          className="lede mx-auto mt-4 max-w-2xl bg-[#0b1026]/45 px-4 py-2 sm:mt-5"
        >
          ASP.NET Core, CQRS and carefully modelled data across PostgreSQL, MongoDB and SQL Server — running in
          production for 12,000+ users.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.3 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:mt-7"
        >
          <a href={profile.resume} download className="mc-btn mc-btn-green">
            <Download size={18} strokeWidth={3} /> Download résumé
          </a>
          <button onClick={() => scrollToSection("projects", 24)} className="mc-btn">
            Start digging <ArrowDown size={18} strokeWidth={3} />
          </button>
        </motion.div>
      </motion.div>

      <div className="relative z-[2] mt-auto pt-4 sm:pt-10">
        <Habitat mobs={MOBS} />
        <div className="grass-lip" data-mat="grass" />
        <div className="under-lip" data-mat="dirt" />
      </div>

      <div className="night-tint z-[3]" />
      <div className="only-night pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[46%]" aria-hidden>
        {Array.from({ length: 9 }, (_, i) => (
          <i
            key={i}
            className="firefly"
            style={{ left: `${6 + r() * 88}%`, top: `${10 + r() * 70}%`, "--d": `${5 + r() * 5}s`, "--fx": `${20 + r() * 50}px`, animationDelay: `${-r() * 5}s` } as CSSProperties}
          />
        ))}
      </div>
    </section>
  );
}
