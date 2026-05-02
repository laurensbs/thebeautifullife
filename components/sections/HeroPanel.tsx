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
          <Calligraphy
            as="span"
            className="block font-script font-normal text-[clamp(54px,9vw,96px)] tracking-[0.02em] -mt-2 lg:ml-[60px]"
            text="Life"
            duration={1.6}
            delay={0.6}
            underline
          />
        </h1>

        <HeartDivider className="mt-6 mb-4 lg:!justify-start" />


        <p className="font-sans text-[12px] sm:text-[13px] tracking-[0.28em] sm:tracking-[0.32em] uppercase text-ink text-center lg:text-left">
          {tr(DICT.hero.threePaths, locale)}
          <strong className="block font-medium text-tan tracking-[0.28em] sm:tracking-[0.32em] mt-1.5">
            {tr(DICT.hero.yourIdealLife, locale)}
          </strong>
        </p>

        <p className="mt-6 max-w-[360px] mx-auto lg:mx-0 text-ink-soft text-[14px] sm:text-[15px] leading-[1.7] pb-8 lg:pb-16 text-center lg:text-left">
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
          src="https://u.cubeupload.com/laurensbos/beautifullife.png"
          alt={tr(DICT.hero.imageAlt, locale)}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover object-top"
        />
      </motion.div>

      <div className="lg:absolute lg:left-[46%] lg:right-0 lg:bottom-0 bg-sage text-white grid grid-cols-2 sm:grid-cols-4 gap-y-3 px-4 sm:px-6 lg:px-8 py-4 lg:rounded-tl-[4px]">
        {FEATURES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center justify-center gap-2 text-[10px] sm:text-[11px] tracking-[0.16em] sm:tracking-[0.22em] uppercase font-medium"
          >
            <Icon size={15} strokeWidth={1.5} />
            <span className="whitespace-nowrap">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
