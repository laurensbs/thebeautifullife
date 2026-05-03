"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  Send,
  Phone,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HeartDivider from "@/components/ui/HeartDivider";
import HeartDraw from "@/components/ui/HeartDraw";
import PageLoader from "@/components/ui/PageLoader";
import BrandLogo from "@/components/ui/BrandLogo";

type Question = {
  id: number;
  question_text: string;
  question_type: string;
  options: string[] | null;
  sort_order: number;
};

type Answer = {
  questionId: number;
  text?: string;
  scale?: number;
};

export default function VragenlijstPage() {
  return (
    <Suspense fallback={<PageLoader label="een moment…" />}>
      <VragenlijstContent />
    </Suspense>
  );
}

function VragenlijstContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [phone, setPhone] = useState("");
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (!token) {
      setError(
        "Geen geldige link. Controleer je e-mail voor de juiste link."
      );
      setLoading(false);
      return;
    }

    fetch(`/api/questionnaire?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error === "already_completed") {
          setDone(true);
        } else if (data.error) {
          setError(data.error);
        } else {
          setFirstName(data.firstName);
          setQuestions(data.questions);
          setAnswers(
            data.questions.map((q: Question) => ({ questionId: q.id }))
          );
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Er ging iets mis bij het laden.");
        setLoading(false);
      });
  }, [token]);

  const updateAnswer = useCallback(
    (value: string | number) => {
      setAnswers((prev) => {
        const next = [...prev];
        const q = questions[current];
        if (q.question_type === "scale") {
          next[current] = { ...next[current], scale: value as number };
        } else {
          next[current] = { ...next[current], text: value as string };
        }
        return next;
      });
    },
    [current, questions]
  );

  const goNext = () => {
    if (current < questions.length - 1) {
      setDirection(1);
      setCurrent((c) => c + 1);
    }
  };
  const goPrev = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent((c) => c - 1);
    }
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, answers }),
      });
      if (res.ok) {
        setShowPhone(true);
      } else {
        setError("Er ging iets mis bij het versturen.");
      }
    } catch {
      setError("Verbindingsfout. Probeer het opnieuw.");
    }
    setSubmitting(false);
  };

  const savePhone = async () => {
    if (phone.trim()) {
      await fetch("/api/questionnaire", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, phone: phone.trim() }),
      });
    }
    setShowPhone(false);
    setDone(true);
  };

  const skipPhone = () => {
    setShowPhone(false);
    setDone(true);
  };

  const isLast = current === questions.length - 1;
  const currentAnswer = answers[current];

  if (loading) return <PageLoader label="vragenlijst wordt geladen…" />;

  // ─── DONE ─────────────────────────────────────────────
  if (done) {
    return (
      <main className="max-w-[680px] mx-auto px-5 sm:px-6 py-16 sm:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] px-6 py-12 sm:px-14 sm:py-16 shadow-[0_18px_48px_rgba(60,50,30,0.08)] relative overflow-hidden"
        >
          <span className="absolute top-0 left-0 right-0 h-0.5 bg-sage" />

          <div className="flex justify-center mb-5 text-tan">
            <div className="w-14 h-14 rounded-full bg-tan/10 border border-tan/40 flex items-center justify-center">
              <HeartDraw size={22} duration={1.6} delay={0.4} />
            </div>
          </div>

          <p className="font-script text-tan text-3xl sm:text-4xl">
            Dankjewel{firstName ? `, ${firstName}` : ""}
          </p>
          <h1 className="font-serif font-medium text-2xl sm:text-3xl tracking-[0.06em] uppercase mt-2 text-ink">
            Je antwoorden zijn binnen
          </h1>

          <HeartDivider className="my-6" />

          <p className="text-ink-soft text-[15px] leading-[1.85] max-w-md mx-auto">
            Marion neemt binnenkort persoonlijk contact met je op. Tot dan: laat
            de antwoorden rustig in je doorwerken — op jouw persoonlijke pad
            vind je een aanbeveling die bij je past.
          </p>

          <a
            href="/mijn-pad"
            className="inline-block mt-7 bg-ink hover:brightness-110 text-white px-7 py-3.5 rounded-[3px] font-sans text-xs tracking-[0.22em] uppercase transition shadow-[0_6px_18px_rgba(60,50,30,0.12)]"
          >
            Open mijn pad
          </a>

          <p className="font-script text-tan text-2xl mt-6">
            je eerste stap is gezet
          </p>
        </motion.div>
      </main>
    );
  }

  // ─── PHONE PROMPT ─────────────────────────────────────
  if (showPhone) {
    return (
      <main className="max-w-[560px] mx-auto px-5 sm:px-6 py-16 sm:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] px-6 py-12 sm:px-12 sm:py-14 shadow-[0_18px_48px_rgba(60,50,30,0.08)] relative overflow-hidden"
        >
          <span className="absolute top-0 left-0 right-0 h-0.5 bg-tan" />

          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-full bg-tan/10 border border-tan/40 flex items-center justify-center">
              <Phone size={22} className="text-tan" strokeWidth={1.5} />
            </div>
          </div>

          <p className="font-script text-tan text-3xl">nog één dingetje,</p>
          <h2 className="font-serif font-medium text-xl sm:text-2xl tracking-[0.06em] uppercase mt-2 text-ink">
            Je telefoonnummer?
          </h2>

          <HeartDivider className="my-6" />

          <p className="text-ink-soft text-[14px] leading-[1.85] max-w-md mx-auto">
            Wil je je mobiele nummer achterlaten? Dan kan Marion je ook via
            WhatsApp bereiken — als jij dat fijn vindt.
          </p>

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="06 - 12345678"
            className="w-full max-w-xs mx-auto block bg-white/70 border border-line rounded-md px-4 py-3 mt-7 font-sans text-sm text-ink text-center placeholder:text-muted focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30"
            autoFocus
          />

          <div className="flex flex-col items-center gap-3 mt-5">
            <button
              type="button"
              onClick={savePhone}
              disabled={!phone.trim()}
              className="w-full max-w-xs bg-tan hover:brightness-95 disabled:opacity-40 text-white px-6 py-3 rounded-[3px] font-sans text-xs tracking-[0.22em] uppercase transition shadow-[0_6px_18px_rgba(60,50,30,0.12)]"
            >
              Opslaan
            </button>
            <button
              type="button"
              onClick={skipPhone}
              className="font-sans text-muted text-xs tracking-[0.12em] uppercase hover:text-tan transition-colors"
            >
              Liever niet — ga verder
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  // ─── ERROR ────────────────────────────────────────────
  if (error) {
    return (
      <main className="max-w-[520px] mx-auto px-5 sm:px-6 py-20 text-center">
        <div className="bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] px-6 py-12 sm:px-10 sm:py-14 shadow-[0_18px_48px_rgba(60,50,30,0.08)]">
          <p className="font-script text-tan text-2xl">helaas,</p>
          <h2 className="font-serif font-medium text-xl tracking-[0.06em] uppercase mt-2 text-ink">
            Iets ging mis
          </h2>
          <HeartDivider className="my-5" />
          <p className="text-ink-soft text-[14px] leading-[1.85]">{error}</p>
        </div>
      </main>
    );
  }

  // ─── QUESTIONNAIRE ────────────────────────────────────
  const q = questions[current];
  const hasAnswer =
    currentAnswer &&
    ((currentAnswer.text && currentAnswer.text.trim().length > 0) ||
      currentAnswer.scale !== undefined);

  return (
    <main className="max-w-[720px] mx-auto px-5 sm:px-6 py-8 sm:py-12 min-h-screen flex flex-col">
      {/* Brand + counter */}
      <div className="flex items-center justify-between mb-5 gap-3">
        <div className="flex items-center gap-3">
          <BrandLogo size="sm" />
          <span className="text-[10px] tracking-[0.22em] uppercase text-muted border border-line rounded-full px-2 py-0.5 hidden sm:inline">
            reflectie
          </span>
        </div>
        <span className="font-sans text-muted text-[11px] tracking-[0.18em] uppercase">
          {current + 1} / {questions.length}
        </span>
      </div>

      {/* Progress */}
      <div className="h-0.5 bg-line/40 rounded-full overflow-hidden mb-8">
        <motion.div
          className="h-full bg-tan rounded-full"
          initial={false}
          animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>

      {/* Question card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] shadow-[0_18px_48px_rgba(60,50,30,0.08)] relative overflow-hidden flex flex-col"
      >
        <span className="absolute top-0 left-0 right-0 h-0.5 bg-tan" />

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 sm:px-12 sm:py-14 text-center">
          {current === 0 && firstName && (
            <p className="font-script text-tan text-2xl mb-3">
              welkom, {firstName}
            </p>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -30 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col items-center w-full"
            >
              <h2 className="font-serif text-ink text-xl sm:text-2xl font-medium tracking-[0.04em] leading-snug text-center max-w-lg">
                {q.question_text}
              </h2>

              <HeartDivider className="my-7" />

              {/* Open text */}
              {q.question_type === "open" && (
                <textarea
                  value={currentAnswer?.text || ""}
                  onChange={(e) => updateAnswer(e.target.value)}
                  placeholder="Neem de tijd om na te denken…"
                  rows={5}
                  className="w-full max-w-lg bg-white/70 border border-line rounded-md px-5 py-4 font-sans text-ink text-sm leading-relaxed placeholder:text-muted focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan/30 resize-y"
                />
              )}

              {/* Scale (1-10) */}
              {q.question_type === "scale" && (
                <div className="flex flex-col items-center gap-4 w-full max-w-lg">
                  <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-center">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => updateAnswer(n)}
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full font-sans text-sm transition border ${
                          currentAnswer?.scale === n
                            ? "bg-tan text-white border-transparent"
                            : "bg-white/60 border-line text-ink-soft hover:border-tan hover:text-tan"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between w-full max-w-xs text-[10px] tracking-[0.18em] uppercase text-muted">
                    <span>helemaal niet</span>
                    <span>heel erg</span>
                  </div>
                </div>
              )}

              {/* Multiple choice */}
              {q.question_type === "choice" && q.options && (
                <div className="flex flex-col gap-2.5 w-full max-w-lg">
                  {(q.options as string[]).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateAnswer(opt)}
                      className={`w-full text-left px-5 py-3.5 rounded-md font-sans text-sm transition border ${
                        currentAnswer?.text === opt
                          ? "bg-tan/10 border-tan text-ink"
                          : "bg-white/60 border-line text-ink-soft hover:border-tan/60"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="px-6 py-5 sm:px-12 sm:py-6 border-t border-line/40 flex items-center justify-between bg-page-soft">
          <button
            type="button"
            onClick={goPrev}
            disabled={current === 0}
            className="flex items-center gap-1.5 font-sans text-[11px] tracking-[0.18em] uppercase text-ink-soft disabled:opacity-30 disabled:cursor-not-allowed hover:text-tan transition-colors px-2 py-1.5"
          >
            <ChevronLeft size={14} />
            <span className="hidden sm:inline">Vorige</span>
          </button>

          {isLast ? (
            <button
              type="button"
              onClick={submit}
              disabled={submitting || !hasAnswer}
              className="flex items-center gap-2 bg-ink hover:brightness-110 text-white px-6 py-2.5 rounded-[3px] font-sans text-[11px] tracking-[0.22em] uppercase disabled:opacity-50 transition shadow-[0_6px_18px_rgba(60,50,30,0.12)]"
            >
              {submitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  Verstuur
                  <Send size={12} />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              disabled={!hasAnswer}
              className="flex items-center gap-1.5 font-sans text-[11px] tracking-[0.18em] uppercase text-tan hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-2 py-1.5"
            >
              <span className="hidden sm:inline">Volgende</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </motion.div>
    </main>
  );
}
