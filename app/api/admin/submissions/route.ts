import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { sql } from "@/lib/db";

export async function GET(request: NextRequest) {
  const authed = await getAuthFromCookies();
  if (!authed) {
    return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
  }

  const page = Number(request.nextUrl.searchParams.get("page") || "1");
  const limit = 20;
  const offset = (page - 1) * limit;

  const [submissions, countResult] = await Promise.all([
    sql`
      SELECT s.*, 
        (SELECT COUNT(*) FROM answers a WHERE a.submission_id = s.id) as answer_count
      FROM submissions s
      ORDER BY s.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `,
    sql`SELECT COUNT(*) as total FROM submissions`,
  ]);

  return NextResponse.json({
    submissions,
    total: Number(countResult[0].total),
    page,
    totalPages: Math.ceil(Number(countResult[0].total) / limit),
  });
}
