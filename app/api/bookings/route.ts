import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { BOOKING_TYPES } from "@/lib/bookings";
import { sendNewSubmissionNotification } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { setupDatabase } from "@/lib/setup-db";
import { getClientSession } from "@/lib/client-auth";

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

/**
 * POST /api/bookings
 * body: {
 *   booking_type: "one_on_one_60",
 *   scheduled_at: ISO,
 *   firstName, contact, phone?
 * }
 * Auth: openbaar (klant boekt zelf), maar als er een client-sessie is
 * koppelen we 'm aan de submission_id.
 */
export async function POST(request: NextRequest) {
  await ensureMigrated();
  try {
    const limited = await checkRateLimit(request, {
      bucket: "booking-create",
      max: 5,
      windowMs: 10 * 60_000,
    });
    if (limited) return limited;

    const body = await request.json();
    const typeKey = String(body.booking_type ?? "one_on_one_60");
    const scheduledIso = String(body.scheduled_at ?? "");
    const firstName = String(body.firstName ?? "").trim().slice(0, 100);
    const email = String(body.contact ?? "").trim().toLowerCase().slice(0, 200);
    const phone = body.phone ? String(body.phone).trim().slice(0, 20) : null;

    if (!(typeKey in BOOKING_TYPES)) {
      return NextResponse.json({ error: "Onbekend type" }, { status: 400 });
    }
    if (!firstName || !email.includes("@")) {
      return NextResponse.json(
        { error: "Naam en geldig e-mailadres zijn verplicht." },
        { status: 400 }
      );
    }
    const scheduled = new Date(scheduledIso);
    if (isNaN(scheduled.getTime()) || scheduled.getTime() < Date.now()) {
      return NextResponse.json(
        { error: "Kies een geldig tijdstip in de toekomst." },
        { status: 400 }
      );
    }

    const type = BOOKING_TYPES[typeKey as keyof typeof BOOKING_TYPES];

    // Check of slot nog vrij is
    const taken = await sql`
      SELECT id FROM bookings
      WHERE scheduled_at = ${scheduled}
        AND status NOT IN ('cancelled', 'declined')
      LIMIT 1
    `;
    if (taken.length > 0) {
      return NextResponse.json(
        { error: "Dit tijdstip is net geboekt. Kies een ander moment." },
        { status: 409 }
      );
    }

    // Koppel aan bestaande submission als die er is
    let submissionId: number | null = null;
    const session = await getClientSession();
    if (session) {
      submissionId = session.submissionIds[0] ?? null;
    } else {
      const found = await sql`
        SELECT id FROM submissions
        WHERE LOWER(contact) = ${email}
        ORDER BY created_at DESC LIMIT 1
      `;
      if (found.length > 0) submissionId = Number(found[0].id);
    }

    const inserted = await sql`
      INSERT INTO bookings
        (submission_id, contact_email, contact_name, contact_phone,
         booking_type, scheduled_at, duration_min, price_cents, status)
      VALUES
        (${submissionId}, ${email}, ${firstName}, ${phone},
         ${typeKey}, ${scheduled}, ${type.duration_min},
         ${type.price_cents}, 'reserved')
      RETURNING id
    `;

    // Notificeer Marion
    try {
      const protocol = request.headers.get("x-forwarded-proto") || "https";
      const host = request.headers.get("host") || "thebeautifullife.nl";
      const dashboardUrl = `${protocol}://${host}/admin/dashboard`;
      const when = scheduled.toLocaleString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      await sendNewSubmissionNotification(
        firstName,
        email,
        dashboardUrl,
        `Call gereserveerd · ${when}`,
        type.price_label
      );
    } catch (err) {
      console.error("booking notification email failed:", err);
    }

    return NextResponse.json({
      ok: true,
      id: inserted[0].id,
      // Stripe-redirect komt later — voor nu return success.
      message: "Slot gereserveerd. Betaling volgt zodra Stripe live staat.",
    });
  } catch (err) {
    console.error("booking POST failed:", err);
    return NextResponse.json(
      {
        error: "Server error",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
