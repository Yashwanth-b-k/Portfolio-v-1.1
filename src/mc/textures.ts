/**
 * Procedural pixel textures.
 * Every block, sprite and icon on the site is painted here at runtime onto
 * tiny canvases — no image files are downloaded or bundled.
 */

export type Setter = (x: number, y: number, color: string) => void;
type Draw = (set: Setter, r: () => number, ctx: CanvasRenderingContext2D) => void;

const urls = new Map<string, string>();
const canvases = new Map<string, HTMLCanvasElement>();

export function rng(seed: number) {
  let s = (seed * 2654435761) >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

/** Multiply a hex colour's brightness. */
export function shade(hex: string, f: number): string {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) =>
    Math.max(0, Math.min(255, Math.round(v * f)))
  );
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

/** Paint a w×h texel canvas once and cache it. Returns a data URL. */
export function paint(key: string, w: number, h: number, draw: Draw, seed = 7, scale = 1): string {
  const hit = urls.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas");
  c.width = w * scale;
  c.height = h * scale;
  const ctx = c.getContext("2d")!;
  const set: Setter = (x, y, color) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    ctx.fillStyle = color;
    ctx.fillRect(x * scale, y * scale, scale, scale);
  };
  draw(set, rng(seed), ctx);
  const url = c.toDataURL("image/png");
  urls.set(key, url);
  canvases.set(key, c);
  return url;
}

export const css = (url: string) => `url("${url}")`;

/** Pixel art from rows of characters. "." is transparent. */
export function art(key: string, rows: string[], pal: Record<string, string>, scale = 1): string {
  const w = Math.max(...rows.map((r) => r.length));
  return paint(
    key,
    w,
    rows.length,
    (set) => {
      rows.forEach((row, y) =>
        [...row].forEach((ch, x) => {
          const c = pal[ch];
          if (c) set(x, y, c);
        })
      );
    },
    1,
    scale
  );
}

/** A flat colour with per-texel brightness jitter. */
export function flat(color: string, w: number, h: number, seed = 3, amt = 0.1): string {
  return paint(`flat:${color}:${w}x${h}:${seed}`, w, h, (set, r) => {
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) set(x, y, shade(color, 1 - amt + r() * amt * 2));
  }, seed);
}

/* ------------------------------------------------------------------ */
/* Blocks (16×16)                                                      */
/* ------------------------------------------------------------------ */

const pick = <T,>(a: T[], r: () => number) => a[Math.floor(r() * a.length)];

/** Short horizontal runs of the same shade — reads as rock / soil grain. */
function streaks(set: Setter, r: () => number, colors: string[], maxRun: number) {
  for (let y = 0; y < 16; y++) {
    let x = 0;
    while (x < 16) {
      const len = 1 + Math.floor(r() * maxRun);
      const c = pick(colors, r);
      for (let i = 0; i < len && x < 16; i++) set(x++, y, c);
    }
  }
}

const DIRT = ["#86603f", "#7a5638", "#946c49", "#6c4b30", "#805a3b"];
const GRASS = ["#69a83c", "#5d9a33", "#77b647", "#528d2c", "#63a137"];
const STONE = ["#8b8e93", "#7e8186", "#979a9f", "#717479", "#85888d"];
const DEEP = ["#4b4e59", "#41444e", "#565a66", "#373a43", "#464954"];

const drawDirt: Draw = (set, r) => {
  streaks(set, r, DIRT, 2);
  for (let i = 0; i < 5; i++) set(Math.floor(r() * 16), Math.floor(r() * 16), "#a0917f");
};
const drawStone: Draw = (set, r) => {
  streaks(set, r, STONE, 4);
  for (let i = 0; i < 4; i++) {
    const x = Math.floor(r() * 13), y = Math.floor(r() * 15);
    for (let k = 0; k < 3; k++) set(x + k, y, "#63666b");
  }
};
const drawDeep: Draw = (set, r) => {
  streaks(set, r, DEEP, 5);
  for (let i = 0; i < 3; i++) {
    const y = Math.floor(r() * 16), x = Math.floor(r() * 10);
    for (let k = 0; k < 5; k++) set(x + k, y, "#2c2e36");
  }
};
const ore = (base: Draw, color: string): Draw => (set, r, ctx) => {
  base(set, r, ctx);
  for (let i = 0; i < 6; i++) {
    const x = 1 + Math.floor(r() * 12), y = 1 + Math.floor(r() * 12);
    set(x, y, shade(color, 1.25));
    set(x + 1, y, color);
    set(x, y + 1, color);
    if (r() > 0.4) set(x + 1, y + 1, shade(color, 0.7));
    if (r() > 0.6) set(x + 2, y + 1, shade(color, 0.7));
  }
};

const BLOCKS: Record<string, Draw> = {
  dirt: drawDirt,
  "grass-top": (set, r) => {
    streaks(set, r, GRASS, 2);
    for (let i = 0; i < 7; i++) set(Math.floor(r() * 16), Math.floor(r() * 16), "#86c653");
  },
  "grass-side": (set, r, ctx) => {
    drawDirt(set, r, ctx);
    for (let x = 0; x < 16; x++) {
      const drip = 3 + Math.floor(r() * 3);
      for (let y = 0; y < drip; y++) set(x, y, y === drip - 1 ? "#4a8227" : pick(GRASS, r));
    }
  },
  stone: drawStone,
  deep: drawDeep,
  bedrock: (set, r) => streaks(set, r, ["#2a2a2e", "#3d3d42", "#18181b", "#55555b", "#232327"], 3),
  planks: (set, r) => {
    const W = ["#b68d57", "#a9814d", "#c29a63", "#b08651"];
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        const board = Math.floor(y / 4);
        const seam = (x + board * 5) % 16 === 0;
        set(x, y, y % 4 === 3 || seam ? "#7b5b33" : pick(W, r));
      }
  },
  log: (set, r) => {
    const B = ["#6a4f2e", "#5b4326", "#775a36", "#523c21"];
    for (let x = 0; x < 16; x++) {
      const c = pick(B, r);
      for (let y = 0; y < 16; y++) set(x, y, r() > 0.8 ? pick(B, r) : c);
    }
  },
  leaves: (set, r) => {
    const L = ["#3e7b29", "#356c22", "#4a8b32", "#2b5a1b", "#55983a"];
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) set(x, y, pick(L, r));
    for (let i = 0; i < 14; i++) set(Math.floor(r() * 16), Math.floor(r() * 16), "#1f4513");
  },
  bookshelf: (set, r) => {
    const BOOKS = ["#8f3a30", "#34587f", "#3f7446", "#b08f3c", "#6a4a86", "#8a5a34", "#7d2f3a"];
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) set(x, y, y % 8 === 0 || y % 8 === 7 ? "#a9814d" : "#3a2a18");
    for (const top of [1, 9]) {
      let x = 0;
      while (x < 16) {
        const w = 2 + Math.floor(r() * 2), c = pick(BOOKS, r), short = r() > 0.7 ? 1 : 0;
        if (r() > 0.1)
          for (let i = 0; i < w && x + i < 16; i++)
            for (let y = top + short; y < top + 6; y++)
              set(x + i, y, y === top + short + 1 ? shade(c, 1.3) : i === w - 1 ? shade(c, 0.7) : c);
        x += w;
      }
    }
  },
  "ore-diamond": ore(drawDeep, "#5fe0d8"),
  "ore-emerald": ore(drawDeep, "#3fd16a"),
  "ore-amethyst": ore(drawDeep, "#b57bf0"),
  "ore-lapis": ore(drawDeep, "#4a7df0"),
  "ore-gold": ore(drawDeep, "#f2c84b"),
  "ore-ruby": ore(drawDeep, "#ef5a4c"),
  "ore-coal": ore(drawStone, "#2b2b30"),
  "ore-iron": ore(drawStone, "#d9b08c"),
};

function block(name: string): string {
  return paint(`block:${name}`, 16, 16, BLOCKS[name], name.length * 31 + name.charCodeAt(0));
}

/** A ragged strip of `name` blocks hanging from the top — the seam between two layers. */
function edge(name: string): string {
  block(name);
  const src = canvases.get(`block:${name}`)!;
  return paint(`edge:${name}`, 16 * 16, 16 * 3, (_s, r, ctx) => {
    for (let bx = 0; bx < 16; bx++) {
      const depth = 1 + Math.floor(r() * 3);
      for (let by = 0; by < depth; by++) ctx.drawImage(src, bx * 16, by * 16);
    }
  }, name.length + 11);
}

/** Publish every texture as a CSS custom property (`--t-dirt`, `--e-stone`, …). */
export function installTextures() {
  const root = document.documentElement.style;
  for (const name of Object.keys(BLOCKS)) root.setProperty(`--t-${name}`, css(block(name)));
  for (const name of ["dirt", "stone", "deep"]) root.setProperty(`--e-${name}`, css(edge(name)));
}
