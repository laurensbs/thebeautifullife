"use client";

import { useState } from "react";
import { Brain, Heart, Sparkles, Sun, Lock, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "@/components/ui/FadeIn";
import Divider from "@/components/ui/Divider";
import IconBullet from "@/components/ui/IconBullet";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import HandwrittenText from "@/components/ui/HandwrittenText";

const bulletItems = [
  {
    icon: <Brain size={20} strokeWidth={1.5} />,
    title: "je wilt meer rust in je hoofd en lichaam",
    subtitle: "en minder geleefd worden door alles wat moet",
  },
  {
    icon: <Heart size={20} strokeWidth={1.5} />,
    title: "je verlangt naar een leven dat klopt",
    subtitle: "van binnen en van buiten",
  },
  {
    icon: <Sparkles size={20} strokeWidth={1.5} />,
    title: "je weet dat er meer in je zit",
    subtitle: "maar je mist richting en helderheid",
  },
  {
    icon: <Sun size={20} strokeWidth={1.5} />,
    title: "je wilt een manier van leven",
    subtitle: "die jou ook financieel ondersteunt",
  },
];

export default function RecognitionSection() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const contact = formData.get("contact") as string;

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, contact }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "Er ging iets mis");
      }
    } catch {
      setError("Verbindingsfout. Probeer het opnieuw.");
    }
    setSubmitting(false);
  };

  return (
    <section className="bg-page-alt relative overflow-hidden z-10">
      {/* Ambient sparkle particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-accent/[0.15]"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              opacity: [0, 0.4, 0],
              scale: [0.5, 1.2, 0.5],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4 + i * 0.8,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <div className="max-w-[1320px] mx-auto px-6 py-10 md:px-8 md:py-16 lg:px-12 lg:py-24">
        <div className="flex flex-col gap-10 md:gap-12 lg:grid lg:grid-cols-2 lg:gap-16 items-start">
          {/* Left column – Recognition bullets */}
          <FadeIn className="flex flex-col">
            <h2 className="font-serif text-dark text-[1.6rem] md:text-[2.2rem] lg:text-[2.6rem] font-light leading-tight mb-6 md:mb-10">
              voel je dat dit over jou gaat?
            </h2>

            <div className="flex flex-col gap-5 md:gap-7">
              {bulletItems.map((item, i) => (
                <FadeIn key={i} delay={0.2 * (i + 1)}>
                  <IconBullet
                    icon={item.icon}
                    title={item.title}
                    subtitle={item.subtitle}
                  />
                </FadeIn>
              ))}
            </div>

            {/* Script accent text – large like reference */}
            <FadeIn delay={0.8}>
              <div className="mt-8 md:mt-14 lg:mt-20 relative">
                <p className="font-script text-accent text-[1.7rem] md:text-[2.8rem] lg:text-[3.4rem] leading-[1.5]">
                  <HandwrittenText delay={0.3} duration={4.5}>het kan anders.</HandwrittenText>
                </p>
                <p className="font-script text-accent text-[1.7rem] md:text-[2.8rem] lg:text-[3.4rem] leading-[1.5] mt-1 md:mt-2">
                  <HandwrittenText delay={1.5} duration={4.5}>en het begint bij jou.</HandwrittenText>
                </p>
              </div>
            </FadeIn>

            {/* Botanical line art decoration */}
            <div className="mt-6 md:mt-8 opacity-[0.10] md:opacity-[0.12]">
              <svg
                width="140"
                height="60"
                viewBox="0 0 180 80"
                fill="none"
                className="text-accent"
              >
                <path
                  d="M10 70C30 50 50 40 80 35C110 30 140 25 170 10"
                  stroke="currentColor"
                  strokeWidth="0.8"
                />
                <ellipse
                  cx="60"
                  cy="42"
                  rx="6"
                  ry="12"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  transform="rotate(-25 60 42)"
                />
                <ellipse
                  cx="100"
                  cy="32"
                  rx="5"
                  ry="10"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  transform="rotate(-15 100 32)"
                />
                <circle cx="130" cy="22" r="3" stroke="currentColor" strokeWidth="0.8" />
                <circle cx="140" cy="18" r="2" stroke="currentColor" strokeWidth="0.8" />
              </svg>
            </div>

            {/* Mobile: soft transition arrow to card below */}
            <FadeIn delay={1.2} className="flex justify-center mt-6 lg:hidden">
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-accent/40">
                  <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </FadeIn>
          </FadeIn>

          {/* Right column – Opt-in card */}
          <FadeIn delay={0.5} scale className="flex justify-center w-full lg:justify-end">
            <motion.div
              whileHover={{ y: -3, boxShadow: "0 20px 50px -12px rgba(61, 43, 34, 0.08)" }}
              transition={{ type: "spring", stiffness: 150, damping: 30 }}
              className="w-full max-w-md bg-card rounded-2xl shadow-xl shadow-dark/[0.04] p-5 md:p-8 lg:p-10 border border-border/40"
            >
              {/* Card title */}
              <div className="text-center mb-5 md:mb-6">
                <h3 className="font-serif text-dark text-[1.6rem] md:text-[1.9rem] lg:text-[2.2rem] font-light leading-tight">
                  start jouw
                  <br />
                  beautiful life reset
                </h3>
              </div>

              <Divider className="mb-5 md:mb-6" />

              {/* Description */}
              <p className="text-center font-sans text-brown text-[13px] md:text-[13.5px] leading-relaxed mb-6 md:mb-8 font-light px-1 md:px-2">
                ontvang gratis de{" "}
                <span className="font-semibold text-dark">reflectievragenlijst</span>{" "}
                die je helpt om helder te krijgen waar je nu staat, waar je
                naartoe wilt en wat je tegenhoudt.
              </p>

              {/* Form */}
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-accent/10 flex items-center justify-center">
                    <Check className="text-accent" size={22} />
                  </div>
                  <p className="font-serif text-dark text-lg mb-1">Dankjewel!</p>
                  <p className="font-sans text-brown text-xs leading-relaxed">
                    Check je inbox voor de reflectievragenlijst.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                >
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-sans px-3 py-2 rounded-lg">
                      {error}
                    </div>
                  )}
                  <Input
                    label="Voornaam"
                    placeholder="Voornaam"
                    type="text"
                    name="firstName"
                    autoComplete="given-name"
                    required
                  />
                  <Input
                    label="E-mailadres"
                    placeholder="E-mailadres"
                    type="email"
                    name="contact"
                    autoComplete="email"
                    required
                  />
                  <Button type="submit" className="mt-2">
                    {submitting ? "Even geduld..." : "JA, IK WIL BEGINNEN"}
                  </Button>
                </form>
              )}

              {/* Privacy note */}
              <button
                onClick={() => setShowPrivacy(true)}
                className="flex items-center justify-center gap-2 mt-5 group cursor-pointer"
              >
                <Lock className="text-taupe flex-shrink-0 group-hover:text-accent transition-colors" size={14} strokeWidth={1.5} />
                <span className="font-sans text-taupe text-xs font-light group-hover:text-accent transition-colors underline decoration-taupe/30 underline-offset-2 group-hover:decoration-accent/40">
                  jouw gegevens zijn veilig bij mij
                </span>
              </button>
            </motion.div>
          </FadeIn>
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
            {/* Backdrop */}
            <div className="absolute inset-0 bg-dark/30 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-card rounded-2xl border border-border/40 shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border/30 px-5 py-4 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <Lock className="text-accent" size={16} strokeWidth={1.5} />
                  <h3 className="font-serif text-dark text-lg font-light">Privacy</h3>
                </div>
                <button
                  onClick={() => setShowPrivacy(false)}
                  className="text-taupe hover:text-dark p-1 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
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

                <div className="pt-2 border-t border-border/30">
                  <p className="text-taupe text-[11px]">
                    Lees het volledige{" "}
                    <a href="/privacy" className="text-accent hover:underline">
                      privacybeleid
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
