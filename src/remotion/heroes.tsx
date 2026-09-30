/**
 * The three hero films, one per direction, and the world art used on the
 * Adults and Children hubs. All run live in @remotion/player.
 *
 * Each hero is a TransitionSeries of calm scenes: the adults section
 * (precision rings around the logo mark), the children's section (a growth
 * curve from birth to 18), Dr. Osama, and back. The last scene is
 * phase-shifted so its final frame matches the first frame of the first
 * scene, which is what lets the Player loop without a visible cut. Every
 * scene's motion has a period of P frames.
 *
 *   A · Clarity    cross-fades
 *   B · Prestige   wipes, like turning a page, from the two-halves scene
 *   C · Precision  slides, the way an app moves between cards
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { Caption, Doctor, DotGrid, GrowthCurve, LogoMark, Rings, Sweep } from "./art";

export const HERO = { width: 1080, height: 1080, fps: 30 } as const;
const P = 100; // every scene's motion repeats every 100 frames

export interface HeroProps extends Record<string, unknown> {
  rtl: boolean;
  font: string;
  ink: string;
  labels: {
    adults: string; adultsSub: string; kids: string; kidsSub: string; doctor: string; doctorSub: string;
    bands: [string, string, string];
  };
  adults: [string, string];
  kids: [string, string];
  doctor: [string, string];
  accentA: string;
  accentK: string;
  /** Caption card colour; none draws the caption straight on the scene. */
  card?: string;
  /** The film is shown in a circle: centre the captions and keep them off the edge. */
  round?: boolean;
}

/* Scene lengths and the phase that closes the loop. */
const SCENE = 120, TRANS = 30, LAST = 60;
const LAST_PHASE = (P - (LAST % P)) % P;
export const HERO_FRAMES = SCENE * 3 + LAST - TRANS * 3;

function useT(phase = 0) {
  const f = useCurrentFrame();
  return ((f + phase) % P) / P;
}

const W = HERO.width, H = HERO.height;
const grid = "rgba(15,27,36,0.08)";

/** Where a scene's caption sits: bottom-start, or centred and higher when the film is round. */
const capAt = (p: HeroProps) => (p.round ? { bottom: 170, center: W / 2, maxWidth: 680, size: 0.9 } : { bottom: 92 });

/* ── Scenes ───────────────────────────────────────────────── */

function AdultsScene({ p, phase = 0 }: { p: HeroProps; phase?: number }) {
  const t = useT(phase);
  const cy = 400;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${p.adults[0]}, ${p.adults[1]})`, overflow: "hidden" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <DotGrid w={W} h={H} color={grid} />
        <Rings cx={W / 2} cy={cy} r={170} gap={56} t={t} color={p.accentA} />
        <circle cx={W / 2} cy={cy} r={138} fill="#FFFFFF" />
      </svg>
      <LogoMark x={W / 2} y={cy} size={230} />
      <Sweep t={t} w={W} h={H} />
      <Caption {...capAt(p)} kicker={p.labels.adults} title={p.labels.adultsSub} ink={p.ink} accent={p.accentA} font={p.font} rtl={p.rtl} card={p.card} />
    </AbsoluteFill>
  );
}

function KidsScene({ p, phase = 0 }: { p: HeroProps; phase?: number }) {
  const t = useT(phase);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${p.kids[0]}, ${p.kids[1]})`, overflow: "hidden" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <DotGrid w={W} h={H} color={grid} />
        <GrowthCurve x={110} y={200} w={860} h={420} t={t} color={p.accentK} soft="#FFFFFF" ink={p.ink} bands={p.labels.bands} font={p.font} />
      </svg>
      <Sweep t={t} w={W} h={H} />
      <Caption {...capAt(p)} kicker={p.labels.kids} title={p.labels.kidsSub} ink={p.ink} accent={p.accentK} font={p.font} rtl={p.rtl} card={p.card} />
    </AbsoluteFill>
  );
}

function DoctorScene({ p, phase = 0 }: { p: HeroProps; phase?: number }) {
  const t = useT(phase);
  /* The doctor stands on the reading-end side; his caption on the reading-start side. */
  const x = p.rtl ? W * 0.34 : W * 0.66;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(85% 75% at ${p.rtl ? 30 : 70}% 40%, ${p.doctor[0]}, ${p.doctor[1]})`, overflow: "hidden" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <DotGrid w={W} h={H} color={grid} />
        <Rings cx={x} cy={470} r={250} gap={72} n={3} t={t} color={p.accentA} opacity={0.55} />
      </svg>
      <Doctor x={x} bottom={0} height={920} t={t} />
      <Caption bottom={110} inset={70} kicker={p.labels.doctorSub} title={p.labels.doctor} ink={p.ink} accent={p.accentA} font={p.font} rtl={p.rtl}
        card={p.card ?? "rgba(255,255,255,0.92)"} size={0.82} maxWidth={500} />
    </AbsoluteFill>
  );
}

/** Both sections side by side, adults on the reading-start side. */
function SplitScene({ p, phase = 0 }: { p: HeroProps; phase?: number }) {
  const t = useT(phase);
  const half = W / 2;
  const side = (w: "adults" | "kids") => ((w === "adults") === p.rtl ? half : 0);
  const a = side("adults"), k = side("kids");
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: a, width: half, background: `linear-gradient(180deg, ${p.adults[0]}, ${p.adults[1]})` }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: k, width: half, background: `linear-gradient(180deg, ${p.kids[0]}, ${p.kids[1]})` }} />
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <DotGrid w={W} h={H} color={grid} />
        <Rings cx={a + half / 2} cy={420} r={110} gap={40} n={3} t={t} color={p.accentA} />
        <circle cx={a + half / 2} cy={420} r={92} fill="#FFFFFF" />
        <GrowthCurve x={k + 100} y={330} w={half - 170} h={230} t={t} color={p.accentK} soft="rgba(255,255,255,0.6)" ink={p.ink} bands={p.labels.bands} font={p.font} />
        <line x1={half} x2={half} y1={0} y2={H} stroke={p.ink} strokeOpacity={0.18} strokeWidth={2} />
      </svg>
      <LogoMark x={a + half / 2} y={420} size={150} />
      {(["adults", "kids"] as const).map((w) => (
        <Caption key={w} bottom={250} center={(w === "adults" ? a : k) + half / 2}
          kicker={w === "adults" ? p.labels.adults : p.labels.kids}
          title={w === "adults" ? p.labels.adultsSub : p.labels.kidsSub} ink={p.ink} accent={w === "adults" ? p.accentA : p.accentK}
          font={p.font} rtl={p.rtl} size={0.6} maxWidth={380} />
      ))}
    </AbsoluteFill>
  );
}

/* ── A · Clarity ──────────────────────────────────────────── */

export function ClarityHero(p: HeroProps) {
  const t = linearTiming({ durationInFrames: TRANS });
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENE}><AdultsScene p={p} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={t} />
      <TransitionSeries.Sequence durationInFrames={SCENE}><KidsScene p={p} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={t} />
      <TransitionSeries.Sequence durationInFrames={SCENE}><DoctorScene p={p} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={t} />
      <TransitionSeries.Sequence durationInFrames={LAST}><AdultsScene p={p} phase={LAST_PHASE} /></TransitionSeries.Sequence>
    </TransitionSeries>
  );
}

/* ── B · Prestige ─────────────────────────────────────────── */

export function PrestigeHero(p: HeroProps) {
  const t = linearTiming({ durationInFrames: TRANS });
  const forward = wipe({ direction: p.rtl ? "from-right" : "from-left" });
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENE}><SplitScene p={p} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={forward} timing={t} />
      <TransitionSeries.Sequence durationInFrames={SCENE}><AdultsScene p={p} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={forward} timing={t} />
      <TransitionSeries.Sequence durationInFrames={SCENE}><KidsScene p={p} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={forward} timing={t} />
      <TransitionSeries.Sequence durationInFrames={LAST}><SplitScene p={p} phase={LAST_PHASE} /></TransitionSeries.Sequence>
    </TransitionSeries>
  );
}

/* ── C · Precision ────────────────────────────────────────── */

export function PrecisionHero(p: HeroProps) {
  const t = springTiming({ durationInFrames: TRANS, config: { damping: 200 } });
  const next = slide({ direction: p.rtl ? "from-left" : "from-right" });
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENE}><AdultsScene p={p} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={next} timing={t} />
      <TransitionSeries.Sequence durationInFrames={SCENE}><KidsScene p={p} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={next} timing={t} />
      <TransitionSeries.Sequence durationInFrames={SCENE}><DoctorScene p={p} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={next} timing={t} />
      <TransitionSeries.Sequence durationInFrames={LAST}><AdultsScene p={p} phase={LAST_PHASE} /></TransitionSeries.Sequence>
    </TransitionSeries>
  );
}

/* ── World art for the Adults and Children hubs ───────────── */

export const WORLD_ART = { width: 1000, height: 820, frames: P * 2 } as const;

export interface WorldArtProps extends Record<string, unknown> {
  world: "adults" | "kids";
  bg: [string, string];
  accent: string;
  ink: string;
  font: string;
  bands: [string, string, string];
}

export function WorldArt(p: WorldArtProps) {
  const f = useCurrentFrame();
  const t = (f % WORLD_ART.frames) / WORLD_ART.frames;
  const w = WORLD_ART.width, h = WORLD_ART.height;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${p.bg[0]}, ${p.bg[1]})`, overflow: "hidden" }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <DotGrid w={w} h={h} color={grid} />
        {p.world === "adults" ? (
          <>
            <Rings cx={w / 2} cy={h / 2} r={150} gap={56} t={t} color={p.accent} />
            <circle cx={w / 2} cy={h / 2} r={124} fill="#FFFFFF" />
          </>
        ) : (
          <GrowthCurve x={90} y={170} w={820} h={470} t={t} color={p.accent} soft="#FFFFFF" ink={p.ink} bands={p.bands} font={p.font} />
        )}
      </svg>
      {p.world === "adults" && <LogoMark x={w / 2} y={h / 2} size={206} />}
      <Sweep t={t} w={w} h={h} />
    </AbsoluteFill>
  );
}
