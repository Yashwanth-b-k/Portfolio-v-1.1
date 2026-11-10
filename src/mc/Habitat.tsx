import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Peep, Quad, Tree, quadHeight } from "./models";
import { flower, icons, seeded } from "./sprites";
import { css } from "./textures";
import { play, type Sound } from "./audio";

export interface MobSpec {
  id: string;
  kind: "peep" | "quad";
  look: string;
  /** Name tag shown above the mob. */
  name?: string;
  /** Lines the mob says when clicked, in order. */
  say?: string[];
  /** Start position as fractions of the field (x across, z depth). */
  at?: [number, number];
  /** Stay put — look around and wave, but never wander. */
  still?: boolean;
  /** Say the first line unprompted, this many ms after mount. */
  greetAfter?: number;
  speed?: number;
}

interface Sim {
  spec: MobSpec;
  el: HTMLDivElement;
  x: number; z: number; y: number; vy: number;
  yaw: number; yawT: number; tx: number; tz: number;
  state: "walk" | "idle";
  timer: number; look: number;
  phase: number; gait: number;
  hy: number; hyT: number; hp: number; hpT: number;
  wave: number; waveT: number; waveClock: number;
  line: number; hush: number;
}

// One shared pointer for every habitat on the page.
const pointer = { x: -9999, y: -9999 };
if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (e) => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
  window.addEventListener("pointerleave", () => { pointer.x = pointer.y = -9999; });
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
const DEG = 180 / Math.PI;

/**
 * Field geometry. `S` is the stage height and is chosen so the stage ends
 * exactly where the front edge of the floor lands on screen:
 *   S = eye + (floorY - eye) * P / (P - D),  P = 1100 (see .habitat in index.css)
 * `lip` is the 2D strip of grass-side blocks drawn right under that edge.
 */
export const FIELD = {
  lg: { S: 277, floorY: 150, D: 240, u: 3, eye: -306, lip: 48 },
  sm: { S: 173, floorY: 112, D: 170, u: 2.1, eye: -225, lip: 48 },
};

export function useSmall() {
  const [small, setSmall] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const on = () => setSmall(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return small;
}

interface HabitatProps {
  mobs: MobSpec[];
  /** "field" = grass floor the mobs roam; "guide" = one mob standing in place. */
  mode?: "field" | "guide";
  className?: string;
}

/**
 * A small CSS-3D world. Mobs are simulated in one requestAnimationFrame loop
 * (only while on screen): they pick a spot, turn, walk with a gait that is
 * tied to their real speed, stop, look around, and track the pointer.
 */
export function Habitat({ mobs, mode = "field", className = "" }: HabitatProps) {
  const small = useSmall();
  const dim = small ? FIELD.sm : FIELD.lg;
  const u = mode === "guide" ? (small ? 2.4 : 3) : dim.u;
  const stage = useRef<HTMLDivElement>(null);
  const els = useRef<Record<string, HTMLDivElement | null>>({});
  const sims = useRef<Map<string, Sim>>(new Map());
  const visible = small && mode === "field" ? mobs.slice(0, 4) : mobs;

  const decor = useMemo(() => {
    const r = seeded(12);
    return Array.from({ length: small ? 9 : 18 }, (_, i) => ({
      i, x: 4 + r() * 92, z: 12 + r() * (dim.D - 30), kind: Math.floor(r() * 6),
    }));
  }, [small, dim.D]);

  useEffect(() => {
    const root = stage.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = root.clientWidth;
    const ro = new ResizeObserver(() => { W = root.clientWidth; });
    ro.observe(root);

    const zMin = 26, zMax = dim.D - 44;
    const target = (s: Sim) => {
      s.tx = rand(50, Math.max(60, W - 50));
      s.tz = rand(zMin, zMax);
    };

    sims.current.clear();
    visible.forEach((spec, i) => {
      const el = els.current[spec.id];
      if (!el) return;
      const at = spec.at ?? [(i + 0.5) / visible.length, 0.5];
      const s: Sim = {
        spec, el,
        x: mode === "guide" ? 0 : at[0] * W, z: mode === "guide" ? 0 : zMin + at[1] * (zMax - zMin),
        y: 0, vy: 0, yaw: rand(-0.5, 0.5), yawT: 0, tx: 0, tz: 0,
        state: "idle", timer: spec.still ? rand(2, 4) : rand(0.4, 3), look: 0,
        phase: rand(0, 6), gait: 0, hy: 0, hyT: 0, hp: 0, hpT: 0,
        wave: 0, waveT: 0, waveClock: 0, line: 0, hush: 0,
      };
      sims.current.set(spec.id, s);
    });

    const step = (s: Sim, dt: number, rect: DOMRect) => {
      const k = (rate: number) => 1 - Math.exp(-dt * rate);
      const guide = mode === "guide";
      const speed = s.spec.speed ?? (s.spec.kind === "peep" ? 46 : 34);
      let gaitT = 0;

      if (s.state === "walk") {
        const dx = s.tx - s.x, dz = s.tz - s.z, dist = Math.hypot(dx, dz);
        if (dist < 6) {
          s.state = "idle";
          s.timer = rand(1.6, 5);
          s.yawT = rand(-0.9, 0.9);
          if (s.spec.kind === "peep" && Math.random() < 0.3) s.waveT = 1;
        } else {
          const want = Math.atan2(dx, dz);
          s.yaw += wrap(want - s.yaw) * k(5);
          const align = Math.max(0, Math.cos(wrap(want - s.yaw)));
          s.x += Math.sin(s.yaw) * speed * align * dt;
          s.z += Math.cos(s.yaw) * speed * align * dt;
          gaitT = 0.25 + 0.75 * align;
          s.hyT = 0; s.hpT = 0;
        }
      } else {
        s.yaw += wrap(s.yawT - s.yaw) * k(3);
        s.timer -= dt; s.look -= dt;
        const sx = rect.left + (guide ? rect.width / 2 : s.x);
        const sy = rect.top + (guide ? rect.height * 0.3 : dim.floorY - 60);
        const ddx = pointer.x - sx, ddy = pointer.y - sy;
        if (Math.hypot(ddx, ddy) < (guide ? 700 : 280)) {
          // Something's moving nearby — watch it.
          if (guide) s.yawT = clamp(Math.atan2(ddx, 420), -0.6, 0.6);
          s.hyT = clamp(wrap(Math.atan2(ddx, 240) - s.yaw), -1, 1);
          s.hpT = clamp(ddy / 420, -0.45, 0.55);
        } else if (s.look <= 0) {
          s.look = rand(0.9, 2.6);
          s.hyT = rand(-0.8, 0.8);
          s.hpT = s.spec.kind === "quad" && Math.random() < 0.4 ? 0.75 : rand(-0.15, 0.2);
        }
        if (s.timer <= 0) {
          if (s.spec.still || guide) {
            s.timer = rand(3, 7);
            if (Math.random() < 0.45) s.waveT = 1;
            s.yawT = rand(-0.45, 0.45);
          } else {
            target(s);
            s.state = "walk";
            s.waveT = 0;
          }
        }
      }

      if (s.waveT) { s.waveClock += dt; if (s.waveClock > 1.9) { s.waveT = 0; s.waveClock = 0; } }
      s.gait += (gaitT - s.gait) * k(8);
      s.wave += (s.waveT - s.wave) * k(9);
      s.hy += (s.hyT - s.hy) * k(6);
      s.hp += (s.hpT - s.hp) * k(6);
      s.phase += dt * (s.spec.kind === "peep" ? 9.5 : 11) * (0.2 + s.gait);
      if (s.y > 0 || s.vy > 0) { s.vy -= 1100 * dt; s.y += s.vy * dt; if (s.y < 0) { s.y = 0; s.vy = 0; } }
      if (s.hush > 0) { s.hush -= dt; if (s.hush <= 0) s.el.classList.remove("talking"); }

      const st = s.el.style, t = performance.now() / 1000;
      st.transform = `translate3d(${s.x.toFixed(1)}px,${(-s.y).toFixed(1)}px,${s.z.toFixed(1)}px)`;
      st.setProperty("--yaw", `${(s.yaw * DEG).toFixed(1)}deg`);
      st.setProperty("--swing", `${(Math.sin(s.phase) * 36 * s.gait + Math.sin(t * 1.6 + s.phase) * 1.5).toFixed(1)}deg`);
      st.setProperty("--bob", `${(Math.abs(Math.sin(s.phase)) * 2 * s.gait + Math.sin(t * 2 + s.z) * 0.4).toFixed(2)}px`);
      st.setProperty("--hy", `${(s.hy * DEG).toFixed(1)}deg`);
      st.setProperty("--hp", `${(s.hp * DEG * 0.6).toFixed(1)}deg`);
      st.setProperty("--wave", s.wave.toFixed(3));
      st.setProperty("--wiggle", `${(Math.sin(t * 13) * 16).toFixed(1)}deg`);
      st.setProperty("--tail", `${(Math.sin(t * (4 + s.gait * 6) + s.z) * 22).toFixed(1)}deg`);
      st.setProperty("--ss", `${Math.max(0.5, 1 - s.y / 90).toFixed(2)}`);
    };

    let raf = 0, last = 0, onScreen = false;
    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const rect = root.getBoundingClientRect();
      sims.current.forEach((s) => step(s, dt, rect));
      if (onScreen && !document.hidden && !reduce) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen) kick(); }, { rootMargin: "120px" });
    io.observe(root);
    document.addEventListener("visibilitychange", kick);
    kick();

    const timers = visible
      .filter((m) => m.greetAfter && m.say?.length)
      .map((m) => window.setTimeout(() => speak(m.id, false), m.greetAfter));

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", kick);
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobs, mode, small]);

  /** Show the mob's next line in its speech bubble (and hop, if poked). */
  function speak(id: string, poked: boolean) {
    const s = sims.current.get(id);
    if (!s) return;
    if (poked) play(s.spec.kind === "peep" ? "peep" : (s.spec.look.replace(/\d+$/, "") as Sound));
    if (poked && s.y === 0) {
      s.vy = 300;
      play("pop");
      const h = document.createElement("i");
      h.className = "heart-pop";
      h.style.backgroundImage = css(icons.heart);
      s.el.appendChild(h);
      h.animate(
        [{ transform: "translate(-50%,0) scale(.4)", opacity: 0 }, { transform: "translate(-50%,-26px) scale(1)", opacity: 1, offset: 0.25 }, { transform: "translate(-50%,-70px) scale(1)", opacity: 0 }],
        { duration: 1100, easing: "ease-out" }
      ).onfinish = () => h.remove();
    }
    const lines = s.spec.say;
    if (!lines?.length) return;
    const bubble = s.el.querySelector<HTMLElement>(".mob-bubble");
    if (!bubble) return;
    bubble.textContent = lines[s.line % lines.length];
    // Keep the bubble inside the stage when the mob is near an edge.
    const W = stage.current?.clientWidth ?? 0, half = bubble.offsetWidth / 2 + 28;
    const shift = W > half * 2 ? clamp(s.x, half, W - half) - s.x : W / 2 - s.x;
    bubble.style.setProperty("--bx", `${mode === "guide" ? 0 : shift.toFixed(0)}px`);
    s.line++;
    s.el.classList.add("talking");
    s.hush = 3.6;
    if (s.spec.kind === "peep") { s.waveT = 1; s.waveClock = 0; }
    if (s.state === "walk") { s.state = "idle"; s.timer = 3.4; s.yawT = 0; }
  }

  const height = (m: MobSpec) => (m.kind === "peep" ? 34 : quadHeight(m.look)) * u;

  const mobEls = visible.map((m) => (
    <div
      key={m.id}
      ref={(el) => { els.current[m.id] = el; }}
      className="mob"
      style={{ "--mh": `${height(m)}px`, "--sw": `${m.kind === "peep" ? 13 * u : 17 * u}px` } as CSSProperties}
      onClick={() => speak(m.id, true)}
      role="button"
      tabIndex={0}
      aria-label={m.name ? `${m.name} — click to interact` : "Click to interact"}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); speak(m.id, true); } }}
    >
      <div className="mob-shadow" />
      <div className="mob-yaw">{m.kind === "peep" ? <Peep id={m.look} u={u} /> : <Quad id={m.look} u={u} />}</div>
      {m.name && <div className="mob-tag">{m.name}</div>}
      {m.say && <div className="mob-bubble" role="status" />}
    </div>
  ));

  if (mode === "guide") {
    return (
      <div ref={stage} className={`habitat habitat-guide ${className}`} style={{ width: 22 * u, height: 40 * u }}>
        <div className="habitat-world" style={{ top: 38 * u, left: "50%", width: 0 }}>{mobEls}</div>
      </div>
    );
  }

  return (
    <div ref={stage} className={`habitat ${className}`} style={{ height: dim.S, perspectiveOrigin: `50% ${dim.eye}px` }} data-mat="grass">
      <div className="habitat-world" style={{ top: dim.floorY }}>
        <div className="habitat-floor" style={{ height: dim.D }} />
        <div className="prop" style={{ left: small ? "86%" : "7%", transform: "translateZ(18px)" }}><Tree s={small ? 0.7 : 1} /></div>
        {!small && <div className="prop" style={{ left: "91%", transform: "translateZ(34px)" }}><Tree s={0.85} /></div>}
        {decor.map((d) => (
          <div key={d.i} className="prop" style={{ left: `${d.x}%`, transform: `translateZ(${d.z}px)` }}>
            <i className="sprite-plant" style={{ backgroundImage: css(flower(d.kind)), width: d.kind > 3 ? 21 : 12, height: d.kind > 3 ? 12 : 18 }} />
          </div>
        ))}
        {mobEls}
      </div>
    </div>
  );
}
