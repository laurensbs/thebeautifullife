"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { LogOut, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import "./workbook.css";
import type { Workbook, WorkbookPage, Block } from "@/lib/workbooks/types";
import { tx } from "@/lib/workbooks/types";
import { workbookFieldKeys } from "@/lib/workbooks";
import type { Locale } from "@/lib/i18n/types";
import { DICT } from "@/lib/i18n/dict";
import { tr } from "@/lib/i18n/types";
import AudioCueIcon from "./AudioCueIcon";
import WorkbookField from "./WorkbookField";
import HeartDraw from "@/components/ui/HeartDraw";
import BrandLogo from "@/components/ui/BrandLogo";

type SaveState = "idle" | "saving" | "saved";

export default function WorkbookView({
  workbook,
  firstName,
  initialAnswers,
  initialLocale,
}: {
  workbook: Workbook;
  firstName: string;
  initialAnswers: Record<string, string>;
  initialLocale: Locale;
}) {
  const [save, setSave] = useState<SaveState>("idle");
  const [locale, setLocale] = useState<Locale>(initialLocale);
  // step: -1 = welkomst, 0..pages.length-1 = pagina, pages.length = summary
  const [step, setStep] = useState<number>(-1);
  // direction: +1 = vooruit, -1 = terug — bestuurt slide-richting
  const [direction, setDirection] = useState<1 | -1>(1);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("workbook_lang");
      if (saved === "nl" || saved === "en") setLocale(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("workbook_lang", locale);
    } catch {}
  }, [locale]);

  // Onthou waar de klant gebleven was per workbook-slug.
  const stepKey = `wb_step_${workbook.slug}`;
  useEffect(() => {
    try {
      const saved = localStorage.getItem(stepKey);
      if (saved !== null) setStep(Number(saved));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(stepKey, String(step));
    } catch {}
  }, [step, stepKey]);

  const allFieldKeys = workbookFieldKeys(workbook);
  const filledCount = allFieldKeys.filter(
    (k) => (answers[k] ?? "").trim().length > 0
  ).length;
  const pct =
    allFieldKeys.length > 0
      ? Math.round((filledCount / allFieldKeys.length) * 100)
      : 0;

  const totalSteps = workbook.pages.length;
  const isCover = step === -1;
  const isSummary = step === totalSteps;
  const visibleStepLabel = isCover
    ? tr(DICT.common.optional, locale) === "optional" ? "Welcome" : "Welkom"
    : isSummary
      ? tr(DICT.common.optional, locale) === "optional" ? "Overview" : "Overzicht"
      : `${step + 1} / ${totalSteps}`;

  const goNext = () => {
    if (step < totalSteps) {
      setDirection(1);
      setStep(step + 1);
    }
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goPrev = () => {
    if (step > -1) {
      setDirection(-1);
      setStep(step - 1);
    }
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goTo = (n: number) => {
    setDirection(n >= step ? 1 : -1);
    setStep(n);
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onAnswerChange = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const isEN = locale === "en";

  return (
    <div className="wb">
      {/* Toolbar */}
      <div className="wb-toolbar">
        <div className="wb-toolbar__brand">
          <BrandLogo size="sm" />
          <p className="wb-toolbar__greet wb-toolbar__greet--small">
            {tr(DICT.workbook.welcomeBack, locale)}
            {firstName}
          </p>
        </div>
        <div className="wb-toolbar__actions">
          <span className="wb-locale">
            <button
              type="button"
              onClick={() => setLocale("nl")}
              className={locale === "nl" ? "is-active" : ""}
              aria-current={locale === "nl"}
            >
              NL
            </button>
            <span className="sep">·</span>
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={locale === "en" ? "is-active" : ""}
              aria-current={locale === "en"}
            >
              EN
            </button>
          </span>

          <SaveIndicator state={save} locale={locale} />
          <a href="/mijn-pad" className="wb-btn wb-btn--ghost">
            {tr(DICT.workbook.backToPortal, locale)}
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="wb-btn wb-btn--ghost"
          >
            {tr(DICT.workbook.print, locale)}
          </button>
          <a href="/api/workbook/logout" className="wb-btn">
            <LogOut size={11} style={{ marginRight: 6, verticalAlign: -1 }} />
            {tr(DICT.common.logout, locale)}
          </a>
        </div>
      </div>

      {/* App-mode (paginated) — wordt verborgen tijdens print */}
      <div className="wb-app">
        {/* Sticky progress */}
        <div className="wb-progress">
          <div className="wb-progress__inner">
            <div className="wb-progress__meta">
              <span className="wb-progress__step">{visibleStepLabel}</span>
              <span className="wb-progress__pct">
                {pct}% {isEN ? "filled" : "ingevuld"}
              </span>
            </div>
            <div className="wb-progress__bar">
              <div
                className="wb-progress__fill"
                style={{
                  width: isCover
                    ? "0%"
                    : isSummary
                      ? "100%"
                      : `${((step + 1) / totalSteps) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="wb-book wb-book--paginated">
          <AnimatePresence mode="wait">
            {isCover ? (
              <motion.div
                key="cover"
                initial={{ opacity: 0, x: direction * 40, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: direction * -40, filter: "blur(4px)" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <CoverPage workbook={workbook} locale={locale} firstName={firstName} />
                <CoverIntro
                  locale={locale}
                  totalPages={totalSteps}
                  hasProgress={filledCount > 0}
                  onStart={() => goTo(0)}
                  onResume={() => {
                    // Pak de eerste niet-volledig ingevulde page (rough heuristic)
                    let resumeAt = 0;
                    for (let i = 0; i < workbook.pages.length; i++) {
                      const fields = workbook.pages[i].blocks
                        .filter((b): b is Block & { type: "field"; key: string } =>
                          b.type === "field"
                        )
                        .map((b) => b.key);
                      if (fields.length === 0) continue;
                      const allFilled = fields.every(
                        (k) => (answers[k] ?? "").trim().length > 0
                      );
                      if (!allFilled) {
                        resumeAt = i;
                        break;
                      }
                      resumeAt = i + 1;
                    }
                    goTo(Math.min(resumeAt, totalSteps - 1));
                  }}
                />
              </motion.div>
            ) : isSummary ? (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: direction * 40, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: direction * -40, filter: "blur(4px)" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <SummaryView
                  workbook={workbook}
                  answers={answers}
                  locale={locale}
                  onJumpTo={goTo}
                  onPrint={() => window.print()}
                  workbookSlug={workbook.slug}
                  firstName={firstName}
                />
              </motion.div>
            ) : (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: direction * 40, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: direction * -40, filter: "blur(4px)" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <PageView
                  page={workbook.pages[step]}
                  brand={tx(workbook.brand, locale)}
                  answers={answers}
                  locale={locale}
                  onSaveStateChange={setSave}
                  onAnswerChange={onAnswerChange}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {!isCover && (
            <div className="wb-nav">
              <button
                type="button"
                onClick={goPrev}
                className="wb-nav-btn wb-nav-btn--ghost"
              >
                <ChevronLeft size={14} />
                {isEN ? "Previous" : "Vorige"}
              </button>
              <span className="wb-nav__counter">
                {visibleStepLabel}
              </span>
              {isSummary ? (
                <a href="/mijn-pad" className="wb-nav-btn">
                  {isEN ? "Done" : "Klaar"} <Check size={14} />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={goNext}
                  className="wb-nav-btn"
                >
                  {step === totalSteps - 1
                    ? isEN
                      ? "Overview"
                      : "Overzicht"
                    : isEN
                      ? "Next"
                      : "Volgende"}
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Print-only: alle pagina's onder elkaar (oude rendering) */}
      <div className="wb-book wb-book--print-only">
        <CoverPage workbook={workbook} locale={locale} firstName={firstName} />
        {workbook.pages.map((page) => (
          <PageView
            key={page.number}
            page={page}
            brand={tx(workbook.brand, locale)}
            answers={answers}
            locale={locale}
            onSaveStateChange={setSave}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Cover-intro met "begin" / "verder" knoppen ───────────────────────
function CoverIntro({
  locale,
  totalPages,
  hasProgress,
  onStart,
  onResume,
}: {
  locale: Locale;
  totalPages: number;
  hasProgress: boolean;
  onStart: () => void;
  onResume: () => void;
}) {
  const isEN = locale === "en";
  return (
    <section className="wb-page" style={{ marginTop: 18 }}>
      <div className="wb-page__inner" style={{ alignItems: "center", textAlign: "center", justifyContent: "center" }}>
        <p className="wb-kicker">
          {isEN ? "ready when you are" : "wanneer jij eraan toe bent"}
        </p>
        <h2 className="wb-title wb-title--md" style={{ marginTop: 14 }}>
          {isEN ? "Take 20 minutes for yourself" : "Neem 20 minuten voor jezelf"}
        </h2>
        <div className="wb-rule wb-rule--center">
          <span className="l" />
          <span className="h" aria-hidden style={{ display: "inline-flex" }}>
            <HeartDraw size={13} />
          </span>
          <span className="l" />
        </div>
        <p
          className="wb-lead wb-lead--center wb-lead--airy"
          style={{ maxWidth: 460, marginTop: 14 }}
        >
          {isEN
            ? `${totalPages} pages of reflection. Move at your own pace — your answers are saved automatically.`
            : `${totalPages} pagina's van reflectie. Op jouw tempo — je antwoorden worden automatisch bewaard.`}
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 32,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {hasProgress && (
            <button
              type="button"
              onClick={onResume}
              className="wb-btn"
              style={{ padding: "14px 22px", fontSize: 12 }}
            >
              {isEN ? "Continue where I left off" : "Verder waar ik was"}
            </button>
          )}
          <button
            type="button"
            onClick={onStart}
            className={hasProgress ? "wb-btn wb-btn--ghost" : "wb-btn"}
            style={{ padding: "14px 22px", fontSize: 12 }}
          >
            {hasProgress
              ? isEN
                ? "Start from the beginning"
                : "Begin opnieuw vanaf het begin"
              : isEN
                ? "Begin"
                : "Beginnen"}
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Eind-overzicht met al je antwoorden ───────────────────────────────
function SummaryView({
  workbook,
  answers,
  locale,
  onJumpTo,
  onPrint,
  workbookSlug,
  firstName,
}: {
  workbook: Workbook;
  answers: Record<string, string>;
  locale: Locale;
  onJumpTo: (n: number) => void;
  onPrint: () => void;
  workbookSlug: string;
  firstName: string;
}) {
  const isEN = locale === "en";

  // Gegroepeerd per part — een part-divider start een nieuwe sectie.
  type Entry = {
    pageIndex: number;
    pageTitle: string;
    label?: string;
    value: string;
  };
  type PartGroup = {
    title: string | null;
    script: string | null;
    entries: Entry[];
  };

  const groups: PartGroup[] = [{ title: null, script: null, entries: [] }];
  workbook.pages.forEach((page, i) => {
    if (page.layout === "part") {
      groups.push({
        title: page.partTitle ? tx(page.partTitle, locale) : null,
        script: page.partScript ? tx(page.partScript, locale) : null,
        entries: [],
      });
      return;
    }
    let pageTitle = "";
    for (const b of page.blocks) {
      if (b.type === "title") {
        pageTitle = tx(b.text, locale);
        break;
      }
    }
    if (!pageTitle) pageTitle = `${isEN ? "Page" : "Pagina"} ${page.number}`;

    const cur = groups[groups.length - 1];
    for (const b of page.blocks) {
      if (b.type === "field") {
        const v = (answers[b.key] ?? "").trim();
        if (v) cur.entries.push({ pageIndex: i, pageTitle, value: v });
      }
      if (b.type === "twoCol") {
        for (const side of [b.left, b.right]) {
          const v = (answers[side.field.key] ?? "").trim();
          if (v)
            cur.entries.push({
              pageIndex: i,
              pageTitle,
              label: tx(side.head, locale),
              value: v,
            });
        }
      }
    }
  });

  const populatedGroups = groups.filter((g) => g.entries.length > 0);
  const today = new Date().toLocaleDateString(isEN ? "en-GB" : "nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="wb-page wb-summary">
      <div className="wb-page__inner">
        {/* Documentkop */}
        <div className="wb-summary__head">
          <p className="wb-kicker">
            {isEN ? "your reflection" : "jouw reflectie"}
          </p>
          <h2 className="wb-summary__name">{firstName}</h2>
          <p className="wb-summary__date">{today}</p>
          <div className="wb-rule wb-rule--center wb-rule--long">
            <span className="l" />
            <span className="h" aria-hidden style={{ display: "inline-flex" }}>
              <HeartDraw size={13} />
            </span>
            <span className="l" />
          </div>
          <p className="wb-summary__intro">
            {isEN
              ? "Below is everything you wrote. Tap any passage to revisit it. Save as PDF or print when you're ready to take it with you."
              : "Hieronder vind je alles wat je hebt opgeschreven. Klik op een passage om terug te gaan. Bewaar als PDF of print wanneer je het mee wil nemen."}
          </p>
        </div>

        {populatedGroups.length === 0 ? (
          <p className="wb-lead" style={{ color: "var(--color-muted)", marginTop: 24 }}>
            {isEN
              ? "You haven't written anything yet."
              : "Je hebt nog niets opgeschreven."}
          </p>
        ) : (
          <div className="wb-summary__parts">
            {populatedGroups.map((g, gi) => (
              <div key={gi} className="wb-summary__part">
                {g.title && (
                  <div className="wb-summary__part-head">
                    <p className="wb-summary__part-script">
                      {g.script ?? ""}
                    </p>
                    <h3 className="wb-summary__part-title">{g.title}</h3>
                  </div>
                )}
                <div className="wb-summary__entries">
                  {g.entries.map((e, ei) => (
                    <button
                      key={ei}
                      type="button"
                      onClick={() => onJumpTo(e.pageIndex)}
                      className="wb-summary-card wb-summary-card--quote"
                    >
                      <p className="wb-summary-card__label">
                        {e.pageTitle}
                        {e.label ? ` · ${e.label}` : ""}
                      </p>
                      <p className="wb-summary-card__value">{e.value}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Marion's afsluiter */}
        <div className="wb-summary__signoff">
          <p className="wb-summary__signoff-text">
            {isEN
              ? "What you wrote here is yours. Read it back. Pause. Notice what shifted. I see you in the next step."
              : "Wat je hier hebt opgeschreven is van jou. Lees het terug. Sta even stil. Merk op wat er bewogen is. Tot in de volgende stap."}
          </p>
          <p className="wb-summary__signoff-name">Marion Lubach</p>
          <p className="wb-summary__signoff-role">
            {isEN ? "your creative lifestyle mentor" : "jouw creatief levensmentor"}
          </p>
        </div>

        {/* Acties */}
        <div className="wb-summary__actions">
          <a
            href={`/api/workbook/pdf?slug=${encodeURIComponent(workbookSlug)}`}
            download
            className="wb-btn"
            style={{ padding: "14px 26px", fontSize: 11 }}
          >
            {isEN ? "Download as PDF" : "Download als PDF"}
          </a>
          <button
            type="button"
            onClick={onPrint}
            className="wb-btn wb-btn--ghost"
            style={{ padding: "14px 26px", fontSize: 11 }}
          >
            {isEN ? "Print" : "Print"}
          </button>
        </div>
      </div>
    </section>
  );
}

function SaveIndicator({ state, locale }: { state: SaveState; locale: Locale }) {
  const cls =
    state === "saving"
      ? "wb-save wb-save--saving"
      : state === "saved"
        ? "wb-save wb-save--saved"
        : "wb-save";
  const label =
    state === "saving"
      ? tr(DICT.common.saving, locale)
      : state === "saved"
        ? tr(DICT.common.saved, locale)
        : tr(DICT.common.autoSaved, locale);
  return (
    <span className={cls} style={{ position: "static" }}>
      <span className="dot" /> {label}
    </span>
  );
}

function CoverPage({
  workbook,
  locale,
  firstName,
}: {
  workbook: Workbook;
  locale: Locale;
  firstName: string;
}) {
  const c = workbook.cover;
  const titleLines = tx(c.title, locale);
  const altText = workbook.imageAlt ? tx(workbook.imageAlt, locale) : "";
  const isEN = locale === "en";

  return (
    <section className="wb-page wb-cover wb-cover--book">
      {/* Full-bleed image als achtergrond, gradient-overlay zorgt voor leesbaarheid */}
      {workbook.imageUrl && (
        <div className="wb-cover__hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={workbook.imageUrl} alt={altText} />
          <div className="wb-cover__veil" />
        </div>
      )}

      {/* Tekst in de onderhelft, valt deels over de image */}
      <div className="wb-cover__body">
        <p className="wb-cover__top">{tx(c.eyebrow, locale)}</p>

        <h1 className="wb-cover__title">
          {titleLines.map((t, i) => (
            <span key={i}>
              {t}
              {i < titleLines.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <div className="wb-cover__script">{tx(c.script, locale)}</div>

        <div className="wb-rule wb-rule--center wb-rule--long">
          <span className="l" />
          <span className="h" aria-hidden style={{ display: "inline-flex" }}>
            <HeartDraw size={13} />
          </span>
          <span className="l" />
        </div>

        <p className="wb-cover__sub">{tx(c.sub, locale)}</p>
        <p className="wb-cover__scriptsub">{tx(c.scriptSub, locale)}</p>

        {firstName && (
          <div className="wb-cover__personal">
            <span className="wb-cover__personal-label">
              {isEN ? "for" : "voor"}
            </span>
            <span className="wb-cover__personal-name">{firstName}</span>
            <span className="wb-cover__personal-date">
              {new Date().toLocaleDateString(isEN ? "en-GB" : "nl-NL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        )}

        <div className="wb-cover__author">
          {c.author}
          <small>{tx(c.role, locale)}</small>
        </div>
      </div>
    </section>
  );
}

function PageView({
  page,
  brand,
  answers,
  locale,
  onSaveStateChange,
  onAnswerChange,
}: {
  page: WorkbookPage;
  brand: string;
  answers: Record<string, string>;
  locale: Locale;
  onSaveStateChange: (s: SaveState) => void;
  onAnswerChange?: (key: string, value: string) => void;
}) {
  // Part divider page is its own layout
  if (page.layout === "part") {
    return (
      <section className="wb-page wb-page--part">
        <div className="wb-brand">{page.brand ? tx(page.brand, locale) : brand}</div>
        <div className="wb-page__inner">
          {page.partRoman && <p className="wb-part__roman">{tx(page.partRoman, locale)}</p>}
          {page.partTitle && (
            <h2 className="wb-part__title">{tx(page.partTitle, locale)}</h2>
          )}
          {page.partScript && (
            <p className="wb-part__script">{tx(page.partScript, locale)}</p>
          )}
          <div className="wb-rule wb-rule--center">
            <span className="l" />
            <span className="h" aria-hidden style={{ display: "inline-flex" }}><HeartDraw size={13} /></span>
            <span className="l" />
          </div>
          {page.partLead && (
            <p className="wb-lead wb-lead--center wb-part__lead">
              {tx(page.partLead, locale)}
            </p>
          )}
        </div>
        <div className="wb-num">{String(page.number).padStart(2, "0")}</div>
      </section>
    );
  }

  const centered = page.layout === "centered";
  return (
    <section className={`wb-page ${centered ? "wb-page--center" : ""}`}>
      <div className="wb-brand">{page.brand ? tx(page.brand, locale) : brand}</div>
      {page.chapter && <div className="wb-chapter">{tx(page.chapter, locale)}</div>}
      <div className="wb-page__inner">
        {page.blocks.map((b, i) => (
          <BlockView
            key={i}
            block={b}
            centered={centered}
            answers={answers}
            locale={locale}
            onSaveStateChange={onSaveStateChange}
            onAnswerChange={onAnswerChange}
          />
        ))}
      </div>
      <div className="wb-num">{String(page.number).padStart(2, "0")}</div>
    </section>
  );
}

function BlockView({
  block,
  centered,
  answers,
  locale,
  onSaveStateChange,
  onAnswerChange,
}: {
  block: Block;
  centered: boolean;
  answers: Record<string, string>;
  locale: Locale;
  onSaveStateChange: (s: SaveState) => void;
  onAnswerChange?: (key: string, value: string) => void;
}) {
  switch (block.type) {
    case "kicker":
      return <p className="wb-kicker">{tx(block.text, locale)}</p>;

    case "eyebrow":
      return <p className="wb-eyebrow">{tx(block.text, locale)}</p>;

    case "title": {
      const sizeCls = `wb-title wb-title--${block.size ?? "md"}`;
      const lines = block.lines ? tx(block.lines, locale) : [tx(block.text, locale)];
      return (
        <h2 className={sizeCls} style={{ marginTop: 18 }}>
          {lines.map((l, i) => (
            <span key={i}>
              {l}
              {i < lines.length - 1 && <br />}
            </span>
          ))}
        </h2>
      );
    }

    case "rule": {
      const cls =
        "wb-rule " +
        (block.align === "left" ? "wb-rule--left" : "wb-rule--center") +
        (block.long ? " wb-rule--long" : "");
      return (
        <div className={cls}>
          <span className="l" />
          <span className="h" aria-hidden style={{ display: "inline-flex" }}><HeartDraw size={13} /></span>
          {block.align !== "left" && <span className="l" />}
        </div>
      );
    }

    case "audioCue":
      return (
        <p className="wb-audio">
          <AudioCueIcon />
          {tx(block.text, locale)}
        </p>
      );

    case "lead": {
      const cls =
        "wb-lead" +
        (block.center || centered ? " wb-lead--center" : "") +
        (block.airy ? " wb-lead--airy" : "");
      const ps = tx(block.paragraphs, locale);
      return (
        <div className={cls}>
          {ps.map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: renderInline(p) }} />
          ))}
        </div>
      );
    }

    case "scriptLine":
      return (
        <p
          className="wb-script"
          style={{ fontSize: block.size ?? 28, marginTop: 10 }}
        >
          {tx(block.text, locale)}
        </p>
      );

    case "breath":
      return <p className="wb-breath">{tx(block.text, locale)}</p>;

    case "letter": {
      const ps = tx(block.paragraphs, locale);
      return (
        <div className="wb-letter">
          {ps.map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: renderInline(p) }} />
          ))}
          {block.signoff && (
            <p className="wb-letter__sign">{tx(block.signoff, locale)}</p>
          )}
        </div>
      );
    }

    case "questions": {
      const items = tx(block.items, locale);
      return (
        <ul className="wb-questions">
          {items.map((it, i) => (
            <li key={i}>
              <span className="dot" />
              {it}
            </li>
          ))}
        </ul>
      );
    }

    case "field":
      return (
        <WorkbookField
          fieldKey={block.key}
          initialValue={answers[block.key] ?? ""}
          placeholder={block.placeholder ? tx(block.placeholder, locale) : undefined}
          size={block.size}
          onSaveStateChange={onSaveStateChange}
          onValueChange={onAnswerChange}
        />
      );

    case "twoCol":
      return (
        <div className="wb-twocol">
          <div>
            <p className="wb-twocol__head">{tx(block.left.head, locale)}</p>
            <WorkbookField
              fieldKey={block.left.field.key}
              initialValue={answers[block.left.field.key] ?? ""}
              placeholder={
                block.left.field.placeholder
                  ? tx(block.left.field.placeholder, locale)
                  : undefined
              }
              size={block.left.field.size ?? "md"}
              onSaveStateChange={onSaveStateChange}
              onValueChange={onAnswerChange}
            />
          </div>
          <div>
            <p className="wb-twocol__head">{tx(block.right.head, locale)}</p>
            <WorkbookField
              fieldKey={block.right.field.key}
              initialValue={answers[block.right.field.key] ?? ""}
              placeholder={
                block.right.field.placeholder
                  ? tx(block.right.field.placeholder, locale)
                  : undefined
              }
              size={block.right.field.size ?? "md"}
              onSaveStateChange={onSaveStateChange}
              onValueChange={onAnswerChange}
            />
          </div>
        </div>
      );

    case "scaleGroup":
      return (
        <div className="wb-scales">
          {block.items.map((it) => (
            <ScaleRow
              key={it.key}
              fieldKey={it.key}
              label={tx(it.label, locale)}
              max={block.max ?? 10}
              initialValue={answers[it.key] ?? ""}
              onSaveStateChange={onSaveStateChange}
            />
          ))}
        </div>
      );

    case "checks":
      return (
        <CheckList
          fieldKey={block.key}
          items={tx(block.items, locale)}
          columns={block.columns ?? 1}
          initialValue={answers[block.key] ?? ""}
          onSaveStateChange={onSaveStateChange}
        />
      );

    case "wheelOfLife":
      return (
        <WheelOfLife
          fieldKey={block.key}
          items={tx(block.items, locale)}
          initialValue={answers[block.key] ?? ""}
          onSaveStateChange={onSaveStateChange}
        />
      );

    case "tracker30":
      return (
        <Tracker30
          fieldKey={block.key}
          habitLabel={
            block.habitLabel ? tx(block.habitLabel, locale) : undefined
          }
          initialValue={answers[block.key] ?? ""}
          onSaveStateChange={onSaveStateChange}
        />
      );

    case "weekLog":
      return (
        <WeekLog
          fieldKey={block.key}
          rows={tx(block.rows, locale)}
          days={tx(block.days, locale)}
          initialValue={answers[block.key] ?? ""}
          onSaveStateChange={onSaveStateChange}
        />
      );

    case "valuesPicker":
      return (
        <ValuesPicker
          fieldKey={block.key}
          pool={tx(block.pool, locale)}
          pickCount={block.pickCount ?? 5}
          pickedHead={
            block.pickedHead ? tx(block.pickedHead, locale) : undefined
          }
          initialValue={answers[block.key] ?? ""}
          onSaveStateChange={onSaveStateChange}
        />
      );

    case "callout":
      return (
        <div className={`wb-callout wb-callout--${block.tone}`}>
          <span className="wb-callout__label">{tx(block.label, locale)}</span>
          <span dangerouslySetInnerHTML={{ __html: renderInline(tx(block.body, locale)) }} />
        </div>
      );

    case "calloutList":
      return (
        <>
          {block.items.map((it, i) => (
            <div key={i} className={`wb-callout wb-callout--${block.tone}`}>
              <span className="wb-callout__label">{tx(it.label, locale)}</span>
              <span dangerouslySetInnerHTML={{ __html: renderInline(tx(it.body, locale)) }} />
            </div>
          ))}
        </>
      );

    case "spacer":
      return <div style={{ height: block.height ?? 16 }} />;

    case "ctaCard": {
      const body = tx(block.body, locale);
      return (
        <div className="wb-cta">
          <p className="wb-cta__leaf">{tx(block.eyebrow, locale)}</p>
          <p className="wb-title wb-title--sm" style={{ marginTop: 6 }}>
            {tx(block.title, locale)}
          </p>
          <p
            className="wb-lead wb-lead--center"
            style={{ marginTop: 14, fontSize: 13.5 }}
          >
            {body.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      );
    }

    case "signature":
      return (
        <div className="wb-signature">
          <p className="wb-signature__name">{block.name}</p>
          <p className="wb-signature__role">{tx(block.role, locale)}</p>
        </div>
      );

    default:
      return null;
  }
}

function renderInline(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/_([^_\n]+)_/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

// ─── Interactive sub-components ─────────────────────────────────────────

function useDebouncedSave(
  fieldKey: string,
  value: string,
  onSaveStateChange?: (s: SaveState) => void
) {
  const lastSaved = useRef<string>(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (value === lastSaved.current) return;
    onSaveStateChange?.("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/workbook/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ field_key: fieldKey, value }),
        });
        if (res.ok) {
          lastSaved.current = value;
          onSaveStateChange?.("saved");
        } else {
          onSaveStateChange?.("idle");
        }
      } catch {
        onSaveStateChange?.("idle");
      }
    }, 800);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, fieldKey]);
}

function ScaleRow({
  fieldKey,
  label,
  max,
  initialValue,
  onSaveStateChange,
}: {
  fieldKey: string;
  label: string;
  max: number;
  initialValue: string;
  onSaveStateChange: (s: SaveState) => void;
}) {
  const [value, setValue] = useState(initialValue);
  useDebouncedSave(fieldKey, value, onSaveStateChange);
  const current = Number(value) || 0;
  return (
    <div className="wb-scale">
      <span className="wb-scale__label">{label}</span>
      <div className="wb-scale__dots">
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n}`}
            onClick={() => setValue(String(n))}
            className={`wb-scale__dot ${n <= current ? "is-active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

function CheckList({
  fieldKey,
  items,
  columns,
  initialValue,
  onSaveStateChange,
}: {
  fieldKey: string;
  items: string[];
  columns: 1 | 2;
  initialValue: string;
  onSaveStateChange: (s: SaveState) => void;
}) {
  const initial = (() => {
    try {
      const arr = JSON.parse(initialValue);
      if (Array.isArray(arr)) return new Set<number>(arr.map(Number));
    } catch {}
    return new Set<number>();
  })();
  const [checked, setChecked] = useState<Set<number>>(initial);
  const value = JSON.stringify([...checked]);
  useDebouncedSave(fieldKey, value, onSaveStateChange);
  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };
  return (
    <ul className={`wb-checks wb-checks--cols-${columns}`}>
      {items.map((it, i) => (
        <li
          key={i}
          className={checked.has(i) ? "is-checked" : ""}
          onClick={() => toggle(i)}
        >
          <span className="box" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function WheelOfLife({
  fieldKey,
  items,
  initialValue,
  onSaveStateChange,
}: {
  fieldKey: string;
  items: string[];
  initialValue: string;
  onSaveStateChange: (s: SaveState) => void;
}) {
  const initial = (() => {
    try {
      const obj = JSON.parse(initialValue);
      if (obj && typeof obj === "object") return obj as Record<string, number>;
    } catch {}
    return {} as Record<string, number>;
  })();
  const [scores, setScores] = useState<Record<string, number>>(initial);
  const value = JSON.stringify(scores);
  useDebouncedSave(fieldKey, value, onSaveStateChange);

  return (
    <>
      <div className="wb-wheel-wrap">
        <svg viewBox="0 0 240 240" width="220" height="220" aria-hidden>
          <g stroke="#D9CFBE" strokeWidth="1" fill="none">
            <circle cx="120" cy="120" r="100" />
            <circle cx="120" cy="120" r="80" />
            <circle cx="120" cy="120" r="60" />
            <circle cx="120" cy="120" r="40" />
            <circle cx="120" cy="120" r="20" />
          </g>
          <g stroke="#B6906A" strokeWidth="1" opacity="0.6">
            <line x1="120" y1="20" x2="120" y2="220" />
            <line x1="20" y1="120" x2="220" y2="120" />
            <line x1="49" y1="49" x2="191" y2="191" />
            <line x1="191" y1="49" x2="49" y2="191" />
          </g>
        </svg>
      </div>
      <div className="wb-wheel-areas">
        {items.map((label, i) => (
          <div key={i} className="wb-wheel-row">
            <span>{label}</span>
            <input
              type="number"
              min={1}
              max={10}
              value={scores[label] ?? ""}
              onChange={(e) => {
                const v = Number(e.target.value);
                setScores((prev) => {
                  const next = { ...prev };
                  if (!Number.isFinite(v) || v < 1) delete next[label];
                  else next[label] = Math.min(10, Math.max(1, v));
                  return next;
                });
              }}
              placeholder="—"
            />
          </div>
        ))}
      </div>
    </>
  );
}

function Tracker30({
  fieldKey,
  habitLabel,
  initialValue,
  onSaveStateChange,
}: {
  fieldKey: string;
  habitLabel?: string;
  initialValue: string;
  onSaveStateChange: (s: SaveState) => void;
}) {
  const parsed = (() => {
    try {
      const obj = JSON.parse(initialValue);
      if (obj && typeof obj === "object") return obj as { habit?: string; days?: number[] };
    } catch {}
    return {} as { habit?: string; days?: number[] };
  })();
  const [habit, setHabit] = useState(parsed.habit ?? "");
  const [days, setDays] = useState<Set<number>>(new Set(parsed.days ?? []));
  const value = JSON.stringify({ habit, days: [...days] });
  useDebouncedSave(fieldKey, value, onSaveStateChange);

  return (
    <>
      {habitLabel && (
        <p className="wb-eyebrow" style={{ marginTop: 14 }}>
          {habitLabel}
        </p>
      )}
      <input
        type="text"
        value={habit}
        onChange={(e) => setHabit(e.target.value)}
        placeholder="…"
        style={{
          width: "100%",
          border: "none",
          borderBottom: "1px solid var(--color-tan)",
          background: "transparent",
          padding: "8px 0",
          fontFamily: "var(--font-serif)",
          fontSize: 16,
          color: "var(--color-ink)",
          outline: "none",
          marginBottom: 12,
        }}
      />
      <div className="wb-tracker">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() =>
              setDays((prev) => {
                const next = new Set(prev);
                if (next.has(n)) next.delete(n);
                else next.add(n);
                return next;
              })
            }
            className={`wb-tracker__cell ${days.has(n) ? "is-done" : ""}`}
          >
            {n}
          </button>
        ))}
      </div>
    </>
  );
}

const MOOD_CYCLE = ["·", "☀", "☁", "☂", "✦", "♡", "✕"];

function WeekLog({
  fieldKey,
  rows,
  days,
  initialValue,
  onSaveStateChange,
}: {
  fieldKey: string;
  rows: string[];
  days: string[];
  initialValue: string;
  onSaveStateChange: (s: SaveState) => void;
}) {
  // Stored as { "row-day": "value" }
  const initial = (() => {
    try {
      const obj = JSON.parse(initialValue);
      if (obj && typeof obj === "object") return obj as Record<string, string>;
    } catch {}
    return {} as Record<string, string>;
  })();
  const [grid, setGrid] = useState<Record<string, string>>(initial);
  const value = JSON.stringify(grid);
  useDebouncedSave(fieldKey, value, onSaveStateChange);

  const cycle = (k: string) => {
    setGrid((prev) => {
      const cur = prev[k] ?? "·";
      const next = MOOD_CYCLE[(MOOD_CYCLE.indexOf(cur) + 1) % MOOD_CYCLE.length];
      return { ...prev, [k]: next };
    });
  };

  return (
    <div className="wb-weeklog">
      <div />
      {days.map((d, i) => (
        <div key={i} className="wb-weeklog__head">
          {d}
        </div>
      ))}
      {rows.flatMap((rowLabel, ri) => [
        <div key={`l-${ri}`} className="wb-weeklog__row-label">
          {rowLabel}
        </div>,
        ...days.map((_, di) => {
          const k = `${ri}-${di}`;
          return (
            <button
              key={k}
              type="button"
              className="wb-weeklog__cell"
              onClick={() => cycle(k)}
            >
              {grid[k] ?? "·"}
            </button>
          );
        }),
      ])}
    </div>
  );
}

function ValuesPicker({
  fieldKey,
  pool,
  pickCount,
  pickedHead,
  initialValue,
  onSaveStateChange,
}: {
  fieldKey: string;
  pool: string[];
  pickCount: number;
  pickedHead?: string;
  initialValue: string;
  onSaveStateChange: (s: SaveState) => void;
}) {
  const initial = (() => {
    try {
      const arr = JSON.parse(initialValue);
      if (Array.isArray(arr)) return arr as string[];
    } catch {}
    return [] as string[];
  })();
  const [picked, setPicked] = useState<string[]>(initial);
  const value = JSON.stringify(picked);
  useDebouncedSave(fieldKey, value, onSaveStateChange);

  const toggle = (w: string) => {
    setPicked((prev) => {
      if (prev.includes(w)) return prev.filter((x) => x !== w);
      if (prev.length >= pickCount) return prev;
      return [...prev, w];
    });
  };

  return (
    <>
      <div className="wb-values-pool">
        {pool.map((w, i) => (
          <span
            key={i}
            className={`word ${picked.includes(w) ? "is-picked" : ""}`}
            onClick={() => toggle(w)}
          >
            {w}
            {i < pool.length - 1 ? " · " : ""}
          </span>
        ))}
      </div>
      {pickedHead && (
        <p className="wb-eyebrow" style={{ marginTop: 18 }}>
          {pickedHead}
        </p>
      )}
      <ol className="wb-values-picked">
        {Array.from({ length: pickCount }, (_, i) => (
          <li key={i}>{picked[i] ?? ""}</li>
        ))}
      </ol>
    </>
  );
}
