/**
 * What every shared component needs to know about where it is: which
 * direction, which page, which world, and how to link to another page.
 */

import { createContext, useContext } from "react";
import {
  Activity, Award, Baby, Circle, Cpu, Droplets, FlaskConical, HeartPulse, Lock, Microscope, Moon, RefreshCw,
  Shapes, ShieldCheck, Siren, Sparkles, Spline, Sprout, Timer, type LucideIcon,
} from "lucide-react";
import type { World } from "@/content";
import { pageHash, type DirId, type Page } from "@/lib/routes";

export interface Skin {
  /** Display face, passed into the Remotion compositions. */
  displayFont: string;
  ink: string;
  hero: { adults: [string, string]; kids: [string, string]; doctor: [string, string]; accentA: string; accentK: string; card?: string; round?: boolean };
  worldArt: { adults: [string, string]; kids: [string, string]; accentA: string; accentK: string };
}

export interface SiteCtx { dir: DirId; page: Page; world?: World; skin: Skin; to: (p: Page) => string }
const Ctx = createContext<SiteCtx | null>(null);
export const SiteProvider = Ctx.Provider;
export function useSite() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSite outside SiteProvider");
  return c;
}
export const makeTo = (dir: DirId) => (p: Page) => pageHash(dir, p);

export const ICONS: Record<string, LucideIcon> = {
  Activity, Award, Baby, Circle, Cpu, Droplets, FlaskConical, HeartPulse, Lock, Microscope, Moon, RefreshCw,
  Shapes, ShieldCheck, Siren, Sparkles, Spline, Sprout, Timer,
};

/**
 * The two world glyphs, drawn as line icons to match lucide: the male symbol
 * from the logo for adults, a child for the children's section.
 */
export function WorldGlyph({ world, size = 22 }: { world: World; size?: number }) {
  if (world === "kids") return <Baby size={size} strokeWidth={1.75} aria-hidden />;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="14" r="6" />
      <path d="M14.5 9.5 20 4M15 4h5v5" />
    </svg>
  );
}
