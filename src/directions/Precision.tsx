/**
 * Direction C — PRECISION. A modern men's-health brand.
 *
 * Cool grey ground, white cards, one petrol colour for adults and a warm sand
 * for children, Alexandria for headings and Readex Pro for text. The page
 * works like a good health app: the hero asks who the care is for and what
 * brings you in, and sends you to the right page or straight to booking; a
 * tabbed explorer lays both sections' services side by side. The hero film
 * slides between scenes the way an app moves between cards.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Phone } from "lucide-react";
import { BRAND, CONCERNS, HOME, UI, WORLDS, servicesOf, type World } from "@/content";
import { useLang } from "@/lib/i18n";
import { LivePlayer, Reveal, SplitText } from "@/lib/motion";
import type { Page } from "@/lib/routes";
import { HERO, HERO_FRAMES, PrecisionHero } from "@/remotion/heroes";
import { Shell } from "@/ui/Shell";
import { WorldArtPlayer } from "@/ui/pages";
import {
  AbroadBand, AgeRuler, ArticleList, BookBand, Branches, ConcernPicker, DoctorBlock, EmergencyBanner, FAQList, Fwd,
  Journey, Promises, Reviews, SectionHead, ServiceGrid, Stats,
} from "@/ui/sections";
import { ICONS, useSite, WorldGlyph, type Skin } from "@/ui/site";
import { useHeroProps } from "@/ui/heroProps";
import portrait from "@/media/dr-portrait.webp";
import "./precision.css";

export const SKIN: Skin = {
  displayFont: "'Alexandria', sans-serif",
  ink: "#111827",
  hero: { adults: ["#F1F5F7", "#DCE8EC"], kids: ["#F8F5F0", "#EFE3D3"], doctor: ["#F3F5F7", "#E1E7EC"], accentA: "#0D5C6B", accentK: "#A2672A", card: "#FFFFFF" },
  worldArt: { adults: ["#F3F7F8", "#DDE9ED"], kids: ["#FAF7F2", "#F0E4D4"], accentA: "#0D5C6B", accentK: "#A2672A" },
};

export function Precision({ page }: { page: Page }) {
  return <Shell dir="precision" page={page} className="pc" skin={SKIN} Home={Home} World={WorldHub} />;
}

const WORLD_LIST: World[] = ["adults", "kids"];

/** Who is it for, and what brings you in: two answers, then the right page or a booking. */
function FindCare() {
  const { t } = useLang();
  const { to } = useSite();
  const [w, setW] = useState<World>("adults");
  const [svc, setSvc] = useState(CONCERNS.adults[0].service);
  const pick = (x: World) => { setW(x); setSvc(CONCERNS[x][0].service); };
  return (
    <div className="pc-find" data-w={w}>
      <p className="pc-find-h">{t(UI.chooseWorld)}</p>
      <div className="pc-seg" role="radiogroup" aria-label={t(UI.chooseWorld)}>
        {WORLD_LIST.map((x) => (
          <button key={x} type="button" role="radio" aria-checked={w === x} data-w={x} className={w === x ? "is-on" : ""} onClick={() => pick(x)}>
            <WorldGlyph world={x} size={18} />{t(WORLDS[x].audience)}
          </button>
        ))}
      </div>
      <label className="pc-select">
        <span>{t(UI.concern)}</span>
        <select value={svc} onChange={(e) => setSvc(e.target.value)}>
          {CONCERNS[w].map((c) => <option key={c.service} value={c.service}>{t(c.label)}</option>)}
        </select>
      </label>
      <div className="pc-find-go">
        <a className="z-btn z-btn-primary" href={to({ name: "service", id: svc })}>{t(UI.learnMore)} <Fwd /></a>
        <a className="z-btn z-btn-ghost" href={to({ name: "book", world: w, service: svc })}><CalendarCheck size={17} />{t(UI.bookShort)}</a>
      </div>
    </div>
  );
}

/** Both sections side by side as tabs, each with its whole service list. */
function Explorer() {
  const { t } = useLang();
  const { to } = useSite();
  const [w, setW] = useState<World>("adults");
  return (
    <div className="pc-exp" data-w={w}>
      <div className="pc-exp-tabs" role="tablist" aria-label={t(UI.chooseWorld)}>
        {WORLD_LIST.map((x) => (
          <button key={x} type="button" role="tab" id={`exp-${x}`} aria-selected={w === x} aria-controls="exp-panel" data-w={x} className={w === x ? "is-on" : ""} onClick={() => setW(x)}>
            <span className="pc-exp-i"><WorldGlyph world={x} size={22} /></span>
            <span className="pc-exp-l"><b>{t(WORLDS[x].label)}</b><small>{t(WORLDS[x].tagline)}</small></span>
          </button>
        ))}
      </div>
      <motion.div key={w} id="exp-panel" role="tabpanel" aria-labelledby={`exp-${w}`} className="pc-exp-panel"
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="pc-exp-intro">
          <p className="z-kicker">{t(WORLDS[w].audience)}</p>
          <h3 className="z-h3">{t(WORLDS[w].title)}</h3>
          <p>{t(WORLDS[w].intro)}</p>
          <div className="pc-exp-cta">
            <a className="z-btn z-btn-primary" href={to({ name: "world", world: w })}>{t(WORLDS[w].door)} <Fwd /></a>
            <a className="z-btn z-btn-ghost" href={to({ name: "book", world: w })}><CalendarCheck size={17} />{t(WORLDS[w].cta)}</a>
          </div>
        </div>
        <ul className="pc-exp-list">
          {servicesOf(w).map((s) => {
            const Icon = ICONS[s.icon] ?? ICONS.Sparkles;
            return (
              <li key={s.id}>
                <a href={to({ name: "service", id: s.id })} className={s.emergency ? "is-urgent" : ""}>
                  <span className="pc-exp-si"><Icon size={18} /></span>
                  <span className="pc-exp-st"><b>{t(s.name)}</b><small>{t(s.short)}</small></span>
                  <Fwd size={16} />
                </a>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </div>
  );
}

function DoctorBadge() {
  const { t } = useLang();
  const { to } = useSite();
  return (
    <a className="pc-badge" href={to({ name: "doctor" })}>
      <img src={portrait} alt="" width={48} height={48} />
      <span><b>{t(BRAND.doctor)}</b><small>{t(BRAND.doctorTitle)}</small></span>
    </a>
  );
}

function Home() {
  const { t, lang } = useLang();
  const hp = useHeroProps();
  return (
    <>
      <section className="pc-hero">
        <div className="z-wrap pc-hero-grid">
          <div className="pc-hero-copy">
            <Reveal y={8}><p className="z-kicker pc-pill">{t(HOME.kicker)}</p></Reveal>
            <SplitText as="h1" onMount delay={0.05} text={t(HOME.title)} accent={HOME.accent[lang]} accentWorlds={HOME.accentWorlds} className="z-h1" />
            <Reveal delay={0.25} y={10}><p className="z-lead">{t(HOME.lead)}</p></Reveal>
            <Reveal delay={0.35} y={12}><FindCare /></Reveal>
          </div>
          <Reveal delay={0.15} y={16} className="pc-film">
            <LivePlayer component={PrecisionHero} inputProps={hp} width={HERO.width} height={HERO.height} frames={HERO_FRAMES} still={40}
              label={t({ ar: "فيلم قصير: قسم الكبار، قسم الأطفال، ود. أسامة غطاس", en: "A short film: the adults section, the children's section, and Dr. Osama Ghattas" })} />
            <DoctorBadge />
          </Reveal>
        </div>
      </section>

      <section className="pc-metrics"><div className="z-wrap"><Stats /></div></section>

      <section className="z-sec">
        <div className="z-wrap">
          <SectionHead kicker={t(BRAND.name)} title={t(HOME.worldsTitle)} lead={t(HOME.worldsLead)} />
          <Explorer />
        </div>
      </section>
      <section className="z-sec z-sec-tight"><div className="z-wrap"><EmergencyBanner /></div></section>
      <section className="z-sec pc-white"><div className="z-wrap"><DoctorBlock /></div></section>
      <section className="z-sec"><div className="z-wrap"><SectionHead title={t(UI.why)} /><Promises /></div></section>
      <section className="z-sec pc-white"><div className="z-wrap"><SectionHead title={t(UI.reviews)} /><Reviews /></div></section>
      <section className="z-sec"><div className="z-wrap"><SectionHead title={t(UI.branches)} /><Branches /></div></section>
      <section className="z-sec z-sec-tight"><div className="z-wrap"><BookBand /></div></section>
    </>
  );
}

function WorldHub({ world }: { world: World }) {
  const { t } = useLang();
  const { to } = useSite();
  const W = WORLDS[world];
  const other: World = world === "adults" ? "kids" : "adults";
  return (
    <>
      <section className="pc-hero pc-whero" data-w={world}>
        <div className="z-wrap pc-hero-grid">
          <div className="pc-hero-copy">
            <p className="z-crumb"><a href={to({ name: "home" })}>{t(UI.home)}</a><span aria-hidden>/</span><span>{t(W.label)}</span></p>
            <Reveal y={8}><p className="z-kicker pc-pill"><WorldGlyph world={world} size={16} />{t(W.label)} · {t(W.tagline)}</p></Reveal>
            <SplitText as="h1" onMount delay={0.05} text={t(W.title)} className="z-h1" />
            <Reveal delay={0.25} y={10}><p className="z-lead">{t(W.intro)}</p></Reveal>
            <Reveal delay={0.35} y={10} className="pc-cta">
              <a className="z-btn z-btn-primary z-btn-lg" href={to({ name: "book", world })}><CalendarCheck size={19} />{t(W.cta)}</a>
              <a className="z-btn z-btn-ghost z-btn-lg" href={`tel:${BRAND.hotline}`}><Phone size={18} /><span className="u-tnum">{BRAND.hotline}</span></a>
            </Reveal>
            <Reveal delay={0.45} y={6}>
              <a className="pc-other" data-w={other} href={to({ name: "world", world: other })}>
                <WorldGlyph world={other} size={16} />{t(WORLDS[other].door)} <Fwd size={15} />
              </a>
            </Reveal>
          </div>
          <Reveal delay={0.15} y={16} className="pc-film pc-film-world"><WorldArtPlayer world={world} /></Reveal>
        </div>
      </section>

      <section className="z-sec z-sec-tight" data-w={world}><div className="z-wrap"><ConcernPicker world={world} /></div></section>
      <section className="z-sec" data-w={world}><div className="z-wrap"><SectionHead kicker={t(W.label)} title={t(UI.services)} world={world} /><ServiceGrid world={world} /></div></section>
      {world === "kids" && <>
        <section className="z-sec pc-white" data-w="kids"><div className="z-wrap"><SectionHead title={t(UI.byAge)} world="kids" /><AgeRuler /></div></section>
        <section className="z-sec z-sec-tight"><div className="z-wrap"><EmergencyBanner /></div></section>
      </>}
      <section className="z-sec" data-w={world}><div className="z-wrap"><SectionHead title={t(UI.journey)} world={world} /><Journey world={world} /></div></section>
      {world === "adults" && <section className="z-sec z-sec-tight" data-w="adults"><div className="z-wrap"><AbroadBand /></div></section>}
      <section className="z-sec pc-white" data-w={world}><div className="z-wrap z-narrow"><SectionHead title={t(UI.faq)} world={world} /><FAQList world={world} /></div></section>
      <section className="z-sec" data-w={world}><div className="z-wrap"><SectionHead title={t(UI.reviews)} world={world} /><Reviews world={world} /></div></section>
      <section className="z-sec pc-white" data-w={world}><div className="z-wrap"><SectionHead title={t(UI.articles)} world={world} /><ArticleList world={world} /></div></section>
      <section className="z-sec z-sec-tight"><div className="z-wrap"><BookBand world={world} /></div></section>
    </>
  );
}
