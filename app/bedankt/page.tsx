import Link from "next/link";
import { Heart } from "lucide-react";
import { PACKAGES, isPackageSlug } from "@/lib/packages";
import { getLocale } from "@/lib/i18n/server";
import { DICT } from "@/lib/i18n/dict";
import { tr } from "@/lib/i18n/types";

export default async function Bedankt({
  searchParams,
}: {
  searchParams: Promise<{ pkg?: string }>;
}) {
  const { pkg: pkgParam } = await searchParams;
  const slug = isPackageSlug(pkgParam) ? pkgParam : null;
  const pkg = slug ? PACKAGES[slug] : null;
  const locale = await getLocale();

  const next = slug
    ? tr(DICT.thanks.next[slug], locale)
    : tr(DICT.thanks.next.generic, locale);

  return (
    <main className="max-w-[680px] mx-auto px-5 sm:px-6 py-16 sm:py-20 text-center">
      <div className="bg-page-soft rounded-[6px] px-6 py-12 sm:px-14 sm:py-16 shadow-[0_12px_40px_rgba(60,50,30,0.08)]">
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-full bg-tan/10 border border-tan/40 flex items-center justify-center">
            <Heart size={22} className="text-tan fill-tan" strokeWidth={0} />
          </div>
        </div>

        <p className="font-script text-tan text-3xl sm:text-4xl">
          {tr(DICT.thanks.word, locale)}
        </p>
        <h1 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.06em] uppercase mt-2 text-ink">
          {tr(DICT.thanks.title, locale)}
        </h1>

        {pkg && (
          <p className="mt-4 text-[12px] tracking-[0.22em] uppercase text-ink-soft">
            {tr(DICT.packages.name[pkg.slug], locale)} — {pkg.priceLabel}
          </p>
        )}

        <p className="mt-6 text-ink-soft text-[15px] leading-[1.8] max-w-md mx-auto">
          {next}
        </p>

        <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/mijn-pad/login"
            className="inline-block px-7 py-3 rounded-[3px] bg-ink hover:brightness-110 text-white font-sans text-xs tracking-[0.22em] uppercase transition shadow-[0_6px_18px_rgba(60,50,30,0.12)]"
          >
            {tr(DICT.thanks.toPortal, locale)}
          </Link>
          <Link
            href="/"
            className="inline-block px-7 py-3 rounded-[3px] border border-ink/30 text-ink hover:border-tan hover:text-tan font-sans text-xs tracking-[0.22em] uppercase transition"
          >
            {tr(DICT.common.backToHome, locale)}
          </Link>
        </div>

        <p className="mt-7 text-[12px] text-muted leading-relaxed max-w-sm mx-auto">
          {tr(DICT.thanks.portalNote, locale)}
        </p>
      </div>
    </main>
  );
}
