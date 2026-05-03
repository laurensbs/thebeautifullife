import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";

/**
 * GET /api/admin/customers
 *
 * Geaggregeerd klant-overzicht — uniek per emailadres, met telling van
 * submissions / werkboeken / bookings en laatste activiteit. Voor de
 * admin "alle klanten in één blik".
 */
export async function GET() {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  // Eén row per email — pak naam/phone uit de meest recente submission,
  // tel submissions, werkboeken en bookings, geef laatste activiteit.
  const rows = await sql`
    WITH base AS (
      SELECT
        LOWER(s.contact) AS email,
        s.first_name,
        s.phone,
        s.created_at,
        s.id AS submission_id,
        s.package
      FROM submissions s
      WHERE s.contact IS NOT NULL AND s.contact <> ''
    ),
    agg AS (
      SELECT
        email,
        COUNT(DISTINCT submission_id) AS submission_count,
        COUNT(DISTINCT package) FILTER (WHERE package IS NOT NULL) AS package_count,
        MAX(created_at) AS last_submission_at,
        (ARRAY_AGG(first_name ORDER BY created_at DESC))[1] AS first_name,
        (ARRAY_AGG(phone ORDER BY created_at DESC))[1] AS phone
      FROM base
      GROUP BY email
    )
    SELECT
      a.*,
      (SELECT COUNT(*) FROM workbook_access wa
        JOIN submissions s ON s.id = wa.submission_id
        WHERE LOWER(s.contact) = a.email) AS workbook_count,
      (SELECT COUNT(*) FROM bookings b
        WHERE LOWER(b.contact_email) = a.email) AS booking_count,
      (SELECT MAX(b.scheduled_at) FROM bookings b
        WHERE LOWER(b.contact_email) = a.email) AS last_booking_at
    FROM agg a
    ORDER BY a.last_submission_at DESC
  `;

  return NextResponse.json({
    customers: rows.map((r) => ({
      email: String(r.email),
      first_name: r.first_name ? String(r.first_name) : "",
      phone: r.phone ? String(r.phone) : null,
      submission_count: Number(r.submission_count ?? 0),
      package_count: Number(r.package_count ?? 0),
      workbook_count: Number(r.workbook_count ?? 0),
      booking_count: Number(r.booking_count ?? 0),
      last_submission_at: r.last_submission_at
        ? String(r.last_submission_at)
        : null,
      last_booking_at: r.last_booking_at ? String(r.last_booking_at) : null,
    })),
  });
}

/**
 * DELETE /api/admin/customers?email=foo@bar.nl
 *
 * Verwijdert een klant volledig — alle submissions, werkboeken,
 * antwoorden, bookings, magic links en sessies. Onomkeerbaar.
 */
export async function DELETE(request: NextRequest) {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const email = request.nextUrl.searchParams.get("email")?.toLowerCase().trim();
  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Geldig e-mailadres vereist" },
      { status: 400 }
    );
  }

  // Submissions ophalen → daarop hangen workbook_access + answers (CASCADE
  // is op workbook_answers ingesteld, dus die gaan automatisch mee).
  const subs = await sql`
    SELECT id FROM submissions WHERE LOWER(contact) = ${email}
  `;
  const submissionIds = subs.map((s) => Number(s.id));

  if (submissionIds.length > 0) {
    // Workbook access verwijderen — sleept workbook_answers mee via CASCADE
    await sql`
      DELETE FROM workbook_access
      WHERE submission_id = ANY(${submissionIds}::int[])
    `;
    // Vragenlijst-antwoorden
    await sql`
      DELETE FROM answers
      WHERE submission_id = ANY(${submissionIds}::int[])
    `;
  }

  // Magic links voor deze klant
  await sql`DELETE FROM workbook_magic_links WHERE LOWER(email) = ${email}`;

  // Client-portaal sessies
  await sql`DELETE FROM client_sessions WHERE LOWER(email) = ${email}`;

  // Bookings (calls) — kunnen los van submission gemaakt zijn, dus apart
  await sql`DELETE FROM bookings WHERE LOWER(contact_email) = ${email}`;

  // Tot slot: alle submissions
  await sql`DELETE FROM submissions WHERE LOWER(contact) = ${email}`;

  return NextResponse.json({
    success: true,
    deleted: {
      email,
      submissions: submissionIds.length,
    },
  });
}
