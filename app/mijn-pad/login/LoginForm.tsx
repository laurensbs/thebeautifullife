"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Heart } from "lucide-react";
import Link from "next/link";
import { DICT } from "@/lib/i18n/dict";
import { tr, type Locale } from "@/lib/i18n/types";
import Calligraphy from "@/components/ui/Calligraphy";
import HeartDivider from "@/components/ui/HeartDivider";

export default function LoginForm({ locale }: { locale: Locale }) {
  const params = useSearchParams();
  const errorParam = params.get("error");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/client/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
    setSubmitting(false);
  };

  const errorMessage =
    errorParam === "expired"
      ? tr(DICT.portal.loginErrorExpired, locale)
      : errorParam === "invalid"
        ? tr(DICT.portal.loginErrorInvalid, locale)
        : null;

  return (
    <main className="max-w-[520px] mx-auto px-5 sm:px-6 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-page-soft rounded-[6px] px-6 py-12 sm:px-12 sm:py-16 shadow-[0_18px_48px_rgba(60,50,30,0.08)] text-center"
      >
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-full bg-tan/10 border border-tan/40 flex items-center justify-center">
            <Heart size={20} className="text-tan fill-tan" strokeWidth={0} />
          </div>
        </div>

        <Calligraphy as="p" className="font-script text-tan text-3xl" text={tr(DICT.portal.loginKicker, locale)} durationPerChar={0.06} />
        <h1 className="font-serif font-medium text-2xl tracking-[0.06em] uppercase mt-1 text-ink">
          {tr(DICT.portal.loginTitle, locale)}
        </h1>

        <HeartDivider className="my-6" />

        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-script text-tan text-2xl">
              {tr(DICT.portal.loginSent, locale)}
            </p>
            <p className="text-ink-soft text-sm mt-3 leading-[1.85]">
              {tr(DICT.portal.loginSentBody, locale)}
            </p>
            <p className="text-muted text-xs mt-4 italic">
              {tr(DICT.portal.loginValid, locale)}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {(errorMessage || error) && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-left">
                {error ?? errorMessage}
              </p>
            )}

            <div className="text-left">
              <label className="block text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-1.5 font-medium">
                {tr(DICT.common.yourEmail, locale)}
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 px-6 py-4 rounded-[3px] bg-ink hover:brightness-110 text-white font-sans text-xs tracking-[0.22em] uppercase transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {tr(DICT.portal.loginCta, locale)}
            </button>

            <p className="text-muted text-xs mt-4 leading-relaxed">
              {tr(DICT.portal.loginNoPassword, locale)}
            </p>
          </form>
        )}

        <div className="mt-9 pt-6 border-t border-line/40">
          <Link
            href="/"
            className="text-muted hover:text-tan text-xs tracking-[0.12em] uppercase transition"
          >
            ← {tr(DICT.common.backToHome, locale)}
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
