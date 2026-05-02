import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./types";

export const LOCALE_COOKIE = "tbl_locale";

/**
 * Bepaalt de locale voor de huidige request.
 *
 * Beleid: NL is altijd de primaire taal. We negeren Accept-Language
 * — anders zien EN-browsers Engels terwijl de site primair Nederlands
 * is. Klanten kunnen via de switcher EN kiezen; die keuze gaat in
 * een cookie die we hier respecteren.
 */
export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  const fromCookie = c.get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) return fromCookie;
  return DEFAULT_LOCALE;
}

export async function setLocaleCookie(locale: Locale) {
  const c = await cookies();
  c.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
