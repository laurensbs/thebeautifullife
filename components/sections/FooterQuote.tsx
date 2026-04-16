"use client";

import { Heart, Lock } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import HandwrittenText from "@/components/ui/HandwrittenText";
import Link from "next/link";

export default function FooterQuote() {
  return (
    <footer className="bg-white relative overflow-hidden z-10">
      {/* Main quote section */}
      <div className="max-w-[1320px] mx-auto px-5 py-12 md:px-8 md:py-16 lg:px-12 lg:py-20 text-center">
        <FadeIn>
          <p className="font-script text-accent text-[1.6rem] md:text-[2.4rem] lg:text-[3rem] leading-relaxed mb-3 md:mb-4 px-2">
            <HandwrittenText delay={0.4} duration={5}>jij bent niet hier om een gewoon leven te leiden.</HandwrittenText>
          </p>
          <p className="font-sans text-dark text-[0.7rem] md:text-[0.9rem] lg:text-[1.05rem] tracking-[0.15em] md:tracking-[0.2em] uppercase font-semibold">
            JIJ BENT HIER OM JOUW MOOISTE LEVEN TE CREËREN.{" "}
            <Heart className="text-accent fill-accent inline-block align-middle ml-1" size={14} strokeWidth={0} />
          </p>
        </FadeIn>
      </div>

      {/* Privacy bar */}
      <div className="border-t border-border/50">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 lg:px-12 py-6 md:py-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <Lock className="text-taupe flex-shrink-0" size={16} strokeWidth={1.5} />
            <p className="font-sans text-taupe text-xs md:text-sm font-light">
              jouw privacy is belangrijk voor mij. ik ga zorgvuldig om met jouw
              gegevens.
            </p>
          </div>
          <Link href="/privacy" className="font-sans text-taupe text-[11px] hover:text-accent transition-colors duration-500 tracking-wider">
            privacybeleid
          </Link>
        </div>
      </div>
    </footer>
  );
}
