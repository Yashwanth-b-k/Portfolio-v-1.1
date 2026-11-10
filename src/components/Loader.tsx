import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/data/resume";
import { GrassCube } from "@/mc/models";

const STEPS = ["Placing blocks", "Growing trees", "Waking the mobs", "Lighting torches"];

export function Loader() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / 1100, 1);
      setN(Math.round(100 * (1 - Math.pow(1 - p, 2))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="layer layer-dirt fixed inset-0 z-[100] flex flex-col items-center justify-center text-white"
    >
      <div className="layer-shade" />
      <div className="layer-body flex flex-col items-center px-6 text-center">
        <GrassCube size={56} />
        <p className="label mt-8 text-[12px]">Building world</p>
        <p className="mt-3 h-6 text-white/70">{STEPS[Math.min(3, Math.floor(n / 25.1))]}…</p>
        <div className="xp mt-4 w-64 max-w-full">
          <i style={{ transform: `scaleX(${n / 100})`, transition: "none" }} />
        </div>
        <p className="label mt-3 tabular-nums text-white/50">{n}%</p>
        <p className="sr-only">Loading {profile.name}'s portfolio</p>
      </div>
    </motion.div>
  );
}
