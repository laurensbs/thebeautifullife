import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { sendQuestionnaireEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { firstName, contact } = await request.json();

    if (!firstName?.trim() || !contact?.trim()) {
      return NextResponse.json(
        { error: "Naam en e-mailadres zijn verplicht" },
        { status: 400 }
      );
    }

    const name = firstName.trim().slice(0, 100);
    const email = contact.trim().toLowerCase().slice(0, 200);

    // Basic email format check
    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Ongeldig e-mailadres" },
        { status: 400 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    const result = await sql`
      INSERT INTO submissions (first_name, contact, questionnaire_token)
      VALUES (${name}, ${email}, ${token})
      RETURNING id
    `;

    // Send questionnaire email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const questionnaireUrl = `${siteUrl}/vragenlijst?token=${token}`;

    try {
      await sendQuestionnaireEmail(email, name, questionnaireUrl);
      await sql`UPDATE submissions SET email_sent = true WHERE id = ${result[0].id}`;
    } catch (emailErr) {
      console.error("Email send error:", emailErr);
      // Don't fail the subscription if email fails
    }

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis. Probeer het opnieuw." },
      { status: 500 }
    );
  }
}
