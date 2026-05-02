"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  BookOpen,
  RefreshCw,
  AlertTriangle,
  ChevronDown,
  Check,
  ExternalLink,
} from "lucide-react";
import PageLoader from "@/components/ui/PageLoader";
import HeartDraw from "@/components/ui/HeartDraw";
import BrandLogo from "@/components/ui/BrandLogo";

type Client = {
  access_id: number;
  submission_id: number;
  first_name: string;
  email: string;
  access_token: string;
  created_at: string;
  last_seen_at: string | null;
  filled: number;
  pct: number;
};

type WorkbookGroup = {
  slug: string;
  title: string;
  total_fields: number;
  clients: Client[];
};

const ACCENT: Record<string, { bar: string; text: string; soft: string }> = {
  "return-to-calm": {
    bar: "bg-sage",
    text: "text-sage-deep",
    soft: "bg-sage/10",
  },
  "from-noise-to-structure": {
    bar: "bg-tan",
    text: "text-tan",
    soft: "bg-tan/10",
  },
};

export default function WerkboekenPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<WorkbookGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [resetConfirm, setResetConfirm] = useState<number | null>(null);
  const [resetting, setResetting] = useState(false);

  const fetchData = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    try {
      const res = await fetch("/api/admin/workbooks");
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      setGroups(data.workbooks ?? []);
      // Default open de eerste groep
      if (!openSlug && data.workbooks?.[0]?.slug) {
        setOpenSlug(data.workbooks[0].slug);
      }
    } catch {
      router.push("/admin");
    }
    setLoading(false);
    setRefreshing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const reset = async (accessId: number) => {
    setResetting(true);
    try {
      const res = await fetch(`/api/admin/workbooks/${accessId}/reset`, {
        method: "POST",
      });
      if (res.ok) {
        // Update local state
        setGroups((prev) =>
          prev.map((g) => ({
            ...g,
            clients: g.clients.map((c) =>
              c.access_id === accessId ? { ...c, filled: 0, pct: 0 } : c
            ),
          }))
        );
        setResetConfirm(null);
      }
    } catch {}
    setResetting(false);
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const fmtDate = (s: string | null) =>
    s
      ? new Date(s).toLocaleDateString("nl-NL", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  if (loading) return <PageLoader label="werkboeken worden geladen…" />;

  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-page/90 backdrop-blur-md border-b border-line/40">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" linkTo="/admin/dashboard" />
            <span className="text-[10px] tracking-[0.22em] uppercase text-muted border border-line rounded-full px-2 py-0.5">
              admin
            </span>
          </div>
          <nav className="flex items-center gap-1 sm:gap-3">
            <Link
              href="/admin/dashboard"
              className="text-[11px] tracking-[0.22em] uppercase text-ink-soft hover:text-tan transition-colors px-2 py-1.5"
            >
              Inzendingen
            </Link>
            <Link
              href="/admin/calls"
              className="text-[11px] tracking-[0.22em] uppercase text-ink-soft hover:text-tan transition-colors px-2 py-1.5"
            >
              Calls
            </Link>
            <Link
              href="/admin/werkboeken"
              className="text-[11px] tracking-[0.22em] uppercase text-tan font-medium px-2 py-1.5"
            >
              Werkboeken
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-[11px] tracking-[0.22em] uppercase text-ink-soft hover:text-tan transition-colors px-2 py-1.5 ml-1"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Uit</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 sm:px-6 pt-6 sm:pt-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] px-6 py-7 sm:px-12 sm:py-10 shadow-[0_18px_48px_rgba(60,50,30,0.08)] mb-6 sm:mb-8 relative"
        >
          <button
            onClick={() => fetchData(true)}
            className="absolute top-6 right-6 p-2 rounded-lg text-muted hover:text-tan hover:bg-page-dark/40 transition"
            aria-label="Vernieuw"
          >
            <motion.span
              animate={refreshing ? { rotate: 360 } : {}}
              transition={{
                duration: 1,
                repeat: refreshing ? Infinity : 0,
                ease: "linear",
              }}
              className="block"
            >
              <RefreshCw size={16} />
            </motion.span>
          </button>

          <p className="font-script text-tan text-3xl">de werkboeken,</p>
          <h1 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.06em] uppercase mt-1 text-ink">
            in beheer
          </h1>
          <div className="my-5 flex items-center gap-2.5 text-tan">
            <span className="h-px w-12 bg-tan/55" />
            <HeartDraw size={14} />
            <span className="h-px w-12 bg-tan/55" />
          </div>
          <p className="text-ink-soft text-[15px] leading-[1.85] max-w-md">
            Per werkboek zie je iedereen die toegang heeft, hoe ver ze zijn
            en wanneer ze er voor het laatst waren.
          </p>
        </motion.div>

        {groups.length === 0 ? (
          <div className="bg-page-soft rounded-[6px] px-8 py-12 text-center text-ink-soft">
            <BookOpen className="text-tan/40 mx-auto mb-3" size={32} />
            <p className="text-sm">Nog geen werkboek-toegang uitgedeeld.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {groups.map((group, gi) => {
              const accent = ACCENT[group.slug] ?? ACCENT["return-to-calm"];
              const open = openSlug === group.slug;
              const activeCount = group.clients.length;
              const finishedCount = group.clients.filter(
                (c) => c.pct >= 100
              ).length;

              return (
                <motion.article
                  key={group.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: gi * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="bg-page-soft rounded-[6px] shadow-[0_18px_48px_rgba(60,50,30,0.08)] overflow-hidden"
                >
                  <span className={`block h-1 w-full ${accent.bar}`} />

                  <button
                    onClick={() => setOpenSlug(open ? null : group.slug)}
                    className="w-full px-5 py-5 sm:px-7 sm:py-6 flex items-center gap-4 text-left hover:bg-page-dark/30 transition-colors"
                  >
                    <BookOpen size={18} className={accent.text} />
                    <div className="flex-1 min-w-0">
                      <h2 className="font-serif text-ink text-lg sm:text-xl tracking-[0.06em]">
                        {group.title}
                      </h2>
                      <p className="text-[11px] tracking-[0.18em] uppercase text-muted mt-0.5">
                        {activeCount}{" "}
                        {activeCount === 1 ? "klant" : "klanten"} · {finishedCount} afgerond ·{" "}
                        {group.total_fields} velden
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={18} className="text-muted" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-7 pb-6 border-t border-line/40">
                          {group.clients.length === 0 ? (
                            <p className="text-sm text-muted text-center py-6">
                              Nog niemand met toegang tot dit werkboek.
                            </p>
                          ) : (
                            <ul className="divide-y divide-line/30 mt-2">
                              {group.clients.map((c) => (
                                <li
                                  key={c.access_id}
                                  className="py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-serif text-ink text-[15px]">
                                        {c.first_name}
                                      </span>
                                      <span className="text-muted text-[11px]">
                                        {c.email}
                                      </span>
                                      {c.pct >= 100 && (
                                        <span className="text-[10px] tracking-[0.18em] uppercase bg-sage/10 text-sage-deep px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                          <Check size={10} /> Klaar
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                      <div className="flex-1 h-1.5 bg-line/40 rounded-full overflow-hidden">
                                        <div
                                          className={`h-full ${accent.bar} rounded-full transition-all`}
                                          style={{ width: `${c.pct}%` }}
                                        />
                                      </div>
                                      <span
                                        className={`text-[11px] font-medium ${accent.text} w-24 text-right`}
                                      >
                                        {c.filled}/{group.total_fields} ({c.pct}%)
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-muted mt-1.5">
                                      Laatst actief {fmtDate(c.last_seen_at)}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                                    <Link
                                      href={`/werkboek/${group.slug}?token=${c.access_token}`}
                                      target="_blank"
                                      className="text-[11px] tracking-[0.18em] uppercase border border-line text-ink-soft hover:border-tan hover:text-tan px-3 py-1.5 rounded transition flex items-center gap-1.5"
                                    >
                                      <ExternalLink size={11} /> Open
                                    </Link>
                                    {resetConfirm === c.access_id ? (
                                      <div className="flex items-center gap-1.5 bg-red-50 rounded-md px-2 py-1 border border-red-200">
                                        <AlertTriangle
                                          size={12}
                                          className="text-red-500"
                                        />
                                        <button
                                          onClick={() => reset(c.access_id)}
                                          disabled={resetting}
                                          className="text-[10px] tracking-[0.18em] uppercase text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded transition disabled:opacity-50"
                                        >
                                          {resetting ? "..." : "Bevestig"}
                                        </button>
                                        <button
                                          onClick={() => setResetConfirm(null)}
                                          className="text-[10px] tracking-[0.18em] uppercase text-red-400 hover:text-red-600 px-1"
                                        >
                                          Nee
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          setResetConfirm(c.access_id)
                                        }
                                        className="text-[11px] tracking-[0.18em] uppercase text-muted hover:text-red-500 transition px-2 py-1.5"
                                      >
                                        Reset
                                      </button>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
