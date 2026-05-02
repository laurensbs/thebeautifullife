import { NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { sql } from "@/lib/db";
import { WORKBOOKS, workbookFieldKeys } from "@/lib/workbooks";

/**
 * GET /api/admin/workbooks
 * Per workbook-slug: alle klanten met access + voortgang.
 */
export async function GET() {
  try {
    const authed = await getAuthFromCookies();
    if (!authed) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    type Row = {
      access_id: number;
      submission_id: number;
      workbook_slug: string;
      access_token: string;
      created_at: string;
      last_seen_at: string | null;
      first_name: string;
      contact: string;
      filled: number;
    };

    const rows = (await sql`
      SELECT
        wa.id AS access_id,
        wa.submission_id,
        wa.workbook_slug,
        wa.access_token,
        wa.created_at,
        wa.last_seen_at,
        s.first_name,
        s.contact,
        (
          SELECT COUNT(*) FROM workbook_answers wn
          WHERE wn.access_id = wa.id
            AND COALESCE(LENGTH(TRIM(wn.value)), 0) > 0
        )::int AS filled
      FROM workbook_access wa
      JOIN submissions s ON s.id = wa.submission_id
      ORDER BY wa.last_seen_at DESC NULLS LAST, wa.created_at DESC
    `) as unknown as Row[];

    // Groepeer per workbook
    const grouped: Record<
      string,
      {
        slug: string;
        title: string;
        total_fields: number;
        clients: Array<{
          access_id: number;
          submission_id: number;
          first_name: string;
          email: string;
          access_token: string;
          created_at: string;
          last_seen_at: string | null;
          filled: number;
          pct: number;
        }>;
      }
    > = {};

    for (const wb of Object.values(WORKBOOKS)) {
      const totalFields = workbookFieldKeys(wb).length;
      grouped[wb.slug] = {
        slug: wb.slug,
        title: wb.title.nl,
        total_fields: totalFields,
        clients: [],
      };
    }

    for (const r of rows) {
      const bucket = grouped[r.workbook_slug];
      if (!bucket) continue;
      const total = bucket.total_fields || 1;
      bucket.clients.push({
        access_id: Number(r.access_id),
        submission_id: Number(r.submission_id),
        first_name: String(r.first_name),
        email: String(r.contact),
        access_token: String(r.access_token),
        created_at: String(r.created_at),
        last_seen_at: r.last_seen_at ? String(r.last_seen_at) : null,
        filled: Number(r.filled),
        pct: Math.round((Number(r.filled) / total) * 100),
      });
    }

    return NextResponse.json({
      workbooks: Object.values(grouped),
    });
  } catch (err) {
    console.error("admin workbooks GET failed:", err);
    return NextResponse.json(
      {
        error: "Server error",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
