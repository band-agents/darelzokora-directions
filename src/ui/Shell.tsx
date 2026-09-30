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
import { Balloon, Bubble, Star } from "@/remotion/art";
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

/** Static door illustrations, drawn with the same pieces as the films. */
export function DoorArt({ world, outline }: { world: World; outline?: boolean }): ReactNode {
  if (world === "adults") {
    return (
      <svg viewBox="0 0 300 300" width="100%" aria-hidden>
        <Bubble x={90} y={80} r={34} t={0} />
        <Bubble x={250} y={230} r={26} t={0.3} />
        <circle cx={170} cy={160} r={96} fill="rgba(255,255,255,0.75)" stroke={outline ? "#1B1530" : "#fff"} strokeWidth={outline ? 5 : 3} />
        <image href={mark} x={98} y={110} width={144} height={100} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 300 300" width="100%" aria-hidden>
      <Star x={60} y={70} r={20} color="#fff" t={0} />
      <Star x={260} y={150} r={16} color="#fff" t={0.4} />
      <Balloon x={130} y={120} s={0.9} color="#FFB3A7" t={0} />
      <Balloon x={210} y={100} s={1.05} color="#FFE07A" t={0.3} />
    </svg>
  );
}
