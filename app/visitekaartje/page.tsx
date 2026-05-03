import Link from "next/link";
import { ChevronLeft, Download } from "lucide-react";
import HeartDivider from "@/components/ui/HeartDivider";
import BrandLogo from "@/components/ui/BrandLogo";

export const metadata = {
  title: "Visitekaartje — The Beautiful Life",
  robots: { index: false, follow: false },
};

export default function VisitekaartjePage() {
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
        <div className="text-center mb-10">
          <p className="font-script text-tan text-3xl">klaar om te printen</p>
          <h1 className="font-serif font-medium text-3xl sm:text-4xl tracking-[0.06em] uppercase mt-2 text-ink">
            Visitekaartje
          </h1>
          <HeartDivider className="my-6" />
          <p className="text-ink-soft text-[14.5px] leading-[1.85] max-w-md mx-auto">
            Twee kanten in de huisstijl van The Beautiful Life. Formaat:{" "}
            <strong className="text-ink">85 × 55 mm</strong> met 2 mm bleed
            (totaal 89 × 59 mm) op 300 DPI — past direct op het standaard
            VistaPrint-formaat.
          </p>
        </div>

        {/* Voorzijde */}
        <section className="bg-page-soft rounded-[6px] shadow-[0_12px_40px_rgba(60,50,30,0.06)] px-6 py-7 sm:px-8 sm:py-9 mb-6">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <div>
              <p className="text-[10px] tracking-[0.32em] uppercase text-muted">
                Zijde 1
              </p>
              <h2 className="font-serif font-medium text-xl tracking-[0.04em] text-ink mt-1">
                Voorzijde
              </h2>
            </div>
            <a
              href="/visitekaartje/voor"
              download="thebeautifullife-visitekaartje-voor.png"
              className="inline-flex items-center gap-2 bg-ink hover:brightness-110 text-white px-5 py-2.5 rounded-[3px] font-sans text-[11px] tracking-[0.22em] uppercase transition shadow-[0_6px_18px_rgba(60,50,30,0.12)]"
            >
              <Download size={13} /> Download PNG
            </a>
          </div>
          <div className="bg-page rounded-md overflow-hidden border border-line/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/visitekaartje/voor"
              alt="Visitekaartje voorzijde"
              className="block w-full h-auto"
              style={{ aspectRatio: "1051 / 697" }}
            />
          </div>
        </section>

        {/* Achterzijde */}
        <section className="bg-page-soft rounded-[6px] shadow-[0_12px_40px_rgba(60,50,30,0.06)] px-6 py-7 sm:px-8 sm:py-9 mb-6">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <div>
              <p className="text-[10px] tracking-[0.32em] uppercase text-muted">
                Zijde 2
              </p>
              <h2 className="font-serif font-medium text-xl tracking-[0.04em] text-ink mt-1">
                Achterzijde
              </h2>
            </div>
            <a
              href="/visitekaartje/achter"
              download="thebeautifullife-visitekaartje-achter.png"
              className="inline-flex items-center gap-2 bg-ink hover:brightness-110 text-white px-5 py-2.5 rounded-[3px] font-sans text-[11px] tracking-[0.22em] uppercase transition shadow-[0_6px_18px_rgba(60,50,30,0.12)]"
            >
              <Download size={13} /> Download PNG
            </a>
          </div>
          <div className="bg-page rounded-md overflow-hidden border border-line/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/visitekaartje/achter"
              alt="Visitekaartje achterzijde"
              className="block w-full h-auto"
              style={{ aspectRatio: "1051 / 697" }}
            />
          </div>
        </section>

        {/* Vista-print uitleg */}
        <section className="bg-page-soft/60 border border-line/50 rounded-md px-6 py-6 sm:px-8 sm:py-7 text-[13.5px] text-ink-soft leading-[1.85]">
          <h3 className="font-serif font-medium text-lg tracking-[0.04em] text-ink mb-3">
            Uploaden naar VistaPrint
          </h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Ga naar VistaPrint en kies <em className="text-ink">Visitekaartjes — standaard formaat (85 × 55 mm)</em>.
            </li>
            <li>
              Kies <em className="text-ink">"Eigen ontwerp uploaden"</em> en upload eerst de voorzijde-PNG en daarna de achterzijde-PNG.
            </li>
            <li>
              VistaPrint toont een snijlijn-preview — de tan-randen lopen door tot in de bleed-zone, dus snijden geeft geen witte randen.
            </li>
            <li>
              Bestelling: aanbevolen <em className="text-ink">mat papier</em> of{" "}
              <em className="text-ink">premium soft-touch</em> voor de zachte uitstraling die past bij The Beautiful Life.
            </li>
          </ol>
          <p className="text-[12px] text-muted mt-4 italic">
            Tip: voor een PDF-versie open je het PNG in Voorbeeld op Mac of een PDF-printer en exporteer je naar PDF.
          </p>
        </section>
      </main>
    </div>
  );
}
