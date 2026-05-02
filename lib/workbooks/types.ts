// Each workbook page is a small DSL of blocks.
// Strings are Translatable so the renderer can pick the locale at render time.

import type { Locale } from "@/lib/i18n/types";

export type Translatable<T = string> = { nl: T; en: T };

export const tx = <T,>(value: Translatable<T>, locale: Locale): T =>
  value[locale] ?? value.nl;

export type Block =
  | { type: "kicker"; text: Translatable }
  | { type: "eyebrow"; text: Translatable }
  | {
      type: "title";
      text: Translatable;
      size?: "xl" | "lg" | "md" | "sm";
      lines?: Translatable<string[]>;
    }
  | { type: "rule"; align?: "center" | "left"; long?: boolean }
  | { type: "audioCue"; text: Translatable }
  | { type: "lead"; paragraphs: Translatable<string[]>; center?: boolean; airy?: boolean }
  | { type: "scriptLine"; text: Translatable; size?: number }
  | { type: "breath"; text: Translatable }
  | { type: "questions"; items: Translatable<string[]> }
  | {
      type: "field";
      key: string;
      placeholder?: Translatable;
      size?: "sm" | "md" | "lg" | "xl";
    }
  | { type: "spacer"; height?: number }
  | {
      type: "ctaCard";
      eyebrow: Translatable;
      title: Translatable;
      body: Translatable;
    }
  | { type: "signature"; name: string; role: Translatable };

export type WorkbookPage = {
  number: number;
  layout?: "default" | "centered" | "cover";
  brand?: Translatable;
  blocks: Block[];
};

export type Workbook = {
  slug: string;
  title: Translatable;
  scriptTitle: Translatable;
  brand: Translatable;
  imageUrl?: string; // optional cover imagery
  imageAlt?: Translatable;
  cover: {
    eyebrow: Translatable;
    title: Translatable<string[]>;
    script: Translatable;
    sub: Translatable;
    scriptSub: Translatable;
    author: string;
    role: Translatable;
  };
  pages: WorkbookPage[];
};
