"use client";

import { motion } from "framer-motion";
import { DICT } from "@/lib/i18n/dict";
import { tr, type Locale } from "@/lib/i18n/types";

export default function Closing({ locale }: { locale: Locale }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="text-center px-3 mt-11"
    >
      <p className="font-sans text-[13px] tracking-[0.36em] uppercase text-ink">
        {tr(DICT.closing.caps, locale)}
      </p>
      <p className="font-script text-3xl sm:text-4xl text-ink mt-2.5">
        {tr(DICT.closing.line, locale)}
        <span className="text-tan ml-1.5">♡</span>
      </p>
    </motion.section>
  );
}
