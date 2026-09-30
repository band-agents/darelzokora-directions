/**
 * Drawing pieces shared by every composition: precision rings, a growth
 * curve, a dot grid, a slow light sweep, the logo mark, the doctor and the
 * captions.
 *
 * The register is clinical, not playful: thin strokes, slow motion, nothing
 * bounces. All motion takes an explicit `t` in [0, 1) that the caller derives
 * from the frame, and every piece moves a whole number of cycles per loop (or
 * is off-frame at both ends), so any scene built from them loops without a seam.
 */

import { Img } from "remotion";
import mark from "@/brand/logo-mark.svg";
import seated from "@/media/dr-seated.webp";

export const TAU = Math.PI * 2;
export const wave = (t: number, cycles = 1, phase = 0) => Math.sin(TAU * (t * cycles + phase));
/** 0 → 1 → 0 over one cycle, eased at both ends. */
export const pingPong = (t: number) => 0.5 - 0.5 * Math.cos(TAU * t);

/** Concentric hairline rings with two dashed arcs turning in opposite directions and one orbiting dot. */
export function Rings({ cx, cy, r, gap, t, color, n = 4, opacity = 1 }: {
  cx: number; cy: number; r: number; gap: number; t: number; color: string; n?: number; opacity?: number;
}) {
  const outer = r + gap * (n - 1);
  const a = TAU * t - Math.PI / 2;
  return (
    <g opacity={opacity}>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={cx} cy={cy} r={r + gap * i} fill="none" stroke={color} strokeWidth={i === 0 ? 2 : 1.25} opacity={0.55 - i * 0.1} />
      ))}
      <g transform={`rotate(${360 * t} ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r={r + gap} fill="none" stroke={color} strokeWidth={3} strokeDasharray={`${(r + gap) * 0.9} ${(r + gap) * 5.4}`} strokeLinecap="round" />
      </g>
      <g transform={`rotate(${-360 * t} ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r={outer} fill="none" stroke={color} strokeWidth={2} strokeDasharray={`2 14`} opacity={0.6} />
      </g>
      <circle cx={cx + Math.cos(a) * (r + gap * 2)} cy={cy + Math.sin(a) * (r + gap * 2)} r={7} fill={color} />
    </g>
  );
}

/** A faint dot grid, the texture behind every scene. */
export function DotGrid({ w, h, step = 36, color = "rgba(15,27,36,0.09)" }: { w: number; h: number; step?: number; color?: string }) {
  /* Several films share a page, so the pattern id carries its colour too. */
  const id = `dz-grid-${step}-${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <>
      <defs>
        <pattern id={id} width={step} height={step} patternUnits="userSpaceOnUse">
          <circle cx={step / 2} cy={step / 2} r={1.6} fill={color} />
        </pattern>
      </defs>
      <rect width={w} height={h} fill={`url(#${id})`} />
    </>
  );
}

/** A soft band of light crossing the frame once per loop. Off-frame at both ends, so it loops cleanly. */
export function Sweep({ t, w, h }: { t: number; w: number; h: number }) {
  const x = -0.7 * w + t * 2.4 * w;
  return (
    <div style={{
      position: "absolute", top: -h * 0.2, left: x, width: w * 0.45, height: h * 1.4, transform: "rotate(18deg)",
      background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))", pointerEvents: "none",
    }} />
  );
}

/**
 * A boy's growth, birth to 18: an S-shaped curve over an age axis, with the
 * three age bands the kids section is organised by, and a marker that travels
 * the curve and back.
 */
export function GrowthCurve({ x, y, w, h, t, color, soft, ink, bands, font, bare }: {
  x: number; y: number; w: number; h: number; t: number; color: string; soft: string; ink: string;
  bands?: [string, string, string]; font?: string;
  /** No text: for small, static uses. */
  bare?: boolean;
}) {
  const f = (u: number) => 1 / (1 + Math.exp(-9 * (u - 0.62))) * 0.72 + u * 0.28; // growth: steady, then the pubertal spurt
  const pts = Array.from({ length: 61 }, (_, i) => { const u = i / 60; return [x + u * w, y + h - f(u) * h * 0.9] as const; });
  const line = pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`).join(" ");
  const area = `${line} L${x + w} ${y + h} L${x} ${y + h} Z`;
  const u = 0.06 + pingPong(t) * 0.88;
  const mx = x + u * w, my = y + h - f(u) * h * 0.9;
  const bandEdges = [0, 2.5 / 18, 9.5 / 18, 1];
  return (
    <g>
      {bandEdges.slice(0, 3).map((b, i) => (
        <rect key={i} x={x + b * w} y={y} width={(bandEdges[i + 1] - b) * w} height={h} fill={i === 1 ? soft : "transparent"} opacity={0.55} />
      ))}
      {[0.25, 0.5, 0.75].map((g) => <line key={g} x1={x} x2={x + w} y1={y + h * g} y2={y + h * g} stroke={ink} strokeOpacity={0.08} strokeWidth={1.5} />)}
      <path d={area} fill={color} opacity={0.1} />
      <path d={line} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
      <line x1={mx} x2={mx} y1={my} y2={y + h} stroke={color} strokeWidth={1.5} strokeDasharray="4 6" />
      <circle cx={mx} cy={my} r={20} fill={color} opacity={0.18} />
      <circle cx={mx} cy={my} r={10} fill="#FFFFFF" stroke={color} strokeWidth={5} />
      <line x1={x} x2={x + w} y1={y + h} y2={y + h} stroke={ink} strokeOpacity={0.35} strokeWidth={2} />
      {[0, 3, 6, 9, 12, 15, 18].map((a) => (
        <g key={a}>
          <line x1={x + (a / 18) * w} x2={x + (a / 18) * w} y1={y + h} y2={y + h + 12} stroke={ink} strokeOpacity={0.35} strokeWidth={2} />
          {!bare && <text x={x + (a / 18) * w} y={y + h + 44} textAnchor="middle" fontFamily={font} fontSize={26} fill={ink} opacity={0.55}>{a}</text>}
        </g>
      ))}
      {!bare && bands?.map((b, i) => (
        <text key={b} x={x + ((bandEdges[i] + bandEdges[i + 1]) / 2) * w} y={y - 18} textAnchor="middle" fontFamily={font} fontSize={28} fontWeight={600} fill={ink} opacity={0.7}>{b}</text>
      ))}
    </g>
  );
}

/** The real logo mark (circle, moustache, ♂ arrow). Still: the brand does not wiggle. */
export function LogoMark({ x, y, size }: { x: number; y: number; size: number }) {
  const w = size, h = size * (80 / 116);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h }}>
      <Img src={mark} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}

/** Dr. Osama, seated, with a slow breath of scale so the frame never feels frozen. */
export function Doctor({ x, bottom, height, t = 0 }: { x: number; bottom: number; height: number; t?: number }) {
  const w = height * (727 / 1489);
  const s = 1.01 + 0.012 * wave(t, 1);
  return (
    <div style={{ position: "absolute", left: x - w / 2, bottom, width: w, transform: `scale(${s})`, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", left: "10%", right: "10%", bottom: -4, height: height * 0.04, borderRadius: "50%", background: "rgba(15,27,36,0.18)", filter: "blur(16px)" }} />
      <Img src={seated} style={{ position: "relative", width: "100%", display: "block" }} />
    </div>
  );
}

/**
 * A caption block in HTML so Arabic shapes and flows correctly: a small
 * kicker with a rule, and a title. Anchored to the reading-start edge, or
 * centred on `center` (an x in the frame) for films shown in a circle.
 */
export function Caption({ bottom, inset = 88, center, kicker, title, ink, accent, font, rtl, card, size = 1, maxWidth = 760 }: {
  bottom: number; inset?: number; center?: number; kicker: string; title: string; ink: string; accent: string; font: string; rtl: boolean;
  card?: string; size?: number; maxWidth?: number;
}) {
  const place = center === undefined
    ? { [rtl ? "right" : "left"]: inset, maxWidth, textAlign: "start" as const }
    : { left: center - maxWidth / 2, width: maxWidth, textAlign: "center" as const };
  return (
    <div dir={rtl ? "rtl" : "ltr"} style={{
      position: "absolute", bottom, ...place, color: ink, fontFamily: font,
      ...(card ? { background: card, padding: `${30 * size}px ${38 * size}px`, borderRadius: 24 * size, boxShadow: "0 24px 60px rgba(15,27,36,0.12)" } : {}),
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: center === undefined ? "flex-start" : "center", gap: 16 * size, fontSize: 28 * size, fontWeight: 600, color: accent, letterSpacing: rtl ? 0 : "0.08em", textTransform: rtl ? "none" : "uppercase" }}>
        <span style={{ width: 44 * size, height: 3, background: accent, display: "inline-block" }} />
        {kicker}
      </div>
      <div style={{ fontSize: 62 * size, fontWeight: 600, lineHeight: rtl ? 1.35 : 1.12, marginTop: 14 * size }}>{title}</div>
    </div>
  );
}
