import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";
import { setupDatabase } from "@/lib/setup-db";

let migrated = false;
async function ensureMigrated() {
  if (migrated) return;
  try {
    await setupDatabase();
    migrated = true;
  } catch (err) {
    console.error("setupDatabase failed:", err);
  }
}

export async function GET() {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }
  await ensureMigrated();
  try {
    const rows = await sql`
      SELECT id, submission_id, contact_email, contact_name, contact_phone,
             booking_type, scheduled_at, duration_min, price_cents,
             status, paid_at, meeting_url, notes, created_at
      FROM bookings
      ORDER BY scheduled_at DESC
    `;
    return NextResponse.json({ bookings: rows });
  } catch (err) {
    console.error("admin bookings GET failed:", err);
    return NextResponse.json(
      {
        error: "Server error",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
