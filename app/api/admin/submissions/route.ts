import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { sql } from "@/lib/db";
import { isPackageSlug } from "@/lib/packages";
import { setupDatabase } from "@/lib/setup-db";

// Run lazy DB-migrate één keer per cold start. Voorkomt dat admin
// queries 500'en omdat ALTER TABLE-kolommen nog niet bestaan.
let migrated = false;
async function ensureMigrated() {
  if (migrated) return;
  try {
    await setupDatabase();
    migrated = true;
  } catch (err) {
    console.error("setupDatabase lazy-migrate failed:", err);
  }
}

export async function GET(request: NextRequest) {
  try {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  await ensureMigrated();

  const page = Number(request.nextUrl.searchParams.get("page") || "1");
  const pkgFilter = request.nextUrl.searchParams.get("package");
  const limit = 20;
  const offset = (page - 1) * limit;

  const filterSlug = isPackageSlug(pkgFilter) ? pkgFilter : null;

  const submissions = filterSlug
    ? await sql`
        SELECT s.*,
          (SELECT COUNT(*) FROM answers a WHERE a.submission_id = s.id) as answer_count
        FROM submissions s
        WHERE s.package = ${filterSlug}
        ORDER BY s.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    : await sql`
        SELECT s.*,
          (SELECT COUNT(*) FROM answers a WHERE a.submission_id = s.id) as answer_count
        FROM submissions s
        ORDER BY s.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

  const countResult = filterSlug
    ? await sql`SELECT COUNT(*) as total FROM submissions WHERE package = ${filterSlug}`
    : await sql`SELECT COUNT(*) as total FROM submissions`;

  // Stats per package (always returned, regardless of filter)
  const stats = await sql`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE package = 'ikigai')::int AS ikigai,
      COUNT(*) FILTER (WHERE package = 'alignment')::int AS alignment,
      COUNT(*) FILTER (WHERE package = 'experience')::int AS experience,
      COUNT(*) FILTER (WHERE questionnaire_completed = true)::int AS completed,
      COUNT(*) FILTER (WHERE email_sent = true)::int AS email_sent,
      COALESCE(SUM(amount_cents) FILTER (WHERE paid_at IS NOT NULL), 0)::int AS revenue_cents,
      COUNT(*) FILTER (
        WHERE package IN ('alignment','experience') AND scheduled_at IS NULL
              AND status NOT IN ('afgerond','geannuleerd','plan_geleverd','geleverd')
      )::int AS need_scheduling
    FROM submissions
  `;

  // Werkboek-progress per submissie. Defensief: als de tabellen nog
  // niet bestaan of de query faalt, val terug op een lege map.
  type WbProgressRow = {
    id: number;
    workbooks: Array<{ slug: string; last_seen_at: string | null; filled: number }>;
  };
  const wbBySubmission = new Map<number, WbProgressRow["workbooks"]>();
  try {
    const wbProgress = (await sql`
      SELECT
        wa.submission_id AS id,
        ARRAY_AGG(
          json_build_object(
            'slug', wa.workbook_slug,
            'last_seen_at', wa.last_seen_at,
            'filled', (
              SELECT COUNT(*) FROM workbook_answers wn
              WHERE wn.access_id = wa.id
                AND COALESCE(LENGTH(TRIM(wn.value)), 0) > 0
            )
          )
        ) AS workbooks
      FROM workbook_access wa
      GROUP BY wa.submission_id
    `) as unknown as WbProgressRow[];
    for (const r of wbProgress) wbBySubmission.set(Number(r.id), r.workbooks);
  } catch (err) {
    console.error("wb-progress query failed:", err);
  }

  const enriched = (submissions as Array<Record<string, unknown>>).map((s) => ({
    ...s,
    workbook_progress: wbBySubmission.get(Number(s.id)) ?? [],
  }));

  return NextResponse.json({
    submissions: enriched,
    total: Number(countResult[0].total),
    page,
    totalPages: Math.ceil(Number(countResult[0].total) / limit),
    stats: stats[0],
    test_mode: process.env.PAYMENTS_TEST_MODE !== "false",
  });
  } catch (err) {
    console.error("admin submissions GET failed:", err);
    return NextResponse.json(
      { error: "Server error", detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
