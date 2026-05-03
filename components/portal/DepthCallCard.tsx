import Link from "next/link";
import { CalendarClock, ArrowRight } from "lucide-react";
import MarionAvatar from "@/components/ui/MarionAvatar";

/**
 * Reminder-kaart voor Return to Calm-klanten die hun inbegrepen
 * 30-min call nog niet hebben ingepland (bv. omdat ze 'sla over'
 * deden bij aanmelding).
 */
export default function DepthCallCard({ firstName }: { firstName: string }) {
  return (
    <section className="bg-page-soft border border-tan/30 rounded-[6px] shadow-[0_8px_28px_rgba(60,50,30,0.06)] mb-7 sm:mb-8 px-6 py-6 sm:px-8 sm:py-7 relative overflow-hidden">
      <span className="absolute top-0 left-0 right-0 h-0.5 bg-tan/70" />

      <div className="flex items-start gap-5 flex-wrap sm:flex-nowrap">
        <MarionAvatar size={56} />

        <div className="flex-1 min-w-0">
          <p className="font-script text-tan text-xl sm:text-2xl">
            je call wacht nog op je
          </p>
          <h3 className="font-serif font-medium text-ink text-[18px] sm:text-[20px] tracking-[0.04em] mt-0.5 leading-snug">
            {firstName}, plan je verdiepingscall in
          </h3>

          <p className="text-ink-soft text-[14px] leading-[1.85] mt-3 max-w-prose">
            Bij Return to Calm zit een persoonlijke 30-minuten call met mij
            inbegrepen. Kies een tijd die past — ik kijk uit naar ons gesprek.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] tracking-[0.18em] uppercase text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock size={12} className="text-tan" /> 30 min Teams
            </span>
            <span className="text-tan/40">·</span>
            <span className="text-sage-deep">inbegrepen</span>
          </div>

          <div className="mt-5">
            <Link
              href="/boek-call?type=return_to_calm_30"
              className="inline-flex items-center gap-1.5 bg-tan hover:brightness-95 text-white px-5 py-2.5 rounded-[3px] font-sans text-[11px] tracking-[0.22em] uppercase transition shadow-[0_6px_18px_rgba(60,50,30,0.10)] hover:-translate-y-0.5"
            >
              Plan mijn call <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
