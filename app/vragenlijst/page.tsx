"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Leaf, Heart, ChevronRight, ChevronLeft, Send, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <Suspense
      fallback={
        <div className="min-h-screen bg-page flex items-center justify-center">
          <Leaf className="text-accent animate-spin" size={32} strokeWidth={1.2} />
        </div>
      }
    >
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
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (!token) {
      setError("Geen geldige link. Controleer je e-mail voor de juiste link.");
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
          setAnswers(data.questions.map((q: Question) => ({ questionId: q.id })));
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
        setDone(true);
      } else {
        setError("Er ging iets mis bij het versturen.");
      }
    } catch {
      setError("Verbindingsfout. Probeer het opnieuw.");
    }
    setSubmitting(false);
  };

  const isLast = current === questions.length - 1;
  const currentAnswer = answers[current];
  const hasAnswer =
    currentAnswer &&
    ((currentAnswer.text && currentAnswer.text.trim().length > 0) ||
      currentAnswer.scale !== undefined);

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

  if (done) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
            <Check className="text-accent" size={28} />
          </div>
          <h1 className="font-serif text-dark text-3xl md:text-4xl font-light mb-4">
            Dankjewel{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="font-sans text-brown text-sm leading-relaxed mb-6">
            Je antwoorden zijn veilig ontvangen. Marion neemt binnenkort persoonlijk
            contact met je op.
          </p>
          <p className="font-script text-accent text-2xl">je eerste stap is gezet</p>
          <Heart className="text-accent fill-accent mx-auto mt-6" size={14} strokeWidth={0} />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center px-5">
        <div className="text-center max-w-md">
          <Leaf className="text-accent mx-auto mb-4" size={28} strokeWidth={1.2} />
          <p className="font-sans text-brown text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="min-h-screen bg-page flex flex-col">
      {/* Header */}
      <header className="px-5 py-5 md:py-6 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-2">
          <Leaf className="text-accent" size={20} strokeWidth={1.2} />
          <span className="font-serif text-dark text-xs italic tracking-wide">
            the beautiful life
          </span>
        </div>
        <span className="font-sans text-taupe text-xs tracking-wider">
          {current + 1} / {questions.length}
        </span>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 bg-border/30">
        <motion.div
          className="h-full bg-accent"
          initial={false}
          animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>

      {/* Question */}
      <main className="flex-1 flex items-center justify-center px-5 py-8 md:py-12">
        <div className="w-full max-w-xl">
          {current === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-sans text-taupe text-xs tracking-widest uppercase mb-8 text-center"
            >
              Welkom {firstName}
            </motion.p>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <h2 className="font-serif text-dark text-xl md:text-2xl lg:text-[1.75rem] font-light text-center leading-snug mb-8 md:mb-10">
                {q.question_text}
              </h2>

              {/* Open text */}
              {q.question_type === "open" && (
                <textarea
                  value={currentAnswer?.text || ""}
                  onChange={(e) => updateAnswer(e.target.value)}
                  placeholder="Neem de tijd om na te denken..."
                  rows={4}
                  className="w-full max-w-lg bg-card border border-border/60 rounded-xl px-5 py-4 font-sans text-dark text-sm leading-relaxed placeholder:text-taupe/60 placeholder:italic focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
                />
              )}

              {/* Scale (1-10) */}
              {q.question_type === "scale" && (
                <div className="flex flex-col items-center gap-4 w-full max-w-lg">
                  <div className="flex gap-2 md:gap-3 flex-wrap justify-center">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <motion.button
                        key={n}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateAnswer(n)}
                        className={`w-10 h-10 md:w-11 md:h-11 rounded-full font-sans text-sm transition-colors ${
                          currentAnswer?.scale === n
                            ? "bg-accent text-white"
                            : "bg-card border border-border/60 text-brown hover:border-accent/40"
                        }`}
                      >
                        {n}
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex justify-between w-full max-w-xs text-xs text-taupe font-sans">
                    <span>helemaal niet</span>
                    <span>heel erg</span>
                  </div>
                </div>
              )}

              {/* Multiple choice */}
              {q.question_type === "choice" && q.options && (
                <div className="flex flex-col gap-3 w-full max-w-lg">
                  {(q.options as string[]).map((opt) => (
                    <motion.button
                      key={opt}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => updateAnswer(opt)}
                      className={`w-full text-left px-5 py-3.5 rounded-xl font-sans text-sm transition-colors ${
                        currentAnswer?.text === opt
                          ? "bg-accent/10 border-2 border-accent text-dark"
                          : "bg-card border border-border/60 text-brown hover:border-accent/40"
                      }`}
                    >
                      {opt}
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Navigation */}
      <footer className="px-5 py-5 md:py-6 border-t border-border/50 flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={current === 0}
          className="flex items-center gap-1.5 font-sans text-sm text-brown disabled:opacity-30 disabled:cursor-not-allowed hover:text-accent transition-colors"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Vorige</span>
        </button>

        {isLast ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={submit}
            disabled={submitting}
            className="flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded-lg font-sans text-sm tracking-wider uppercase disabled:opacity-50"
          >
            {submitting ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Leaf size={16} />
              </motion.div>
            ) : (
              <>
                Verstuur
                <Send size={14} />
              </>
            )}
          </motion.button>
        ) : (
          <button
            onClick={goNext}
            className="flex items-center gap-1.5 font-sans text-sm text-accent hover:text-dark transition-colors"
          >
            <span className="hidden sm:inline">Volgende</span>
            <ChevronRight size={16} />
          </button>
        )}
      </footer>
    </div>
  );
}
