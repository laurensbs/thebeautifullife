import { NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";

/**
 * GET /api/admin/email-status
 * Geeft aan of de SMTP-vars geconfigureerd zijn. Geen waarden zelf,
 * alleen presence-check. Alleen voor ingelogde admin.
 */
export async function GET() {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }
  return NextResponse.json({
    smtp_host: Boolean(process.env.SMTP_HOST),
    smtp_user: Boolean(process.env.SMTP_USER),
    smtp_pass: Boolean(process.env.SMTP_PASS),
    smtp_from: Boolean(process.env.SMTP_FROM),
    smtp_port: process.env.SMTP_PORT || "465 (default)",
    node_env: process.env.NODE_ENV,
  });
}
