"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import "@/components/workbook/workbook.css";

export default function LoginForm() {
  const params = useSearchParams();
  const slug = params.get("slug");
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
      const res = await fetch("/api/workbook/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, slug }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Er ging iets mis.");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
    }
    setSubmitting(false);
  };

  const errorMessage =
    errorParam === "expired"
      ? "Deze link is verlopen. Vraag een nieuwe aan."
      : errorParam === "invalid"
        ? "Deze link is niet meer geldig."
        : errorParam === "noaccess"
          ? "Geen werkboek gevonden bij dit e-mailadres."
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
        <p className="wb-kicker">welkom terug</p>
        <h1 className="wb-title wb-title--md" style={{ marginTop: 6 }}>
          Open jouw werkboek
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
              Check je inbox.
            </p>
            <p
              className="wb-lead wb-lead--center"
              style={{ marginTop: 16, fontSize: 14 }}
            >
              Als dit e-mailadres bekend is, hebben we
              <br />
              je een persoonlijke link gestuurd.
              <br />
              <br />
              <em>De link blijft 30 minuten geldig.</em>
            </p>
          </motion.div>
        ) : (
          <form onSubmit={submit} style={{ marginTop: 18 }}>
            {(errorMessage || error) && (
              <p
                style={{
                  color: "#b8585b",
                  background: "#fbeeee",
                  border: "1px solid #f1d9d9",
                  borderRadius: 4,
                  padding: "10px 12px",
                  fontSize: 12,
                  marginBottom: 14,
                }}
              >
                {error ?? errorMessage}
              </p>
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
              Je e-mailadres
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              Stuur mij de link
            </button>

            <p
              className="wb-lead wb-lead--center"
              style={{ marginTop: 18, fontSize: 12, color: "var(--color-muted)" }}
            >
              We sturen je een veilige link.<br />
              Geen wachtwoord, geen gedoe.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
