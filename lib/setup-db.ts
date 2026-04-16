import { sql } from "./db";

export async function setupDatabase() {
  // Questions table
  await sql`
    CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,
      question_text TEXT NOT NULL,
      question_type VARCHAR(20) NOT NULL DEFAULT 'open',
      options JSONB,
      sort_order INT NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Submissions table
  await sql`
    CREATE TABLE IF NOT EXISTS submissions (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      contact VARCHAR(200) NOT NULL,
      phone VARCHAR(20),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      email_sent BOOLEAN NOT NULL DEFAULT false,
      questionnaire_completed BOOLEAN NOT NULL DEFAULT false,
      questionnaire_token VARCHAR(100) UNIQUE
    )
  `;

  // Add phone column if missing (for existing databases)
  await sql`
    ALTER TABLE submissions ADD COLUMN IF NOT EXISTS phone VARCHAR(20)
  `;

  // Answers table
  await sql`
    CREATE TABLE IF NOT EXISTS answers (
      id SERIAL PRIMARY KEY,
      submission_id INT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
      question_id INT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
      answer_text TEXT,
      answer_scale INT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Seed default questions if empty
  const existing = await sql`SELECT COUNT(*) as count FROM questions`;
  if (Number(existing[0].count) === 0) {
    const defaultQuestions = [
      {
        text: "Hoe zou je je leven op dit moment omschrijven in drie woorden?",
        type: "open",
        order: 1,
      },
      {
        text: "Hoeveel innerlijke rust ervaar je op dit moment in je dagelijks leven?",
        type: "scale",
        order: 2,
      },
      {
        text: "Wat houdt je het meeste bezig op dit moment?",
        type: "choice",
        options: JSON.stringify([
          "Onrust of stress in mijn hoofd",
          "Het gevoel dat ik niet leef zoals ik wil",
          "Gebrek aan richting of doel",
          "Financiële zorgen",
          "Balans tussen werk en privé",
          "Anders",
        ]),
        order: 3,
      },
      {
        text: "Wat zou er veranderen als je vaker naar jezelf zou luisteren?",
        type: "open",
        order: 4,
      },
      {
        text: "Welk gevoel wil je vaker voelen in je leven?",
        type: "choice",
        options: JSON.stringify([
          "Rust en kalmte",
          "Vrijheid",
          "Verbinding met mezelf",
          "Vreugde en lichtheid",
          "Vertrouwen",
          "Inspiratie en energie",
        ]),
        order: 5,
      },
      {
        text: "In hoeverre heb je het gevoel dat je leven 'klopt' — van binnen en van buiten?",
        type: "scale",
        order: 6,
      },
      {
        text: "Wat houdt je tegen om de stap te zetten naar verandering?",
        type: "open",
        order: 7,
      },
      {
        text: "Sta je open voor een nieuwe manier van werken of verdienen die bij jouw leven past?",
        type: "choice",
        options: JSON.stringify([
          "Ja, ik ben hier heel nieuwsgierig naar",
          "Misschien, als het bij me past",
          "Ik weet het nog niet",
          "Nee, daar ben ik niet naar op zoek",
        ]),
        order: 8,
      },
      {
        text: "Hoe wil je dat je leven er over één jaar uitziet?",
        type: "open",
        order: 9,
      },
      {
        text: "Is er nog iets dat je kwijt wilt of dat je wilt delen?",
        type: "open",
        order: 10,
      },
    ];

    for (const q of defaultQuestions) {
      await sql`
        INSERT INTO questions (question_text, question_type, options, sort_order)
        VALUES (${q.text}, ${q.type}, ${q.options || null}, ${q.order})
      `;
    }
  }

  return { success: true };
}
