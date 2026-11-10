import { useEffect, useRef, type CSSProperties } from "react";
import { bugSheet, flameSheet, flyerSheet, rails, seeded, splat, wheel } from "./sprites";
import { css } from "./textures";
import { play } from "./audio";

/* ------------------------------------------------------------------ */
/* Torch — a flickering flame with a pool of warm light                */
/* ------------------------------------------------------------------ */

export function Torch({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={`torch ${className}`} style={style} aria-hidden>
      <i className="torch-light" />
      <i className="torch-flame" style={{ backgroundImage: css(flameSheet()) }} />
      <i className="torch-stick" />
    </div>
  );
}

export function Campfire() {
  return (
    <div className="campfire" aria-hidden>
      <i className="torch-light campfire-light" />
      {[0, 1, 2, 3, 4].map((i) => (
        <i key={i} className="spark" style={{ "--i": i } as CSSProperties} />
      ))}
      <i className="campfire-flame" style={{ backgroundImage: css(flameSheet()) }} />
      <i className="campfire-flame small" style={{ backgroundImage: css(flameSheet()) }} />
      <i className="campfire-logs" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Flyers — birds by day, bats below ground                            */
/* ------------------------------------------------------------------ */

export function Flyers({ kind, count = 3, className = "" }: { kind: "bird" | "bat"; count?: number; className?: string }) {
  const r = seeded(kind === "bird" ? 3 : 8);
  const sheet = css(flyerSheet(kind));
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const dur = 16 + r() * 16, back = r() > 0.5;
        return (
          <div
            key={i}
            className="flyer"
            style={{
              top: `${8 + r() * 55}%`,
              animationDuration: `${dur}s`,
              animationDelay: `${-r() * dur}s`,
              animationDirection: back ? "reverse" : "normal",
            }}
          >
            <div className="flyer-bob" style={{ animationDuration: `${1.6 + r() * 2}s` }}>
              <i
                className="flyer-sprite"
                style={{ backgroundImage: sheet, transform: `scale(${0.7 + r() * 0.6}) scaleX(${back ? -1 : 1})`, animationDuration: kind === "bat" ? ".22s" : ".34s" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bugs — they crawl over the section, flee the cursor, and can be     */
/* squashed with a click.                                              */
/* ------------------------------------------------------------------ */

interface Bug { el: HTMLButtonElement; x: number; y: number; a: number; turn: number; dead: number; dist: number; pause: number }

export function BugField({ count = 5, onSquash }: { count?: number; onSquash?: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const cb = useRef(onSquash);
  cb.current = onSquash;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const n = window.innerWidth < 640 ? Math.min(3, count) : count;
    const sheet = css(bugSheet()), goo = css(splat());
    let W = el.clientWidth, H = el.clientHeight;
    const ro = new ResizeObserver(() => { W = el.clientWidth; H = el.clientHeight; });
    ro.observe(el);
    const ptr = { x: -999, y: -999 };
    const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; };
    window.addEventListener("pointermove", move, { passive: true });

    const spawn = (b: Bug, edge: boolean) => {
      b.x = edge ? (Math.random() < 0.5 ? -20 : W + 20) : Math.random() * W;
      b.y = 80 + Math.random() * Math.max(100, H - 160);
      b.a = Math.random() * 6.28; b.turn = 0; b.dead = 0; b.dist = 0; b.pause = 0;
      b.el.className = "bug";
      b.el.style.backgroundImage = sheet;
      b.el.disabled = false;
    };

    const bugs: Bug[] = Array.from({ length: n }, () => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", "Squash bug");
      el.appendChild(btn);
      const b: Bug = { el: btn, x: 0, y: 0, a: 0, turn: 0, dead: 0, dist: 0, pause: 0 };
      spawn(b, false);
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (b.dead) return;
        b.dead = 4.5;
        btn.className = "bug squashed";
        btn.style.backgroundImage = goo;
        btn.disabled = true;
        play("squish");
        cb.current?.();
      });
      return b;
    });

    let raf = 0, last = 0, onScreen = false;
    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      for (const b of bugs) {
        if (b.dead) { b.dead -= dt; if (b.dead <= 0) spawn(b, true); else continue; }
        const dx = b.x - ptr.x, dy = b.y - ptr.y, near = Math.hypot(dx, dy);
        let speed = 26;
        if (near < 120) {
          // Scurry away from the pointer.
          const away = Math.atan2(dy, dx);
          b.a += Math.atan2(Math.sin(away - b.a), Math.cos(away - b.a)) * Math.min(1, dt * 8);
          speed = 120; b.pause = 0;
        } else if (b.pause > 0) {
          b.pause -= dt; speed = 0;
        } else {
          b.turn += (Math.random() - 0.5) * dt * 10;
          b.turn *= 0.96;
          b.a += b.turn * dt;
          if (Math.random() < dt * 0.25) b.pause = 0.4 + Math.random() * 1.2;
        }
        // Steer back in at the edges.
        const cx = W / 2 - b.x, cy = H / 2 - b.y;
        if (b.x < 10 || b.x > W - 10 || b.y < 60 || b.y > H - 40) {
          const home = Math.atan2(cy, cx);
          b.a += Math.atan2(Math.sin(home - b.a), Math.cos(home - b.a)) * Math.min(1, dt * 3);
        }
        b.x += Math.cos(b.a) * speed * dt;
        b.y += Math.sin(b.a) * speed * dt;
        b.dist += speed * dt;
        b.el.style.transform = `translate3d(${b.x.toFixed(1)}px,${b.y.toFixed(1)}px,0) rotate(${(b.a * 57.3 + 90).toFixed(0)}deg)`;
        b.el.style.backgroundPositionX = Math.floor(b.dist / 5) % 2 ? "100%" : "0%";
      }
      if (onScreen && !document.hidden && !reduce) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen) kick(); });
    io.observe(el);
    kick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", move);
      bugs.forEach((b) => b.el.remove());
    };
  }, [count]);

  return <div ref={root} className="bugfield" />;
}

/* ------------------------------------------------------------------ */
/* Ore blocks set into a layer's wall, snapped to the 48px block grid  */
/* ------------------------------------------------------------------ */

export function Ores({ kinds, seed = 1, rows = 40, density = 0.5 }: { kinds: string[]; seed?: number; rows?: number; density?: number }) {
  const r = seeded(seed);
  const cells: { c: number; row: number; k: string; right: boolean }[] = [];
  for (let row = 2; row < rows; row++) {
    if (r() > density) continue;
    cells.push({ c: Math.floor(r() * 5), row, k: kinds[Math.floor(r() * kinds.length)], right: r() > 0.5 });
  }
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {cells.map((o, i) => (
        <i
          key={i}
          className="ore"
          style={{
            top: o.row * 48,
            left: o.right ? `calc(round(down, 100%, 48px) - ${(o.c + 1) * 48}px)` : o.c * 48,
            backgroundImage: `var(--t-ore-${o.k})`,
            animationDelay: `${-(i % 7) * 0.9}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* A train of mine carts hauling labels along a rail                   */
/* ------------------------------------------------------------------ */

export function CartTrain({ labels }: { labels: string[] }) {
  const w = css(wheel());
  const carts = [...labels, ...labels];
  return (
    <div className="cart-track" aria-hidden>
      <div className="marquee">
        {carts.map((s, i) => (
          <div key={i} className="cart" style={{ animationDelay: `${-(i % 5) * 0.13}s` }}>
            <span className="cart-load">{s}</span>
            <span className="cart-body" />
            <i className="cart-wheel" style={{ backgroundImage: w, left: 10 }} />
            <i className="cart-wheel" style={{ backgroundImage: w, right: 10 }} />
          </div>
        ))}
      </div>
      <div className="cart-rails" style={{ backgroundImage: css(rails()) }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Block debris wherever you click                                     */
/* ------------------------------------------------------------------ */

const MATS: Record<string, string[]> = {
  grass: ["#69a83c", "#5d9a33", "#86603f"],
  dirt: ["#86603f", "#7a5638", "#946c49"],
  stone: ["#8b8e93", "#7e8186", "#717479"],
  deep: ["#4b4e59", "#565a66", "#373a43"],
  wood: ["#b68d57", "#a9814d", "#7b5b33"],
  sky: ["#ffffff", "#d5e2f2"],
};

/** Throw `n` little blocks out from a point (viewport coordinates). */
export function burst(x: number, y: number, cols: string[], n = 7, power = 1) {
  for (let i = 0; i < n; i++) {
    const p = document.createElement("i");
    const s = (5 + Math.random() * 6) * Math.min(power, 1.8);
    p.className = "debris";
    p.style.cssText = `left:${x}px;top:${y}px;width:${s}px;height:${s}px;background:${cols[i % cols.length]}`;
    document.body.appendChild(p);
    const dx = (Math.random() - 0.5) * 110 * power, up = (30 + Math.random() * 50) * power;
    p.animate(
      [
        { transform: "translate(-50%,-50%) rotate(0)", opacity: 1 },
        { transform: `translate(${dx * 0.6}px,${-up}px) rotate(${dx * 2}deg)`, opacity: 1, offset: 0.4, easing: "ease-in" },
        { transform: `translate(${dx}px,${(40 + Math.random() * 40) * power}px) rotate(${dx * 4}deg)`, opacity: 0 },
      ],
      { duration: (620 + Math.random() * 200) * Math.sqrt(power), easing: "ease-out" }
    ).onfinish = () => p.remove();
  }
}

export function ClickDebris() {
  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const down = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || t.closest("input,textarea,.bug,.roamer,.mob")) return;
      play("dig");
      if (calm) return;
      const mat = t.closest<HTMLElement>("[data-mat]")?.dataset.mat ?? "stone";
      burst(e.clientX, e.clientY, MATS[mat] ?? MATS.stone);
    };
    window.addEventListener("pointerdown", down);
    return () => window.removeEventListener("pointerdown", down);
  }, []);
  return null;
}
