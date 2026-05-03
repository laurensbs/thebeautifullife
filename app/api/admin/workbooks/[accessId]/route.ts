import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";

/**
 * GET /api/admin/workbooks/[accessId]
 *
 * Geef alle antwoorden + meta van één werkboek-toegang. Voor read-only
 * inzage door Marion in admin paneel.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ accessId: string }> }
) {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { accessId: idParam } = await params;
  const accessId = Number(idParam);
  if (!Number.isFinite(accessId)) {
    return NextResponse.json({ error: "Ongeldig id" }, { status: 400 });
  }

  const accessRows = await sql`
    SELECT wa.id, wa.workbook_slug, wa.created_at, wa.last_seen_at,
           s.first_name, s.contact, s.id AS submission_id
    FROM workbook_access wa
    JOIN submissions s ON s.id = wa.submission_id
    WHERE wa.id = ${accessId}
    LIMIT 1
  `;
  if (accessRows.length === 0) {
    return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  }
  const access = accessRows[0];

  const answerRows = await sql`
    SELECT field_key, value, updated_at
    FROM workbook_answers
    WHERE access_id = ${accessId}
    ORDER BY field_key
  `;
  const answers: Record<string, string> = {};
  for (const r of answerRows) {
    answers[String(r.field_key)] = String(r.value ?? "");
  }

  return NextResponse.json({
    access_id: Number(access.id),
    submission_id: Number(access.submission_id),
    workbook_slug: String(access.workbook_slug),
    created_at: String(access.created_at),
    last_seen_at: access.last_seen_at ? String(access.last_seen_at) : null,
    customer: {
      first_name: String(access.first_name ?? ""),
      email: String(access.contact ?? ""),
    },
    answers,
  });
}
