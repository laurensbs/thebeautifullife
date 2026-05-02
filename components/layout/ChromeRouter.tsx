"use client";

import { usePathname } from "next/navigation";

// Routes met eigen chrome (admin paneel, werkboek-renderer, vragenlijst).
// /werkboek/login krijgt wél header/footer (entry-point voor klanten).
const HIDE_PREFIXES = ["/admin", "/vragenlijst"];

function shouldHideChrome(pathname: string): boolean {
  if (HIDE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p))) {
    return true;
  }
  // Werkboek renderer (slug-routes) is een immersieve flow; login niet.
  if (pathname.startsWith("/werkboek/") && pathname !== "/werkboek/login") {
    return true;
  }
  return false;
}

export default function ChromeRouter({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "/";
  if (shouldHideChrome(pathname)) return <>{children}</>;
  return (
    <>
      {header}
      <div className="flex-1 flex flex-col">{children}</div>
      {footer}
    </>
  );
}
