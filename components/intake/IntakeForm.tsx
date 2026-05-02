"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { PackageSlug } from "@/lib/packages";

type FieldType = "text" | "email" | "tel" | "textarea" | "scale" | "select" | "date";

export type IntakeField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  rows?: number;
  hint?: string;
};

const ACCENT: Record<"sage" | "tan" | "gold", string> = {
  sage: "bg-sage hover:bg-sage-deep",
  tan: "bg-tan hover:brightness-95",
  gold: "bg-gold hover:brightness-95",
};

export default function IntakeForm({
  pkgSlug,
  accent,
  baseFields,
  packageFields,
  submitLabel,
}: {
  pkgSlug: PackageSlug;
  accent: "sage" | "tan" | "gold";
  baseFields: IntakeField[];
  packageFields: IntakeField[];
  submitLabel: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string | number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allFields = [...baseFields, ...packageFields];

  const setField = (name: string, value: string | number) =>
    setValues((v) => ({ ...v, [name]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    for (const f of allFields) {
      if (f.required && !String(values[f.name] ?? "").trim()) {
        setError(`Vul "${f.label}" in om door te gaan.`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const baseNames = new Set(baseFields.map((f) => f.name));
      const intake_data: Record<string, string | number> = {};
      for (const [k, v] of Object.entries(values)) {
        if (!baseNames.has(k) && v !== "" && v !== undefined) intake_data[k] = v;
      }

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: values.firstName,
          contact: values.contact,
          phone: values.phone || null,
          package: pkgSlug,
          intake_data,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Er ging iets mis.");
      }
      router.push(`/bedankt?pkg=${pkgSlug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {allFields.map((f) => (
        <Field
          key={f.name}
          field={f}
          value={values[f.name] ?? ""}
          onChange={(v) => setField(f.name, v)}
          accent={accent}
        />
      ))}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2"
        >
          {error}
        </motion.p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className={`w-full mt-2 px-6 py-4 rounded-[3px] text-white font-serif text-lg tracking-[0.06em] shadow-[0_6px_18px_rgba(60,50,30,0.12)] hover:shadow-[0_12px_26px_rgba(60,50,30,0.18)] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${ACCENT[accent]}`}
      >
        {submitting && <Loader2 size={18} className="animate-spin" />}
        {submitting ? "Bezig met verzenden…" : submitLabel}
      </button>

      <p className="text-[11px] text-muted text-center mt-3 leading-relaxed">
        Door te versturen ga je akkoord dat Marion contact met je opneemt over
        dit pakket. Je gegevens worden niet gedeeld met derden.
      </p>
    </form>
  );
}

function Field({
  field,
  value,
  onChange,
  accent,
}: {
  field: IntakeField;
  value: string | number;
  onChange: (v: string | number) => void;
  accent: "sage" | "tan" | "gold";
}) {
  const accentBar =
    accent === "sage" ? "bg-sage" : accent === "tan" ? "bg-tan" : "bg-gold";

  const baseInput =
    "w-full bg-white/80 border border-line rounded-md px-4 py-3 font-sans text-sm text-ink placeholder:text-muted/80 transition focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30";

  return (
    <div>
      <label className="block text-[11px] tracking-[0.18em] uppercase text-ink-soft mb-1.5 font-medium">
        {field.label}
        {field.required && <span className="text-tan ml-1">*</span>}
      </label>

      {field.type === "textarea" && (
        <textarea
          rows={field.rows ?? 4}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={baseInput + " resize-y min-h-[90px]"}
        />
      )}

      {field.type === "select" && (
        <select
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className={baseInput}
        >
          <option value="">— kies —</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      )}

      {field.type === "scale" && (
        <div>
          <div className="flex gap-1.5 mt-1">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
              const active = Number(value) === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => onChange(n)}
                  className={`flex-1 h-10 rounded-md border text-sm font-sans transition ${
                    active
                      ? `${accentBar} text-white border-transparent`
                      : "bg-white/60 text-ink-soft border-line hover:border-tan/60"
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-muted mt-1.5 px-0.5">
            <span>helemaal niet</span>
            <span>helemaal wel</span>
          </div>
        </div>
      )}

      {(field.type === "text" ||
        field.type === "email" ||
        field.type === "tel" ||
        field.type === "date") && (
        <input
          type={field.type}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={baseInput}
        />
      )}

      {field.hint && (
        <p className="text-[11px] text-muted mt-1.5 leading-snug">{field.hint}</p>
      )}
    </div>
  );
}
