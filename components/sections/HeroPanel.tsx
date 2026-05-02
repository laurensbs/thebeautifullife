"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sun, Leaf, Heart, Sparkles } from "lucide-react";

const FEATURES = [
  { icon: Sun, label: "More Clarity" },
  { icon: Leaf, label: "More Balance" },
  { icon: Heart, label: "More Freedom" },
  { icon: Sparkles, label: "More You" },
];

export default function HeroPanel() {
  return (
    <section className="relative bg-page-soft rounded-[6px] overflow-hidden shadow-[0_12px_40px_rgba(60,50,30,0.08)] grid md:grid-cols-[1fr_1.05fr]">
      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="px-8 pt-12 pb-10 sm:px-14 sm:pt-16 md:pb-0"
      >
        <h1 className="font-serif text-ink leading-none tracking-[0.04em] font-medium">
          <span className="block uppercase tracking-[0.18em] text-[clamp(40px,5.4vw,68px)] font-medium">
            The
            <br />
            Beautiful
          </span>
          <span className="block font-script font-normal text-[clamp(56px,7.2vw,96px)] tracking-[0.02em] -mt-1.5 ml-[60px] md:ml-[120px]">
            Life
          </span>
        </h1>

        <div className="mt-7 mb-5 flex items-center gap-2.5 text-tan">
          <span className="h-px w-14 bg-tan/55" />
          <span className="text-sm">♡</span>
          <span className="h-px w-14 bg-tan/55" />
        </div>

        <p className="font-sans text-[13px] tracking-[0.32em] uppercase text-ink">
          3 Paths. One Goal.
          <strong className="block font-medium text-tan tracking-[0.32em] mt-1.5">
            Your Ideal Life.
          </strong>
        </p>

        <p className="mt-7 max-w-[360px] text-ink-soft text-[15px] leading-[1.7] pb-12 md:pb-16">
          Van helderheid tot transformatie.
          <br />
          Ik help je een leven te ontwerpen
          <br />
          dat aanvoelt als jouw thuis.
        </p>
      </motion.div>

      {/* Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.2 }}
        className="relative min-h-[340px] md:min-h-[520px] bg-page-dark"
      >
        <Image
          src="https://u.cubeupload.com/laurensbos/beautifullife.png"
          alt="The Beautiful Life"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 55vw"
          className="object-cover object-top"
        />
      </motion.div>

      {/* Sage feature bar */}
      <div className="md:absolute md:left-[46%] md:right-0 md:bottom-0 bg-sage text-white grid grid-cols-2 sm:grid-cols-4 gap-y-3 px-4 sm:px-8 py-4 md:rounded-tl-[4px]">
        {FEATURES.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center justify-center gap-2 text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.22em] uppercase font-medium"
          >
            <Icon size={16} strokeWidth={1.5} />
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}
