import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./types";

export const LOCALE_COOKIE = "tbl_locale";

export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  const fromCookie = c.get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) return fromCookie;

  // Fallback: Accept-Language header
  try {
    const h = await headers();
    const al = h.get("accept-language") ?? "";
    if (al.toLowerCase().startsWith("en")) return "en";
  } catch {}

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
