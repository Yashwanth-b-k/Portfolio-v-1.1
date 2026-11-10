import type { CSSProperties, ReactNode } from "react";

export interface Faces {
  all?: string;
  front?: string;
  back?: string;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
}

interface BoxProps {
  /** Size in px. */
  w: number;
  h: number;
  d: number;
  /** Centre x, height of the underside above the parent's origin, centre z. */
  x?: number;
  y?: number;
  z?: number;
  faces: Faces;
  /** Pivot for `style.transform`, as a CSS transform-origin. */
  origin?: string;
  style?: CSSProperties;
  className?: string;
  /** Drawn on the front face (eyes, latches…). */
  front?: ReactNode;
  /** Child boxes, positioned relative to this box's bottom-centre. */
  children?: ReactNode;
}

// Simple directional light: darker overlays on the faces turned away from it.
const LIGHT: Record<string, string> = {
  front: "rgba(0,0,0,0)",
  top: "rgba(255,255,255,0.10)",
  right: "rgba(0,0,0,0.16)",
  left: "rgba(0,0,0,0.28)",
  back: "rgba(0,0,0,0.36)",
  bottom: "rgba(0,0,0,0.5)",
};

function face(name: string, v: string | undefined): CSSProperties {
  const tint = `linear-gradient(${LIGHT[name]},${LIGHT[name]})`;
  if (!v) return { backgroundImage: tint, backgroundColor: "#888" };
  return v.startsWith("url") || v.startsWith("var(")
    ? { backgroundImage: `${tint},${v}`, backgroundSize: "100% 100%" }
    : { backgroundImage: tint, backgroundColor: v };
}

/** A textured cuboid built from six CSS-3D planes. */
export function Box({ w, h, d, x = 0, y = 0, z = 0, faces, origin, style, className, front, children }: BoxProps) {
  const f = (n: keyof Faces) => face(n, faces[n] ?? faces.all);
  return (
    <div
      className="box3d"
      style={{ left: x - w / 2, top: -(y + h), width: w, height: h, transform: `translateZ(${z}px)` }}
    >
      <div className={`box3d-pivot ${className ?? ""}`} style={{ transformOrigin: origin, ...style }}>
        <i style={{ width: w, height: h, transform: `translateZ(${d / 2}px)`, ...f("front") }}>{front}</i>
        <i style={{ width: w, height: h, transform: `rotateY(180deg) translateZ(${d / 2}px)`, ...f("back") }} />
        <i style={{ width: d, height: h, left: (w - d) / 2, transform: `rotateY(90deg) translateZ(${w / 2}px)`, ...f("right") }} />
        <i style={{ width: d, height: h, left: (w - d) / 2, transform: `rotateY(-90deg) translateZ(${w / 2}px)`, ...f("left") }} />
        <i style={{ width: w, height: d, top: (h - d) / 2, transform: `rotateX(90deg) translateZ(${h / 2}px)`, ...f("top") }} />
        <i style={{ width: w, height: d, top: (h - d) / 2, transform: `rotateX(-90deg) translateZ(${h / 2}px)`, ...f("bottom") }} />
        {children && <div className="box3d-anchor">{children}</div>}
      </div>
    </div>
  );
}
