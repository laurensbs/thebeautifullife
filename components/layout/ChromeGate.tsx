"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

// Pagina's met eigen chrome (admin paneel, werkboek-renderer, vragenlijst)
// krijgen geen site-header/footer.
const HIDE_PREFIXES = ["/admin", "/werkboek/", "/vragenlijst"];

export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const hide = HIDE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p)
  );
  if (hide) return <>{children}</>;

  return (
    <>
      <SiteHeader />
      <div className="flex-1 flex flex-col">{children}</div>
      <SiteFooter />
    </>
  );
}
