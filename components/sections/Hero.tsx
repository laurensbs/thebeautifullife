"use client";

import { Heart, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
import HandwrittenText from "@/components/ui/HandwrittenText";

export default function Hero() {
  return (
    <section className="bg-page relative overflow-hidden z-10">
      <div className="max-w-[1320px] mx-auto px-5 py-8 md:px-8 lg:px-12 md:py-12 lg:py-16">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left column – Brand & headline */}
          <FadeIn className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* Logo / brand mark */}
            <div className="flex items-center gap-3 mb-8 md:mb-10 lg:mb-14">
              <Leaf className="text-accent" size={28} strokeWidth={1.2} />
              <span className="font-serif text-dark text-sm md:text-[15px] italic tracking-wide leading-tight">
                the beautiful life
                <br />
                coaching collective
              </span>
            </div>

            {/* Main headline */}
            <h1 className="mb-5 md:mb-6 max-w-lg lg:max-w-xl">
              <span className="block font-serif text-dark text-[2rem] md:text-[2.8rem] lg:text-[3.8rem] font-light leading-[1.1] tracking-tight">
                de grootste
              </span>
              <span className="block font-serif text-dark text-[2rem] md:text-[2.8rem] lg:text-[3.8rem] font-light leading-[1.1] tracking-tight">
                rijkdom in het leven
              </span>
              <span className="block w-16 h-px bg-accent/40 my-3 md:my-4 mx-auto lg:mx-0" />
              <span className="block font-script text-accent text-[1.8rem] md:text-[2.5rem] lg:text-[3.4rem] leading-[1.3]">
                <HandwrittenText delay={0.4} duration={1.4}>is thuiskomen bij</HandwrittenText>
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
              transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Heart className="text-accent fill-accent" size={14} strokeWidth={0} />
              <Heart className="text-accent fill-accent" size={14} strokeWidth={0} />
            </motion.div>

            {/* Subtitle */}
            <p className="font-sans text-brown text-base md:text-[17px] lg:text-lg leading-relaxed max-w-lg font-light">
              voor vrouwen en meisjes die verlangen naar
              <br className="hidden md:block" />
              {" "}rust, balans en een leven dat goed voelt
              <br className="hidden md:block" />
              {" "}en{" "}
              <span className="inline-block mx-1.5 md:mx-2 align-baseline">
                <HandwrittenText className="font-script text-accent text-2xl md:text-[1.85rem] lg:text-[2rem]" delay={0.8} duration={1}>
                  moeiteloos
                </HandwrittenText>
              </span>
              {" "}begint te stromen
            </p>
          </FadeIn>

          {/* Right column – Hero image */}
          <FadeIn delay={0.2} className="relative w-full">
            <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl shadow-dark/5">
              <div className="aspect-[3/4] md:aspect-[4/5] relative">
                <Image
                  src="https://u.cubeupload.com/laurensbos/beautifullife.png"
                  alt="The Beautiful Life – warm lifestyle sfeer"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {/* "Live Beautifully" book accent */}
                <div className="absolute bottom-16 right-6 md:bottom-20 md:right-8 bg-card/80 backdrop-blur-sm rounded px-3 py-1.5 md:px-4 md:py-2 shadow-sm">
                  <span className="font-script text-accent text-base md:text-lg">
                    <HandwrittenText delay={0.6} duration={0.8}>live beautifully</HandwrittenText>
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
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
