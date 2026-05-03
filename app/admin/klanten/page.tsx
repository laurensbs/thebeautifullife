"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Mail,
  Phone,
  RefreshCw,
  Trash2,
  AlertTriangle,
  ExternalLink,
  CalendarClock,
  BookOpen,
  Package,
  Loader2,
} from "lucide-react";
import PageLoader from "@/components/ui/PageLoader";
import AdminNav from "@/components/admin/AdminNav";

type Customer = {
  email: string;
  first_name: string;
  phone: string | null;
  submission_count: number;
  package_count: number;
  workbook_count: number;
  booking_count: number;
  last_submission_at: string | null;
  last_booking_at: string | null;
};

export default function KlantenPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [confirmEmail, setConfirmEmail] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const fetchData = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/customers");
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      setCustomers(data.customers ?? []);
    } catch {
      router.push("/admin");
    }
    setLoading(false);
    setRefreshing(false);
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const remove = async (email: string) => {
    setDeleting(email);
    try {
      const res = await fetch(
        `/api/admin/customers?email=${encodeURIComponent(email)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setCustomers((prev) => prev.filter((c) => c.email !== email));
        setConfirmEmail(null);
      }
    } catch {}
    setDeleting(null);
  };

  const fmtDate = (s: string | null) =>
    s
      ? new Date(s).toLocaleDateString("nl-NL", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  const filtered = filter
    ? customers.filter((c) => {
        const f = filter.toLowerCase();
        return (
          c.email.includes(f) ||
          c.first_name.toLowerCase().includes(f) ||
          (c.phone ?? "").toLowerCase().includes(f)
        );
      })
    : customers;

  if (loading) return <PageLoader label="klanten worden geladen…" />;

  return (
    <div className="min-h-screen bg-page">
      <AdminNav />

      <main className="max-w-5xl mx-auto px-5 sm:px-6 py-8 sm:py-10">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <p className="font-script text-tan text-3xl">overzicht</p>
            <h1 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.06em] uppercase mt-1 text-ink inline-flex items-center gap-2.5">
              <Users size={22} className="text-tan" strokeWidth={1.5} />
              Klanten ({customers.length})
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Zoek op naam of email…"
              className="bg-white/70 border border-line rounded-md px-3 py-2 font-sans text-[13px] text-ink focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30 w-56"
            />
            <button
              onClick={() => fetchData(true)}
              disabled={refreshing}
              className="text-[11px] tracking-[0.18em] uppercase text-ink-soft hover:text-tan transition border border-line rounded-md px-3 py-2 inline-flex items-center gap-1.5 disabled:opacity-50"
              title="Vernieuw"
            >
              <RefreshCw
                size={12}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-page-soft rounded-[6px] px-8 py-14 text-center text-ink-soft">
            <Users className="text-tan mx-auto mb-3" size={26} strokeWidth={1.4} />
            <p className="font-serif text-lg">
              {filter ? "Niemand gevonden" : "Nog geen klanten"}
            </p>
            <p className="text-[13px] mt-2 text-muted">
              {filter
                ? "Pas je zoekopdracht aan."
                : "Nieuwe aanmeldingen verschijnen hier vanzelf."}
            </p>
          </div>
        ) : (
          <div className="bg-page-soft rounded-[6px] shadow-[0_12px_40px_rgba(60,50,30,0.06)] overflow-hidden">
            <ul className="divide-y divide-line/50">
              {filtered.map((c, i) => (
                <motion.li
                  key={c.email}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.02 }}
                  className="px-5 sm:px-7 py-4 sm:py-5 hover:bg-white/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-serif text-ink text-[17px] tracking-[0.04em]">
                          {c.first_name || "—"}
                        </h3>
                        {c.package_count > 0 && (
                          <span className="text-[10px] tracking-[0.18em] uppercase bg-sage/15 text-sage-deep border border-sage/30 px-1.5 py-0.5 rounded">
                            klant
                          </span>
                        )}
                        {c.package_count === 0 && c.submission_count > 0 && (
                          <span className="text-[10px] tracking-[0.18em] uppercase bg-tan/10 text-tan border border-tan/30 px-1.5 py-0.5 rounded">
                            lead
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[12.5px] text-ink-soft">
                        <a
                          href={`mailto:${c.email}`}
                          className="inline-flex items-center gap-1.5 hover:text-tan transition"
                        >
                          <Mail size={11} className="text-muted" /> {c.email}
                        </a>
                        {c.phone && (
                          <a
                            href={`tel:${c.phone}`}
                            className="inline-flex items-center gap-1.5 hover:text-tan transition"
                          >
                            <Phone size={11} className="text-muted" /> {c.phone}
                          </a>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11.5px] text-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <Package size={11} /> {c.submission_count}{" "}
                          aanmelding{c.submission_count === 1 ? "" : "en"}
                        </span>
                        {c.workbook_count > 0 && (
                          <span className="inline-flex items-center gap-1.5">
                            <BookOpen size={11} /> {c.workbook_count} werkboek
                            {c.workbook_count === 1 ? "" : "en"}
                          </span>
                        )}
                        {c.booking_count > 0 && (
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarClock size={11} /> {c.booking_count} call
                            {c.booking_count === 1 ? "" : "s"}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5">
                          laatst: {fmtDate(c.last_submission_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-none">
                      <Link
                        href={`/admin/klanten/${encodeURIComponent(c.email)}`}
                        className="text-[10px] tracking-[0.18em] uppercase border border-line hover:border-tan hover:text-tan text-ink-soft px-3 py-1.5 rounded transition inline-flex items-center gap-1"
                        title="Bekijk klant"
                      >
                        <ExternalLink size={11} /> Bekijk
                      </Link>

                      <AnimatePresence mode="wait">
                        {confirmEmail === c.email ? (
                          <motion.div
                            key="confirm"
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            transition={{ duration: 0.25 }}
                            className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded px-2 py-1"
                          >
                            <AlertTriangle
                              size={12}
                              className="text-red-500 flex-none"
                            />
                            <button
                              onClick={() => remove(c.email)}
                              disabled={deleting === c.email}
                              className="text-[10px] tracking-[0.18em] uppercase text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 px-2 py-1 rounded transition inline-flex items-center gap-1"
                            >
                              {deleting === c.email && (
                                <Loader2 size={10} className="animate-spin" />
                              )}
                              {deleting === c.email ? "Bezig…" : "Bevestig"}
                            </button>
                            <button
                              onClick={() => setConfirmEmail(null)}
                              className="text-[10px] tracking-[0.18em] uppercase text-red-500/70 hover:text-red-700 px-1"
                            >
                              Nee
                            </button>
                          </motion.div>
                        ) : (
                          <motion.button
                            key="delete"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmEmail(c.email)}
                            className="text-[10px] tracking-[0.18em] uppercase text-muted hover:text-red-500 transition border border-line hover:border-red-300 rounded px-2.5 py-1.5 inline-flex items-center gap-1"
                            title="Klant verwijderen"
                          >
                            <Trash2 size={11} />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        <p className="mt-6 text-[11px] text-muted leading-relaxed">
          Verwijderen is onomkeerbaar — alle aanmeldingen, werkboeken,
          antwoorden, calls en sessies van deze klant worden permanent gewist.
        </p>
      </main>
    </div>
  );
}
