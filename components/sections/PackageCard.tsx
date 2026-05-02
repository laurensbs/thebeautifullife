"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { PACKAGES } from "@/lib/packages";

type Pkg = (typeof PACKAGES)[keyof typeof PACKAGES];

const ACCENT_BG: Record<Pkg["accent"], string> = {
  sage: "bg-sage hover:bg-sage-deep",
  tan: "bg-tan hover:brightness-95",
  gold: "bg-gold hover:brightness-95",
};

export default function PackageCard({
  pkg,
  index,
}: {
  pkg: Pkg;
  index: number;
}) {
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
      className="relative bg-page-soft rounded-[6px] overflow-hidden shadow-[0_12px_40px_rgba(60,50,30,0.08)] hover:shadow-[0_22px_50px_rgba(60,50,30,0.14)] transition-shadow duration-500 flex flex-col"
    >
      {/* Number badge */}
      <span className="absolute top-3.5 left-1/2 -translate-x-1/2 z-10 w-9 h-9 rounded-full bg-page-soft border border-tan text-tan font-serif text-lg font-medium flex items-center justify-center">
        {pkg.number}
      </span>

      {/* Image */}
      <div
        className={`h-[260px] flex items-center justify-center text-white/70 font-serif tracking-[0.2em] text-sm bg-gradient-to-br from-page-dark to-line ${
          pkg.number === 3 ? "rounded-bl-[60px] rounded-br-[60px]" : ""
        }`}
      >
        PACKAGE {pkg.number} IMAGE
      </div>

      {/* Body */}
      <div className="px-9 py-9 text-center flex flex-col flex-1">
        <p className="font-script text-tan text-2xl font-normal mb-2.5">
          {pkg.kicker}
        </p>
        <h3 className="font-serif font-medium text-[22px] tracking-[0.18em] uppercase leading-tight text-ink">
          {pkg.nameLines[0]}
          {pkg.nameLines[1] && (
            <>
              <br />
              {pkg.nameLines[1]}
            </>
          )}
        </h3>
        <p className="mt-3.5 text-[11px] tracking-[0.18em] uppercase text-ink-soft leading-[1.7]">
          {pkg.tagline}
        </p>

        <div className="my-5 flex items-center justify-center gap-2 text-tan">
          <span className="h-px w-10 bg-tan/55" />
          <span className="text-[11px]">♡</span>
          <span className="h-px w-10 bg-tan/55" />
        </div>

        <ul className="mx-auto max-w-[280px] text-left flex flex-col gap-2.5 text-[14px] text-ink">
          {pkg.features.map((f) => (
            <li key={f} className="flex gap-2.5 leading-snug">
              <span className="flex-none w-4 h-4 rounded-full border border-tan inline-flex items-center justify-center mt-0.5">
                <Check size={9} strokeWidth={2.2} className="text-tan" />
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <Link
          href={`/pakket/${pkg.slug}`}
          className={`mt-7 mx-auto block w-full max-w-[240px] text-center px-5 py-3.5 rounded-[3px] text-white font-serif text-[22px] tracking-[0.06em] shadow-[0_6px_18px_rgba(60,50,30,0.12)] hover:shadow-[0_12px_26px_rgba(60,50,30,0.18)] hover:-translate-y-0.5 transition ${ACCENT_BG[pkg.accent]}`}
        >
          {pkg.priceLabel}
        </Link>

        <p className="mt-5 font-script text-tan text-xl leading-snug">
          {pkg.quote}
        </p>
      </div>
    </motion.article>
  );
}
