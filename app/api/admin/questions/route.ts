import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET() {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const questions = await sql`
    SELECT * FROM questions ORDER BY sort_order ASC
  `;

  return NextResponse.json({ questions });
}

export async function POST(request: NextRequest) {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { question_text, question_type, options } = await request.json();

  if (!question_text?.trim()) {
    return NextResponse.json(
      { error: "Vraag tekst is verplicht" },
      { status: 400 }
    );
  }

  // Get max sort_order
  const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), 0) as max_order FROM questions`;
  const nextOrder = Number(maxOrder[0].max_order) + 1;

  const result = await sql`
    INSERT INTO questions (question_text, question_type, options, sort_order)
    VALUES (${question_text.trim()}, ${question_type || "open"}, ${options ? JSON.stringify(options) : null}, ${nextOrder})
    RETURNING *
  `;

  return NextResponse.json({ question: result[0] });
}

export async function PUT(request: NextRequest) {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const body = await request.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "ID is verplicht" }, { status: 400 });
  }

  // Build update fields dynamically to allow setting options to null
  const updates: Record<string, unknown> = {};
  if ("question_text" in body && body.question_text) updates.question_text = body.question_text;
  if ("question_type" in body && body.question_type) updates.question_type = body.question_type;
  if ("is_active" in body) updates.is_active = body.is_active;
  if ("sort_order" in body) updates.sort_order = body.sort_order;

  // Options: explicitly allow null to clear them
  const optionsValue = "options" in body
    ? body.options ? JSON.stringify(body.options) : null
    : undefined;

  const result = await sql`
    UPDATE questions
    SET 
      question_text = COALESCE(${updates.question_text ?? null}, question_text),
      question_type = COALESCE(${updates.question_type ?? null}, question_type),
      options = ${optionsValue !== undefined ? optionsValue : sql`options`},
      is_active = COALESCE(${updates.is_active ?? null}, is_active),
      sort_order = COALESCE(${updates.sort_order ?? null}, sort_order),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  return NextResponse.json({ question: result[0] });
}

export async function DELETE(request: NextRequest) {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { id } = await request.json();
  await sql`DELETE FROM questions WHERE id = ${id}`;

  return NextResponse.json({ success: true });
}
