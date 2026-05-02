"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Users,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  MailCheck,
  Mail,
  Phone,
  FileText,
  Trash2,
  RefreshCw,
  Search,
  X,
  AlertTriangle,
  Loader2,
  CalendarClock,
  StickyNote,
  Video,
  CreditCard,
  BookOpen,
  Euro,
  CalendarPlus,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  PACKAGES,
  PACKAGE_LIST,
  STATUS_LABELS,
  type PackageSlug,
  type PackageStatus,
} from "@/lib/packages";
import {
  WORKBOOKS,
  workbookFieldKeys,
} from "@/lib/workbooks";
import PageLoader from "@/components/ui/PageLoader";
import HeartDraw from "@/components/ui/HeartDraw";

type Submission = {
  id: number;
  first_name: string;
  contact: string;
  phone: string | null;
  created_at: string;
  email_sent: boolean;
  questionnaire_completed: boolean;
  answer_count: number;
  package: PackageSlug | null;
  status: PackageStatus;
  intake_data: Record<string, string | number> | null;
  notes: string | null;
  scheduled_at: string | null;
  amount_cents: number | null;
  paid_at: string | null;
  zoom_meeting_url: string | null;
  workbook_progress?: Array<{
    slug: string;
    last_seen_at: string | null;
    filled: number;
  }>;
};

type WorkbookSummary = {
  slug: string;
  title: string;
  access_token: string;
  created_at: string;
  last_seen_at: string | null;
  total_fields: number;
  filled_fields: number;
  answers: Array<{ field_key: string; value: string; updated_at: string }>;
};

type DetailData = {
  submission: Submission;
  answers: Array<{
    question_text: string;
    question_type: string;
    answer_text: string | null;
    answer_scale: number | null;
  }>;
  workbooks: WorkbookSummary[];
};

type Stats = {
  total: number;
  lead: number;
  ikigai: number;
  alignment: number;
  experience: number;
  completed: number;
  email_sent: number;
  revenue_cents: number;
  need_scheduling: number;
};

const euros = (cents: number | null | undefined) => {
  if (cents == null) return "—";
  return `€${(cents / 100).toLocaleString("nl-NL", {
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  })}`;
};

const PKG_ACCENT_BG: Record<PackageSlug, string> = {
  ikigai: "bg-sage text-white",
  alignment: "bg-tan text-white",
  experience: "bg-gold text-white",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [testMode, setTestMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pkgFilter, setPkgFilter] = useState<PackageSlug | "all" | "lead">(
    "all"
  );
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [details, setDetails] = useState<Record<number, DetailData>>({});
  const [loadingDetail, setLoadingDetail] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const fetchSubmissions = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      try {
        const qs = new URLSearchParams({ page: String(page) });
        if (pkgFilter !== "all") qs.set("package", pkgFilter);
        const res = await fetch(`/api/admin/submissions?${qs}`);
        if (res.status === 401) {
          router.push("/admin");
          return;
        }
        const data = await res.json();
        setSubmissions(data.submissions);
        setTotalPages(data.totalPages);
        setStats(data.stats);
        setTestMode(Boolean(data.test_mode));
      } catch {
        router.push("/admin");
      }
      setLoading(false);
      setRefreshing(false);
    },
    [page, pkgFilter, router]
  );

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const toggleDetail = async (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    if (!details[id]) {
      setLoadingDetail(id);
      const res = await fetch(`/api/admin/submissions/${id}`);
      if (res.ok) {
        const data = await res.json();
        setDetails((prev) => ({ ...prev, [id]: data }));
      }
      setLoadingDetail(null);
    }
  };

  const patchSubmission = async (id: number, body: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data.submission } : s))
      );
      setDetails((prev) =>
        prev[id]
          ? { ...prev, [id]: { ...prev[id], submission: data.submission } }
          : prev
      );
    }
  };

  const deleteSubmission = async (id: number) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        setExpandedId(null);
        setDeleteConfirm(null);
        fetchSubmissions(true);
      }
    } catch {}
    setDeleting(false);
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  };

  const fmt = (date: string) =>
    new Date(date).toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const fmtShort = (date: string) =>
    new Date(date).toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "short",
    });

  const fmtDateLocal = (date: string | null) => {
    if (!date) return "";
    const d = new Date(date);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const filtered = searchQuery.trim()
    ? submissions.filter(
        (s) =>
          s.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.contact.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : submissions;

  if (loading) {
    return <PageLoader label="dashboard wordt geladen…" />;
  }

  return (
    <div className="min-h-screen bg-page">
      {/* Header — homepage stijl: cream-soft band, brand links, nav rechts */}
      <header className="sticky top-0 z-30 bg-page/90 backdrop-blur-md border-b border-line/40">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex flex-col leading-none group">
            <span className="font-serif text-ink text-[14px] tracking-[0.18em] uppercase group-hover:text-tan transition-colors">
              The Beautiful Life
            </span>
            <span className="font-script text-tan text-[15px] -mt-0.5">
              admin
            </span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-3">
            <Link
              href="/admin/dashboard"
              className="text-[11px] tracking-[0.22em] uppercase text-tan font-medium px-2 py-1.5"
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
              className="text-[11px] tracking-[0.22em] uppercase text-ink-soft hover:text-tan transition-colors px-2 py-1.5"
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
        {/* Welkom-card in homepage portaal-stijl */}
        <div className="bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] px-6 py-7 sm:px-12 sm:py-10 shadow-[0_18px_48px_rgba(60,50,30,0.08)] mb-6 sm:mb-8">
          <p className="font-script text-tan text-3xl">welkom terug,</p>
          <h1 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.06em] uppercase mt-1 text-ink">
            Marion
          </h1>
          <div className="my-5 flex items-center gap-2.5 text-tan">
            <span className="h-px w-12 bg-tan/55" />
            <HeartDraw size={14} />
            <span className="h-px w-12 bg-tan/55" />
          </div>
          <p className="text-ink-soft text-[15px] leading-[1.85] max-w-md">
            Hier vind je alle aanmeldingen, hun pad en hun werkboeken.
          </p>
        </div>

        {/* Test mode banner */}
        {testMode && (
          <div className="mb-6 bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 flex items-center gap-2.5 text-amber-900">
            <AlertTriangle size={15} className="flex-shrink-0" />
            <p className="text-[12px] leading-snug">
              <strong className="font-medium">Test-modus actief.</strong>{" "}
              Aanmeldingen worden automatisch op &ldquo;Betaald&rdquo; gezet.
              Zet <code>PAYMENTS_TEST_MODE=false</code> in env wanneer Mollie
              live staat.
            </p>
          </div>
        )}

        {/* Primary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4 mb-3">
          <StatCard
            icon={<Users size={18} className="text-tan" />}
            value={stats?.total ?? 0}
            label="Aanmeldingen"
          />
          <StatCard
            icon={<Euro size={18} className="text-sage-deep" />}
            value={euros(stats?.revenue_cents ?? 0)}
            label={testMode ? "Omzet (test)" : "Omzet"}
            tint="sage"
          />
          <StatCard
            icon={<CalendarPlus size={18} className="text-tan" />}
            value={stats?.need_scheduling ?? 0}
            label="Te plannen"
            tint="tan"
          />
          <StatCard
            icon={<CheckCircle size={18} className="text-sage-deep" />}
            value={stats?.completed ?? 0}
            label="Vragenlijst af"
            tint="sage"
          />
        </div>

        {/* Per-pakket counts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 text-center">
          <PkgPill
            color="sage"
            label="Gratis lead"
            value={stats?.lead ?? 0}
            onClick={() => {
              setPkgFilter("lead");
              setPage(1);
            }}
          />
          <PkgPill
            color="sage"
            label="Ikigai"
            value={stats?.ikigai ?? 0}
            onClick={() => {
              setPkgFilter("ikigai");
              setPage(1);
            }}
          />
          <PkgPill
            color="tan"
            label="Alignment"
            value={stats?.alignment ?? 0}
            onClick={() => {
              setPkgFilter("alignment");
              setPage(1);
            }}
          />
          <PkgPill
            color="gold"
            label="Experience"
            value={stats?.experience ?? 0}
            onClick={() => {
              setPkgFilter("experience");
              setPage(1);
            }}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 mb-4 overflow-x-auto pb-1">
          <FilterChip
            label="Alle"
            active={pkgFilter === "all"}
            onClick={() => {
              setPkgFilter("all");
              setPage(1);
            }}
          />
          {PACKAGE_LIST.map((pkg) => (
            <FilterChip
              key={pkg.slug}
              label={pkg.name.split(" ").slice(-1)[0] === "Story" ? "Ikigai" : pkg.slug === "alignment" ? "Alignment" : "Experience"}
              active={pkgFilter === pkg.slug}
              accent={pkg.accent}
              onClick={() => {
                setPkgFilter(pkg.slug);
                setPage(1);
              }}
            />
          ))}
          <FilterChip
            label="Gratis lead"
            active={pkgFilter === "lead"}
            accent="sage"
            onClick={() => {
              setPkgFilter("lead");
              setPage(1);
            }}
          />

          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-lg transition-colors ${
                showSearch
                  ? "bg-tan/10 text-tan"
                  : "text-muted hover:text-ink hover:bg-page-dark/50"
              }`}
            >
              <Search size={16} />
            </button>
            <button
              onClick={() => fetchSubmissions(true)}
              className="p-2 rounded-lg text-muted hover:text-ink hover:bg-page-dark/50 transition-colors"
            >
              <motion.div
                animate={refreshing ? { rotate: 360 } : {}}
                transition={{
                  duration: 1,
                  repeat: refreshing ? Infinity : 0,
                  ease: "linear",
                }}
              >
                <RefreshCw size={16} />
              </motion.div>
            </button>
          </div>
        </div>

        {/* Search */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  size={14}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Zoek op naam of e-mail…"
                  className="w-full bg-page-soft border border-line rounded-md pl-9 pr-9 py-2.5 font-sans text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="text-muted/30 mx-auto mb-3" size={36} />
            <p className="font-sans text-muted text-sm">
              {searchQuery
                ? "Geen resultaten gevonden"
                : "Nog geen aanmeldingen"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <button
                  onClick={() => toggleDetail(s.id)}
                  className={`relative w-full text-left rounded-[6px] p-4 md:p-5 transition-all duration-300 flex items-center gap-3.5 overflow-hidden ${
                    expandedId === s.id
                      ? "bg-page-soft shadow-[0_18px_48px_rgba(60,50,30,0.08)] rounded-b-none"
                      : "bg-page-soft hover:shadow-[0_18px_48px_rgba(60,50,30,0.08)] shadow-[0_8px_24px_rgba(60,50,30,0.04)]"
                  }`}
                >
                  {/* Pakket-accent strip aan de linkerkant */}
                  <span
                    className={`absolute left-0 top-0 bottom-0 w-0.5 ${
                      s.package === "ikigai"
                        ? "bg-sage"
                        : s.package === "alignment"
                          ? "bg-tan"
                          : s.package === "experience"
                            ? "bg-gold"
                            : "bg-sage/60"
                    }`}
                  />
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-script text-base leading-none -mt-0.5 ${
                      s.package === "ikigai"
                        ? "bg-sage/15 text-sage-deep"
                        : s.package === "alignment"
                          ? "bg-tan/15 text-tan"
                          : s.package === "experience"
                            ? "bg-gold/15 text-gold"
                            : "bg-page-dark text-tan"
                    }`}
                  >
                    {s.first_name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-serif text-ink text-[14px] md:text-[15px]">
                        {s.first_name}
                      </span>
                      {s.package ? (
                        <span
                          className={`text-[9px] tracking-[0.18em] uppercase px-1.5 py-0.5 rounded ${PKG_ACCENT_BG[s.package]}`}
                        >
                          {PACKAGES[s.package].name.split(" ").slice(-1)[0] === "Story" ? "Ikigai" : s.package === "alignment" ? "Alignment" : "Experience"}
                        </span>
                      ) : (
                        <span className="text-[9px] tracking-[0.18em] uppercase px-1.5 py-0.5 rounded bg-sage/15 text-sage-deep border border-sage/30">
                          Gratis
                        </span>
                      )}
                      <span className="text-[10px] font-sans text-muted">
                        · {STATUS_LABELS[s.status] ?? s.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-sans text-ink-soft/85 text-xs truncate max-w-[140px] md:max-w-none">
                        {s.contact}
                      </span>
                      {s.phone && (
                        <>
                          <span className="font-sans text-muted/50 text-[10px]">
                            ·
                          </span>
                          <span className="font-sans text-ink-soft/85 text-xs flex items-center gap-0.5 flex-shrink-0">
                            <Phone size={10} className="text-muted" />
                            {s.phone}
                          </span>
                        </>
                      )}
                      <span className="font-sans text-muted/50 text-[10px]">·</span>
                      <span className="font-sans text-muted text-[10px] flex-shrink-0">
                        {fmtShort(s.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Right-side meta: revenue + workbook progress */}
                  <div className="hidden md:flex flex-col items-end gap-1 mr-1 flex-shrink-0">
                    {s.amount_cents != null && (
                      <span
                        className={`text-[11px] font-medium ${
                          s.paid_at ? "text-sage-deep" : "text-muted"
                        }`}
                      >
                        {euros(s.amount_cents)}
                      </span>
                    )}
                    {s.workbook_progress && s.workbook_progress.length > 0 && (
                      <RowWorkbookBar progress={s.workbook_progress} />
                    )}
                  </div>

                  <motion.div
                    animate={{ rotate: expandedId === s.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="text-muted" size={16} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedId === s.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-page-soft rounded-b-[6px] px-4 pb-5 md:px-6 shadow-[0_18px_48px_rgba(60,50,30,0.08)] border-t border-line/40">
                        <Detail
                          submission={s}
                          detail={details[s.id]}
                          loading={loadingDetail === s.id}
                          fmt={fmt}
                          fmtDateLocal={fmtDateLocal}
                          onPatch={(body) => patchSubmission(s.id, body)}
                          onDelete={() => setDeleteConfirm(s.id)}
                          deleteConfirm={deleteConfirm === s.id}
                          deleting={deleting}
                          onConfirmDelete={() => deleteSubmission(s.id)}
                          onCancelDelete={() => setDeleteConfirm(null)}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg text-ink-soft hover:bg-page-dark/50 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg font-sans text-xs transition-colors ${
                  page === p
                    ? "bg-tan text-white"
                    : "text-ink-soft hover:bg-page-dark/50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg text-ink-soft hover:bg-page-dark/50 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </main>
    </div>
  );

  // ---- inline subcomponents ----
  function StatCard({
    icon,
    value,
    label,
    tint,
  }: {
    icon: React.ReactNode;
    value: number | string;
    label: string;
    tint?: "sage" | "tan" | "gold";
  }) {
    const accent =
      tint === "sage"
        ? "bg-sage"
        : tint === "tan"
          ? "bg-tan"
          : tint === "gold"
            ? "bg-gold"
            : "bg-line";
    return (
      <div className="relative bg-page-soft rounded-[6px] p-4 md:p-5 text-center shadow-[0_8px_24px_rgba(60,50,30,0.06)] hover:shadow-[0_12px_32px_rgba(60,50,30,0.1)] transition-shadow overflow-hidden">
        {/* Top accent strip — pakket-achtige kleur-band */}
        <span className={`absolute top-0 left-0 right-0 h-0.5 ${accent}`} />
        <div className="flex justify-center mb-2 h-[20px] items-center">
          {icon}
        </div>
        <p className="font-serif text-ink text-xl md:text-2xl font-medium leading-none">
          {value}
        </p>
        <p className="font-sans text-muted text-[10px] md:text-[11px] mt-1.5 tracking-[0.22em] uppercase">
          {label}
        </p>
      </div>
    );
  }
}

function ClientLinkButton({ submissionId }: { submissionId: number }) {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/submissions/${submissionId}/magic-link`,
        { method: "POST" }
      );
      if (res.ok) {
        const data = await res.json();
        setUrl(data.url);
      }
    } catch {}
    setLoading(false);
  };

  const copy = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-4 bg-page-dark/50 border border-line/50 rounded-lg px-3 py-2.5">
      <div className="flex items-center gap-2">
        <LinkIcon size={13} className="text-muted flex-shrink-0" />
        <span className="text-[11px] text-ink-soft">
          <strong className="font-medium">Klant-portaal:</strong>{" "}
          stuur klant rechtstreeks naar &ldquo;Mijn pad&rdquo; (7 dagen geldig).
        </span>
        <button
          onClick={generate}
          disabled={loading}
          className="ml-auto text-[11px] tracking-[0.18em] uppercase bg-ink hover:brightness-110 text-white px-3 py-1.5 rounded transition disabled:opacity-50"
        >
          {loading ? "..." : url ? "Nieuwe link" : "Genereer"}
        </button>
      </div>
      {url && (
        <div className="mt-2 flex items-center gap-2">
          <input
            readOnly
            value={url}
            className="flex-1 bg-white/70 border border-line rounded px-2 py-1.5 text-[11px] text-ink-soft font-mono focus:outline-none"
            onFocus={(e) => e.currentTarget.select()}
          />
          <button
            onClick={copy}
            className="text-[11px] tracking-[0.18em] uppercase border border-tan text-tan hover:bg-tan hover:text-white px-3 py-1.5 rounded transition flex items-center gap-1"
          >
            {copied ? <Check size={11} /> : null}
            {copied ? "Gekopieerd" : "Kopieer"}
          </button>
        </div>
      )}
    </div>
  );
}

function RowWorkbookBar({
  progress,
}: {
  progress: NonNullable<Submission["workbook_progress"]>;
}) {
  // Pak de eerste werkboek (meestal maar 1)
  const p = progress[0];
  const wb = WORKBOOKS[p.slug];
  if (!wb) return null;
  const total = workbookFieldKeys(wb).length;
  const pct = total > 0 ? Math.round((Number(p.filled) / total) * 100) : 0;
  return (
    <div className="flex items-center gap-1.5">
      <BookOpen size={9} className="text-muted" />
      <div className="w-16 h-1 bg-line/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-tan rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] text-muted">{pct}%</span>
    </div>
  );
}

function PkgPill({
  color,
  label,
  value,
  onClick,
}: {
  color: "sage" | "tan" | "gold";
  label: string;
  value: number;
  onClick: () => void;
}) {
  const accent =
    color === "sage" ? "bg-sage" : color === "tan" ? "bg-tan" : "bg-gold";
  const text =
    color === "sage"
      ? "text-sage-deep"
      : color === "tan"
        ? "text-tan"
        : "text-gold";
  return (
    <button
      onClick={onClick}
      className="group relative bg-page-soft rounded-[6px] px-4 py-3 hover:-translate-y-0.5 transition-all flex items-center justify-between shadow-[0_8px_24px_rgba(60,50,30,0.06)] hover:shadow-[0_12px_32px_rgba(60,50,30,0.1)] overflow-hidden"
    >
      <span className={`absolute top-0 left-0 right-0 h-0.5 ${accent}`} />
      <span className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${accent}`} />
        <span className="text-[11px] tracking-[0.18em] uppercase text-ink-soft group-hover:text-ink transition-colors">
          {label}
        </span>
      </span>
      <span className={`font-serif text-xl ${text}`}>{value}</span>
    </button>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  accent,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  accent?: "sage" | "tan" | "gold";
}) {
  const activeBg =
    accent === "sage"
      ? "bg-sage text-white border-sage"
      : accent === "tan"
        ? "bg-tan text-white border-tan"
        : accent === "gold"
          ? "bg-gold text-white border-gold"
          : "bg-ink text-white border-ink";
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] tracking-[0.12em] uppercase border transition ${
        active
          ? activeBg
          : "bg-page-soft text-ink-soft border-line/60 hover:border-tan/50"
      }`}
    >
      {label}
    </button>
  );
}

function Detail({
  submission: s,
  detail,
  loading,
  fmt,
  fmtDateLocal,
  onPatch,
  onDelete,
  deleteConfirm,
  deleting,
  onConfirmDelete,
  onCancelDelete,
}: {
  submission: Submission;
  detail: DetailData | undefined;
  loading: boolean;
  fmt: (s: string) => string;
  fmtDateLocal: (s: string | null) => string;
  onPatch: (body: Record<string, unknown>) => void;
  onDelete: () => void;
  deleteConfirm: boolean;
  deleting: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) {
  const pkg = s.package ? PACKAGES[s.package] : null;
  const flow = pkg ? pkg.statusFlow : (["aangemeld"] as PackageStatus[]);
  const allStatuses: PackageStatus[] = [...flow, "geannuleerd"];

  // Local controlled state for notes/scheduled to avoid re-render thrash
  const [notes, setNotes] = useState(s.notes ?? "");
  const [scheduled, setScheduled] = useState(fmtDateLocal(s.scheduled_at));
  const [zoom, setZoom] = useState(s.zoom_meeting_url ?? "");
  useEffect(() => setNotes(s.notes ?? ""), [s.notes]);
  useEffect(() => setScheduled(fmtDateLocal(s.scheduled_at)), [s.scheduled_at, fmtDateLocal]);
  useEffect(() => setZoom(s.zoom_meeting_url ?? ""), [s.zoom_meeting_url]);

  return (
    <div className="pt-4">
      {/* Status row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <label className="text-[10px] tracking-[0.18em] uppercase text-muted">
          Status
        </label>
        <select
          value={s.status}
          onChange={(e) => onPatch({ status: e.target.value })}
          className="bg-white/70 border border-line rounded-md px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30"
        >
          {allStatuses.map((st) => (
            <option key={st} value={st}>
              {STATUS_LABELS[st]}
            </option>
          ))}
        </select>

        <span className="ml-auto text-[10px] text-muted">{fmt(s.created_at)}</span>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {pkg && (
          <Badge tint={pkg.accent === "sage" ? "sage" : pkg.accent === "tan" ? "tan" : "gold"}>
            {pkg.name} — {pkg.priceLabel}
          </Badge>
        )}
        <span
          className={`flex items-center gap-1 text-[11px] font-sans px-2.5 py-1 rounded-full ${
            s.email_sent
              ? "bg-sage/10 text-sage-deep"
              : "bg-tan/10 text-tan"
          }`}
        >
          {s.email_sent ? <MailCheck size={11} /> : <Mail size={11} />}
          {s.email_sent ? "E-mail verzonden" : "E-mail pending"}
        </span>
        <span
          className={`flex items-center gap-1 text-[11px] font-sans px-2.5 py-1 rounded-full ${
            s.questionnaire_completed
              ? "bg-sage/10 text-sage-deep"
              : "bg-page-dark text-ink-soft"
          }`}
        >
          {s.questionnaire_completed ? (
            <CheckCircle size={11} />
          ) : (
            <Clock size={11} />
          )}
          {s.questionnaire_completed ? "Vragenlijst ingevuld" : "Niet ingevuld"}
        </span>
        {s.paid_at && (
          <span className="flex items-center gap-1 text-[11px] font-sans px-2.5 py-1 rounded-full bg-sage/10 text-sage-deep">
            <CreditCard size={11} />
            Betaald {fmt(s.paid_at)}
          </span>
        )}
      </div>

      {/* Intake data */}
      {s.intake_data && Object.keys(s.intake_data).length > 0 && (
        <div className="mb-4">
          <p className="font-sans text-[10px] text-muted tracking-[0.18em] uppercase mb-2">
            Intake
          </p>
          <div className="space-y-2">
            {Object.entries(s.intake_data).map(([k, v]) => (
              <div key={k} className="bg-page rounded-lg p-3">
                <p className="font-sans text-ink-soft/70 text-[11px] mb-0.5 leading-snug">
                  {humanize(k)}
                </p>
                <p className="font-sans text-ink text-[13px] leading-relaxed whitespace-pre-wrap">
                  {String(v)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vragenlijst antwoorden */}
      {loading ? (
        <div className="py-6 flex justify-center">
          <Loader2 size={20} className="text-tan animate-spin" />
        </div>
      ) : detail?.answers.length ? (
        <div className="mb-4">
          <p className="font-sans text-[10px] text-muted tracking-[0.18em] uppercase mb-2">
            Vragenlijst antwoorden ({detail.answers.length})
          </p>
          <div className="space-y-2">
            {detail.answers.map((a, ai) => (
              <div key={ai} className="bg-page rounded-lg p-3">
                <p className="font-sans text-ink-soft/70 text-xs mb-1.5 leading-snug">
                  {a.question_text}
                </p>
                {a.question_type === "scale" ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-line/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-tan rounded-full"
                        style={{ width: `${(a.answer_scale || 0) * 10}%` }}
                      />
                    </div>
                    <span className="font-sans text-tan text-xs font-medium w-8 text-right">
                      {a.answer_scale}/10
                    </span>
                  </div>
                ) : (
                  <p className="font-sans text-ink text-[13px] leading-relaxed">
                    {a.answer_text || (
                      <span className="text-muted/60 italic">Geen antwoord</span>
                    )}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        s.questionnaire_completed === false && (
          <div className="text-center py-3 mb-3">
            <FileText className="text-muted/30 mx-auto mb-1.5" size={20} />
            <p className="font-sans text-muted text-xs">Nog geen vragenlijst-antwoorden</p>
          </div>
        )
      )}

      {/* Workbook progress */}
      {detail?.workbooks && detail.workbooks.length > 0 && (
        <div className="mb-4">
          <p className="font-sans text-[10px] text-muted tracking-[0.18em] uppercase mb-2 flex items-center gap-1.5">
            <BookOpen size={11} /> Werkboek
          </p>
          <div className="space-y-2">
            {detail.workbooks.map((wb) => (
              <WorkbookBlock key={wb.slug} wb={wb} />
            ))}
          </div>
        </div>
      )}

      {/* Planning + Zoom */}
      {(s.package === "alignment" || s.package === "experience") && (
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="font-sans text-[10px] text-muted tracking-[0.18em] uppercase mb-1.5 flex items-center gap-1.5">
              <CalendarClock size={11} /> Geplande call/start
            </label>
            <div className="flex gap-1.5">
              <input
                type="datetime-local"
                value={scheduled}
                onChange={(e) => setScheduled(e.target.value)}
                className="flex-1 bg-white/70 border border-line rounded-md px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30"
              />
              <button
                onClick={() =>
                  onPatch({
                    scheduled_at: scheduled
                      ? new Date(scheduled).toISOString()
                      : null,
                  })
                }
                className="px-3 py-1.5 rounded-md bg-tan text-white text-[11px] hover:brightness-95"
              >
                Opslaan
              </button>
            </div>
          </div>
          <div>
            <label className="font-sans text-[10px] text-muted tracking-[0.18em] uppercase mb-1.5 flex items-center gap-1.5">
              <Video size={11} /> Zoom-link
              <span className="text-muted/60 normal-case tracking-normal">
                (later auto via Zoom API)
              </span>
            </label>
            <div className="flex gap-1.5">
              <input
                type="url"
                value={zoom}
                onChange={(e) => setZoom(e.target.value)}
                placeholder="https://zoom.us/j/…"
                className="flex-1 bg-white/70 border border-line rounded-md px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30"
              />
              <button
                onClick={() => onPatch({ zoom_meeting_url: zoom || null })}
                className="px-3 py-1.5 rounded-md bg-tan text-white text-[11px] hover:brightness-95"
              >
                Opslaan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="mb-4">
        <label className="font-sans text-[10px] text-muted tracking-[0.18em] uppercase mb-1.5 flex items-center gap-1.5">
          <StickyNote size={11} /> Interne notities
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => {
            if ((s.notes ?? "") !== notes) onPatch({ notes });
          }}
          placeholder="Alleen voor jou zichtbaar."
          className="w-full bg-white/70 border border-line rounded-md px-3 py-2 text-sm text-ink focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30 resize-y"
        />
      </div>

      {/* Klant-portaal magic-link */}
      <ClientLinkButton submissionId={s.id} />

      {/* Mollie placeholder */}
      <div className="mb-4 bg-page-dark/50 border border-line/50 rounded-lg px-3 py-2.5 text-[11px] text-ink-soft flex items-center gap-2">
        <CreditCard size={13} className="text-muted" />
        <span>
          <strong className="font-medium">Betaling:</strong>{" "}
          {s.paid_at ? (
            `Voldaan op ${fmt(s.paid_at)}`
          ) : (
            <span className="text-muted">
              Mollie-integratie volgt — markeer handmatig via status &ldquo;Betaald&rdquo;.
            </span>
          )}
        </span>
      </div>

      {/* Delete */}
      <div className="pt-3 border-t border-line/40">
        {deleteConfirm ? (
          <div className="flex items-center gap-2 bg-red-50 rounded-lg p-3">
            <AlertTriangle className="text-red-500 flex-shrink-0" size={16} />
            <p className="font-sans text-red-700 text-xs flex-1">
              Weet je het zeker?
            </p>
            <button
              onClick={onConfirmDelete}
              disabled={deleting}
              className="font-sans text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {deleting ? "..." : "Verwijder"}
            </button>
            <button
              onClick={onCancelDelete}
              className="font-sans text-xs text-red-400 hover:text-red-600 px-2 py-1.5"
            >
              Annuleer
            </button>
          </div>
        ) : (
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 font-sans text-xs text-muted hover:text-red-500 transition-colors p-1"
          >
            <Trash2 size={13} />
            Aanmelding verwijderen
          </button>
        )}
      </div>
    </div>
  );
}

function Badge({
  children,
  tint,
}: {
  children: React.ReactNode;
  tint: "sage" | "tan" | "gold";
}) {
  const cls =
    tint === "sage"
      ? "bg-sage/10 text-sage-deep border-sage/30"
      : tint === "tan"
        ? "bg-tan/10 text-tan border-tan/30"
        : "bg-gold/10 text-gold border-gold/30";
  return (
    <span
      className={`flex items-center gap-1 text-[11px] font-sans px-2.5 py-1 rounded-full border ${cls}`}
    >
      {children}
    </span>
  );
}

function WorkbookBlock({ wb }: { wb: WorkbookSummary }) {
  const [open, setOpen] = useState(false);
  const pct =
    wb.total_fields > 0
      ? Math.round((wb.filled_fields / wb.total_fields) * 100)
      : 0;
  const fmt = (date: string | null) =>
    date
      ? new Date(date).toLocaleDateString("nl-NL", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  return (
    <div className="bg-page rounded-lg p-3">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-serif text-ink text-[14px]">{wb.title}</span>
            <span className="text-[10px] text-muted">
              · laatst actief {fmt(wb.last_seen_at)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-line/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-tan rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[11px] text-tan font-medium w-16 text-right">
              {wb.filled_fields}/{wb.total_fields} ({pct}%)
            </span>
          </div>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-[11px] text-ink-soft hover:text-tan border border-line rounded-md px-2 py-1"
          disabled={wb.answers.length === 0}
        >
          {open ? "Verberg" : "Bekijk"}
        </button>
      </div>

      <AnimatePresence>
        {open && wb.answers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-line/40 space-y-2">
              {wb.answers
                .filter((a) => a.value.trim().length > 0)
                .map((a) => (
                  <div key={a.field_key}>
                    <p className="text-[10px] tracking-[0.18em] uppercase text-muted mb-1">
                      {humanize(a.field_key)}
                    </p>
                    <p className="font-sans text-ink text-[13px] leading-relaxed whitespace-pre-wrap bg-page-soft rounded p-2">
                      {a.value}
                    </p>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function humanize(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
