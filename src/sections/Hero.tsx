import { useRef, type CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { profile } from "@/data/resume";
import { scrollToSection } from "@/utils";
import { CodeWindow } from "@/components/CodeWindow";
import { Aurora } from "@/components/fx/Aurora";
import { Magnetic } from "@/components/fx/Magnetic";
import { Tilt } from "@/components/fx/Tilt";
import { SplitText } from "@/components/fx/SplitText";

const chips = [
  { t: "PostgreSQL", pos: "left-[-9%] top-[22%]", d: "7s", r: "-6deg", delay: 1.6 },
  { t: "CQRS", pos: "right-[-6%] top-[6%]", d: "6s", r: "5deg", delay: 1.8 },
  { t: "MongoDB", pos: "right-[-10%] top-[60%]", d: "8s", r: "-4deg", delay: 2.0 },
  { t: "ASP.NET Core", pos: "left-[-12%] top-[72%]", d: "6.5s", r: "4deg", delay: 2.2 },
  { t: "12K+ users", pos: "left-[42%] top-[-7%]", d: "7.5s", r: "2deg", delay: 2.4 },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const winY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const winRotate = useTransform(scrollYProgress, [0, 1], [0, 12]);
  const winScale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  return (
    <section
      ref={ref}
      id="home"
      className="relative overflow-hidden bg-black pt-32 text-white sm:pt-40"
      aria-label="Introduction"
    >
      <Aurora />

      <motion.div style={{ y: textY, opacity: textOpacity }} className="shell relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto inline-flex ring-1 ring-white/15 items-center gap-2 rounded-full bg-white/[0.06] px-4 py-1.5 text-[13px] text-white/75 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#30d158] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#30d158]" />
          </span>
          {profile.role}
        </motion.div>

        <h1 className="display mt-7">
          <SplitText text={profile.name} delay={0.35} stagger={0.12} />
        </h1>

        <p className="display mt-2" style={{ fontSize: "clamp(2rem, 5.4vw, 4.75rem)" }}>
          <SplitText text="Backend. Built to last." className="text-gradient-animated" delay={0.75} stagger={0.1} />
        </p>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="lede mx-auto mt-8 max-w-2xl !text-white/65"
        >
          ASP.NET Core, CQRS and carefully modelled data across PostgreSQL, MongoDB and
          SQL Server — running in production for 12,000+ users.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic>
            <a href={profile.resume} download className="btn sheen bg-white text-black hover:bg-white">
              <Download size={16} /> Download résumé
            </a>
          </Magnetic>
          <Magnetic>
            <button
              onClick={() => scrollToSection("projects", 60)}
              className="btn group border border-white/20 bg-white/[0.04] text-white backdrop-blur-md hover:border-white/50 hover:bg-white/10"
            >
              See the work
              <ArrowRight size={16} className="transition-transform duration-300 ease-apple group-hover:translate-x-1" />
            </button>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Product shot: tilting code window with orbiting glass chips */}
      <motion.div
        style={{ y: winY, rotateX: winRotate, scale: winScale, perspective: 1200 }}
        initial={{ opacity: 0, y: 90, rotateX: 18 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: 1.0, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="shell-wide relative mt-20 pb-28 sm:mt-24 sm:pb-36"
      >
        <div className="relative mx-auto max-w-4xl">
          {chips.map((c) => (
            <motion.span
              key={c.t}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: c.delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ "--d": c.d, "--r": c.r } as CSSProperties}
              className={`float absolute z-10 hidden rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 text-[13px] font-medium text-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] backdrop-blur-xl md:block ${c.pos}`}
            >
              {c.t}
            </motion.span>
          ))}
          <Tilt max={6}>
            <CodeWindow />
          </Tilt>
        </div>
      </motion.div>

      <div aria-hidden className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
          <span className="scrollcue block h-2 w-1 rounded-full bg-white/70" />
        </div>
      </div>
    </section>
  );
}
