"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { type Locale } from "@/lib/i18n/types";
import HeartDivider from "@/components/ui/HeartDivider";
import { getFaq } from "@/lib/faq-data";

export default function FAQ({ locale }: { locale: Locale }) {
  const t = getFaq(locale);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9 }}
      className="mt-16 sm:mt-20 px-1 sm:px-3"
    >
      <div className="text-center max-w-md mx-auto">
        <p className="font-script text-tan text-3xl">{t.eyebrow}</p>
        <h2 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.06em] uppercase mt-1 text-ink">
          {t.title}
        </h2>
        <HeartDivider className="my-6" />
      </div>

      <div className="max-w-[720px] mx-auto mt-6 space-y-2.5">
        {t.items.map((item, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className={`bg-page-soft border rounded-md transition-colors ${
                isOpen ? "border-tan/60" : "border-line/50"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-start justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-serif text-ink text-[16px] sm:text-[17px] tracking-[0.02em] leading-snug">
                  {item.q}
                </span>
                <span
                  className={`flex-none mt-1 w-6 h-6 rounded-full border border-tan/40 flex items-center justify-center text-tan transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  <Plus size={14} strokeWidth={1.6} />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="body"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 -mt-1">
                      <p className="text-ink-soft text-[14.5px] leading-[1.85] max-w-prose">
                        {item.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
