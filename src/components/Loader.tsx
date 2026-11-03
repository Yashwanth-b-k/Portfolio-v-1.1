import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { profile } from "@/data/resume";

export function Loader() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / 900, 1);
      setN(Math.round(100 * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      exit={{ y: "-100%" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white"
    >
      <motion.p
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8 }}
        className="display text-gradient-animated"
      >
        Y.
      </motion.p>
      <p className="mt-6 font-mono text-[12px] tabular-nums text-white/40">{n.toString().padStart(3, "0")}</p>
      <p className="sr-only">Loading {profile.name}'s portfolio</p>
    </motion.div>
  );
}
