"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CalendarClock,
  Video,
  Loader2,
  Check,
} from "lucide-react";
import { type Locale } from "@/lib/i18n/types";
import { BOOKING_TYPES } from "@/lib/bookings";
import HeartDivider from "@/components/ui/HeartDivider";
import HeartDraw from "@/components/ui/HeartDraw";

type Slot = { date: string; slots: string[] };

type Prefill = { firstName: string; email: string; phone: string | null };

export default function BookingFlow({
  prefill,
}: {
  locale: Locale;
  prefill: Prefill | null;
}) {
  const t = BOOKING_TYPES.one_on_one_60;

  const [step, setStep] = useState<"slot" | "details" | "done">("slot");
  const [days, setDays] = useState<Slot[]>([]);
  const [loadingDays, setLoadingDays] = useState(true);
  const [chosen, setChosen] = useState<string | null>(null);

  const [firstName, setFirstName] = useState(prefill?.firstName ?? "");
  const [email, setEmail] = useState(prefill?.email ?? "");
  const [phone, setPhone] = useState(prefill?.phone ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/bookings/availability")
      .then((r) => r.json())
      .then((data) => setDays(data.slots ?? []))
      .catch(() => setDays([]))
      .finally(() => setLoadingDays(false));
  }, []);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("nl-NL", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("nl-NL", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_type: "one_on_one_60",
          scheduled_at: chosen,
          firstName,
          contact: email,
          phone: phone || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Er ging iets mis.");
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    }
    setSubmitting(false);
  };

  // ─── DONE ─────────────────────────────────────────────
  if (step === "done") {
    return (
      <main className="max-w-[680px] mx-auto px-5 sm:px-6 py-16 sm:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] px-6 py-12 sm:px-14 sm:py-16 shadow-[0_18px_48px_rgba(60,50,30,0.08)] relative overflow-hidden"
        >
          <span className="absolute top-0 left-0 right-0 h-0.5 bg-sage" />

          <div className="flex justify-center mb-5 text-tan">
            <div className="w-14 h-14 rounded-full bg-tan/10 border border-tan/40 flex items-center justify-center">
              <HeartDraw size={22} duration={1.6} delay={0.3} />
            </div>
          </div>

          <p className="font-script text-tan text-3xl sm:text-4xl">tot snel,</p>
          <h1 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.06em] uppercase mt-2 text-ink">
            Je call staat gepland
          </h1>

          <HeartDivider className="my-6" />

          <p className="text-ink-soft text-[15px] leading-[1.85] max-w-md mx-auto">
            <strong className="font-medium text-ink">
              {chosen ? `${fmtDate(chosen)} · ${fmtTime(chosen)}` : ""}
            </strong>
          </p>
          <p className="text-ink-soft text-[14px] leading-[1.85] max-w-md mx-auto mt-3">
            Marion stuurt je binnenkort de Teams-link en de betaal-link
            (€125 via Stripe) per e-mail.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/mijn-pad/login"
              className="inline-block px-7 py-3 rounded-[3px] bg-ink hover:brightness-110 text-white font-sans text-xs tracking-[0.22em] uppercase transition shadow-[0_6px_18px_rgba(60,50,30,0.12)]"
            >
              Naar mijn pad
            </Link>
            <Link
              href="/"
              className="inline-block px-7 py-3 rounded-[3px] border border-ink/30 text-ink hover:border-tan hover:text-tan font-sans text-xs tracking-[0.22em] uppercase transition"
            >
              Terug naar home
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="max-w-[820px] mx-auto px-5 sm:px-6 py-8 sm:py-12">
      <Link
        href="/mijn-pad"
        className="inline-flex items-center gap-1.5 text-ink-soft hover:text-tan text-sm mb-5 transition-colors"
      >
        <ArrowLeft size={14} /> terug
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] shadow-[0_18px_48px_rgba(60,50,30,0.08)] overflow-hidden relative"
      >
        <span className="absolute top-0 left-0 right-0 h-0.5 bg-tan" />

        {/* Header */}
        <div className="px-6 py-9 sm:px-12 sm:py-10 text-center border-b border-line/40">
          <p className="font-script text-tan text-3xl">een moment voor jou,</p>
          <h1 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.06em] uppercase mt-2 text-ink">
            {t.title}
          </h1>

          <HeartDivider className="my-5" />

          <p className="text-ink-soft text-[15px] leading-[1.85] max-w-md mx-auto">
            {t.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] tracking-[0.18em] uppercase text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock size={13} className="text-tan" /> {t.duration_min} minuten
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Video size={13} className="text-tan" /> Teams-call
            </span>
            <span className="font-serif text-tan text-base tracking-normal normal-case">
              {t.price_label}
            </span>
          </div>
        </div>

        {/* Step content */}
        <div className="px-5 py-7 sm:px-10 sm:py-9">
          <AnimatePresence mode="wait">
            {step === "slot" ? (
              <motion.div
                key="slot"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-serif font-medium text-lg tracking-[0.18em] uppercase text-ink text-center mb-6">
                  Kies een moment
                </h2>

                {loadingDays ? (
                  <div className="flex items-center justify-center py-12 text-tan">
                    <Loader2 size={22} className="animate-spin" />
                  </div>
                ) : days.length === 0 ? (
                  <p className="text-ink-soft text-sm text-center py-8">
                    Geen beschikbare momenten. Probeer het later opnieuw.
                  </p>
                ) : (
                  <div className="space-y-5 max-h-[480px] overflow-y-auto pr-1">
                    {days.map((d) => (
                      <div key={d.date}>
                        <p className="font-serif text-ink text-[14px] tracking-[0.06em] capitalize mb-2.5 sticky top-0 bg-page-soft py-1">
                          {fmtDate(d.slots[0])}
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                          {d.slots.map((iso) => (
                            <button
                              key={iso}
                              onClick={() => setChosen(iso)}
                              type="button"
                              className={`px-3 py-2.5 rounded-md text-sm font-sans transition border ${
                                chosen === iso
                                  ? "bg-tan text-white border-transparent"
                                  : "bg-white/60 border-line text-ink-soft hover:border-tan hover:text-tan"
                              }`}
                            >
                              {fmtTime(iso)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-7 flex justify-center">
                  <button
                    type="button"
                    disabled={!chosen}
                    onClick={() => setStep("details")}
                    className="px-7 py-3.5 rounded-[3px] bg-ink hover:brightness-110 text-white font-sans text-xs tracking-[0.22em] uppercase transition disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_6px_18px_rgba(60,50,30,0.12)]"
                  >
                    Verder
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="details"
                onSubmit={submit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="max-w-md mx-auto space-y-4"
              >
                <div className="bg-page-dark/40 rounded-md px-4 py-3 text-center mb-2">
                  <p className="text-[11px] tracking-[0.18em] uppercase text-muted">
                    Gekozen moment
                  </p>
                  <p className="font-serif text-ink text-[15px] mt-1">
                    {chosen ? `${fmtDate(chosen)} · ${fmtTime(chosen)}` : ""}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep("slot")}
                    className="text-[11px] tracking-[0.12em] uppercase text-tan hover:text-ink transition mt-1.5"
                  >
                    wijzigen
                  </button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-page-dark/60 border border-tan/30 rounded-md px-4 py-3 flex items-start gap-2.5"
                  >
                    <span className="text-tan flex-none mt-0.5">
                      <HeartDraw size={12} />
                    </span>
                    <p className="text-[13px] text-ink-soft leading-snug">{error}</p>
                  </motion.div>
                )}

                <div>
                  <label className="block text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-1.5 font-medium">
                    Voornaam
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Hoe mag Marion je noemen?"
                    className="w-full bg-white/70 border border-line rounded-md px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-1.5 font-medium">
                    E-mailadres
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="naam@voorbeeld.nl"
                    className="w-full bg-white/70 border border-line rounded-md px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30"
                  />
                </div>

                <div>
                  <label className="block text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-1.5 font-medium">
                    Telefoon ·{" "}
                    <span className="text-muted normal-case tracking-normal text-[11px] italic">
                      optioneel
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+31 6 …"
                    className="w-full bg-white/70 border border-line rounded-md px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 px-6 py-4 rounded-[3px] bg-tan hover:brightness-95 text-white font-sans text-xs tracking-[0.22em] uppercase transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Reserveer dit moment
                </button>

                <p className="text-[11px] text-muted text-center mt-3 leading-relaxed">
                  Stripe-betaling ({t.price_label}) en Teams-link volgen via mail
                  zodra Stripe live staat. Marion bevestigt je reservering eerst.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
}
