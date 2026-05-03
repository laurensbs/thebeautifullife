import type { Locale } from "@/lib/i18n/types";

export type FAQItem = { q: string; a: string };

export type FAQContent = {
  eyebrow: string;
  title: string;
  items: FAQItem[];
};

const FAQS: Record<"nl" | "en", FAQContent> = {
  nl: {
    eyebrow: "veelgestelde vragen",
    title: "Goed om te weten",
    items: [
      {
        q: "Welk pakket past bij mij?",
        a: "Twijfel je? Begin met de gratis reflectievragenlijst — op je persoonlijke pad krijg je daarna een aanbeveling van Marion op basis van je antwoorden. Of plan een gratis kennismakingsgesprek; in 20 minuten weet je het.",
      },
      {
        q: "Hoeveel tijd kost een pakket per week?",
        a: "Ikigai en Alignment zijn flexibel — reken op 30 tot 60 minuten per week voor het werkboek, in jouw eigen tempo. The Beautiful Life Experience is een 8-daags intensief traject. Alles wordt opgeslagen, dus je kunt altijd waar je was verder.",
      },
      {
        q: "Wat als ik na een paar dagen toch wil stoppen?",
        a: "Voor digitale producten geldt 14 dagen wettelijke bedenktijd. Zolang je het werkboek nog niet hebt geopend krijg je het volledige bedrag terug. Lees de voorwaarden voor de details.",
      },
      {
        q: "Is dit therapie of coaching?",
        a: "Coaching. We werken met reflectie, structuur en zachte begeleiding — geen behandeling. Bij ernstige psychische klachten verwijst Marion door naar een huisarts of therapeut.",
      },
      {
        q: "Kan ik betalen in termijnen?",
        a: "Voor het Experience-pakket (€1997) is een termijnregeling mogelijk. Stuur Marion een mail of plan een kennismaking om de mogelijkheden te bespreken.",
      },
      {
        q: "Blijven mijn antwoorden privé?",
        a: "Altijd. Wat je in werkboeken of sessies deelt blijft tussen jou en Marion. We delen je gegevens niet met derden — lees de privacyverklaring voor details.",
      },
      {
        q: "In welke taal werken we?",
        a: "Nederlands of Engels — je kiest zelf. De hele site, werkboeken en mails zijn beschikbaar in beide talen.",
      },
    ],
  },
  en: {
    eyebrow: "frequently asked",
    title: "Good to know",
    items: [
      {
        q: "Which package fits me?",
        a: "Not sure? Start with the free reflection questionnaire — on your personal path you'll then receive a recommendation from Marion based on your answers. Or schedule a free intro call; you'll know within 20 minutes.",
      },
      {
        q: "How much time per week does a package take?",
        a: "Ikigai and Alignment are flexible — count on 30 to 60 minutes per week for the workbook, at your own pace. The Beautiful Life Experience is an 8-day intensive. Everything is saved so you can always continue where you left off.",
      },
      {
        q: "What if I want to stop after a few days?",
        a: "Digital products have a 14-day legal cooling-off period. As long as you haven't opened the workbook you get a full refund. See the terms for details.",
      },
      {
        q: "Is this therapy or coaching?",
        a: "Coaching. We work with reflection, structure and gentle guidance — not treatment. For serious psychological complaints Marion refers you to a doctor or therapist.",
      },
      {
        q: "Can I pay in instalments?",
        a: "For the Experience package (€1997) an instalment plan is possible. Send Marion a message or schedule an intro call to discuss.",
      },
      {
        q: "Will my answers stay private?",
        a: "Always. What you share in workbooks or sessions stays between you and Marion. We do not share your data — see the privacy notice for details.",
      },
      {
        q: "What language do we work in?",
        a: "Dutch or English — your choice. The entire site, workbooks and emails are available in both languages.",
      },
    ],
  },
};

export function getFaq(locale: Locale): FAQContent {
  return FAQS[locale === "en" ? "en" : "nl"];
}
