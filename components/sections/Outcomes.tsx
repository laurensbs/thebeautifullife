"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Locale } from "@/lib/i18n/types";
import HeartDivider from "@/components/ui/HeartDivider";

const COPY = {
  nl: {
    eyebrow: "wat er verandert",
    title: "Het begin van iets dat klopt",
    items: [
      "Je voelt meer rust in je hoofd",
      "Je krijgt helderheid over wat je écht wilt",
      "Je stopt met blijven hangen in oude patronen",
      "Je weet wat bij je past — en wat niet",
      "Je durft keuzes te maken die kloppen voor jou",
    ],
    closing: "En dat is waar alles begint.",
  },
  en: {
    eyebrow: "what changes",
    title: "The beginning of something that fits",
    items: [
      "You feel more calm in your head",
      "You gain clarity about what you truly want",
      "You stop getting stuck in old patterns",
      "You know what fits you — and what doesn't",
      "You dare to make choices that are right for you",
    ],
    closing: "And that is where everything begins.",
  },
} as const;

export default function Outcomes({ locale }: { locale: Locale }) {
  const t = COPY[locale === "en" ? "en" : "nl"];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="mt-14 sm:mt-16 bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] shadow-[0_18px_48px_rgba(60,50,30,0.08)] px-6 py-10 sm:px-12 sm:py-14 max-w-3xl mx-auto relative overflow-hidden"
    >
      <span className="absolute top-0 left-0 right-0 h-0.5 bg-tan" />

      <div className="text-center mb-7">
        <p className="font-script text-tan text-2xl sm:text-3xl">{t.eyebrow}</p>
        <h2 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.04em] text-ink mt-1 leading-snug">
          {t.title}
        </h2>
        <HeartDivider className="my-6" />
      </div>

      <ul className="space-y-3 max-w-md mx-auto">
        {t.items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex items-start gap-3 text-ink-soft text-[15px] leading-[1.7]"
          >
            <span className="flex-none w-5 h-5 rounded-full bg-tan/15 border border-tan/40 inline-flex items-center justify-center mt-0.5">
              <Check size={11} strokeWidth={2} className="text-tan" />
            </span>
            <span>{item}</span>
          </motion.li>
        ))}
      </ul>

      <p className="font-script text-tan text-2xl sm:text-3xl text-center mt-8">
        {t.closing}
      </p>
    </motion.section>
  );
}
