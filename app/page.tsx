import Link from "next/link";
import HeroPanel from "@/components/sections/HeroPanel";
import PackageCard from "@/components/sections/PackageCard";
import WhatYouGet from "@/components/sections/WhatYouGet";
import Closing from "@/components/sections/Closing";
import { PACKAGE_LIST } from "@/lib/packages";

export default function Home() {
  return (
    <main className="max-w-[1180px] mx-auto px-6 pt-6 pb-16">
      <div className="flex justify-end mb-3">
        <Link
          href="/mijn-pad/login"
          className="text-[11px] tracking-[0.22em] uppercase text-ink-soft hover:text-tan transition"
        >
          Mijn pad →
        </Link>
      </div>
      <HeroPanel />

      <section className="grid md:grid-cols-3 gap-7 mt-12">
        {PACKAGE_LIST.map((pkg, i) => (
          <PackageCard key={pkg.slug} pkg={pkg} index={i} />
        ))}
      </section>

      <div className="mt-11">
        <WhatYouGet />
      </div>

      <Closing />
    </main>
  );
}
