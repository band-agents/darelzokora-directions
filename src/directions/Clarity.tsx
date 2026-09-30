/**
 * Direction A — CLARITY. Clinical, calm, exact.
 *
 * The register of a leading hospital: white space, the logo's teal as the
 * only strong colour, hairlines instead of decoration, one typeface (IBM
 * Plex Sans Arabic, Arabic and Latin drawn together). The two sections are
 * the first decision on the page: two option cards under the headline, each
 * in its own colour, teal for adults and a calm blue for children. The hero
 * film cross-fades between the adults section, the children's section and
 * Dr. Osama.
 */

import { CalendarCheck, Check, Phone } from "lucide-react";
import { BRAND, HOME, STATS, UI, WORLDS, type World } from "@/content";
import { useLang } from "@/lib/i18n";
import { LivePlayer, Reveal, RevealGroup, RevealItem, SplitText } from "@/lib/motion";
import type { Page } from "@/lib/routes";
import { ClarityHero, HERO, HERO_FRAMES } from "@/remotion/heroes";
import { DoorArt, Shell } from "@/ui/Shell";
import { WorldArtPlayer } from "@/ui/pages";
import {
  AbroadBand, AgeRuler, ArticleList, BookBand, Branches, ConcernPicker, DoctorBlock, EmergencyBanner, FAQList, Fwd,
  Journey, Promises, Reviews, SectionHead, ServiceGrid, Stats, WorldDoors,
} from "@/ui/sections";
import { useSite, WorldGlyph, type Skin } from "@/ui/site";
import { useHeroProps } from "@/ui/heroProps";
import "./clarity.css";

export const SKIN: Skin = {
  displayFont: "'IBM Plex Sans Arabic', sans-serif",
  ink: "#0F1B24",
  hero: { adults: ["#F3F9F8", "#DCEEEC"], kids: ["#F4F8FC", "#DDE9F5"], doctor: ["#F7FAFA", "#E3EEEE"], accentA: "#0B6E6A", accentK: "#2F6DA8" },
  worldArt: { adults: ["#F5FAF9", "#DDEFEC"], kids: ["#F5F9FD", "#DEEAF6"], accentA: "#0B6E6A", accentK: "#2F6DA8" },
};

export function Clarity({ page }: { page: Page }) {
  return <Shell dir="clarity" page={page} className="cl" skin={SKIN} Home={Home} World={WorldHub} />;
}

const TRUST = [
  { ar: "منذ 2003", en: "Since 2003" },
  { ar: "4 فروع", en: "4 branches" },
  { ar: "سرية تامة", en: "Complete privacy" },
];

function Home() {
  const { t, lang } = useLang();
  const { to } = useSite();
  const hp = useHeroProps();
  const patients = STATS.find((s) => s.value === 100000)!;
  return (
    <>
      <section className="cl-hero">
        <div className="z-wrap cl-hero-grid">
          <div className="cl-hero-copy">
            <Reveal y={8}><p className="z-kicker cl-kicker">{t(HOME.kicker)}</p></Reveal>
            <SplitText as="h1" onMount delay={0.05} text={t(HOME.title)} accent={HOME.accent[lang]} accentWorlds={HOME.accentWorlds} className="z-h1" />
            <Reveal delay={0.25} y={10}><p className="z-lead">{t(HOME.lead)}</p></Reveal>
            <RevealGroup className="cl-pick" each={0.1}>
              {(["adults", "kids"] as World[]).map((w) => (
                <RevealItem key={w}>
                  <a data-w={w} className="cl-pick-a" href={to({ name: "world", world: w })}>
                    <span className="cl-pick-i"><WorldGlyph world={w} size={22} /></span>
                    <span className="cl-pick-t"><b>{t(WORLDS[w].label)}</b><small>{t(WORLDS[w].tagline)}</small></span>
                    <Fwd size={18} />
                  </a>
                </RevealItem>
              ))}
            </RevealGroup>
            <Reveal delay={0.5} y={6}>
              <ul className="cl-trust">
                {TRUST.map((x) => <li key={x.en}><Check size={15} />{t(x)}</li>)}
                <li><a className="z-call" href={`tel:${BRAND.hotline}`}><Phone size={15} /><span className="u-tnum">{BRAND.hotline}</span></a></li>
              </ul>
            </Reveal>
          </div>
          <Reveal delay={0.15} y={16} className="cl-film">
            <LivePlayer component={ClarityHero} inputProps={hp} width={HERO.width} height={HERO.height} frames={HERO_FRAMES} still={40}
              label={t({ ar: "فيلم قصير: قسم الكبار، قسم الأطفال، ود. أسامة غطاس", en: "A short film: the adults section, the children's section, and Dr. Osama Ghattas" })} />
            <div className="cl-film-stat">
              <b className="u-tnum">100,000+</b>
              <span>{t(patients.label)}</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="z-sec z-sec-tight cl-stats"><div className="z-wrap"><Stats /></div></section>

      <section className="z-sec">
        <div className="z-wrap">
          <SectionHead kicker={t(BRAND.name)} title={t(HOME.worldsTitle)} lead={t(HOME.worldsLead)} />
          <WorldDoors art={{ adults: <DoorArt world="adults" />, kids: <DoorArt world="kids" /> }} />
        </div>
      </section>
      <section className="z-sec z-sec-tight"><div className="z-wrap"><EmergencyBanner /></div></section>
      <section className="z-sec cl-tint"><div className="z-wrap"><DoctorBlock /></div></section>
      <section className="z-sec"><div className="z-wrap"><SectionHead title={t(UI.why)} /><Promises /></div></section>
      <section className="z-sec cl-tint"><div className="z-wrap"><SectionHead title={t(UI.reviews)} /><Reviews /></div></section>
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
      <section className="cl-whero" data-w={world}>
        <div className="z-wrap cl-hero-grid">
          <div className="cl-hero-copy">
            <p className="z-crumb"><a href={to({ name: "home" })}>{t(UI.home)}</a><span aria-hidden>/</span><span>{t(W.label)}</span></p>
            <Reveal y={8}><p className="z-kicker cl-kicker"><WorldGlyph world={world} size={17} />{t(W.label)} · {t(W.tagline)}</p></Reveal>
            <SplitText as="h1" onMount delay={0.05} text={t(W.title)} className="z-h1" />
            <Reveal delay={0.25} y={10}><p className="z-lead">{t(W.intro)}</p></Reveal>
            <Reveal delay={0.35} y={10} className="cl-cta">
              <a className="z-btn z-btn-primary z-btn-lg" href={to({ name: "book", world })}><CalendarCheck size={19} />{t(W.cta)}</a>
              <a className="z-btn z-btn-ghost z-btn-lg" href={`tel:${BRAND.hotline}`}><Phone size={18} /><span className="u-tnum">{BRAND.hotline}</span></a>
            </Reveal>
          </div>
          <Reveal delay={0.15} y={16} className="cl-film cl-film-world"><WorldArtPlayer world={world} /></Reveal>
        </div>
      </section>

      <section className="z-sec z-sec-tight" data-w={world}><div className="z-wrap"><ConcernPicker world={world} /></div></section>
      <section className="z-sec" data-w={world}><div className="z-wrap"><SectionHead kicker={t(W.label)} title={t(UI.services)} world={world} /><ServiceGrid world={world} /></div></section>
      {world === "kids" && <>
        <section className="z-sec cl-tint" data-w="kids"><div className="z-wrap"><SectionHead title={t(UI.byAge)} world="kids" /><AgeRuler /></div></section>
        <section className="z-sec z-sec-tight"><div className="z-wrap"><EmergencyBanner /></div></section>
      </>}
      <section className="z-sec" data-w={world}><div className="z-wrap"><SectionHead title={t(UI.journey)} world={world} /><Journey world={world} /></div></section>
      {world === "adults" && <section className="z-sec z-sec-tight" data-w="adults"><div className="z-wrap"><AbroadBand /></div></section>}
      <section className="z-sec cl-tint" data-w={world}><div className="z-wrap z-narrow"><SectionHead title={t(UI.faq)} world={world} /><FAQList world={world} /></div></section>
      <section className="z-sec" data-w={world}><div className="z-wrap"><SectionHead title={t(UI.reviews)} world={world} /><Reviews world={world} /></div></section>
      <section className="z-sec cl-tint" data-w={world}><div className="z-wrap"><SectionHead title={t(UI.articles)} world={world} /><ArticleList world={world} /></div></section>
      <section className="z-sec z-sec-tight"><div className="z-wrap"><BookBand world={world} /></div></section>
    </>
  );
}
