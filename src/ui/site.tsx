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
  hero: { adults: [string, string]; kids: [string, string]; doctor: [string, string]; accentA: string; accentK: string };
  worldArt: { adults: [string, string]; kids: [string, string]; accentA: string; accentK: string; outline: boolean };
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

/** The two world glyphs: the brand's moustache for adults, a balloon for kids. */
export function WorldGlyph({ world, size = 22 }: { world: World; size?: number }) {
  if (world === "adults") {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden fill="currentColor">
        <path d="M24 22c-3-5-10-7-15-3-3 2-5 6-8 5 2 5 8 8 14 6 4-1 7-4 9-5 2 1 5 4 9 5 6 2 12-1 14-6-3 1-5-3-8-5-5-4-12-2-15 3z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden fill="currentColor">
      <ellipse cx="24" cy="18" rx="12" ry="14" />
      <path d="M22 32h4l-2 3z" />
      <path d="M24 35c2 4-2 6 0 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
