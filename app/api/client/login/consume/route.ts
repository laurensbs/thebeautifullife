import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { createClientSession, setClientCookie } from "@/lib/client-auth";

/**
 * Een token mag binnen REUSE_WINDOW_MS na consumeren nog opnieuw
 * gebruikt worden — mits het oorspronkelijke `expires_at` nog niet
 * voorbij is. Reden: e-mail-clients (Outlook Safe Links, Apple Mail,
 * Microsoft 365 ATP, virusscanners) doen vaak een prefetch op links
 * vóór de klant klikt. Die prefetch consumeert de link, waarna de
 * klant "verlopen" zou krijgen.
 *
 * 5 minuten window is genoeg voor security-prefetch + menselijke klik,
 * en korter dan de oorspronkelijke 30min link-validity.
 */
const REUSE_WINDOW_MS = 5 * 60_000;

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

  // Hard expiry — als oorspronkelijke window voorbij is: altijd verlopen.
  const expiresAt = new Date(link.expires_at).getTime();
  if (expiresAt < Date.now()) {
    return NextResponse.redirect(`${origin}/mijn-pad/login?error=expired`);
  }

  // Soft consumed — prefetch-tolerant.
  if (link.consumed_at) {
    const consumedAt = new Date(link.consumed_at).getTime();
    if (Date.now() - consumedAt > REUSE_WINDOW_MS) {
      return NextResponse.redirect(`${origin}/mijn-pad/login?error=expired`);
    }
    // Anders: binnen het reuse-window, doorgaan zonder consumed_at te updaten.
  } else {
    await sql`UPDATE workbook_magic_links SET consumed_at = NOW() WHERE id = ${link.id}`;
  }

  const sessionToken = await createClientSession(String(link.email));
  await setClientCookie(sessionToken);

  return NextResponse.redirect(`${origin}/mijn-pad`);
}
