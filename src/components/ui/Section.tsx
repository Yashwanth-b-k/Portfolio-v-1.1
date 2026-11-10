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

/** A wooden sign, a big pixel headline with a gold continuation, and an optional lede. */
export function SectionHeader({ eyebrow, title, sub, description, align = "left", className }: SectionHeaderProps) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={cn("mb-12 max-w-3xl sm:mb-16", align === "center" && "mx-auto text-center", className)}
    >
      {eyebrow && (
        <motion.p variants={fadeUp} className="mb-8">
          <span className="sign">{eyebrow}</span>
        </motion.p>
      )}
      <motion.h2 variants={fadeUp} className="h-title">
        {title}
        {sub && (
          <>
            {" "}
            <span className="h-sub">{sub}</span>
          </>
        )}
      </motion.h2>
      {description && (
        <motion.p variants={fadeUp} className="lede mt-5">
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}

type Material = "dirt" | "stone" | "deep" | "bedrock";

interface LayerProps {
  id?: string;
  /** What this slice of the world is made of. */
  material: Material;
  /** The material of the layer above; its blocks hang raggedly into this one. */
  above?: Exclude<Material, "bedrock">;
  /** First layer under the grass — daylight fades in from the top. */
  first?: boolean;
  /** Decoration behind the content: ores, torches, flyers. */
  fx?: ReactNode;
  /** Things that sit above the content (e.g. bugs). */
  over?: ReactNode;
  children: ReactNode;
  className?: string;
  wide?: boolean;
  ariaLabel?: string;
}

/** One stratum of the page: a tiled block wall, shaded, with content on top. */
export function Layer({ id, material, above, first, fx, over, children, className, wide, ariaLabel }: LayerProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      data-mat={material === "bedrock" ? "deep" : material}
      className={cn("layer scroll-mt-6 py-24 sm:py-32", `layer-${material}`, first && "layer-first", className)}
    >
      {above && <div className="layer-edge" style={{ backgroundImage: `var(--e-${above})` }} />}
      <div className="layer-shade" />
      {fx && <div className="layer-fx">{fx}</div>}
      <div className={cn("layer-body", wide ? "shell-wide" : "shell")}>{children}</div>
      {over}
    </section>
  );
}

/** A bevelled GUI panel. */
export function Panel({
  children,
  className,
  dark,
  lift,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
  lift?: boolean;
}) {
  return (
    <div data-mat="wood" className={cn("mc-panel", dark && "mc-panel-dark", lift && "lift", className)}>
      {children}
    </div>
  );
}
