import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getWorkbookSession } from "@/lib/workbook-auth";
import { getWorkbook, workbookFieldKeys } from "@/lib/workbooks";

export async function POST(request: NextRequest) {
  const session = await getWorkbookSession();
  if (!session) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const body = await request.json();
  const fieldKey = String(body.field_key ?? "").trim();
  const value = body.value == null ? "" : String(body.value).slice(0, 20000);

  if (!fieldKey) {
    return NextResponse.json({ error: "field_key vereist" }, { status: 400 });
  }

  // Validate that this field actually exists in the workbook the user is viewing.
  const workbook = getWorkbook(session.workbookSlug);
  if (!workbook) {
    return NextResponse.json({ error: "Onbekend werkboek" }, { status: 400 });
  }
  const validKeys = new Set(workbookFieldKeys(workbook));
  if (!validKeys.has(fieldKey)) {
    return NextResponse.json({ error: "Onbekend veld" }, { status: 400 });
  }

  await sql`
    INSERT INTO workbook_answers (access_id, field_key, value, updated_at)
    VALUES (${session.accessId}, ${fieldKey}, ${value}, NOW())
    ON CONFLICT (access_id, field_key)
      DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
  `;

  return NextResponse.json({ ok: true });
}
