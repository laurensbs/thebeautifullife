import nodemailer from "nodemailer";

// ─── SMTP transport ──────────────────────────────────────────────────
// Vereist SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM env-vars.
// Op Vercel zet ze in Project Settings → Environment Variables.
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: SMTP_PORT,
  // Port 465 → SSL/TLS; alle andere poorten (587, 25) → STARTTLS
  secure: SMTP_PORT === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Vercel function timeout = 10s default; geef SMTP wat ruimte.
  connectionTimeout: 8000,
  greetingTimeout: 8000,
  socketTimeout: 8000,
});

/** Throwt expliciet als SMTP niet geconfigureerd is. */
function assertSmtpConfigured() {
  const missing: string[] = [];
  if (!process.env.SMTP_HOST) missing.push("SMTP_HOST");
  if (!process.env.SMTP_USER) missing.push("SMTP_USER");
  if (!process.env.SMTP_PASS) missing.push("SMTP_PASS");
  if (!process.env.SMTP_FROM) missing.push("SMTP_FROM");
  if (missing.length > 0) {
    throw new Error(
      `SMTP not configured — missing env vars: ${missing.join(", ")}`
    );
  }
}

// ─── Brand-tokens (parallel aan tailwind tokens) ──────────────────────
const BRAND = {
  pageSoft: "#F6F1E7",
  page: "#F1EBE0",
  pageDark: "#EAE2D2",
  ink: "#2A2A28",
  inkSoft: "#4A4A45",
  muted: "#8A8270",
  line: "#D9CFBE",
  sage: "#7C8867",
  tan: "#B6906A",
  // Cursive script-stack — Pinyon-achtig waar beschikbaar, met goede fallbacks.
  scriptStack: "'Pinyon Script','Allura','Snell Roundhand','Apple Chancery',cursive",
  serifStack: "'Cormorant Garamond','Playfair Display',Georgia,serif",
  sansStack:
    "Montserrat,system-ui,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif",
};

/**
 * Gedeelde mail-layout. Geeft een cream kaart in body, met brand-tekst
 * en sign-off in Pinyon style. Compatible met de meeste mail clients
 * (alle styles inline, table-based fallback waar nodig).
 */
function layout({
  preheader,
  bodyHtml,
  scriptSignoff = "liefs, Marion",
}: {
  preheader: string;
  bodyHtml: string;
  scriptSignoff?: string;
}) {
  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>The Beautiful Life</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.page};font-family:${BRAND.sansStack};color:${BRAND.ink};">
  <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;mso-hide:all;">${preheader}</span>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.page};padding:32px 16px 48px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${BRAND.pageSoft};border-radius:6px 6px 6px 6px;box-shadow:0 18px 48px rgba(60,50,30,0.08);overflow:hidden;">

          <!-- Brand strip -->
          <tr>
            <td align="center" style="padding:32px 32px 20px;">
              <div style="font-family:${BRAND.serifStack};font-weight:500;font-size:14px;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND.ink};">The Beautiful Life</div>
              <div style="font-family:${BRAND.scriptStack};font-size:18px;color:${BRAND.tan};margin-top:4px;line-height:1;">coaching collective</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:8px 36px 32px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Hartjes-divider + signoff -->
          <tr>
            <td align="center" style="padding:8px 32px 36px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-top:1px solid ${BRAND.tan};opacity:0.55;width:48px;height:1px;line-height:0;font-size:0;">&nbsp;</td>
                  <td style="padding:0 12px;color:${BRAND.tan};font-size:13px;line-height:1;">&#9825;</td>
                  <td style="border-top:1px solid ${BRAND.tan};opacity:0.55;width:48px;height:1px;line-height:0;font-size:0;">&nbsp;</td>
                </tr>
              </table>
              <p style="font-family:${BRAND.scriptStack};color:${BRAND.tan};font-size:24px;line-height:1.4;margin:18px 0 0;">${scriptSignoff}</p>
            </td>
          </tr>

        </table>

        <p style="font-family:${BRAND.sansStack};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND.muted};margin:18px 0 0;">
          The Beautiful Life · Marion Lubach
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Reusable knop in tan, in stijl van de website CTA's. */
function button(href: string, label: string, color: "ink" | "tan" = "ink") {
  const bg = color === "ink" ? BRAND.ink : BRAND.tan;
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
      <tr>
        <td align="center" bgcolor="${bg}" style="border-radius:3px;">
          <a href="${href}" style="display:inline-block;padding:14px 36px;font-family:${BRAND.sansStack};font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#FFFFFF;text-decoration:none;font-weight:500;">${label}</a>
        </td>
      </tr>
    </table>`;
}

function kicker(text: string) {
  return `<p style="font-family:${BRAND.scriptStack};color:${BRAND.tan};font-size:24px;line-height:1.2;margin:0 0 4px;text-align:center;">${text}</p>`;
}

function title(text: string) {
  return `<h1 style="font-family:${BRAND.serifStack};font-weight:500;font-size:24px;letter-spacing:0.06em;text-transform:uppercase;color:${BRAND.ink};margin:0 0 8px;text-align:center;line-height:1.3;">${text}</h1>`;
}

function paragraph(html: string) {
  return `<p style="font-family:${BRAND.sansStack};font-size:15px;line-height:1.85;color:${BRAND.inkSoft};margin:14px 0;text-align:center;">${html}</p>`;
}

function note(html: string) {
  return `<p style="font-family:${BRAND.sansStack};font-size:12px;line-height:1.7;color:${BRAND.muted};margin:12px 0 0;text-align:center;">${html}</p>`;
}

function fromAddress() {
  return `"The Beautiful Life" <${process.env.SMTP_FROM}>`;
}

// ────────────────────────────────────────────────────────────────────────
// 1. Reflectievragenlijst — naar klant na aanmelding (legacy, blijft)
// ────────────────────────────────────────────────────────────────────────
export async function sendQuestionnaireEmail(
  to: string,
  firstName: string,
  questionnaireUrl: string
) {
  assertSmtpConfigured();
  const html = layout({
    preheader: `${firstName}, jouw persoonlijke reflectievragenlijst staat klaar.`,
    bodyHtml: [
      kicker("voor jou,"),
      title(firstName),
      paragraph(
        "Wat fijn dat je de eerste stap hebt gezet.<br>Hier is jouw persoonlijke reflectievragenlijst."
      ),
      button(questionnaireUrl, "Start mijn reflectie"),
      note(
        "Deze link is persoonlijk en alleen voor jou.<br>Neem de tijd — er zijn geen goede of foute antwoorden."
      ),
    ].join(""),
  });
  await transporter.sendMail({
    from: fromAddress(),
    to,
    subject: `${firstName}, jouw reflectievragenlijst staat klaar`,
    html,
  });
}

// ────────────────────────────────────────────────────────────────────────
// 2. Notificatie naar Marion bij nieuwe aanmelding
// ────────────────────────────────────────────────────────────────────────
export async function sendNewSubmissionNotification(
  name: string,
  email: string,
  dashboardUrl: string,
  packageName?: string,
  priceLabel?: string
) {
  assertSmtpConfigured();
  const now = new Date().toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const pkgLine = packageName
    ? `<p style="font-family:${BRAND.sansStack};font-size:12px;letter-spacing:0.22em;text-transform:uppercase;color:${BRAND.tan};margin:4px 0 18px;text-align:center;">${packageName}${priceLabel ? ` &middot; ${priceLabel}` : ""}</p>`
    : "";

  const detailRow = (label: string, value: string) =>
    `<tr>
       <td style="padding:8px 0 4px;font-family:${BRAND.sansStack};font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${BRAND.muted};border-top:1px solid ${BRAND.line};">${label}</td>
     </tr>
     <tr>
       <td style="padding:0 0 12px;font-family:${BRAND.sansStack};font-size:14px;color:${BRAND.ink};">${value}</td>
     </tr>`;

  const html = layout({
    preheader: `Nieuwe aanmelding van ${name}.`,
    bodyHtml: [
      kicker("nieuwe aanmelding"),
      title(name),
      pkgLine,
      `<p style="font-family:${BRAND.sansStack};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND.muted};text-align:center;margin:0 0 18px;">${now}</p>`,
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:1px solid ${BRAND.line};border-radius:6px;padding:18px 22px;margin:0 0 18px;">
         ${detailRow("E-mail", `<a href="mailto:${email}" style="color:${BRAND.tan};text-decoration:none;">${email}</a>`).replace(`border-top:1px solid ${BRAND.line};`, "")}
       </table>`,
      button(dashboardUrl, "Open dashboard", "ink"),
    ].join(""),
    scriptSignoff: "tot in het dashboard",
  });

  await transporter.sendMail({
    from: fromAddress(),
    to: "contact@thebeautifullife.nl",
    subject: `Nieuwe aanmelding: ${name}${packageName ? ` (${packageName})` : ""}`,
    html,
  });
}

// ────────────────────────────────────────────────────────────────────────
// 3. Werkboek invite — naar klant na aanmelding pakket
// ────────────────────────────────────────────────────────────────────────
export async function sendWorkbookInvite(
  to: string,
  firstName: string,
  workbookTitle: string,
  workbookUrl: string,
  locale: "nl" | "en" = "nl"
) {
  assertSmtpConfigured();
  const isEn = locale === "en";

  const subj = isEn
    ? `${firstName}, your workbook "${workbookTitle}" is ready`
    : `${firstName}, jouw werkboek "${workbookTitle}" staat klaar`;

  const intro = isEn ? "for you," : "voor jou,";
  const body = isEn
    ? "Your workbook is ready.<br>Take your time. Fill it in at your own pace.<br>Everything is saved automatically."
    : "Je werkboek staat voor je klaar.<br>Neem de tijd. Vul in jouw tempo in.<br>Alles wordt automatisch bewaard.";
  const cta = isEn ? "Open my workbook" : "Open mijn werkboek";
  const noteText = isEn
    ? "Save this email — the link keeps working so you can return where you left off."
    : "Bewaar deze e-mail. De link blijft werken zodat je later verder kunt waar je was gebleven.";
  const sign = isEn ? "with love, Marion" : "liefs, Marion";

  const html = layout({
    preheader: isEn
      ? `Your workbook "${workbookTitle}" is ready.`
      : `Jouw werkboek "${workbookTitle}" staat voor je klaar.`,
    bodyHtml: [
      kicker(intro),
      title(workbookTitle),
      paragraph(`<em>${firstName}</em>`),
      paragraph(body),
      button(workbookUrl, cta, "ink"),
      note(noteText),
    ].join(""),
    scriptSignoff: sign,
  });

  await transporter.sendMail({
    from: fromAddress(),
    to,
    subject: subj,
    html,
  });
}

// ────────────────────────────────────────────────────────────────────────
// 4. Magic link — naar klant voor login (portaal of werkboek)
// ────────────────────────────────────────────────────────────────────────
export async function sendWorkbookMagicLink(
  to: string,
  firstName: string,
  loginUrl: string
) {
  assertSmtpConfigured();
  const html = layout({
    preheader: `${firstName}, je inlog-link voor The Beautiful Life.`,
    bodyHtml: [
      kicker("welkom terug,"),
      title(firstName),
      paragraph(
        "Klik op de knop om jouw pad te openen.<br>Geen wachtwoord nodig."
      ),
      button(loginUrl, "Open mijn pad", "ink"),
      note(
        "Deze link blijft 30 minuten geldig.<br>Niet aangevraagd? Negeer dan deze mail."
      ),
    ].join(""),
  });

  await transporter.sendMail({
    from: fromAddress(),
    to,
    subject: `${firstName}, jouw inlog-link`,
    html,
  });
}

// ────────────────────────────────────────────────────────────────────────
// 5. Notificatie naar Marion — vragenlijst ingevuld
// ────────────────────────────────────────────────────────────────────────
export async function sendQuestionnaireCompletedNotification(
  name: string,
  email: string,
  phone: string | null,
  dashboardUrl: string
) {
  assertSmtpConfigured();
  const now = new Date().toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const phoneRow = phone
    ? `<tr>
         <td style="padding:8px 0 4px;font-family:${BRAND.sansStack};font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${BRAND.muted};border-top:1px solid ${BRAND.line};">Telefoon</td>
       </tr>
       <tr>
         <td style="padding:0 0 12px;font-family:${BRAND.sansStack};font-size:14px;color:${BRAND.ink};"><a href="tel:${phone}" style="color:${BRAND.tan};text-decoration:none;">${phone}</a></td>
       </tr>`
    : "";

  const html = layout({
    preheader: `${name} heeft de reflectievragenlijst ingevuld.`,
    bodyHtml: [
      kicker("vragenlijst ingevuld"),
      title(name),
      `<p style="font-family:${BRAND.sansStack};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND.muted};text-align:center;margin:0 0 18px;">${now}</p>`,
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:1px solid ${BRAND.line};border-radius:6px;padding:18px 22px;margin:0 0 18px;">
         <tr>
           <td style="padding:0 0 4px;font-family:${BRAND.sansStack};font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${BRAND.muted};">E-mail</td>
         </tr>
         <tr>
           <td style="padding:0 0 12px;font-family:${BRAND.sansStack};font-size:14px;color:${BRAND.ink};"><a href="mailto:${email}" style="color:${BRAND.tan};text-decoration:none;">${email}</a></td>
         </tr>
         ${phoneRow}
       </table>`,
      button(dashboardUrl, "Bekijk antwoorden", "ink"),
    ].join(""),
    scriptSignoff: "tot in het dashboard",
  });

  await transporter.sendMail({
    from: fromAddress(),
    to: "contact@thebeautifullife.nl",
    subject: `Vragenlijst ingevuld: ${name}${phone ? " (met telefoonnummer)" : ""}`,
    html,
  });
}
