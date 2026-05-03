"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { type Locale } from "@/lib/i18n/types";
import HeartDivider from "@/components/ui/HeartDivider";

const COPY = {
  nl: {
    eyebrow: "wie ik ben",
    title: "Marion",
    role: "your creative lifestyle mentor",
    paragraphs: [
      "Ik ben Marion. Een leven lang heb ik mensen begeleid die op een kruispunt stonden — niet door hen weg te trekken van waar ze waren, maar door samen te kijken: wie ben jij, écht?",
      "The Beautiful Life is mijn antwoord op een wereld die te hard, te snel en te vol is. Hier vertraag je. Hier krijg je tijd. Hier mag je weer voelen wat onder de drukte zit.",
      "Mijn werk is zacht maar eerlijk. Ik laat je niet ontsnappen — ik laat je thuiskomen.",
    ],
    signoff: "tot snel,",
  },
  en: {
    eyebrow: "who I am",
    title: "Marion",
    role: "your creative lifestyle mentor",
    paragraphs: [
      "I'm Marion. For a lifetime I've guided people standing at a crossroads — not by pulling them away from where they were, but by looking together: who are you, really?",
      "The Beautiful Life is my answer to a world that is too loud, too fast, too full. Here you slow down. Here you get time. Here you may feel again what lies beneath the noise.",
      "My work is soft but honest. I don't let you escape — I let you come home.",
    ],
    signoff: "see you soon,",
  },
} as const;

export default function AboutMarion({ locale }: { locale: Locale }) {
  const t = COPY[locale === "en" ? "en" : "nl"];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="bg-page-soft rounded-[6px] shadow-[0_12px_40px_rgba(60,50,30,0.08)] overflow-hidden grid lg:grid-cols-[1fr_1.1fr] mt-11"
    >
      <div className="relative min-h-[280px] sm:min-h-[380px] lg:min-h-[480px] bg-page-dark order-1 lg:order-1">
        <Image
          src="https://u.cubeupload.com/laurensbos/fea64f52c39c42939293.jpeg"
          alt="Marion Lubach"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-top"
        />
      </div>

      <div className="px-6 py-10 sm:px-12 sm:py-14 order-2 flex flex-col justify-center">
        <p className="font-script text-tan text-3xl">{t.eyebrow}</p>
        <h2 className="font-serif font-medium text-3xl sm:text-4xl tracking-[0.06em] uppercase text-ink mt-1">
          {t.title}
        </h2>
        <p className="font-script text-tan/85 text-xl mt-1">{t.role}</p>

        <HeartDivider className="my-6 lg:!justify-start" />

        <div className="space-y-4 text-ink-soft text-[15px] leading-[1.85] max-w-md">
          {t.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <p className="font-script text-tan text-2xl mt-7">{t.signoff}</p>
        <p className="font-serif text-ink text-lg tracking-[0.04em] mt-1">
          Marion
        </p>
      </div>
    </motion.section>
  );
}
