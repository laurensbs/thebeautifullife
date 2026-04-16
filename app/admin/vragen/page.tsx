"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Leaf,
  ChevronLeft,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Save,
  X,
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
    if (!confirm("Weet je zeker dat je deze vraag wilt verwijderen?")) return;
    await fetch("/api/admin/questions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchQuestions();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Leaf className="text-accent" size={32} strokeWidth={1.2} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page">
      <header className="px-5 py-4 border-b border-border/50 flex items-center justify-between bg-card/50">
        <Link href="/admin/dashboard" className="flex items-center gap-1.5 font-sans text-sm text-brown hover:text-accent transition-colors">
          <ChevronLeft size={16} />
          Dashboard
        </Link>
        <span className="font-serif text-dark text-sm italic">Vragen beheren</span>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-6 md:py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-dark text-xl font-light">Reflectievragen</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 bg-accent text-white px-3 py-1.5 rounded-lg font-sans text-xs tracking-wider uppercase"
          >
            <Plus size={14} />
            Toevoegen
          </motion.button>
        </div>

        {/* Add question form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-card rounded-2xl p-5 border border-accent/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-sans text-xs text-accent tracking-widest uppercase">Nieuwe vraag</span>
                  <button onClick={() => setShowAdd(false)} className="text-taupe hover:text-brown">
                    <X size={16} />
                  </button>
                </div>

                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Typ je vraag..."
                  rows={2}
                  className="w-full bg-page border border-border/60 rounded-lg px-4 py-2.5 font-sans text-sm text-dark focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none mb-3"
                />

                <div className="flex gap-2 mb-3">
                  {(["open", "scale", "choice"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setNewType(t)}
                      className={`px-3 py-1.5 rounded-lg font-sans text-xs transition-colors ${
                        newType === t ? "bg-accent text-white" : "bg-page border border-border/60 text-brown"
                      }`}
                    >
                      {t === "open" ? "Open" : t === "scale" ? "Schaal 1-10" : "Meerkeuze"}
                    </button>
                  ))}
                </div>

                {newType === "choice" && (
                  <textarea
                    value={newOptions}
                    onChange={(e) => setNewOptions(e.target.value)}
                    placeholder="Opties (één per regel)"
                    rows={4}
                    className="w-full bg-page border border-border/60 rounded-lg px-4 py-2.5 font-sans text-xs text-dark focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none mb-3"
                  />
                )}

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={addQuestion}
                  disabled={saving || !newText.trim()}
                  className="w-full bg-accent text-white py-2 rounded-lg font-sans text-xs tracking-wider uppercase disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={14} />
                  Opslaan
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Questions list */}
        <div className="space-y-2">
          {questions.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`bg-card rounded-xl p-4 border border-border/40 ${
                !q.is_active ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <GripVertical className="text-taupe/50 flex-shrink-0 mt-0.5" size={16} />

                <div className="flex-1 min-w-0">
                  {editId === q.id ? (
                    <div className="flex gap-2">
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 bg-page border border-border/60 rounded-lg px-3 py-1.5 font-sans text-sm text-dark focus:outline-none focus:ring-2 focus:ring-accent/30"
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(q)}
                      />
                      <button onClick={() => saveEdit(q)} className="text-accent hover:text-dark">
                        <Save size={14} />
                      </button>
                      <button onClick={() => setEditId(null)} className="text-taupe hover:text-brown">
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <p
                      onClick={() => { setEditId(q.id); setEditText(q.question_text); }}
                      className="font-sans text-dark text-sm cursor-pointer hover:text-accent transition-colors"
                    >
                      {q.question_text}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-sans text-[10px] text-taupe bg-page px-2 py-0.5 rounded">
                      {q.question_type === "open" ? "Open" : q.question_type === "scale" ? "Schaal" : "Meerkeuze"}
                    </span>
                    <span className="font-sans text-[10px] text-taupe">#{q.sort_order}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(q)}
                    className="text-taupe hover:text-accent transition-colors p-1"
                    title={q.is_active ? "Deactiveren" : "Activeren"}
                  >
                    {q.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="text-taupe hover:text-red-500 transition-colors p-1"
                    title="Verwijderen"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
