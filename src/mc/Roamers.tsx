import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { Box } from "./Box";
import { burst } from "./Ambient";
import { play } from "./audio";
import { flameSheet } from "./sprites";
import { css, paint, shade } from "./textures";

/* ------------------------------------------------------------------ */
/* Two original trouble-makers that turn up somewhere random on the    */
/* page:                                                               */
/*   Glitch — click it and you are warped to a random scroll position. */
/*   Keg    — click it, the fuse burns down, and everything nearby is  */
/*            blown apart… then put back, block by block.              */
/* ------------------------------------------------------------------ */

function GlitchModel() {
  const skin = (seed: number) =>
    css(
      paint(`glitch:${seed}`, 8, 8, (set, r) => {
        const C = ["#0b1020", "#0b1020", "#131a3a", "#19e3ff", "#ff3fd0", "#ffffff"];
        for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) set(x, y, C[Math.floor(r() * r() * 6)]);
      }, seed)
    );
  const front = css(
    paint("glitch:front", 8, 8, (set, r) => {
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) set(x, y, r() > 0.85 ? "#19e3ff" : r() > 0.9 ? "#ff3fd0" : "#0b1020");
      for (let x = 1; x < 7; x++) { set(x, 3, "#ffffff"); set(x, 4, "#bff6ff"); }
    }, 3)
  );
  return (
    <>
      <Box w={34} h={34} d={34} y={22} faces={{ all: skin(1), front, top: skin(2) }} className="glitch-core" />
      <div className="glitch-orbit">
        <Box w={9} h={9} d={9} x={36} y={40} faces={{ all: "#19e3ff" }} />
        <Box w={7} h={7} d={7} x={-34} y={24} faces={{ all: "#ff3fd0" }} />
        <Box w={6} h={6} d={6} z={36} y={54} faces={{ all: "#ffffff" }} />
      </div>
    </>
  );
}

function KegModel() {
  const stave = (key: string, eyes: boolean) =>
    css(
      paint(`keg:${key}`, 12, 10, (set, r) => {
        for (let x = 0; x < 12; x++) {
          const c = shade("#a8743a", 0.82 + (x % 3) * 0.09 + r() * 0.05);
          for (let y = 0; y < 10; y++) set(x, y, y === 2 || y === 7 ? "#4f555e" : x % 3 === 2 ? "#6f4a22" : c);
        }
        if (eyes) {
          [2, 7].forEach((x) => { set(x, 4, "#fff"); set(x + 1, 4, "#fff"); set(x, 5, "#fff"); set(x + 1, 5, "#1b1410"); });
          for (let x = 4; x < 8; x++) set(x, 8, "#3b2a17");
        }
      })
    );
  const side = stave("side", false);
  const leg = (x: number, z: number, cls: string) => (
    <Box key={`${x}${z}`} w={8} h={12} d={8} x={x} z={z} faces={{ all: "#5a3c1c" }} origin="50% 0%" className={cls} />
  );
  return (
    <>
      {leg(-10, 10, "leg-a")}
      {leg(10, 10, "leg-b")}
      {leg(-10, -10, "leg-b")}
      {leg(10, -10, "leg-a")}
      <Box w={36} h={30} d={36} y={10} faces={{ all: side, front: stave("front", true), top: "#7a5226" }}>
        <Box w={3} h={11} d={3} y={30} faces={{ all: "#e6d7ae" }} />
        <i className="keg-spark" style={{ backgroundImage: css(flameSheet()) }} />
      </Box>
    </>
  );
}

interface Pos { x: number; y: number }

const BLAST =
  ".mc-panel,.sign,.h-title,.lede,.speech,.ore,.torch,.cart,.habitat-guide,.campfire,.chip,.mc-btn";

export function Roamers() {
  const host = useRef<HTMLDivElement>(null);
  const kegEl = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const [glitch, setGlitch] = useState<Pos | null>(null);
  const [keg, setKeg] = useState<Pos | null>(null);
  const [lit, setLit] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  /** A random spot somewhere below the hero. */
  const spot = (): Pos => {
    const main = host.current?.parentElement;
    const H = main?.offsetHeight ?? 4000, top = window.innerHeight * 0.95;
    const edge = window.innerWidth < 640 ? 24 : 9; // keep the name tag on screen on phones
    return { x: edge + Math.random() * (100 - edge * 2), y: top + Math.random() * Math.max(200, H - top - 460) };
  };

  useEffect(() => {
    const t = window.setTimeout(() => { setGlitch(spot()); setKeg(spot()); }, 1900);
    return () => window.clearTimeout(t);
  }, []);

  /* ---------------- Glitch: teleport ---------------- */
  const warp = () => {
    play("warp");
    const veil = document.createElement("div");
    veil.className = "warp-veil";
    document.body.appendChild(veil);
    window.setTimeout(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: Math.random() * max, behavior: "instant" as ScrollBehavior });
      setGlitch(spot());
    }, 280);
    window.setTimeout(() => veil.remove(), 800);
  };

  /* ---------------- Keg: explode, then rebuild ---------------- */
  const ignite = () => {
    const main = host.current?.parentElement, me = kegEl.current;
    if (busy.current || !main || !me) return;
    busy.current = true;
    setLit(true);
    setToast("Uh-oh. Somebody deployed on a Friday.");
    play("fuse");

    window.setTimeout(() => {
      const kr = me.getBoundingClientRect();
      const cx = kr.left + kr.width / 2, cy = kr.top + kr.height / 2;
      const R = Math.min(560, window.innerWidth * 0.75);
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Everything within the blast radius — outermost elements only, so
      // a panel flies as one piece and takes its contents with it.
      const hit = Array.from(main.querySelectorAll<HTMLElement>(BLAST))
        .map((el) => {
          const r = el.getBoundingClientRect();
          const nx = Math.max(r.left, Math.min(cx, r.right)), ny = Math.max(r.top, Math.min(cy, r.bottom));
          return { el, r, d: Math.hypot(nx - cx, ny - cy) };
        })
        .filter((h) => h.r.width > 0 && h.d < R && h.r.bottom > -200 && h.r.top < window.innerHeight + 200);
      const pieces = hit
        .filter((h) => !hit.some((o) => o.el !== h.el && o.el.contains(h.el)))
        .sort((a, b) => a.d - b.d)
        .slice(0, 48)
        .map((h) => {
          let dx = h.r.left + h.r.width / 2 - cx, dy = h.r.top + h.r.height / 2 - cy;
          const len = Math.hypot(dx, dy) || 1;
          dx /= len; dy /= len;
          const force = (300 + Math.random() * 260) * (1 - (h.d / R) * 0.55);
          const big = h.r.width > 500 ? 0.35 : 1;
          const x = dx * force, y = dy * force * 0.8 + 120, rot = (Math.random() - 0.5) * 110 * big;
          const end = `translate(${x.toFixed(0)}px,${y.toFixed(0)}px) rotate(${rot.toFixed(0)}deg)`;
          const out = h.el.animate(
            [
              { transform: "translate(0,0) rotate(0deg)" },
              { transform: `translate(${(x * 0.75).toFixed(0)}px,${(y * 0.6 - 90).toFixed(0)}px) rotate(${(rot * 0.7).toFixed(0)}deg)`, offset: 0.45 },
              { transform: end },
            ],
            { duration: 900 + Math.random() * 300, easing: "cubic-bezier(.2,.7,.4,1)", fill: "forwards" }
          );
          return { el: h.el, end, out };
        });

      play("boom");
      setLit(false);
      setKeg(null);
      setToast("Production is down!");
      burst(cx, cy, ["#f08a24", "#ffd75e", "#55585f", "#2a2a2e", "#8b8e93"], 46, 2.6);
      const flash = document.createElement("div");
      flash.className = "blast-flash";
      flash.style.left = `${cx}px`;
      flash.style.top = `${cy}px`;
      document.body.appendChild(flash);
      window.setTimeout(() => flash.remove(), 700);
      if (!calm)
        main.animate(
          Array.from({ length: 9 }, (_, i) => ({ transform: i === 8 ? "none" : `translate(${(Math.random() - 0.5) * 26}px,${(Math.random() - 0.5) * 26}px)` })),
          { duration: 520 }
        );

      // Rebuild: nearest pieces first, each dropping back with a block "thunk".
      window.setTimeout(() => {
        setToast("Yashwanth is rebuilding…");
        pieces.forEach((p, i) => {
          window.setTimeout(() => {
            play("place");
            const back = p.el.animate([{ transform: p.end }, { transform: "translate(0,0) rotate(0deg)" }], {
              duration: 460,
              easing: "cubic-bezier(.3,1.5,.6,1)",
              fill: "forwards",
            });
            back.onfinish = () => { p.out.cancel(); back.cancel(); };
          }, i * 85);
        });
        window.setTimeout(() => {
          play("done");
          setToast("Rolled back. All green.");
          busy.current = false;
          window.setTimeout(() => setToast(null), 2600);
          window.setTimeout(() => setKeg(spot()), 3500);
        }, pieces.length * 85 + 560);
      }, 1900);
    }, 1250);
  };

  const key = (fn: () => void) => (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); }
  };

  return (
    <>
      <div ref={host} className="roamers">
        {glitch && (
          <div
            className="roamer glitch"
            style={{ left: `${glitch.x}%`, top: glitch.y }}
            role="button"
            tabIndex={0}
            aria-label="Glitch — click to be teleported somewhere random on the page"
            onClick={warp}
            onKeyDown={key(warp)}
          >
            <span className="roamer-tag">Glitch · click to warp</span>
            <i className="roamer-glow" />
            <div className="roamer-anchor">
              <div className="roamer-turn"><GlitchModel /></div>
            </div>
          </div>
        )}
        {keg && (
          <div
            ref={kegEl}
            className={`roamer keg ${lit ? "lit" : ""}`}
            style={{ left: `${keg.x}%`, top: keg.y }}
            role="button"
            tabIndex={0}
            aria-label="Keg — click to light the fuse"
            onClick={ignite}
            onKeyDown={key(ignite)}
          >
            <span className="roamer-tag">{lit ? "!!!" : "Keg · do not click"}</span>
            <div className="roamer-anchor">
              <div className="roamer-turn"><KegModel /></div>
            </div>
          </div>
        )}
      </div>
      {toast &&
        createPortal(
          <div className="toast mc-panel mc-panel-dark" role="status">
            {toast}
          </div>,
          document.body
        )}
    </>
  );
}
