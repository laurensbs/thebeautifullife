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
  BookOpen,
  Package,
  Video,
  ExternalLink,
  Loader2,
  Check,
  StickyNote,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import PageLoader from "@/components/ui/PageLoader";
import AdminNav from "@/components/admin/AdminNav";

type Customer = {
  email: string;
  submissions: Array<{
    id: number;
    first_name: string;
    contact: string;
    phone: string | null;
    package: string | null;
    status: string;
    created_at: string;
    paid_at: string | null;
    amount_cents: number | null;
    scheduled_at: string | null;
    questionnaire_completed: boolean;
  }>;
  answers: Array<{
    submission_id: number;
    question_text: string;
    question_type: string;
    answer_text: string | null;
    answer_scale: number | null;
  }>;
  workbooks: Array<{
    access_id: number;
    submission_id: number;
    slug: string;
    title: string;
    access_token: string;
    created_at: string;
    last_seen_at: string | null;
    total_fields: number;
    filled_fields: number;
  }>;
  bookings: Array<{
    id: number;
    booking_type: string;
    scheduled_at: string | null;
    duration_min: number | null;
    price_cents: number | null;
    status: string;
    paid_at: string | null;
    meeting_url: string | null;
    notes: string | null;
    has_notes: boolean;
    notes_summary: string;
  }>;
  note: { body: string; updated_at: string | null };
};

const fmtDate = (s: string | null) =>
  s
    ? new Date(s).toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

const fmtDateTime = (s: string | null) =>
  s
    ? new Date(s).toLocaleString("nl-NL", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const euros = (cents: number | null) =>
  cents == null ? "—" : `€${(cents / 100).toLocaleString("nl-NL")}`;

export default function KlantDetailPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email: emailParam } = use(params);
  const email = decodeURIComponent(emailParam);
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCustomer = useCallback(async () => {
    const res = await fetch(
      `/api/admin/customers/${encodeURIComponent(email)}`
    );
    if (res.status === 401) {
      router.push("/admin");
      return;
    }
    if (!res.ok) {
      router.push("/admin/klanten");
      return;
    }
    const data = await res.json();
    setCustomer(data);
    setNote(data.note?.body ?? "");
    setLoading(false);
  }, [email, router]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  // Auto-save notitie (debounced)
  const saveNote = useCallback(
    async (val: string) => {
      setSavingNote(true);
      await fetch(`/api/admin/customers/${encodeURIComponent(email)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: val }),
      });
      setSavingNote(false);
      setSavedAt(new Date());
    },
    [email]
  );
  const onNoteChange = (val: string) => {
    setNote(val);
    if (noteTimer.current) clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => saveNote(val), 800);
  };

  const removeCustomer = async () => {
    setDeleting(true);
    await fetch(`/api/admin/customers?email=${encodeURIComponent(email)}`, {
      method: "DELETE",
    });
    router.push("/admin/klanten");
  };

  if (loading || !customer) return <PageLoader label="klant wordt geladen…" />;

  const firstSub = customer.submissions[0];
  const firstName = firstSub?.first_name || "—";
  const phone = firstSub?.phone;
  const hasPackage = customer.submissions.some((s) => s.package);
  const upcomingCalls = customer.bookings.filter(
    (b) =>
      b.scheduled_at &&
      new Date(b.scheduled_at).getTime() > Date.now() &&
      b.status !== "cancelled" &&
      b.status !== "declined"
  );

  const answersBySubmission = customer.answers.reduce(
    (acc, a) => {
      if (!acc[a.submission_id]) acc[a.submission_id] = [];
      acc[a.submission_id].push(a);
      return acc;
    },
    {} as Record<number, typeof customer.answers>
  );

  return (
    <div className="min-h-screen bg-page">
      <AdminNav />

      <main className="max-w-5xl mx-auto px-5 sm:px-6 py-8 sm:py-10">
        <Link
          href="/admin/klanten"
          className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-ink-soft hover:text-tan transition mb-5"
        >
          <ArrowLeft size={12} /> Alle klanten
        </Link>

        {/* Klant-header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-page-soft rounded-[6px] shadow-[0_12px_40px_rgba(60,50,30,0.06)] px-6 py-6 sm:px-8 sm:py-7 mb-6 relative overflow-hidden"
        >
          <span className="absolute top-0 left-0 right-0 h-0.5 bg-tan" />
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="font-script text-tan text-2xl">klant-profiel</p>
              <h1 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.06em] text-ink mt-1">
                {firstName}
              </h1>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 text-[13px] text-ink-soft">
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-1.5 hover:text-tan transition"
                >
                  <Mail size={12} className="text-muted" /> {email}
                </a>
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center gap-1.5 hover:text-tan transition"
                  >
                    <Phone size={12} className="text-muted" /> {phone}
                  </a>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                <Badge tone={hasPackage ? "sage" : "tan"}>
                  {hasPackage ? "klant" : "lead"}
                </Badge>
                <Badge>
                  {customer.submissions.length} aanmelding
                  {customer.submissions.length === 1 ? "" : "en"}
                </Badge>
                {customer.workbooks.length > 0 && (
                  <Badge>{customer.workbooks.length} werkboek{customer.workbooks.length === 1 ? "" : "en"}</Badge>
                )}
                {customer.bookings.length > 0 && (
                  <Badge>
                    {customer.bookings.length} call
                    {customer.bookings.length === 1 ? "" : "s"}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {confirmDel ? (
                <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded px-2 py-1">
                  <AlertTriangle size={12} className="text-red-500" />
                  <button
                    onClick={removeCustomer}
                    disabled={deleting}
                    className="text-[10px] tracking-[0.18em] uppercase text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 px-2 py-1 rounded inline-flex items-center gap-1"
                  >
                    {deleting && <Loader2 size={10} className="animate-spin" />}
                    Bevestig
                  </button>
                  <button
                    onClick={() => setConfirmDel(false)}
                    className="text-[10px] tracking-[0.18em] uppercase text-red-500/70 hover:text-red-700 px-1"
                  >
                    Nee
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDel(true)}
                  className="text-[10px] tracking-[0.18em] uppercase text-muted hover:text-red-500 transition border border-line hover:border-red-300 rounded px-2.5 py-1.5 inline-flex items-center gap-1"
                  title="Klant verwijderen"
                >
                  <Trash2 size={11} /> Verwijder
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-5 sm:gap-6 items-start">
          {/* Linker kolom: alles van de klant */}
          <div className="space-y-5">
            {/* Aankomende calls (sticky-attention) */}
            {upcomingCalls.length > 0 && (
              <Section
                icon={<CalendarClock size={13} className="text-tan" />}
                title="Aankomende calls"
              >
                <div className="space-y-2">
                  {upcomingCalls.map((b) => (
                    <Link
                      key={b.id}
                      href={`/admin/calls/${b.id}`}
                      className="block bg-white/60 hover:bg-white border border-line/60 hover:border-tan/60 rounded-md px-3 py-2.5 transition"
                    >
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-ink text-[13px]">
                            {fmtDateTime(b.scheduled_at)}
                          </p>
                          <p className="text-muted text-[11px] mt-0.5">
                            {b.booking_type}
                            {b.duration_min ? ` · ${b.duration_min} min` : ""}
                          </p>
                        </div>
                        <span className="text-[10px] tracking-[0.18em] uppercase text-tan inline-flex items-center gap-1">
                          Open call <ExternalLink size={10} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </Section>
            )}

            {/* Werkboeken */}
            {customer.workbooks.length > 0 && (
              <Section
                icon={<BookOpen size={13} className="text-tan" />}
                title="Werkboeken"
              >
                <div className="space-y-2">
                  {customer.workbooks.map((wb) => {
                    const pct =
                      wb.total_fields > 0
                        ? Math.round(
                            (wb.filled_fields / wb.total_fields) * 100
                          )
                        : 0;
                    return (
                      <div
                        key={wb.access_id}
                        className="bg-white/60 border border-line/60 rounded-md px-3 py-3"
                      >
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-ink text-[13px]">
                              {wb.title}
                            </p>
                            <p className="text-muted text-[11px] mt-0.5">
                              {wb.filled_fields}/{wb.total_fields} velden ·{" "}
                              {wb.last_seen_at
                                ? `laatst ${fmtDate(wb.last_seen_at)}`
                                : "nog niet geopend"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/werkboeken/${wb.access_id}`}
                              className="text-[10px] tracking-[0.18em] uppercase bg-ink hover:brightness-110 text-white px-2.5 py-1.5 rounded transition"
                              title="Lees alle antwoorden"
                            >
                              Lees
                            </Link>
                            <a
                              href={`/api/workbook/pdf?slug=${encodeURIComponent(wb.slug)}&access_id=${wb.access_id}`}
                              className="text-[10px] tracking-[0.18em] uppercase border border-line hover:border-tan hover:text-tan text-ink-soft px-2.5 py-1.5 rounded transition"
                            >
                              PDF
                            </a>
                          </div>
                        </div>
                        <div className="mt-2 h-1 bg-line/60 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-tan transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Section>
            )}

            {/* Aanmeldingen */}
            <Section
              icon={<Package size={13} className="text-tan" />}
              title={`Aanmeldingen (${customer.submissions.length})`}
            >
              <div className="space-y-2">
                {customer.submissions.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white/60 border border-line/60 rounded-md px-3 py-2.5 text-[12.5px]"
                  >
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-ink">
                          {s.package
                            ? s.package
                            : "gratis reflectievragenlijst"}
                          <span className="text-muted text-[11px] ml-2">
                            · {fmtDate(s.created_at)}
                          </span>
                        </p>
                        <p className="text-muted text-[11px] mt-0.5">
                          status: {s.status}
                          {s.amount_cents != null
                            ? ` · ${euros(s.amount_cents)}`
                            : ""}
                          {s.paid_at ? " · betaald" : ""}
                        </p>
                      </div>
                    </div>
                    {answersBySubmission[s.id]?.length > 0 && (
                      <details className="mt-2">
                        <summary className="text-[10px] tracking-[0.18em] uppercase text-muted hover:text-tan cursor-pointer">
                          Vragenlijst-antwoorden ({answersBySubmission[s.id].length})
                        </summary>
                        <div className="mt-2 space-y-2 pl-2 border-l border-line/60">
                          {answersBySubmission[s.id].map((a, i) => (
                            <div key={i} className="text-[12px]">
                              <p className="text-muted text-[11px]">
                                {a.question_text}
                              </p>
                              <p className="text-ink-soft mt-0.5">
                                {a.question_type === "scale"
                                  ? `${a.answer_scale ?? "—"} / 10`
                                  : a.answer_text ?? "—"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            {/* Calls geschiedenis */}
            {customer.bookings.length > 0 && (
              <Section
                icon={<Video size={13} className="text-tan" />}
                title={`Alle calls (${customer.bookings.length})`}
              >
                <div className="space-y-2">
                  {customer.bookings.map((b) => (
                    <Link
                      key={b.id}
                      href={`/admin/calls/${b.id}`}
                      className="block bg-white/60 hover:bg-white border border-line/60 hover:border-tan/60 rounded-md px-3 py-2.5 transition text-[12.5px]"
                    >
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-ink">
                            {fmtDateTime(b.scheduled_at)}
                          </p>
                          <p className="text-muted text-[11px] mt-0.5">
                            {b.booking_type} · {b.status}
                            {b.has_notes ? " · notities" : ""}
                          </p>
                          {b.has_notes && b.notes_summary && (
                            <p className="text-ink-soft text-[12px] mt-1 italic line-clamp-2">
                              {b.notes_summary}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Section>
            )}
          </div>

          {/* Rechter kolom: notitie */}
          <div className="space-y-5">
            <Section
              icon={<StickyNote size={13} className="text-tan" />}
              title="Notitie over deze klant"
            >
              <textarea
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
                placeholder="Wat wil je over deze klant onthouden? Bv. vorige gesprekken, kernpatronen, persoonlijke details. Auto-saved."
                className="w-full min-h-[260px] bg-white/70 border border-line rounded-md px-3 py-2.5 font-sans text-[13px] text-ink leading-[1.7] focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30 resize-y"
              />
              <p className="text-[10px] tracking-[0.18em] uppercase text-muted mt-2 inline-flex items-center gap-1.5">
                {savingNote ? (
                  <>
                    <Loader2 size={10} className="animate-spin" /> opslaan…
                  </>
                ) : savedAt ? (
                  <>
                    <Check size={10} className="text-sage" /> opgeslagen
                  </>
                ) : customer.note.updated_at ? (
                  <>laatst {fmtDate(customer.note.updated_at)}</>
                ) : (
                  "auto-saved"
                )}
              </p>
            </Section>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-page-soft rounded-[6px] shadow-[0_8px_24px_rgba(60,50,30,0.04)] px-5 py-5 sm:px-6 sm:py-6">
      <h2 className="font-sans text-[10px] text-muted tracking-[0.18em] uppercase mb-3 flex items-center gap-1.5">
        {icon} {title}
      </h2>
      {children}
    </section>
  );
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "sage" | "tan";
}) {
  const cls =
    tone === "sage"
      ? "bg-sage/15 text-sage-deep border-sage/30"
      : tone === "tan"
        ? "bg-tan/10 text-tan border-tan/30"
        : "bg-page border-line text-ink-soft";
  return (
    <span
      className={`text-[10px] tracking-[0.18em] uppercase border px-1.5 py-0.5 rounded ${cls}`}
    >
      {children}
    </span>
  );
}
