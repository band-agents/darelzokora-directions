/**
 * Direction B — PRESTIGE. A private clinic: quiet, assured, editorial.
 *
 * Ivory paper, deep navy ink, brass hairlines, serif headings (Noto Naskh
 * Arabic, with Source Serif for English), square corners, no shadows. The
 * home page is split in two: adults on the reading-start side, children on
 * the other, the hero film as a seal on the seam (Remotion wipes, like
 * turning a page). Inside a section, a sticky index takes you to any part of
 * the page. Navy for adults, sage for children.
 */

import { useEffect, useState } from "react";
import { CalendarCheck, Phone } from "lucide-react";
import { BRAND, HOME, UI, WORLDS, servicesOf, type L, type World } from "@/content";
import { useLang } from "@/lib/i18n";
import { LivePlayer, Reveal, SplitText, scrollToId } from "@/lib/motion";
import type { Page } from "@/lib/routes";
import { HERO, HERO_FRAMES, PrestigeHero } from "@/remotion/heroes";
import { Shell } from "@/ui/Shell";
import { WorldArtPlayer } from "@/ui/pages";
import {
  AbroadBand, AgeRuler, ArticleList, BookBand, Branches, ConcernPicker, DoctorBlock, EmergencyBanner, FAQList, Fwd,
  Journey, Promises, Reviews, SectionHead, ServiceGrid, Stats,
} from "@/ui/sections";
import { useSite, WorldGlyph, type Skin } from "@/ui/site";
import { useHeroProps } from "@/ui/heroProps";
import "./prestige.css";

export const SKIN: Skin = {
  displayFont: "'Source Serif 4', 'Noto Naskh Arabic', serif",
  ink: "#16233A",
  hero: { adults: ["#F4F2EC", "#E3E6EE"], kids: ["#F4F3EC", "#E1EBE4"], doctor: ["#F7F4EE", "#E8E2D6"], accentA: "#1C3152", accentK: "#3F6B5A", round: true },
  worldArt: { adults: ["#F6F4EE", "#E4E7EF"], kids: ["#F6F5EE", "#E2ECE5"], accentA: "#1C3152", accentK: "#3F6B5A" },
};

export function Prestige({ page }: { page: Page }) {
  return <Shell dir="prestige" page={page} className="pr" skin={SKIN} Home={Home} World={WorldHub} />;
}

const NUM = ["I", "II"];

function Home() {
  const { t, lang } = useLang();
  const { to } = useSite();
  const hp = useHeroProps();
  const [lean, setLean] = useState<World | null>(null);
  return (
    <>
      <section className="pr-intro">
        <div className="z-wrap">
          <Reveal y={8}><p className="z-kicker pr-rule">{t(HOME.kicker)}</p></Reveal>
          <SplitText as="h1" onMount delay={0.05} text={t(HOME.title)} accent={HOME.accent[lang]} accentWorlds={HOME.accentWorlds} className="z-h1 pr-h1" />
          <Reveal delay={0.3} y={8}><p className="z-lead pr-intro-lead">{t(HOME.lead)}</p></Reveal>
        </div>
      </section>

      <section className="pr-split" data-lean={lean ?? undefined} onMouseLeave={() => setLean(null)}>
        {(["adults", "kids"] as World[]).map((w, i) => (
          <a key={w} data-w={w} className="pr-half" href={to({ name: "world", world: w })} onMouseEnter={() => setLean(w)} onFocus={() => setLean(w)}>
            <span className="pr-half-aud"><span className="pr-num">{NUM[i]}</span><WorldGlyph world={w} size={18} />{t(WORLDS[w].audience)}</span>
            <span className="pr-half-t">{t(WORLDS[w].label)}</span>
            <span className="pr-half-s">{t(WORLDS[w].tagline)}</span>
            <span className="pr-half-list">
              {servicesOf(w).slice(0, 5).map((s, n) => <i key={s.id}><b className="u-tnum">{String(n + 1).padStart(2, "0")}</b>{t(s.name)}</i>)}
            </span>
            <span className="z-btn z-btn-primary pr-half-go">{t(WORLDS[w].door)} <Fwd /></span>
          </a>
        ))}
        <div className="pr-seal">
          <LivePlayer component={PrestigeHero} inputProps={hp} width={HERO.width} height={HERO.height} frames={HERO_FRAMES} still={40}
            label={t({ ar: "فيلم قصير ينقسم بين قسم الكبار وقسم الأطفال", en: "A short film that divides between the adults and children's sections" })} />
        </div>
      </section>

      <section className="z-sec z-sec-tight pr-stats"><div className="z-wrap"><Stats /></div></section>
      <section className="z-sec z-sec-tight"><div className="z-wrap"><EmergencyBanner /></div></section>
      <section className="z-sec"><div className="z-wrap"><DoctorBlock /></div></section>
      <section className="z-sec pr-band"><div className="z-wrap"><SectionHead kicker={t(BRAND.name)} title={t(UI.why)} /><Promises /></div></section>
      <section className="z-sec"><div className="z-wrap"><SectionHead title={t(UI.reviews)} /><Reviews /></div></section>
      <section className="z-sec pr-band"><div className="z-wrap"><SectionHead title={t(UI.branches)} /><Branches /></div></section>
      <section className="z-sec z-sec-tight"><div className="z-wrap"><BookBand /></div></section>
    </>
  );
}

/** The in-page index on section pages. Highlights the part in view. */
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
    <nav className="pr-rail" aria-label={t(UI.menu)}>
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
      <section className="pr-whero" data-w={world}>
        <div className="pr-whero-art"><WorldArtPlayer world={world} /></div>
        <div className="pr-whero-copy">
          <Reveal y={8}><p className="z-kicker pr-rule"><WorldGlyph world={world} size={17} /> {t(W.label)} · {t(W.tagline)}</p></Reveal>
          <SplitText as="h1" onMount delay={0.05} text={t(W.title)} className="z-h1 pr-h1" />
          <Reveal delay={0.25} y={8}><p className="z-lead">{t(W.intro)}</p></Reveal>
          <Reveal delay={0.35} y={8} className="pr-cta">
            <a className="z-btn z-btn-primary z-btn-lg" href={to({ name: "book", world })}><CalendarCheck size={19} />{t(W.cta)}</a>
            <a className="z-btn z-btn-ghost z-btn-lg" href={`tel:${BRAND.hotline}`}><Phone size={18} /><span className="u-tnum">{BRAND.hotline}</span></a>
          </Reveal>
        </div>
      </section>

      <div className="z-wrap pr-layout" data-w={world}>
        <Rail items={items} />
        <div className="pr-content">
          <section id="concern" className="pr-part"><ConcernPicker world={world} /></section>
          <section id="services" className="pr-part"><SectionHead kicker={t(W.label)} title={t(UI.services)} world={world} /><ServiceGrid world={world} numbered /></section>
          {world === "kids" && <>
            <section id="age" className="pr-part"><SectionHead title={t(UI.byAge)} world="kids" /><AgeRuler /></section>
            <section className="pr-part pr-part-tight"><EmergencyBanner /></section>
          </>}
          <section id="journey" className="pr-part"><SectionHead title={t(UI.journey)} world={world} /><Journey world={world} /></section>
          {world === "adults" && <section className="pr-part pr-part-tight"><AbroadBand /></section>}
          <section id="faq" className="pr-part"><SectionHead title={t(UI.faq)} world={world} /><FAQList world={world} /></section>
          <section id="voices" className="pr-part"><SectionHead title={t(UI.reviews)} world={world} /><Reviews world={world} /></section>
          <section id="reading" className="pr-part"><SectionHead title={t(UI.articles)} world={world} /><ArticleList world={world} /></section>
        </div>
      </div>
      <section className="z-sec z-sec-tight"><div className="z-wrap"><BookBand world={world} /></div></section>
    </>
  );
}
