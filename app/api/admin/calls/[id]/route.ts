import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";
import { setupDatabase } from "@/lib/setup-db";
import { getCallTemplate } from "@/lib/call-templates";

/**
 * GET /api/admin/calls/[id]
 * Geeft volledige call-info + bestaande notitie-velden + template-definitie.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await setupDatabase().catch(() => {});

  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { id } = await params;
  const bookingId = Number(id);
  if (!Number.isFinite(bookingId)) {
    return NextResponse.json({ error: "Ongeldig id" }, { status: 400 });
  }

  const rows = await sql`
    SELECT * FROM bookings WHERE id = ${bookingId} LIMIT 1
  `;
  if (rows.length === 0) {
    return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  }
  const b = rows[0];

  const noteRows = await sql`
    SELECT template_key, fields, summary, updated_at
    FROM call_notes WHERE booking_id = ${bookingId} LIMIT 1
  `;
  const existing = noteRows[0]
    ? {
        template_key: String(noteRows[0].template_key),
        fields: noteRows[0].fields as Record<string, string>,
        summary: String(noteRows[0].summary ?? ""),
        updated_at: String(noteRows[0].updated_at),
      }
    : null;

  const template = getCallTemplate(String(b.booking_type ?? ""));

  return NextResponse.json({
    booking: {
      id: Number(b.id),
      booking_type: String(b.booking_type ?? ""),
      contact_name: b.contact_name ? String(b.contact_name) : "",
      contact_email: b.contact_email ? String(b.contact_email) : "",
      contact_phone: b.contact_phone ? String(b.contact_phone) : null,
      scheduled_at: b.scheduled_at ? String(b.scheduled_at) : null,
      duration_min: b.duration_min == null ? null : Number(b.duration_min),
      price_cents: b.price_cents == null ? null : Number(b.price_cents),
      status: String(b.status ?? ""),
      paid_at: b.paid_at ? String(b.paid_at) : null,
      meeting_url: b.meeting_url ? String(b.meeting_url) : null,
      notes: b.notes ? String(b.notes) : null,
      submission_id: b.submission_id == null ? null : Number(b.submission_id),
    },
    template,
    notes: existing,
  });
}

/**
 * PATCH /api/admin/calls/[id]
 * body: { fields?: Record<string,string>, summary?: string }
 * Upsert notities voor deze call.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await setupDatabase().catch(() => {});

  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { id } = await params;
  const bookingId = Number(id);
  if (!Number.isFinite(bookingId)) {
    return NextResponse.json({ error: "Ongeldig id" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const fields =
    body.fields && typeof body.fields === "object"
      ? (body.fields as Record<string, string>)
      : null;
  const summary = typeof body.summary === "string" ? body.summary : null;

  // Haal booking_type voor template_key
  const bRows = await sql`
    SELECT booking_type FROM bookings WHERE id = ${bookingId} LIMIT 1
  `;
  if (bRows.length === 0) {
    return NextResponse.json({ error: "Booking niet gevonden" }, { status: 404 });
  }
  const templateKey = String(bRows[0].booking_type ?? "one_on_one_60");

  // Upsert
  if (fields !== null && summary !== null) {
    await sql`
      INSERT INTO call_notes (booking_id, template_key, fields, summary, updated_at)
      VALUES (${bookingId}, ${templateKey}, ${JSON.stringify(fields)}::jsonb, ${summary}, NOW())
      ON CONFLICT (booking_id)
      DO UPDATE SET fields = EXCLUDED.fields, summary = EXCLUDED.summary, updated_at = NOW()
    `;
  } else if (fields !== null) {
    await sql`
      INSERT INTO call_notes (booking_id, template_key, fields, updated_at)
      VALUES (${bookingId}, ${templateKey}, ${JSON.stringify(fields)}::jsonb, NOW())
      ON CONFLICT (booking_id)
      DO UPDATE SET fields = EXCLUDED.fields, updated_at = NOW()
    `;
  } else if (summary !== null) {
    await sql`
      INSERT INTO call_notes (booking_id, template_key, summary, updated_at)
      VALUES (${bookingId}, ${templateKey}, ${summary}, NOW())
      ON CONFLICT (booking_id)
      DO UPDATE SET summary = EXCLUDED.summary, updated_at = NOW()
    `;
  }

  return NextResponse.json({ success: true });
}
