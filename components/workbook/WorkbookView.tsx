"use client";

import { useState, useEffect, useRef } from "react";
import { LogOut } from "lucide-react";
import "./workbook.css";
import type { Workbook, WorkbookPage, Block } from "@/lib/workbooks/types";
import { tx } from "@/lib/workbooks/types";
import type { Locale } from "@/lib/i18n/types";
import { DICT } from "@/lib/i18n/dict";
import { tr } from "@/lib/i18n/types";
import AudioCueIcon from "./AudioCueIcon";
import WorkbookField from "./WorkbookField";
import HeartDraw from "@/components/ui/HeartDraw";

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

  return (
    <div className="wb">
      <div className="wb-toolbar">
        <p className="wb-toolbar__greet">
          {tr(DICT.workbook.welcomeBack, locale)}
          {firstName}
        </p>
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

      <div className="wb-book">
        <CoverPage workbook={workbook} locale={locale} />
        {workbook.pages.map((page) => (
          <PageView
            key={page.number}
            page={page}
            brand={tx(workbook.brand, locale)}
            answers={initialAnswers}
            locale={locale}
            onSaveStateChange={setSave}
          />
        ))}
      </div>
    </div>
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

function CoverPage({ workbook, locale }: { workbook: Workbook; locale: Locale }) {
  const c = workbook.cover;
  const titleLines = tx(c.title, locale);
  const altText = workbook.imageAlt ? tx(workbook.imageAlt, locale) : "";
  return (
    <section className="wb-page wb-cover">
      <div className="frame">
        <p className="wb-cover__top">{tx(c.eyebrow, locale)}</p>

        {workbook.imageUrl && (
          <div className="wb-cover__img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={workbook.imageUrl} alt={altText} />
          </div>
        )}

        <div>
          <h1 className="wb-cover__title">
            {titleLines.map((t, i) => (
              <span key={i}>
                {t}
                {i < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <div className="wb-cover__script">{tx(c.script, locale)}</div>
        </div>
        <div className="wb-rule wb-rule--center wb-rule--long">
          <span className="l" />
          <span className="h" aria-hidden style={{ display: "inline-flex" }}><HeartDraw size={13} /></span>
          <span className="l" />
        </div>
        <p className="wb-cover__sub">{tx(c.sub, locale)}</p>
        <p className="wb-cover__scriptsub">{tx(c.scriptSub, locale)}</p>
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
}: {
  page: WorkbookPage;
  brand: string;
  answers: Record<string, string>;
  locale: Locale;
  onSaveStateChange: (s: SaveState) => void;
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
}: {
  block: Block;
  centered: boolean;
  answers: Record<string, string>;
  locale: Locale;
  onSaveStateChange: (s: SaveState) => void;
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
