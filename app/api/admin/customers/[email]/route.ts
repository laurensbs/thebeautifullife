import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";
import { setupDatabase } from "@/lib/setup-db";
import { getWorkbook, workbookFieldKeys } from "@/lib/workbooks";

/**
 * GET /api/admin/customers/[email]
 *
 * Volledige klant-detail: alle submissions, vragenlijst-antwoorden,
 * werkboek-voortgang, calls met notitie-status, en de vrije notitietekst.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  await setupDatabase().catch(() => {});

  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { email: rawEmail } = await params;
  const email = decodeURIComponent(rawEmail).toLowerCase().trim();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Geldig e-mail vereist" }, { status: 400 });
  }

  const submissions = await sql`
    SELECT * FROM submissions
    WHERE LOWER(contact) = ${email}
    ORDER BY created_at DESC
  `;
  if (submissions.length === 0) {
    return NextResponse.json({ error: "Klant niet gevonden" }, { status: 404 });
  }
  const submissionIds = submissions.map((s) => Number(s.id));

  const answers = await sql`
    SELECT a.submission_id, q.question_text, q.question_type,
           a.answer_text, a.answer_scale
    FROM answers a
    JOIN questions q ON q.id = a.question_id
    WHERE a.submission_id = ANY(${submissionIds}::int[])
    ORDER BY q.sort_order ASC
  `;

  const accesses = await sql`
    SELECT id, submission_id, workbook_slug, access_token, created_at, last_seen_at
    FROM workbook_access
    WHERE submission_id = ANY(${submissionIds}::int[])
    ORDER BY created_at ASC
  `;
  const workbooks = [] as Array<{
    access_id: number;
    submission_id: number;
    slug: string;
    title: string;
    access_token: string;
    created_at: string;
    last_seen_at: string | null;
    total_fields: number;
    filled_fields: number;
  }>;
  for (const a of accesses) {
    const wb = getWorkbook(String(a.workbook_slug));
    const allKeys = wb ? workbookFieldKeys(wb) : [];
    const wbAnswers = await sql`
      SELECT value FROM workbook_answers
      WHERE access_id = ${a.id}
    `;
    const filled = wbAnswers.filter(
      (r) => String(r.value ?? "").trim().length > 0
    ).length;
    workbooks.push({
      access_id: Number(a.id),
      submission_id: Number(a.submission_id),
      slug: String(a.workbook_slug),
      title: wb?.title.nl ?? String(a.workbook_slug),
      access_token: String(a.access_token),
      created_at: String(a.created_at),
      last_seen_at: a.last_seen_at ? String(a.last_seen_at) : null,
      total_fields: allKeys.length,
      filled_fields: filled,
    });
  }

  const bookingsRaw = await sql`
    SELECT b.*, (cn.booking_id IS NOT NULL) AS has_notes,
           cn.summary AS notes_summary
    FROM bookings b
    LEFT JOIN call_notes cn ON cn.booking_id = b.id
    WHERE b.submission_id = ANY(${submissionIds}::int[])
       OR LOWER(b.contact_email) = ${email}
    ORDER BY b.scheduled_at DESC
  `;
  const bookings = bookingsRaw.map((b) => ({
    id: Number(b.id),
    booking_type: String(b.booking_type ?? ""),
    scheduled_at: b.scheduled_at ? String(b.scheduled_at) : null,
    duration_min: b.duration_min == null ? null : Number(b.duration_min),
    price_cents: b.price_cents == null ? null : Number(b.price_cents),
    status: String(b.status ?? ""),
    paid_at: b.paid_at ? String(b.paid_at) : null,
    meeting_url: b.meeting_url ? String(b.meeting_url) : null,
    notes: b.notes ? String(b.notes) : null,
    has_notes: Boolean(b.has_notes),
    notes_summary: b.notes_summary ? String(b.notes_summary) : "",
  }));

  const noteRows = await sql`
    SELECT body, updated_at FROM customer_notes
    WHERE LOWER(email) = ${email}
    LIMIT 1
  `;
  const customerNote = noteRows[0]
    ? {
        body: String(noteRows[0].body ?? ""),
        updated_at: String(noteRows[0].updated_at),
      }
    : { body: "", updated_at: null };

  return NextResponse.json({
    email,
    submissions: submissions.map((s) => ({
      id: Number(s.id),
      first_name: s.first_name ? String(s.first_name) : "",
      contact: String(s.contact),
      phone: s.phone ? String(s.phone) : null,
      package: s.package ? String(s.package) : null,
      status: String(s.status),
      created_at: String(s.created_at),
      paid_at: s.paid_at ? String(s.paid_at) : null,
      amount_cents: s.amount_cents == null ? null : Number(s.amount_cents),
      scheduled_at: s.scheduled_at ? String(s.scheduled_at) : null,
      questionnaire_completed: Boolean(s.questionnaire_completed),
    })),
    answers: answers.map((a) => ({
      submission_id: Number(a.submission_id),
      question_text: String(a.question_text),
      question_type: String(a.question_type),
      answer_text: a.answer_text ? String(a.answer_text) : null,
      answer_scale: a.answer_scale == null ? null : Number(a.answer_scale),
    })),
    workbooks,
    bookings,
    note: customerNote,
  });
}

/**
 * PATCH /api/admin/customers/[email]
 * body: { note?: string }
 *
 * Sla vrije notitie op voor deze klant (één veld per email, upsert).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  await setupDatabase().catch(() => {});

  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { email: rawEmail } = await params;
  const email = decodeURIComponent(rawEmail).toLowerCase().trim();
  const body = await request.json().catch(() => ({}));

  if (typeof body.note === "string") {
    await sql`
      INSERT INTO customer_notes (email, body, updated_at)
      VALUES (${email}, ${body.note}, NOW())
      ON CONFLICT ((LOWER(email)))
      DO UPDATE SET body = EXCLUDED.body, updated_at = NOW()
    `;
  }
  return NextResponse.json({ success: true });
}
