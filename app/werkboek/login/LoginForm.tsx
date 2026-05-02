"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import "@/components/workbook/workbook.css";
import { DICT } from "@/lib/i18n/dict";
import { tr, type Locale } from "@/lib/i18n/types";

export default function LoginForm({ locale }: { locale: Locale }) {
  const params = useSearchParams();
  const slug = params.get("slug");
  const errorParam = params.get("error");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paramErrorDismissed, setParamErrorDismissed] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setParamErrorDismissed(true);
    setSubmitting(true);
    try {
      const res = await fetch("/api/workbook/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, slug }),
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
      ? tr(DICT.workbook.loginErrorExpired, locale)
      : errorParam === "invalid"
        ? tr(DICT.workbook.loginErrorInvalid, locale)
        : errorParam === "noaccess"
          ? tr(DICT.workbook.loginErrorNoAccess, locale)
          : null;

  return (
    <div className="wb">
      <div
        style={{
          maxWidth: 520,
          margin: "60px auto",
          background: "var(--color-card)",
          borderRadius: 4,
          padding: "60px 48px",
          boxShadow: "0 18px 48px rgba(60,50,30,0.08)",
          textAlign: "center",
        }}
      >
        <p className="wb-kicker">{tr(DICT.workbook.loginKicker, locale)}</p>
        <h1 className="wb-title wb-title--md" style={{ marginTop: 6 }}>
          {tr(DICT.workbook.loginTitle, locale)}
        </h1>

        <div className="wb-rule wb-rule--center">
          <span className="l" />
          <span className="h">♡</span>
          <span className="l" />
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="wb-script" style={{ fontSize: 28, marginTop: 18 }}>
              {tr(DICT.workbook.loginInbox, locale)}
            </p>
            <p
              className="wb-lead wb-lead--center"
              style={{ marginTop: 16, fontSize: 14 }}
            >
              {tr(DICT.workbook.loginInboxBody, locale)}
              <br />
              <br />
              <em>{tr(DICT.workbook.loginValid, locale)}</em>
            </p>
          </motion.div>
        ) : (
          <form onSubmit={submit} style={{ marginTop: 18 }}>
            {(errorMessage || error) && (
              <div
                style={{
                  background: "var(--color-page-dark)",
                  border: "1px solid rgba(182,144,106,0.3)",
                  borderRadius: 4,
                  padding: "12px 14px",
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    color: "var(--color-tan)",
                    fontSize: 14,
                    lineHeight: 1,
                    marginTop: 2,
                  }}
                >
                  ♡
                </span>
                <p
                  style={{
                    color: "var(--color-ink-soft)",
                    fontSize: 13,
                    lineHeight: 1.45,
                    margin: 0,
                  }}
                >
                  {error ?? errorMessage}
                </p>
              </div>
            )}

            <label
              style={{
                display: "block",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--color-ink-soft)",
                marginBottom: 6,
                fontWeight: 500,
              }}
            >
              {tr(DICT.common.yourEmail, locale)}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (!paramErrorDismissed) setParamErrorDismissed(true);
              }}
              placeholder="naam@voorbeeld.nl"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.7)",
                border: "1px solid var(--color-line)",
                borderRadius: 3,
                padding: "12px 14px",
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                color: "var(--color-ink)",
                outline: "none",
              }}
            />

            <button
              type="submit"
              disabled={submitting}
              className="wb-btn"
              style={{
                width: "100%",
                marginTop: 18,
                padding: "14px 18px",
                fontSize: 12,
              }}
            >
              {submitting && (
                <Loader2
                  size={13}
                  className="animate-spin"
                  style={{ marginRight: 8, verticalAlign: -2 }}
                />
              )}
              {tr(DICT.workbook.loginCta, locale)}
            </button>

            <p
              className="wb-lead wb-lead--center"
              style={{ marginTop: 18, fontSize: 12, color: "var(--color-muted)" }}
            >
              {tr(DICT.workbook.loginNoPassword, locale)}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
