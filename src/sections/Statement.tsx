import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Layer } from "@/components/ui/Section";

const text =
  "I build the part of the product nobody sees and everybody depends on. Services that stay up. Data that stays right. Code that the next engineer can read.";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className="mr-[0.3em] inline-block">
      {children}
    </motion.span>
  );
}

/** Just under the grass. Words light up one by one as you dig past them. */
export function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");

  return (
    <Layer material="dirt" first ariaLabel="Statement" className="!py-28 sm:!py-40">
      <div ref={ref}>
        <p
          className="font-head font-bold text-white"
          style={{ fontSize: "clamp(2.1rem, 5vw, 4.2rem)", lineHeight: 1.1, textShadow: "4px 4px 0 rgba(0,0,0,.6)" }}
        >
          {words.map((w, i) => {
            const start = i / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, start + 1 / words.length]}>
                {w}
              </Word>
            );
          })}
        </p>
      </div>
    </Layer>
  );
}
