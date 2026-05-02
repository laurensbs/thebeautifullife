import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { setWorkbookCookie } from "@/lib/workbook-auth";

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

  if (link.consumed_at || new Date(link.expires_at) < new Date()) {
    return NextResponse.redirect(`${origin}/werkboek/login?error=expired`);
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

  await sql`UPDATE workbook_magic_links SET consumed_at = NOW() WHERE id = ${link.id}`;
  await setWorkbookCookie(String(access[0].access_token));

  return NextResponse.redirect(`${origin}/werkboek/${access[0].workbook_slug}`);
}
