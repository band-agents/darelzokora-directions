/**
 * The three hero films, one per direction, and the world art used on the
 * Adults and Kids hubs. All run live in @remotion/player.
 *
 * Each hero is a TransitionSeries of scenes: adults, kids, the doctor, then
 * adults again. The last scene is phase-shifted so its final frame matches the
 * first frame of the first scene, which is what lets the Player loop without
 * a visible cut. Every scene's motion has a period of P frames.
 *
 *   A · Bubble   iris and slide transitions: bubbles opening onto each world
 *   B · Split    wipe and clock-wipe: the frame splits between two worlds
 *   C · Sticker  flip transitions: stickers turning over
 */

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { iris } from "@remotion/transitions/iris";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { flip } from "@remotion/transitions/flip";
import { Balloon, Bubble, Chip, Cloud, Doctor, LogoMark, PaperPlane, RisingBubbles, Star, wave } from "./art";

export const HERO = { width: 1080, height: 1080, fps: 30 } as const;
const P = 100; // every scene's motion repeats every 100 frames

export interface HeroProps extends Record<string, unknown> {
  rtl: boolean;
  font: string;
  ink: string;
  labels: { adults: string; adultsSub: string; kids: string; kidsSub: string; doctor: string; doctorSub: string };
  adults: [string, string];
  kids: [string, string];
  doctor: [string, string];
  accentA: string;
  accentK: string;
}

/* Scene lengths and the phase that closes the loop. */
const SCENE = 120, TRANS = 24, LAST = 60;
const LAST_PHASE = (P - (LAST % P)) % P;
export const HERO_FRAMES = SCENE * 3 + LAST - TRANS * 3;

function useT(phase = 0) {
  const f = useCurrentFrame();
  return ((f + phase) % P) / P;
}

/* ── Shared scenes, styled by props ───────────────────────── */

function AdultsScene({ p, phase = 0, style }: { p: HeroProps; phase?: number; style: "bubble" | "split" | "sticker" }) {
  const t = useT(phase);
  const W = HERO.width, H = HERO.height;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(90% 80% at 50% 35%, ${p.adults[0]}, ${p.adults[1]})` }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <RisingBubbles t={t} w={W} h={H} n={style === "sticker" ? 8 : 16} color="rgba(255,255,255,0.8)" seed={2} />
        {style !== "sticker" && <>
          <Bubble x={200} y={260} r={70} t={t} phase={0.1} />
          <Bubble x={880} y={220} r={46} t={t} phase={0.5} />
          <Bubble x={860} y={760} r={90} t={t} phase={0.3} />
        </>}
        {style === "sticker" && <>
          <Star x={180} y={220} r={44} color={p.accentA} t={t} spin={1} />
          <Star x={900} y={820} r={34} color="#FFFFFF" t={t} phase={0.4} spin={-1} />
        </>}
        <circle cx={W / 2} cy={H / 2 - 40} r={290} fill="rgba(255,255,255,0.6)" stroke="#FFFFFF" strokeWidth={style === "sticker" ? 22 : 6} />
      </svg>
      <LogoMark x={W / 2} y={H / 2 - 40} size={430} t={t} wiggle={style === "sticker" ? 9 : 5} />
      <Chip x={W / 2} y={H - 170} text={p.labels.adults} sub={p.labels.adultsSub} bg="#FFFFFF" ink={p.ink} font={p.font} rtl={p.rtl} />
    </AbsoluteFill>
  );
}

function KidsScene({ p, phase = 0, style }: { p: HeroProps; phase?: number; style: "bubble" | "split" | "sticker" }) {
  const t = useT(phase);
  const W = HERO.width, H = HERO.height;
  const colors = ["#FFB3A7", "#FFE07A", "#B9A7FF", "#8FD8C8"];
  return (
    <AbsoluteFill style={{ background: `linear-gradient(170deg, ${p.kids[0]}, ${p.kids[1]})` }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <Cloud x={230} y={190} s={1.1} t={t} />
        <Cloud x={820} y={330} s={0.8} t={t} drift={-50} />
        <Star x={150} y={520} r={30} color="#FFFFFF" t={t} phase={0.2} />
        <Star x={930} y={560} r={40} color={p.accentK} t={t} phase={0.6} spin={style === "sticker" ? 1 : 0} />
        <Star x={560} y={140} r={24} color="#FFFFFF" t={t} phase={0.8} />
        <Balloon x={330} y={470} s={1.25} color={colors[0]} t={t} />
        <Balloon x={540} y={400} s={1.5} color={colors[1]} t={t} phase={0.33} />
        <Balloon x={760} y={480} s={1.2} color={colors[2]} t={t} phase={0.66} />
        <PaperPlane x={100 + ((t * 1180) % 1300) - 150} y={760 - wave(t, 1) * 40} s={0.9} rot={-12} />
      </svg>
      <Chip x={W / 2} y={H - 170} text={p.labels.kids} sub={p.labels.kidsSub} bg="#FFFFFF" ink={p.ink} font={p.font} rtl={p.rtl} />
    </AbsoluteFill>
  );
}

function DoctorScene({ p, phase = 0 }: { p: HeroProps; phase?: number }) {
  const t = useT(phase);
  const W = HERO.width, H = HERO.height;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(80% 70% at 50% 40%, ${p.doctor[0]}, ${p.doctor[1]})` }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <circle cx={W / 2} cy={H / 2 - 10} r={400} fill="rgba(255,255,255,0.55)" />
        <Bubble x={170} y={300} r={60} t={t} phase={0.2} />
        <Bubble x={920} y={260} r={40} t={t} phase={0.7} />
      </svg>
      <Doctor x={W / 2} bottom={200} height={760} />
      <Chip x={W / 2} y={H - 130} text={p.labels.doctor} sub={p.labels.doctorSub} bg="#FFFFFF" ink={p.ink} font={p.font} rtl={p.rtl} size={0.85} />
    </AbsoluteFill>
  );
}

/* ── A · Bubble ───────────────────────────────────────────── */

export function BubbleHero(p: HeroProps) {
  const t = linearTiming({ durationInFrames: TRANS });
  const ir = iris({ width: HERO.width, height: HERO.height });
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENE}><AdultsScene p={p} style="bubble" /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={ir} timing={t} />
      <TransitionSeries.Sequence durationInFrames={SCENE}><KidsScene p={p} style="bubble" /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: p.rtl ? "from-left" : "from-right" })} timing={springTiming({ durationInFrames: TRANS, config: { damping: 200 } })} />
      <TransitionSeries.Sequence durationInFrames={SCENE}><DoctorScene p={p} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={ir} timing={t} />
      <TransitionSeries.Sequence durationInFrames={LAST}><AdultsScene p={p} style="bubble" phase={LAST_PHASE} /></TransitionSeries.Sequence>
    </TransitionSeries>
  );
}

/* ── B · Split ────────────────────────────────────────────── */

/** Both worlds side by side, divided down the middle. */
function SplitScene({ p, phase = 0 }: { p: HeroProps; phase?: number }) {
  const t = useT(phase);
  const W = HERO.width, H = HERO.height;
  const half = W / 2;
  /* Adults take the reading-start side: right in Arabic, left in English. */
  const side = (w: "adults" | "kids") => ((w === "adults") === p.rtl ? half : 0);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: side("adults"), width: half, background: `linear-gradient(180deg, ${p.adults[0]}, ${p.adults[1]})` }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: side("kids"), width: half, background: `linear-gradient(180deg, ${p.kids[0]}, ${p.kids[1]})` }} />
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${side("adults")} 0)`}>
          <RisingBubbles t={t} w={half} h={H} n={8} seed={4} />
          <circle cx={half / 2} cy={H / 2 - 60} r={170} fill="rgba(255,255,255,0.65)" />
        </g>
        <g transform={`translate(${side("kids")} 0)`}>
          <Cloud x={half / 2 - 40} y={200} s={0.7} t={t} drift={30} />
          <Balloon x={half / 2 - 60} y={H / 2 - 80} s={1.1} color="#FFB3A7" t={t} />
          <Balloon x={half / 2 + 80} y={H / 2 - 120} s={0.9} color="#FFE07A" t={t} phase={0.5} />
          <Star x={half / 2 + 150} y={H / 2 + 110} r={28} color={p.accentK} t={t} />
        </g>
        <line x1={half} x2={half} y1={0} y2={H} stroke="#FFFFFF" strokeWidth={8} />
      </svg>
      <LogoMark x={side("adults") + half / 2} y={H / 2 - 60} size={250} t={t} />
      <Chip x={side("adults") + half / 2} y={H - 180} text={p.labels.adults} bg="#FFFFFF" ink={p.ink} font={p.font} rtl={p.rtl} size={0.8} />
      <Chip x={side("kids") + half / 2} y={H - 180} text={p.labels.kids} bg="#FFFFFF" ink={p.ink} font={p.font} rtl={p.rtl} size={0.8} />
    </AbsoluteFill>
  );
}

export function SplitHero(p: HeroProps) {
  const t = linearTiming({ durationInFrames: TRANS });
  const into = p.rtl ? "from-right" : "from-left";
  const out = p.rtl ? "from-left" : "from-right";
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENE}><SplitScene p={p} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: into })} timing={t} />
      <TransitionSeries.Sequence durationInFrames={SCENE}><AdultsScene p={p} style="split" /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={clockWipe({ width: HERO.width, height: HERO.height })} timing={t} />
      <TransitionSeries.Sequence durationInFrames={SCENE}><KidsScene p={p} style="split" /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: out })} timing={t} />
      <TransitionSeries.Sequence durationInFrames={LAST}><SplitScene p={p} phase={LAST_PHASE} /></TransitionSeries.Sequence>
    </TransitionSeries>
  );
}

/* ── C · Sticker ──────────────────────────────────────────── */

export function StickerHero(p: HeroProps) {
  const t = springTiming({ durationInFrames: TRANS + 6, config: { damping: 14 } });
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={SCENE}><AdultsScene p={p} style="sticker" /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={flip({ direction: "from-right" })} timing={t} />
      <TransitionSeries.Sequence durationInFrames={SCENE}><KidsScene p={p} style="sticker" /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={flip({ direction: "from-bottom" })} timing={t} />
      <TransitionSeries.Sequence durationInFrames={SCENE}><DoctorScene p={p} /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={flip({ direction: "from-left" })} timing={t} />
      <TransitionSeries.Sequence durationInFrames={LAST}><AdultsScene p={p} style="sticker" phase={LAST_PHASE} /></TransitionSeries.Sequence>
    </TransitionSeries>
  );
}
export const STICKER_FRAMES = SCENE * 3 + LAST - (TRANS + 6) * 3;

/* ── World art for the Adults and Kids hubs ───────────────── */

export const WORLD_ART = { width: 1000, height: 820, frames: P * 2 } as const;

export interface WorldArtProps extends Record<string, unknown> {
  world: "adults" | "kids";
  bg: [string, string];
  accent: string;
  outline: boolean; // sticker direction draws hard outlines
}

export function WorldArt(p: WorldArtProps) {
  const f = useCurrentFrame();
  const t = (f % WORLD_ART.frames) / WORLD_ART.frames;
  const W = WORLD_ART.width, H = WORLD_ART.height;
  const stroke = p.outline ? "#1B1530" : "none";
  if (p.world === "adults") {
    return (
      <AbsoluteFill style={{ background: `radial-gradient(80% 80% at 60% 40%, ${p.bg[0]}, ${p.bg[1]})`, borderRadius: 0 }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <RisingBubbles t={t} w={W} h={H} n={18} seed={7} />
          <Bubble x={170} y={220} r={80} t={t} cycles={2} />
          <Bubble x={840} y={620} r={110} t={t} cycles={2} phase={0.4} />
          <circle cx={W / 2} cy={H / 2} r={230} fill="rgba(255,255,255,0.7)" stroke={p.outline ? stroke : "#FFFFFF"} strokeWidth={p.outline ? 10 : 6} />
        </svg>
        <LogoMark x={W / 2} y={H / 2} size={360} t={t} cycles={4} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: `linear-gradient(165deg, ${p.bg[0]}, ${p.bg[1]})` }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <Cloud x={220} y={170} t={t} />
        <Cloud x={780} y={280} s={0.75} t={t} drift={-40} />
        <Star x={120} y={430} r={30} color="#FFFFFF" t={t} />
        <Star x={880} y={140} r={36} color={p.accent} t={t} phase={0.5} spin={1} />
        <Star x={640} y={690} r={26} color="#FFFFFF" t={t} phase={0.25} />
        <Balloon x={330} y={430} s={1.3} color="#FFB3A7" t={t} />
        <Balloon x={520} y={360} s={1.6} color="#FFE07A" t={t} phase={0.33} />
        <Balloon x={720} y={450} s={1.25} color="#B9A7FF" t={t} phase={0.66} />
        {p.outline && <rect x={20} y={20} width={W - 40} height={H - 40} rx={40} fill="none" stroke={stroke} strokeWidth={8} />}
      </svg>
    </AbsoluteFill>
  );
}
