export type Locale = "nl" | "en";

export const LOCALES: Locale[] = ["nl", "en"];
export const DEFAULT_LOCALE: Locale = "nl";

export const isLocale = (v: unknown): v is Locale =>
  v === "nl" || v === "en";

// A translatable string — every UI string in the dictionary uses this shape.
export type T = Record<Locale, string>;

// Helper: take a translatable and return the right string for the locale.
export function tr(value: T, locale: Locale): string {
  return value[locale] ?? value[DEFAULT_LOCALE];
}
