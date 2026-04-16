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
  dashboardUrl: string
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
        Nieuwe inzending ♥
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
