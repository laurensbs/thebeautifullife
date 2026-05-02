import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sql } from "@/lib/db";
import { sendWorkbookMagicLink } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const slug = body.slug ? String(body.slug) : null;

    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Vul een geldig e-mailadres in." },
        { status: 400 }
      );
    }

    // Find any workbook_access for this email — pick most recent.
    // If a slug is provided, prefer that one.
    const accesses = slug
      ? await sql`
          SELECT wa.id, wa.access_token, wa.workbook_slug, s.first_name
          FROM workbook_access wa
          JOIN submissions s ON s.id = wa.submission_id
          WHERE LOWER(s.contact) = ${email} AND wa.workbook_slug = ${slug}
          ORDER BY wa.created_at DESC
          LIMIT 1
        `
      : await sql`
          SELECT wa.id, wa.access_token, wa.workbook_slug, s.first_name
          FROM workbook_access wa
          JOIN submissions s ON s.id = wa.submission_id
          WHERE LOWER(s.contact) = ${email}
          ORDER BY wa.created_at DESC
          LIMIT 1
        `;

    // Always return ok (don't leak which emails exist).
    if (accesses.length === 0) {
      return NextResponse.json({ ok: true });
    }

    const row = accesses[0];
    const linkToken = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 min

    await sql`
      INSERT INTO workbook_magic_links (email, token, expires_at)
      VALUES (${email}, ${linkToken}, ${expires})
    `;

    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const host = request.headers.get("host") || "thebeautifullife.nl";
    const url = `${protocol}://${host}/api/workbook/login/consume?token=${linkToken}`;

    try {
      await sendWorkbookMagicLink(email, String(row.first_name), url);
    } catch (err) {
      console.error("Magic link email failed:", err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Workbook login error:", err);
    return NextResponse.json(
      { error: "Er ging iets mis. Probeer het opnieuw." },
      { status: 500 }
    );
  }
}
