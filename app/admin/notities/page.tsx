"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Loader2,
  Trash2,
  Calendar,
  Check,
  ListTodo,
  Edit3,
  Save,
} from "lucide-react";
import PageLoader from "@/components/ui/PageLoader";
import AdminNav from "@/components/admin/AdminNav";

type Todo = {
  id: number;
  title: string;
  body_md: string;
  done: boolean;
  due_at: string | null;
  created_at: string;
  completed_at: string | null;
};

const fmtDate = (s: string | null) =>
  s
    ? new Date(s).toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "short",
      })
    : "";

/** Render markdown links [text](url) als <a>, behoud rest als platte tekst. */
function renderMarkdown(text: string) {
  if (!text) return null;
  const parts: Array<string | { label: string; url: string }> = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
    parts.push({ label: m[1], url: m[2] });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.map((p, i) =>
    typeof p === "string" ? (
      <span key={i} style={{ whiteSpace: "pre-wrap" }}>
        {p}
      </span>
    ) : (
      <a
        key={i}
        href={p.url}
        target="_blank"
        rel="noreferrer"
        className="text-tan underline hover:text-ink transition"
      >
        {p.label}
      </a>
    )
  );
}

export default function NotitiesPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"open" | "done" | "all">("open");
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newDue, setNewDue] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editBody, setEditBody] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const editTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchTodos = useCallback(async () => {
    const res = await fetch("/api/admin/todos");
    if (res.status === 401) {
      router.push("/admin");
      return;
    }
    const data = await res.json();
    setTodos(data.todos ?? []);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAdding(true);
    const res = await fetch("/api/admin/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        body_md: newBody,
        due_at: newDue ? new Date(newDue).toISOString() : null,
      }),
    });
    const data = await res.json();
    if (data.todo) setTodos((t) => [data.todo, ...t]);
    setNewTitle("");
    setNewBody("");
    setNewDue("");
    setAdding(false);
  };

  const toggleDone = async (todo: Todo) => {
    const next = !todo.done;
    setTodos((arr) =>
      arr.map((t) =>
        t.id === todo.id
          ? {
              ...t,
              done: next,
              completed_at: next ? new Date().toISOString() : null,
            }
          : t
      )
    );
    await fetch(`/api/admin/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: next }),
    });
  };

  const remove = async (id: number) => {
    setTodos((arr) => arr.filter((t) => t.id !== id));
    await fetch(`/api/admin/todos/${id}`, { method: "DELETE" });
  };

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditBody(todo.body_md);
  };

  const onEditChange = (val: string) => {
    setEditBody(val);
    if (editTimer.current) clearTimeout(editTimer.current);
    editTimer.current = setTimeout(async () => {
      if (editingId == null) return;
      setSavingId(editingId);
      await fetch(`/api/admin/todos/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body_md: val }),
      });
      setTodos((arr) =>
        arr.map((t) => (t.id === editingId ? { ...t, body_md: val } : t))
      );
      setSavingId(null);
    }, 600);
  };

  const filtered = todos.filter((t) =>
    filter === "open" ? !t.done : filter === "done" ? t.done : true
  );

  if (loading) return <PageLoader label="notities worden geladen…" />;

  return (
    <div className="min-h-screen bg-page">
      <AdminNav />

      <main className="max-w-3xl mx-auto px-5 sm:px-6 py-8 sm:py-10">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
          <div>
            <p className="font-script text-tan text-3xl">mijn werk</p>
            <h1 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.06em] uppercase mt-1 text-ink inline-flex items-center gap-2.5">
              <ListTodo size={22} className="text-tan" strokeWidth={1.5} />
              Notities & to-do's
            </h1>
          </div>
          <div className="flex items-center gap-1">
            {(["open", "done", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 rounded transition ${
                  filter === f
                    ? "bg-tan text-white"
                    : "text-ink-soft hover:text-tan"
                }`}
              >
                {f === "open" ? "Open" : f === "done" ? "Klaar" : "Alle"}
              </button>
            ))}
          </div>
        </div>

        {/* Quick-add */}
        <form
          onSubmit={addTodo}
          className="bg-page-soft border border-tan/30 rounded-[6px] px-5 py-4 sm:px-6 sm:py-5 mb-6 shadow-[0_8px_24px_rgba(60,50,30,0.05)]"
        >
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Wat moet er gebeuren?"
            className="w-full bg-transparent border-none outline-none font-serif text-ink text-[16px] placeholder:text-muted/70"
          />
          <AnimatePresence>
            {newTitle && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <textarea
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="Details, context, of links — bijv. [klant](https://...)"
                  rows={2}
                  className="w-full mt-3 bg-white/60 border border-line rounded-md px-3 py-2 font-sans text-[13px] text-ink-soft leading-[1.7] focus:outline-none focus:border-tan resize-y"
                />
                <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
                  <label className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-muted">
                    <Calendar size={11} /> Deadline
                    <input
                      type="date"
                      value={newDue}
                      onChange={(e) => setNewDue(e.target.value)}
                      className="bg-white/70 border border-line rounded px-2 py-1 text-[12px] text-ink-soft focus:outline-none focus:border-tan ml-1 normal-case tracking-normal"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={adding || !newTitle.trim()}
                    className="text-[10px] tracking-[0.18em] uppercase bg-ink hover:brightness-110 disabled:opacity-50 text-white px-4 py-2 rounded inline-flex items-center gap-1.5 transition"
                  >
                    {adding && <Loader2 size={11} className="animate-spin" />}
                    <Plus size={11} /> Toevoegen
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Lijst */}
        {filtered.length === 0 ? (
          <div className="bg-page-soft rounded-[6px] px-8 py-14 text-center text-ink-soft">
            <ListTodo
              className="text-tan mx-auto mb-3"
              size={26}
              strokeWidth={1.4}
            />
            <p className="font-serif text-lg">
              {filter === "open" ? "Niets meer te doen" : "Geen items"}
            </p>
            <p className="text-[13px] mt-2 text-muted">
              {filter === "open"
                ? "Tijd voor een kopje thee."
                : "Pas je filter aan."}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((t) => {
              const overdue =
                t.due_at &&
                !t.done &&
                new Date(t.due_at).getTime() < Date.now();
              return (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.25 }}
                  className={`bg-page-soft rounded-md border px-4 py-3.5 sm:px-5 sm:py-4 transition ${
                    t.done
                      ? "border-line/40 opacity-60"
                      : overdue
                        ? "border-red-200"
                        : "border-line/60 hover:border-tan/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleDone(t)}
                      className={`flex-none mt-0.5 w-5 h-5 rounded border transition flex items-center justify-center ${
                        t.done
                          ? "bg-sage border-sage text-white"
                          : "border-line hover:border-tan"
                      }`}
                      aria-label={t.done ? "Markeer als niet klaar" : "Markeer als klaar"}
                    >
                      {t.done && <Check size={12} strokeWidth={2.5} />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3 flex-wrap">
                        <p
                          className={`font-serif text-[15px] tracking-[0.02em] ${
                            t.done ? "line-through text-muted" : "text-ink"
                          }`}
                        >
                          {t.title}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-muted">
                          {t.due_at && (
                            <span
                              className={
                                overdue ? "text-red-500" : ""
                              }
                            >
                              {fmtDate(t.due_at)}
                            </span>
                          )}
                          <button
                            onClick={() =>
                              editingId === t.id
                                ? setEditingId(null)
                                : startEdit(t)
                            }
                            className="text-muted hover:text-tan transition"
                            title="Bewerk details"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={() => remove(t.id)}
                            className="text-muted hover:text-red-500 transition"
                            title="Verwijder"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {editingId === t.id ? (
                        <div className="mt-2">
                          <textarea
                            value={editBody}
                            onChange={(e) => onEditChange(e.target.value)}
                            rows={3}
                            placeholder="Details, context, of links — bijv. [klant](https://...)"
                            className="w-full bg-white/70 border border-line rounded-md px-3 py-2 font-sans text-[13px] text-ink-soft leading-[1.7] focus:outline-none focus:border-tan resize-y"
                          />
                          <p className="text-[10px] tracking-[0.18em] uppercase text-muted mt-1.5 inline-flex items-center gap-1.5">
                            {savingId === t.id ? (
                              <>
                                <Loader2 size={9} className="animate-spin" />
                                opslaan…
                              </>
                            ) : (
                              <>
                                <Save size={9} /> auto-saved
                              </>
                            )}
                          </p>
                        </div>
                      ) : (
                        t.body_md && (
                          <div className="mt-1.5 text-[13px] text-ink-soft leading-[1.7]">
                            {renderMarkdown(t.body_md)}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <p className="text-[11px] text-muted mt-6 leading-relaxed">
          Tip: gebruik <code className="bg-page-soft px-1.5 py-0.5 rounded text-[11px]">[label](url)</code> in
          de details om klikbare links te maken.
        </p>
      </main>
    </div>
  );
}
