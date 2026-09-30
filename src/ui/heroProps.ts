import { BRAND, WORLDS, type L } from "@/content";
import { useLang } from "@/lib/i18n";
import type { HeroProps } from "@/remotion/heroes";
import { useSite, type Skin } from "./site";

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
    },
    adults: skin.hero.adults, kids: skin.hero.kids, doctor: skin.hero.doctor,
    accentA: skin.hero.accentA, accentK: skin.hero.accentK,
  };
}

/** The same, for the direction you are in. */
export function useHeroProps(): HeroProps {
  const { t, dir } = useLang();
  const { skin } = useSite();
  return heroPropsFor(skin, t, dir === "rtl");
}
