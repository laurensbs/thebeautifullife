import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { sql } from "@/lib/db";
import { getWorkbookSession } from "@/lib/workbook-auth";
import { getClientSession } from "@/lib/client-auth";
import { getAuthFromCookies } from "@/lib/auth";
import { getWorkbook } from "@/lib/workbooks";
import { getLocale } from "@/lib/i18n/server";
import { WorkbookPdfDoc } from "@/lib/workbook-pdf";

/**
 * GET /api/workbook/pdf?slug=…&access_id=… (admin only) of zonder
 * access_id voor de eigen ingelogde klant.
 *
 * Genereert een PDF met cover (incl. klantnaam + datum), alle pagina's
 * met ingevulde antwoorden, en een afsluitpagina van Marion.
 */
export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const slug = url.searchParams.get("slug") ?? "";
    const accessIdParam = url.searchParams.get("access_id");

    const workbook = getWorkbook(slug);
    if (!workbook) {
      return NextResponse.json({ error: "Onbekend werkboek" }, { status: 404 });
    }

    let accessId: number | null = null;
    let firstName = "";
    let email = "";

    if (accessIdParam) {
      // Admin route — vereist admin-auth
      const adminAuthed = await getAuthFromCookies();
      if (!adminAuthed) {
        return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
      }
      accessId = Number(accessIdParam);
      const rows = await sql`
        SELECT wa.id, s.first_name, s.contact
        FROM workbook_access wa
        JOIN submissions s ON s.id = wa.submission_id
        WHERE wa.id = ${accessId} AND wa.workbook_slug = ${slug}
        LIMIT 1
      `;
      if (rows.length === 0) {
        return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
      }
      firstName = String(rows[0].first_name);
      email = String(rows[0].contact);
    } else {
      // Klant — werkboek-cookie sessie
      const wbSession = await getWorkbookSession();
      if (wbSession && wbSession.workbookSlug === slug) {
        accessId = wbSession.accessId;
        firstName = wbSession.firstName;
        email = wbSession.email;
      } else {
        // Fallback: portaal-sessie. Zoek access bij e-mail.
        const clientSession = await getClientSession();
        if (!clientSession) {
          return NextResponse.json(
            { error: "Niet ingelogd" },
            { status: 401 }
          );
        }
        const rows = await sql`
          SELECT wa.id, s.first_name, s.contact
          FROM workbook_access wa
          JOIN submissions s ON s.id = wa.submission_id
          WHERE LOWER(s.contact) = ${clientSession.email}
            AND wa.workbook_slug = ${slug}
          ORDER BY wa.created_at DESC LIMIT 1
        `;
        if (rows.length === 0) {
          return NextResponse.json(
            { error: "Geen toegang" },
            { status: 403 }
          );
        }
        accessId = Number(rows[0].id);
        firstName = String(rows[0].first_name);
        email = String(rows[0].contact);
      }
    }

    const answersRows = await sql`
      SELECT field_key, value FROM workbook_answers WHERE access_id = ${accessId}
    `;
    const answers: Record<string, string> = {};
    for (const r of answersRows) {
      answers[String(r.field_key)] = String(r.value ?? "");
    }

    const locale = await getLocale();

    const buffer = await renderToBuffer(
      <WorkbookPdfDoc
        workbook={workbook}
        answers={answers}
        firstName={firstName}
        locale={locale}
      />
    );

    const safeName = firstName.replace(/[^a-zA-Z0-9]/g, "-").slice(0, 30);
    const date = new Date().toISOString().slice(0, 10);
    const filename = `${slug}-${safeName}-${date}.pdf`;
    void email;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("workbook PDF generation failed:", err);
    return NextResponse.json(
      {
        error: "PDF generation failed",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
