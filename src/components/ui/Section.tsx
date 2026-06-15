import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, stagger, viewportOnce } from "@/utils/motion";
import { cn } from "@/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeaderProps) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={cn(
        "mb-12 max-w-2xl sm:mb-16",
        align === "center" && "mx-auto text-center"
      )}
    >
      <motion.p variants={fadeUp} className="eyebrow">
        {eyebrow}
      </motion.p>
      <motion.h2
        variants={fadeUp}
        className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.1]"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          className="mt-4 text-base leading-relaxed text-light-text/70 dark:text-dark-text/70 sm:text-lg"
        >
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
  muted?: boolean;
  ariaLabel?: string;
}

export function Section({ id, children, className, muted, ariaLabel }: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn(
        "scroll-mt-20 py-20 sm:py-28",
        muted && "bg-light-secondary dark:bg-dark-secondary",
        className
      )}
    >
      <div className="section-shell">{children}</div>
    </section>
  );
}
