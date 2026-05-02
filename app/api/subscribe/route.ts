import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import {
  sendQuestionnaireEmail,
  sendNewSubmissionNotification,
} from "@/lib/email";
import { PACKAGES, isPackageSlug } from "@/lib/packages";
import { grantWorkbooksForPackage } from "@/lib/workbook-grants";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, contact, phone, package: pkgSlug, intake_data } = body;

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

    const slug = isPackageSlug(pkgSlug) ? pkgSlug : null;
    const pkg = slug ? PACKAGES[slug] : null;
    const amountCents = pkg ? pkg.priceCents : null;
    const intakeJson =
      intake_data && typeof intake_data === "object"
        ? JSON.stringify(intake_data)
        : null;

    const token = crypto.randomBytes(32).toString("hex");

    // Test-mode: simuleer een geslaagde betaling totdat Mollie live staat.
    // Zet PAYMENTS_TEST_MODE=false in env om dit gedrag uit te schakelen.
    const isTestMode = process.env.PAYMENTS_TEST_MODE !== "false";
    const initialStatus = isTestMode && slug ? "betaald" : "aangemeld";

    const result = await sql`
      INSERT INTO submissions
        (first_name, contact, phone, questionnaire_token, package, status, intake_data, amount_cents, paid_at)
      VALUES
        (${name}, ${email}, ${phoneSafe}, ${token}, ${slug}, ${initialStatus}, ${intakeJson}, ${amountCents}, ${
          isTestMode && slug ? new Date() : null
        })
      RETURNING id
    `;

    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const host = request.headers.get("host") || "thebeautifullife.nl";
    const siteUrl = `${protocol}://${host}`;

    // Pakket 1 (ikigai) krijgt direct de vragenlijst.
    // Pakket 2/3: Marion neemt eerst contact op, dus geen automatische vragenlijst-mail.
    if (slug === "ikigai" || slug === null) {
      const questionnaireUrl = `${siteUrl}/vragenlijst?token=${token}`;
      try {
        await sendQuestionnaireEmail(email, name, questionnaireUrl);
        await sql`UPDATE submissions SET email_sent = true WHERE id = ${result[0].id}`;
      } catch (emailErr) {
        console.error("Email send error:", emailErr);
      }
    }

    // Grant access to the workbook(s) belonging to this package + send invite mail.
    if (slug) {
      try {
        await grantWorkbooksForPackage(
          Number(result[0].id),
          slug,
          email,
          name,
          siteUrl
        );
      } catch (err) {
        console.error("grantWorkbooksForPackage failed:", err);
      }
    }

    try {
      const dashboardUrl = `${siteUrl}/admin/dashboard`;
      await sendNewSubmissionNotification(
        name,
        email,
        dashboardUrl,
        pkg?.name,
        pkg?.priceLabel
      );
    } catch (notifyErr) {
      console.error("Notification email error:", notifyErr);
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
