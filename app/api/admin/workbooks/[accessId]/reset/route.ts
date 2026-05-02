import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { sql } from "@/lib/db";

/**
 * POST /api/admin/workbooks/[accessId]/reset
 * Verwijdert alle antwoorden voor één werkboek-access. Token blijft
 * bestaan zodat de klant niet opnieuw hoeft in te loggen.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ accessId: string }> }
) {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }
  const { accessId } = await params;
  const id = Number(accessId);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Ongeldig id" }, { status: 400 });
  }
  await sql`DELETE FROM workbook_answers WHERE access_id = ${id}`;
  return NextResponse.json({ ok: true });
}
