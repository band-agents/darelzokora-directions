/**
 * Header, phone tab bar, footer, the language toggle, and the colour wipe
 * that plays when you cross from one world to the other.
 *
 * The Adults / Kids switch lives in the header on every page, so the two
 * worlds are the site's top level, not two buttons on the home page.
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Globe, Home, Menu, Phone, X, CalendarCheck } from "lucide-react";
import { BRAND, UI, WORLDS, servicesOf, type World } from "@/content";
import { useLang } from "@/lib/i18n";
import { useHeader } from "@/lib/useHeader";
import logo from "@/brand/logo.svg";
import { useSite, WorldGlyph } from "./site";

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useLang();
  return (
    <button
      type="button"
      className={`z-lang ${className}`}
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      aria-label={t(UI.langLabel)}
      lang={lang === "ar" ? "en" : "ar"}
    >
      <Globe size={16} /> {t(UI.langSwitch)}
    </button>
  );
}

export function WorldSwitch({ compact }: { compact?: boolean }) {
  const { to, world } = useSite();
  const { t } = useLang();
  return (
    <nav className={`z-switch${compact ? " is-compact" : ""}`} aria-label={t(UI.chooseWorld)}>
      {(["adults", "kids"] as World[]).map((w) => (
        <a key={w} href={to({ name: "world", world: w })} data-w={w} aria-current={world === w ? "page" : undefined} className="z-switch-opt">
          {world === w && <motion.span layoutId="z-switch-pill" className="z-switch-pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
          <span className="z-switch-in"><WorldGlyph world={w} size={20} />{t(WORLDS[w].label)}</span>
        </a>
      ))}
    </nav>
  );
}

export function Header() {
  const { to, page } = useSite();
  const { t } = useLang();
  const { scrolled, open, setOpen } = useHeader(24);
  const links = [
    { p: { name: "doctor" } as const, label: UI.doctor },
    { p: { name: "branches" } as const, label: UI.branches },
    { p: { name: "articles" } as const, label: UI.articles },
  ];
  return (
    <header className={`z-head${scrolled ? " is-solid" : ""}`}>
      <div className="z-wrap z-head-in">
        <a className="z-logo" href={to({ name: "home" })} aria-label={t(BRAND.name)}>
          <img src={logo} alt={t(BRAND.name)} width={172} height={48} />
        </a>
        <WorldSwitch />
        <nav className="z-nav" aria-label={t(UI.menu)}>
          {links.map((l) => (
            <a key={l.p.name} href={to(l.p)} aria-current={page.name === l.p.name ? "page" : undefined}>{t(l.label)}</a>
          ))}
        </nav>
        <div className="z-actions">
          <LangToggle />
          <a className="z-call" href={`tel:${BRAND.hotline}`}><Phone size={16} /><span className="u-tnum">{BRAND.hotline}</span></a>
          <a className="z-btn z-btn-primary z-btn-sm z-head-book" href={to({ name: "book" })}><CalendarCheck size={16} />{t(UI.bookShort)}</a>
          <button type="button" className="z-burger" onClick={() => setOpen(true)} aria-label={t(UI.menu)}><Menu size={24} /></button>
        </div>
      </div>
      {open && (
        <div className="z-menu" role="dialog" aria-modal="true" aria-label={t(UI.menu)}>
          <div className="z-wrap z-menu-top">
            <img src={logo} alt="" width={150} height={42} />
            <button type="button" onClick={() => setOpen(false)} aria-label={t(UI.close)}><X size={26} /></button>
          </div>
          <div className="z-wrap z-menu-body" onClick={(e) => { if ((e.target as HTMLElement).closest("a")) setOpen(false); }}>
            <div className="z-menu-worlds">
              {(["adults", "kids"] as World[]).map((w) => (
                <a key={w} data-w={w} href={to({ name: "world", world: w })} className="z-menu-world">
                  <WorldGlyph world={w} size={34} />
                  <b>{t(WORLDS[w].label)}</b>
                  <span>{t(WORLDS[w].tagline)}</span>
                </a>
              ))}
            </div>
            <a href={to({ name: "home" })}>{t(UI.home)}</a>
            {links.map((l) => <a key={l.p.name} href={to(l.p)}>{t(l.label)}</a>)}
            <a className="z-btn z-btn-primary" href={to({ name: "book" })}><CalendarCheck size={18} />{t(UI.book)}</a>
            <div className="z-menu-foot"><LangToggle /><a className="z-call" href={`tel:${BRAND.hotline}`}><Phone size={16} />{BRAND.hotline}</a></div>
          </div>
        </div>
      )}
    </header>
  );
}

/** Phones: the five things people come to do, always under the thumb. */
export function MobileBar() {
  const { to, page, world } = useSite();
  const { t } = useLang();
  return (
    <nav className="z-tabbar" aria-label={t(UI.menu)}>
      <a href={to({ name: "home" })} aria-current={page.name === "home" ? "page" : undefined}><Home size={20} /><span>{t(UI.home)}</span></a>
      <a href={to({ name: "world", world: "adults" })} data-w="adults" aria-current={world === "adults" && page.name === "world" ? "page" : undefined}><WorldGlyph world="adults" size={22} /><span>{t(WORLDS.adults.label)}</span></a>
      <a className="z-tab-book" href={to({ name: "book", world })}><CalendarCheck size={22} /><span>{t(UI.bookShort)}</span></a>
      <a href={to({ name: "world", world: "kids" })} data-w="kids" aria-current={world === "kids" && page.name === "world" ? "page" : undefined}><WorldGlyph world="kids" size={22} /><span>{t(WORLDS.kids.label)}</span></a>
      <a href={`tel:${BRAND.hotline}`}><Phone size={20} /><span>{t(UI.call)}</span></a>
    </nav>
  );
}

/** A thin bar in the new world's colour runs across the top when you cross worlds. Decorative only. */
export function WorldWipe() {
  const { world } = useSite();
  const prev = useRef<World | undefined>(world);
  const [key, setKey] = useState<{ n: number; w: World } | null>(null);
  useEffect(() => {
    if (world && prev.current && world !== prev.current) setKey((k) => ({ n: (k?.n ?? 0) + 1, w: world }));
    prev.current = world ?? prev.current;
  }, [world]);
  if (!key) return null;
  return (
    <motion.div
      key={key.n}
      data-w={key.w}
      className="z-wipe"
      aria-hidden
      initial={{ scaleX: 0, opacity: 1 }}
      animate={{ scaleX: [0, 1, 1], opacity: [1, 1, 0] }}
      transition={{ duration: 0.9, times: [0, 0.6, 1], ease: "easeInOut" }}
    />
  );
}

export function Footer() {
  const { to } = useSite();
  const { t } = useLang();
  return (
    <footer className="z-foot">
      <div className="z-wrap z-foot-grid">
        <div className="z-foot-brand">
          <img src={logo} alt={t(BRAND.name)} width={200} height={56} />
          <p>{t(BRAND.line)}</p>
          <a className="z-call z-call-big" href={`tel:${BRAND.hotline}`}><Phone size={20} /><span>{t(UI.hotline)}</span><b className="u-tnum">{BRAND.hotline}</b></a>
        </div>
        {(["adults", "kids"] as World[]).map((w) => (
          <div key={w} className="z-foot-col" data-w={w}>
            <a className="z-foot-h" href={to({ name: "world", world: w })}><WorldGlyph world={w} size={20} />{t(WORLDS[w].label)}</a>
            <FooterServices world={w} />
          </div>
        ))}
        <div className="z-foot-col">
          <span className="z-foot-h">{t(BRAND.name)}</span>
          <a href={to({ name: "doctor" })}>{t(UI.doctor)}</a>
          <a href={to({ name: "branches" })}>{t(UI.branches)}</a>
          <a href={to({ name: "articles" })}>{t(UI.articles)}</a>
          <a href={to({ name: "book" })}>{t(UI.book)}</a>
          <LangToggle />
        </div>
      </div>
      <div className="z-wrap z-foot-base">
        <span>© {new Date().getFullYear()} {t(BRAND.name)} · {t(BRAND.doctor)}</span>
        <span>{t(UI.footerNote)}</span>
      </div>
    </footer>
  );
}

function FooterServices({ world }: { world: World }) {
  const { to } = useSite();
  const { t } = useLang();
  return <>{servicesOf(world).map((s) => <a key={s.id} href={to({ name: "service", id: s.id })}>{t(s.name)}</a>)}</>;
}
