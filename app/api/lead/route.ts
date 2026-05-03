import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sql } from "@/lib/db";
import {
  sendClientWelcome,
  sendNewSubmissionNotification,
} from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/lead
 * body: { firstName, contact, phone? }
 *
 * Voor de gratis reflectievragenlijst-CTA. Slaat een submission op
 * zonder pakket (package = null), stuurt vragenlijst-link naar de
 * klant en notificatie naar Marion.
 */
export async function POST(request: NextRequest) {
  try {
    const limited = await checkRateLimit(request, {
      bucket: "lead",
      max: 5,
      windowMs: 10 * 60_000,
    });
    if (limited) return limited;

    const body = await request.json();
    const { firstName, contact, phone } = body;

    if (!firstName?.trim() || !contact?.trim()) {
      return NextResponse.json(
        { error: "Naam en e-mailadres zijn verplicht" },
        { status: 400 }
      );
    }

    const name = String(firstName).trim().slice(0, 100);
    const email = String(contact).trim().toLowerCase().slice(0, 200);
    const phoneSafe = phone ? String(phone).trim().slice(0, 20) : null;

    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Ongeldig e-mailadres" },
        { status: 400 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    const result = await sql`
      INSERT INTO submissions
        (first_name, contact, phone, questionnaire_token, package, status)
      VALUES
        (${name}, ${email}, ${phoneSafe}, ${token}, NULL, 'aangemeld')
      RETURNING id
    `;

    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const host = request.headers.get("host") || "thebeautifullife.nl";
    const siteUrl = `${protocol}://${host}`;

    // Magic-link: logt klant direct in op portaal-account én stuurt door
    // naar de vragenlijst (questionnaire-token blijft als URL-param).
    const linkToken = "client:" + crypto.randomBytes(32).toString("hex");
    const linkExpires = new Date(Date.now() + 30 * 60 * 1000);
    await sql`
      INSERT INTO workbook_magic_links (email, token, expires_at)
      VALUES (${email}, ${linkToken}, ${linkExpires})
    `;
    const next = encodeURIComponent(`/vragenlijst?token=${token}`);
    const welcomeUrl = `${siteUrl}/api/client/login/consume?token=${linkToken}&next=${next}`;

    let emailSent = false;
    let emailError: string | null = null;
    try {
      await sendClientWelcome(email, name, welcomeUrl);
      emailSent = true;
      await sql`UPDATE submissions SET email_sent = true WHERE id = ${result[0].id}`;
    } catch (err) {
      emailError = err instanceof Error ? err.message : String(err);
      console.error("Lead welcome email failed:", emailError);
    }

    try {
      const dashboardUrl = `${siteUrl}/admin/dashboard`;
      await sendNewSubmissionNotification(
        name,
        email,
        dashboardUrl,
        "Gratis reflectievragenlijst",
        "gratis"
      );
    } catch (err) {
      console.error("Lead notification email failed:", err);
    }

    return NextResponse.json({
      success: true,
      id: result[0].id,
      ...(!emailSent && {
        warning: "email_failed",
        ...(process.env.NODE_ENV !== "production" && { detail: emailError }),
      }),
    });
  } catch (error) {
    console.error("Lead error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis. Probeer het opnieuw." },
      { status: 500 }
    );
  }
}
