import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { sql } from "@/lib/db";
import { STATUS_LABELS } from "@/lib/packages";
import { getWorkbook, workbookFieldKeys } from "@/lib/workbooks";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { id } = await params;
  const submissionId = Number(id);

  const submissions = await sql`
    SELECT * FROM submissions WHERE id = ${submissionId}
  `;

  if (submissions.length === 0) {
    return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  }

  const answers = await sql`
    SELECT a.*, q.question_text, q.question_type
    FROM answers a
    JOIN questions q ON q.id = a.question_id
    WHERE a.submission_id = ${submissionId}
    ORDER BY q.sort_order ASC
  `;

  // Workbook access + answers for this submission
  const accesses = await sql`
    SELECT id, workbook_slug, access_token, created_at, last_seen_at
    FROM workbook_access
    WHERE submission_id = ${submissionId}
    ORDER BY created_at ASC
  `;

  const workbooks = [] as Array<{
    slug: string;
    title: string;
    access_token: string;
    created_at: string;
    last_seen_at: string | null;
    total_fields: number;
    filled_fields: number;
    answers: Array<{ field_key: string; value: string; updated_at: string }>;
  }>;

  for (const a of accesses) {
    const wb = getWorkbook(String(a.workbook_slug));
    const allKeys = wb ? workbookFieldKeys(wb) : [];
    const wbAnswers = await sql`
      SELECT field_key, value, updated_at
      FROM workbook_answers
      WHERE access_id = ${a.id}
      ORDER BY field_key ASC
    `;
    const filled = wbAnswers.filter(
      (r) => String(r.value ?? "").trim().length > 0
    ).length;
    workbooks.push({
      slug: String(a.workbook_slug),
      title: wb?.title.nl ?? String(a.workbook_slug),
      access_token: String(a.access_token),
      created_at: String(a.created_at),
      last_seen_at: a.last_seen_at ? String(a.last_seen_at) : null,
      total_fields: allKeys.length,
      filled_fields: filled,
      answers: wbAnswers.map((r) => ({
        field_key: String(r.field_key),
        value: String(r.value ?? ""),
        updated_at: String(r.updated_at),
      })),
    });
  }

  // Bookings (calls met Marion) gekoppeld aan deze klant — via
  // submission_id óf via email (bookings kunnen ook los van submission
  // gemaakt zijn). Dedupe op id zodat we elke booking maar één keer tonen.
  const customerEmail = String(submissions[0].contact ?? "").toLowerCase();
  const bookingRows = await sql`
    SELECT id, type, scheduled_at, duration_min, price_cents, status,
           paid_at, meeting_url, contact_name, contact_email, notes,
           created_at
    FROM bookings
    WHERE submission_id = ${submissionId}
       OR LOWER(contact_email) = ${customerEmail}
    ORDER BY scheduled_at ASC
  `;
  const bookings = bookingRows.map((b) => ({
    id: Number(b.id),
    type: String(b.type ?? ""),
    scheduled_at: b.scheduled_at ? String(b.scheduled_at) : null,
    duration_min: b.duration_min == null ? null : Number(b.duration_min),
    price_cents: b.price_cents == null ? null : Number(b.price_cents),
    status: String(b.status ?? ""),
    paid_at: b.paid_at ? String(b.paid_at) : null,
    meeting_url: b.meeting_url ? String(b.meeting_url) : null,
    contact_name: b.contact_name ? String(b.contact_name) : null,
    notes: b.notes ? String(b.notes) : null,
    created_at: String(b.created_at),
  }));

  return NextResponse.json({
    submission: submissions[0],
    answers,
    workbooks,
    bookings,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { id } = await params;
  const submissionId = Number(id);
  const body = await request.json();

  // Update individually so we don't need a query builder.
  if (typeof body.status === "string") {
    if (!(body.status in STATUS_LABELS)) {
      return NextResponse.json({ error: "Ongeldige status" }, { status: 400 });
    }
    const paidStamp = body.status === "betaald";
    const deliveredStamp =
      body.status === "geleverd" ||
      body.status === "plan_geleverd" ||
      body.status === "afgerond";

    await sql`
      UPDATE submissions
      SET status = ${body.status},
          paid_at = CASE WHEN ${paidStamp} AND paid_at IS NULL THEN NOW() ELSE paid_at END,
          delivered_at = CASE WHEN ${deliveredStamp} AND delivered_at IS NULL THEN NOW() ELSE delivered_at END,
          updated_at = NOW()
      WHERE id = ${submissionId}
    `;
  }

  if ("notes" in body) {
    await sql`UPDATE submissions SET notes = ${body.notes ?? null}, updated_at = NOW() WHERE id = ${submissionId}`;
  }

  if ("scheduled_at" in body) {
    const v = body.scheduled_at ? new Date(body.scheduled_at) : null;
    await sql`UPDATE submissions SET scheduled_at = ${v}, updated_at = NOW() WHERE id = ${submissionId}`;
  }

  if ("zoom_meeting_url" in body) {
    await sql`UPDATE submissions SET zoom_meeting_url = ${body.zoom_meeting_url ?? null}, updated_at = NOW() WHERE id = ${submissionId}`;
  }

  const rows = await sql`SELECT * FROM submissions WHERE id = ${submissionId}`;
  return NextResponse.json({ submission: rows[0] });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { id } = await params;
  const submissionId = Number(id);

  await sql`DELETE FROM answers WHERE submission_id = ${submissionId}`;
  await sql`DELETE FROM submissions WHERE id = ${submissionId}`;

  return NextResponse.json({ success: true });
}
