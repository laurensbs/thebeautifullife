"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ChevronDown, Loader2 } from "lucide-react";
import HeartDraw from "@/components/ui/HeartDraw";
import HeartDivider from "@/components/ui/HeartDivider";
import PageLoader from "@/components/ui/PageLoader";

export default function CheckMailPage() {
  return (
    <Suspense fallback={<PageLoader label="een moment…" />}>
      <CheckMailContent />
    </Suspense>
  );
}

function CheckMailContent() {
  const params = useSearchParams();
  const email = params.get("email") ?? "";
  const firstName = params.get("name") ?? "";
  const [openHelp, setOpenHelp] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const resend = async () => {
    if (!email) return;
    setResending(true);
    setResendError(null);
    try {
      const res = await fetch("/api/client/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Lukte niet — probeer het zo opnieuw.");
      }
      setResent(true);
    } catch (err) {
      setResendError(err instanceof Error ? err.message : "Er ging iets mis.");
    }
    setResending(false);
  };

  return (
    <main className="max-w-[600px] mx-auto px-5 sm:px-6 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] px-6 py-12 sm:px-12 sm:py-14 shadow-[0_18px_48px_rgba(60,50,30,0.08)] relative overflow-hidden text-center"
      >
        <span className="absolute top-0 left-0 right-0 h-0.5 bg-tan" />

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 rounded-full bg-tan/10 border border-tan/40 flex items-center justify-center">
            <Mail size={26} className="text-tan" strokeWidth={1.4} />
          </div>
        </motion.div>

        <p className="font-script text-tan text-3xl sm:text-4xl">
          {firstName ? `dankjewel, ${firstName}` : "dankjewel"}
        </p>
        <h1 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.06em] uppercase mt-2 text-ink">
          Je mail staat klaar
        </h1>

        <HeartDivider className="my-6" />

        <p className="text-ink-soft text-[15px] leading-[1.85] max-w-md mx-auto">
          Open de e-mail die we je net stuurden{email ? <> naar <span className="text-ink">{email}</span></> : null} en klik op{" "}
          <em className="text-ink">Start mijn vragenlijst</em>. Daarmee log je
          meteen in op je persoonlijke pad — geen wachtwoord nodig.
        </p>

        <div className="mt-8 inline-flex items-center gap-2.5 text-tan">
          <span className="h-px w-10 bg-tan/55" />
          <HeartDraw size={13} />
          <span className="h-px w-10 bg-tan/55" />
        </div>

        <button
          type="button"
          onClick={() => setOpenHelp((v) => !v)}
          className="mt-8 inline-flex items-center gap-1.5 text-[11px] tracking-[0.22em] uppercase text-ink-soft hover:text-tan transition"
        >
          Geen mail gekregen?
          <ChevronDown
            size={14}
            className={`transition-transform ${openHelp ? "rotate-180" : ""}`}
          />
        </button>

        {openHelp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-5 text-left max-w-md mx-auto bg-page/60 border border-line/60 rounded-md px-5 py-5">
              <p className="text-[13px] text-ink-soft leading-[1.8]">
                Soms duurt het een minuut. Kijk ook even in je spam- of
                reclame-map.
              </p>
              {email ? (
                <button
                  type="button"
                  onClick={resend}
                  disabled={resending || resent}
                  className="mt-4 inline-flex items-center gap-2 bg-ink hover:brightness-110 disabled:opacity-50 text-white px-5 py-2.5 rounded-[3px] font-sans text-[11px] tracking-[0.22em] uppercase transition"
                >
                  {resending && <Loader2 size={12} className="animate-spin" />}
                  {resent ? "Mail opnieuw verstuurd" : "Stuur opnieuw"}
                </button>
              ) : (
                <p className="mt-3 text-[12px] text-muted">
                  Je kunt opnieuw inloggen via{" "}
                  <Link href="/mijn-pad/login" className="text-tan underline">
                    mijn-pad/login
                  </Link>
                  .
                </p>
              )}
              {resendError && (
                <p className="mt-3 text-[12px] text-tan">{resendError}</p>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>

      <p className="text-center mt-8 text-[12px] text-muted">
        <Link href="/" className="hover:text-tan transition">
          ← terug naar de site
        </Link>
      </p>
    </main>
  );
}
