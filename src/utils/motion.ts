import type { Variants } from "framer-motion";

export const ease = [0.16, 1, 0.3, 1] as const;
/** Overshooting ease — things land like a placed block. */
export const pop = [0.3, 1.5, 0.6, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease } },
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/** A block dropping into place. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, y: -28, scale: 0.94 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: pop } },
};

export const viewportOnce = { once: true, amount: 0.2 } as const;
