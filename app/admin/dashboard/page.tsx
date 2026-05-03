"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarClock,
  Users,
  Video,
  ListTodo,
  ArrowRight,
  Mail,
  Plus,
  Loader2,
  Check,
  ExternalLink,
} from "lucide-react";
import PageLoader from "@/components/ui/PageLoader";
import AdminNav from "@/components/admin/AdminNav";

type DashboardData = {
  stats: {
    total_customers: number;
    leads: number;
    paying_customers: number;
    revenue_this_month_cents: number;
    questionnaires_completed: number;
  };
  upcoming_calls: Array<{
    id: number;
    booking_type: string;
    contact_name: string;
    contact_email: string;
    scheduled_at: string;
    duration_min: number | null;
    meeting_url: string | null;
    has_notes: boolean;
  }>;
  recent_customers: Array<{
    email: string;
    first_name: string;
    package: string | null;
    created_at: string;
  }>;
  open_todos: Array<{
    id: number;
    title: string;
    due_at: string | null;
  }>;
};

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

const fmtDate = (s: string | null) =>
  s
    ? new Date(s).toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "short",
      })
    : "";

const euros = (cents: number) =>
  `€${(cents / 100).toLocaleString("nl-NL", { maximumFractionDigits: 0 })}`;

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newTodo, setNewTodo] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchDashboard = useCallback(async () => {
    const res = await fetch("/api/admin/dashboard");
    if (res.status === 401) {
      router.push("/admin");
      return;
    }
    if (!res.ok) {
      router.push("/admin");
      return;
    }
    setData(await res.json());
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const quickAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setAdding(true);
    const res = await fetch("/api/admin/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTodo }),
    });
    if (res.ok) {
      setNewTodo("");
      fetchDashboard();
    }
    setAdding(false);
  };

  const completeTodo = async (id: number) => {
    setData((d) =>
      d
        ? { ...d, open_todos: d.open_todos.filter((t) => t.id !== id) }
        : d
    );
    await fetch(`/api/admin/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: true }),
    });
  };

  if (loading || !data) return <PageLoader label="dashboard wordt geladen…" />;

  const monthName = new Date().toLocaleDateString("nl-NL", {
    month: "long",
  });

  return (
    <div className="min-h-screen bg-page">
      <AdminNav />

      <main className="max-w-6xl mx-auto px-5 sm:px-6 py-8 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-7"
        >
          <p className="font-script text-tan text-3xl">welkom terug,</p>
          <h1 className="font-serif font-medium text-3xl sm:text-4xl tracking-[0.06em] uppercase mt-1 text-ink">
            Marion
          </h1>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-7">
          <Stat label="Klanten" value={String(data.stats.total_customers)} />
          <Stat label="Betaalde pakketten" value={String(data.stats.paying_customers)} />
          <Stat label="Vragenlijst af" value={String(data.stats.questionnaires_completed)} />
          <Stat
            label={`Omzet ${monthName}`}
            value={euros(data.stats.revenue_this_month_cents)}
            accent
          />
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5 sm:gap-6">
          {/* Linker kolom — calls + recente klanten */}
          <div className="space-y-5">
            {/* Aankomende calls */}
            <Widget
              icon={<CalendarClock size={14} className="text-tan" />}
              title="Aankomende calls"
              link={{ href: "/admin/calls", label: "Alle calls" }}
            >
              {data.upcoming_calls.length === 0 ? (
                <Empty
                  text="Geen aankomende calls."
                  hint="Klanten kunnen er één boeken via /boek-call."
                />
              ) : (
                <ul className="divide-y divide-line/50">
                  {data.upcoming_calls.map((c) => (
                    <li key={c.id}>
                      <Link
                        href={`/admin/calls/${c.id}`}
                        className="block py-3 hover:bg-white/40 -mx-3 px-3 rounded-md transition"
                      >
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-ink text-[14px]">
                              {fmtDateTime(c.scheduled_at)}
                            </p>
                            <p className="text-ink-soft text-[12.5px] mt-0.5">
                              {c.contact_name}{" "}
                              <span className="text-muted">
                                · {c.booking_type}
                                {c.duration_min ? ` · ${c.duration_min} min` : ""}
                              </span>
                            </p>
                            {c.has_notes && (
                              <span className="inline-block mt-1 text-[10px] tracking-[0.18em] uppercase text-sage-deep bg-sage/15 border border-sage/30 px-1.5 py-0.5 rounded">
                                notities
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {c.meeting_url && (
                              <a
                                href={c.meeting_url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[10px] tracking-[0.18em] uppercase bg-ink hover:brightness-110 text-white px-2.5 py-1.5 rounded transition inline-flex items-center gap-1"
                              >
                                <Video size={10} /> Open
                              </a>
                            )}
                            <ArrowRight size={14} className="text-tan" />
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Widget>

            {/* Recente klanten */}
            <Widget
              icon={<Users size={14} className="text-tan" />}
              title="Recente aanmeldingen"
              link={{ href: "/admin/klanten", label: "Alle klanten" }}
            >
              {data.recent_customers.length === 0 ? (
                <Empty text="Nog geen aanmeldingen." />
              ) : (
                <ul className="divide-y divide-line/50">
                  {data.recent_customers.map((c) => (
                    <li key={c.email}>
                      <Link
                        href={`/admin/klanten/${encodeURIComponent(c.email)}`}
                        className="block py-3 hover:bg-white/40 -mx-3 px-3 rounded-md transition"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-ink text-[14px]">
                              {c.first_name || c.email}
                            </p>
                            <div className="flex items-center gap-3 text-[11.5px] text-muted mt-0.5">
                              <span className="inline-flex items-center gap-1">
                                <Mail size={10} /> {c.email}
                              </span>
                              <span>
                                {c.package ? c.package : "lead"} · {fmtDate(c.created_at)}
                              </span>
                            </div>
                          </div>
                          <ExternalLink size={13} className="text-tan flex-none" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Widget>
          </div>

          {/* Rechter kolom — todo's */}
          <div className="space-y-5">
            <Widget
              icon={<ListTodo size={14} className="text-tan" />}
              title="Mijn to-do's"
              link={{ href: "/admin/notities", label: "Alle notities" }}
            >
              <form onSubmit={quickAddTodo} className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Nieuwe to-do…"
                  className="flex-1 bg-white/70 border border-line rounded-md px-3 py-2 font-sans text-[13px] text-ink focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30"
                />
                <button
                  type="submit"
                  disabled={!newTodo.trim() || adding}
                  className="flex-none bg-ink hover:brightness-110 disabled:opacity-50 text-white p-2 rounded transition"
                  aria-label="Toevoegen"
                >
                  {adding ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Plus size={14} />
                  )}
                </button>
              </form>

              {data.open_todos.length === 0 ? (
                <Empty text="Niets meer te doen." hint="Tijd voor thee." />
              ) : (
                <ul className="space-y-2">
                  {data.open_todos.map((t) => {
                    const overdue =
                      t.due_at && new Date(t.due_at).getTime() < Date.now();
                    return (
                      <li
                        key={t.id}
                        className="flex items-start gap-2.5 bg-white/50 border border-line/60 rounded-md px-3 py-2.5"
                      >
                        <button
                          type="button"
                          onClick={() => completeTodo(t.id)}
                          className="flex-none mt-0.5 w-4 h-4 rounded border border-line hover:border-tan hover:bg-tan/10 transition flex items-center justify-center"
                          aria-label="Markeer als klaar"
                        >
                          <Check size={10} className="text-transparent" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-ink text-[13.5px] leading-snug">
                            {t.title}
                          </p>
                          {t.due_at && (
                            <p
                              className={`text-[11px] mt-0.5 ${
                                overdue ? "text-red-500" : "text-muted"
                              }`}
                            >
                              {fmtDate(t.due_at)}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Widget>
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`bg-page-soft rounded-[6px] px-4 py-4 sm:px-5 sm:py-5 border ${
        accent ? "border-tan/40" : "border-line/40"
      }`}
    >
      <p className="text-[10px] tracking-[0.22em] uppercase text-muted">
        {label}
      </p>
      <p
        className={`font-serif font-medium text-2xl sm:text-3xl mt-1.5 ${
          accent ? "text-tan" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Widget({
  icon,
  title,
  children,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  link?: { href: string; label: string };
}) {
  return (
    <section className="bg-page-soft rounded-[6px] shadow-[0_8px_24px_rgba(60,50,30,0.05)] px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-sans text-[10px] text-muted tracking-[0.18em] uppercase flex items-center gap-1.5">
          {icon} {title}
        </h2>
        {link && (
          <Link
            href={link.href}
            className="text-[10px] tracking-[0.18em] uppercase text-ink-soft hover:text-tan transition inline-flex items-center gap-1"
          >
            {link.label} <ArrowRight size={10} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function Empty({ text, hint }: { text: string; hint?: string }) {
  return (
    <div className="text-center py-6 text-ink-soft">
      <p className="text-[13px]">{text}</p>
      {hint && <p className="text-[11.5px] text-muted mt-1">{hint}</p>}
    </div>
  );
}
