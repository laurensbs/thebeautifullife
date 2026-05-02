import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }
  const { id } = await params;
  const bookingId = Number(id);
  const body = await request.json();

  if (typeof body.status === "string") {
    const status = body.status;
    const stamp = status === "paid";
    await sql`
      UPDATE bookings
      SET status = ${status},
          paid_at = CASE WHEN ${stamp} AND paid_at IS NULL THEN NOW() ELSE paid_at END,
          updated_at = NOW()
      WHERE id = ${bookingId}
    `;
  }
  if ("meeting_url" in body) {
    await sql`UPDATE bookings SET meeting_url = ${body.meeting_url ?? null}, updated_at = NOW() WHERE id = ${bookingId}`;
  }
  if ("notes" in body) {
    await sql`UPDATE bookings SET notes = ${body.notes ?? null}, updated_at = NOW() WHERE id = ${bookingId}`;
  }

  const rows = await sql`SELECT * FROM bookings WHERE id = ${bookingId}`;
  return NextResponse.json({ booking: rows[0] });
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
  await sql`DELETE FROM bookings WHERE id = ${Number(id)}`;
  return NextResponse.json({ ok: true });
}
