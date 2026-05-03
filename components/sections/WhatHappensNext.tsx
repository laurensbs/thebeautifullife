import { type Locale } from "@/lib/i18n/types";
import type { PackageSlug } from "@/lib/packages";

const STEPS: Record<
  PackageSlug,
  Record<"nl" | "en", { title: string; body: string }[]>
> = {
  ikigai: {
    nl: [
      {
        title: "Aanmelding & welkomst",
        body: "Direct na aanmelden ontvang je een welkomstmail en een betaallink. Je werkboek staat klaar zodra de betaling binnen is.",
      },
      {
        title: "In je eigen tempo",
        body: "Open je werkboek wanneer het past. Alles wordt automatisch opgeslagen — terugkomen kan altijd via je persoonlijke pad.",
      },
      {
        title: "Een woord van Marion",
        body: "Marion leest je antwoorden en stuurt je binnen een week een persoonlijke reflectie. Daarna weet je wat je volgende stap is.",
      },
    ],
    en: [
      {
        title: "Sign-up & welcome",
        body: "Right after signing up you receive a welcome email and a payment link. Your workbook is ready as soon as payment comes in.",
      },
      {
        title: "At your own pace",
        body: "Open your workbook whenever fits. Everything is saved automatically — return any time via your personal path.",
      },
      {
        title: "A word from Marion",
        body: "Marion reads your answers and sends you a personal reflection within a week. After that you know your next step.",
      },
    ],
  },
  alignment: {
    nl: [
      {
        title: "Aanmelding & betaling",
        body: "Vul je gegevens in. Je ontvangt direct een welkomstmail en betaallink. Toegang is er zodra de betaling binnen is.",
      },
      {
        title: "Werkboek + 1-op-1 sessie",
        body: "Werk in jouw tempo aan het werkboek. Daarna plannen we samen een 1-op-1 sessie van 60 minuten om alles door te nemen.",
      },
      {
        title: "Persoonlijk plan",
        body: "Marion stelt na de sessie een persoonlijk plan op — concrete stappen die bij jouw leven passen, niet bij een template.",
      },
    ],
    en: [
      {
        title: "Sign-up & payment",
        body: "Fill in your details. You receive a welcome email and payment link instantly. Access opens as soon as payment is in.",
      },
      {
        title: "Workbook + 1-on-1 session",
        body: "Work through the workbook at your pace. Then we schedule a 60-minute 1-on-1 session to go through everything together.",
      },
      {
        title: "Personal plan",
        body: "After the session Marion creates a personal plan — concrete steps that fit your life, not a template.",
      },
    ],
  },
  experience: {
    nl: [
      {
        title: "Vrijblijvend kennismakingsgesprek",
        body: "We beginnen altijd met een gratis gesprek van 30 minuten. Je voelt of de klik er is — pas daarna kies je.",
      },
      {
        title: "8 dagen volledig uit je dagelijkse leven",
        body: "Een persoonlijk programma met werkboek, sessies, ontspanning en bijzondere ervaringen. Alles is geregeld.",
      },
      {
        title: "Een fundering die blijft",
        body: "Je gaat naar huis met een persoonlijk levensplan, ritmes die werken en een coach die nog drie maanden meekijkt.",
      },
    ],
    en: [
      {
        title: "A free intro call first",
        body: "We always start with a free 30-minute call. You feel whether the click is there — only then you decide.",
      },
      {
        title: "8 days fully out of your daily life",
        body: "A personal programme with workbook, sessions, rest and meaningful experiences. Everything is taken care of.",
      },
      {
        title: "A foundation that lasts",
        body: "You go home with a personal life plan, rhythms that work, and a coach who stays involved for three more months.",
      },
    ],
  },
};

const HEADERS = {
  nl: { eyebrow: "wat er nu gebeurt", title: "Hoe het verloopt" },
  en: { eyebrow: "what happens next", title: "How it unfolds" },
} as const;

export default function WhatHappensNext({
  slug,
  locale,
  accent,
}: {
  slug: PackageSlug;
  locale: Locale;
  accent: "sage" | "tan" | "gold";
}) {
  const lang = locale === "en" ? "en" : "nl";
  const steps = STEPS[slug][lang];
  const head = HEADERS[lang];

  const accentDot =
    accent === "sage"
      ? "bg-sage"
      : accent === "tan"
        ? "bg-tan"
        : "bg-[var(--color-gold,#AE8A4E)]";
  const accentNum =
    accent === "sage"
      ? "text-sage"
      : accent === "tan"
        ? "text-tan"
        : "text-[var(--color-gold,#AE8A4E)]";

  return (
    <div className="border border-line/60 rounded-md bg-white/55 px-5 py-5 sm:px-6 sm:py-6 mb-6">
      <p className="font-script text-tan text-xl">{head.eyebrow}</p>
      <p className="font-serif font-medium text-[15px] tracking-[0.06em] uppercase text-ink mt-0.5 mb-4">
        {head.title}
      </p>
      <ol className="space-y-4">
        {steps.map((s, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="flex-none mt-0.5 inline-flex items-center justify-center">
              <span
                className={`w-7 h-7 rounded-full bg-page-soft border border-line/70 inline-flex items-center justify-center font-serif text-[13px] ${accentNum}`}
              >
                {i + 1}
              </span>
            </span>
            <div className="flex-1">
              <p className="font-serif text-ink text-[14.5px] tracking-[0.02em] leading-snug flex items-center gap-2">
                {s.title}
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${accentDot}/70`} />
              </p>
              <p className="text-ink-soft text-[13px] leading-[1.7] mt-1">
                {s.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
