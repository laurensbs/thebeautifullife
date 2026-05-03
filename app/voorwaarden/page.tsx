import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import HeartDivider from "@/components/ui/HeartDivider";
import BrandLogo from "@/components/ui/BrandLogo";
import { getLocale } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/types";

export const metadata = {
  title: "Algemene voorwaarden — The Beautiful Life",
  description:
    "Algemene voorwaarden voor coaching, werkboeken en diensten van The Beautiful Life · Marion Lubach. Aanmelden, betalen, bedenktijd en annulering.",
  robots: { index: true, follow: true },
};

type Section = {
  title: string;
  body: { type: "p" | "small"; html: string }[];
};

type CopyBlock = {
  eyebrow: string;
  title: string;
  updated: string;
  backShort: string;
  closing: string;
  sections: Section[];
};

const COPY: Record<"nl" | "en", CopyBlock> = {
  nl: {
    eyebrow: "het kleine lettertje",
    title: "Algemene voorwaarden",
    updated: "Laatst bijgewerkt: mei 2026",
    backShort: "Terug",
    closing: "met liefde, Marion",
    sections: [
      {
        title: "1 · Wie wij zijn",
        body: [
          {
            type: "p",
            html:
              'The Beautiful Life is een coaching-praktijk van <strong class="text-ink">Marion Lubach</strong>, gevestigd in Nederland. Voor vragen, klachten of contact: <a href="mailto:contact@thebeautifullife.nl" class="text-tan hover:text-ink transition">contact@thebeautifullife.nl</a>.',
          },
          {
            type: "small",
            html:
              "KvK-nummer: 72639970. Het btw-nummer staat vermeld op iedere factuur.",
          },
        ],
      },
      {
        title: "2 · Toepasselijkheid",
        body: [
          {
            type: "p",
            html:
              "Deze voorwaarden gelden voor elke overeenkomst tussen The Beautiful Life en jou als klant — voor de gratis reflectievragenlijst, betaalde werkboeken, 1-op-1 sessies en het Beautiful Life Experience-programma.",
          },
        ],
      },
      {
        title: "3 · Aanmelden en betalen",
        body: [
          {
            type: "p",
            html:
              "Door je aan te melden voor een pakket of sessie ga je akkoord met deze voorwaarden. Betaling vindt plaats vooraf, via een veilige link die je per e-mail ontvangt. Je krijgt direct een betalingsbevestiging. Werkboeken en toegang tot het persoonlijk pad worden geleverd na ontvangst van betaling.",
          },
        ],
      },
      {
        title: "4 · Wettelijke bedenktijd",
        body: [
          {
            type: "p",
            html:
              'Voor digitale producten geldt een bedenktijd van <strong class="text-ink">14 dagen</strong> na aanschaf. Zodra je je werkboek opent of een sessie hebt gevolgd, vervalt het herroepingsrecht. Als je binnen de bedenktijd wilt herroepen: stuur ons een mail. We betalen dan binnen 14 dagen het volledige bedrag terug.',
          },
        ],
      },
      {
        title: "5 · Annuleren of verzetten van afspraken",
        body: [
          {
            type: "p",
            html:
              'Plannen veranderen — dat begrijpen we. Een geplande 1-op-1 sessie kun je tot <strong class="text-ink">48 uur van tevoren</strong> kosteloos verzetten. Bij annulering binnen 48 uur, of bij no-show, brengen we het volledige sessiebedrag in rekening.',
          },
          {
            type: "p",
            html:
              "Voor het Beautiful Life Experience-programma geldt een aparte annuleringsregeling die je voor aanvang ontvangt.",
          },
        ],
      },
      {
        title: "6 · Wat je van ons mag verwachten",
        body: [
          {
            type: "p",
            html:
              "We doen ons werk met zorg en aandacht. Coaching is geen medische of psychologische behandeling — wij zijn geen vervanging voor huisarts, psycholoog of therapeut. Bij ernstige psychische of lichamelijke klachten verwijzen we je door.",
          },
          {
            type: "p",
            html:
              'Wat je in werkboeken of sessies deelt, blijft tussen jou en Marion. We verwerken je gegevens volgens onze <a href="/privacy" class="text-tan hover:text-ink transition">privacyverklaring</a>.',
          },
        ],
      },
      {
        title: "7 · Wat we van jou vragen",
        body: [
          {
            type: "p",
            html:
              "Eerlijkheid en bereidheid om naar jezelf te kijken. Het werk werkt niet vanzelf — jij bent degene die schrijft, voelt en kiest. We vragen je respectvol om te gaan met afspraken en materialen.",
          },
          {
            type: "p",
            html:
              "Werkboeken, audio en teksten van The Beautiful Life zijn auteursrechtelijk beschermd. Je mag ze gebruiken voor jezelf — niet doorverkopen, kopiëren of publiceren.",
          },
        ],
      },
      {
        title: "8 · Aansprakelijkheid",
        body: [
          {
            type: "p",
            html:
              "We zijn niet aansprakelijk voor schade die voortvloeit uit keuzes die je maakt op basis van wat je in onze trajecten ontdekt. Onze aansprakelijkheid is altijd beperkt tot het bedrag dat je voor de betreffende dienst hebt betaald.",
          },
        ],
      },
      {
        title: "9 · Klachten",
        body: [
          {
            type: "p",
            html:
              'Heb je een klacht? Vertel het ons direct via <a href="mailto:contact@thebeautifullife.nl" class="text-tan hover:text-ink transition">contact@thebeautifullife.nl</a>. We reageren binnen 5 werkdagen en zoeken samen naar een oplossing. Komen we er niet uit, dan kun je je wenden tot een onafhankelijke geschillencommissie.',
          },
        ],
      },
      {
        title: "10 · Toepasselijk recht",
        body: [
          {
            type: "p",
            html:
              "Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde Nederlandse rechter.",
          },
        ],
      },
    ],
  },
  en: {
    eyebrow: "the fine print",
    title: "Terms & Conditions",
    updated: "Last updated: May 2026",
    backShort: "Back",
    closing: "with love, Marion",
    sections: [
      {
        title: "1 · Who we are",
        body: [
          {
            type: "p",
            html:
              'The Beautiful Life is a coaching practice run by <strong class="text-ink">Marion Lubach</strong>, based in the Netherlands. For questions, complaints or contact: <a href="mailto:contact@thebeautifullife.nl" class="text-tan hover:text-ink transition">contact@thebeautifullife.nl</a>.',
          },
          {
            type: "small",
            html:
              "Chamber of Commerce (KvK) number: 72639970. The VAT number appears on every invoice.",
          },
        ],
      },
      {
        title: "2 · Applicability",
        body: [
          {
            type: "p",
            html:
              "These terms apply to every agreement between The Beautiful Life and you as a client — for the free reflection questionnaire, paid workbooks, 1-on-1 sessions and the Beautiful Life Experience programme.",
          },
        ],
      },
      {
        title: "3 · Sign-up and payment",
        body: [
          {
            type: "p",
            html:
              "By signing up for a package or session you agree to these terms. Payment is made in advance via a secure link sent by email. You receive a confirmation right away. Workbooks and access to your personal path are delivered after payment is received.",
          },
        ],
      },
      {
        title: "4 · Legal cooling-off period",
        body: [
          {
            type: "p",
            html:
              'For digital products a cooling-off period of <strong class="text-ink">14 days</strong> applies after purchase. As soon as you open your workbook or have attended a session, the right of withdrawal expires. To withdraw within the cooling-off period: send us an email. We will refund the full amount within 14 days.',
          },
        ],
      },
      {
        title: "5 · Cancelling or rescheduling appointments",
        body: [
          {
            type: "p",
            html:
              'Plans change — we understand. A scheduled 1-on-1 session can be rescheduled free of charge up to <strong class="text-ink">48 hours in advance</strong>. For cancellations within 48 hours, or no-shows, we charge the full session fee.',
          },
          {
            type: "p",
            html:
              "A separate cancellation policy applies to the Beautiful Life Experience programme; you receive it before the start.",
          },
        ],
      },
      {
        title: "6 · What you can expect from us",
        body: [
          {
            type: "p",
            html:
              "We do our work with care and attention. Coaching is not a medical or psychological treatment — we are not a substitute for a doctor, psychologist or therapist. For serious psychological or physical complaints we will refer you on.",
          },
          {
            type: "p",
            html:
              'What you share in workbooks or sessions stays between you and Marion. We process your data according to our <a href="/privacy" class="text-tan hover:text-ink transition">privacy notice</a>.',
          },
        ],
      },
      {
        title: "7 · What we ask from you",
        body: [
          {
            type: "p",
            html:
              "Honesty and a willingness to look at yourself. The work does not work on its own — you are the one who writes, feels and chooses. We ask you to treat appointments and materials with respect.",
          },
          {
            type: "p",
            html:
              "Workbooks, audio and texts by The Beautiful Life are protected by copyright. You may use them for yourself — not resell, copy or publish.",
          },
        ],
      },
      {
        title: "8 · Liability",
        body: [
          {
            type: "p",
            html:
              "We are not liable for damages resulting from choices you make based on what you discover in our programmes. Our liability is always limited to the amount you paid for the relevant service.",
          },
        ],
      },
      {
        title: "9 · Complaints",
        body: [
          {
            type: "p",
            html:
              'Do you have a complaint? Tell us directly via <a href="mailto:contact@thebeautifullife.nl" class="text-tan hover:text-ink transition">contact@thebeautifullife.nl</a>. We reply within 5 working days and look for a solution together. If we cannot resolve it, you can contact an independent disputes committee.',
          },
        ],
      },
      {
        title: "10 · Applicable law",
        body: [
          {
            type: "p",
            html:
              "Dutch law applies to these terms. Disputes are submitted to the competent Dutch court.",
          },
        ],
      },
    ],
  },
};

export default async function VoorwaardenPage() {
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
                {s.body.map((b, j) =>
                  b.type === "p" ? (
                    <p key={j} dangerouslySetInnerHTML={{ __html: b.html }} />
                  ) : (
                    <p
                      key={j}
                      className="text-[13.5px] text-muted mt-1"
                      dangerouslySetInnerHTML={{ __html: b.html }}
                    />
                  )
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
