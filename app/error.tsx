"use client";

import { useEffect } from "react";
import Link from "next/link";
import HeartDivider from "@/components/ui/HeartDivider";
import BrandLogo from "@/components/ui/BrandLogo";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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

        <p className="font-script text-tan text-3xl sm:text-4xl">
          er ging iets mis
        </p>
        <h1 className="font-serif font-medium text-xl sm:text-2xl tracking-[0.06em] uppercase mt-3 text-ink">
          Een onverwachte hapering
        </h1>

        <HeartDivider className="my-6" />

        <p className="text-ink-soft text-[15px] leading-[1.85] max-w-md mx-auto">
          We zijn op de hoogte gebracht. Probeer het opnieuw, of keer terug naar
          de homepage.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-block bg-ink hover:brightness-110 text-white px-7 py-3.5 rounded-[3px] font-sans text-xs tracking-[0.22em] uppercase transition shadow-[0_6px_18px_rgba(60,50,30,0.12)]"
          >
            Probeer opnieuw
          </button>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-[3px] border border-ink/30 text-ink hover:border-tan hover:text-tan font-sans text-xs tracking-[0.22em] uppercase transition"
          >
            Naar de site
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-[10px] tracking-[0.18em] uppercase text-muted">
            ref · {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
