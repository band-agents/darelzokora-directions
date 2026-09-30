/**
 * Direction B — SPLIT. Editorial, exact, two halves.
 *
 * The home page is literally split: adults on the reading-start side, kids on
 * the other, each half growing when you lean into it, with the hero film as a
 * medallion on the seam (Remotion wipe and clock-wipe transitions). Inside a
 * world, a sticky index on the side takes you to any part of the page.
 * Alexandria for display, IBM Plex Sans Arabic for text; crisp rules instead
 * of shadows. Sage and teal for adults, periwinkle and butter for kids.
 */

import { useEffect, useState } from "react";
import { CalendarCheck, Phone } from "lucide-react";
import { BRAND, HOME, UI, WORLDS, servicesOf, type L, type World } from "@/content";
import { useLang } from "@/lib/i18n";
import { LivePlayer, Reveal, SplitText, scrollToId } from "@/lib/motion";
import type { Page } from "@/lib/routes";
import { HERO, HERO_FRAMES, SplitHero } from "@/remotion/heroes";
import { Shell } from "@/ui/Shell";
import { WorldArtPlayer } from "@/ui/pages";
import {
  AbroadBand, AgeRuler, ArticleList, BookBand, Branches, ConcernPicker, DoctorBlock, EmergencyBanner, FAQList, Fwd,
  Journey, Promises, Reviews, SectionHead, ServiceGrid, Stats,
} from "@/ui/sections";
import { useSite, WorldGlyph, type Skin } from "@/ui/site";
import { useHeroProps } from "@/ui/heroProps";
import "./split.css";

export const SKIN: Skin = {
  displayFont: "'Alexandria', sans-serif",
  ink: "#14181F",
  hero: { adults: ["#E7F5F1", "#BFE5DA"], kids: ["#E9EDFF", "#C9D2FF"], doctor: ["#FFF6D6", "#FFE7A6"], accentA: "#0E7C72", accentK: "#4757D6" },
  worldArt: { adults: ["#EDF8F5", "#C6E9DF"], kids: ["#EEF1FF", "#FFF1BF"], accentA: "#0E7C72", accentK: "#4757D6", outline: false },
};

export function Split({ page }: { page: Page }) {
  return <Shell dir="split" page={page} className="sp" skin={SKIN} Home={Home} World={WorldHub} />;
}

function Home() {
  const { t, lang } = useLang();
  const { to } = useSite();
  const hp = useHeroProps();
  const [lean, setLean] = useState<World | null>(null);
  return (
    <>
      <section className="sp-intro">
        <div className="z-wrap">
          <Reveal y={10}><p className="z-kicker sp-rule">{t(HOME.kicker)}</p></Reveal>
          <SplitText as="h1" onMount delay={0.05} text={t(HOME.title)} accent={HOME.accent[lang]} accentWorlds={HOME.accentWorlds} className="z-h1 sp-h1" />
          <Reveal delay={0.3} y={10}><p className="z-lead sp-intro-lead">{t(HOME.lead)}</p></Reveal>
        </div>
      </section>

      <section className="sp-split" data-lean={lean ?? undefined} onMouseLeave={() => setLean(null)}>
        {(["adults", "kids"] as World[]).map((w) => (
          <a key={w} data-w={w} className="sp-half" href={to({ name: "world", world: w })} onMouseEnter={() => setLean(w)} onFocus={() => setLean(w)}>
            <span className="sp-half-aud"><WorldGlyph world={w} size={20} />{t(WORLDS[w].audience)}</span>
            <span className="sp-half-t">{t(WORLDS[w].label)}</span>
            <span className="sp-half-s">{t(WORLDS[w].tagline)}</span>
            <span className="sp-half-list">
              {servicesOf(w).slice(0, 5).map((s, i) => <i key={s.id}><b className="u-tnum">{String(i + 1).padStart(2, "0")}</b>{t(s.name)}</i>)}
            </span>
            <span className="z-btn z-btn-primary sp-half-go">{t(WORLDS[w].door)} <Fwd /></span>
          </a>
        ))}
        <div className="sp-medal" aria-hidden={false}>
          <LivePlayer component={SplitHero} inputProps={hp} width={HERO.width} height={HERO.height} frames={HERO_FRAMES} still={40}
            label={t({ ar: "مشهد متحرك ينقسم بين قسم الكبار وقسم الأطفال", en: "An animated scene that splits between the adults and kids sections" })} />
        </div>
      </section>

      <section className="z-sec z-sec-tight"><div className="z-wrap"><Stats /></div></section>
      <section className="z-sec z-sec-tight"><div className="z-wrap"><EmergencyBanner /></div></section>
      <section className="z-sec"><div className="z-wrap"><DoctorBlock /></div></section>
      <section className="z-sec sp-band"><div className="z-wrap"><SectionHead kicker={t(BRAND.name)} title={t(UI.why)} /><Promises /></div></section>
      <section className="z-sec"><div className="z-wrap"><SectionHead title={t(UI.reviews)} /><Reviews /></div></section>
      <section className="z-sec sp-band"><div className="z-wrap"><SectionHead title={t(UI.branches)} /><Branches /></div></section>
      <section className="z-sec z-sec-tight"><div className="z-wrap"><BookBand /></div></section>
    </>
  );
}

/** The in-page index on world pages. Highlights the section in view. */
function Rail({ items }: { items: { id: string; label: L }[] }) {
  const { t } = useLang();
  const [on, setOn] = useState(items[0].id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((es) => {
      const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vis) setOn(vis.target.id);
    }, { rootMargin: "-20% 0px -70% 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);
  return (
    <nav className="sp-rail" aria-label={t(UI.menu)}>
      {items.map((i, n) => (
        <button key={i.id} type="button" className={on === i.id ? "is-on" : ""} onClick={() => scrollToId(i.id)}>
          <span className="u-tnum">{String(n + 1).padStart(2, "0")}</span>{t(i.label)}
        </button>
      ))}
    </nav>
  );
}

function WorldHub({ world }: { world: World }) {
  const { t } = useLang();
  const { to } = useSite();
  const W = WORLDS[world];
  const items = [
    { id: "concern", label: UI.concern },
    { id: "services", label: UI.services },
    ...(world === "kids" ? [{ id: "age", label: UI.byAge }] : []),
    { id: "journey", label: UI.journey },
    { id: "faq", label: UI.faq },
    { id: "voices", label: UI.reviews },
    { id: "reading", label: UI.articles },
  ];
  return (
    <>
      <section className="sp-whero" data-w={world}>
        <div className="sp-whero-art"><WorldArtPlayer world={world} /></div>
        <div className="sp-whero-copy">
          <Reveal y={10}><p className="z-kicker sp-rule"><WorldGlyph world={world} size={18} /> {t(W.label)} · {t(W.tagline)}</p></Reveal>
          <SplitText as="h1" onMount delay={0.05} text={t(W.title)} className="z-h1 sp-h1" />
          <Reveal delay={0.25} y={10}><p className="z-lead">{t(W.intro)}</p></Reveal>
          <Reveal delay={0.35} y={10} className="sp-cta">
            <a className="z-btn z-btn-primary z-btn-lg" href={to({ name: "book", world })}><CalendarCheck size={19} />{t(W.cta)}</a>
            <a className="z-btn z-btn-ghost z-btn-lg" href={`tel:${BRAND.hotline}`}><Phone size={18} /><span className="u-tnum">{BRAND.hotline}</span></a>
          </Reveal>
        </div>
      </section>

      <div className="z-wrap sp-layout" data-w={world}>
        <Rail items={items} />
        <div className="sp-content">
          <section id="concern" className="sp-part"><ConcernPicker world={world} /></section>
          <section id="services" className="sp-part"><SectionHead kicker={t(W.label)} title={t(UI.services)} world={world} /><ServiceGrid world={world} numbered /></section>
          {world === "kids" && <>
            <section id="age" className="sp-part"><SectionHead title={t(UI.byAge)} world="kids" /><AgeRuler /></section>
            <section className="sp-part sp-part-tight"><EmergencyBanner /></section>
          </>}
          <section id="journey" className="sp-part"><SectionHead title={t(UI.journey)} world={world} /><Journey world={world} /></section>
          {world === "adults" && <section className="sp-part sp-part-tight"><AbroadBand /></section>}
          <section id="faq" className="sp-part"><SectionHead title={t(UI.faq)} world={world} /><FAQList world={world} /></section>
          <section id="voices" className="sp-part"><SectionHead title={t(UI.reviews)} world={world} /><Reviews world={world} /></section>
          <section id="reading" className="sp-part"><SectionHead title={t(UI.articles)} world={world} /><ArticleList world={world} /></section>
        </div>
      </div>
      <section className="z-sec z-sec-tight"><div className="z-wrap"><BookBand world={world} /></div></section>
    </>
  );
}
