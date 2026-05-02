import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getAuthFromCookies } from "@/lib/auth";

/**
 * POST /api/admin/email-test
 * body: { to?: string }   (default: SMTP_FROM)
 *
 * Probeert een echte test-mail te sturen + verify(). Geeft de exacte
 * SMTP-error terug zodat je weet WAAROM mails niet aankomen.
 *
 * Alleen voor ingelogde admin.
 */
export async function POST(request: NextRequest) {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const to = String(body.to ?? process.env.SMTP_FROM ?? "");

  if (!to.includes("@")) {
    return NextResponse.json(
      { error: "Geen geldig 'to' adres opgegeven en geen SMTP_FROM gevonden." },
      { status: 400 }
    );
  }

  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
  });

  // Stap 1: verify (auth + verbinding)
  let verifyOk = false;
  let verifyError: string | null = null;
  try {
    await transporter.verify();
    verifyOk = true;
  } catch (err) {
    verifyError = err instanceof Error ? err.message : String(err);
  }

  if (!verifyOk) {
    return NextResponse.json(
      {
        ok: false,
        step: "verify",
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        user: process.env.SMTP_USER,
        from: process.env.SMTP_FROM,
        error: verifyError,
      },
      { status: 500 }
    );
  }

  // Stap 2: stuur test-mail
  try {
    const info = await transporter.sendMail({
      from: `"The Beautiful Life Test" <${process.env.SMTP_FROM}>`,
      to,
      subject: "SMTP test — The Beautiful Life",
      text: "Als je deze mail ontvangt werkt SMTP correct.",
      html: "<p>Als je deze mail ontvangt werkt SMTP correct.</p>",
    });
    return NextResponse.json({
      ok: true,
      step: "send",
      to,
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        step: "send",
        to,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
