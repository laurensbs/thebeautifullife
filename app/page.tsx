import HeroPanel from "@/components/sections/HeroPanel";
import PackageCard from "@/components/sections/PackageCard";
import WhatYouGet from "@/components/sections/WhatYouGet";
import FreeReflectionCta from "@/components/sections/FreeReflectionCta";
import AboutMarion from "@/components/sections/AboutMarion";
import Recognition from "@/components/sections/Recognition";
import Outcomes from "@/components/sections/Outcomes";
import FAQ from "@/components/sections/FAQ";
import Closing from "@/components/sections/Closing";
import HeartDivider from "@/components/ui/HeartDivider";
import JsonLd from "@/components/seo/JsonLd";
import { PACKAGE_LIST } from "@/lib/packages";
import { getLocale } from "@/lib/i18n/server";
import { getFaq } from "@/lib/faq-data";
import { faqPageLd } from "@/lib/seo";

export default async function Home() {
  const locale = await getLocale();
  const faq = getFaq(locale);
  const isEN = locale === "en";

  // Sectie-titel boven de pakketten — frame als '3 stappen' i.p.v.
  // '3 alternatieven'. Verlaagt keuze-stress, communiceert progressie.
  const pathTitle = {
    eyebrow: isEN ? "your path" : "jouw pad",
    title: isEN
      ? "In three steps back to yourself"
      : "In drie stappen terug naar jezelf",
    sub: isEN
      ? "Not all at once, but step by step. From calm to clarity to a life that fits."
      : "Niet alles tegelijk, maar stap voor stap. Van rust naar helderheid naar een leven dat klopt.",
  };

  return (
    <main className="max-w-[1180px] mx-auto px-5 sm:px-6 pt-4 sm:pt-6 pb-12 sm:pb-16">
      <JsonLd data={faqPageLd(faq.items)} />
      <HeroPanel locale={locale} />

      <Recognition locale={locale} />

      <AboutMarion locale={locale} />

      {/* Pakketten — geframed als 3 stappen */}
      <section
        id="packages"
        className="mt-12 sm:mt-16 scroll-mt-20"
      >
        <div className="text-center max-w-xl mx-auto mb-7 sm:mb-9">
          <p className="font-script text-tan text-2xl sm:text-3xl">
            {pathTitle.eyebrow}
          </p>
          <h2 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.04em] uppercase mt-1 text-ink leading-snug">
            {pathTitle.title}
          </h2>
          <HeartDivider className="my-5" />
          <p className="text-ink-soft text-[14.5px] sm:text-[15px] leading-[1.85] italic font-serif">
            {pathTitle.sub}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {PACKAGE_LIST.map((pkg, i) => (
            <PackageCard key={pkg.slug} pkg={pkg} index={i} locale={locale} />
          ))}
        </div>
      </section>

      <Outcomes locale={locale} />

      <div className="mt-14 sm:mt-16">
        <WhatYouGet locale={locale} />
      </div>

      <FreeReflectionCta locale={locale} />

      <FAQ locale={locale} />

      <Closing locale={locale} />
    </main>
  );
}
