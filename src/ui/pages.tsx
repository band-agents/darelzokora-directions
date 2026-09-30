/**
 * The inner pages every direction shares: a service, booking, the doctor,
 * branches, articles. Home and the two world hubs are composed by each
 * direction, because that is where the three designs differ most.
 */

import { useState } from "react";
import { CheckCircle2, Siren } from "lucide-react";
import { BRAND, UI, WORLDS, serviceById, servicesOf, type World } from "@/content";
import { useLang } from "@/lib/i18n";
import { LivePlayer, Reveal } from "@/lib/motion";
import { WORLD_ART, WorldArt } from "@/remotion/heroes";
import { Booking } from "./Booking";
import {
  AbroadBand, ArticleList, BookBand, Branches, DoctorBlock, EmergencyBanner, FAQList, PageHero, Reviews,
  SectionHead, ServiceCard, Stats,
} from "./sections";
import { ICONS, useSite } from "./site";
import { bandsFor } from "./heroProps";

export function WorldArtPlayer({ world }: { world: World }) {
  const { skin } = useSite();
  const { t } = useLang();
  const a = skin.worldArt;
  return (
    <LivePlayer
      component={WorldArt}
      inputProps={{ world, bg: a[world], accent: world === "adults" ? a.accentA : a.accentK, ink: skin.ink, font: skin.displayFont, bands: bandsFor(t) }}
      width={WORLD_ART.width} height={WORLD_ART.height} frames={WORLD_ART.frames} still={0}
      label={t(world === "adults"
        ? { ar: "حلقات دقيقة تدور حول شعار دار الذكورة", en: "Precision rings turning around the Dar El Zokora mark" }
        : { ar: "منحنى نمو الطفل من الولادة حتى 18 سنة", en: "A boy's growth curve from birth to 18" })}
    />
  );
}

export function ServicePage({ id }: { id: string }) {
  const { t } = useLang();
  const s = serviceById(id)!;
  const Icon = ICONS[s.icon] ?? ICONS.Sparkles;
  const others = servicesOf(s.world).filter((x) => x.id !== s.id).slice(0, 3);
  return (
    <>
      <PageHero kicker={t(WORLDS[s.world].label) + " · " + t(WORLDS[s.world].tagline)} title={t(s.name)} lead={t(s.short)} world={s.world}>
        <div className="z-svc-badge" data-w={s.world}><Icon size={64} strokeWidth={1.5} /></div>
      </PageHero>
      {s.emergency && <section className="z-sec z-sec-tight"><div className="z-wrap"><EmergencyBanner /></div></section>}
      <section className="z-sec" data-w={s.world}>
        <div className="z-wrap z-svc">
          <Reveal className="z-svc-about"><p>{t(s.about)}</p>{s.note && <p className="z-svc-note">{s.emergency && <Siren size={18} />}{t(s.note)}</p>}</Reveal>
          <div className="z-svc-cols">
            <Reveal className="z-svc-col">
              <h2 className="z-h3">{t(UI.signs)}</h2>
              <ul>{s.signs.map((x, i) => <li key={i}><CheckCircle2 size={18} />{t(x)}</li>)}</ul>
            </Reveal>
            <Reveal className="z-svc-col" delay={0.08}>
              <h2 className="z-h3">{t(UI.care)}</h2>
              <ol>{s.care.map((x, i) => <li key={i}><span className="u-tnum">{i + 1}</span>{t(x)}</li>)}</ol>
            </Reveal>
          </div>
        </div>
      </section>
      {s.faq && (
        <section className="z-sec z-sec-soft" data-w={s.world}>
          <div className="z-wrap z-narrow"><SectionHead title={t(UI.faq)} world={s.world} /><FAQList world={s.world} items={s.faq} /></div>
        </section>
      )}
      <BookBandSection service={s.id} />
      <section className="z-sec" data-w={s.world}>
        <div className="z-wrap">
          <SectionHead title={t(UI.relatedWorld)} world={s.world} />
          <div className="z-grid z-grid-3">{others.map((o) => <ServiceCard key={o.id} s={o} />)}</div>
        </div>
      </section>
    </>
  );
}

function BookBandSection(p: { world?: World; service?: string }) {
  return <section className="z-sec z-sec-tight"><div className="z-wrap"><BookBand {...p} /></div></section>;
}

export function BookPage({ world, service }: { world?: World; service?: string }) {
  const { t } = useLang();
  return (
    <>
      <PageHero kicker={t(BRAND.name)} title={t(UI.book)} lead={t(UI.placeholder)} world={world} />
      <section className="z-sec z-sec-tight"><div className="z-wrap z-narrow"><Booking world={world} service={service} /></div></section>
      <section className="z-sec z-sec-tight"><div className="z-wrap"><AbroadBand /></div></section>
    </>
  );
}

export function DoctorPage() {
  const { t } = useLang();
  return (
    <>
      <PageHero kicker={t(BRAND.doctorTitle)} title={t(BRAND.doctor)} lead={t(BRAND.line)} />
      <section className="z-sec"><div className="z-wrap"><DoctorBlock full /></div></section>
      <section className="z-sec z-sec-soft"><div className="z-wrap"><SectionHead title={t(UI.stats)} center /><Stats /></div></section>
      <section className="z-sec"><div className="z-wrap"><SectionHead title={t(UI.reviews)} /><Reviews /></div></section>
      <BookBandSection />
    </>
  );
}

export function BranchesPage() {
  const { t } = useLang();
  return (
    <>
      <PageHero kicker={t(UI.hotline) + " " + BRAND.hotline} title={t(UI.branches)} lead={t(UI.placeholder)} />
      <section className="z-sec"><div className="z-wrap"><Branches /></div></section>
      <section className="z-sec z-sec-tight"><div className="z-wrap"><AbroadBand /></div></section>
      <BookBandSection />
    </>
  );
}

export function ArticlesPage() {
  const { t } = useLang();
  const [w, setW] = useState<World | undefined>(undefined);
  const tabs: { id?: World; label: string }[] = [{ label: t(UI.seeAll) }, { id: "adults", label: t(WORLDS.adults.label) }, { id: "kids", label: t(WORLDS.kids.label) }];
  return (
    <>
      <PageHero kicker={t(BRAND.name)} title={t(UI.articles)} />
      <section className="z-sec">
        <div className="z-wrap">
          <div className="z-tabs" role="tablist">
            {tabs.map((x) => (
              <button key={x.label} type="button" role="tab" aria-selected={w === x.id} data-w={x.id} className={w === x.id ? "is-on" : ""} onClick={() => setW(x.id)}>{x.label}</button>
            ))}
          </div>
          <ArticleList world={w} />
        </div>
      </section>
    </>
  );
}
