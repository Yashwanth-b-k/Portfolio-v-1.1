import { motion } from "framer-motion";
import type { ElementType } from "react";
import { cn } from "@/utils";

interface SplitTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  inView?: boolean;
}

/** Word-by-word blur + rise reveal. */
export function SplitText({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  stagger = 0.06,
  inView = false,
}: SplitTextProps) {
  const words = text.split(" ");
  const MotionTag = motion(Tag as "span");
  return (
    <MotionTag
      className={cn("inline-block", className)}
      initial="hidden"
      {...(inView ? { whileInView: "visible", viewport: { once: true, amount: 0.5 } } : { animate: "visible" })}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", opacity: 0, filter: "blur(12px)", rotateX: -40 },
              visible: {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                rotateX: 0,
                transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </MotionTag>
  );
}
