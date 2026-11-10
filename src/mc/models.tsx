import type { CSSProperties } from "react";
import { Box } from "./Box";
import { css, flat, paint, shade } from "./textures";

/* ------------------------------------------------------------------ */
/* Peeps — blocky people                                               */
/* ------------------------------------------------------------------ */

export interface PeepLook {
  skin: string;
  hair: string;
  top: string;
  trim: string;
  pants: string;
  shoes: string;
  hat?: "helmet" | "cap" | "board" | "phones";
  hatColor?: string;
}

export const PEEPS: Record<string, PeepLook> = {
  yash: { skin: "#c98d62", hair: "#231a16", top: "#e0a230", trim: "#fff1c9", pants: "#33384a", shoes: "#e9e6df", hat: "phones", hatColor: "#2a2c36" },
  miner: { skin: "#d7a07a", hair: "#5a3a22", top: "#4d6f9c", trim: "#d7dde6", pants: "#4a4038", shoes: "#2a2622", hat: "helmet", hatColor: "#f2c230" },
  scholar: { skin: "#b97c56", hair: "#1d1b22", top: "#6a4aa6", trim: "#e8d38a", pants: "#3a2f5a", shoes: "#22202a", hat: "board", hatColor: "#23232b" },
  courier: { skin: "#e0b08a", hair: "#8a4b22", top: "#c8402f", trim: "#f2ecdd", pants: "#2f4a6a", shoes: "#3a2a1c", hat: "cap", hatColor: "#c8402f" },
  tester: { skin: "#a86d49", hair: "#2a1d18", top: "#3f9a6a", trim: "#d9f2e2", pants: "#3c3c44", shoes: "#dcdcdc" },
};

const j = (c: string, r: () => number, a = 0.08) => shade(c, 1 - a + r() * a * 2);

function peepTex(id: string, L: PeepLook) {
  const k = (n: string) => `peep:${id}:${n}`;
  const headFront = paint(k("hf"), 8, 8, (set, r) => {
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 8; x++) {
        const hair = y < 2 || (y === 2 && (x < 3 || x > 6));
        set(x, y, j(hair ? L.hair : L.skin, r));
      }
    set(1, 4, "#ffffff"); set(2, 4, "#2a2433"); set(5, 4, "#2a2433"); set(6, 4, "#ffffff");
    set(3, 6, shade(L.skin, 0.68)); set(4, 6, shade(L.skin, 0.68));
  });
  const headSide = paint(k("hs"), 8, 8, (set, r) => {
    for (let y = 0; y < 8; y++)
      for (let x = 0; x < 8; x++) set(x, y, j(y < 3 || (y < 5 && (x === 0 || x === 7)) ? L.hair : L.skin, r));
  });
  const headBack = paint(k("hb"), 8, 8, (set, r) => {
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) set(x, y, j(y < 6 ? L.hair : L.skin, r));
  });
  const bodyFront = paint(k("bf"), 8, 12, (set, r) => {
    for (let y = 0; y < 12; y++)
      for (let x = 0; x < 8; x++) {
        const pocket = y >= 7 && y <= 9 && x >= 2 && x <= 5;
        const dark = pocket || y === 11 || (y === 0 && x > 1 && x < 6);
        set(x, y, j(dark ? shade(L.top, 0.82) : L.top, r, 0.05));
      }
    set(3, 1, L.trim); set(4, 1, L.trim); set(3, 2, L.trim); set(4, 3, L.trim);
  });
  const bodyBack = paint(k("bb"), 8, 12, (set, r) => {
    for (let y = 0; y < 12; y++)
      for (let x = 0; x < 8; x++) set(x, y, j(y < 4 && x > 0 && x < 7 ? shade(L.top, 0.88) : L.top, r, 0.05));
  });
  const arm = paint(k("arm"), 4, 12, (set, r) => {
    for (let y = 0; y < 12; y++)
      for (let x = 0; x < 4; x++) set(x, y, j(y > 8 ? L.skin : y === 8 ? shade(L.top, 0.8) : L.top, r, 0.05));
  });
  const leg = paint(k("leg"), 4, 12, (set, r) => {
    for (let y = 0; y < 12; y++) for (let x = 0; x < 4; x++) set(x, y, j(y > 9 ? L.shoes : L.pants, r, 0.06));
  });
  return {
    headFront: css(headFront), headSide: css(headSide), headBack: css(headBack),
    hair: css(flat(L.hair, 8, 8, 5)), bodyFront: css(bodyFront), bodyBack: css(bodyBack),
    top: css(flat(L.top, 4, 12, 6, 0.05)), arm: css(arm), leg: css(leg), skin: css(flat(L.skin, 4, 4, 2, 0.05)),
  };
}

function Hat({ look, u }: { look: PeepLook; u: number }) {
  const c = look.hatColor ?? "#333";
  switch (look.hat) {
    case "phones":
      return (
        <>
          <Box w={8.8 * u} h={u} d={2 * u} y={8 * u} faces={{ all: c }} />
          <Box w={1.3 * u} h={3.6 * u} d={3.6 * u} x={-4.6 * u} y={2.4 * u} faces={{ all: c, left: "#4a4d5c" }} />
          <Box w={1.3 * u} h={3.6 * u} d={3.6 * u} x={4.6 * u} y={2.4 * u} faces={{ all: c, right: "#4a4d5c" }} />
        </>
      );
    case "helmet":
      return (
        <>
          <Box w={9 * u} h={3 * u} d={9 * u} y={5.6 * u} faces={{ all: c }} />
          <Box w={2.4 * u} h={2 * u} d={1.2 * u} y={6 * u} z={4.9 * u} faces={{ all: "#fff6c2" }} className="lamp" />
        </>
      );
    case "cap":
      return (
        <>
          <Box w={8.6 * u} h={2.4 * u} d={8.6 * u} y={6.2 * u} faces={{ all: c }} />
          <Box w={8.6 * u} h={0.8 * u} d={3.2 * u} y={6.2 * u} z={5.6 * u} faces={{ all: shade(c, 0.8) }} />
        </>
      );
    case "board":
      return (
        <>
          <Box w={8.5 * u} h={1.6 * u} d={8.5 * u} y={7 * u} faces={{ all: c }} />
          <Box w={12 * u} h={0.9 * u} d={12 * u} y={8.6 * u} faces={{ all: shade(c, 1.4) }} />
          <Box w={0.9 * u} h={3.2 * u} d={0.9 * u} x={5.2 * u} y={5.5 * u} z={5.2 * u} faces={{ all: "#f1cf52" }} />
        </>
      );
    default:
      return null;
  }
}

const swing = (k: number): CSSProperties => ({ transform: `rotateX(calc(var(--swing, 0deg) * ${k}))` });

export function Peep({ id, u = 3 }: { id: string; u?: number }) {
  const L = PEEPS[id] ?? PEEPS.yash;
  const t = peepTex(id, L);
  const lid: CSSProperties = { background: L.skin };
  return (
    <div className="mob-model">
      <Box w={4 * u} h={12 * u} d={4 * u} x={-2 * u} faces={{ all: t.leg }} origin="50% 0%" style={swing(1)} />
      <Box w={4 * u} h={12 * u} d={4 * u} x={2 * u} faces={{ all: t.leg }} origin="50% 0%" style={swing(-1)} />
      <Box w={8 * u} h={12 * u} d={4 * u} y={12 * u} faces={{ all: t.top, front: t.bodyFront, back: t.bodyBack }} />
      <Box w={4 * u} h={12 * u} d={4 * u} x={-6 * u} y={12 * u} faces={{ all: t.arm, top: t.top }} origin="50% 8%" style={swing(-0.8)} />
      <Box
        w={4 * u} h={12 * u} d={4 * u} x={6 * u} y={12 * u}
        faces={{ all: t.arm, top: t.top }}
        origin="50% 8%"
        style={{
          transform:
            "rotateX(calc(var(--swing, 0deg) * 0.8 - var(--wave, 0) * 168deg)) rotateZ(calc(var(--wave, 0) * var(--wiggle, 0deg)))",
        }}
      />
      <Box
        w={8 * u} h={8 * u} d={8 * u} y={24 * u}
        faces={{ front: t.headFront, left: t.headSide, right: t.headSide, back: t.headBack, top: t.hair, bottom: t.skin }}
        origin="50% 100%"
        style={{ transform: "rotateY(var(--hy, 0deg)) rotateX(calc(var(--hp, 0deg) * -1))" }}
        front={
          <>
            <b className="blink" style={{ ...lid, left: "12.5%" }} />
            <b className="blink" style={{ ...lid, left: "62.5%" }} />
          </>
        }
      >
        <Hat look={L} u={u} />
      </Box>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Quads — four-legged critters                                        */
/* ------------------------------------------------------------------ */

export interface QuadLook {
  body: string; belly?: string; head: string; snout: string; nose: string; leg: string; ear: string;
  tail?: [color: string, tip: string, len: number];
  bw: number; bh: number; bd: number; hw: number; hh: number; hd: number; lh: number; earH: number;
}

export const QUADS: Record<string, QuadLook> = {
  capy: { body: "#8f6a45", head: "#96704a", snout: "#7a583a", nose: "#2a1f18", leg: "#6f5136", ear: "#6f5136", bw: 9, bh: 8, bd: 15, hw: 8, hh: 7, hd: 8, lh: 5, earH: 1.5 },
  fox: { body: "#d8732a", belly: "#f3ead8", head: "#dd7a2f", snout: "#f3ead8", nose: "#1c1714", leg: "#3a2a22", ear: "#2a1f1a", tail: ["#d8732a", "#f7f1e3", 9], bw: 6, bh: 6, bd: 13, hw: 7, hh: 6, hd: 6, lh: 5, earH: 3 },
  woolly: { body: "#efe9dc", head: "#4c4038", snout: "#5d5046", nose: "#231c18", leg: "#4c4038", ear: "#4c4038", tail: ["#efe9dc", "#efe9dc", 2], bw: 10, bh: 9, bd: 14, hw: 6, hh: 6, hd: 6, lh: 5, earH: 1.5 },
};

export const quadHeight = (id: string) => {
  const L = QUADS[id] ?? QUADS.capy;
  return L.lh + L.bh + L.earH + 1;
};

export function Quad({ id, u = 3 }: { id: string; u?: number }) {
  const L = QUADS[id] ?? QUADS.capy;
  const body = css(flat(L.body, L.bw, L.bd, 4, id === "woolly" ? 0.12 : 0.07));
  const leg = css(flat(L.leg, 3, 6, 8, 0.06));
  const headTex = css(
    paint(`quad:${id}:head`, L.hw, L.hh, (set, r) => {
      for (let y = 0; y < L.hh; y++)
        for (let x = 0; x < L.hw; x++) set(x, y, j(L.belly && y > L.hh - 3 && (x < 2 || x > L.hw - 3) ? L.belly : L.head, r, 0.06));
      const ey = Math.floor(L.hh * 0.34);
      set(1, ey, "#15100d"); set(L.hw - 2, ey, "#15100d");
      set(1, ey - 1, shade(L.head, 0.8)); set(L.hw - 2, ey - 1, shade(L.head, 0.8));
    })
  );
  const snout = css(
    paint(`quad:${id}:snout`, 4, 3, (set) => {
      for (let y = 0; y < 3; y++) for (let x = 0; x < 4; x++) set(x, y, y === 0 && (x === 1 || x === 2) ? L.nose : L.snout);
    })
  );
  const lx = (L.bw / 2 - 1.6) * u, lz = (L.bd / 2 - 2) * u;
  const legBox = (x: number, z: number, k: number) => (
    <Box key={`${x}${z}`} w={2.6 * u} h={(L.lh + 1) * u} d={2.6 * u} x={x} z={z} faces={{ all: leg }} origin="50% 0%" style={swing(k)} />
  );
  return (
    <div className="mob-model">
      {legBox(-lx, lz, 0.7)}
      {legBox(lx, lz, -0.7)}
      {legBox(-lx, -lz, -0.7)}
      {legBox(lx, -lz, 0.7)}
      <Box w={L.bw * u} h={L.bh * u} d={L.bd * u} y={L.lh * u} faces={{ all: body, bottom: L.belly ?? L.body, front: L.belly ?? body }} />
      {L.tail && (
        <Box
          w={2.6 * u} h={2.6 * u} d={L.tail[2] * u}
          y={(L.lh + L.bh - 3.6) * u}
          z={-(L.bd / 2 + L.tail[2] / 2 - 0.6) * u}
          faces={{ all: L.tail[0], back: L.tail[1] }}
          origin={`50% 50% ${(L.tail[2] * u) / 2}px`}
          style={{ transform: "rotateY(var(--tail, 0deg)) rotateX(16deg)" }}
        >
          {L.tail[2] > 4 && (
            <Box w={2.7 * u} h={2.7 * u} d={3 * u} y={-0.05 * u} z={-(L.tail[2] / 2 - 1.4) * u} faces={{ all: L.tail[1] }} />
          )}
        </Box>
      )}
      <Box
        w={L.hw * u} h={L.hh * u} d={L.hd * u}
        y={(L.lh + L.bh - L.hh * 0.5) * u}
        z={(L.bd / 2 + L.hd / 2 - 1.6) * u}
        faces={{ all: css(flat(L.head, L.hw, L.hh, 9, 0.06)), front: headTex }}
        origin={`50% 100% ${(-L.hd * u) / 2}px`}
        style={{ transform: "rotateY(var(--hy, 0deg)) rotateX(calc(var(--hp, 0deg) * -1))" }}
      >
        <Box w={4 * u} h={3 * u} d={2.4 * u} y={0.3 * u} z={(L.hd / 2 + 1) * u} faces={{ all: L.snout, front: snout }} />
        <Box w={1.7 * u} h={L.earH * u} d={u} x={-(L.hw / 2 - 1.1) * u} y={L.hh * u} z={-0.6 * u} faces={{ all: L.ear }} />
        <Box w={1.7 * u} h={L.earH * u} d={u} x={(L.hw / 2 - 1.1) * u} y={L.hh * u} z={-0.6 * u} faces={{ all: L.ear }} />
      </Box>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

export function Tree({ s = 1 }: { s?: number }) {
  const log = "var(--t-log)", leaves = "var(--t-leaves)";
  return (
    <>
      <Box w={16 * s} h={62 * s} d={16 * s} faces={{ all: log }} />
      <Box w={76 * s} h={40 * s} d={76 * s} y={50 * s} faces={{ all: leaves }} />
      <Box w={44 * s} h={26 * s} d={44 * s} y={90 * s} faces={{ all: leaves }} />
    </>
  );
}

export function GrassCube({ size = 40, className = "" }: { size?: number; className?: string }) {
  const side = "var(--t-grass-side)";
  return (
    <span className={`cube-view ${className}`} style={{ width: size * 1.5, height: size * 1.5 }} aria-hidden>
      <span className="cube-spin">
        <Box w={size} h={size} d={size} y={-size / 2} faces={{ all: side, top: "var(--t-grass-top)", bottom: "var(--t-dirt)" }} />
      </span>
    </span>
  );
}

const chestTex = (h: number) =>
  css(
    paint(`chest:${h}`, 16, h, (set, r) => {
      for (let y = 0; y < h; y++)
        for (let x = 0; x < 16; x++) {
          const border = x === 0 || x === 15 || y === 0 || y === h - 1;
          const band = x === 3 || x === 12;
          set(x, y, border ? "#3b2a17" : band ? "#5d636d" : j(y % 4 === 3 ? "#8a5f2e" : "#a8743a", r, 0.06));
        }
    })
  );

/** A treasure chest. Set `--open` (0–1) on any ancestor to lift the lid. */
export function Chest({ item }: { item?: string }) {
  const base = chestTex(9), lid = chestTex(5), top = chestTex(11);
  return (
    <span className="chest-view" aria-hidden>
      <span className="chest-turn">
        <Box w={64} h={34} d={44} faces={{ all: base, top: "#1d140b" }}>
          <div className="chest-glow" />
          {item && <div className="chest-item" style={{ backgroundImage: css(item) }} />}
        </Box>
        <Box
          w={64} h={18} d={44} y={34}
          faces={{ all: lid, top, bottom: "#2a1c0f" }}
          origin="50% 100% -22px"
          className="chest-lid"
          front={<b className="chest-latch" />}
        />
      </span>
    </span>
  );
}
