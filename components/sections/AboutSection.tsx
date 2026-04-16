"use client";

import { Star, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
import Divider from "@/components/ui/Divider";
import HandwrittenText from "@/components/ui/HandwrittenText";

export default function AboutSection() {
  return (
    <section className="bg-page relative overflow-hidden z-10">
      {/* Subtle floating dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-accent/[0.08]"
            style={{ left: `${20 + i * 20}%`, top: `${30 + (i % 2) * 35}%` }}
            animate={{
              opacity: [0, 0.3, 0],
              y: [0, -25, 0],
              scale: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <div className="max-w-[1320px] mx-auto px-6 py-10 md:px-8 md:py-16 lg:px-12 lg:py-24">
        <div className="flex flex-col gap-12 md:gap-14 lg:grid lg:grid-cols-2 lg:gap-20">
          {/* Left column – Over Marion */}
          <FadeIn className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-6 md:gap-8">
            {/* Portrait photo */}
            <div className="flex-shrink-0">
              {/* PLACEHOLDER: Replace with actual portrait photo of Marion
                   Recommended: warm, natural, soft-light headshot
                   Dimensions: ~200x200px circular crop */}
              <div className="w-24 h-24 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full shadow-lg shadow-dark/[0.06] overflow-hidden border-3 md:border-4 border-white/40 relative">
                <Image
                  src="https://u.cubeupload.com/laurensbos/A17681356D924F568E63.png"
                  alt="Marion – The Beautiful Life"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 96px, (max-width: 1024px) 144px, 176px"
                />
              </div>
            </div>

            {/* Text block */}
            <div className="flex-1">
              <h2 className="font-serif text-dark text-[1.4rem] md:text-[1.9rem] lg:text-[2.2rem] font-light leading-tight mb-4">
                over marion
              </h2>

              <Divider className="justify-center md:justify-start mb-5 md:mb-6" />

              <div className="font-sans text-brown text-[13px] md:text-[14px] leading-[1.85] font-light space-y-3 md:space-y-4">
                <p>
                  ik geloof dat een mooi leven begint bij rust.
                  <br />
                  niet perfect. niet druk. maar echt.
                </p>
                <p>
                  ik help vrouwen en meisjes om terug te komen bij zichzelf en van
                  daaruit een leven te creëren dat klopt – van binnen en van buiten.
                </p>
              </div>

              {/* Signature */}
              <p className="font-script text-accent text-[1.5rem] md:text-[2.1rem] lg:text-[2.4rem] mt-5 md:mt-8">
                <HandwrittenText delay={0.6} duration={3.5}>liefs, Marion</HandwrittenText>
              </p>
            </div>
          </FadeIn>

          {/* Right column – Samen bouwen we meer */}
          <FadeIn delay={0.4} className="flex flex-col">
            <h2 className="font-serif text-dark text-[1.6rem] md:text-[1.9rem] lg:text-[2.2rem] font-light leading-tight mb-4">
              samen bouwen we meer
            </h2>

            <Divider className="justify-center md:justify-start mb-5 md:mb-6" hearts={2} />

            <div className="font-sans text-brown text-[14px] leading-[1.85] font-light space-y-4">
              <p>
                een deel van wat wij doen, wordt ondersteund door een internationaal
                groeiend bedrijf binnen de directe verkoop.
              </p>
              <p>
                dit biedt de mogelijkheid om op een rustige, natuurlijke manier een
                extra inkomstenstroom te creëren – zonder druk, zonder traditionele
                werkstructuren.
              </p>
            </div>

            {/* Farmasi info card */}
            <FadeIn delay={0.6}>
              <div className="mt-6 md:mt-8 bg-card rounded-xl border border-border/40 p-5 md:p-6 flex flex-col md:flex-row items-start gap-3 md:gap-4">
                {/* Info icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center mt-0.5">
                  <Star className="text-accent" size={18} strokeWidth={1.5} />
                </div>

                <div className="flex-1">
                  <p className="font-sans text-brown text-[13.5px] leading-[1.8] font-light">
                    we werken hierin samen met{" "}
                    <span className="font-semibold text-dark">Farmasi</span> – een van
                    de snelst groeiende bedrijven wereldwijd in deze sector.
                    <br />
                    <span className="text-accent font-medium">
                      van nr. 16 naar nr. 11 in slechts één jaar.
                    </span>
                  </p>
                </div>
              </div>
            </FadeIn>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
