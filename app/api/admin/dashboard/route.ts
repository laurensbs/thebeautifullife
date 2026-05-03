import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAuthFromCookies } from "@/lib/auth";
import { setupDatabase } from "@/lib/setup-db";

/**
 * GET /api/admin/dashboard
 *
 * Aggregeert vier widgets in één call:
 * - stats (klanten, betalend, vragenlijst, omzet deze maand)
 * - upcoming_calls (komende 7 dagen, niet gecanceld)
 * - recent_customers (laatste 5 unieke emails)
 * - open_todos (top 5 op due_at)
 */
export async function GET() {
  await setupDatabase().catch(() => {});

  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  // Stats
  const statsRows = await sql`
    SELECT
      COUNT(DISTINCT LOWER(contact)) FILTER (WHERE contact IS NOT NULL) AS total_customers,
      COUNT(DISTINCT LOWER(contact)) FILTER (WHERE package IS NULL) AS leads,
      COUNT(DISTINCT LOWER(contact)) FILTER (WHERE package IS NOT NULL) AS paying_customers,
      COALESCE(SUM(amount_cents) FILTER (
        WHERE paid_at IS NOT NULL
          AND paid_at >= DATE_TRUNC('month', NOW())
      ), 0) AS revenue_month,
      COUNT(*) FILTER (WHERE questionnaire_completed = TRUE) AS questionnaires_completed
    FROM submissions
  `;
  const stats = {
    total_customers: Number(statsRows[0].total_customers ?? 0),
    leads: Number(statsRows[0].leads ?? 0),
    paying_customers: Number(statsRows[0].paying_customers ?? 0),
    revenue_this_month_cents: Number(statsRows[0].revenue_month ?? 0),
    questionnaires_completed: Number(statsRows[0].questionnaires_completed ?? 0),
  };

  // Upcoming calls — komende 30 dagen, niet cancelled/declined
  const callsRows = await sql`
    SELECT b.id, b.booking_type, b.contact_name, b.contact_email,
           b.scheduled_at, b.duration_min, b.meeting_url,
           (cn.booking_id IS NOT NULL) AS has_notes
    FROM bookings b
    LEFT JOIN call_notes cn ON cn.booking_id = b.id
    WHERE b.scheduled_at >= NOW()
      AND b.scheduled_at < NOW() + INTERVAL '30 days'
      AND b.status NOT IN ('cancelled', 'declined')
    ORDER BY b.scheduled_at ASC
    LIMIT 6
  `;
  const upcoming_calls = callsRows.map((c) => ({
    id: Number(c.id),
    booking_type: String(c.booking_type ?? ""),
    contact_name: String(c.contact_name ?? ""),
    contact_email: String(c.contact_email ?? ""),
    scheduled_at: String(c.scheduled_at),
    duration_min: c.duration_min == null ? null : Number(c.duration_min),
    meeting_url: c.meeting_url ? String(c.meeting_url) : null,
    has_notes: Boolean(c.has_notes),
  }));

  // Recente klanten — laatste 5 unieke emails
  const recentRows = await sql`
    SELECT DISTINCT ON (LOWER(contact))
      LOWER(contact) AS email,
      first_name,
      package,
      created_at
    FROM submissions
    WHERE contact IS NOT NULL
    ORDER BY LOWER(contact), created_at DESC
  `;
  const recent_customers = recentRows
    .map((r) => ({
      email: String(r.email),
      first_name: r.first_name ? String(r.first_name) : "",
      package: r.package ? String(r.package) : null,
      created_at: String(r.created_at),
    }))
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  // Open todo's — top 5 op due_at (overdue eerst, dan zonder due)
  const todoRows = await sql`
    SELECT id, title, due_at
    FROM admin_todos
    WHERE done = FALSE
    ORDER BY due_at ASC NULLS LAST, created_at DESC
    LIMIT 5
  `;
  const open_todos = todoRows.map((t) => ({
    id: Number(t.id),
    title: String(t.title),
    due_at: t.due_at ? String(t.due_at) : null,
  }));

  return NextResponse.json({
    stats,
    upcoming_calls,
    recent_customers,
    open_todos,
  });
}
