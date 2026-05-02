import HeroPanel from "@/components/sections/HeroPanel";
import PackageCard from "@/components/sections/PackageCard";
import WhatYouGet from "@/components/sections/WhatYouGet";
import Closing from "@/components/sections/Closing";
import { PACKAGE_LIST } from "@/lib/packages";
import { getLocale } from "@/lib/i18n/server";

export default async function Home() {
  const locale = await getLocale();
  return (
    <main className="max-w-[1180px] mx-auto px-5 sm:px-6 pt-4 sm:pt-6 pb-12 sm:pb-16">
      <HeroPanel locale={locale} />

      <section
        id="packages"
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mt-10 sm:mt-12 scroll-mt-20"
      >
        {PACKAGE_LIST.map((pkg, i) => (
          <PackageCard key={pkg.slug} pkg={pkg} index={i} locale={locale} />
        ))}
      </section>

      <div className="mt-11">
        <WhatYouGet locale={locale} />
      </div>

      <Closing locale={locale} />
    </main>
  );
}
