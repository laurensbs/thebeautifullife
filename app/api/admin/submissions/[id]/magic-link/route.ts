import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sql } from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { id } = await params;
  const submissionId = Number(id);

  const rows = await sql`SELECT contact FROM submissions WHERE id = ${submissionId} LIMIT 1`;
  if (rows.length === 0) {
    return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  }
  const email = String(rows[0].contact).toLowerCase();
  const linkToken = "client:" + crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dagen — dit is een door-Marion-gedeelde link

  await sql`
    INSERT INTO workbook_magic_links (email, token, expires_at)
    VALUES (${email}, ${linkToken}, ${expires})
  `;

  const origin = request.nextUrl.origin;
  const url = `${origin}/api/client/login/consume?token=${linkToken}`;

  return NextResponse.json({ url, expires_at: expires.toISOString() });
}
