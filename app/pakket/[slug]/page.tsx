import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { PACKAGES, isPackageSlug } from "@/lib/packages";
import { BASE_FIELDS, PACKAGE_INTAKE } from "@/lib/intake-fields";
import IntakeForm from "@/components/intake/IntakeForm";

const NEXT_STEPS: Record<string, string[]> = {
  ikigai: [
    "Je rondt je aanmelding af",
    "Je betaalt veilig met iDEAL of creditcard (binnenkort via Mollie)",
    "Je vult de Ikigai-vragenlijst in (~20 min)",
    "Marion stuurt jouw persoonlijke Ikigai-document binnen 5 werkdagen",
  ],
  alignment: [
    "Je rondt je aanmelding af",
    "Je betaalt veilig (binnenkort via Mollie)",
    "Je vult de uitgebreide vragenlijst in",
    "We plannen samen 1–2 calls (Zoom)",
    "Je ontvangt een praktisch plan op maat",
  ],
  experience: [
    "Je rondt je aanmelding af",
    "Marion neemt persoonlijk contact met je op voor een kennismakingsgesprek",
    "Samen bepalen we datum, locatie en wensen",
    "Na bevestiging volgt de betaling",
    "Je 8-daagse Beautiful Life Experience start",
  ],
};

export default async function PackagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isPackageSlug(slug)) notFound();

  const pkg = PACKAGES[slug];
  const accentText =
    pkg.accent === "sage" ? "text-sage-deep" : pkg.accent === "tan" ? "text-tan" : "text-gold";
  const accentBar =
    pkg.accent === "sage" ? "bg-sage" : pkg.accent === "tan" ? "bg-tan" : "bg-gold";

  return (
    <main className="max-w-[1180px] mx-auto px-6 pt-6 pb-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-ink-soft hover:text-tan text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> terug
      </Link>

      <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-start">
        {/* Left column: package story */}
        <div className="bg-page-soft rounded-[6px] p-8 sm:p-12 shadow-[0_12px_40px_rgba(60,50,30,0.08)]">
          <div className={`flex items-center gap-2.5 ${accentText}`}>
            <span className={`h-px w-10 ${accentBar} opacity-60`} />
            <span className="font-script text-2xl">{pkg.kicker}</span>
          </div>

          <h1 className="mt-3 font-serif font-medium text-3xl sm:text-4xl tracking-[0.06em] uppercase leading-tight text-ink">
            {pkg.nameLines[0]}
            {pkg.nameLines[1] && (
              <>
                <br />
                {pkg.nameLines[1]}
              </>
            )}
          </h1>

          <p className="mt-4 text-ink-soft text-[15px] leading-[1.7] max-w-md">
            {pkg.tagline}
          </p>

          <div className="my-7 flex items-center gap-2.5 text-tan">
            <span className="h-px w-12 bg-tan/55" />
            <span className="text-sm">♡</span>
            <span className="h-px w-12 bg-tan/55" />
          </div>

          <h2 className="font-serif font-medium tracking-[0.22em] uppercase text-[12px] text-ink mb-3">
            Wat je krijgt
          </h2>
          <ul className="flex flex-col gap-2.5 text-[14px] text-ink">
            {pkg.features.map((f) => (
              <li key={f} className="flex gap-2.5 leading-snug">
                <span className="flex-none w-4 h-4 rounded-full border border-tan inline-flex items-center justify-center mt-0.5">
                  <Check size={9} strokeWidth={2.2} className="text-tan" />
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-8 font-serif font-medium tracking-[0.22em] uppercase text-[12px] text-ink mb-3">
            Hoe het werkt
          </h2>
          <ol className="flex flex-col gap-3 text-[14px] text-ink-soft">
            {NEXT_STEPS[slug].map((step, i) => (
              <li key={step} className="flex gap-3 leading-snug">
                <span
                  className={`flex-none w-6 h-6 rounded-full ${accentBar} text-white text-xs font-medium flex items-center justify-center mt-0.5`}
                >
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <p className="mt-9 font-script text-tan text-2xl leading-snug">
            &ldquo;{pkg.quote}&rdquo;
          </p>
        </div>

        {/* Right column: intake form */}
        <div className="bg-page-soft rounded-[6px] p-8 sm:p-10 shadow-[0_12px_40px_rgba(60,50,30,0.08)] lg:sticky lg:top-6">
          <div className="text-center mb-6">
            <p className={`font-script text-2xl ${accentText}`}>Aanmelden</p>
            <h2 className="font-serif font-medium tracking-[0.18em] uppercase text-lg text-ink mt-1">
              {pkg.priceLabel}
            </h2>
            <p className="text-[12px] text-ink-soft mt-2">
              {slug === "experience"
                ? "Je vult eerst dit formulier in. Marion neemt daarna persoonlijk contact op."
                : "Vul onderstaand formulier in om te starten."}
            </p>
          </div>

          <IntakeForm
            pkgSlug={slug}
            accent={pkg.accent}
            baseFields={BASE_FIELDS}
            packageFields={PACKAGE_INTAKE[slug]}
            submitLabel={
              slug === "experience" ? "Verstuur mijn aanmelding" : "Ga verder"
            }
          />
        </div>
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return [{ slug: "ikigai" }, { slug: "alignment" }, { slug: "experience" }];
}
