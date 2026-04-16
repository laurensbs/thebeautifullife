"use client";

import { Heart, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
import HandwrittenText from "@/components/ui/HandwrittenText";

export default function Hero() {
  return (
    <section className="bg-page relative overflow-hidden z-10">
      {/* Subtle radial glow */}
      <motion.div
        className="absolute left-1/2 top-[60%] -translate-x-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-accent/[0.03] blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Full-width hero image */}
      <FadeIn delay={0.2} className="w-full">
        <div className="relative w-full aspect-[4/5] sm:aspect-[3/2] md:aspect-[2/1] lg:aspect-[2.4/1]">
          <Image
            src="https://u.cubeupload.com/laurensbos/beautifullife.png"
            alt="The Beautiful Life – warm lifestyle sfeer"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          {/* Soft gradient fade at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-page via-page/60 to-transparent" />
        </div>
      </FadeIn>

      {/* Text content */}
      <div className="max-w-[1320px] mx-auto px-6 -mt-16 sm:-mt-12 md:-mt-16 lg:-mt-24 relative z-10 pb-10 md:pb-16 lg:pb-20">
        <FadeIn className="flex flex-col items-center text-center">
          {/* Logo / brand mark */}
          <div className="flex items-center gap-2.5 mb-6 md:mb-10 lg:mb-14">
            <Leaf className="text-accent" size={24} strokeWidth={1.2} />
            <span className="font-serif text-dark text-[13px] md:text-[15px] italic tracking-wide leading-tight">
              the beautiful life
              <br />
              coaching collective
            </span>
          </div>

          {/* Main headline */}
          <h1 className="mb-5 md:mb-6 max-w-2xl">
            <span className="block font-serif text-dark text-[2rem] md:text-[2.8rem] lg:text-[3.8rem] font-light leading-[1.1] tracking-tight">
              de grootste
            </span>
            <span className="block font-serif text-dark text-[2rem] md:text-[2.8rem] lg:text-[3.8rem] font-light leading-[1.1] tracking-tight">
              rijkdom in het leven
            </span>
            <span className="block w-16 h-px bg-accent/40 my-3 md:my-4 mx-auto" />
            <span className="block font-script text-accent text-[1.8rem] md:text-[2.5rem] lg:text-[3.4rem] leading-[1.3]">
              <HandwrittenText delay={1} duration={4.5}>is thuiskomen bij</HandwrittenText>
            </span>
            <span className="block font-serif text-dark text-[2rem] md:text-[2.8rem] lg:text-[3.8rem] font-light leading-[1.1] tracking-tight">
              wie je werkelijk bent
            </span>
          </h1>

          {/* Heart divider */}
          <motion.div
            className="flex items-center gap-4 my-4 md:my-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Heart className="text-accent fill-accent" size={14} strokeWidth={0} />
            <Heart className="text-accent fill-accent" size={14} strokeWidth={0} />
          </motion.div>

          {/* Subtitle */}
          <p className="font-sans text-brown text-[15px] md:text-[17px] lg:text-lg leading-[1.8] max-w-md md:max-w-lg font-light">
            voor vrouwen en meisjes die verlangen naar
            {" "}rust, balans en een leven dat goed voelt
            {" "}en{" "}
            <span className="inline mx-0.5">
              <HandwrittenText className="font-script text-accent text-[1.4rem] md:text-[1.85rem] lg:text-[2rem]" delay={1.8} duration={3.5}>
                moeiteloos
              </HandwrittenText>
            </span>
            {" "}begint te stromen
          </p>
        </FadeIn>
      </div>

      {/* Subtle botanical decoration bottom-left – hidden on mobile */}
      <div className="hidden md:block absolute bottom-0 left-0 opacity-[0.06] pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" className="text-accent">
          <path d="M20 180C20 180 40 120 80 100C120 80 160 60 180 20" stroke="currentColor" strokeWidth="1" />
          <path d="M60 180C60 180 70 140 90 120C110 100 130 90 150 70" stroke="currentColor" strokeWidth="0.8" />
          <ellipse cx="80" cy="100" rx="8" ry="14" stroke="currentColor" strokeWidth="0.8" transform="rotate(-30 80 100)" />
          <ellipse cx="100" cy="85" rx="6" ry="12" stroke="currentColor" strokeWidth="0.8" transform="rotate(-20 100 85)" />
        </svg>
      </div>
    </section>
  );
}
