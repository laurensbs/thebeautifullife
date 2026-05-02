import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendQuestionnaireEmail(
  to: string,
  firstName: string,
  questionnaireUrl: string
) {
  const html = `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #f5efe7; padding: 40px 30px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <span style="font-style: italic; color: #3d2b22; font-size: 15px;">the beautiful life coaching collective</span>
      </div>
      <h1 style="font-family: Georgia, serif; color: #3d2b22; font-weight: 300; font-size: 26px; text-align: center; margin-bottom: 8px;">
        Lieve ${firstName},
      </h1>
      <p style="color: #7b5d49; font-size: 15px; line-height: 1.8; text-align: center; margin-bottom: 24px;">
        Wat fijn dat je de eerste stap hebt gezet. Hier is jouw persoonlijke reflectievragenlijst.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${questionnaireUrl}" style="display: inline-block; background: #b4875c; color: white; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600;">
          START MIJN REFLECTIE
        </a>
      </div>
      <p style="color: #cab7a5; font-size: 13px; text-align: center; line-height: 1.6;">
        Deze link is persoonlijk en alleen voor jou bedoeld.<br/>
        Neem de tijd, er zijn geen goede of foute antwoorden.
      </p>
      <div style="text-align: center; margin-top: 30px; color: #b4875c; font-size: 12px;">♥</div>
      <p style="text-align: center; font-style: italic; color: #b4875c; font-size: 20px; margin-top: 10px; font-family: Georgia, serif;">
        liefs, Marion
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"The Beautiful Life" <${process.env.SMTP_FROM}>`,
    to,
    subject: `${firstName}, hier is jouw reflectievragenlijst ♥`,
    html,
  });
}

export async function sendNewSubmissionNotification(
  name: string,
  email: string,
  dashboardUrl: string,
  packageName?: string,
  priceLabel?: string
) {
  const now = new Date().toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const html = `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #f5efe7; padding: 40px 30px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <span style="font-style: italic; color: #3d2b22; font-size: 15px;">the beautiful life coaching collective</span>
      </div>
      <h1 style="font-family: Georgia, serif; color: #3d2b22; font-weight: 300; font-size: 24px; text-align: center; margin-bottom: 6px;">
        Nieuwe aanmelding ♥
      </h1>
      ${
        packageName
          ? `<p style="text-align:center; color:#7c8867; font-size:13px; letter-spacing:2px; text-transform:uppercase; margin:0 0 6px;">${packageName}${priceLabel ? ` — ${priceLabel}` : ""}</p>`
          : ""
      }
      <p style="color: #cab7a5; font-size: 12px; text-align: center; margin-bottom: 28px;">
        ${now}
      </p>

      <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #cab7a5; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; padding: 8px 0 4px;">Naam</td>
          </tr>
          <tr>
            <td style="color: #3d2b22; font-size: 17px; padding: 0 0 16px; font-weight: 300;">${name}</td>
          </tr>
          <tr>
            <td style="color: #cab7a5; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; padding: 8px 0 4px; border-top: 1px solid #efe4d8;">E-mail</td>
          </tr>
          <tr>
            <td style="padding: 0 0 8px;"><a href="mailto:${email}" style="color: #b4875c; font-size: 15px; text-decoration: none;">${email}</a></td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 24px 0;">
        <a href="${dashboardUrl}" style="display: inline-block; background: #b4875c; color: white; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600;">
          BEKIJK IN DASHBOARD
        </a>
      </div>

      <p style="color: #cab7a5; font-size: 12px; text-align: center; line-height: 1.6;">
        De reflectievragenlijst is automatisch verstuurd.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"The Beautiful Life" <${process.env.SMTP_FROM}>`,
    to: "contact@thebeautifullife.nl",
    subject: `Nieuwe inzending: ${name}`,
    html,
  });
}

export async function sendWorkbookInvite(
  to: string,
  firstName: string,
  workbookTitle: string,
  workbookUrl: string,
  locale: "nl" | "en" = "nl"
) {
  const isEn = locale === "en";
  const subj = isEn
    ? `${firstName}, your workbook "${workbookTitle}" is ready ♡`
    : `${firstName}, jouw werkboek "${workbookTitle}" staat klaar ♡`;
  const intro = isEn ? `for you, ${firstName}` : `voor jou, ${firstName}`;
  const body = isEn
    ? `Your workbook is ready.<br/>Take your time. Fill it in at your own pace.<br/>Everything is saved automatically.`
    : `Je werkboek staat voor je klaar.<br/>Neem de tijd. Vul in jouw tempo in.<br/>Alles wordt automatisch bewaard.`;
  const cta = isEn ? "OPEN MY WORKBOOK" : "OPEN MIJN WERKBOEK";
  const note = isEn
    ? `Save this email. The link keeps working so you can return<br/>where you left off.`
    : `Bewaar deze e-mail. De link blijft werken zodat je later<br/>verder kunt waar je was gebleven.`;
  const sign = isEn ? "with love, Marion" : "liefs, Marion";

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #f6f1e7; padding: 40px 30px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-family: cursive; color: #b6906a; font-size: 24px;">the beautiful life</span>
      </div>
      <h1 style="font-family: Georgia, serif; color: #2a2a28; font-weight: 400; font-size: 28px; text-align: center; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 6px;">
        ${workbookTitle}
      </h1>
      <p style="text-align: center; color: #b6906a; font-family: cursive; font-size: 22px; margin-top: 0;">${intro}</p>
      <p style="color: #4a4a45; font-size: 15px; line-height: 1.85; text-align: center; margin: 28px 0;">${body}</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${workbookUrl}" style="display: inline-block; background: #2a2a28; color: white; padding: 14px 36px; border-radius: 3px; text-decoration: none; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;">
          ${cta}
        </a>
      </div>
      <p style="color: #8a8270; font-size: 12px; text-align: center; line-height: 1.6;">${note}</p>
      <p style="text-align: center; font-family: cursive; color: #b6906a; font-size: 22px; margin-top: 24px;">${sign}</p>
    </div>
  `;
  await transporter.sendMail({
    from: `"The Beautiful Life" <${process.env.SMTP_FROM}>`,
    to,
    subject: subj,
    html,
  });
}

export async function sendWorkbookMagicLink(
  to: string,
  firstName: string,
  loginUrl: string
) {
  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #f6f1e7; padding: 40px 30px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-family: cursive; color: #b6906a; font-size: 24px;">the beautiful life</span>
      </div>
      <h1 style="font-family: Georgia, serif; color: #2a2a28; font-weight: 400; font-size: 22px; text-align: center; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 14px;">
        Inloggen op je werkboek
      </h1>
      <p style="color: #4a4a45; font-size: 15px; line-height: 1.85; text-align: center;">
        Lieve ${firstName}, klik op de knop om je werkboek te openen.
      </p>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${loginUrl}" style="display: inline-block; background: #2a2a28; color: white; padding: 14px 36px; border-radius: 3px; text-decoration: none; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;">
          Ga naar mijn werkboek
        </a>
      </div>
      <p style="color: #8a8270; font-size: 12px; text-align: center; line-height: 1.6;">
        Deze link blijft 30 minuten geldig.<br/>
        Heb je 'm niet aangevraagd? Dan kun je deze mail negeren.
      </p>
    </div>
  `;
  await transporter.sendMail({
    from: `"The Beautiful Life" <${process.env.SMTP_FROM}>`,
    to,
    subject: `Jouw werkboek-link ♡`,
    html,
  });
}

export async function sendQuestionnaireCompletedNotification(
  name: string,
  email: string,
  phone: string | null,
  dashboardUrl: string
) {
  const now = new Date().toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const phoneRow = phone
    ? `<tr>
            <td style="color: #cab7a5; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; padding: 8px 0 4px; border-top: 1px solid #efe4d8;">Telefoon</td>
          </tr>
          <tr>
            <td style="color: #3d2b22; font-size: 15px; padding: 0 0 8px;"><a href="tel:${phone}" style="color: #b4875c; text-decoration: none;">${phone}</a></td>
          </tr>`
    : "";

  const html = `
    <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #f5efe7; padding: 40px 30px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <span style="font-style: italic; color: #3d2b22; font-size: 15px;">the beautiful life coaching collective</span>
      </div>
      <h1 style="font-family: Georgia, serif; color: #3d2b22; font-weight: 300; font-size: 24px; text-align: center; margin-bottom: 6px;">
        Vragenlijst ingevuld ♥
      </h1>
      <p style="color: #cab7a5; font-size: 12px; text-align: center; margin-bottom: 28px;">
        ${now}
      </p>

      <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #cab7a5; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; padding: 8px 0 4px;">Naam</td>
          </tr>
          <tr>
            <td style="color: #3d2b22; font-size: 17px; padding: 0 0 16px; font-weight: 300;">${name}</td>
          </tr>
          <tr>
            <td style="color: #cab7a5; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; padding: 8px 0 4px; border-top: 1px solid #efe4d8;">E-mail</td>
          </tr>
          <tr>
            <td style="padding: 0 0 ${phone ? "16px" : "8px"};"><a href="mailto:${email}" style="color: #b4875c; font-size: 15px; text-decoration: none;">${email}</a></td>
          </tr>
          ${phoneRow}
        </table>
      </div>

      <div style="text-align: center; margin: 24px 0;">
        <a href="${dashboardUrl}" style="display: inline-block; background: #b4875c; color: white; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600;">
          BEKIJK ANTWOORDEN
        </a>
      </div>

      <p style="color: #cab7a5; font-size: 12px; text-align: center; line-height: 1.6;">
        ${name} heeft de reflectievragenlijst afgerond.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"The Beautiful Life" <${process.env.SMTP_FROM}>`,
    to: "contact@thebeautifullife.nl",
    subject: `Vragenlijst ingevuld: ${name}${phone ? " (met telefoonnummer)" : ""}`,
    html,
  });
}
