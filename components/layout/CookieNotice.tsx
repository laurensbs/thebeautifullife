"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import HeartDraw from "@/components/ui/HeartDraw";

const STORAGE_KEY = "tbl_cookie_seen";

/**
 * Subtiele cookie-notice rechtsonder. We gebruiken alleen functionele
 * cookies (login + taalvoorkeur) — geen tracking/marketing — dus géén
 * full-screen blokkerend modal. Eén "Begrepen" sluit hem voor altijd
 * (localStorage). Verschijnt na korte vertraging zodat de hero kan
 * landen voor de banner verschijnt.
 */
export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // localStorage niet beschikbaar (private mode) — toon notice maar
      // sla niet op. Acceptable degradation.
    }
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 max-w-[400px] sm:max-w-[380px]"
          role="dialog"
          aria-labelledby="cookie-title"
        >
          <div className="bg-page-soft border border-tan/40 rounded-tl-[24px] rounded-tr-[24px] rounded-b-md shadow-[0_18px_48px_rgba(60,50,30,0.18)] px-5 py-4 sm:px-6 sm:py-5 relative overflow-hidden">
            <span className="absolute top-0 left-0 right-0 h-0.5 bg-tan" />

            <button
              type="button"
              onClick={dismiss}
              className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center text-muted hover:text-tan transition rounded-full"
              aria-label="Sluit"
            >
              <X size={14} strokeWidth={1.6} />
            </button>

            <div className="flex items-start gap-2.5 pr-5">
              <span className="text-tan flex-none mt-1">
                <HeartDraw size={12} />
              </span>
              <div className="flex-1">
                <p
                  id="cookie-title"
                  className="font-script text-tan text-xl leading-none"
                >
                  een klein bericht
                </p>
                <p className="text-ink-soft text-[12.5px] leading-[1.7] mt-2 max-w-prose">
                  We gebruiken alléén functionele cookies — voor je login en
                  taalvoorkeur. Geen tracking, geen advertenties.
                </p>

                <div className="mt-3.5 flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={dismiss}
                    className="bg-ink hover:brightness-110 text-white px-4 py-2 rounded-[3px] font-sans text-[10.5px] tracking-[0.22em] uppercase transition shadow-[0_4px_12px_rgba(60,50,30,0.12)]"
                  >
                    Begrepen
                  </button>
                  <Link
                    href="/privacy"
                    onClick={dismiss}
                    className="text-[10.5px] tracking-[0.22em] uppercase text-ink-soft hover:text-tan transition"
                  >
                    Privacy lezen
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
