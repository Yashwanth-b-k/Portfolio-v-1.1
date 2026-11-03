import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, stagger, viewportOnce } from "@/utils/motion";
import { cn } from "@/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

/**
 * Apple pattern: a bold statement followed by a grey continuation
 * on the same headline line, then an optional lede paragraph.
 */
export function SectionHeader({
  eyebrow,
  title,
  sub,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={cn(
        "mb-14 max-w-3xl sm:mb-20",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <motion.p variants={fadeUp} className="eyebrow mb-4">
          {eyebrow}
        </motion.p>
      )}
      <motion.h2 variants={fadeUp} className="headline">
        {title}
        {sub && (
          <>
            {" "}
            <span className="headline-sub">{sub}</span>
          </>
        )}
      </motion.h2>
      {description && (
        <motion.p variants={fadeUp} className="lede mt-6">
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  tone?: "white" | "grey" | "black";
  wide?: boolean;
  ariaLabel?: string;
}

export function Section({
  id,
  children,
  className,
  tone = "white",
  wide,
  ariaLabel,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "scroll-mt-12 py-24 sm:py-32",
        tone === "grey" && "panel",
        tone === "black" && "panel-black",
        className
      )}
    >
      <div className={wide ? "shell-wide" : "shell"}>{children}</div>
    </section>
  );
}
