"use client";

import type { Workbook, Block, WorkbookPage } from "@/lib/workbooks/types";
import { tx } from "@/lib/workbooks/types";

/**
 * Read-only weergave van een volledig werkboek met klant-antwoorden.
 * Eenvoudig, gestructureerd, zonder edit-controls. Marion scrollt door.
 */
export default function AdminWorkbookReader({
  workbook,
  answers,
}: {
  workbook: Workbook;
  answers: Record<string, string>;
}) {
  return (
    <div className="space-y-5">
      {workbook.pages.map((page) => (
        <PageBlock key={page.number} page={page} answers={answers} />
      ))}
    </div>
  );
}

function PageBlock({
  page,
  answers,
}: {
  page: WorkbookPage;
  answers: Record<string, string>;
}) {
  // Skip part-divider pages (decoratief, geen content om in te zien)
  if (page.layout === "part") {
    return (
      <div className="bg-page-soft/40 border border-line/40 rounded-md px-6 py-5 text-center text-ink-soft">
        <p className="font-script text-tan text-xl">
          {page.partScript ? tx(page.partScript, "nl") : ""}
        </p>
        <h3 className="font-serif text-lg tracking-[0.06em] uppercase text-ink mt-1">
          {page.partTitle ? tx(page.partTitle, "nl") : ""}
        </h3>
      </div>
    );
  }

  return (
    <section className="bg-page-soft rounded-[6px] shadow-[0_4px_16px_rgba(60,50,30,0.04)] px-5 py-5 sm:px-7 sm:py-6">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-line/40">
        <p className="text-[10px] tracking-[0.32em] uppercase text-muted">
          Pagina {page.number}
          {page.chapter ? ` · ${tx(page.chapter, "nl")}` : ""}
        </p>
      </div>
      <div className="space-y-3">
        {page.blocks.map((block, i) => (
          <BlockView key={i} block={block} answers={answers} />
        ))}
      </div>
    </section>
  );
}

function BlockView({
  block,
  answers,
}: {
  block: Block;
  answers: Record<string, string>;
}) {
  switch (block.type) {
    case "kicker":
      return (
        <p className="font-script text-tan text-xl leading-snug">
          {tx(block.text, "nl")}
        </p>
      );
    case "eyebrow":
      return (
        <p className="text-[10px] tracking-[0.28em] uppercase text-muted">
          {tx(block.text, "nl")}
        </p>
      );
    case "title": {
      const lines = block.lines ? tx(block.lines, "nl") : null;
      return (
        <h2 className="font-serif font-medium text-xl sm:text-2xl tracking-[0.04em] text-ink leading-tight">
          {lines ? lines.join(" ") : tx(block.text, "nl")}
        </h2>
      );
    }
    case "rule":
      return <div className="h-px bg-line/60 my-1" />;
    case "audioCue":
      return (
        <p className="text-[12px] tracking-[0.18em] uppercase text-tan italic">
          ♪ {tx(block.text, "nl")}
        </p>
      );
    case "lead":
      return (
        <div className="space-y-2">
          {tx(block.paragraphs, "nl").map((p, i) => (
            <p
              key={i}
              className="text-ink-soft text-[14px] leading-[1.85] italic font-serif"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(p) }}
            />
          ))}
        </div>
      );
    case "scriptLine":
      return (
        <p
          className="font-script text-tan"
          style={{ fontSize: block.size ?? 28 }}
        >
          {tx(block.text, "nl")}
        </p>
      );
    case "breath":
      return (
        <p className="text-[13px] italic text-tan border-l-2 border-tan/40 pl-3">
          {tx(block.text, "nl")}
        </p>
      );
    case "letter":
      return (
        <div className="space-y-2 italic font-serif text-ink-soft text-[14px] leading-[1.85] bg-page/40 border border-line/40 rounded p-4">
          {tx(block.paragraphs, "nl").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {block.signoff && (
            <p className="text-tan font-script text-base mt-2">
              {tx(block.signoff, "nl")}
            </p>
          )}
        </div>
      );
    case "questions":
      return (
        <ul className="space-y-1.5 text-[13.5px] text-ink-soft">
          {tx(block.items, "nl").map((q, i) => (
            <li key={i}>· {q}</li>
          ))}
        </ul>
      );
    case "field":
      return <FieldAnswer block={block} answers={answers} />;
    case "twoCol":
      return (
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <p className="text-[11px] tracking-[0.18em] uppercase text-muted mb-1.5">
              {tx(block.left.head, "nl")}
            </p>
            <FieldAnswer block={{ type: "field", ...block.left.field }} answers={answers} />
          </div>
          <div>
            <p className="text-[11px] tracking-[0.18em] uppercase text-muted mb-1.5">
              {tx(block.right.head, "nl")}
            </p>
            <FieldAnswer block={{ type: "field", ...block.right.field }} answers={answers} />
          </div>
        </div>
      );
    case "scaleGroup":
      return (
        <div className="space-y-1.5">
          {block.items.map((item) => {
            const value = answers[item.key];
            return (
              <div
                key={item.key}
                className="flex items-center justify-between gap-3 py-1.5 px-3 bg-white/40 border border-line/40 rounded text-[13px]"
              >
                <span className="text-ink-soft">{tx(item.label, "nl")}</span>
                <span
                  className={`font-serif font-medium ${
                    value
                      ? "text-tan text-base"
                      : "text-muted/60 italic text-[12px]"
                  }`}
                >
                  {value ? `${value} / ${block.max ?? 10}` : "—"}
                </span>
              </div>
            );
          })}
        </div>
      );
    case "checks": {
      const raw = answers[block.key] ?? "";
      const checked = new Set(raw.split("|").filter(Boolean));
      return (
        <ul className="space-y-1 text-[13px] text-ink-soft">
          {tx(block.items, "nl").map((it, i) => (
            <li key={i} className="flex items-start gap-2">
              <span
                className={
                  checked.has(it)
                    ? "text-tan font-medium"
                    : "text-muted/50"
                }
              >
                {checked.has(it) ? "✓" : "○"}
              </span>
              <span className={checked.has(it) ? "text-ink" : "text-muted/70"}>
                {it}
              </span>
            </li>
          ))}
        </ul>
      );
    }
    case "wheelOfLife": {
      const items = tx(block.items, "nl");
      return (
        <div className="grid sm:grid-cols-2 gap-1.5">
          {items.map((label, i) => {
            const value = answers[`${block.key}__${i}`] ?? answers[block.key] ?? "";
            return (
              <div
                key={i}
                className="flex items-center justify-between gap-3 py-1.5 px-3 bg-white/40 border border-line/40 rounded text-[13px]"
              >
                <span className="text-ink-soft">{label}</span>
                <span className="font-serif font-medium text-tan">
                  {value || "—"}
                </span>
              </div>
            );
          })}
        </div>
      );
    }
    case "tracker30": {
      const raw = answers[block.key] ?? "";
      const days = raw.split("|");
      const filled = days.filter((d) => d === "1").length;
      return (
        <div className="bg-white/40 border border-line/40 rounded p-3">
          <p className="text-[12px] text-muted mb-2">
            {block.habitLabel ? tx(block.habitLabel, "nl") : "30-dagen tracker"} —
            <span className="text-tan font-medium ml-1">{filled}/30 dagen</span>
          </p>
          <div className="grid grid-cols-15 sm:grid-cols-30 gap-0.5" style={{ gridTemplateColumns: "repeat(15, 1fr)" }}>
            {Array.from({ length: 30 }, (_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-sm ${
                  days[i] === "1" ? "bg-tan" : "bg-line/40"
                }`}
                title={`Dag ${i + 1}`}
              />
            ))}
          </div>
        </div>
      );
    }
    case "weekLog": {
      const days = tx(block.days, "nl");
      const rows = tx(block.rows, "nl");
      return (
        <div className="bg-white/40 border border-line/40 rounded p-3 overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="text-muted">
                <th className="text-left font-normal pr-2"></th>
                {days.map((d) => (
                  <th key={d} className="font-normal text-center px-1">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="text-ink-soft">
                  <td className="py-1 pr-2 text-[11px]">{row}</td>
                  {days.map((d) => {
                    const v = answers[`${block.key}__${ri}__${d}`] ?? "";
                    return (
                      <td key={d} className="text-center px-1">
                        <span className={v ? "text-ink" : "text-muted/40"}>
                          {v || "·"}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case "valuesPicker": {
      const raw = answers[block.key] ?? "";
      const picked = raw.split("|").filter(Boolean);
      return (
        <div>
          <p className="text-[11px] text-muted mb-1.5">
            {block.pickedHead
              ? tx(block.pickedHead, "nl")
              : "Gekozen waarden"}{" "}
            ({picked.length})
          </p>
          {picked.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {picked.map((v) => (
                <span
                  key={v}
                  className="inline-block bg-tan/10 border border-tan/40 text-tan px-2 py-0.5 rounded text-[12px]"
                >
                  {v}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-muted italic text-[12px]">— nog niet gekozen —</p>
          )}
        </div>
      );
    }
    case "callout":
      return (
        <div
          className={`rounded-md px-4 py-3 text-[13px] border ${
            block.tone === "tan"
              ? "bg-tan/10 border-tan/30"
              : block.tone === "sage"
                ? "bg-sage/10 border-sage/30"
                : "bg-page/60 border-line/40"
          }`}
        >
          <p className="text-[10px] tracking-[0.22em] uppercase text-muted mb-1">
            {tx(block.label, "nl")}
          </p>
          <p
            className="text-ink-soft leading-[1.7]"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(tx(block.body, "nl")) }}
          />
        </div>
      );
    case "calloutList":
      return (
        <div className="space-y-2">
          {block.items.map((it, i) => (
            <div
              key={i}
              className={`rounded-md px-3 py-2 text-[13px] border ${
                block.tone === "tan"
                  ? "bg-tan/10 border-tan/30"
                  : block.tone === "sage"
                    ? "bg-sage/10 border-sage/30"
                    : "bg-page/60 border-line/40"
              }`}
            >
              <p className="font-medium text-ink">{tx(it.label, "nl")}</p>
              <p
                className="text-ink-soft text-[12.5px] mt-1 leading-[1.7]"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(tx(it.body, "nl")),
                }}
              />
            </div>
          ))}
        </div>
      );
    case "spacer":
      return <div style={{ height: block.height ?? 8 }} />;
    case "ctaCard":
      return (
        <div className="bg-page-dark/40 border border-line/40 rounded p-4 text-center">
          <p className="text-[11px] text-tan tracking-[0.22em] uppercase">
            {tx(block.eyebrow, "nl")}
          </p>
          <p className="font-serif text-lg text-ink mt-1">
            {tx(block.title, "nl")}
          </p>
          <p className="text-[12px] text-ink-soft mt-1">
            {tx(block.body, "nl")}
          </p>
        </div>
      );
    case "signature":
      return (
        <p className="text-[12px] text-ink-soft italic">
          — {block.name}, {tx(block.role, "nl")}
        </p>
      );
    default:
      return null;
  }
}

function FieldAnswer({
  block,
  answers,
}: {
  block: Extract<Block, { type: "field" }>;
  answers: Record<string, string>;
}) {
  const value = answers[block.key];
  if (!value || !value.trim()) {
    return (
      <p className="text-[12px] text-muted italic bg-page/40 border border-line/40 border-dashed rounded p-2.5">
        — nog niet ingevuld —
      </p>
    );
  }
  return (
    <p className="text-[14px] text-ink leading-[1.75] bg-white/60 border-l-2 border-tan/60 pl-3 py-2 whitespace-pre-wrap">
      {value}
    </p>
  );
}

/** Strip simpele markdown (** __ * _) en behoud whitespace. */
function renderMarkdown(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}
