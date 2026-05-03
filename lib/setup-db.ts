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

  // Submissions table (base)
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

  // Incremental columns
  await sql`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS phone VARCHAR(20)`;
  await sql`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS package VARCHAR(20)`;
  await sql`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS status VARCHAR(40) NOT NULL DEFAULT 'aangemeld'`;
  await sql`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS intake_data JSONB`;
  await sql`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS notes TEXT`;
  await sql`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ`;
  await sql`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS amount_cents INT`;
  await sql`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ`;
  await sql`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS mollie_payment_id VARCHAR(100)`;
  await sql`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS zoom_meeting_url TEXT`;
  await sql`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ`;
  await sql`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`;

  // Bookings — 1-op-1 calls met Marion (€125 / 60 min Teams).
  // Stripe + Teams worden later inplugbaar gemaakt.
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      submission_id INT REFERENCES submissions(id) ON DELETE SET NULL,
      contact_email VARCHAR(200) NOT NULL,
      contact_name VARCHAR(100) NOT NULL,
      contact_phone VARCHAR(20),
      booking_type VARCHAR(40) NOT NULL DEFAULT 'one_on_one_60',
      scheduled_at TIMESTAMPTZ NOT NULL,
      duration_min INT NOT NULL DEFAULT 60,
      price_cents INT NOT NULL DEFAULT 12500,
      status VARCHAR(30) NOT NULL DEFAULT 'reserved',
      paid_at TIMESTAMPTZ,
      stripe_payment_id VARCHAR(120),
      meeting_url TEXT,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS bookings_scheduled_idx ON bookings(scheduled_at)`;
  await sql`CREATE INDEX IF NOT EXISTS bookings_email_idx ON bookings(contact_email)`;

  // Workbook access (one row per submission per workbook)
  await sql`
    CREATE TABLE IF NOT EXISTS workbook_access (
      id SERIAL PRIMARY KEY,
      submission_id INT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
      workbook_slug VARCHAR(60) NOT NULL,
      access_token VARCHAR(120) NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_seen_at TIMESTAMPTZ,
      UNIQUE (submission_id, workbook_slug)
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS workbook_access_token_idx ON workbook_access(access_token)`;

  // Workbook answers (one row per filled field, per access)
  await sql`
    CREATE TABLE IF NOT EXISTS workbook_answers (
      id SERIAL PRIMARY KEY,
      access_id INT NOT NULL REFERENCES workbook_access(id) ON DELETE CASCADE,
      field_key VARCHAR(80) NOT NULL,
      value TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (access_id, field_key)
    )
  `;

  // Magic-link tokens for client login
  await sql`
    CREATE TABLE IF NOT EXISTS workbook_magic_links (
      id SERIAL PRIMARY KEY,
      email VARCHAR(200) NOT NULL,
      token VARCHAR(120) NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      consumed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS workbook_magic_links_token_idx ON workbook_magic_links(token)`;

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

  // Klant-notities (vrije tekst per email — Marion's losse observaties)
  await sql`
    CREATE TABLE IF NOT EXISTS customer_notes (
      id SERIAL PRIMARY KEY,
      email VARCHAR(200) NOT NULL,
      body TEXT NOT NULL DEFAULT '',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS customer_notes_email_idx ON customer_notes(LOWER(email))`;

  // Call-notities (gestructureerde velden per booking)
  await sql`
    CREATE TABLE IF NOT EXISTS call_notes (
      booking_id INT PRIMARY KEY REFERENCES bookings(id) ON DELETE CASCADE,
      template_key VARCHAR(60) NOT NULL,
      fields JSONB NOT NULL DEFAULT '{}'::jsonb,
      summary TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Persoonlijke todo's voor Marion (admin-only)
  await sql`
    CREATE TABLE IF NOT EXISTS admin_todos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      body_md TEXT NOT NULL DEFAULT '',
      done BOOLEAN NOT NULL DEFAULT FALSE,
      due_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      completed_at TIMESTAMPTZ
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS admin_todos_done_idx ON admin_todos(done, due_at NULLS LAST)`;

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
