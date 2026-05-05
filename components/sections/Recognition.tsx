"use client";

import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n/types";
import HeartDivider from "@/components/ui/HeartDivider";

const COPY = {
  nl: {
    eyebrow: "misschien herken je dit",
    title: "Je voelt dat er meer in je zit",
    lines: [
      "Je hoofd blijft zoeken — maar je komt niet echt in beweging.",
      "Misschien ben je iets kwijtgeraakt, of op een punt gekomen waar je opnieuw moet kiezen.",
      "Je hoeft het niet alleen te doen.",
    ],
  },
  en: {
    eyebrow: "perhaps you recognise this",
    title: "You sense there's more in you",
    lines: [
      "Your head keeps searching — but you're not really moving.",
      "Maybe you've lost something, or arrived at a point where you have to choose again.",
      "You don't have to do this alone.",
    ],
  },
} as const;

export default function Recognition({ locale }: { locale: Locale }) {
  const t = COPY[locale === "en" ? "en" : "nl"];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="mt-12 sm:mt-14 px-3 sm:px-6 text-center max-w-2xl mx-auto"
    >
      <p className="font-script text-tan text-2xl sm:text-3xl">{t.eyebrow}</p>
      <h2 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.04em] text-ink mt-2 leading-snug">
        {t.title}
      </h2>
      <HeartDivider className="my-6" />
      <div className="space-y-3">
        {t.lines.map((line, i) => (
          <p
            key={i}
            className="text-ink-soft text-[15px] sm:text-[16px] leading-[1.85] italic font-serif"
          >
            {line}
          </p>
        ))}
      </div>
    </motion.section>
  );
}
