"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { PACKAGES, type PackageSlug } from "@/lib/packages";
import HeartDraw from "@/components/ui/HeartDraw";

export default function PersonalRecommendation({
  primarySlug,
  reason,
  firstName,
}: {
  primarySlug: PackageSlug;
  reason: string;
  firstName: string;
}) {
  const [showOthers, setShowOthers] = useState(false);
  const primary = PACKAGES[primarySlug];
  const others = (Object.keys(PACKAGES) as PackageSlug[])
    .filter((s) => s !== primarySlug)
    .map((s) => PACKAGES[s]);

  const accentBar =
    primary.accent === "sage"
      ? "bg-sage"
      : primary.accent === "tan"
        ? "bg-tan"
        : "bg-[var(--color-gold,#AE8A4E)]";

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] shadow-[0_18px_48px_rgba(60,50,30,0.08)] mb-7 sm:mb-8 relative overflow-hidden"
    >
      <span className={`absolute top-0 left-0 right-0 h-0.5 ${accentBar}`} />

      <div className="grid md:grid-cols-[280px_1fr] gap-0">
        {primary.imageUrl && (
          <div className="relative aspect-[4/5] md:aspect-auto md:min-h-[360px] bg-page-dark">
            <Image
              src={primary.imageUrl}
              alt={primary.name}
              fill
              sizes="(max-width: 768px) 100vw, 280px"
              className="object-cover object-top"
            />
          </div>
        )}

        <div className="px-6 py-9 sm:px-10 sm:py-11">
          <p className="font-script text-tan text-2xl sm:text-3xl">
            een gedachte van Marion
          </p>

          <h2 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.04em] text-ink mt-2 leading-tight">
            {firstName}, ik denk dat dit bij je past
          </h2>

          <div className="mt-4 mb-5 flex items-center gap-2.5 text-tan">
            <span className="h-px w-10 bg-tan/55" />
            <HeartDraw size={12} />
            <span className="h-px w-10 bg-tan/55" />
          </div>

          <p className="text-[11px] tracking-[0.28em] uppercase text-muted mb-1">
            {primary.kicker} · {primary.priceLabel}
          </p>
          <p className="font-serif text-xl sm:text-2xl text-ink tracking-[0.04em] mb-3">
            {primary.name}
          </p>
          <p className="text-ink-soft text-[14.5px] leading-[1.85] italic font-serif">
            {reason}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href={`/pakket/${primary.slug}`}
              className="inline-flex items-center gap-2 bg-ink hover:brightness-110 text-white px-6 py-3 rounded-[3px] font-sans text-[11px] tracking-[0.22em] uppercase transition shadow-[0_6px_18px_rgba(60,50,30,0.12)]"
            >
              Ontdek dit pad
              <ArrowRight size={13} strokeWidth={1.6} />
            </Link>
            <button
              type="button"
              onClick={() => setShowOthers((v) => !v)}
              className="text-[11px] tracking-[0.22em] uppercase text-ink-soft hover:text-tan transition"
            >
              {showOthers ? "minder tonen" : "andere paden"}
            </button>
          </div>

          <AnimatePresence>
            {showOthers && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="grid sm:grid-cols-2 gap-3 mt-6 pt-6 border-t border-line/50">
                  {others.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/pakket/${p.slug}`}
                      className="block bg-white/60 hover:bg-white border border-line/60 hover:border-tan/60 rounded-md px-4 py-4 transition group"
                    >
                      <p className="text-[10px] tracking-[0.22em] uppercase text-muted mb-1">
                        {p.kicker} · {p.priceLabel}
                      </p>
                      <p className="font-serif text-[15px] text-ink group-hover:text-tan transition leading-snug">
                        {p.name}
                      </p>
                      <p className="text-[12.5px] text-ink-soft leading-[1.7] mt-1.5 line-clamp-2">
                        {p.tagline}
                      </p>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-7 pt-6 border-t border-line/50">
            <p className="text-ink-soft text-[13.5px] leading-[1.75]">
              Liever even praten voor je kiest?{" "}
              <Link
                href="/boek-call"
                className="inline-flex items-center gap-1.5 text-tan hover:text-ink transition font-medium"
              >
                <Calendar size={13} strokeWidth={1.7} />
                Boek een gratis kennismaking
              </Link>
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
