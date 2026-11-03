import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/utils";

/** Card whose border + surface light up where the pointer is. */
export function Spotlight({ children, className, dark = false }: { children: ReactNode; className?: string; dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const border = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, ${dark ? "rgba(255,255,255,0.55)" : "rgba(0,113,227,0.55)"}, transparent 60%)`;
  const surface = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,113,227,0.07)"}, transparent 60%)`;

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        x.set(-500);
        y.set(-500);
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn("group relative rounded-4xl p-px", className)}
    >
      <motion.div aria-hidden style={{ background: border }} className="absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className={cn("relative h-full overflow-hidden rounded-[inherit]", dark ? "bg-[#0c0c0d]" : "bg-light-secondary dark:bg-dark-secondary")}>
        <motion.div aria-hidden style={{ background: surface }} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative h-full">{children}</div>
      </div>
    </motion.div>
  );
}
