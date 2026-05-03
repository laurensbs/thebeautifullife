"use client";

import { motion } from "framer-motion";
import { Lightbulb, Calendar, Sprout, Heart, Sparkles } from "lucide-react";
import { DICT } from "@/lib/i18n/dict";
import { tr, type Locale } from "@/lib/i18n/types";

const ICONS = [Lightbulb, Calendar, Sprout, Heart, Sparkles];

export default function WhatYouGet({ locale }: { locale: Locale }) {
  const items = DICT.whatYouGet.items[locale];
  return (
    <section className="bg-page-dark rounded-[6px] py-9 px-6 sm:py-10 sm:px-8">
      <h2 className="text-center font-serif font-medium tracking-[0.28em] sm:tracking-[0.32em] text-[12px] sm:text-sm uppercase text-ink mb-6 sm:mb-7 flex items-center justify-center">
        <span className="inline-block h-px w-7 sm:w-9 bg-tan/50 mr-3 sm:mr-3.5" />
        {tr(DICT.whatYouGet.title, locale)}
        <span className="inline-block h-px w-7 sm:w-9 bg-tan/50 ml-3 sm:ml-3.5" />
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-4 lg:gap-5">
        {items.map((text, i) => {
          const Icon = ICONS[i];
          return (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              whileHover={{ y: -3 }}
              className="text-center px-3 lg:px-2 text-[12px] sm:text-[13px] text-ink leading-[1.55] lg:border-r lg:border-tan/35 lg:last:border-r-0"
            >
              <div className="w-11 h-11 mx-auto mb-3 text-tan flex items-center justify-center">
                <Icon size={28} strokeWidth={1.4} />
              </div>
              {text}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
