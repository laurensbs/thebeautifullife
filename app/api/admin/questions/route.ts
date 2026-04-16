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

  const { id, question_text, question_type, options, is_active, sort_order } =
    await request.json();

  if (!id) {
    return NextResponse.json({ error: "ID is verplicht" }, { status: 400 });
  }

  const result = await sql`
    UPDATE questions
    SET 
      question_text = COALESCE(${question_text || null}, question_text),
      question_type = COALESCE(${question_type || null}, question_type),
      options = COALESCE(${options ? JSON.stringify(options) : null}, options),
      is_active = COALESCE(${is_active ?? null}, is_active),
      sort_order = COALESCE(${sort_order ?? null}, sort_order),
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
