import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";
import { setupDatabase } from "@/lib/setup-db";

/**
 * GET /api/admin/todos
 * Alle todo's, open eerst (op due_at), dan klaar (laatst voltooid eerst).
 */
export async function GET() {
  await setupDatabase().catch(() => {});
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const rows = await sql`
    SELECT id, title, body_md, done, due_at, created_at, completed_at
    FROM admin_todos
    ORDER BY done ASC,
             due_at ASC NULLS LAST,
             created_at DESC
  `;
  return NextResponse.json({
    todos: rows.map((r) => ({
      id: Number(r.id),
      title: String(r.title),
      body_md: String(r.body_md ?? ""),
      done: Boolean(r.done),
      due_at: r.due_at ? String(r.due_at) : null,
      created_at: String(r.created_at),
      completed_at: r.completed_at ? String(r.completed_at) : null,
    })),
  });
}

/**
 * POST /api/admin/todos
 * body: { title, body_md?, due_at? }
 */
export async function POST(request: NextRequest) {
  await setupDatabase().catch(() => {});
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const title = String(body.title ?? "").trim();
  if (!title) {
    return NextResponse.json({ error: "Titel vereist" }, { status: 400 });
  }
  const bodyMd = String(body.body_md ?? "");
  const dueAt =
    body.due_at && typeof body.due_at === "string" ? body.due_at : null;

  const rows = await sql`
    INSERT INTO admin_todos (title, body_md, due_at)
    VALUES (${title}, ${bodyMd}, ${dueAt})
    RETURNING id, title, body_md, done, due_at, created_at, completed_at
  `;
  const r = rows[0];
  return NextResponse.json({
    todo: {
      id: Number(r.id),
      title: String(r.title),
      body_md: String(r.body_md ?? ""),
      done: Boolean(r.done),
      due_at: r.due_at ? String(r.due_at) : null,
      created_at: String(r.created_at),
      completed_at: r.completed_at ? String(r.completed_at) : null,
    },
  });
}
