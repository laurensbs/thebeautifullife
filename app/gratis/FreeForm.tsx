"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import { DICT } from "@/lib/i18n/dict";
import { tr, type Locale } from "@/lib/i18n/types";
import HeartDivider from "@/components/ui/HeartDivider";
import HeartDraw from "@/components/ui/HeartDraw";

export default function FreeForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, contact, phone: phone || null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Er ging iets mis.");
      }
      const url = `/gratis/check-mail?email=${encodeURIComponent(contact)}&name=${encodeURIComponent(firstName)}`;
      router.push(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-[560px] mx-auto px-5 sm:px-6 py-12 sm:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-ink-soft hover:text-tan text-sm mb-5 transition-colors"
      >
        <ArrowLeft size={14} /> {tr(DICT.common.back, locale)}
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] px-6 py-12 sm:px-12 sm:py-14 shadow-[0_18px_48px_rgba(60,50,30,0.08)] text-center relative overflow-hidden"
      >
        <span className="absolute top-0 left-0 right-0 h-0.5 bg-sage" />

        <p className="font-script text-tan text-3xl">
          {tr(DICT.free.eyebrow, locale)}
        </p>
        <h1 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.06em] uppercase mt-2 text-ink">
          {tr(DICT.free.formTitle, locale)}
        </h1>

        <HeartDivider className="my-6" />

        <p className="text-ink-soft text-[14px] leading-[1.8] max-w-md mx-auto">
          {tr(DICT.free.formIntro, locale)}
        </p>

        <form onSubmit={submit} className="space-y-4 mt-6 text-left">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-page-dark/60 border border-tan/30 rounded-md px-4 py-3 flex items-start gap-2.5"
            >
              <span className="text-tan flex-none mt-0.5"><HeartDraw size={12} /></span>
              <p className="text-[13px] text-ink-soft leading-snug">{error}</p>
            </motion.div>
          )}

          <div>
            <label className="block text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-1.5 font-medium">
              {tr(DICT.intake.fields.firstName, locale)}
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={tr(DICT.intake.fields.firstNamePlaceholder, locale)}
              className="w-full bg-white/70 border border-line rounded-md px-4 py-3 font-sans text-base sm:text-sm text-ink focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30"
            />
          </div>

          <div>
            <label className="block text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-1.5 font-medium">
              {tr(DICT.common.yourEmail, locale)}
            </label>
            <input
              type="email"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder={tr(DICT.intake.fields.contactPlaceholder, locale)}
              className="w-full bg-white/70 border border-line rounded-md px-4 py-3 font-sans text-base sm:text-sm text-ink focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30"
            />
          </div>

          <div>
            <label className="block text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-1.5 font-medium">
              {tr(DICT.intake.fields.phone, locale)} ·{" "}
              <span className="text-muted normal-case tracking-normal text-[11px] italic">
                {tr(DICT.common.optional, locale)}
              </span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={tr(DICT.intake.fields.phonePlaceholder, locale)}
              className="w-full bg-white/70 border border-line rounded-md px-4 py-3 font-sans text-base sm:text-sm text-ink focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 px-6 py-4 rounded-[3px] bg-sage hover:bg-sage-deep text-white font-sans text-xs tracking-[0.22em] uppercase transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {tr(DICT.free.submitLabel, locale)}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
