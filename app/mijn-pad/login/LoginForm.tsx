"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Heart, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { DICT } from "@/lib/i18n/dict";
import { tr, type Locale } from "@/lib/i18n/types";
import Calligraphy from "@/components/ui/Calligraphy";
import HeartDivider from "@/components/ui/HeartDivider";
import HeartDraw from "@/components/ui/HeartDraw";

type Mode = "password" | "magic";

export default function LoginForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const params = useSearchParams();
  const errorParam = params.get("error");
  const isEN = locale === "en";

  // Default = password (sneller voor terugkerende klanten). Wie geen
  // wachtwoord heeft kan toggelen naar magic-link.
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paramErrorDismissed, setParamErrorDismissed] = useState(false);

  const dismissParamError = () => {
    if (!paramErrorDismissed) setParamErrorDismissed(true);
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    dismissParamError();
    setSubmitting(true);
    try {
      const res = await fetch("/api/client/login/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Inloggen mislukt");
      }
      router.push("/mijn-pad");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setSubmitting(false);
    }
  };

  const submitMagic = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    dismissParamError();
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

  const errorMessage = paramErrorDismissed
    ? null
    : errorParam === "expired"
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
        className="bg-page-soft rounded-[6px] px-6 py-12 sm:px-12 sm:py-14 shadow-[0_18px_48px_rgba(60,50,30,0.08)] text-center"
      >
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-full bg-tan/10 border border-tan/40 flex items-center justify-center">
            <Heart size={20} className="text-tan fill-tan" strokeWidth={0} />
          </div>
        </div>

        <Calligraphy
          as="p"
          className="font-script text-tan text-3xl"
          text={tr(DICT.portal.loginKicker, locale)}
          durationPerChar={0.06}
        />
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
          <>
            {/* Mode-toggle */}
            <div className="inline-flex items-center bg-page rounded-full p-1 border border-line/60 mb-5">
              <button
                type="button"
                onClick={() => {
                  setMode("password");
                  setError(null);
                }}
                className={`px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase transition ${
                  mode === "password"
                    ? "bg-ink text-white shadow-[0_2px_8px_rgba(60,50,30,0.18)]"
                    : "text-ink-soft hover:text-tan"
                }`}
              >
                {isEN ? "Password" : "Wachtwoord"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("magic");
                  setError(null);
                }}
                className={`px-4 py-1.5 rounded-full text-[10px] tracking-[0.2em] uppercase transition ${
                  mode === "magic"
                    ? "bg-ink text-white shadow-[0_2px_8px_rgba(60,50,30,0.18)]"
                    : "text-ink-soft hover:text-tan"
                }`}
              >
                {isEN ? "Email link" : "E-mail link"}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {mode === "password" ? (
                <motion.form
                  key="password-form"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={submitPassword}
                  className="space-y-4"
                >
                  {(errorMessage || error) && (
                    <ErrorBox message={error ?? errorMessage ?? ""} />
                  )}

                  <FormField label={tr(DICT.common.yourEmail, locale)}>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        dismissParamError();
                      }}
                      placeholder="naam@voorbeeld.nl"
                      autoComplete="email"
                      className="w-full bg-white/70 border border-line rounded-md px-4 py-3 font-sans text-base sm:text-sm text-ink focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30"
                    />
                  </FormField>

                  <FormField label={isEN ? "Password" : "Wachtwoord"}>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        className="w-full bg-white/70 border border-line rounded-md px-4 py-3 pr-11 font-sans text-base sm:text-sm text-ink focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-tan p-1 transition-colors"
                        aria-label={
                          showPass
                            ? isEN
                              ? "Hide password"
                              : "Verberg wachtwoord"
                            : isEN
                              ? "Show password"
                              : "Toon wachtwoord"
                        }
                      >
                        {showPass ? (
                          <EyeOff size={16} strokeWidth={1.5} />
                        ) : (
                          <Eye size={16} strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                  </FormField>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-2 px-6 py-4 rounded-[3px] bg-ink hover:brightness-110 text-white font-sans text-xs tracking-[0.22em] uppercase transition disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {submitting && <Loader2 size={14} className="animate-spin" />}
                    {isEN ? "Log in" : "Inloggen"}
                  </button>

                  <p className="text-muted text-xs mt-4 leading-relaxed">
                    {isEN
                      ? "No password yet? Switch to email link — you can set a password from your portal afterwards."
                      : "Nog geen wachtwoord? Kies E-mail link — je kunt er daarna eentje instellen vanuit je portaal."}
                  </p>
                </motion.form>
              ) : (
                <motion.form
                  key="magic-form"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={submitMagic}
                  className="space-y-4"
                >
                  {(errorMessage || error) && (
                    <ErrorBox message={error ?? errorMessage ?? ""} />
                  )}

                  <FormField label={tr(DICT.common.yourEmail, locale)}>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        dismissParamError();
                      }}
                      placeholder="naam@voorbeeld.nl"
                      autoComplete="email"
                      className="w-full bg-white/70 border border-line rounded-md px-4 py-3 font-sans text-base sm:text-sm text-ink focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30"
                    />
                  </FormField>

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
                </motion.form>
              )}
            </AnimatePresence>
          </>
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

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="text-left">
      <label className="block text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-1.5 font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-left bg-page-dark/60 border border-tan/30 rounded-md px-4 py-3 flex items-start gap-2.5"
    >
      <span className="text-tan flex-none mt-0.5">
        <HeartDraw size={12} />
      </span>
      <p className="text-[13px] text-ink-soft leading-snug">{message}</p>
    </motion.div>
  );
}
