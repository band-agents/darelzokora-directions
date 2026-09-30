/**
 * Routes: #<direction>/<page>[/<id>]
 *
 *   #clarity               home
 *   #clarity/adults        the adults world
 *   #clarity/kids          the kids world
 *   #clarity/s/torsion     one service (its world comes from the service)
 *   #clarity/book[/kids|/s/<id>]   booking, optionally pre-set
 *   #clarity/doctor  #clarity/branches  #clarity/articles
 *
 * An empty hash is the overview board. Hash routing because the build is
 * served from GitHub Pages and also shipped as a single standalone file.
 */

import { serviceById, type World } from "@/content";

export const DIRECTIONS = [
  { id: "clarity", letter: "A", name: { ar: "وضوح", en: "Clarity" } },
  { id: "prestige", letter: "B", name: { ar: "وقار", en: "Prestige" } },
  { id: "precision", letter: "C", name: { ar: "دقة", en: "Precision" } },
] as const;
export type DirId = (typeof DIRECTIONS)[number]["id"];

export type Page =
  | { name: "home" }
  | { name: "world"; world: World }
  | { name: "service"; id: string }
  | { name: "book"; world?: World; service?: string }
  | { name: "doctor" }
  | { name: "branches" }
  | { name: "articles" };

export type View = { dir: "overview" } | { dir: DirId; page: Page };

export function readHash(): View {
  const parts = window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const dir = DIRECTIONS.find((d) => d.id === parts[0])?.id;
  if (!dir) return { dir: "overview" };
  const [, a, b, c] = parts;
  let page: Page = { name: "home" };
  if (a === "adults" || a === "kids") page = { name: "world", world: a };
  else if (a === "s" && b && serviceById(b)) page = { name: "service", id: b };
  else if (a === "book") {
    if (b === "adults" || b === "kids") page = { name: "book", world: b };
    else if (b === "s" && c && serviceById(c)) page = { name: "book", service: c, world: serviceById(c)!.world };
    else page = { name: "book" };
  } else if (a === "doctor" || a === "branches" || a === "articles") page = { name: a };
  return { dir, page };
}

export function pageHash(dir: DirId, p: Page): string {
  switch (p.name) {
    case "home": return `#${dir}`;
    case "world": return `#${dir}/${p.world}`;
    case "service": return `#${dir}/s/${p.id}`;
    case "book": return p.service ? `#${dir}/book/s/${p.service}` : p.world ? `#${dir}/book/${p.world}` : `#${dir}/book`;
    default: return `#${dir}/${p.name}`;
  }
}

/** Which world a page belongs to, if any. Drives the colour theme. */
export function worldOf(p: Page): World | undefined {
  if (p.name === "world") return p.world;
  if (p.name === "service") return serviceById(p.id)?.world;
  if (p.name === "book") return p.world;
  return undefined;
}
