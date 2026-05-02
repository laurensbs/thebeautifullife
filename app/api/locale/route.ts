import { NextRequest, NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n/types";
import { LOCALE_COOKIE } from "@/lib/i18n/server";

export async function POST(request: NextRequest) {
  const { locale } = await request.json().catch(() => ({}));
  if (!isLocale(locale)) {
    return NextResponse.json({ error: "invalid locale" }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return res;
}
