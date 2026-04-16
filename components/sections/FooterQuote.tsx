"use client";

import { useState } from "react";
import { Heart, Lock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import HandwrittenText from "@/components/ui/HandwrittenText";

export default function FooterQuote() {
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <footer className="bg-white relative overflow-hidden z-10">
      {/* Main quote section */}
      <div className="max-w-[1320px] mx-auto px-5 py-12 md:px-8 md:py-16 lg:px-12 lg:py-20 text-center">
        <FadeIn>
          <p className="font-script text-accent text-[1.6rem] md:text-[2.4rem] lg:text-[3rem] leading-relaxed mb-3 md:mb-4 px-4">
            <HandwrittenText delay={0.4} duration={5}>{" jij bent niet hier om een gewoon leven te leiden."}</HandwrittenText>
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
              jouw{" "}
              <button
                onClick={() => setShowPrivacy(true)}
                className="text-accent hover:underline transition-colors duration-500"
              >
                privacy
              </button>{" "}
              is belangrijk voor mij. ik ga zorgvuldig om met jouw gegevens.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy popup */}
      <AnimatePresence>
        {showPrivacy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPrivacy(false)}
          >
            <div className="absolute inset-0 bg-dark/30 backdrop-blur-sm" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-card rounded-2xl border border-border/40 shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border/30 px-5 py-4 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <Lock className="text-accent" size={16} strokeWidth={1.5} />
                  <h3 className="font-serif text-dark text-lg font-light">Privacybeleid</h3>
                </div>
                <button
                  onClick={() => setShowPrivacy(false)}
                  className="text-taupe hover:text-dark p-1 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-5 py-5 font-sans text-brown text-[13px] leading-[1.85] font-light space-y-4">
                <p>
                  Ik vind jouw privacy belangrijk. Hier lees je hoe ik omga met
                  de gegevens die je via dit formulier achterlaat.
                </p>

                <div>
                  <p className="font-semibold text-dark text-xs uppercase tracking-wider mb-1.5">
                    Wat ik bewaar
                  </p>
                  <p>
                    Alleen je voornaam en e-mailadres. Niets meer.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-dark text-xs uppercase tracking-wider mb-1.5">
                    Waarvoor
                  </p>
                  <p>
                    Om je de reflectievragenlijst te sturen en eventueel
                    opvolging te geven als je daar toestemming voor geeft.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-dark text-xs uppercase tracking-wider mb-1.5">
                    Delen met derden
                  </p>
                  <p>
                    Nee. Ik deel je gegevens nooit met derden. Geen uitzonderingen.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-dark text-xs uppercase tracking-wider mb-1.5">
                    Verwijderen
                  </p>
                  <p>
                    Je kunt op elk moment vragen om je gegevens te verwijderen
                    door een mail te sturen naar{" "}
                    <a href="mailto:contact@thebeautifullife.nl" className="text-accent hover:underline">
                      contact@thebeautifullife.nl
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
