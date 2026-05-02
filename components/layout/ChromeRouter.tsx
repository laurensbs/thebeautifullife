"use client";

import { usePathname } from "next/navigation";

const HIDE_PREFIXES = ["/admin", "/werkboek/", "/vragenlijst"];

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
  const hide = HIDE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p)
  );
  if (hide) return <>{children}</>;
  return (
    <>
      {header}
      <div className="flex-1 flex flex-col">{children}</div>
      {footer}
    </>
  );
}
