"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeartDivider from "@/components/ui/HeartDivider";
import BrandLogo from "@/components/ui/BrandLogo";

const COPY = {
  nl: {
    eyebrow: "er ging iets mis",
    title: "Een onverwachte hapering",
    body: "We zijn op de hoogte gebracht. Probeer het opnieuw, of keer terug naar de homepage.",
    retry: "Probeer opnieuw",
    home: "Naar de site",
    ref: "ref",
  },
  en: {
    eyebrow: "something went wrong",
    title: "An unexpected hiccup",
    body: "We've been notified. Try again, or return to the homepage.",
    retry: "Try again",
    home: "To the site",
    ref: "ref",
  },
} as const;

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Lees locale uit <html lang> die door de root layout is gezet — geen
  // server-component beschikbaar binnen error boundary.
  const [locale, setLocale] = useState<"nl" | "en">("nl");
  useEffect(() => {
    const lang = document.documentElement.lang;
    setLocale(lang === "en" ? "en" : "nl");
  }, []);
  const t = COPY[locale];

  useEffect(() => {
    console.error("App error boundary:", error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-5 sm:px-6 py-16">
      <div className="max-w-[560px] w-full bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] px-6 py-12 sm:px-12 sm:py-14 shadow-[0_18px_48px_rgba(60,50,30,0.08)] text-center relative overflow-hidden">
        <span className="absolute top-0 left-0 right-0 h-0.5 bg-tan" />

        <div className="flex justify-center mb-5">
          <BrandLogo size="md" align="center" />
        </div>

        <p className="font-script text-tan text-3xl sm:text-4xl">{t.eyebrow}</p>
        <h1 className="font-serif font-medium text-xl sm:text-2xl tracking-[0.06em] uppercase mt-3 text-ink">
          {t.title}
        </h1>

        <HeartDivider className="my-6" />

        <p className="text-ink-soft text-[15px] leading-[1.85] max-w-md mx-auto">
          {t.body}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-block bg-ink hover:brightness-110 text-white px-7 py-3.5 rounded-[3px] font-sans text-xs tracking-[0.22em] uppercase transition shadow-[0_6px_18px_rgba(60,50,30,0.12)]"
          >
            {t.retry}
          </button>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-[3px] border border-ink/30 text-ink hover:border-tan hover:text-tan font-sans text-xs tracking-[0.22em] uppercase transition"
          >
            {t.home}
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-[10px] tracking-[0.18em] uppercase text-muted">
            {t.ref} · {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
