import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { createClientSession, setClientCookie } from "@/lib/client-auth";
import { setupDatabase } from "@/lib/setup-db";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/client/login/password
 * body: { email, password }
 *
 * Login met wachtwoord. Als het klopt: set client_token cookie en
 * return success. Als niet: generieke fout (geen email-enumeratie).
 */
export async function POST(request: NextRequest) {
  await setupDatabase().catch(() => {});

  // IP rate-limit: 10 pogingen per 10 min per IP
  const ipLimited = await checkRateLimit(request, {
    bucket: "client-pwd-ip",
    max: 10,
    windowMs: 10 * 60_000,
  });
  if (ipLimited) return ipLimited;

  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email.includes("@") || !password) {
    return NextResponse.json(
      { error: "Vul je e-mailadres en wachtwoord in." },
      { status: 400 }
    );
  }

  // Email rate-limit: 5 pogingen per email per 10 min — voorkomt brute force
  const emailLimited = await checkRateLimit(request, {
    bucket: "client-pwd-email",
    identifier: email,
    max: 5,
    windowMs: 10 * 60_000,
  });
  if (emailLimited) return emailLimited;

  const rows = await sql`
    SELECT password_hash FROM client_passwords
    WHERE email = ${email} LIMIT 1
  `;

  // Generieke fout om niet te lekken of email bestaat
  const failMsg =
    "Onjuiste combinatie. Heb je nog geen wachtwoord? Log in via de mail-link.";

  if (rows.length === 0) {
    // Toch wat tijd verbranden om timing-attacks te voorkomen
    await bcrypt.compare(password, "$2a$10$invalidsalt00000000000000000000");
    return NextResponse.json({ error: failMsg }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, String(rows[0].password_hash));
  if (!ok) {
    return NextResponse.json({ error: failMsg }, { status: 401 });
  }

  // Check dat er ook een submission bestaat — anders is er geen portal-account
  const subs = await sql`
    SELECT id FROM submissions WHERE LOWER(contact) = ${email} LIMIT 1
  `;
  if (subs.length === 0) {
    return NextResponse.json({ error: failMsg }, { status: 401 });
  }

  const sessionToken = await createClientSession(email);
  await setClientCookie(sessionToken);
  return NextResponse.json({ ok: true });
}
