/**
 * Drawing pieces shared by every composition: bubbles, balloons, stars,
 * clouds, a paper plane, the logo mark and the doctor.
 *
 * All motion takes an explicit `t` in [0, 1) that the caller derives from the
 * frame. Every piece moves with an integer number of cycles per loop, so any
 * scene built from them loops without a seam.
 */

import { Img } from "remotion";
import mark from "@/brand/logo-mark.svg";
import seated from "@/media/dr-seated.webp";

export const TAU = Math.PI * 2;
export const wave = (t: number, cycles = 1, phase = 0) => Math.sin(TAU * (t * cycles + phase));

export function Bubble({ x, y, r, t, cycles = 1, phase = 0, fill = "rgba(255,255,255,0.55)", stroke = "rgba(255,255,255,0.9)" }: {
  x: number; y: number; r: number; t: number; cycles?: number; phase?: number; fill?: string; stroke?: string;
}) {
  const dy = wave(t, cycles, phase) * r * 0.25;
  const dx = wave(t, cycles, phase + 0.25) * r * 0.12;
  return (
    <g transform={`translate(${x + dx} ${y + dy})`}>
      <circle r={r} fill={fill} stroke={stroke} strokeWidth={Math.max(2, r * 0.04)} />
      <ellipse cx={-r * 0.35} cy={-r * 0.38} rx={r * 0.22} ry={r * 0.12} fill="rgba(255,255,255,0.85)" transform={`rotate(-35 ${-r * 0.35} ${-r * 0.38})`} />
    </g>
  );
}

/** Small bubbles rising through the frame, one full rise per cycle. */
export function RisingBubbles({ t, w, h, n = 14, color = "rgba(255,255,255,0.7)", seed = 1 }: {
  t: number; w: number; h: number; n?: number; color?: string; seed?: number;
}) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const k = (i * 97 + seed * 31) % 100 / 100;
        const r = 8 + ((i * 37 + seed * 13) % 26);
        const p = (t + k) % 1;
        const x = ((i * 173 + seed * 59) % 1000) / 1000 * w + wave(t, 2, k) * 18;
        const y = h + r - p * (h + r * 2);
        return <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={3} opacity={0.35 + 0.5 * Math.sin(Math.PI * p)} />;
      })}
    </g>
  );
}

export function Balloon({ x, y, s = 1, color, t, phase = 0 }: { x: number; y: number; s?: number; color: string; t: number; phase?: number }) {
  const bob = wave(t, 1, phase) * 14 * s;
  const sway = wave(t, 1, phase + 0.3) * 5;
  return (
    <g transform={`translate(${x} ${y + bob}) rotate(${sway}) scale(${s})`}>
      <path d="M0 70 C 10 110, -12 150, 4 200" fill="none" stroke="rgba(11,22,34,0.35)" strokeWidth={2.5} />
      <ellipse cx={0} cy={0} rx={52} ry={64} fill={color} />
      <path d="M-7 62 L 7 62 L 0 74 Z" fill={color} />
      <ellipse cx={-18} cy={-24} rx={12} ry={20} fill="rgba(255,255,255,0.55)" transform="rotate(-20 -18 -24)" />
    </g>
  );
}

export function Star({ x, y, r, color, t, phase = 0, spin = 0 }: { x: number; y: number; r: number; color: string; t: number; phase?: number; spin?: number }) {
  const s = 0.8 + 0.2 * (0.5 + 0.5 * wave(t, 2, phase));
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.48;
    return `${Math.cos(a) * rr},${Math.sin(a) * rr}`;
  }).join(" ");
  return <polygon points={pts} fill={color} transform={`translate(${x} ${y}) rotate(${spin * 360 * t}) scale(${s})`} strokeLinejoin="round" />;
}

export function Cloud({ x, y, s = 1, t, drift = 60, color = "#FFFFFF" }: { x: number; y: number; s?: number; t: number; drift?: number; color?: string }) {
  const dx = wave(t, 1) * drift;
  return (
    <g transform={`translate(${x + dx} ${y}) scale(${s})`} fill={color}>
      <ellipse cx={0} cy={20} rx={90} ry={34} />
      <circle cx={-34} cy={4} r={36} />
      <circle cx={20} cy={-8} r={46} />
      <circle cx={60} cy={14} r={30} />
    </g>
  );
}

export function PaperPlane({ x, y, s = 1, color = "#FFFFFF", rot = -18 }: { x: number; y: number; s?: number; color?: string; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 0 L 120 40 L 0 80 L 20 40 Z" fill={color} />
      <path d="M20 40 L 120 40 L 40 58 Z" fill="rgba(11,22,34,0.12)" />
    </g>
  );
}

/** The real logo mark (circle, moustache, ♂ arrow), with a friendly wiggle. */
export function LogoMark({ x, y, size, t, wiggle = 5, cycles = 2 }: { x: number; y: number; size: number; t: number; wiggle?: number; cycles?: number }) {
  const rot = wave(t, cycles) * wiggle;
  const w = size, h = size * (80 / 116);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg)` }}>
      <Img src={mark} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  );
}

export function Doctor({ x, bottom, height }: { x: number; bottom: number; height: number }) {
  const w = height * (727 / 1489);
  return (
    <div style={{ position: "absolute", left: x - w / 2, bottom, width: w }}>
      <div style={{ position: "absolute", left: "8%", right: "8%", bottom: -6, height: height * 0.05, borderRadius: "50%", background: "rgba(11,22,34,0.22)", filter: "blur(14px)" }} />
      <Img src={seated} style={{ position: "relative", width: "100%", display: "block" }} />
    </div>
  );
}

/** A soft label chip, drawn in HTML so Arabic shapes and flows correctly. */
export function Chip({ x, y, text, sub, bg, ink, font, rtl, size = 1 }: {
  x: number; y: number; text: string; sub?: string; bg: string; ink: string; font: string; rtl: boolean; size?: number;
}) {
  return (
    <div dir={rtl ? "rtl" : "ltr"} style={{
      position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", textAlign: "center",
      background: bg, color: ink, fontFamily: font, borderRadius: 999, padding: `${18 * size}px ${40 * size}px`,
      boxShadow: "0 18px 40px rgba(11,22,34,0.12)", whiteSpace: "nowrap",
    }}>
      <div style={{ fontSize: 54 * size, fontWeight: 800, lineHeight: 1.1 }}>{text}</div>
      {sub && <div style={{ fontSize: 26 * size, fontWeight: 500, opacity: 0.75, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
