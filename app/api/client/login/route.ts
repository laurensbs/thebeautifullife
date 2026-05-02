import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sql } from "@/lib/db";
import { sendWorkbookMagicLink } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

// Magic link to enter /mijn-pad. Reuses workbook_magic_links table
// with a "client:" prefix on the token to distinguish purpose.
export async function POST(request: NextRequest) {
  try {
    // IP-bucket: 10 magic-link verzoeken per 10 min per IP.
    const ipLimited = await checkRateLimit(request, {
      bucket: "client-login-ip",
      max: 10,
      windowMs: 10 * 60_000,
    });
    if (ipLimited) return ipLimited;

    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Vul een geldig e-mailadres in." },
        { status: 400 }
      );
    }

    // E-mail-bucket: 3 verzoeken per e-mail per 10 min — voorkomt
    // mailbox-spammen aan iemand anders.
    const emailLimited = await checkRateLimit(request, {
      bucket: "client-login-email",
      identifier: email,
      max: 3,
      windowMs: 10 * 60_000,
    });
    if (emailLimited) return emailLimited;

    const subs = await sql`
      SELECT first_name FROM submissions
      WHERE LOWER(contact) = ${email}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    // Always pretend success — voorkomt e-mail-enumeratie.
    if (subs.length === 0) {
      return NextResponse.json({ ok: true });
    }

    const linkToken = "client:" + crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 30 * 60 * 1000);

    await sql`
      INSERT INTO workbook_magic_links (email, token, expires_at)
      VALUES (${email}, ${linkToken}, ${expires})
    `;

    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const host = request.headers.get("host") || "thebeautifullife.nl";
    const url = `${protocol}://${host}/api/client/login/consume?token=${linkToken}`;

    let emailSent = false;
    let emailError: string | null = null;
    try {
      await sendWorkbookMagicLink(email, String(subs[0].first_name), url);
      emailSent = true;
    } catch (err) {
      emailError = err instanceof Error ? err.message : String(err);
      console.error("Client magic link email failed:", emailError);
    }

    // In productie: altijd 'ok' terug zodat klant geen email-status leakt.
    // In dev / als email expliciet faalt door SMTP-config: response bevat
    // een hint zodat developer 'm in DevTools ziet.
    if (!emailSent) {
      return NextResponse.json({
        ok: true,
        warning: "email_failed",
        // detail alleen in non-prod
        ...(process.env.NODE_ENV !== "production" && {
          detail: emailError,
          dev_link: url,
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("Client login error:", detail);
    return NextResponse.json(
      {
        error: "Er ging iets mis.",
        ...(process.env.NODE_ENV !== "production" && { detail }),
      },
      { status: 500 }
    );
  }
}
