"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Leaf,
  LogOut,
  Users,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Mail,
  MailCheck,
  CheckCircle,
  Clock,
  FileText,
  ChevronLeft,
  Trash2,
  RefreshCw,
  Search,
  X,
  AlertTriangle,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Submission = {
  id: number;
  first_name: string;
  contact: string;
  phone: string | null;
  created_at: string;
  email_sent: boolean;
  questionnaire_completed: boolean;
  answer_count: number;
};

type DetailData = {
  submission: Submission;
  answers: Array<{
    question_text: string;
    question_type: string;
    answer_text: string | null;
    answer_scale: number | null;
  }>;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [details, setDetails] = useState<Record<number, DetailData>>({});
  const [loadingDetail, setLoadingDetail] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const fetchSubmissions = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch(`/api/admin/submissions?page=${page}`);
      if (res.status === 401) {
        router.push("/admin");
        return;
      }
      const data = await res.json();
      setSubmissions(data.submissions);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch {
      router.push("/admin");
    }
    setLoading(false);
    setRefreshing(false);
  }, [page, router]);

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

  const deleteSubmission = async (id: number) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        setTotal((prev) => prev - 1);
        setExpandedId(null);
        setDeleteConfirm(null);
        setDetails((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }
    } catch {
      // silently fail
    }
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

  const filtered = searchQuery.trim()
    ? submissions.filter(
        (s) =>
          s.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.contact.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : submissions;

  const emailsSent = submissions.filter((s) => s.email_sent).length;
  const completed = submissions.filter((s) => s.questionnaire_completed).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Leaf className="text-accent" size={32} strokeWidth={1.2} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Leaf className="text-accent" size={20} strokeWidth={1.2} />
            <div>
              <span className="font-serif text-dark text-[15px] italic block leading-tight">
                Dashboard
              </span>
              <span className="font-sans text-taupe text-[10px] tracking-widest uppercase">
                The Beautiful Life
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href="/admin/vragen"
              className="flex items-center gap-1.5 font-sans text-xs text-brown hover:text-accent transition-colors p-2 rounded-lg hover:bg-blush/50"
            >
              <MessageSquare size={15} />
              <span className="hidden sm:inline">Vragen</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 font-sans text-xs text-brown hover:text-accent transition-colors p-2 rounded-lg hover:bg-blush/50"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Uit</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5 md:py-8">
        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-2.5 md:gap-4 mb-6">
          <div className="bg-card rounded-xl p-3 md:p-4 border border-border/40 text-center">
            <Users className="text-accent mx-auto mb-1.5" size={18} />
            <p className="font-serif text-dark text-xl md:text-2xl font-light leading-none">
              {total}
            </p>
            <p className="font-sans text-taupe text-[10px] md:text-xs mt-1 tracking-wider">
              Inzendingen
            </p>
          </div>
          <div className="bg-card rounded-xl p-3 md:p-4 border border-border/40 text-center">
            <MailCheck className="text-accent mx-auto mb-1.5" size={18} />
            <p className="font-serif text-dark text-xl md:text-2xl font-light leading-none">
              {emailsSent}
            </p>
            <p className="font-sans text-taupe text-[10px] md:text-xs mt-1 tracking-wider">
              E-mails
            </p>
          </div>
          <div className="bg-card rounded-xl p-3 md:p-4 border border-border/40 text-center">
            <CheckCircle className="text-green-600 mx-auto mb-1.5" size={18} />
            <p className="font-serif text-dark text-xl md:text-2xl font-light leading-none">
              {completed}
            </p>
            <p className="font-sans text-taupe text-[10px] md:text-xs mt-1 tracking-wider">
              Ingevuld
            </p>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-dark text-lg md:text-xl font-light">
            Inzendingen
          </h2>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-lg transition-colors ${
                showSearch ? "bg-accent/10 text-accent" : "text-taupe hover:text-brown hover:bg-blush/50"
              }`}
            >
              <Search size={16} />
            </button>
            <button
              onClick={() => fetchSubmissions(true)}
              className="p-2 rounded-lg text-taupe hover:text-brown hover:bg-blush/50 transition-colors"
            >
              <motion.div
                animate={refreshing ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: "linear" }}
              >
                <RefreshCw size={16} />
              </motion.div>
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe" size={14} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Zoek op naam of e-mail..."
                  className="w-full bg-card border border-border/60 rounded-xl pl-9 pr-9 py-2.5 font-sans text-sm text-dark placeholder:text-taupe/60 focus:outline-none focus:ring-2 focus:ring-accent/30"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-taupe hover:text-brown"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submissions list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="text-taupe/30 mx-auto mb-3" size={36} />
            <p className="font-sans text-taupe text-sm">
              {searchQuery ? "Geen resultaten gevonden" : "Nog geen inzendingen"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                {/* Submission row */}
                <button
                  onClick={() => toggleDetail(s.id)}
                  className={`w-full text-left rounded-xl p-3.5 md:p-4 border transition-all duration-200 flex items-center gap-3 ${
                    expandedId === s.id
                      ? "bg-card border-accent/30 shadow-sm rounded-b-none"
                      : "bg-card hover:bg-blush/40 border-border/40"
                  }`}
                >
                  {/* Avatar initial */}
                  <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-blush flex items-center justify-center">
                    <span className="font-serif text-accent text-sm md:text-base font-light">
                      {s.first_name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-serif text-dark text-[14px] md:text-[15px]">
                        {s.first_name}
                      </span>
                      <div className="flex items-center gap-1">
                        {s.questionnaire_completed && (
                          <CheckCircle className="text-green-600 flex-shrink-0" size={13} />
                        )}
                        {s.email_sent && !s.questionnaire_completed && (
                          <MailCheck className="text-accent flex-shrink-0" size={13} />
                        )}
                        {!s.email_sent && (
                          <Clock className="text-taupe/60 flex-shrink-0" size={12} />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans text-brown/80 text-xs truncate max-w-[140px] md:max-w-none">
                        {s.contact}
                      </span>
                      {s.phone && (
                        <>
                          <span className="font-sans text-taupe/50 text-[10px]">·</span>
                          <span className="font-sans text-brown/80 text-xs flex items-center gap-0.5 flex-shrink-0">
                            <Phone size={10} className="text-taupe" />
                            {s.phone}
                          </span>
                        </>
                      )}
                      <span className="font-sans text-taupe/50 text-[10px]">·</span>
                      <span className="font-sans text-taupe text-[10px] flex-shrink-0">
                        {fmtShort(s.created_at)}
                      </span>
                    </div>
                  </div>

                  {Number(s.answer_count) > 0 && (
                    <span className="bg-accent/10 text-accent text-[10px] font-sans font-medium px-2 py-0.5 rounded-full flex-shrink-0 hidden sm:block">
                      {s.answer_count} antw.
                    </span>
                  )}

                  <motion.div
                    animate={{ rotate: expandedId === s.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="text-taupe" size={16} />
                  </motion.div>
                </button>

                {/* Expanded detail */}
                <AnimatePresence>
                  {expandedId === s.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-card border-x border-b border-accent/30 rounded-b-xl px-3.5 pb-4 md:px-5 md:pb-5">
                        {/* Status badges & date */}
                        <div className="flex flex-wrap gap-1.5 pt-3 pb-3 border-b border-border/30 mb-3">
                          <span className={`flex items-center gap-1 text-[11px] font-sans px-2.5 py-1 rounded-full ${
                            s.email_sent ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {s.email_sent ? <MailCheck size={11} /> : <Mail size={11} />}
                            {s.email_sent ? "E-mail verzonden" : "E-mail pending"}
                          </span>
                          <span className={`flex items-center gap-1 text-[11px] font-sans px-2.5 py-1 rounded-full ${
                            s.questionnaire_completed ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                          }`}>
                            {s.questionnaire_completed ? <CheckCircle size={11} /> : <Clock size={11} />}
                            {s.questionnaire_completed ? "Ingevuld" : "Niet ingevuld"}
                          </span>
                          <span className="flex items-center text-[11px] font-sans text-taupe px-2 py-1">
                            {fmt(s.created_at)}
                          </span>
                        </div>

                        {/* Answers */}
                        {loadingDetail === s.id ? (
                          <div className="py-6 flex justify-center">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            >
                              <Leaf className="text-accent/50" size={20} strokeWidth={1.2} />
                            </motion.div>
                          </div>
                        ) : details[s.id]?.answers.length ? (
                          <div className="space-y-2.5">
                            <p className="font-sans text-[10px] text-taupe tracking-widest uppercase mb-1">
                              Antwoorden ({details[s.id].answers.length})
                            </p>
                            {details[s.id].answers.map((a, ai) => (
                              <div key={ai} className="bg-page rounded-lg p-3 md:p-3.5">
                                <p className="font-sans text-dark/70 text-xs mb-1.5 leading-snug">
                                  {a.question_text}
                                </p>
                                {a.question_type === "scale" ? (
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-border/40 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-accent rounded-full transition-all"
                                        style={{ width: `${(a.answer_scale || 0) * 10}%` }}
                                      />
                                    </div>
                                    <span className="font-sans text-accent text-xs font-medium w-8 text-right">
                                      {a.answer_scale}/10
                                    </span>
                                  </div>
                                ) : (
                                  <p className="font-sans text-dark text-[13px] leading-relaxed">
                                    {a.answer_text || (
                                      <span className="text-taupe/60 italic">Geen antwoord</span>
                                    )}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <FileText className="text-taupe/30 mx-auto mb-1.5" size={22} />
                            <p className="font-sans text-taupe text-xs">Nog geen antwoorden</p>
                          </div>
                        )}

                        {/* Delete action */}
                        <div className="mt-4 pt-3 border-t border-border/30">
                          {deleteConfirm === s.id ? (
                            <div className="flex items-center gap-2 bg-red-50 rounded-lg p-3">
                              <AlertTriangle className="text-red-500 flex-shrink-0" size={16} />
                              <p className="font-sans text-red-700 text-xs flex-1">
                                Weet je het zeker?
                              </p>
                              <button
                                onClick={() => deleteSubmission(s.id)}
                                disabled={deleting}
                                className="font-sans text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                              >
                                {deleting ? "..." : "Verwijder"}
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="font-sans text-xs text-red-400 hover:text-red-600 px-2 py-1.5"
                              >
                                Annuleer
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(s.id)}
                              className="flex items-center gap-1.5 font-sans text-xs text-taupe hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 size={13} />
                              Verwijderen
                            </button>
                          )}
                        </div>
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
              className="p-2 rounded-lg text-brown hover:bg-blush/50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg font-sans text-xs transition-colors ${
                  page === p ? "bg-accent text-white" : "text-brown hover:bg-blush/50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg text-brown hover:bg-blush/50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
