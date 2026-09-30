import { useEffect, useState } from "react";

/**
 * Header state every direction needs: whether the page has scrolled past the
 * hero's top edge (solid header), and the mobile menu. The menu locks body
 * scroll while open and closes on Escape.
 */
export function useHeader(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > threshold);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [threshold]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [open]);

  return { scrolled, open, setOpen };
}
