import { getLocale } from "@/lib/i18n/server";
import { getClientSession } from "@/lib/client-auth";
import { sql } from "@/lib/db";
import { setupDatabase } from "@/lib/setup-db";
import BookingFlow from "./BookingFlow";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Plan een 1-op-1 call met Marion — The Beautiful Life",
  description:
    "Boek een 60-minuten Teams-call met Marion voor €125. Kies een tijd dat bij jou past.",
};

export default async function BoekCallPage() {
  await setupDatabase().catch(() => {});

  const locale = await getLocale();
  const session = await getClientSession();

  // Pre-fill name/email als klant ingelogd is
  let prefill: { firstName: string; email: string; phone: string | null } | null =
    null;
  if (session) {
    const rows = await sql`
      SELECT first_name, contact, phone FROM submissions
      WHERE id = ANY(${session.submissionIds}::int[])
      ORDER BY created_at DESC LIMIT 1
    `;
    if (rows.length > 0) {
      prefill = {
        firstName: String(rows[0].first_name),
        email: String(rows[0].contact),
        phone: rows[0].phone ? String(rows[0].phone) : null,
      };
    }
  }

  return <BookingFlow locale={locale} prefill={prefill} />;
}
