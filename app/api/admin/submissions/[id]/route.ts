import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { id } = await params;
  const submissionId = Number(id);

  const submissions = await sql`
    SELECT * FROM submissions WHERE id = ${submissionId}
  `;

  if (submissions.length === 0) {
    return NextResponse.json({ error: "Niet gevonden" }, { status: 404 });
  }

  const answers = await sql`
    SELECT a.*, q.question_text, q.question_type
    FROM answers a
    JOIN questions q ON q.id = a.question_id
    WHERE a.submission_id = ${submissionId}
    ORDER BY q.sort_order ASC
  `;

  return NextResponse.json({
    submission: submissions[0],
    answers,
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { id } = await params;
  const submissionId = Number(id);

  // Delete answers first (foreign key), then submission
  await sql`DELETE FROM answers WHERE submission_id = ${submissionId}`;
  await sql`DELETE FROM submissions WHERE id = ${submissionId}`;

  return NextResponse.json({ success: true });
}
