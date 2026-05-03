import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";

/**
 * PATCH /api/admin/todos/[id]
 * body: { title?, body_md?, done?, due_at?: string|null }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const { id } = await params;
  const todoId = Number(id);
  if (!Number.isFinite(todoId)) {
    return NextResponse.json({ error: "Ongeldig id" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));

  if (typeof body.done === "boolean") {
    if (body.done) {
      await sql`UPDATE admin_todos SET done = TRUE, completed_at = NOW() WHERE id = ${todoId}`;
    } else {
      await sql`UPDATE admin_todos SET done = FALSE, completed_at = NULL WHERE id = ${todoId}`;
    }
  }
  if (typeof body.title === "string") {
    await sql`UPDATE admin_todos SET title = ${body.title} WHERE id = ${todoId}`;
  }
  if (typeof body.body_md === "string") {
    await sql`UPDATE admin_todos SET body_md = ${body.body_md} WHERE id = ${todoId}`;
  }
  if (body.due_at === null) {
    await sql`UPDATE admin_todos SET due_at = NULL WHERE id = ${todoId}`;
  } else if (typeof body.due_at === "string") {
    await sql`UPDATE admin_todos SET due_at = ${body.due_at} WHERE id = ${todoId}`;
  }

  return NextResponse.json({ success: true });
}

/**
 * DELETE /api/admin/todos/[id]
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }
  const { id } = await params;
  const todoId = Number(id);
  await sql`DELETE FROM admin_todos WHERE id = ${todoId}`;
  return NextResponse.json({ success: true });
}
