"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { DICT } from "@/lib/i18n/dict";
import { tr, type Locale } from "@/lib/i18n/types";
import HeartDivider from "@/components/ui/HeartDivider";

export default function FreeReflectionCta({ locale }: { locale: Locale }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] mt-12 sm:mt-14 overflow-hidden shadow-[0_18px_48px_rgba(60,50,30,0.08)]"
    >
      <span className="absolute top-0 left-0 right-0 h-0.5 bg-sage" />

      <div className="px-6 py-9 sm:px-12 sm:py-12 text-center">
        <p className="font-script text-tan text-2xl sm:text-3xl">
          {tr(DICT.free.eyebrow, locale)}
        </p>
        <h2 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.06em] uppercase mt-2 text-ink">
          {tr(DICT.free.title, locale)}
        </h2>

        <HeartDivider className="my-5" />

        <p className="text-ink-soft text-[15px] leading-[1.85] max-w-md mx-auto">
          {tr(DICT.free.intro, locale)}
        </p>

        <Link
          href="/gratis"
          className="inline-block mt-7 px-7 py-3.5 rounded-[3px] bg-sage hover:bg-sage-deep text-white font-sans text-xs tracking-[0.22em] uppercase transition shadow-[0_6px_18px_rgba(60,50,30,0.12)] hover:shadow-[0_12px_26px_rgba(60,50,30,0.18)] hover:-translate-y-0.5"
        >
          {tr(DICT.free.cta, locale)}
        </Link>
      </div>
    </motion.section>
  );
}
