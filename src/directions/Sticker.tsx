/**
 * Direction C — STICKER. Playful, pop, app-like.
 *
 * Everything is a sticker: pastel fills, a thick ink outline, a hard shadow,
 * a slight tilt that straightens when you touch it. The hero film turns over
 * like a sticker (Remotion flip transitions), a ticker runs every service by
 * name, and the logo's moustache wiggles. Marhey for display (playful, Arabic
 * and Latin), Rubik for text. Mint and sky for adults, bubblegum and lemon
 * for kids.
 */

import { CalendarCheck, Phone } from "lucide-react";
import { BRAND, HOME, SERVICES, UI, WORLDS, type World } from "@/content";
import { useLang } from "@/lib/i18n";
import { LivePlayer, Reveal, SplitText } from "@/lib/motion";
import type { Page } from "@/lib/routes";
import { HERO, STICKER_FRAMES, StickerHero } from "@/remotion/heroes";
import { DoorArt, Shell } from "@/ui/Shell";
import { WorldArtPlayer } from "@/ui/pages";
import {
  AbroadBand, AgeRuler, ArticleList, BookBand, Branches, ConcernPicker, DoctorBlock, EmergencyBanner, FAQList,
  Journey, Promises, Reviews, SectionHead, ServiceGrid, Stats, WorldDoors,
} from "@/ui/sections";
import { useSite, WorldGlyph, type Skin } from "@/ui/site";
import { useHeroProps } from "@/ui/heroProps";
import "./sticker.css";

export const SKIN: Skin = {
  displayFont: "'Marhey', sans-serif",
  ink: "#1B1530",
  hero: { adults: ["#D6F7EC", "#9FE3D0"], kids: ["#FFE3EC", "#FFD0DE"], doctor: ["#FFF6B8", "#FFE45C"], accentA: "#1B1530", accentK: "#FFE45C" },
  worldArt: { adults: ["#E3FAF3", "#B4E6FF"], kids: ["#FFF3B8", "#FFD2DF"], accentA: "#1B1530", accentK: "#FFE45C", outline: true },
};

export function Sticker({ page }: { page: Page }) {
  return <Shell dir="sticker" page={page} className="st" skin={SKIN} Home={Home} World={WorldHub} />;
}

function Ticker() {
  const { t } = useLang();
  const items = SERVICES.map((s) => ({ w: s.world, n: t(s.name), id: s.id }));
  return (
    <div className="st-ticker" aria-hidden>
      <div className="st-ticker-track">
        {[0, 1].map((k) => (
          <span key={k}>
            {items.map((i) => <b key={i.id} data-w={i.w}><WorldGlyph world={i.w} size={18} />{i.n}</b>)}
          </span>
        ))}
      </div>
    </div>
  );
}

function Home() {
  const { t, lang } = useLang();
  const { to } = useSite();
  const hp = useHeroProps();
  return (
    <>
      <section className="st-hero">
        <div className="z-wrap st-hero-grid">
          <div className="st-hero-copy">
            <Reveal y={10}><p className="z-kicker st-tag">{t(HOME.kicker)}</p></Reveal>
            <SplitText as="h1" onMount delay={0.1} text={t(HOME.title)} accent={HOME.accent[lang]} accentWorlds={HOME.accentWorlds} className="z-h1" />
            <Reveal delay={0.35} y={12}><p className="z-lead">{t(HOME.lead)}</p></Reveal>
            <Reveal delay={0.45} y={12} className="st-hero-cta">
              {(["adults", "kids"] as World[]).map((w) => (
                <a key={w} data-w={w} className="z-btn z-btn-primary z-btn-lg" href={to({ name: "world", world: w })}>
                  <WorldGlyph world={w} size={22} />{t(WORLDS[w].label)}
                </a>
              ))}
              <a className="z-btn z-btn-ghost z-btn-lg" href={`tel:${BRAND.hotline}`}><Phone size={18} /><span className="u-tnum">{BRAND.hotline}</span></a>
            </Reveal>
          </div>
          <Reveal delay={0.2} y={30} className="st-film">
            <span className="st-tape" aria-hidden />
            <LivePlayer component={StickerHero} inputProps={hp} width={HERO.width} height={HERO.height} frames={STICKER_FRAMES} still={40}
              label={t({ ar: "ملصقات متحركة: قسم الكبار، قسم الأطفال، ود. أسامة غطاس", en: "Animated stickers: the adults section, the kids section, and Dr. Osama Ghattas" })} />
          </Reveal>
        </div>
      </section>
      <Ticker />

      <section className="z-sec">
        <div className="z-wrap">
          <SectionHead title={t(HOME.worldsTitle)} lead={t(HOME.worldsLead)} center />
          <WorldDoors art={{ adults: <DoorArt world="adults" outline />, kids: <DoorArt world="kids" outline /> }} />
        </div>
      </section>
      <section className="z-sec z-sec-tight"><div className="z-wrap"><EmergencyBanner /></div></section>
      <section className="z-sec"><div className="z-wrap"><SectionHead title={t(UI.stats)} center /><Stats /></div></section>
      <section className="z-sec st-dots"><div className="z-wrap"><DoctorBlock /></div></section>
      <section className="z-sec"><div className="z-wrap"><SectionHead title={t(UI.why)} center /><Promises /></div></section>
      <section className="z-sec st-dots"><div className="z-wrap"><SectionHead title={t(UI.reviews)} /><Reviews /></div></section>
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
      <section className="st-hero st-whero" data-w={world}>
        <div className="z-wrap st-hero-grid">
          <div className="st-hero-copy">
            <Reveal y={10}><p className="z-kicker st-tag"><WorldGlyph world={world} size={18} /> {t(W.label)} · {t(W.tagline)}</p></Reveal>
            <SplitText as="h1" onMount delay={0.1} text={t(W.title)} className="z-h1" />
            <Reveal delay={0.3} y={12}><p className="z-lead">{t(W.intro)}</p></Reveal>
            <Reveal delay={0.4} y={12} className="st-hero-cta">
              <a className="z-btn z-btn-primary z-btn-lg" href={to({ name: "book", world })}><CalendarCheck size={19} />{t(W.cta)}</a>
              <a className="z-btn z-btn-ghost z-btn-lg" href={`tel:${BRAND.hotline}`}><Phone size={18} /><span className="u-tnum">{BRAND.hotline}</span></a>
            </Reveal>
          </div>
          <Reveal delay={0.15} y={30} className="st-film st-film-world">
            <span className="st-tape" aria-hidden />
            <WorldArtPlayer world={world} />
          </Reveal>
        </div>
      </section>

      <section className="z-sec z-sec-tight" data-w={world}><div className="z-wrap"><ConcernPicker world={world} /></div></section>
      <section className="z-sec" data-w={world}><div className="z-wrap"><SectionHead kicker={t(W.label)} title={t(UI.services)} world={world} /><ServiceGrid world={world} /></div></section>
      {world === "kids" && <>
        <section className="z-sec st-dots" data-w="kids"><div className="z-wrap"><SectionHead title={t(UI.byAge)} world="kids" /><AgeRuler /></div></section>
        <section className="z-sec z-sec-tight"><div className="z-wrap"><EmergencyBanner /></div></section>
      </>}
      <section className="z-sec" data-w={world}><div className="z-wrap"><SectionHead title={t(UI.journey)} world={world} /><Journey world={world} /></div></section>
      {world === "adults" && <section className="z-sec z-sec-tight" data-w="adults"><div className="z-wrap"><AbroadBand /></div></section>}
      <section className="z-sec st-dots" data-w={world}><div className="z-wrap z-narrow"><SectionHead title={t(UI.faq)} world={world} /><FAQList world={world} /></div></section>
      <section className="z-sec" data-w={world}><div className="z-wrap"><SectionHead title={t(UI.reviews)} world={world} /><Reviews world={world} /></div></section>
      <section className="z-sec" data-w={world}><div className="z-wrap"><SectionHead title={t(UI.articles)} world={world} /><ArticleList world={world} /></div></section>
      <section className="z-sec z-sec-tight"><div className="z-wrap"><BookBand world={world} /></div></section>
    </>
  );
}
