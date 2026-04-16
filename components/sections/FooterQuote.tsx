"use client";

import { Heart, Lock } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import HandwrittenText from "@/components/ui/HandwrittenText";

export default function FooterQuote() {
  return (
    <footer className="bg-white relative overflow-hidden z-10">
      {/* Main quote section */}
      <div className="max-w-[1320px] mx-auto px-5 py-12 md:px-8 md:py-16 lg:px-12 lg:py-20 text-center">
        <FadeIn>
          <p className="font-script text-accent text-[1.4rem] md:text-[2rem] lg:text-[2.6rem] leading-relaxed mb-2 md:mb-3">
            <HandwrittenText delay={0.1} duration={1.5}>jij bent niet hier om een gewoon leven te leiden.</HandwrittenText>
          </p>
          <p className="font-sans text-dark text-[0.65rem] md:text-[0.8rem] lg:text-[0.95rem] tracking-[0.15em] md:tracking-[0.2em] uppercase font-semibold">
            JIJ BENT HIER OM JOUW MOOISTE LEVEN TE CREËREN.
          </p>

          {/* Heart */}
          <div className="mt-6">
            <Heart className="text-accent fill-accent mx-auto" size={14} strokeWidth={0} />
          </div>
        </FadeIn>
      </div>

      {/* Privacy bar */}
      <div className="border-t border-border/50">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 lg:px-12 py-6 md:py-8 flex items-center justify-center gap-2 md:gap-3">
          <Lock className="text-taupe flex-shrink-0" size={16} strokeWidth={1.5} />
          <p className="font-sans text-taupe text-xs md:text-sm font-light">
            jouw privacy is belangrijk voor mij. ik ga zorgvuldig om met jouw
            gegevens.
          </p>
        </div>
      </div>
    </footer>
  );
}
