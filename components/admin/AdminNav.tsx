"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/klanten", label: "Klanten" },
  { href: "/admin/calls", label: "Calls" },
  { href: "/admin/werkboeken", label: "Werkboeken" },
  { href: "/admin/notities", label: "Notities" },
];

export default function AdminNav() {
  const router = useRouter();
  const pathname = usePathname();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  return (
    <header className="sticky top-0 z-30 bg-page-soft/95 backdrop-blur-md border-b border-line/60 shadow-[0_4px_20px_rgba(60,50,30,0.04)]">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <BrandLogo size="sm" linkTo="/admin/dashboard" />
          <span className="text-[10px] tracking-[0.22em] uppercase text-muted border border-line rounded-full px-2 py-0.5">
            admin
          </span>
        </div>
        <nav className="flex items-center gap-1 sm:gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" &&
                pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[11px] tracking-[0.18em] uppercase px-2 py-1.5 transition ${
                  isActive
                    ? "text-tan font-medium"
                    : "text-ink-soft hover:text-tan"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="text-[11px] tracking-[0.18em] uppercase text-ink-soft hover:text-tan transition px-2 py-1.5 inline-flex items-center gap-1.5 ml-1"
            title="Uitloggen"
          >
            <LogOut size={12} />
          </button>
        </nav>
      </div>
    </header>
  );
}
