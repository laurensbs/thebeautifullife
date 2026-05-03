import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import HeartDivider from "@/components/ui/HeartDivider";
import BrandLogo from "@/components/ui/BrandLogo";

export const metadata = {
  title: "Algemene voorwaarden — The Beautiful Life",
  description:
    "Algemene voorwaarden voor coaching, werkboeken en diensten van The Beautiful Life · Marion Lubach.",
  robots: { index: true, follow: true },
};

export default function VoorwaardenPage() {
  return (
    <div className="min-h-screen bg-page">
      <header className="border-b border-line/40 bg-page-soft/40">
        <div className="max-w-3xl mx-auto px-5 py-5 sm:py-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.18em] uppercase text-ink-soft hover:text-tan transition"
          >
            <ChevronLeft size={14} />
            Terug
          </Link>
          <BrandLogo size="sm" linkTo="/" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-10 sm:mb-12">
          <p className="font-script text-tan text-3xl">het kleine lettertje</p>
          <h1 className="font-serif font-medium text-3xl sm:text-4xl tracking-[0.06em] uppercase mt-2 text-ink">
            Algemene voorwaarden
          </h1>
          <HeartDivider className="my-6" />
          <p className="text-[11px] tracking-[0.22em] uppercase text-muted">
            Laatst bijgewerkt: mei 2026
          </p>
        </div>

        <div className="space-y-8 text-ink-soft text-[15px] leading-[1.85]">
          <Section title="1 · Wie wij zijn">
            <p>
              The Beautiful Life is een coaching-praktijk van{" "}
              <strong className="text-ink">Marion Lubach</strong>, gevestigd in
              Nederland. Voor vragen, klachten of contact:{" "}
              <a href="mailto:contact@thebeautifullife.nl" className="text-tan hover:text-ink transition">
                contact@thebeautifullife.nl
              </a>
              .
            </p>
            <p className="text-[13.5px] text-muted mt-3">
              KvK-nummer en btw-nummer worden op verzoek verstrekt en zijn
              vermeld op iedere factuur.
            </p>
          </Section>

          <Section title="2 · Toepasselijkheid">
            <p>
              Deze voorwaarden gelden voor elke overeenkomst tussen The
              Beautiful Life en jou als klant — voor de gratis
              reflectievragenlijst, betaalde werkboeken, 1-op-1 sessies en het
              Beautiful Life Experience-programma.
            </p>
          </Section>

          <Section title="3 · Aanmelden en betalen">
            <p>
              Door je aan te melden voor een pakket of sessie ga je akkoord met
              deze voorwaarden. Betaling vindt plaats vooraf, via een veilige
              link die je per e-mail ontvangt. Je krijgt direct een
              betalingsbevestiging. Werkboeken en toegang tot het persoonlijk
              pad worden geleverd na ontvangst van betaling.
            </p>
          </Section>

          <Section title="4 · Wettelijke bedenktijd">
            <p>
              Voor digitale producten geldt een bedenktijd van{" "}
              <strong className="text-ink">14 dagen</strong> na aanschaf. Zodra
              je je werkboek opent of een sessie hebt gevolgd, vervalt het
              herroepingsrecht. Als je binnen de bedenktijd wilt herroepen:
              stuur ons een mail. We betalen dan binnen 14 dagen het volledige
              bedrag terug.
            </p>
          </Section>

          <Section title="5 · Annuleren of verzetten van afspraken">
            <p>
              Plannen veranderen — dat begrijpen we. Een geplande 1-op-1 sessie
              kun je tot <strong className="text-ink">48 uur van tevoren</strong>{" "}
              kosteloos verzetten. Bij annulering binnen 48 uur, of bij
              no-show, brengen we het volledige sessiebedrag in rekening.
            </p>
            <p>
              Voor het Beautiful Life Experience-programma geldt een aparte
              annuleringsregeling die je voor aanvang ontvangt.
            </p>
          </Section>

          <Section title="6 · Wat je van ons mag verwachten">
            <p>
              We doen ons werk met zorg en aandacht. Coaching is geen medische
              of psychologische behandeling — wij zijn geen vervanging voor
              huisarts, psycholoog of therapeut. Bij ernstige psychische of
              lichamelijke klachten verwijzen we je door.
            </p>
            <p>
              Wat je in werkboeken of sessies deelt, blijft tussen jou en
              Marion. We verwerken je gegevens volgens onze{" "}
              <Link href="/privacy" className="text-tan hover:text-ink transition">
                privacyverklaring
              </Link>
              .
            </p>
          </Section>

          <Section title="7 · Wat we van jou vragen">
            <p>
              Eerlijkheid en bereidheid om naar jezelf te kijken. Het werk
              werkt niet vanzelf — jij bent degene die schrijft, voelt en
              kiest. We vragen je respectvol om te gaan met afspraken en
              materialen.
            </p>
            <p>
              Werkboeken, audio en teksten van The Beautiful Life zijn
              auteursrechtelijk beschermd. Je mag ze gebruiken voor jezelf —
              niet doorverkopen, kopiëren of publiceren.
            </p>
          </Section>

          <Section title="8 · Aansprakelijkheid">
            <p>
              We zijn niet aansprakelijk voor schade die voortvloeit uit
              keuzes die je maakt op basis van wat je in onze trajecten
              ontdekt. Onze aansprakelijkheid is altijd beperkt tot het
              bedrag dat je voor de betreffende dienst hebt betaald.
            </p>
          </Section>

          <Section title="9 · Klachten">
            <p>
              Heb je een klacht? Vertel het ons direct via{" "}
              <a href="mailto:contact@thebeautifullife.nl" className="text-tan hover:text-ink transition">
                contact@thebeautifullife.nl
              </a>
              . We reageren binnen 5 werkdagen en zoeken samen naar een
              oplossing. Komen we er niet uit, dan kun je je wenden tot een
              onafhankelijke geschillencommissie.
            </p>
          </Section>

          <Section title="10 · Toepasselijk recht">
            <p>
              Op deze voorwaarden is Nederlands recht van toepassing.
              Geschillen worden voorgelegd aan de bevoegde Nederlandse
              rechter.
            </p>
          </Section>
        </div>

        <div className="mt-14 text-center">
          <p className="font-script text-tan text-2xl">met liefde, Marion</p>
        </div>
      </main>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-page-soft/60 border border-line/50 rounded-md px-6 py-6 sm:px-8 sm:py-7">
      <h2 className="font-serif font-medium text-lg sm:text-xl tracking-[0.04em] text-ink mb-3">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
