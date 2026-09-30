/**
 * The frame every direction shares: providers, chrome, the page router, the
 * world wipe. A direction passes in its root class, its skin, and the two
 * pages it designs itself (home and the world hub).
 */

import type { ComponentType, ReactNode } from "react";
import { motion } from "framer-motion";
import type { World } from "@/content";
import { worldOf, type DirId, type Page } from "@/lib/routes";
import { useLang } from "@/lib/i18n";
import { Footer, Header, MobileBar, WorldWipe } from "./chrome";
import { ArticlesPage, BookPage, BranchesPage, DoctorPage, ServicePage } from "./pages";
import { SiteProvider, makeTo, type Skin } from "./site";
import { GrowthCurve, Rings } from "@/remotion/art";
import mark from "@/brand/logo-mark.svg";

export function Shell({ dir, page, className, skin, Home, World }: {
  dir: DirId; page: Page; className: string; skin: Skin;
  Home: ComponentType; World: ComponentType<{ world: World }>;
}) {
  const { dir: textDir, lang } = useLang();
  const world = worldOf(page);
  const key = JSON.stringify(page) + lang;
  return (
    <SiteProvider value={{ dir, page, world, skin, to: makeTo(dir) }}>
      <div className={`z-site ${className}`} data-world={world} dir={textDir} lang={lang}>
        <Header />
        <WorldWipe />
        <motion.main key={key} className="z-main" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          {page.name === "home" && <Home />}
          {page.name === "world" && <World world={page.world} />}
          {page.name === "service" && <ServicePage id={page.id} />}
          {page.name === "book" && <BookPage world={page.world} service={page.service} />}
          {page.name === "doctor" && <DoctorPage />}
          {page.name === "branches" && <BranchesPage />}
          {page.name === "articles" && <ArticlesPage />}
        </motion.main>
        <Footer />
        <MobileBar />
      </div>
    </SiteProvider>
  );
}

/** Static door illustrations, drawn with the same pieces as the films and coloured by the door's world. */
export function DoorArt({ world }: { world: World }): ReactNode {
  if (world === "adults") {
    return (
      <svg viewBox="0 0 300 300" width="100%" aria-hidden>
        <Rings cx={150} cy={150} r={70} gap={26} n={4} t={0.12} color="var(--accent)" />
        <circle cx={150} cy={150} r={58} fill="var(--surface)" />
        <image href={mark} x={105} y={119} width={90} height={62} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 1000 640" width="100%" aria-hidden>
      <GrowthCurve x={60} y={60} w={880} h={520} t={0.3} color="var(--accent)" soft="var(--surface)" ink="var(--ink)" bare />
    </svg>
  );
}
