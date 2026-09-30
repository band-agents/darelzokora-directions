/**
 * The motion vocabulary all three directions share. Each direction tunes the
 * numbers (distance, duration, stagger); the rules below hold for all of them.
 *
 * Three rules this codebase has already paid for (see the Elite and Al-Madinah
 * builds):
 *  1. Never gate content on an animation finishing. Nothing here uses
 *     AnimatePresence mode="wait", and nothing load-bearing waits on a tween.
 *  2. The in-view trigger sits on the heading, never on a masked word. A word
 *     translated below its own overflow:hidden box has zero visible area, so
 *     an observer on it never fires and the headline stays blank for good.
 *  3. Split words keep a real space text node between them. Spacing with
 *     padding alone reads fine but leaves "Men'shealth" for screen readers,
 *     copy-paste and crawlers.
 */

import {
  motion, useInView, useReducedMotion, animate, type Variants,
} from "framer-motion";
import { Player, type PlayerRef } from "@remotion/player";
import {
  Fragment, useEffect, useRef, useState, type ComponentType, type CSSProperties, type ReactNode,
} from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

/* ── Reveal ───────────────────────────────────────────────── */

export function Reveal({
  children, delay = 0, y = 28, className, as = "div", style,
}: {
  children: ReactNode; delay?: number; y?: number; className?: string;
  as?: "div" | "li" | "section" | "p" | "span"; style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  const M = motion[as];
  if (reduce) return <M className={className} style={style}>{children}</M>;
  return (
    <M
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

/** Staggered children. Put <RevealItem> inside. */
export function RevealGroup({
  children, className, each = 0.08, as = "div",
}: { children: ReactNode; className?: string; each?: number; as?: "div" | "ul" | "ol" }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: each } } }}
    >
      {children}
    </M>
  );
}

const itemV: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};

export function RevealItem({
  children, className, as = "div", style,
}: { children: ReactNode; className?: string; as?: "div" | "li" | "article"; style?: CSSProperties }) {
  const M = motion[as];
  return <M className={className} style={style} variants={itemV}>{children}</M>;
}

/* ── SplitText ────────────────────────────────────────────── */

/**
 * A heading whose words rise out of a mask. `onMount` plays it immediately
 * (heroes); otherwise it plays when the heading itself scrolls into view.
 * `accent` wraps the listed words in <em> so a direction can style them;
 * `accentWorlds` gives each of those words a world (data-w), in the same order.
 */
export function SplitText({
  text, as = "h2", className, delay = 0, onMount, accent = [], accentWorlds, accentFrom, each = 0.07, style,
}: {
  text: string; as?: "h1" | "h2" | "h3" | "p"; className?: string; delay?: number;
  onMount?: boolean; accent?: string[]; accentWorlds?: string[];
  /** Accent every word from this index on — for a heading whose second half is the other voice. */
  accentFrom?: number; each?: number; style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  const M = motion[as];
  const words = text.split(" ");
  const bare = (w: string) => w.replace(/[.,!?]$/, "");
  const marks = accent.map(bare);
  const isAccent = (w: string, i: number) => (accentFrom !== undefined && i >= accentFrom) || marks.includes(bare(w));
  const em = (w: string) => <em data-w={accentWorlds?.[marks.indexOf(bare(w))]}>{w}</em>;

  if (reduce) {
    return (
      <M className={className} style={style}>
        {words.map((w, i) => (
          <Fragment key={i}>{isAccent(w, i) ? em(w) : w}{i < words.length - 1 ? " " : ""}</Fragment>
        ))}
      </M>
    );
  }

  const trigger = onMount
    ? { initial: "hidden", animate: "show" }
    : { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.4 } };

  return (
    <M
      className={className}
      style={style}
      {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: each, delayChildren: delay } } }}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="u-mask">
            <motion.span
              className="u-word"
              variants={{
                hidden: { y: "108%" },
                show: { y: "0%", transition: { duration: 1, ease: EASE } },
              }}
            >
              {isAccent(w, i) ? em(w) : w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </M>
  );
}

/* ── RuleDraw ─────────────────────────────────────────────── */

/** A hairline that draws from the left when it enters the viewport. */
export function RuleDraw({ className, delay = 0, vertical }: { className?: string; delay?: number; vertical?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className={className}
      aria-hidden
      style={{ display: "block", transformOrigin: vertical ? "top" : "left" }}
      initial={reduce ? false : vertical ? { scaleY: 0 } : { scaleX: 0 }}
      whileInView={vertical ? { scaleY: 1 } : { scaleX: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1.3, ease: EASE, delay }}
    />
  );
}

/* ── CountUp ──────────────────────────────────────────────── */

export function CountUp({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, value, { duration: value > 100 ? 2.2 : 1.6, ease: EASE, onUpdate: (v) => setN(v) });
    return () => c.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className="u-tnum">
      {prefix}{Math.round(n).toLocaleString("en-US")}{suffix}
    </span>
  );
}

/* ── LivePlayer ───────────────────────────────────────────── */

/**
 * A Remotion composition running live in the page.
 *
 * Plays only while on screen, so four players on one page cost nothing while
 * scrolled away. Under reduced motion it never plays and parks on
 * `still`, a frame chosen to read as a finished picture.
 */
export function LivePlayer<P extends Record<string, unknown>>({
  component, width, height, frames, fps = 30, still = 0, inputProps, className, style, label,
}: {
  component: ComponentType<P>; width: number; height: number; frames: number; fps?: number;
  still?: number; inputProps?: P; className?: string; style?: CSSProperties; label: string;
}) {
  const ref = useRef<PlayerRef>(null);
  const box = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = box.current;
    const p = ref.current;
    if (!el || !p) return;
    if (reduce) { p.pause(); p.seekTo(still); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) p.play(); else p.pause();
    }, { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduce, still]);

  return (
    /* dir="ltr": inside an Arabic page the Player positions its scaled canvas from the
       wrong edge and shows only a sliver. The films set their own text direction. */
    <div ref={box} className={className} style={style} role="img" aria-label={label} dir="ltr">
      <Player
        ref={ref}
        component={component as ComponentType<Record<string, unknown>>}
        inputProps={(inputProps ?? {}) as Record<string, unknown>}
        durationInFrames={frames}
        fps={fps}
        compositionWidth={width}
        compositionHeight={height}
        initialFrame={reduce ? still : 0}
        loop
        autoPlay={!reduce}
        initiallyMuted
        controls={false}
        clickToPlay={false}
        doubleClickToFullscreen={false}
        spaceKeyToPlayOrPause={false}
        acknowledgeRemotionLicense
        style={{ width: "100%", height: "auto", aspectRatio: `${width} / ${height}`, display: "block" }}
      />
    </div>
  );
}
