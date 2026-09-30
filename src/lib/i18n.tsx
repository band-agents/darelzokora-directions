/**
 * Arabic first, English on request.
 *
 * The chosen language is remembered per browser (localStorage, guarded: it can
 * be unavailable in a private window) and mirrored onto <html lang dir>, so the
 * browser's own UI (scrollbars, form controls, text selection) follows the
 * direction too. Every visible string is an L = { ar, en } pair; `t` picks.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { L } from "@/content";

export type Lang = "ar" | "en";

const KEY = "dz-lang";
const read = (): Lang => {
  try { return localStorage.getItem(KEY) === "en" ? "en" : "ar"; } catch { return "ar"; }
};

interface Ctx { lang: Lang; dir: "rtl" | "ltr"; setLang: (l: Lang) => void; t: (x: L) => string }
const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, set] = useState<Lang>(read);
  const setLang = useCallback((l: Lang) => {
    set(l);
    try { localStorage.setItem(KEY, l); } catch { /* per-visit only */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const value = useMemo<Ctx>(() => ({
    lang, dir: lang === "ar" ? "rtl" : "ltr", setLang, t: (x: L) => x[lang],
  }), [lang, setLang]);

  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const c = useContext(LangCtx);
  if (!c) throw new Error("useLang outside LangProvider");
  return c;
}

/** Western digits in both languages, grouped the same way; the current site does the same. */
export const num = (n: number) => n.toLocaleString("en-US");
