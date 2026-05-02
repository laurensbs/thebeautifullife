"use client";

import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import "./workbook.css";
import type { Workbook, WorkbookPage, Block } from "@/lib/workbooks/types";
import { tx } from "@/lib/workbooks/types";
import type { Locale } from "@/lib/i18n/types";
import { DICT } from "@/lib/i18n/dict";
import { tr } from "@/lib/i18n/types";
import AudioCueIcon from "./AudioCueIcon";
import WorkbookField from "./WorkbookField";

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

  // remember per-user preference for next visit
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
          {/* Locale switcher */}
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

function SaveIndicator({
  state,
  locale,
}: {
  state: SaveState;
  locale: Locale;
}) {
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
          <span className="h">♡</span>
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
  const centered = page.layout === "centered";
  return (
    <section className={`wb-page ${centered ? "wb-page--center" : ""}`}>
      <div className="wb-brand">{page.brand ? tx(page.brand, locale) : brand}</div>
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
          <span className="h">♡</span>
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
    .replace(/_([^_\n]+)_/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}
