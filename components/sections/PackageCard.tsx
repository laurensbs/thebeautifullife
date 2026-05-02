"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { PACKAGES } from "@/lib/packages";
import { DICT } from "@/lib/i18n/dict";
import { tr, type Locale } from "@/lib/i18n/types";
import Calligraphy from "@/components/ui/Calligraphy";
import HeartDraw from "@/components/ui/HeartDraw";

type Pkg = (typeof PACKAGES)[keyof typeof PACKAGES];

const ACCENT_BG: Record<Pkg["accent"], string> = {
  sage: "bg-sage hover:bg-sage-deep",
  tan: "bg-tan hover:brightness-95",
  gold: "bg-gold hover:brightness-95",
};

const KICKER: Record<Pkg["slug"], keyof typeof DICT.packages> = {
  ikigai: "kicker1",
  alignment: "kicker2",
  experience: "kicker3",
};

export default function PackageCard({
  pkg,
  index,
  locale,
}: {
  pkg: Pkg;
  index: number;
  locale: Locale;
}) {
  const slug = pkg.slug;
  const nameLines = DICT.packages.nameLines[slug][locale];
  const tagline = tr(DICT.packages.tagline[slug], locale);
  const quote = tr(DICT.packages.quote[slug], locale);
  const features = DICT.packages.features[slug][locale];
  const kickerKey = KICKER[slug];
  const kicker = tr(DICT.packages[kickerKey] as { nl: string; en: string }, locale);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.9,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -6 }}
      className="group relative bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-bl-[6px] rounded-br-[6px] overflow-hidden shadow-[0_12px_40px_rgba(60,50,30,0.08)] hover:shadow-[0_22px_50px_rgba(60,50,30,0.14)] transition-shadow duration-500 flex flex-col h-full"
    >
      <div
        className="relative h-[200px] sm:h-[240px] lg:h-[260px] overflow-hidden bg-gradient-to-br from-page-dark to-line"
      >
        {pkg.imageUrl ? (
          <Image
            src={pkg.imageUrl}
            alt={pkg.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/70 font-serif tracking-[0.2em] text-sm">
            PACKAGE {pkg.number} IMAGE
          </div>
        )}
      </div>

      <div className="px-6 sm:px-8 lg:px-9 py-7 sm:py-8 lg:py-9 text-center flex flex-col flex-1">
        <Calligraphy
          as="p"
          className="font-script text-tan text-2xl font-normal mb-2.5"
          text={kicker}
          durationPerChar={0.07}
        />
        <h3 className="font-serif font-medium text-[22px] tracking-[0.18em] uppercase leading-tight text-ink">
          {nameLines[0]}
          {nameLines[1] && (
            <>
              <br />
              {nameLines[1]}
            </>
          )}
        </h3>
        <p className="mt-3.5 text-[11px] tracking-[0.18em] uppercase text-ink-soft leading-[1.7]">
          {tagline}
        </p>

        <div className="my-5 flex items-center justify-center gap-2 text-tan">
          <span className="h-px w-10 bg-tan/55" />
          <HeartDraw size={11} />
          <span className="h-px w-10 bg-tan/55" />
        </div>

        <ul className="mx-auto max-w-[280px] text-left flex flex-col gap-2.5 text-[14px] text-ink">
          {features.map((f) => (
            <li key={f} className="flex gap-2.5 leading-snug">
              <span className="flex-none w-4 h-4 rounded-full border border-tan inline-flex items-center justify-center mt-0.5">
                <Check size={9} strokeWidth={2.2} className="text-tan" />
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* Spacer pusht knop + quote naar onderen zodat alle 3 cards
            de knop op dezelfde hoogte hebben, ongeacht features-aantal */}
        <div className="flex-1" />

        <Link
          href={`/pakket/${pkg.slug}`}
          className={`mt-7 mx-auto block w-full max-w-[240px] text-center px-5 py-3.5 rounded-[3px] text-white font-serif text-[22px] tracking-[0.06em] shadow-[0_6px_18px_rgba(60,50,30,0.12)] hover:shadow-[0_12px_26px_rgba(60,50,30,0.18)] hover:-translate-y-0.5 transition ${ACCENT_BG[pkg.accent]}`}
        >
          {pkg.priceLabel}
        </Link>

        <Calligraphy
          as="p"
          className="mt-5 font-script text-tan text-xl leading-snug min-h-[3.5rem] flex items-center justify-center"
          text={quote}
          durationPerChar={0.04}
          delay={0.2}
        />
      </div>
    </motion.article>
  );
}
