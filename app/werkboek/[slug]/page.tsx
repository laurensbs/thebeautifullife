import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { getSessionByToken, getWorkbookSession, setWorkbookCookie } from "@/lib/workbook-auth";
import { getWorkbook } from "@/lib/workbooks";
import { getLocale } from "@/lib/i18n/server";
import WorkbookView from "@/components/workbook/WorkbookView";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function WorkbookPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { slug } = await params;
  const { token } = await searchParams;

  const workbook = getWorkbook(slug);
  if (!workbook) redirect("/");

  // If a fresh token is in the URL: set the cookie + clean the URL.
  if (token) {
    const session = await getSessionByToken(token);
    if (session && session.workbookSlug === slug) {
      await setWorkbookCookie(token);
      redirect(`/werkboek/${slug}`);
    }
  }

  const session = await getWorkbookSession();
  if (!session || session.workbookSlug !== slug) {
    redirect(`/werkboek/login?slug=${slug}`);
  }

  const rows = await sql`
    SELECT field_key, value FROM workbook_answers WHERE access_id = ${session.accessId}
  `;
  const answers: Record<string, string> = {};
  for (const r of rows) answers[String(r.field_key)] = String(r.value ?? "");

  const locale = await getLocale();

  return (
    <WorkbookView
      workbook={workbook}
      firstName={session.firstName}
      initialAnswers={answers}
      initialLocale={locale}
    />
  );
}
