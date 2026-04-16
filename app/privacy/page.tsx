import { Leaf, Heart, ChevronLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacybeleid – The Beautiful Life",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30">
        <div className="max-w-3xl mx-auto px-5 py-5 md:py-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-sans text-sm text-brown hover:text-accent transition-colors duration-500"
          >
            <ChevronLeft size={16} />
            Terug
          </Link>
          <div className="flex items-center gap-2">
            <Leaf className="text-accent" size={18} strokeWidth={1.2} />
            <span className="font-serif text-dark text-xs italic tracking-wide">
              the beautiful life
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-5 py-12 md:py-20">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="font-serif text-dark text-[2rem] md:text-[2.6rem] font-light leading-tight mb-3">
            privacybeleid
          </h1>
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-accent/30" />
            <Heart
              className="text-accent fill-accent"
              size={10}
              strokeWidth={0}
            />
            <span className="w-8 h-px bg-accent/30" />
          </div>
          <p className="font-sans text-taupe text-xs mt-4 tracking-wider">
            Laatst bijgewerkt: april 2026
          </p>
        </div>

        <div className="space-y-10 md:space-y-12">
          <Section title="wie ben ik?">
            <p>
              Deze website wordt beheerd door Marion, oprichtster van The
              Beautiful Life Coaching Collective. Ik ben verantwoordelijk voor
              de verwerking van jouw persoonsgegevens zoals beschreven in dit
              privacybeleid.
            </p>
            <p>
              <strong>Contact:</strong>{" "}
              <a
                href="mailto:contact@thebeautifullife.nl"
                className="text-accent hover:text-dark transition-colors duration-500"
              >
                contact@thebeautifullife.nl
              </a>
            </p>
          </Section>

          <Section title="welke gegevens verzamel ik?">
            <p>Wanneer je je aanmeldt via de website, verzamel ik:</p>
            <ul>
              <li>Je voornaam</li>
              <li>Je e-mailadres</li>
            </ul>
            <p>
              Wanneer je de reflectievragenlijst invult, worden je antwoorden
              veilig opgeslagen en gekoppeld aan je aanmelding.
            </p>
          </Section>

          <Section title="waarvoor gebruik ik je gegevens?">
            <p>Ik gebruik je gegevens uitsluitend om:</p>
            <ul>
              <li>Je de reflectievragenlijst per e-mail toe te sturen</li>
              <li>
                Persoonlijk contact met je op te nemen naar aanleiding van je
                antwoorden
              </li>
              <li>Je te informeren over coaching en begeleiding</li>
            </ul>
            <p>
              Ik verkoop of deel je gegevens <strong>nooit</strong> met derden
              voor commerciële doeleinden.
            </p>
          </Section>

          <Section title="hoe bewaar ik je gegevens?">
            <p>
              Je gegevens worden opgeslagen in een beveiligde database. De
              verbinding is versleuteld (SSL) en de toegang is beperkt tot
              alleen mij. E-mails worden verstuurd via een beveiligde
              SMTP-verbinding.
            </p>
          </Section>

          <Section title="hoe lang bewaar ik je gegevens?">
            <p>
              Ik bewaar je gegevens zolang als nodig is voor het doel waarvoor
              ze zijn verzameld. Je kunt op elk moment vragen om verwijdering
              van je gegevens door een e-mail te sturen naar{" "}
              <a
                href="mailto:contact@thebeautifullife.nl"
                className="text-accent hover:text-dark transition-colors duration-500"
              >
                contact@thebeautifullife.nl
              </a>
              .
            </p>
          </Section>

          <Section title="jouw rechten">
            <p>Je hebt het recht om:</p>
            <ul>
              <li>Inzage te vragen in je persoonsgegevens</li>
              <li>Je gegevens te laten corrigeren of verwijderen</li>
              <li>
                Bezwaar te maken tegen de verwerking van je gegevens
              </li>
              <li>Je toestemming in te trekken</li>
            </ul>
            <p>
              Neem hiervoor contact op via{" "}
              <a
                href="mailto:contact@thebeautifullife.nl"
                className="text-accent hover:text-dark transition-colors duration-500"
              >
                contact@thebeautifullife.nl
              </a>
              . Ik reageer binnen 30 dagen.
            </p>
          </Section>

          <Section title="cookies">
            <p>
              Deze website gebruikt alleen functionele cookies die nodig zijn
              voor de werking van de site (bijvoorbeeld voor de admin
              inlogfunctie). Er worden geen tracking- of marketingcookies
              geplaatst.
            </p>
          </Section>
        </div>

        {/* Footer */}
        <div className="mt-16 md:mt-20 text-center">
          <Heart
            className="text-accent fill-accent mx-auto mb-4"
            size={12}
            strokeWidth={0}
          />
          <p className="font-sans text-taupe text-xs font-light">
            Vragen? Stuur gerust een berichtje.
          </p>
          <Link
            href="/"
            className="inline-block mt-6 font-sans text-accent text-xs tracking-wider hover:text-dark transition-colors duration-500"
          >
            ← terug naar de homepage
          </Link>
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
    <section>
      <h2 className="font-serif text-dark text-lg md:text-xl font-light mb-3">
        {title}
      </h2>
      <div className="font-sans text-brown text-[14px] md:text-[15px] leading-[1.9] font-light space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:text-dark [&_strong]:font-medium">
        {children}
      </div>
    </section>
  );
}
