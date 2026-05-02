"use client";

import { motion } from "framer-motion";
import { Lightbulb, Calendar, Sprout, Heart, Sparkles } from "lucide-react";

const ITEMS = [
  { icon: Lightbulb, text: "Meer helderheid over wie je bent en wat je wilt" },
  { icon: Calendar, text: "Structuur & overzicht in je dagelijks leven" },
  { icon: Sprout, text: "Gewoontes die je energie geven" },
  { icon: Heart, text: "Meer tijd, vrijheid & vreugde" },
  { icon: Sparkles, text: "Een leven dat klopt — van binnen en van buiten" },
];

export default function WhatYouGet() {
  return (
    <section className="bg-page-dark rounded-[6px] py-9 px-7 sm:py-10 sm:px-8">
      <h2 className="text-center font-serif font-medium tracking-[0.32em] text-sm uppercase text-ink mb-6">
        <span className="inline-block align-middle h-px w-9 bg-tan/50 mx-3.5" />
        What You Get
        <span className="inline-block align-middle h-px w-9 bg-tan/50 mx-3.5" />
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-5">
        {ITEMS.map(({ icon: Icon, text }, i) => (
          <motion.div
            key={text}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: i * 0.08 }}
            whileHover={{ y: -3 }}
            className={`text-center px-2.5 text-[12px] text-ink leading-[1.55] ${
              i < ITEMS.length - 1
                ? "md:border-r md:border-tan/35 pb-3 md:pb-0 border-b border-tan/35 md:border-b-0"
                : ""
            }`}
          >
            <div className="w-11 h-11 mx-auto mb-3 text-tan flex items-center justify-center">
              <Icon size={32} strokeWidth={1.4} />
            </div>
            {text}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
