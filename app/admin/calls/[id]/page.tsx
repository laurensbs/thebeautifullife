"use client";

import { useEffect, useState, useCallback, useRef, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  CalendarClock,
  Video,
  Loader2,
  Check,
  ExternalLink,
  User,
} from "lucide-react";
import PageLoader from "@/components/ui/PageLoader";
import AdminNav from "@/components/admin/AdminNav";
import type { CallTemplate } from "@/lib/call-templates";

type Booking = {
  id: number;
  booking_type: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  scheduled_at: string | null;
  duration_min: number | null;
  price_cents: number | null;
  status: string;
  paid_at: string | null;
  meeting_url: string | null;
  notes: string | null;
  submission_id: number | null;
};

const fmtDateTime = (s: string | null) =>
  s
    ? new Date(s).toLocaleString("nl-NL", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const euros = (cents: number | null) =>
  cents == null ? "—" : `€${(cents / 100).toLocaleString("nl-NL")}`;

export default function CallDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [template, setTemplate] = useState<CallTemplate | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/admin/calls/${id}`);
    if (res.status === 401) {
      router.push("/admin");
      return;
    }
    if (!res.ok) {
      router.push("/admin/calls");
      return;
    }
    const data = await res.json();
    setBooking(data.booking);
    setTemplate(data.template);
    setFields(data.notes?.fields ?? {});
    setSummary(data.notes?.summary ?? "");
    setLoading(false);
  }, [id, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const save = useCallback(
    async (newFields: Record<string, string>, newSummary: string) => {
      setSaving(true);
      await fetch(`/api/admin/calls/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: newFields, summary: newSummary }),
      });
      setSaving(false);
      setSavedAt(new Date());
    },
    [id]
  );

  const queueSave = (newFields: Record<string, string>, newSummary: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(newFields, newSummary), 800);
  };

  const onFieldChange = (key: string, value: string) => {
    const next = { ...fields, [key]: value };
    setFields(next);
    queueSave(next, summary);
  };
  const onSummaryChange = (value: string) => {
    setSummary(value);
    queueSave(fields, value);
  };

  if (loading || !booking || !template) {
    return <PageLoader label="call wordt geladen…" />;
  }

  const isUpcoming =
    booking.scheduled_at &&
    new Date(booking.scheduled_at).getTime() > Date.now();

  return (
    <div className="min-h-screen bg-page">
      <AdminNav />

      <main className="max-w-5xl mx-auto px-5 sm:px-6 py-8 sm:py-10">
        <Link
          href="/admin/calls"
          className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-ink-soft hover:text-tan transition mb-5"
        >
          <ArrowLeft size={12} /> Alle calls
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-page-soft rounded-[6px] shadow-[0_12px_40px_rgba(60,50,30,0.06)] px-6 py-6 sm:px-8 sm:py-7 mb-6 relative overflow-hidden"
        >
          <span className="absolute top-0 left-0 right-0 h-0.5 bg-tan" />
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="font-script text-tan text-2xl">
                {isUpcoming ? "aankomende call" : "call"}
              </p>
              <h1 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.04em] text-ink mt-1">
                {template.title}
              </h1>
              <p className="font-serif italic text-ink-soft text-[14.5px] mt-2">
                {fmtDateTime(booking.scheduled_at)}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-[13px] text-ink-soft">
                <Link
                  href={`/admin/klanten/${encodeURIComponent(booking.contact_email)}`}
                  className="inline-flex items-center gap-1.5 hover:text-tan transition"
                >
                  <User size={12} className="text-muted" />{" "}
                  <span className="font-medium text-ink">
                    {booking.contact_name}
                  </span>
                  <ExternalLink size={10} className="text-muted" />
                </Link>
                <a
                  href={`mailto:${booking.contact_email}`}
                  className="inline-flex items-center gap-1.5 hover:text-tan transition"
                >
                  <Mail size={12} className="text-muted" />{" "}
                  {booking.contact_email}
                </a>
                {booking.contact_phone && (
                  <a
                    href={`tel:${booking.contact_phone}`}
                    className="inline-flex items-center gap-1.5 hover:text-tan transition"
                  >
                    <Phone size={12} className="text-muted" />{" "}
                    {booking.contact_phone}
                  </a>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-[12px] tracking-[0.18em] uppercase text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarClock size={11} className="text-tan" />
                  {booking.duration_min ?? "—"} min
                </span>
                <span>{euros(booking.price_cents)}</span>
                <span className="text-tan normal-case tracking-normal">
                  {booking.status}
                </span>
                {booking.paid_at && (
                  <span className="text-sage normal-case tracking-normal">
                    betaald
                  </span>
                )}
              </div>
            </div>

            {booking.meeting_url && (
              <a
                href={booking.meeting_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-ink hover:brightness-110 text-white px-5 py-2.5 rounded-[3px] font-sans text-xs tracking-[0.22em] uppercase transition shadow-[0_6px_18px_rgba(60,50,30,0.12)]"
              >
                <Video size={13} /> Open call
              </a>
            )}
          </div>
        </motion.div>

        {/* Template info */}
        <p className="text-[12.5px] text-ink-soft italic mb-3 max-w-2xl leading-snug">
          {template.description}
        </p>

        {/* Notitie-velden */}
        <div className="space-y-3 mb-6">
          {template.fields.map((f) => (
            <div
              key={f.key}
              className="bg-page-soft rounded-[6px] shadow-[0_8px_24px_rgba(60,50,30,0.04)] px-5 py-4 sm:px-6 sm:py-5"
            >
              <label className="block font-sans text-[10px] text-muted tracking-[0.18em] uppercase mb-2">
                {f.label}
              </label>
              {f.type === "scale" ? (
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
                    const active = fields[f.key] === String(n);
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => onFieldChange(f.key, String(n))}
                        className={`w-9 h-9 rounded-md font-serif text-[14px] transition ${
                          active
                            ? "bg-tan text-white shadow-[0_4px_12px_rgba(182,144,106,0.30)]"
                            : "bg-white/70 border border-line text-ink-soft hover:border-tan hover:text-tan"
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                  {fields[f.key] && (
                    <button
                      type="button"
                      onClick={() => onFieldChange(f.key, "")}
                      className="ml-2 text-[10px] tracking-[0.18em] uppercase text-muted hover:text-tan"
                    >
                      wis
                    </button>
                  )}
                </div>
              ) : (
                <textarea
                  value={fields[f.key] ?? ""}
                  onChange={(e) => onFieldChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={f.rows ?? 3}
                  className="w-full bg-white/70 border border-line rounded-md px-3 py-2.5 font-sans text-[13.5px] text-ink leading-[1.7] focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30 resize-y"
                />
              )}
            </div>
          ))}
        </div>

        {/* Korte samenvatting */}
        <div className="bg-page-soft rounded-[6px] shadow-[0_8px_24px_rgba(60,50,30,0.04)] px-5 py-4 sm:px-6 sm:py-5 mb-4 border border-tan/30">
          <label className="block font-sans text-[10px] text-tan tracking-[0.18em] uppercase mb-2">
            Korte samenvatting (zichtbaar in klant-overzicht)
          </label>
          <textarea
            value={summary}
            onChange={(e) => onSummaryChange(e.target.value)}
            placeholder="Eén à twee zinnen — verschijnt in klant-detail bij 'alle calls'."
            rows={2}
            className="w-full bg-white/70 border border-line rounded-md px-3 py-2.5 font-sans text-[13.5px] text-ink leading-[1.7] focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30 resize-y"
          />
        </div>

        {/* Save status */}
        <div className="flex items-center justify-between text-[10px] tracking-[0.18em] uppercase text-muted">
          <span>
            {saving ? (
              <span className="inline-flex items-center gap-1.5">
                <Loader2 size={10} className="animate-spin" /> opslaan…
              </span>
            ) : savedAt ? (
              <span className="inline-flex items-center gap-1.5">
                <Check size={10} className="text-sage" /> alles opgeslagen
              </span>
            ) : (
              "auto-saved tijdens typen"
            )}
          </span>
        </div>
      </main>
    </div>
  );
}
