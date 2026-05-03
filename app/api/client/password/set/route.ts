import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { getClientSession } from "@/lib/client-auth";
import { setupDatabase } from "@/lib/setup-db";

/**
 * POST /api/client/password/set
 * body: { current_password?, new_password }
 *
 * Zet of wijzig wachtwoord. Vereist een actieve client-sessie. Als er al
 * een wachtwoord bestaat moet het oude meegegeven worden voor wijziging.
 */
export async function POST(request: NextRequest) {
  await setupDatabase().catch(() => {});

  const session = await getClientSession();
  if (!session) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const newPassword = String(body.new_password ?? "");
  const currentPassword = String(body.current_password ?? "");

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "Wachtwoord moet minimaal 8 tekens zijn." },
      { status: 400 }
    );
  }

  const email = session.email.toLowerCase();
  const existing = await sql`
    SELECT password_hash FROM client_passwords WHERE email = ${email} LIMIT 1
  `;

  // Als er al een wachtwoord is: oude moet kloppen om te wijzigen
  if (existing.length > 0) {
    if (!currentPassword) {
      return NextResponse.json(
        { error: "Vul je huidige wachtwoord in om te wijzigen." },
        { status: 400 }
      );
    }
    const ok = await bcrypt.compare(
      currentPassword,
      String(existing[0].password_hash)
    );
    if (!ok) {
      return NextResponse.json(
        { error: "Huidig wachtwoord klopt niet." },
        { status: 401 }
      );
    }
  }

  const hash = await bcrypt.hash(newPassword, 10);
  await sql`
    INSERT INTO client_passwords (email, password_hash, created_at, updated_at)
    VALUES (${email}, ${hash}, NOW(), NOW())
    ON CONFLICT (email)
    DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = NOW()
  `;

  return NextResponse.json({
    ok: true,
    new: existing.length === 0,
  });
}

/**
 * GET /api/client/password/set
 * Check of de ingelogde klant al een wachtwoord heeft (voor UI).
 */
export async function GET() {
  await setupDatabase().catch(() => {});
  const session = await getClientSession();
  if (!session) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }
  const email = session.email.toLowerCase();
  const rows = await sql`
    SELECT updated_at FROM client_passwords WHERE email = ${email} LIMIT 1
  `;
  return NextResponse.json({
    has_password: rows.length > 0,
    updated_at: rows[0]?.updated_at ?? null,
  });
}
