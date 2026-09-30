import { AGES, BRAND, WORLDS, type L } from "@/content";
import { useLang } from "@/lib/i18n";
import type { HeroProps } from "@/remotion/heroes";
import { useSite, type Skin } from "./site";

/** The age bands, as the growth curve labels them. */
export const bandsFor = (t: (x: L) => string) => AGES.map((a) => t(a.label)) as [string, string, string];

/** The hero films take their words and colours from the language and the skin. */
export function heroPropsFor(skin: Skin, t: (x: L) => string, rtl: boolean): HeroProps {
  return {
    rtl,
    font: skin.displayFont,
    ink: skin.ink,
    labels: {
      adults: t(WORLDS.adults.label), adultsSub: t(WORLDS.adults.tagline),
      kids: t(WORLDS.kids.label), kidsSub: t(WORLDS.kids.tagline),
      doctor: t(BRAND.doctor), doctorSub: t({ ar: "منذ 2003 · أكثر من 100,000 حالة", en: "Since 2003 · 100,000+ patients" }),
      bands: bandsFor(t),
    },
    adults: skin.hero.adults, kids: skin.hero.kids, doctor: skin.hero.doctor,
    accentA: skin.hero.accentA, accentK: skin.hero.accentK, card: skin.hero.card, round: skin.hero.round,
  };
}

/** The same, for the direction you are in. */
export function useHeroProps(): HeroProps {
  const { t, dir } = useLang();
  const { skin } = useSite();
  return heroPropsFor(skin, t, dir === "rtl");
}
