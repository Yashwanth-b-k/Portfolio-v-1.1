import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const text =
  "I build the part of the product nobody sees and everybody depends on. Services that stay up. Data that stays right. Code that the next engineer can read.";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block mr-[0.28em]">
      {children}
    </motion.span>
  );
}

/** Apple-style: words light up one by one as the user scrolls. */
export function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  return (
    <section className="bg-black text-white" aria-label="Statement">
      <div ref={ref} className="shell py-32 sm:py-44">
        <p className="font-semibold tracking-tight" style={{ fontSize: "clamp(1.75rem, 4.2vw, 3.6rem)", lineHeight: 1.15 }}>
          {words.map((w, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {w}
              </Word>
            );
          })}
        </p>
      </div>
    </section>
  );
}
