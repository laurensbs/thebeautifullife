import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token ontbreekt" }, { status: 400 });
  }

  // Verify token and check if not already completed
  const submissions = await sql`
    SELECT id, first_name, questionnaire_completed
    FROM submissions WHERE questionnaire_token = ${token}
  `;

  if (submissions.length === 0) {
    return NextResponse.json({ error: "Ongeldige link" }, { status: 404 });
  }

  if (submissions[0].questionnaire_completed) {
    return NextResponse.json({ error: "already_completed" }, { status: 400 });
  }

  // Fetch active questions
  const questions = await sql`
    SELECT id, question_text, question_type, options, sort_order
    FROM questions
    WHERE is_active = true
    ORDER BY sort_order ASC
  `;

  return NextResponse.json({
    firstName: submissions[0].first_name,
    questions,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { token, answers, phone } = await request.json();

    if (!token || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Ongeldige gegevens" },
        { status: 400 }
      );
    }

    const submissions = await sql`
      SELECT id, questionnaire_completed
      FROM submissions WHERE questionnaire_token = ${token}
    `;

    if (submissions.length === 0) {
      return NextResponse.json({ error: "Ongeldige link" }, { status: 404 });
    }

    if (submissions[0].questionnaire_completed) {
      return NextResponse.json(
        { error: "already_completed" },
        { status: 400 }
      );
    }

    const submissionId = submissions[0].id;

    // Insert each answer
    for (const answer of answers) {
      if (!answer.questionId) continue;
      await sql`
        INSERT INTO answers (submission_id, question_id, answer_text, answer_scale)
        VALUES (
          ${submissionId},
          ${answer.questionId},
          ${answer.text || null},
          ${answer.scale ?? null}
        )
      `;
    }

    // Save phone if provided and mark as completed
    const cleanPhone = phone ? String(phone).replace(/[^0-9+\-\s()]/g, "").trim().slice(0, 20) : null;
    await sql`
      UPDATE submissions
      SET questionnaire_completed = true,
          phone = COALESCE(${cleanPhone}, phone)
      WHERE id = ${submissionId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Questionnaire submit error:", error);
    return NextResponse.json(
      { error: "Er ging iets mis" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { token, phone } = await request.json();

    if (!token || !phone) {
      return NextResponse.json({ error: "Ongeldige gegevens" }, { status: 400 });
    }

    const cleanPhone = String(phone).replace(/[^0-9+\-\s()]/g, "").trim().slice(0, 20);

    if (!cleanPhone) {
      return NextResponse.json({ error: "Ongeldig telefoonnummer" }, { status: 400 });
    }

    await sql`
      UPDATE submissions
      SET phone = ${cleanPhone}
      WHERE questionnaire_token = ${token}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Phone save error:", error);
    return NextResponse.json({ error: "Er ging iets mis" }, { status: 500 });
  }
}
