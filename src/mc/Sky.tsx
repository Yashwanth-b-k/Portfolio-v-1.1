import type { CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cloud, hills, icons, stars } from "./sprites";
import { css } from "./textures";
import { Flyers } from "./Ambient";

const CLOUDS = [
  { top: "9%", s: 7, dur: 150, delay: -20 },
  { top: "22%", s: 5, dur: 110, delay: -70 },
  { top: "5%", s: 4, dur: 190, delay: -120 },
  { top: "34%", s: 6, dur: 130, delay: -95 },
  { top: "16%", s: 3, dur: 220, delay: -40 },
];

/**
 * The surface: a day sky and a night sky that cross-fade, a sun and moon on
 * one wheel (toggling the theme turns the wheel), drifting clouds, and two
 * parallax strips of generated hills.
 */
export function Sky({ horizon }: { horizon: number }) {
  const { scrollY } = useScroll();
  const far = useTransform(scrollY, [0, 900], [0, 110]);
  const mid = useTransform(scrollY, [0, 900], [0, 50]);
  const farX = useTransform(scrollY, [0, 900], [0, -40]);
  const midX = useTransform(scrollY, [0, 900], [0, -90]);

  const farTex = hills("far", { w: 320, h: 64, block: 4, base: 6, amp: [4, 2, 1], freq: [1, 3, 7], trees: 9, seed: 5 });
  const midTex = hills("mid", { w: 320, h: 56, block: 4, base: 4, amp: [3, 1.5, 0.8], freq: [2, 5, 9], trees: 14, seed: 17 });

  return (
    <div className="sky" aria-hidden data-mat="sky">
      <div className="sky-day" />
      <div className="sky-night" />
      <div className="sky-stars" style={{ backgroundImage: css(stars()) }} />
      <div className="sky-stars twinkle" style={{ backgroundImage: css(stars()), backgroundPosition: "140px 90px" }} />

      <div className="celestial" style={{ bottom: horizon }}>
        <div className="celestial-wheel">
          <i className="sun" style={{ backgroundImage: css(icons.sun) }} />
          <i className="moon" style={{ backgroundImage: css(icons.moon) }} />
        </div>
      </div>

      {CLOUDS.map((c, i) => (
        <i
          key={i}
          className="cloud"
          style={{
            top: c.top, width: 44 * c.s, height: 14 * c.s,
            backgroundImage: css(cloud(i)),
            animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s`,
          } as CSSProperties}
        />
      ))}

      <Flyers kind="bird" count={4} className="only-day" />
      <Flyers kind="bat" count={3} className="only-night" />

      <motion.div className="hills hills-far" style={{ y: far, x: farX, bottom: horizon - 6, backgroundImage: css(farTex) }} />
      <motion.div className="hills hills-mid" style={{ y: mid, x: midX, bottom: horizon - 10, backgroundImage: css(midTex) }} />
    </div>
  );
}
