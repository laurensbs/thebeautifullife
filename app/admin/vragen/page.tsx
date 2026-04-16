"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Leaf,
  ChevronLeft,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  GripVertical,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Question = {
  id: number;
  question_text: string;
  question_type: string;
  options: string[] | null;
  sort_order: number;
  is_active: boolean;
};

export default function AdminQuestions() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newText, setNewText] = useState("");
  const [newType, setNewType] = useState("open");
  const [newOptions, setNewOptions] = useState("");
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchQuestions = useCallback(async () => {
    const res = await fetch("/api/admin/questions");
    if (res.status === 401) {
      router.push("/admin");
      return;
    }
    const data = await res.json();
    setQuestions(data.questions);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const addQuestion = async () => {
    if (!newText.trim()) return;
    setSaving(true);
    const body: Record<string, unknown> = {
      question_text: newText.trim(),
      question_type: newType,
    };
    if (newType === "choice" && newOptions.trim()) {
      body.options = newOptions.split("\n").filter((o) => o.trim());
    }
    await fetch("/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setNewText("");
    setNewType("open");
    setNewOptions("");
    setShowAdd(false);
    setSaving(false);
    fetchQuestions();
  };

  const toggleActive = async (q: Question) => {
    await fetch("/api/admin/questions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: q.id, is_active: !q.is_active }),
    });
    fetchQuestions();
  };

  const saveEdit = async (q: Question) => {
    if (!editText.trim()) return;
    await fetch("/api/admin/questions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: q.id, question_text: editText.trim() }),
    });
    setEditId(null);
    fetchQuestions();
  };

  const deleteQuestion = async (id: number) => {
    await fetch("/api/admin/questions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setDeleteConfirm(null);
    fetchQuestions();
  };

  const activeCount = questions.filter((q) => q.is_active).length;

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
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-1.5 font-sans text-sm text-brown hover:text-accent transition-colors"
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="text-center">
            <span className="font-serif text-dark text-[15px] italic block leading-tight">
              Vragen
            </span>
            <span className="font-sans text-taupe text-[10px] tracking-widest uppercase">
              {activeCount} actief · {questions.length} totaal
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1 bg-accent text-white px-3 py-2 rounded-lg font-sans text-xs tracking-wider"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Nieuw</span>
          </motion.button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5 md:py-8">
        {/* Add question form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-5"
            >
              <div className="bg-card rounded-2xl p-4 md:p-5 border border-accent/30 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-sans text-xs text-accent tracking-widest uppercase font-medium">
                    Nieuwe vraag
                  </span>
                  <button
                    onClick={() => setShowAdd(false)}
                    className="text-taupe hover:text-brown p-1"
                  >
                    <X size={16} />
                  </button>
                </div>

                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Typ je vraag..."
                  rows={2}
                  className="w-full bg-page border border-border/60 rounded-xl px-4 py-3 font-sans text-sm text-dark focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none mb-3"
                />

                {/* Type selector */}
                <div className="flex gap-2 mb-3">
                  {([
                    { key: "open", label: "Open" },
                    { key: "scale", label: "Schaal 1-10" },
                    { key: "choice", label: "Meerkeuze" },
                  ] as const).map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setNewType(t.key)}
                      className={`flex-1 py-2 rounded-lg font-sans text-xs transition-all ${
                        newType === t.key
                          ? "bg-accent text-white shadow-sm"
                          : "bg-page border border-border/60 text-brown hover:border-accent/40"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {newType === "choice" && (
                  <textarea
                    value={newOptions}
                    onChange={(e) => setNewOptions(e.target.value)}
                    placeholder="Opties (één per regel)"
                    rows={3}
                    className="w-full bg-page border border-border/60 rounded-xl px-4 py-3 font-sans text-xs text-dark focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none mb-3"
                  />
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={addQuestion}
                  disabled={saving || !newText.trim()}
                  className="w-full bg-accent text-white py-2.5 rounded-xl font-sans text-xs tracking-wider uppercase disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={14} />
                  {saving ? "Opslaan..." : "Opslaan"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Questions list */}
        {questions.length === 0 ? (
          <div className="text-center py-16">
            <Leaf className="text-taupe/30 mx-auto mb-3" size={36} strokeWidth={1.2} />
            <p className="font-sans text-taupe text-sm mb-3">Nog geen vragen</p>
            <button
              onClick={() => setShowAdd(true)}
              className="font-sans text-xs text-accent hover:underline"
            >
              Voeg je eerste vraag toe
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {questions.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`bg-card rounded-xl border transition-all duration-200 ${
                  !q.is_active
                    ? "opacity-50 border-border/30"
                    : deleteConfirm === q.id
                    ? "border-red-200"
                    : "border-border/40"
                }`}
              >
                <div className="p-3.5 md:p-4">
                  <div className="flex items-start gap-2.5">
                    {/* Order number */}
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blush flex items-center justify-center mt-0.5">
                      <span className="font-sans text-accent text-[10px] font-medium">
                        {q.sort_order}
                      </span>
                    </div>

                    {/* Question text */}
                    <div className="flex-1 min-w-0">
                      {editId === q.id ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 bg-page border border-accent/40 rounded-lg px-3 py-2 font-sans text-sm text-dark focus:outline-none focus:ring-2 focus:ring-accent/30"
                            onKeyDown={(e) => e.key === "Enter" && saveEdit(q)}
                            autoFocus
                          />
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => saveEdit(q)}
                              className="flex items-center gap-1 bg-accent text-white px-3 py-1.5 rounded-lg font-sans text-xs"
                            >
                              <Save size={12} />
                              Opslaan
                            </button>
                            <button
                              onClick={() => setEditId(null)}
                              className="text-taupe hover:text-brown px-2 py-1.5"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p
                          onClick={() => {
                            setEditId(q.id);
                            setEditText(q.question_text);
                          }}
                          className="font-sans text-dark text-[13px] md:text-sm leading-relaxed cursor-pointer hover:text-accent transition-colors"
                        >
                          {q.question_text}
                        </p>
                      )}

                      {/* Meta row */}
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`font-sans text-[10px] px-2 py-0.5 rounded-full ${
                            q.question_type === "open"
                              ? "bg-blue-50 text-blue-600"
                              : q.question_type === "scale"
                              ? "bg-purple-50 text-purple-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {q.question_type === "open"
                            ? "Open"
                            : q.question_type === "scale"
                            ? "Schaal"
                            : "Meerkeuze"}
                        </span>
                        {!q.is_active && (
                          <span className="font-sans text-[10px] text-taupe/70 italic">
                            Inactief
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <button
                        onClick={() => toggleActive(q)}
                        className={`p-2 rounded-lg transition-colors ${
                          q.is_active
                            ? "text-accent hover:bg-accent/10"
                            : "text-taupe hover:bg-blush/50"
                        }`}
                        title={q.is_active ? "Deactiveren" : "Activeren"}
                      >
                        {q.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirm(deleteConfirm === q.id ? null : q.id)
                        }
                        className="p-2 rounded-lg text-taupe hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Verwijderen"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Delete confirmation */}
                <AnimatePresence>
                  {deleteConfirm === q.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3.5 pb-3.5 md:px-4 md:pb-4">
                        <div className="flex items-center gap-2 bg-red-50 rounded-lg p-3">
                          <AlertTriangle
                            className="text-red-500 flex-shrink-0"
                            size={15}
                          />
                          <p className="font-sans text-red-700 text-xs flex-1">
                            Vraag verwijderen?
                          </p>
                          <button
                            onClick={() => deleteQuestion(q.id)}
                            className="font-sans text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Verwijder
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="font-sans text-xs text-red-400 hover:text-red-600 px-2 py-1.5"
                          >
                            Nee
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
