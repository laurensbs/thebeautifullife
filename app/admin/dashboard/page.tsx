"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Leaf,
  LogOut,
  Users,
  MessageSquare,
  ChevronRight,
  Mail,
  MailCheck,
  CheckCircle,
  Clock,
  FileText,
  ChevronLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

type Submission = {
  id: number;
  first_name: string;
  contact: string;
  created_at: string;
  email_sent: boolean;
  questionnaire_completed: boolean;
  answer_count: number;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<{ submission: Submission; answers: Array<{ question_text: string; question_type: string; answer_text: string | null; answer_scale: number | null }> } | null>(null);

  const fetchSubmissions = useCallback(async () => {
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
  }, [page, router]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const loadDetail = async (id: number) => {
    setSelectedId(id);
    const res = await fetch(`/api/admin/submissions/${id}`);
    if (res.ok) {
      setDetail(await res.json());
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Leaf className="text-accent" size={32} strokeWidth={1.2} />
        </motion.div>
      </div>
    );
  }

  // Detail view
  if (selectedId && detail) {
    return (
      <div className="min-h-screen bg-page">
        <header className="px-5 py-4 border-b border-border/50 flex items-center justify-between bg-card/50">
          <button onClick={() => { setSelectedId(null); setDetail(null); }} className="flex items-center gap-1.5 font-sans text-sm text-brown hover:text-accent transition-colors">
            <ChevronLeft size={16} />
            Terug
          </button>
          <span className="font-serif text-dark text-sm italic">Inzending #{detail.submission.id}</span>
        </header>

        <main className="max-w-2xl mx-auto px-5 py-6 md:py-10">
          {/* Info card */}
          <div className="bg-card rounded-2xl p-5 md:p-6 border border-border/40 mb-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="font-serif text-dark text-xl font-light">{detail.submission.first_name}</h2>
                <p className="font-sans text-brown text-xs mt-0.5">{detail.submission.contact}</p>
              </div>
              <span className="font-sans text-taupe text-xs">{fmt(detail.submission.created_at)}</span>
            </div>
            <div className="flex gap-3 flex-wrap">
              <span className={`flex items-center gap-1 text-xs font-sans px-2.5 py-1 rounded-full ${
                detail.submission.email_sent ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
              }`}>
                {detail.submission.email_sent ? <MailCheck size={12} /> : <Mail size={12} />}
                {detail.submission.email_sent ? "E-mail verzonden" : "E-mail niet verzonden"}
              </span>
              <span className={`flex items-center gap-1 text-xs font-sans px-2.5 py-1 rounded-full ${
                detail.submission.questionnaire_completed ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
              }`}>
                {detail.submission.questionnaire_completed ? <CheckCircle size={12} /> : <Clock size={12} />}
                {detail.submission.questionnaire_completed ? "Vragenlijst ingevuld" : "Vragenlijst open"}
              </span>
            </div>
          </div>

          {/* Answers */}
          {detail.answers.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-sans text-xs text-taupe tracking-widest uppercase mb-2">Antwoorden</h3>
              {detail.answers.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl p-4 border border-border/40"
                >
                  <p className="font-serif text-dark text-sm mb-2">{a.question_text}</p>
                  <p className="font-sans text-brown text-sm leading-relaxed">
                    {a.question_type === "scale" ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="bg-accent text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                          {a.answer_scale}
                        </span>
                        <span className="text-taupe text-xs">/ 10</span>
                      </span>
                    ) : (
                      a.answer_text || <span className="text-taupe italic">Geen antwoord</span>
                    )}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="text-taupe/40 mx-auto mb-2" size={28} />
              <p className="font-sans text-taupe text-sm">Nog geen antwoorden ontvangen</p>
            </div>
          )}
        </main>
      </div>
    );
  }

  // List view
  return (
    <div className="min-h-screen bg-page">
      {/* Header */}
      <header className="px-5 py-4 border-b border-border/50 flex items-center justify-between bg-card/50">
        <div className="flex items-center gap-2">
          <Leaf className="text-accent" size={20} strokeWidth={1.2} />
          <span className="font-serif text-dark text-sm italic">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/vragen" className="flex items-center gap-1.5 font-sans text-xs text-brown hover:text-accent transition-colors">
            <MessageSquare size={14} />
            <span className="hidden sm:inline">Vragen</span>
          </Link>
          <button onClick={logout} className="flex items-center gap-1.5 font-sans text-xs text-brown hover:text-accent transition-colors">
            <LogOut size={14} />
            <span className="hidden sm:inline">Uitloggen</span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-6 md:py-10">
        {/* Stats bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Users className="text-accent" size={18} />
            <span className="font-sans text-dark text-sm font-medium">{total}</span>
            <span className="font-sans text-taupe text-xs">inzendingen</span>
          </div>
        </div>

        {/* Submissions list */}
        {submissions.length === 0 ? (
          <div className="text-center py-16">
            <Users className="text-taupe/30 mx-auto mb-3" size={36} />
            <p className="font-sans text-taupe text-sm">Nog geen inzendingen</p>
          </div>
        ) : (
          <div className="space-y-2">
            {submissions.map((s) => (
              <motion.button
                key={s.id}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.995 }}
                onClick={() => loadDetail(s.id)}
                className="w-full text-left bg-card hover:bg-blush/60 rounded-xl p-4 border border-border/40 transition-colors flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-serif text-dark text-sm">{s.first_name}</span>
                    {s.questionnaire_completed && (
                      <CheckCircle className="text-green-600 flex-shrink-0" size={13} />
                    )}
                    {s.email_sent && !s.questionnaire_completed && (
                      <MailCheck className="text-accent flex-shrink-0" size={13} />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-brown text-xs truncate">{s.contact}</span>
                    <span className="font-sans text-taupe text-[10px]">·</span>
                    <span className="font-sans text-taupe text-[10px] flex-shrink-0">{fmt(s.created_at)}</span>
                  </div>
                </div>
                {Number(s.answer_count) > 0 && (
                  <span className="bg-accent/10 text-accent text-[10px] font-sans px-2 py-0.5 rounded-full flex-shrink-0">
                    {s.answer_count} antw.
                  </span>
                )}
                <ChevronRight className="text-taupe flex-shrink-0" size={16} />
              </motion.button>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="font-sans text-xs text-brown disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-sans text-xs text-taupe">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="font-sans text-xs text-brown disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
