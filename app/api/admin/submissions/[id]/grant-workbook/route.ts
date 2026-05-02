import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getAuthFromCookies } from "@/lib/auth";
import { sql } from "@/lib/db";
import { getWorkbook } from "@/lib/workbooks";

/**
 * POST /api/admin/submissions/[id]/grant-workbook
 * body: { slug: string }
 *
 * Geeft een klant handmatig toegang tot een extra werkboek (bv. om
 * een pakket-1 klant ook From Noise to Structure te geven). Idempotent.
 */
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
  if (!Number.isFinite(submissionId)) {
    return NextResponse.json({ error: "Ongeldig id" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const slug = String(body.slug ?? "");
  if (!getWorkbook(slug)) {
    return NextResponse.json({ error: "Onbekend werkboek" }, { status: 400 });
  }

  // Check existing
  const existing = await sql`
    SELECT id, access_token FROM workbook_access
    WHERE submission_id = ${submissionId} AND workbook_slug = ${slug}
    LIMIT 1
  `;
  if (existing.length > 0) {
    return NextResponse.json({
      ok: true,
      existed: true,
      access_token: existing[0].access_token,
    });
  }

  const token = crypto.randomBytes(32).toString("hex");
  await sql`
    INSERT INTO workbook_access (submission_id, workbook_slug, access_token)
    VALUES (${submissionId}, ${slug}, ${token})
  `;

  return NextResponse.json({ ok: true, existed: false, access_token: token });
}
