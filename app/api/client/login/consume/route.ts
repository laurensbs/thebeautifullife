import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { createClientSession, setClientCookie } from "@/lib/client-auth";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const origin = request.nextUrl.origin;

  if (!token) {
    return NextResponse.redirect(`${origin}/mijn-pad/login?error=invalid`);
  }

  const rows = await sql`
    SELECT id, email, expires_at, consumed_at
    FROM workbook_magic_links WHERE token = ${token}
    LIMIT 1
  `;
  if (rows.length === 0) {
    return NextResponse.redirect(`${origin}/mijn-pad/login?error=invalid`);
  }
  const link = rows[0];
  if (link.consumed_at || new Date(link.expires_at) < new Date()) {
    return NextResponse.redirect(`${origin}/mijn-pad/login?error=expired`);
  }

  await sql`UPDATE workbook_magic_links SET consumed_at = NOW() WHERE id = ${link.id}`;
  const sessionToken = await createClientSession(String(link.email));
  await setClientCookie(sessionToken);

  return NextResponse.redirect(`${origin}/mijn-pad`);
}
