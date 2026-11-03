import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/** Parses "12K+" / "1+" / "8.9" and animates the numeric part. */
export function CountUp({ value, duration = 1.6, className }: { value: string; duration?: number; className?: string }) {
  const m = value.match(/^([^\d]*)([\d.]+)(.*)$/);
  const prefix = m?.[1] ?? "";
  const target = parseFloat(m?.[2] ?? "0");
  const suffix = m?.[3] ?? "";
  const decimals = (m?.[2].split(".")[1] ?? "").length;

  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setN(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {n.toFixed(decimals)}
      {suffix}
    </span>
  );
}
