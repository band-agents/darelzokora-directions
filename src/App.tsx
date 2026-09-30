/**
 * The overview board, then three directions, each a full bilingual site.
 * Switching direction keeps the page you are on, so the same page can be
 * compared across A, B and C; switching language keeps it too.
 */

import { useEffect, useState } from "react";
import { LangProvider, useLang } from "@/lib/i18n";
import { DIRECTIONS, pageHash, readHash, type View } from "@/lib/routes";
import { Overview } from "@/overview/Overview";
import { Clarity } from "@/directions/Clarity";
import { Prestige } from "@/directions/Prestige";
import { Precision } from "@/directions/Precision";

export function App() {
  return <LangProvider><Router /></LangProvider>;
}

function Router() {
  const [view, setView] = useState<View>(readHash);
  const { t } = useLang();

  useEffect(() => {
    const on = () => { setView(readHash()); window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  useEffect(() => {
    const d = view.dir === "overview" ? null : DIRECTIONS.find((x) => x.id === view.dir)!;
    document.title = d ? `${t({ ar: "دار الذكورة", en: "Dar El Zokora" })} · ${d.letter} ${t(d.name)}` : "Dar El Zokora Directions";
  }, [view, t]);

  if (view.dir === "overview") return <Overview />;
  const { dir, page } = view;
  return (
    <>
      {dir === "clarity" && <Clarity page={page} />}
      {dir === "prestige" && <Prestige page={page} />}
      {dir === "precision" && <Precision page={page} />}
      <nav className="sw" aria-label="Directions">
        <a href="#">☰<span className="sw-name"> {t({ ar: "نظرة عامة", en: "Overview" })}</span></a>
        {DIRECTIONS.map((d) => (
          <a key={d.id} href={pageHash(d.id, page)} aria-current={dir === d.id ? "page" : undefined}>
            {d.letter}<span className="sw-name"> {t(d.name)}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
