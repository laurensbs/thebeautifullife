import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, ExternalLink, Calendar } from "lucide-react";
import { sql } from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";
import { getWorkbook } from "@/lib/workbooks";
import { tx } from "@/lib/workbooks/types";
import AdminNav from "@/components/admin/AdminNav";
import AdminWorkbookReader from "./AdminWorkbookReader";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Werkboek inzien — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminWorkbookReadPage({
  params,
}: {
  params: Promise<{ accessId: string }>;
}) {
  const authed = await getAuthFromCookies();
  if (!authed) redirect("/admin");

  const { accessId: idParam } = await params;
  const accessId = Number(idParam);
  if (!Number.isFinite(accessId)) notFound();

  const accessRows = await sql`
    SELECT wa.id, wa.workbook_slug, wa.created_at, wa.last_seen_at,
           s.first_name, s.contact, s.id AS submission_id
    FROM workbook_access wa
    JOIN submissions s ON s.id = wa.submission_id
    WHERE wa.id = ${accessId}
    LIMIT 1
  `;
  if (accessRows.length === 0) notFound();
  const access = accessRows[0];

  const slug = String(access.workbook_slug);
  const workbook = getWorkbook(slug);
  if (!workbook) notFound();

  const answerRows = await sql`
    SELECT field_key, value FROM workbook_answers
    WHERE access_id = ${accessId}
  `;
  const answers: Record<string, string> = {};
  for (const r of answerRows) {
    answers[String(r.field_key)] = String(r.value ?? "");
  }

  const firstName = String(access.first_name ?? "—");
  const email = String(access.contact ?? "");
  const updatedDate = access.last_seen_at
    ? new Date(String(access.last_seen_at)).toLocaleDateString("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-page">
      <AdminNav />

      <main className="max-w-4xl mx-auto px-5 sm:px-6 py-6 sm:py-8">
        <Link
          href={`/admin/klanten/${encodeURIComponent(email.toLowerCase())}`}
          className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-ink-soft hover:text-tan transition mb-5"
        >
          <ArrowLeft size={12} /> Terug naar {firstName}
        </Link>

        {/* Klant-header */}
        <div className="bg-page-soft rounded-[6px] shadow-[0_8px_24px_rgba(60,50,30,0.06)] px-6 py-5 sm:px-8 sm:py-6 mb-6 relative overflow-hidden">
          <span className="absolute top-0 left-0 right-0 h-0.5 bg-tan" />
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="font-script text-tan text-2xl">werkboek-inzage</p>
              <h1 className="font-serif font-medium text-2xl tracking-[0.04em] text-ink mt-1">
                {tx(workbook.title, "nl")} · {firstName}
              </h1>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-3 text-[12.5px] text-ink-soft">
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-1.5 hover:text-tan transition"
                >
                  <Mail size={11} className="text-muted" /> {email}
                </a>
                {updatedDate && (
                  <span className="inline-flex items-center gap-1.5 text-muted">
                    <Calendar size={11} /> laatst bijgewerkt {updatedDate}
                  </span>
                )}
              </div>
            </div>
            <a
              href={`/api/workbook/pdf?slug=${encodeURIComponent(slug)}&access_id=${accessId}`}
              className="inline-flex items-center gap-1.5 bg-ink hover:brightness-110 text-white px-4 py-2 rounded-[3px] font-sans text-[10.5px] tracking-[0.22em] uppercase transition"
            >
              <ExternalLink size={11} /> Download PDF
            </a>
          </div>
        </div>

        {/* Werkboek pagina's */}
        <AdminWorkbookReader workbook={workbook} answers={answers} />
      </main>
    </div>
  );
}
