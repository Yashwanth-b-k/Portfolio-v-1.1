import { art, css, paint, rng, shade } from "./textures";

/* ------------------------------------------------------------------ */
/* Item icons (12×12)                                                  */
/* ------------------------------------------------------------------ */

const O = "#17171c";

export function gem(color: string): string {
  return art(
    `gem:${color}`,
    [
      "............",
      "...oooooo...",
      "..owllllmo..",
      ".owlllllmdo.",
      ".ollllmmddo.",
      ".olllmmmddo.",
      "..ommmmddo..",
      "...ommddo...",
      "....omdo....",
      ".....oo.....",
      "............",
      "............",
    ],
    { o: O, w: "#ffffff", l: shade(color, 1.25), m: color, d: shade(color, 0.65) }
  );
}

export function ingot(color: string): string {
  return art(
    `ingot:${color}`,
    [
      "............",
      "............",
      "............",
      "...ooooooo..",
      "..owlllllmo.",
      ".owllllmmdo.",
      ".ommmmmmddo.",
      ".oddddddddo.",
      ".oooooooooo.",
      "............",
      "............",
      "............",
    ],
    { o: O, w: "#ffffff", l: shade(color, 1.2), m: color, d: shade(color, 0.65) }
  );
}

export const icons = {
  get book() {
    return art(
      "i:book",
      [
        "............",
        "..oooooooo..",
        ".orrrrrrrwo.",
        ".orrrrrrrwo.",
        ".orgggggrwo.",
        ".orrrrrrrwo.",
        ".orggggrrwo.",
        ".orrrrrrrwo.",
        ".orrrrrrrwo.",
        ".odwwwwwwwo.",
        "..oooooooo..",
        "............",
      ],
      { o: O, r: "#a6432f", g: "#e7c25a", w: "#efe6d2", d: "#7a2f20" }
    );
  },
  get pick() {
    return pickaxe("i:pick", "#e3e8ee", "#a4adb8", "#69727d", 1);
  },
  get chest() {
    return art(
      "i:chest",
      [
        "............",
        ".oooooooooo.",
        ".obbbbbbbbo.",
        ".oblbbbblbo.",
        ".oooooooooo.",
        ".obbbyybbbo.",
        ".obbbyybbbo.",
        ".oblbbbblbo.",
        ".obbbbbbbbo.",
        ".oooooooooo.",
        "............",
        "............",
      ],
      { o: O, b: "#a8743a", l: "#c99752", y: "#f1cf52" }
    );
  },
  get cap() {
    return art(
      "i:cap",
      [
        "............",
        ".....oo.....",
        "...ooddoo...",
        ".ooddddddoo.",
        "oddddllddddo",
        ".ooddddddooy",
        "..ooodddoo.y",
        "..obooooboyy",
        "..obbbbbbo.y",
        "...obbbbo...",
        "....oooo....",
        "............",
      ],
      { o: O, d: "#3b3f52", l: "#585d78", b: "#2c2f3e", y: "#f1cf52" }
    );
  },
  get mail() {
    return art(
      "i:mail",
      [
        "............",
        "............",
        ".oooooooooo.",
        ".owowwwwowo.",
        ".owwowwowwo.",
        ".owwwoowwwo.",
        ".owwwrrwwwo.",
        ".owwwrrwwwo.",
        ".owwwwwwwwo.",
        ".oooooooooo.",
        "............",
        "............",
      ],
      { o: O, w: "#f2ecdd", r: "#c8402f" }
    );
  },
  get heart() {
    return art(
      "i:heart",
      [
        ".oo...oo.",
        "orro.orro",
        "orwrorrro",
        "orrrrrrro",
        ".orrrrro.",
        "..orrro..",
        "...oro...",
        "....o....",
      ],
      { o: "#5a0f14", r: "#ee3b44", w: "#ffb3b8" }
    );
  },
  get sun() {
    return paint("i:sun", 8, 8, (set) => {
      for (let y = 0; y < 8; y++)
        for (let x = 0; x < 8; x++) {
          const e = x === 0 || y === 0 || x === 7 || y === 7;
          set(x, y, e ? "#ffd84a" : x > 1 && x < 6 && y > 1 && y < 6 ? "#fffbe0" : "#ffee8a");
        }
    });
  },
  get moon() {
    return paint("i:moon", 8, 8, (set) => {
      const craters = ["1,1", "2,1", "5,2", "5,3", "2,5", "3,5", "6,6", "1,4"];
      for (let y = 0; y < 8; y++)
        for (let x = 0; x < 8; x++)
          set(x, y, craters.includes(`${x},${y}`) ? "#aab2c8" : x + y > 9 ? "#cfd5e6" : "#e9edf7");
    });
  },
};

/* ------------------------------------------------------------------ */
/* Cursor                                                              */
/* ------------------------------------------------------------------ */

/**
 * A plain pickaxe on a 16×16 grid: a curved steel head (a quarter ring bulging
 * to the top-left, tapering to a point at each end) on a diagonal wooden handle.
 */
function pickaxe(key: string, light: string, mid: string, dark: string, scale: number): string {
  return paint(key, 16, 16, (set) => {
    // handle: three texels wide, running down to the bottom-right
    for (let i = 5; i < 16; i++) {
      set(i, i, "#b07a3f");
      if (i < 15) { set(i + 1, i, "#6b4520"); set(i, i + 1, "#8a5d2e"); }
    }
    set(15, 15, "#6b4520");
    // head
    for (let y = 0; y <= 11; y++)
      for (let x = 0; x <= 11; x++) {
        const d = Math.hypot(x - 11, y - 11);
        const tip = Math.max(x, y);            // 11 at either end of the arc
        const half = tip >= 10 ? 0.6 : tip >= 8 ? 1.1 : 1.7;
        if (Math.abs(d - 8) > half) continue;
        const edge = Math.abs(d - 8) > half - 0.75;
        set(x, y, edge ? O : d < 8 ? mid : light);
        if (!edge && x + y > 15) set(x, y, dark);
      }
  }, 1, scale);
}

export function cursor(hot: boolean): string {
  const url = hot
    ? pickaxe("cursor:hot", "#fff6c2", "#f2c84b", "#b98a1e", 2)
    : pickaxe("cursor", "#e3e8ee", "#a4adb8", "#69727d", 2);
  return `${css(url)} 9 9, ${hot ? "pointer" : "auto"}`;
}

/* ------------------------------------------------------------------ */
/* Creatures that live on flat surfaces                                */
/* ------------------------------------------------------------------ */

/** Top-down beetle, two walk frames side by side (24×12). The software kind of bug. */
export function bugSheet(): string {
  return paint("bug", 24, 12, (set) => {
    for (let f = 0; f < 2; f++) {
      const ox = f * 12;
      // legs
      [4, 6, 8].forEach((row, i) => {
        const k = (i + f) % 2 ? -1 : 1;
        set(ox + 2, row, O); set(ox + 1, row + k, O); set(ox + 0, row + k * 2, O);
        set(ox + 9, row, O); set(ox + 10, row - k, O); set(ox + 11, row - k * 2, O);
      });
      // shell
      for (let y = 3; y <= 10; y++) {
        const half = y === 3 || y === 10 ? 2 : 3;
        for (let x = 6 - half; x < 6 + half; x++)
          set(ox + x, y, x === 5 || x === 6 ? "#b3261e" : x < 5 ? "#e5483a" : "#c9352a");
      }
      [[4, 5], [7, 6], [4, 8], [7, 9]].forEach(([x, y]) => set(ox + x, y, "#2a0c0a"));
      set(ox + 4, 4, "#ff9d8f");
      // head + antennae
      for (let x = 4; x <= 7; x++) { set(ox + x, 2, O); set(ox + x, 1, x === 4 || x === 7 ? "transparent" : O); }
      set(ox + 3, f ? 0 : 1, O); set(ox + 8, f ? 1 : 0, O);
    }
  });
}

export function splat(): string {
  return paint("splat", 12, 12, (set, r) => {
    for (let i = 0; i < 46; i++) {
      const a = r() * 6.28, d = r() * r() * 6;
      set(Math.round(6 + Math.cos(a) * d), Math.round(6 + Math.sin(a) * d), r() > 0.5 ? "#7fae2e" : "#5d8a1c");
    }
  }, 5);
}

/** Flying silhouette, wings up / wings down (32×8). */
export function flyerSheet(kind: "bird" | "bat"): string {
  const body = kind === "bird" ? "#f4f1e8" : "#2b2433";
  const wing = kind === "bird" ? "#cfd6df" : "#42384d";
  return paint(`flyer:${kind}`, 32, 8, (set) => {
    for (let f = 0; f < 2; f++) {
      const ox = f * 16;
      for (let x = 6; x <= 9; x++) { set(ox + x, 4, body); set(ox + x, 3, body); }
      set(ox + 10, 3, body);
      set(ox + 11, 3, kind === "bird" ? "#f2a33a" : "#ffcf5a");
      for (let i = 0; i < 5; i++) {
        const y = f === 0 ? 2 - Math.floor(i / 2) : 5 + Math.floor(i / 2);
        set(ox + 5 - i, y, wing); set(ox + 5 - i, y + (f ? -1 : 1), wing);
        set(ox + 10 + i - 2, y, wing);
      }
      if (kind === "bat") { set(ox + 7, 2, body); set(ox + 9, 2, body); }
    }
  });
}

/* ------------------------------------------------------------------ */
/* Fire                                                                */
/* ------------------------------------------------------------------ */

/** Four flame frames in a strip (32×8). */
export function flameSheet(): string {
  return paint("flame", 32, 8, (set, r) => {
    const profile = [0, 1, 1, 2, 3, 3, 3, 2];
    for (let f = 0; f < 4; f++)
      for (let y = 0; y < 8; y++) {
        const lean = y < 4 ? Math.round(Math.sin(f * 1.7 + y) * 1) : 0;
        const hw = Math.max(0, profile[y] - (y < 3 && r() > 0.6 ? 1 : 0));
        for (let x = -hw; x < hw; x++) {
          const edge = x === -hw || x === hw - 1;
          const col = y > 5 ? (edge ? "#c8401a" : "#f08a24") : edge ? "#f08a24" : y < 3 ? "#ffd75e" : "#fff2ae";
          set(f * 8 + 4 + x + lean, y, col);
        }
      }
  }, 9);
}

/* ------------------------------------------------------------------ */
/* Scenery                                                             */
/* ------------------------------------------------------------------ */

export function cloud(i: number): string {
  return paint(`cloud:${i}`, 44, 14, (set, r) => {
    const rects: number[][] = [];
    const n = 3 + Math.floor(r() * 3);
    for (let k = 0; k < n; k++) {
      const w = 12 + Math.floor(r() * 16), h = 4 + Math.floor(r() * 5);
      rects.push([Math.floor(r() * (44 - w)), 13 - h - Math.floor(r() * 2), w, h]);
    }
    rects.push([6, 9, 32, 4]);
    for (const [x0, y0, w, h] of rects)
      for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) set(x, y, y >= 11 ? "#d5e2f2" : "#ffffff");
  }, 40 + i);
}

export function stars(): string {
  return paint("stars", 96, 96, (set, r) => {
    for (let i = 0; i < 70; i++) {
      const x = Math.floor(r() * 96), y = Math.floor(r() * 96);
      set(x, y, r() > 0.75 ? "#ffffff" : r() > 0.5 ? "#c9d4ff" : "#8f9bd0");
    }
  }, 21);
}

interface HillOpts { w: number; h: number; block: number; base: number; amp: number[]; freq: number[]; trees: number; seed: number }

/** A tileable strip of blocky hills with trees, drawn one texel per pixel. */
export function hills(key: string, o: HillOpts): string {
  return paint(`hills:${key}`, o.w, o.h, (set, r) => {
    const n = o.w / o.block;
    const ph = o.amp.map(() => r() * 6.28);
    const height = (i: number) =>
      Math.round(o.base + o.amp.reduce((s, a, k) => s + a * Math.sin((6.2832 * o.freq[k] * i) / n + ph[k]), 0));
    const G = ["#63a339", "#58962f", "#6fb043"], D = ["#7d583a", "#6f4d31"], S = ["#84878c", "#777a7f", "#8f9297"];
    const fill = (bx: number, by: number, c: string) => {
      for (let y = 0; y < o.block; y++)
        for (let x = 0; x < o.block; x++)
          set(bx * o.block + x, o.h - (by + 1) * o.block + y, shade(c, 0.93 + r() * 0.14));
    };
    const tops: number[] = [];
    for (let i = 0; i < n; i++) {
      const top = Math.max(1, height(i));
      tops.push(top);
      for (let by = 0; by < top; by++) {
        const c = by === top - 1 ? G[Math.floor(r() * 3)] : by >= top - 3 ? D[Math.floor(r() * 2)] : S[Math.floor(r() * 3)];
        fill(i, by, c);
      }
    }
    for (let t = 0; t < o.trees; t++) {
      const i = 2 + Math.floor(r() * (n - 4)), top = tops[i], trunk = 2 + Math.floor(r() * 2);
      for (let k = 0; k < trunk; k++) fill(i, top + k, "#5c4428");
      const L = ["#3a7526", "#32681f", "#44852d"];
      for (let dx = -2; dx <= 2; dx++) fill(i + dx, top + trunk, L[Math.floor(r() * 3)]);
      for (let dx = -1; dx <= 1; dx++) fill(i + dx, top + trunk + 1, L[Math.floor(r() * 3)]);
      fill(i, top + trunk + 2, L[0]);
    }
  }, o.seed);
}

export function flower(i: number): string {
  const petals = ["#f0d24a", "#e4573d", "#f3f0ea", "#8d6fe0"][i % 4];
  if (i > 3)
    return art(`tuft:${i}`, ["g..g.g.", ".g.g.g.", ".ggggg.", "..ggg.."], { g: i % 2 ? "#4f8f2b" : "#69a83c" });
  return art(`flower:${i}`, [".pp.", "pypp", ".pp.", ".g..", ".gg.", ".g.."], { p: petals, y: "#f7b733", g: "#3f7d24" });
}

export function rails(): string {
  return paint("rails", 16, 8, (set) => {
    for (let x = 0; x < 16; x++) { set(x, 0, "#c9ced6"); set(x, 1, "#7d848e"); }
    for (const x0 of [2, 10]) for (let x = x0; x < x0 + 3; x++) for (let y = 2; y < 6; y++) set(x, y, y === 2 ? "#8a6a42" : "#6b5030");
  });
}

export function wheel(): string {
  return art("wheel", [".oooo.", "ommmmo", "omoomo", "omoomo", "ommlmo", ".oooo."], { o: O, m: "#737b86", l: "#c9ced6" });
}

export function ladder(): string {
  return paint("ladder", 16, 16, (set) => {
    for (let y = 0; y < 16; y++) for (const x of [2, 3, 12, 13]) set(x, y, x % 2 ? "#8a6a42" : "#a9814d");
    for (const y of [3, 4, 11, 12]) for (let x = 2; x < 14; x++) set(x, y, y % 2 ? "#a9814d" : "#c29a63");
  });
}

/** Deterministic pseudo-random helper for layout (stable between renders). */
export const seeded = (seed: number) => rng(seed);
