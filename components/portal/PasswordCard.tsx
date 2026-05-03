"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check, KeyRound, Eye, EyeOff } from "lucide-react";

/**
 * Wachtwoord-kaart voor het portal. Twee modi:
 * - has_password: huidige + nieuwe wachtwoord (wijzigen)
 * - !has_password: alleen nieuw wachtwoord (eerste keer instellen)
 *
 * Klant kan zo overstappen van magic-link naar wachtwoord-login.
 */
export default function PasswordCard() {
  const [hasPassword, setHasPassword] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [showNext, setShowNext] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/client/password/set")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setHasPassword(Boolean(data.has_password));
      })
      .catch(() => setHasPassword(false));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/client/password/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: hasPassword ? current : undefined,
          new_password: next,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Er ging iets mis");
      setSuccess(
        hasPassword
          ? "Wachtwoord gewijzigd."
          : "Wachtwoord ingesteld — vanaf nu kun je inloggen met dit wachtwoord."
      );
      setHasPassword(true);
      setCurrent("");
      setNext("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis");
    }
    setSubmitting(false);
  };

  if (hasPassword === null) {
    return null; // wacht tot we weten of er al een wachtwoord is
  }

  return (
    <section className="bg-page-soft rounded-[6px] shadow-[0_8px_24px_rgba(60,50,30,0.05)] px-5 py-5 sm:px-6 sm:py-6 mb-5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-3 text-left"
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="flex-none w-9 h-9 rounded-full bg-tan/10 text-tan inline-flex items-center justify-center mt-0.5">
            <KeyRound size={15} strokeWidth={1.6} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-serif text-ink text-[15px] tracking-[0.02em]">
              {hasPassword ? "Wachtwoord wijzigen" : "Wachtwoord instellen"}
            </p>
            <p className="text-muted text-[12px] mt-0.5">
              {hasPassword
                ? "Je hebt al een wachtwoord — wijzig 'm hier."
                : "Sneller inloggen zonder elke keer een mail-link aan te vragen."}
            </p>
          </div>
        </div>
        <span
          className={`text-[10px] tracking-[0.22em] uppercase text-ink-soft transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={submit}
            className="overflow-hidden"
          >
            <div className="pt-5 mt-4 border-t border-line/40 space-y-3">
              {success && (
                <div className="flex items-start gap-2 bg-sage/10 border border-sage/30 rounded-md px-3 py-2.5 text-[13px] text-ink">
                  <Check size={14} className="text-sage flex-none mt-0.5" />
                  <span>{success}</span>
                </div>
              )}
              {error && (
                <div className="bg-page-dark/60 border border-tan/30 rounded-md px-3 py-2.5 text-[13px] text-ink-soft">
                  {error}
                </div>
              )}

              {hasPassword && (
                <div>
                  <label className="block text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-1.5 font-medium">
                    Huidig wachtwoord
                  </label>
                  <input
                    type="password"
                    required
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    autoComplete="current-password"
                    className="w-full bg-white/70 border border-line rounded-md px-3 py-2.5 font-sans text-base sm:text-sm text-ink focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-1.5 font-medium">
                  {hasPassword ? "Nieuw wachtwoord" : "Wachtwoord"}{" "}
                  <span className="text-muted normal-case tracking-normal text-[10px] italic">
                    (min. 8 tekens)
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showNext ? "text" : "password"}
                    required
                    minLength={8}
                    value={next}
                    onChange={(e) => setNext(e.target.value)}
                    autoComplete="new-password"
                    className="w-full bg-white/70 border border-line rounded-md px-3 py-2.5 pr-10 font-sans text-base sm:text-sm text-ink focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNext(!showNext)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-tan p-1 transition-colors"
                    aria-label={showNext ? "Verberg" : "Toon"}
                  >
                    {showNext ? (
                      <EyeOff size={15} strokeWidth={1.5} />
                    ) : (
                      <Eye size={15} strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-ink hover:brightness-110 disabled:opacity-50 text-white px-5 py-2.5 rounded-[3px] font-sans text-[11px] tracking-[0.22em] uppercase transition shadow-[0_4px_12px_rgba(60,50,30,0.10)]"
              >
                {submitting && <Loader2 size={12} className="animate-spin" />}
                {hasPassword ? "Wijzig wachtwoord" : "Wachtwoord opslaan"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}
