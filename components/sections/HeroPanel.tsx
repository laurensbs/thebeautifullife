"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sun, Leaf, Heart, Sparkles } from "lucide-react";
import { DICT } from "@/lib/i18n/dict";
import { tr, type Locale } from "@/lib/i18n/types";
import Calligraphy from "@/components/ui/Calligraphy";
import HeartDivider from "@/components/ui/HeartDivider";

export default function HeroPanel({ locale }: { locale: Locale }) {
  const FEATURES = [
    { icon: Sun, label: tr(DICT.hero.feat.clarity, locale) },
    { icon: Leaf, label: tr(DICT.hero.feat.balance, locale) },
    { icon: Heart, label: tr(DICT.hero.feat.freedom, locale) },
    { icon: Sparkles, label: tr(DICT.hero.feat.you, locale) },
  ];

  return (
    <section className="relative bg-page-soft rounded-[6px] overflow-hidden shadow-[0_12px_40px_rgba(60,50,30,0.08)] grid lg:grid-cols-[1fr_1.05fr]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="px-6 pt-10 pb-8 sm:px-12 sm:pt-14 sm:pb-10 lg:pb-0"
      >
        <h1 className="font-serif text-ink leading-none tracking-[0.04em] font-medium text-center lg:text-left">
          {/* "The" wordt opzettelijk een eigen text-center block; zo blijft hij
              gecentreerd boven Beautiful, óók op desktop wanneer de rest van
              de h1 links uitlijnt. De negatieve margin-right compenseert de
              optische uithang van letterspacing 0.32em. */}
          {/* "The" overlapt subtiel de bovenkant van Beautiful (zacht layering) */}
          <span className="relative z-10 block uppercase tracking-[0.32em] text-[clamp(18px,2.4vw,26px)] font-medium text-ink-soft text-center -mr-[0.32em] -mb-[0.4em] sm:-mb-[0.5em]">
            The
          </span>
          <span className="block uppercase tracking-[0.18em] text-[clamp(40px,7vw,72px)] font-medium">
            Beautiful
          </span>
          {/* "Life" gecentreerd onder Beautiful, groter, semi-transparant.
              De L-staart ligt -mt over Beautiful zodat hij door de letters
              heen valt — text-center op alle breakpoints. */}
          <Calligraphy
            as="span"
            className="block font-script font-normal text-[clamp(56px,10vw,108px)] tracking-[0.02em] -mt-[0.14em] sm:-mt-[0.18em] text-center text-ink/85 leading-[0.95]"
            text="Life"
          />
        </h1>

        <HeartDivider className="mt-6 mb-4" />

        <p className="font-sans text-[12px] sm:text-[13px] tracking-[0.28em] sm:tracking-[0.32em] uppercase text-ink text-center">
          {tr(DICT.hero.threePaths, locale)}
          <strong className="block font-medium text-tan tracking-[0.28em] sm:tracking-[0.32em] mt-1.5">
            {tr(DICT.hero.yourIdealLife, locale)}
          </strong>
        </p>

        <p className="mt-6 max-w-[360px] mx-auto text-ink-soft text-[14px] sm:text-[15px] leading-[1.7] pb-8 lg:pb-16 text-center">
          {tr(DICT.hero.lead, locale)}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.2 }}
        className="relative min-h-[280px] sm:min-h-[380px] lg:min-h-[560px] bg-page-dark"
      >
        <Image
          src="https://u.cubeupload.com/laurensbos/bf5fdd986cf4196c6c66.jpeg"
          alt={tr(DICT.hero.imageAlt, locale)}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover object-top"
        />
      </motion.div>

      <div className="lg:absolute lg:left-[46%] lg:right-0 lg:bottom-0 bg-sage text-white grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-3 px-3 sm:px-4 lg:px-5 py-4 lg:rounded-tl-[4px]">
        {FEATURES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] lg:text-[10.5px] tracking-[0.1em] sm:tracking-[0.12em] lg:tracking-[0.14em] uppercase font-medium"
          >
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 flex-none">
              <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
            </span>
            <span className="whitespace-nowrap">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
