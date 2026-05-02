"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  BookOpen,
  Sparkles,
  Video,
} from "lucide-react";
import HeartDraw from "@/components/ui/HeartDraw";

type Item =
  | {
      kind: "upcoming_call";
      whenLabel: string;
      meetingUrl: string | null;
    }
  | {
      kind: "resume_workbook";
      title: string;
      slug: string;
      accessToken: string | null;
      pct: number;
    }
  | {
      kind: "start_workbook";
      title: string;
      slug: string;
      accessToken: string | null;
    }
  | { kind: "book_call" }
  | { kind: "explore" };

export default function TodayCard({
  firstName,
  item,
}: {
  firstName: string;
  item: Item;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-page-soft rounded-tl-[40px] rounded-tr-[40px] rounded-b-[6px] shadow-[0_18px_48px_rgba(60,50,30,0.08)] overflow-hidden"
    >
      <span className="absolute top-0 left-0 right-0 h-0.5 bg-tan" />

      <div className="px-6 py-7 sm:px-12 sm:py-10">
        <div className="flex items-start gap-4">
          <div className="flex-none w-12 h-12 rounded-full bg-tan/15 text-tan flex items-center justify-center">
            <ItemIcon item={item} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-script text-tan text-2xl">
              {greet()}, {firstName}
            </p>
            <h2 className="font-serif font-medium text-xl sm:text-2xl tracking-[0.06em] text-ink mt-1">
              {headline(item)}
            </h2>
            <p className="text-ink-soft text-[14px] leading-[1.85] mt-3 max-w-md">
              {body(item)}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {primaryCta(item)}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2.5 text-tan/60 justify-end">
          <span className="h-px w-10 bg-tan/40" />
          <HeartDraw size={11} />
          <span className="h-px w-10 bg-tan/40" />
        </div>
      </div>
    </motion.section>
  );
}

function ItemIcon({ item }: { item: Item }) {
  if (item.kind === "upcoming_call") return <CalendarClock size={20} />;
  if (item.kind === "resume_workbook") return <BookOpen size={20} />;
  if (item.kind === "start_workbook") return <BookOpen size={20} />;
  if (item.kind === "book_call") return <CalendarClock size={20} />;
  return <Sparkles size={20} />;
}

function greet() {
  const h = new Date().getHours();
  if (h < 12) return "goedemorgen";
  if (h < 18) return "welkom terug";
  return "goedenavond";
}

function headline(item: Item): string {
  switch (item.kind) {
    case "upcoming_call":
      return "Je call met Marion staat klaar";
    case "resume_workbook":
      return `${item.title} — ga verder`;
    case "start_workbook":
      return `Begin met ${item.title}`;
    case "book_call":
      return "Plan een 1-op-1 met Marion";
    case "explore":
      return "Welkom in jouw pad";
  }
}

function body(item: Item): string {
  switch (item.kind) {
    case "upcoming_call":
      return `${item.whenLabel}. We hebben 60 minuten samen — neem rustig de tijd om je voor te bereiden.`;
    case "resume_workbook":
      return `${item.pct}% afgerond. Pak het op waar je was — alles wat je schreef staat er nog.`;
    case "start_workbook":
      return "Een werkboek is een meeting met jezelf. Neem 20 minuten en begin zacht — alles wordt automatisch bewaard.";
    case "book_call":
      return "Wanneer je klaar bent voor een verdiepende stap. Een 60-minuten Teams-call met Marion voor €125.";
    case "explore":
      return "Hier vind je je werkboeken, je voortgang en alle afspraken op één plek.";
  }
}

function primaryCta(item: Item) {
  if (item.kind === "upcoming_call") {
    return (
      <>
        {item.meetingUrl ? (
          <a
            href={item.meetingUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 bg-ink hover:brightness-110 text-white px-5 py-3 rounded-[3px] font-sans text-xs tracking-[0.22em] uppercase transition shadow-[0_6px_18px_rgba(60,50,30,0.12)]"
          >
            <Video size={12} /> Open Teams
          </a>
        ) : (
          <span className="text-[11px] tracking-[0.18em] uppercase text-muted">
            Marion stuurt je de link
          </span>
        )}
      </>
    );
  }
  if (item.kind === "resume_workbook" || item.kind === "start_workbook") {
    const href = item.accessToken
      ? `/werkboek/${item.slug}?token=${item.accessToken}`
      : `/werkboek/login?slug=${item.slug}`;
    return (
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 bg-tan hover:brightness-95 text-white px-5 py-3 rounded-[3px] font-sans text-xs tracking-[0.22em] uppercase transition shadow-[0_6px_18px_rgba(60,50,30,0.12)] hover:-translate-y-0.5"
      >
        {item.kind === "resume_workbook" ? "Verder" : "Open"}{" "}
        <ArrowRight size={12} />
      </Link>
    );
  }
  if (item.kind === "book_call") {
    return (
      <Link
        href="/boek-call"
        className="inline-flex items-center gap-1.5 bg-tan hover:brightness-95 text-white px-5 py-3 rounded-[3px] font-sans text-xs tracking-[0.22em] uppercase transition shadow-[0_6px_18px_rgba(60,50,30,0.12)] hover:-translate-y-0.5"
      >
        Plan een call <ArrowRight size={12} />
      </Link>
    );
  }
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 bg-sage hover:bg-sage-deep text-white px-5 py-3 rounded-[3px] font-sans text-xs tracking-[0.22em] uppercase transition shadow-[0_6px_18px_rgba(60,50,30,0.12)] hover:-translate-y-0.5"
    >
      Bekijk de pakketten <ArrowRight size={12} />
    </Link>
  );
}
