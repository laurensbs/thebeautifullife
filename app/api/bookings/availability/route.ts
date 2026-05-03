import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { generateAvailableSlots, BOOKING_TYPES } from "@/lib/bookings";
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

export async function GET(request: NextRequest) {
  await ensureMigrated();
  try {
    // Optionele type-param: bepaalt slot-duur. Default = 60min.
    const typeParam = request.nextUrl.searchParams.get("type");
    const bookingType =
      typeParam && typeParam in BOOKING_TYPES
        ? BOOKING_TYPES[typeParam as keyof typeof BOOKING_TYPES]
        : BOOKING_TYPES.one_on_one_60;

    // Haal alle reeds geboekte/bevestigde slots op (komende 30 dagen).
    const rows = await sql`
      SELECT scheduled_at FROM bookings
      WHERE scheduled_at >= NOW()
        AND status NOT IN ('cancelled', 'declined')
    `;
    const bookedTimes = new Set<string>(
      rows.map((r) => new Date(String(r.scheduled_at)).toISOString())
    );
    const slots = generateAvailableSlots({
      bookedTimes,
      durationMin: bookingType.duration_min,
    });
    return NextResponse.json({ slots });
  } catch (err) {
    console.error("availability GET failed:", err);
    return NextResponse.json(
      {
        error: "Server error",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
