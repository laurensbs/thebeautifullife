import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { setWorkbookCookie, WORKBOOK_COOKIE } from "@/lib/workbook-auth";

// Zelfde prefetch-tolerantie als /api/client/login/consume.
const REUSE_WINDOW_MS = 5 * 60_000;

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const origin = request.nextUrl.origin;

  if (!token) {
    return NextResponse.redirect(`${origin}/werkboek/login?error=invalid`);
  }

  const rows = await sql`
    SELECT id, email, expires_at, consumed_at
    FROM workbook_magic_links WHERE token = ${token}
    LIMIT 1
  `;
  if (rows.length === 0) {
    return NextResponse.redirect(`${origin}/werkboek/login?error=invalid`);
  }
  const link = rows[0];

  // Hard expiry
  const expiresAt = new Date(link.expires_at).getTime();
  if (expiresAt < Date.now()) {
    return NextResponse.redirect(`${origin}/werkboek/login?error=expired`);
  }

  // Soft consume — prefetch-tolerant
  if (link.consumed_at) {
    const consumedAt = new Date(link.consumed_at).getTime();
    if (Date.now() - consumedAt > REUSE_WINDOW_MS) {
      return NextResponse.redirect(`${origin}/werkboek/login?error=expired`);
    }
  } else {
    await sql`UPDATE workbook_magic_links SET consumed_at = NOW() WHERE id = ${link.id}`;
  }

  // Find the most recent workbook access for this email.
  const access = await sql`
    SELECT wa.access_token, wa.workbook_slug
    FROM workbook_access wa
    JOIN submissions s ON s.id = wa.submission_id
    WHERE LOWER(s.contact) = ${String(link.email).toLowerCase()}
    ORDER BY wa.created_at DESC
    LIMIT 1
  `;
  if (access.length === 0) {
    return NextResponse.redirect(`${origin}/werkboek/login?error=noaccess`);
  }

  await setWorkbookCookie(String(access[0].access_token));

  // Cookie ook in redirect-jar voor consistentie.
  const res = NextResponse.redirect(`${origin}/werkboek/${access[0].workbook_slug}`);
  res.cookies.set(WORKBOOK_COOKIE, String(access[0].access_token), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
