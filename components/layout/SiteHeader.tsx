"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { DICT } from "@/lib/i18n/dict";
import { tr, type Locale } from "@/lib/i18n/types";
import HeartDraw from "@/components/ui/HeartDraw";
import BrandLogo from "@/components/ui/BrandLogo";

export default function SiteHeader({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const NAV = [
    { href: "/#packages", label: tr(DICT.nav.packages, locale) },
    { href: "/mijn-pad", label: tr(DICT.nav.myPath, locale) },
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

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled
          ? "bg-page/90 backdrop-blur-md border-b border-line/40"
          : "bg-transparent"
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
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 w-[82%] max-w-[340px] bg-page-soft z-50 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between h-14 sm:h-16 px-5 border-b border-line/40">
                <span className="font-script text-tan text-2xl">
                  {tr(DICT.nav.menu, locale)}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 -mr-2 flex items-center justify-center text-ink hover:text-tan"
                  aria-label={tr(DICT.nav.closeMenu, locale)}
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-8 px-7 flex flex-col gap-6">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block font-serif text-2xl text-ink hover:text-tan tracking-[0.04em] transition"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="my-6 flex items-center gap-2.5 text-tan">
                  <span className="h-px w-12 bg-tan/55" />
                  <HeartDraw size={14} />
                  <span className="h-px w-12 bg-tan/55" />
                </div>

                <LanguageSwitcher current={locale} variant="mobile" />
              </nav>

              <div className="px-7 py-6 border-t border-line/40 text-[11px] text-muted leading-relaxed">
                <p className="font-script text-tan text-xl mb-2">
                  {tr(DICT.footer.signoff, locale)}
                </p>
                <a
                  href="mailto:contact@thebeautifullife.nl"
                  className="hover:text-tan transition"
                >
                  contact@thebeautifullife.nl
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
