"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarClock, ArrowRight, Loader2, Check, Clock } from "lucide-react";
import HeartDivider from "@/components/ui/HeartDivider";
import MarionAvatar from "@/components/ui/MarionAvatar";

type Slot = { date: string; slots: string[] };

export default function PlanCallView() {
  const params = useSearchParams();
  const router = useRouter();
  const submissionId = params.get("id");

  const [days, setDays] = useState<Slot[]>([]);
  const [loadingDays, setLoadingDays] = useState(true);
  const [chosen, setChosen] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDay, setOpenDay] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/bookings/availability?type=return_to_calm_30")
      .then((r) => r.json())
      .then((data) => {
        const ds: Slot[] = data.slots ?? [];
        setDays(ds);
        if (ds[0]) setOpenDay(ds[0].date);
      })
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

  const submit = async () => {
    if (!chosen || !submissionId) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_type: "return_to_calm_30",
          scheduled_at: chosen,
          submission_id: Number(submissionId),
          // contact-fields worden door /api/bookings opgehaald via submission_id
          // als ze niet meegegeven zijn — fallback verzonden voor zekerheid:
          firstName: "",
          contact: "",
          phone: null,
          // Pakket-call is gratis (zit in Return to Calm pakket inbegrepen)
          included_in_package: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Er ging iets mis.");
      router.push(`/bedankt?pkg=ikigai`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-[680px] mx-auto px-5 sm:px-6 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] px-6 py-10 sm:px-12 sm:py-12 shadow-[0_18px_48px_rgba(60,50,30,0.08)] relative overflow-hidden"
      >
        <span className="absolute top-0 left-0 right-0 h-0.5 bg-tan" />

        <div className="text-center">
          <div className="flex justify-center mb-5">
            <MarionAvatar size={56} />
          </div>
          <p className="font-script text-tan text-3xl">je bent ingeschreven</p>
          <h1 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.06em] uppercase mt-2 text-ink">
            Kies je verdiepingscall
          </h1>
          <HeartDivider className="my-6" />
          <p className="text-ink-soft text-[15px] leading-[1.85] max-w-md mx-auto">
            Bij Return to Calm zit een persoonlijke 30-minuten call met Marion
            inbegrepen. Kies een tijd die past — je kunt later altijd verzetten
            via je portaal.
          </p>
          <div className="mt-5 inline-flex items-center gap-x-5 gap-y-1 text-[11px] tracking-[0.18em] uppercase text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={11} className="text-tan" /> 30 minuten
            </span>
            <span className="text-tan/40">·</span>
            <span>Teams-call</span>
            <span className="text-tan/40">·</span>
            <span className="text-sage-deep">inbegrepen</span>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-page-dark/60 border border-tan/30 rounded-md px-4 py-3 text-[13px] text-ink-soft"
          >
            {error}
          </motion.div>
        )}

        <div className="mt-8">
          {loadingDays ? (
            <div className="text-center py-12 text-muted">
              <Loader2
                size={20}
                className="animate-spin mx-auto text-tan mb-3"
              />
              <p className="text-[13px]">Beschikbare tijden ophalen…</p>
            </div>
          ) : days.length === 0 ? (
            <div className="text-center py-10 text-ink-soft">
              <p className="font-serif text-lg">Geen tijden beschikbaar</p>
              <p className="text-[13px] mt-2">
                Marion neemt persoonlijk contact op om een tijd te plannen.
              </p>
              <button
                type="button"
                onClick={() => router.push("/bedankt?pkg=ikigai")}
                className="mt-5 inline-flex items-center gap-1.5 bg-ink hover:brightness-110 text-white px-5 py-2.5 rounded-[3px] font-sans text-[11px] tracking-[0.22em] uppercase transition"
              >
                Verder <ArrowRight size={12} />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {days.map((d) => {
                const isOpen = openDay === d.date;
                return (
                  <div
                    key={d.date}
                    className="bg-white/60 border border-line/60 rounded-md overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenDay(isOpen ? null : d.date)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/80 transition"
                    >
                      <span className="font-serif text-ink text-[15px] capitalize inline-flex items-center gap-2">
                        <CalendarClock size={14} className="text-tan" />
                        {fmtDate(d.slots[0])}
                      </span>
                      <span className="text-[10px] tracking-[0.18em] uppercase text-muted">
                        {d.slots.length} tijden
                      </span>
                    </button>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden border-t border-line/50"
                      >
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 px-4 py-3">
                          {d.slots.map((iso) => {
                            const active = chosen === iso;
                            return (
                              <button
                                key={iso}
                                type="button"
                                onClick={() => setChosen(iso)}
                                className={`px-3 py-2 rounded-[3px] font-sans text-[13px] transition border ${
                                  active
                                    ? "bg-tan text-white border-transparent shadow-[0_4px_12px_rgba(182,144,106,0.30)]"
                                    : "bg-white/60 text-ink-soft border-line hover:border-tan hover:text-tan"
                                }`}
                              >
                                {fmtTime(iso)}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {chosen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-7 flex flex-col sm:flex-row items-center justify-between gap-4 bg-tan/10 border border-tan/40 rounded-md px-4 py-3.5"
          >
            <div className="flex items-center gap-2.5 text-[13.5px] text-ink">
              <Check size={14} className="text-sage-deep flex-none" />
              <span>
                <span className="text-muted text-[12px] tracking-[0.18em] uppercase mr-1.5">
                  Gekozen:
                </span>
                <span className="font-medium capitalize">
                  {fmtDate(chosen)}
                </span>{" "}
                · {fmtTime(chosen)}
              </span>
            </div>
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-ink hover:brightness-110 disabled:opacity-50 text-white px-5 py-2.5 rounded-[3px] font-sans text-[11px] tracking-[0.22em] uppercase transition shadow-[0_6px_18px_rgba(60,50,30,0.12)]"
            >
              {submitting && <Loader2 size={12} className="animate-spin" />}
              Bevestig <ArrowRight size={12} />
            </button>
          </motion.div>
        )}

        <p className="mt-6 text-center text-[11px] text-muted">
          Geen tijd gevonden of liever later kiezen?{" "}
          <button
            type="button"
            onClick={() => router.push("/bedankt?pkg=ikigai")}
            className="underline hover:text-tan"
          >
            Sla over
          </button>{" "}
          — je kunt later vanuit je pad een tijd kiezen.
        </p>
      </motion.div>
    </main>
  );
}
