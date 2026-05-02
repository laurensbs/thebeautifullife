"use client";

import { useState } from "react";
import { Printer, LogOut } from "lucide-react";
import "./workbook.css";
import type { Workbook, WorkbookPage, Block } from "@/lib/workbooks/types";
import AudioCueIcon from "./AudioCueIcon";
import WorkbookField from "./WorkbookField";

type SaveState = "idle" | "saving" | "saved";

export default function WorkbookView({
  workbook,
  firstName,
  initialAnswers,
}: {
  workbook: Workbook;
  firstName: string;
  initialAnswers: Record<string, string>;
}) {
  const [save, setSave] = useState<SaveState>("idle");

  return (
    <div className="wb">
      <div className="wb-toolbar">
        <p className="wb-toolbar__greet">Welkom terug, {firstName}</p>
        <div className="wb-toolbar__actions">
          <SaveIndicator state={save} />
          <a href="/mijn-pad" className="wb-btn wb-btn--ghost">
            ← Mijn pad
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="wb-btn wb-btn--ghost"
          >
            Print / PDF
          </button>
          <a href="/api/workbook/logout" className="wb-btn">
            <LogOut size={11} style={{ marginRight: 6, verticalAlign: -1 }} />
            Uitloggen
          </a>
        </div>
      </div>

      <div className="wb-book">
        <CoverPage workbook={workbook} />
        {workbook.pages.map((page) => (
          <PageView
            key={page.number}
            page={page}
            brand={workbook.brand}
            answers={initialAnswers}
            onSaveStateChange={setSave}
          />
        ))}
      </div>
    </div>
  );
}

function SaveIndicator({ state }: { state: SaveState }) {
  const cls =
    state === "saving" ? "wb-save wb-save--saving" : state === "saved" ? "wb-save wb-save--saved" : "wb-save";
  const label = state === "saving" ? "Opslaan…" : state === "saved" ? "Opgeslagen" : "Auto-saved";
  // Position relative to toolbar instead of absolute
  return (
    <span className={cls} style={{ position: "static" }}>
      <span className="dot" /> {label}
    </span>
  );
}

function CoverPage({ workbook }: { workbook: Workbook }) {
  const c = workbook.cover;
  return (
    <section className="wb-page wb-cover">
      <div className="frame">
        <p className="wb-cover__top">{c.eyebrow}</p>
        <div>
          <h1 className="wb-cover__title">
            {c.title.map((t, i) => (
              <span key={i}>
                {t}
                {i < c.title.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <div className="wb-cover__script">{c.script}</div>
        </div>
        <div className="wb-rule wb-rule--center wb-rule--long">
          <span className="l" />
          <span className="h">♡</span>
          <span className="l" />
        </div>
        <p className="wb-cover__sub">{c.sub}</p>
        <p className="wb-cover__scriptsub">{c.scriptSub}</p>
        <div className="wb-cover__author">
          {c.author}
          <small>{c.role}</small>
        </div>
      </div>
    </section>
  );
}

function PageView({
  page,
  brand,
  answers,
  onSaveStateChange,
}: {
  page: WorkbookPage;
  brand: string;
  answers: Record<string, string>;
  onSaveStateChange: (s: SaveState) => void;
}) {
  const centered = page.layout === "centered";
  return (
    <section className={`wb-page ${centered ? "wb-page--center" : ""}`}>
      <div className="wb-brand">{page.brand ?? brand}</div>
      <div className="wb-page__inner">
        {page.blocks.map((b, i) => (
          <BlockView
            key={i}
            block={b}
            centered={centered}
            answers={answers}
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
  onSaveStateChange,
}: {
  block: Block;
  centered: boolean;
  answers: Record<string, string>;
  onSaveStateChange: (s: SaveState) => void;
}) {
  switch (block.type) {
    case "kicker":
      return <p className="wb-kicker">{block.text}</p>;

    case "eyebrow":
      return <p className="wb-eyebrow">{block.text}</p>;

    case "title": {
      const sizeCls = `wb-title wb-title--${block.size ?? "md"}`;
      const lines = block.lines ?? [block.text];
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
          <span className="h">♡</span>
          {block.align !== "left" && <span className="l" />}
        </div>
      );
    }

    case "audioCue":
      return (
        <p className="wb-audio">
          <AudioCueIcon />
          {block.text}
        </p>
      );

    case "lead": {
      const cls =
        "wb-lead" +
        (block.center || centered ? " wb-lead--center" : "") +
        (block.airy ? " wb-lead--airy" : "");
      return (
        <div className={cls}>
          {block.paragraphs.map((p, i) => (
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
          {block.text}
        </p>
      );

    case "breath":
      return <p className="wb-breath">{block.text}</p>;

    case "questions":
      return (
        <ul className="wb-questions">
          {block.items.map((it, i) => (
            <li key={i}>
              <span className="dot" />
              {it}
            </li>
          ))}
        </ul>
      );

    case "field":
      return (
        <WorkbookField
          fieldKey={block.key}
          initialValue={answers[block.key] ?? ""}
          placeholder={block.placeholder}
          size={block.size}
          onSaveStateChange={onSaveStateChange}
        />
      );

    case "spacer":
      return <div style={{ height: block.height ?? 16 }} />;

    case "ctaCard":
      return (
        <div className="wb-cta">
          <p className="wb-cta__leaf">{block.eyebrow}</p>
          <p className="wb-title wb-title--sm" style={{ marginTop: 6 }}>
            {block.title}
          </p>
          <p
            className="wb-lead wb-lead--center"
            style={{ marginTop: 14, fontSize: 13.5 }}
          >
            {block.body.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < block.body.split("\n").length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      );

    case "signature":
      return (
        <div className="wb-signature">
          <p className="wb-signature__name">{block.name}</p>
          <p className="wb-signature__role">{block.role}</p>
        </div>
      );

    default:
      return null;
  }
}

// Replace _word_ with <em>word</em> and escape HTML.
function renderInline(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .replace(/_([^_\n]+)_/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}
