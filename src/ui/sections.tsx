/**
 * Every content section the three directions compose their pages from.
 * Markup is shared; each direction's stylesheet gives it its own look.
 * Anything carrying data-w="adults|kids" takes that world's colours.
 */

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarCheck, ChevronDown, ExternalLink, MapPin, Phone, Plane, Quote, Siren, Video } from "lucide-react";
import {
  AGES, ARTICLES, BRANCHES, BRAND, CONCERNS, DOCTOR, FAQ, JOURNEY, PROMISES, REVIEWS, STATS, UI, WORLDS,
  mapHref, serviceById, servicesOf, type Age, type Service, type World,
} from "@/content";
import { useLang } from "@/lib/i18n";
import { CountUp, Reveal, RevealGroup, RevealItem, SplitText } from "@/lib/motion";
import portrait from "@/media/dr-portrait.webp";
import { ICONS, WorldGlyph, useSite } from "./site";

/** Forward arrow that points the reading direction. */
export function Fwd({ size = 16 }: { size?: number }) {
  const { dir } = useLang();
  return dir === "rtl" ? <ArrowLeft size={size} /> : <ArrowRight size={size} />;
}

export function SectionHead({ kicker, title, lead, accent, center, world }: {
  kicker?: string; title: string; lead?: string; accent?: string[]; center?: boolean; world?: World;
}) {
  return (
    <div className={`z-shead${center ? " is-center" : ""}`} data-w={world}>
      {kicker && <Reveal y={10}><p className="z-kicker">{kicker}</p></Reveal>}
      <SplitText text={title} className="z-h2" accent={accent} />
      {lead && <Reveal delay={0.1} y={12}><p className="z-lead">{lead}</p></Reveal>}
    </div>
  );
}

/* ── Choosing a world ─────────────────────────────────────── */

/** The fork: two big doors, one per world. Used on every home page. */
export function WorldDoors({ art }: { art?: Record<World, ReactNode> }) {
  const { to } = useSite();
  const { t } = useLang();
  return (
    <RevealGroup className="z-doors" each={0.12}>
      {(["adults", "kids"] as World[]).map((w) => (
        <RevealItem key={w} className="z-door" as="article">
          <a href={to({ name: "world", world: w })} data-w={w} className="z-door-in">
            {art?.[w] && <span className="z-door-art" aria-hidden>{art[w]}</span>}
            <span className="z-door-aud"><WorldGlyph world={w} size={22} />{t(WORLDS[w].audience)}</span>
            <span className="z-door-t">{t(WORLDS[w].label)}</span>
            <span className="z-door-s">{t(WORLDS[w].tagline)}</span>
            <span className="z-door-list">{servicesOf(w).slice(0, 4).map((s) => <i key={s.id}>{t(s.name)}</i>)}</span>
            <span className="z-door-go">{t(WORLDS[w].door)} <Fwd /></span>
          </a>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

/** "What's on your mind?" Plain-language concerns that route to a service. */
export function ConcernPicker({ world }: { world: World }) {
  const { to } = useSite();
  const { t } = useLang();
  return (
    <div className="z-concern" data-w={world}>
      <p className="z-concern-h">{t(UI.concern)}</p>
      <p className="z-concern-hint">{t(UI.concernHint)}</p>
      <RevealGroup as="ul" className="z-chips" each={0.04}>
        {CONCERNS[world].map((c) => {
          const s = serviceById(c.service)!;
          return (
            <RevealItem as="li" key={c.service}>
              <a href={to({ name: "service", id: c.service })} className={`z-chip${s.emergency ? " is-urgent" : ""}`}>
                {s.emergency && <Siren size={15} />}{t(c.label)}
              </a>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </div>
  );
}

export function ServiceCard({ s, index }: { s: Service; index?: number }) {
  const { to } = useSite();
  const { t } = useLang();
  const Icon = ICONS[s.icon] ?? ICONS.Sparkles;
  return (
    <a href={to({ name: "service", id: s.id })} className={`z-card${s.emergency ? " is-urgent" : ""}`} data-w={s.world}>
      <span className="z-card-top">
        <span className="z-card-icon"><Icon size={22} /></span>
        {index !== undefined && <span className="z-card-n u-tnum">{String(index + 1).padStart(2, "0")}</span>}
        {s.emergency && <span className="z-card-flag"><Siren size={13} />{t(UI.emergency)}</span>}
      </span>
      <span className="z-card-t">{t(s.name)}</span>
      <span className="z-card-s">{t(s.short)}</span>
      <span className="z-card-go">{t(UI.learnMore)} <Fwd size={15} /></span>
    </a>
  );
}

export function ServiceGrid({ world, numbered }: { world: World; numbered?: boolean }) {
  return (
    <RevealGroup className="z-grid" each={0.06}>
      {servicesOf(world).map((s, i) => (
        <RevealItem key={s.id}><ServiceCard s={s} index={numbered ? i : undefined} /></RevealItem>
      ))}
    </RevealGroup>
  );
}

/* ── Kids by age ──────────────────────────────────────────── */

/** A growth ruler: pick his age, see what matters at that age. */
export function AgeRuler() {
  const { to } = useSite();
  const { t } = useLang();
  const [age, setAge] = useState<Age>("baby");
  const cur = AGES.find((a) => a.id === age)!;
  const list = servicesOf("kids").filter((s) => s.ages?.includes(age));
  const idx = AGES.findIndex((a) => a.id === age);
  return (
    <div className="z-ruler" data-w="kids">
      <div className="z-ruler-tabs" role="tablist" aria-label={t(UI.byAge)}>
        {AGES.map((a, i) => (
          <button key={a.id} type="button" role="tab" id={`age-${a.id}`} aria-selected={a.id === age} aria-controls="age-panel"
            className={a.id === age ? "is-on" : ""} onClick={() => setAge(a.id)} style={{ ["--h" as string]: `${40 + i * 30}%` }}>
            <span className="z-ruler-bar" aria-hidden><span /></span>
            <b>{t(a.label)}</b>
            <span>{t(a.range)}</span>
          </button>
        ))}
      </div>
      <motion.div key={age} id="age-panel" role="tabpanel" aria-labelledby={`age-${age}`} className="z-ruler-panel"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <p className="z-ruler-tip">{t(cur.tip)}</p>
        <ul className="z-ruler-list">
          {list.map((s) => (
            <li key={s.id}>
              <a href={to({ name: "service", id: s.id })} className={s.emergency ? "is-urgent" : ""}>
                {s.emergency && <Siren size={15} />}{t(s.name)}<Fwd size={14} />
              </a>
            </li>
          ))}
        </ul>
        <span className="z-ruler-step u-tnum" aria-hidden>{idx + 1}/{AGES.length}</span>
      </motion.div>
    </div>
  );
}

export function EmergencyBanner() {
  const { to } = useSite();
  const { t } = useLang();
  return (
    <Reveal className="z-emergency" y={10}>
      <span className="z-emergency-icon"><Siren size={26} /></span>
      <div>
        <p className="z-emergency-k">{t(UI.emergency)}</p>
        <p className="z-emergency-t">{t(UI.emergencyLine)}</p>
      </div>
      <div className="z-emergency-cta">
        <a className="z-btn z-btn-urgent" href={`tel:${BRAND.hotline}`}><Phone size={17} />{t(UI.emergencyCta)}</a>
        <a className="z-link" href={to({ name: "service", id: "torsion" })}>{t(UI.learnMore)} <Fwd size={14} /></a>
      </div>
    </Reveal>
  );
}

/* ── Visit, promises, questions, voices ───────────────────── */

export function Journey({ world }: { world: World }) {
  const { t } = useLang();
  return (
    <RevealGroup as="ol" className="z-journey" each={0.1}>
      {JOURNEY[world].map((j, i) => (
        <RevealItem as="li" key={i} className="z-step">
          <span className="z-step-n u-tnum">{i + 1}</span>
          <b>{t(j.title)}</b>
          <p>{t(j.body)}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

export function Promises() {
  const { t } = useLang();
  return (
    <RevealGroup className="z-promises" each={0.08}>
      {PROMISES.map((p) => {
        const Icon = ICONS[p.icon] ?? ICONS.Lock;
        return (
          <RevealItem key={p.icon} className="z-promise">
            <span className="z-promise-icon"><Icon size={22} /></span>
            <b>{t(p.title)}</b>
            <p>{t(p.body)}</p>
          </RevealItem>
        );
      })}
    </RevealGroup>
  );
}

export function FAQList({ world, items }: { world: World; items?: { q: { ar: string; en: string }; a: { ar: string; en: string } }[] }) {
  const { t } = useLang();
  const list = items ?? FAQ[world];
  return (
    <div className="z-faq" data-w={world}>
      {list.map((f, i) => (
        <details key={i} className="z-faq-item">
          <summary><span>{t(f.q)}</span><ChevronDown size={18} className="z-faq-chev" /></summary>
          <p>{t(f.a)}</p>
        </details>
      ))}
    </div>
  );
}

export function Reviews({ world }: { world?: World }) {
  const { t } = useLang();
  /* On mixed pages: two families and one adult, so both worlds are heard. */
  const list = world ? REVIEWS.filter((r) => r.world === world) : [REVIEWS[0], REVIEWS[3], REVIEWS[2]];
  return (
    <RevealGroup className="z-reviews" each={0.1}>
      {list.map((r, i) => (
        <RevealItem key={i} as="article" className="z-review">
          <a data-w={r.world} className="z-review-in" href="https://search.google.com/local/reviews?placeid=ChIJf-yAHKPa9RQRkvB589xjHEk" target="_blank" rel="noreferrer">
            <Quote size={22} className="z-review-q" />
            <blockquote>{t(r.body)}</blockquote>
            <span className="z-review-who"><WorldGlyph world={r.world} size={16} />{t(r.who)} · Google</span>
          </a>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

export function Stats() {
  const { t } = useLang();
  return (
    <RevealGroup className="z-stats" each={0.08}>
      {STATS.map((s, i) => (
        <RevealItem key={i} className="z-stat">
          <span className="z-stat-v">{"plain" in s && s.plain ? String(s.value) : <CountUp value={s.value} suffix={"suffix" in s ? s.suffix : ""} />}</span>
          <span className="z-stat-l">{t(s.label)}</span>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

/* ── The doctor ───────────────────────────────────────────── */

export function DoctorBlock({ full }: { full?: boolean }) {
  const { to } = useSite();
  const { t } = useLang();
  return (
    <div className={`z-doctor${full ? " is-full" : ""}`}>
      <Reveal className="z-doctor-photo">
        <img src={portrait} alt={t(BRAND.doctor)} loading="lazy" />
      </Reveal>
      <div className="z-doctor-copy">
        <Reveal y={10}><p className="z-kicker">{t(BRAND.doctorTitle)}</p></Reveal>
        <SplitText text={t(BRAND.doctor)} className="z-h2" />
        <Reveal delay={0.1}><p className="z-lead">{t(DOCTOR.intro)}</p></Reveal>
        <RevealGroup as="ul" className="z-record" each={0.06}>
          {(full ? DOCTOR.record : DOCTOR.record.slice(0, 3)).map((r, i) => <RevealItem as="li" key={i}>{t(r)}</RevealItem>)}
        </RevealGroup>
        {full && <Reveal><p className="z-doctor-conf">{t(DOCTOR.conference)}</p></Reveal>}
        <Reveal className="z-doctor-cta">
          <a className="z-btn z-btn-primary" href={to({ name: "book" })}><CalendarCheck size={17} />{t(UI.book)}</a>
          {!full && <a className="z-btn z-btn-ghost" href={to({ name: "doctor" })}>{t(UI.meetDoctor)} <Fwd /></a>}
        </Reveal>
      </div>
    </div>
  );
}

/* ── Branches ─────────────────────────────────────────────── */

export function Branches({ compact }: { compact?: boolean }) {
  const { t } = useLang();
  return (
    <RevealGroup className={`z-branches${compact ? " is-compact" : ""}`} each={0.08}>
      {BRANCHES.map((b) => (
        <RevealItem key={b.id} as="article" className="z-branch">
          <span className="z-branch-pin"><MapPin size={20} /></span>
          <b>{t(b.city)}</b>
          <p>{t(b.address)}</p>
          <span className="z-branch-cta">
            <a href={mapHref(b.q)} target="_blank" rel="noreferrer" className="z-link">{t(UI.directions)} <ExternalLink size={14} /></a>
            <a href={`tel:${BRAND.hotline}`} className="z-link"><Phone size={14} /> {BRAND.hotline}</a>
          </span>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

export function AbroadBand() {
  const { to } = useSite();
  const { t } = useLang();
  return (
    <Reveal className="z-abroad">
      <span className="z-abroad-icon"><Plane size={26} /></span>
      <div>
        <b>{t(UI.abroad)}</b>
        <p>{t(UI.abroadBody)}</p>
      </div>
      <div className="z-abroad-cta">
        <a className="z-btn z-btn-ghost" href={to({ name: "book" })}><Video size={16} />{t(UI.online)}</a>
      </div>
    </Reveal>
  );
}

/* ── Articles ─────────────────────────────────────────────── */

export function ArticleList({ world, limit }: { world?: World; limit?: number }) {
  const { t } = useLang();
  const list = (world ? ARTICLES.filter((a) => a.world === world) : ARTICLES).slice(0, limit ?? 99);
  return (
    <RevealGroup as="ul" className="z-articles" each={0.06}>
      {list.map((a) => (
        <RevealItem as="li" key={a.href}>
          <a className="z-article" data-w={a.world} href={a.href} target="_blank" rel="noreferrer">
            <span className="z-article-w"><WorldGlyph world={a.world} size={16} />{t(WORLDS[a.world].label)}</span>
            <span className="z-article-t">{t(a.title)}</span>
            <span className="z-article-go">{t(UI.readOnSite)} <ExternalLink size={14} /></span>
          </a>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

/* ── A booking nudge, pre-set to a world or service ───────── */

export function BookBand({ world, service }: { world?: World; service?: string }) {
  const { to } = useSite();
  const { t } = useLang();
  const w = world ?? (service ? serviceById(service)?.world : undefined);
  return (
    <Reveal className="z-bookband" y={16}>
      <div data-w={w} className="z-bookband-in">
        <div>
          <b>{w ? t(WORLDS[w].cta) : t(UI.book)}</b>
          <p>{t(UI.placeholder)}</p>
        </div>
        <div className="z-bookband-cta">
          <a className="z-btn z-btn-primary z-btn-lg" href={to({ name: "book", world: w, service })}><CalendarCheck size={18} />{t(UI.book)}</a>
          <a className="z-btn z-btn-ghost z-btn-lg" href={`tel:${BRAND.hotline}`}><Phone size={17} /><span className="u-tnum">{BRAND.hotline}</span></a>
        </div>
      </div>
    </Reveal>
  );
}

/** Inner page title band. */
export function PageHero({ kicker, title, lead, world, children, accent }: {
  kicker: string; title: string; lead?: string; world?: World; children?: ReactNode; accent?: string[];
}) {
  const { to } = useSite();
  const { t } = useLang();
  return (
    <section className="z-phero" data-w={world}>
      <div className="z-wrap z-phero-grid">
        <div className="z-phero-copy">
          <p className="z-crumb">
            <a href={to({ name: "home" })}>{t(UI.home)}</a>
            {world && <><span aria-hidden>/</span><a href={to({ name: "world", world })}>{t(WORLDS[world].label)}</a></>}
          </p>
          <p className="z-kicker">{kicker}</p>
          <SplitText as="h1" onMount text={title} className="z-h1 z-h1-page" accent={accent} />
          {lead && <Reveal delay={0.25} y={10}><p className="z-lead">{lead}</p></Reveal>}
        </div>
        {children && <div className="z-phero-art">{children}</div>}
      </div>
    </section>
  );
}
