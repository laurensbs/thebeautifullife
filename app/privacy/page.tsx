import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import HeartDivider from "@/components/ui/HeartDivider";
import BrandLogo from "@/components/ui/BrandLogo";
import { getLocale } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/types";

export const metadata = {
  title: "Privacyverklaring — The Beautiful Life",
  description:
    "Hoe The Beautiful Life met jouw persoonsgegevens omgaat. Wat we verzamelen, waarvoor, en welke rechten je hebt.",
  robots: { index: true, follow: true },
};

const COPY: Record<
  "nl" | "en",
  {
    eyebrow: string;
    title: string;
    updated: string;
    backShort: string;
    sections: {
      title: string;
      paragraphs: (string | { strong: string; rest: string })[];
      list?: string[];
    }[];
    closing: string;
  }
> = {
  nl: {
    eyebrow: "wat met jouw gegevens gebeurt",
    title: "Privacyverklaring",
    updated: "Laatst bijgewerkt: mei 2026",
    backShort: "Terug",
    sections: [
      {
        title: "1 · Wie wij zijn",
        paragraphs: [
          "Deze website wordt beheerd door Marion Lubach, oprichter van The Beautiful Life. Ik ben verantwoordelijk voor de verwerking van jouw persoonsgegevens zoals beschreven in deze verklaring.",
          { strong: "Contact:", rest: "contact@thebeautifullife.nl" },
        ],
      },
      {
        title: "2 · Welke gegevens verzamelen we",
        paragraphs: [
          "Wanneer je je aanmeldt via de website, slaan we het volgende op:",
        ],
        list: [
          "Je voornaam",
          "Je e-mailadres",
          "Optioneel: je telefoonnummer",
          "Voor het Beautiful Life Experience-pakket: aanvullende intake-informatie zoals adres, dieetwensen en motivatie",
          "Je antwoorden op de reflectievragenlijst en werkboeken — alleen zichtbaar voor jou en Marion",
        ],
      },
      {
        title: "3 · Waarvoor gebruiken we je gegevens",
        paragraphs: ["We gebruiken je gegevens uitsluitend om:"],
        list: [
          "Je toegang te geven tot je persoonlijke pad en werkboeken",
          "Persoonlijk contact met je op te nemen",
          "Coaching, begeleiding en betalingen af te handelen",
          "Je per e-mail te informeren over je traject (geen marketingmails)",
        ],
      },
      {
        title: "4 · Hoe we je gegevens beveiligen",
        paragraphs: [
          "Je gegevens staan in een beveiligde database (Neon Postgres, EU). De verbinding is altijd versleuteld via HTTPS. E-mails worden verstuurd via een beveiligde SMTP-verbinding. Toegang is beperkt tot Marion en strikt noodzakelijke technische beheerders.",
        ],
      },
      {
        title: "5 · Hoe lang we je gegevens bewaren",
        paragraphs: [
          "We bewaren je gegevens zolang als nodig is voor het doel waarvoor ze zijn verzameld — of zolang als wettelijk verplicht voor financiële administratie (zeven jaar voor facturen). Je kunt op elk moment vragen om verwijdering.",
        ],
      },
      {
        title: "6 · Jouw rechten",
        paragraphs: ["Je hebt het recht om:"],
        list: [
          "Inzage te vragen in je persoonsgegevens",
          "Je gegevens te laten corrigeren of verwijderen",
          "Bezwaar te maken tegen verwerking",
          "Je toestemming in te trekken",
          "Een klacht in te dienen bij de Autoriteit Persoonsgegevens",
        ],
      },
      {
        title: "7 · Cookies",
        paragraphs: [
          "Deze website gebruikt alleen functionele cookies die nodig zijn voor de werking van de site — zoals je login en taalvoorkeur. Geen tracking. Geen advertenties. Geen analytics van derden.",
        ],
      },
    ],
    closing: "met liefde, Marion",
  },
  en: {
    eyebrow: "what happens with your data",
    title: "Privacy Notice",
    updated: "Last updated: May 2026",
    backShort: "Back",
    sections: [
      {
        title: "1 · Who we are",
        paragraphs: [
          "This website is operated by Marion Lubach, founder of The Beautiful Life. I am responsible for processing your personal data as described in this notice.",
          { strong: "Contact:", rest: "contact@thebeautifullife.nl" },
        ],
      },
      {
        title: "2 · What data we collect",
        paragraphs: [
          "When you sign up via the website, we store the following:",
        ],
        list: [
          "Your first name",
          "Your email address",
          "Optional: your phone number",
          "For the Beautiful Life Experience package: additional intake information such as address, dietary preferences and motivation",
          "Your answers to the reflection questionnaire and workbooks — visible only to you and Marion",
        ],
      },
      {
        title: "3 · Why we use your data",
        paragraphs: ["We use your data solely to:"],
        list: [
          "Give you access to your personal path and workbooks",
          "Contact you personally",
          "Handle coaching, guidance and payments",
          "Email you about your journey (no marketing emails)",
        ],
      },
      {
        title: "4 · How we protect your data",
        paragraphs: [
          "Your data is stored in a secure database (Neon Postgres, EU). Connections are always encrypted via HTTPS. Emails are sent via a secure SMTP connection. Access is limited to Marion and strictly necessary technical administrators.",
        ],
      },
      {
        title: "5 · How long we keep your data",
        paragraphs: [
          "We keep your data as long as needed for the purpose for which it was collected — or as long as legally required for financial administration (seven years for invoices). You can request deletion at any time.",
        ],
      },
      {
        title: "6 · Your rights",
        paragraphs: ["You have the right to:"],
        list: [
          "Request access to your personal data",
          "Have your data corrected or deleted",
          "Object to processing",
          "Withdraw your consent",
          "File a complaint with the Dutch Data Protection Authority",
        ],
      },
      {
        title: "7 · Cookies",
        paragraphs: [
          "This website uses only functional cookies necessary for the site to work — such as your login and language preference. No tracking. No ads. No third-party analytics.",
        ],
      },
    ],
    closing: "with love, Marion",
  },
};

export default async function PrivacyPage() {
  const locale = await getLocale();
  return <Page locale={locale} />;
}

function Page({ locale }: { locale: Locale }) {
  const t = COPY[locale === "en" ? "en" : "nl"];

  return (
    <div className="min-h-screen bg-page">
      <header className="border-b border-line/40 bg-page-soft/40">
        <div className="max-w-3xl mx-auto px-5 py-5 sm:py-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.18em] uppercase text-ink-soft hover:text-tan transition"
          >
            <ChevronLeft size={14} />
            {t.backShort}
          </Link>
          <BrandLogo size="sm" linkTo="/" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-10 sm:mb-12">
          <p className="font-script text-tan text-3xl">{t.eyebrow}</p>
          <h1 className="font-serif font-medium text-3xl sm:text-4xl tracking-[0.06em] uppercase mt-2 text-ink">
            {t.title}
          </h1>
          <HeartDivider className="my-6" />
          <p className="text-[11px] tracking-[0.22em] uppercase text-muted">
            {t.updated}
          </p>
        </div>

        <div className="space-y-8 text-ink-soft text-[15px] leading-[1.85]">
          {t.sections.map((s, i) => (
            <section
              key={i}
              className="bg-page-soft/60 border border-line/50 rounded-md px-6 py-6 sm:px-8 sm:py-7"
            >
              <h2 className="font-serif font-medium text-lg sm:text-xl tracking-[0.04em] text-ink mb-3">
                {s.title}
              </h2>
              <div className="space-y-3">
                {s.paragraphs.map((p, j) =>
                  typeof p === "string" ? (
                    <p key={j}>{p}</p>
                  ) : (
                    <p key={j}>
                      <strong className="text-ink">{p.strong}</strong>{" "}
                      <a
                        href={`mailto:${p.rest}`}
                        className="text-tan hover:text-ink transition"
                      >
                        {p.rest}
                      </a>
                    </p>
                  )
                )}
                {s.list && (
                  <ul className="list-disc pl-5 space-y-1.5">
                    {s.list.map((li, k) => (
                      <li key={k}>{li}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="font-script text-tan text-2xl">{t.closing}</p>
        </div>
      </main>
    </div>
  );
}
