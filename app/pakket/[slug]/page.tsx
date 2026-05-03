import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import type { Metadata } from "next";
import { PACKAGES, isPackageSlug } from "@/lib/packages";
import { BASE_FIELDS, PACKAGE_INTAKE } from "@/lib/intake-fields";
import IntakeForm from "@/components/intake/IntakeForm";
import WhatHappensNext from "@/components/sections/WhatHappensNext";
import { getLocale } from "@/lib/i18n/server";
import { DICT } from "@/lib/i18n/dict";
import { tr } from "@/lib/i18n/types";
import { buildMetadata, serviceLd, productLd, breadcrumbLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import FadeIn from "@/components/ui/FadeIn";
import { StaggerList } from "@/components/ui/StaggerList";
import Calligraphy from "@/components/ui/Calligraphy";
import HeartDraw from "@/components/ui/HeartDraw";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isPackageSlug(slug)) return {};
  const locale = await getLocale();
  const name = tr(DICT.packages.name[slug], locale);
  const tagline = tr(DICT.packages.tagline[slug], locale);
  return buildMetadata({
    title: `${name} — The Beautiful Life`,
    description: tagline,
    path: `/pakket/${slug}`,
    locale,
    ogImage: PACKAGES[slug].imageUrl,
  });
}

const KICKER = {
  ikigai: "kicker1",
  alignment: "kicker2",
  experience: "kicker3",
} as const;

export default async function PackagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!isPackageSlug(slug)) notFound();

  const pkg = PACKAGES[slug];
  const locale = await getLocale();
  const accentText =
    pkg.accent === "sage" ? "text-sage-deep" : pkg.accent === "tan" ? "text-tan" : "text-gold";
  const accentBar =
    pkg.accent === "sage" ? "bg-sage" : pkg.accent === "tan" ? "bg-tan" : "bg-gold";

  const nameLines = DICT.packages.nameLines[slug][locale];
  const tagline = tr(DICT.packages.tagline[slug], locale);
  const features = DICT.packages.features[slug][locale];
  const steps = DICT.pkgPage.steps[slug][locale];
  const quote = tr(DICT.packages.quote[slug], locale);
  const kicker = tr(
    DICT.packages[KICKER[slug]] as { nl: string; en: string },
    locale
  );
  const helper =
    slug === "experience"
      ? tr(DICT.pkgPage.helperExperience, locale)
      : slug === "alignment"
        ? tr(DICT.pkgPage.helperAlignment, locale)
        : tr(DICT.pkgPage.helperIkigai, locale);
  const submitLabel =
    slug === "experience"
      ? tr(DICT.pkgPage.ctaExperience, locale)
      : tr(DICT.pkgPage.cta, locale);

  const pkgName = tr(DICT.packages.name[slug], locale);
  const ld = [
    serviceLd({
      name: pkgName,
      description: tagline,
      priceCents: pkg.priceCents,
      slug,
      locale,
    }),
    productLd({
      name: pkgName,
      description: tagline,
      priceCents: pkg.priceCents,
      slug,
      imageUrl: pkg.imageUrl,
      locale,
    }),
    breadcrumbLd([
      { name: locale === "en" ? "Home" : "Home", path: "/" },
      { name: locale === "en" ? "Packages" : "Pakketten", path: "/#packages" },
      { name: pkgName, path: `/pakket/${slug}` },
    ]),
  ];

  return (
    <main className="max-w-[1180px] mx-auto px-5 sm:px-6 pt-4 sm:pt-6 pb-12 sm:pb-16">
      <JsonLd data={ld} />
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-ink-soft hover:text-tan text-sm mb-5 sm:mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> {tr(DICT.common.back, locale)}
      </Link>

      <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-14 items-start">
        <FadeIn direction="up" className="bg-page-soft rounded-[6px] p-6 sm:p-10 lg:p-12 shadow-[0_12px_40px_rgba(60,50,30,0.08)]">
          <div className={`flex items-center gap-2.5 ${accentText}`}>
            <span className={`h-px w-10 ${accentBar} opacity-60`} />
            <Calligraphy as="span" className="font-script text-2xl" text={kicker} durationPerChar={0.07} />
          </div>

          <h1 className="mt-3 font-serif font-medium text-2xl sm:text-3xl lg:text-4xl tracking-[0.06em] uppercase leading-tight text-ink">
            {nameLines[0]}
            {nameLines[1] && (
              <>
                <br />
                {nameLines[1]}
              </>
            )}
          </h1>

          <p className="mt-4 text-ink-soft text-[15px] leading-[1.7] max-w-md">
            {tagline}
          </p>

          <div className="my-7 flex items-center gap-2.5 text-tan">
            <span className="h-px w-12 bg-tan/55" />
            <HeartDraw size={14} />
            <span className="h-px w-12 bg-tan/55" />
          </div>

          <h2 className="font-serif font-medium tracking-[0.22em] uppercase text-[12px] text-ink mb-3">
            {tr(DICT.pkgPage.whatYouGet, locale)}
          </h2>
          <StaggerList className="flex flex-col gap-2.5 text-[14px] text-ink">
            {features.map((f) => (
              <li key={f} className="flex gap-2.5 leading-snug">
                <span className="flex-none w-4 h-4 rounded-full border border-tan inline-flex items-center justify-center mt-0.5">
                  <Check size={9} strokeWidth={2.2} className="text-tan" />
                </span>
                <span>{f}</span>
              </li>
            ))}
          </StaggerList>

          <h2 className="mt-8 font-serif font-medium tracking-[0.22em] uppercase text-[12px] text-ink mb-3">
            {tr(DICT.pkgPage.howItWorks, locale)}
          </h2>
          <StaggerList
            baseDelay={0.1}
            className="flex flex-col gap-3 text-[14px] text-ink-soft"
          >
            {steps.map((step, i) => (
              <li key={step} className="flex gap-3 leading-snug">
                <span
                  className={`flex-none w-6 h-6 rounded-full ${accentBar} text-white text-xs font-medium flex items-center justify-center mt-0.5`}
                >
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </StaggerList>

          <Calligraphy
            as="p"
            className="mt-9 font-script text-tan text-2xl leading-snug"
            text={`“${quote}”`}
            durationPerChar={0.04}
            delay={0.3}
          />
        </FadeIn>

        <FadeIn direction="up" delay={0.15} className="bg-page-soft rounded-[6px] p-6 sm:p-9 lg:p-10 shadow-[0_12px_40px_rgba(60,50,30,0.08)] lg:sticky lg:top-24">
          <div className="text-center mb-6">
            <Calligraphy
              as="p"
              className={`font-script text-2xl ${accentText}`}
              text={tr(DICT.pkgPage.enroll, locale)}
              durationPerChar={0.07}
            />
            <h2 className="font-serif font-medium tracking-[0.18em] uppercase text-lg text-ink mt-1">
              {pkg.priceLabel}
            </h2>
            <p className="text-[12px] text-ink-soft mt-2">{helper}</p>
          </div>

          <WhatHappensNext slug={slug} locale={locale} accent={pkg.accent} />

          <IntakeForm
            pkgSlug={slug}
            accent={pkg.accent}
            baseFields={BASE_FIELDS(locale)}
            packageFields={PACKAGE_INTAKE(slug, locale)}
            submitLabel={submitLabel}
            consentText={tr(DICT.pkgPage.consent, locale)}
            errorPrefix={tr(DICT.intake.fields.pleaseFill, locale)}
            submittingLabel={tr(DICT.intake.fields.submitting, locale)}
            scaleLow={tr(DICT.intake.fields.scaleLow, locale)}
            scaleHigh={tr(DICT.intake.fields.scaleHigh, locale)}
            chooseLabel={tr(DICT.intake.fields.choose, locale)}
            requiredAffix="*"
          />
        </FadeIn>
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return [{ slug: "ikigai" }, { slug: "alignment" }, { slug: "experience" }];
}
