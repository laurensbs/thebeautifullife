"use client";

import { useEffect } from "react";

/**
 * Activeer smooth-scroll alleen bij klik op een hash-link
 * (bv. /#packages of #packages). Voor Next.js-navigatie blijft
 * de browser-default scroll-restoration (instant naar boven).
 *
 * Dit voorkomt dat klik op 'Mijn pad' of een andere route eerst
 * naar onder lijkt te scrollen — zonder dat we hash-navigatie kwijt zijn.
 */
export default function SmoothHashScroll() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as HTMLElement | null)?.closest("a");
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href) return;

      // Alleen voor hash-only of /#hash
      const isHashOnly = href.startsWith("#");
      const isHomeHash = href.startsWith("/#");
      if (!isHashOnly && !isHomeHash) return;

      // Alleen op huidige pagina — voor cross-page (/#packages vanuit /over)
      // laat Next.js de navigatie doen, browser positioneert daarna.
      const currentPath = window.location.pathname;
      const targetPath = isHomeHash ? "/" : currentPath;
      if (currentPath !== targetPath) return;

      const hash = href.includes("#") ? href.slice(href.indexOf("#") + 1) : "";
      if (!hash) return;

      const el = document.getElementById(hash);
      if (!el) return;

      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update URL zonder reload
      history.pushState(null, "", `#${hash}`);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
