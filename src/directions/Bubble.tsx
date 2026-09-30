/**
 * Direction A — BUBBLE. Soft, rounded, weightless.
 *
 * Pastel washes that drift, everything rounded, a hero film that opens from
 * bubble to bubble with Remotion's iris transition. Mint and aqua for adults,
 * peach and butter for kids; the brand teal holds both together. Baloo
 * Bhaijaan 2 (rounded, Arabic and Latin) for display, Readex Pro for text.
 */

import { CalendarCheck, Phone } from "lucide-react";
import { BRAND, HOME, UI, WORLDS, type World } from "@/content";
import { useLang } from "@/lib/i18n";
import { LivePlayer, Reveal, SplitText } from "@/lib/motion";
import type { Page } from "@/lib/routes";
import { BubbleHero, HERO, HERO_FRAMES } from "@/remotion/heroes";
import { DoorArt, Shell } from "@/ui/Shell";
import { WorldArtPlayer } from "@/ui/pages";
import {
  AbroadBand, AgeRuler, ArticleList, BookBand, Branches, ConcernPicker, DoctorBlock, EmergencyBanner, FAQList,
  Journey, Promises, Reviews, SectionHead, ServiceGrid, Stats, WorldDoors,
} from "@/ui/sections";
import { useSite, WorldGlyph, type Skin } from "@/ui/site";
import { useHeroProps } from "@/ui/heroProps";
import "./bubble.css";

export const SKIN: Skin = {
  displayFont: "'Baloo Bhaijaan 2', sans-serif",
  ink: "#0B1622",
  hero: { adults: ["#E4F8F4", "#A9E3E0"], kids: ["#FFE8DA", "#FFD7B8"], doctor: ["#EDE7FF", "#CFE3FF"], accentA: "#0A857F", accentK: "#F28B6F" },
  worldArt: { adults: ["#E8FAF6", "#B6E8E4"], kids: ["#FFF1C9", "#FFD9C4"], accentA: "#0A857F", accentK: "#F28B6F", outline: false },
};

export function Bubble({ page }: { page: Page }) {
  return <Shell dir="bubble" page={page} className="bu" skin={SKIN} Home={Home} World={WorldHub} />;
}

function Home() {
  const { t, lang } = useLang();
  const { to } = useSite();
  const hp = useHeroProps();
  return (
    <>
      <section className="bu-hero">
        <div className="bu-blobs" aria-hidden><i /><i /><i /></div>
        <div className="z-wrap bu-hero-grid">
          <div className="bu-hero-copy">
            <Reveal y={10}><p className="z-kicker">{t(HOME.kicker)}</p></Reveal>
            <SplitText as="h1" onMount delay={0.1} text={t(HOME.title)} accent={HOME.accent[lang]} accentWorlds={HOME.accentWorlds} className="z-h1" />
            <Reveal delay={0.35} y={12}><p className="z-lead">{t(HOME.lead)}</p></Reveal>
            <Reveal delay={0.45} y={12} className="bu-hero-cta">
              {(["adults", "kids"] as World[]).map((w) => (
                <a key={w} data-w={w} className="z-btn z-btn-primary z-btn-lg" href={to({ name: "world", world: w })}>
                  <WorldGlyph world={w} size={22} />{t(WORLDS[w].label)}
                </a>
              ))}
              <a className="z-call bu-hero-call" href={`tel:${BRAND.hotline}`}><Phone size={18} /><span className="u-tnum">{BRAND.hotline}</span></a>
            </Reveal>
          </div>
          <Reveal delay={0.2} y={0} className="bu-orb">
            <LivePlayer component={BubbleHero} inputProps={hp} width={HERO.width} height={HERO.height} frames={HERO_FRAMES} still={40}
              label={t({ ar: "مشاهد متحركة: قسم الكبار، قسم الأطفال، ود. أسامة غطاس", en: "Animated scenes: the adults section, the kids section, and Dr. Osama Ghattas" })} />
          </Reveal>
        </div>
      </section>

      <section className="z-sec">
        <div className="z-wrap">
          <SectionHead title={t(HOME.worldsTitle)} lead={t(HOME.worldsLead)} center />
          <WorldDoors art={{ adults: <DoorArt world="adults" />, kids: <DoorArt world="kids" /> }} />
        </div>
      </section>

      <section className="z-sec z-sec-tight"><div className="z-wrap"><EmergencyBanner /></div></section>
      <section className="z-sec bu-soft"><div className="z-wrap"><SectionHead title={t(UI.stats)} center /><Stats /></div></section>
      <section className="z-sec"><div className="z-wrap"><DoctorBlock /></div></section>
      <section className="z-sec bu-soft"><div className="z-wrap"><SectionHead title={t(UI.why)} center /><Promises /></div></section>
      <section className="z-sec"><div className="z-wrap"><SectionHead title={t(UI.reviews)} /><Reviews /></div></section>
      <section className="z-sec"><div className="z-wrap"><SectionHead title={t(UI.branches)} /><Branches /></div></section>
      <section className="z-sec z-sec-tight"><div className="z-wrap"><BookBand /></div></section>
    </>
  );
}

function WorldHub({ world }: { world: World }) {
  const { t } = useLang();
  const { to } = useSite();
  const W = WORLDS[world];
  return (
    <>
      <section className="bu-whero" data-w={world}>
        <div className="bu-blobs" aria-hidden><i /><i /><i /></div>
        <div className="z-wrap bu-hero-grid">
          <div className="bu-hero-copy">
            <Reveal y={10}><p className="z-kicker"><WorldGlyph world={world} size={18} /> {t(W.label)} · {t(W.tagline)}</p></Reveal>
            <SplitText as="h1" onMount delay={0.1} text={t(W.title)} className="z-h1" />
            <Reveal delay={0.3} y={12}><p className="z-lead">{t(W.intro)}</p></Reveal>
            <Reveal delay={0.4} y={12} className="bu-hero-cta">
              <a className="z-btn z-btn-primary z-btn-lg" href={to({ name: "book", world })}><CalendarCheck size={19} />{t(W.cta)}</a>
              <a className="z-btn z-btn-ghost z-btn-lg" href={`tel:${BRAND.hotline}`}><Phone size={18} /><span className="u-tnum">{BRAND.hotline}</span></a>
            </Reveal>
          </div>
          <Reveal delay={0.15} y={0} className="bu-orb bu-orb-world"><WorldArtPlayer world={world} /></Reveal>
        </div>
      </section>

      <section className="z-sec z-sec-tight" data-w={world}><div className="z-wrap"><ConcernPicker world={world} /></div></section>
      <section className="z-sec" data-w={world}><div className="z-wrap"><SectionHead kicker={t(W.label)} title={t(UI.services)} world={world} /><ServiceGrid world={world} /></div></section>
      {world === "kids" && <>
        <section className="z-sec bu-soft" data-w="kids"><div className="z-wrap"><SectionHead title={t(UI.byAge)} world="kids" /><AgeRuler /></div></section>
        <section className="z-sec z-sec-tight"><div className="z-wrap"><EmergencyBanner /></div></section>
      </>}
      <section className="z-sec" data-w={world}><div className="z-wrap"><SectionHead title={t(UI.journey)} world={world} /><Journey world={world} /></div></section>
      {world === "adults" && <section className="z-sec z-sec-tight" data-w="adults"><div className="z-wrap"><AbroadBand /></div></section>}
      <section className="z-sec bu-soft" data-w={world}><div className="z-wrap z-narrow"><SectionHead title={t(UI.faq)} world={world} /><FAQList world={world} /></div></section>
      <section className="z-sec" data-w={world}><div className="z-wrap"><SectionHead title={t(UI.reviews)} world={world} /><Reviews world={world} /></div></section>
      <section className="z-sec" data-w={world}><div className="z-wrap"><SectionHead title={t(UI.articles)} world={world} /><ArticleList world={world} /></div></section>
      <section className="z-sec z-sec-tight"><div className="z-wrap"><BookBand world={world} /></div></section>
    </>
  );
}
