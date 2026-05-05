"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Mail, CalendarClock, Sparkles, BookOpen, Home, User } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { DICT } from "@/lib/i18n/dict";
import { tr, type Locale } from "@/lib/i18n/types";
import HeartDraw from "@/components/ui/HeartDraw";
import BrandLogo from "@/components/ui/BrandLogo";
import MarionAvatar from "@/components/ui/MarionAvatar";
import HeaderAuthLink from "./HeaderAuthLink";

function capitalize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

export default function SiteHeader({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authedName, setAuthedName] = useState<string | null>(null);

  const NAV = [
    { href: "/over", label: locale === "en" ? "About" : "Over" },
    { href: "/#packages", label: tr(DICT.nav.packages, locale) },
  ];
  const myPathLabel = tr(DICT.nav.myPath, locale);

  // Mobiele drawer-nav — rijker dan de desktop top-nav. Iconen geven
  // ritme; lokale i18n waar bekend, anders simpele NL/EN strings.
  const isEN = locale === "en";
  const DRAWER_NAV: Array<{ href: string; label: string; icon: React.ReactNode }> = [
    { href: "/", label: isEN ? "Home" : "Home", icon: <Home size={16} strokeWidth={1.5} /> },
    { href: "/over", label: isEN ? "About Marion" : "Over Marion", icon: <User size={16} strokeWidth={1.5} /> },
    { href: "/#packages", label: tr(DICT.nav.packages, locale), icon: <Sparkles size={16} strokeWidth={1.5} /> },
    { href: "/gratis", label: isEN ? "Free questionnaire" : "Gratis vragenlijst", icon: <BookOpen size={16} strokeWidth={1.5} /> },
    { href: "/boek-call", label: isEN ? "Book a call" : "Boek een call", icon: <CalendarClock size={16} strokeWidth={1.5} /> },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Sluit drawer met Escape-toets
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Haal auth-state op zodra drawer opent (alleen voor drawer; de
  // desktop HeaderAuthLink doet zijn eigen fetch).
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch("/api/client/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.ok && data.firstName) {
          setAuthedName(String(data.firstName));
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300 ease-out ${
        scrolled
          ? "bg-page-soft border-b border-line/60 shadow-[0_4px_20px_rgba(60,50,30,0.06)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1180px] mx-auto px-5 sm:px-6 py-3 flex items-center justify-between">
        <BrandLogo size="sm" linkTo="/" />


        <nav className="hidden md:flex items-center gap-7">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[11px] tracking-[0.22em] uppercase text-ink-soft hover:text-tan transition relative group"
            >
              {item.label}
              <span className="absolute left-0 right-0 -bottom-1 h-px bg-tan scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
          ))}
          <HeaderAuthLink fallbackLabel={myPathLabel} />
          <LanguageSwitcher current={locale} />
        </nav>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="md:hidden w-10 h-10 -mr-2 flex items-center justify-center text-ink hover:text-tan transition"
          aria-label={tr(DICT.nav.openMenu, locale)}
          aria-expanded={open}
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 w-[88%] max-w-[360px] bg-page-soft z-50 md:hidden flex flex-col shadow-[-12px_0_40px_rgba(60,50,30,0.12)]"
              role="dialog"
              aria-modal="true"
              aria-label={tr(DICT.nav.menu, locale)}
            >
              {/* Header — brand + close */}
              <div className="flex items-center justify-between h-14 sm:h-16 px-5 border-b border-line/40 flex-none">
                <BrandLogo size="sm" linkTo="/" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 -mr-2 flex items-center justify-center text-ink hover:text-tan transition rounded-full"
                  aria-label={tr(DICT.nav.closeMenu, locale)}
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Auth-state — als ingelogd: prominent "Het pad van X" */}
              {authedName && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="px-7 pt-6 pb-2 flex-none"
                >
                  <Link
                    href="/mijn-pad"
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-3 bg-page rounded-md border border-tan/30 px-4 py-3 hover:border-tan transition"
                  >
                    <MarionAvatar size={40} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] tracking-[0.22em] uppercase text-muted">
                        {isEN ? "your path" : "jouw pad"}
                      </p>
                      <p className="font-script text-tan text-[22px] leading-none mt-0.5">
                        {capitalize(authedName)}
                      </p>
                    </div>
                    <ArrowRight size={14} className="text-tan group-hover:translate-x-0.5 transition" />
                  </Link>
                </motion.div>
              )}

              {/* Nav-lijst */}
              <nav className="flex-1 overflow-y-auto py-6 px-2">
                <p className="px-5 text-[10px] tracking-[0.32em] uppercase text-muted mb-3">
                  {isEN ? "explore" : "ontdek"}
                </p>
                <ul className="space-y-1">
                  {DRAWER_NAV.map((item, i) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.12 + i * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-center gap-3.5 mx-3 px-4 py-3 rounded-md text-ink hover:bg-page hover:text-tan transition"
                      >
                        <span className="flex-none w-8 h-8 rounded-full bg-tan/10 text-tan flex items-center justify-center group-hover:bg-tan group-hover:text-white transition">
                          {item.icon}
                        </span>
                        <span className="font-serif text-[19px] tracking-[0.02em]">
                          {item.label}
                        </span>
                        <ArrowRight
                          size={14}
                          className="ml-auto text-tan/40 group-hover:text-tan group-hover:translate-x-0.5 transition"
                        />
                      </Link>
                    </motion.li>
                  ))}
                  {/* Mijn pad — alleen tonen als NIET ingelogd (anders staat 'Het pad van X' al boven) */}
                  {!authedName && (
                    <motion.li
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.12 + DRAWER_NAV.length * 0.05,
                      }}
                    >
                      <Link
                        href="/mijn-pad"
                        onClick={() => setOpen(false)}
                        className="group flex items-center gap-3.5 mx-3 px-4 py-3 rounded-md text-ink hover:bg-page hover:text-tan transition"
                      >
                        <span className="flex-none w-8 h-8 rounded-full bg-tan/10 text-tan flex items-center justify-center group-hover:bg-tan group-hover:text-white transition">
                          <ArrowRight size={16} strokeWidth={1.5} />
                        </span>
                        <span className="font-serif text-[19px] tracking-[0.02em]">
                          {myPathLabel}
                        </span>
                      </Link>
                    </motion.li>
                  )}
                </ul>

                {/* Hartjes-divider + taal */}
                <div className="my-7 mx-7 flex items-center gap-2.5 text-tan">
                  <span className="h-px flex-1 bg-tan/40" />
                  <HeartDraw size={13} />
                  <span className="h-px flex-1 bg-tan/40" />
                </div>

                <div className="px-7">
                  <p className="text-[10px] tracking-[0.32em] uppercase text-muted mb-3">
                    {isEN ? "language" : "taal"}
                  </p>
                  <LanguageSwitcher current={locale} variant="mobile" />
                </div>
              </nav>

              {/* Footer — Marion-portret + signoff + contact */}
              <div className="px-7 py-5 border-t border-line/40 flex items-center gap-3.5 flex-none bg-page-dark/30">
                <MarionAvatar size={42} />
                <div className="flex-1 min-w-0">
                  <p className="font-script text-tan text-[20px] leading-none">
                    {tr(DICT.footer.signoff, locale)}
                  </p>
                  <a
                    href="mailto:contact@thebeautifullife.nl"
                    className="inline-flex items-center gap-1 text-[11px] text-ink-soft hover:text-tan transition mt-1.5"
                  >
                    <Mail size={10} />
                    contact@thebeautifullife.nl
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
