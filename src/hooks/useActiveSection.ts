import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view using scroll position.
 * Queries the DOM live on each scroll, so it works even if sections
 * mount after initial render.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    let frame = 0;

    const compute = () => {
      // Reference line ~35% down the viewport feels natural for "current section".
      const line = window.scrollY + window.innerHeight * 0.35;
      let current = ids[0] ?? "";

      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= line) current = id;
      }

      // If scrolled to the very bottom, force the last section active.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) current = ids[ids.length - 1] ?? current;

      setActive(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    compute();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  return active;
}
