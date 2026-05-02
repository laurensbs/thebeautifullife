import { NextRequest, NextResponse } from "next/server";
import {
  getSessionByToken,
  setWorkbookCookie,
  WORKBOOK_COOKIE,
} from "@/lib/workbook-auth";

/**
 * GET /api/workbook/access?token=…&slug=…
 *
 * Verbruikt een direct werkboek-access token uit een mail-link, zet
 * de cookie via een route handler (server-component mag geen cookies
 * setten in Next 15+), en redirect terug naar het werkboek.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const slug = request.nextUrl.searchParams.get("slug") ?? "";
  const origin = request.nextUrl.origin;

  if (!token || !slug) {
    return NextResponse.redirect(`${origin}/werkboek/login`);
  }

  const session = await getSessionByToken(token);
  if (!session || session.workbookSlug !== slug) {
    return NextResponse.redirect(`${origin}/werkboek/login?slug=${slug}&error=invalid`);
  }

  await setWorkbookCookie(token);

  // Cookie is nu gezet — verstuur ook in de redirect response zelf
  // zodat de browser 'm direct heeft (next/headers cookies().set()
  // werkt in route handlers, maar de NextResponse.redirect cookie-jar
  // is nog veiliger voor consistent gedrag).
  const res = NextResponse.redirect(`${origin}/werkboek/${slug}`);
  res.cookies.set(WORKBOOK_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
