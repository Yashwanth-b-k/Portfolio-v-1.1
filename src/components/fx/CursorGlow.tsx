import { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** Soft radial light that trails the pointer. Desktop only. */
export function CursorGlow() {
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 120, damping: 25, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 25, mass: 0.6 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      style={{ left: sx, top: sy }}
      className="pointer-events-none fixed z-[1] hidden h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 mix-blend-screen md:block"
    >
      <div
        className="h-full w-full rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(10,132,255,0.35) 0%, rgba(94,92,230,0.15) 40%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}
