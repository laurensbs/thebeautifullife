import { cookies } from "next/headers";
import { sql } from "./db";

export const WORKBOOK_COOKIE = "wb_token";

export type WorkbookSession = {
  accessId: number;
  submissionId: number;
  workbookSlug: string;
  firstName: string;
  email: string;
};

export async function getWorkbookSession(): Promise<WorkbookSession | null> {
  const store = await cookies();
  const token = store.get(WORKBOOK_COOKIE)?.value;
  if (!token) return null;
  return getSessionByToken(token);
}

export async function getSessionByToken(
  token: string
): Promise<WorkbookSession | null> {
  const rows = await sql`
    SELECT wa.id AS access_id, wa.submission_id, wa.workbook_slug,
           s.first_name, s.contact AS email
    FROM workbook_access wa
    JOIN submissions s ON s.id = wa.submission_id
    WHERE wa.access_token = ${token}
    LIMIT 1
  `;
  if (rows.length === 0) return null;
  await sql`UPDATE workbook_access SET last_seen_at = NOW() WHERE id = ${rows[0].access_id}`;
  return {
    accessId: Number(rows[0].access_id),
    submissionId: Number(rows[0].submission_id),
    workbookSlug: String(rows[0].workbook_slug),
    firstName: String(rows[0].first_name),
    email: String(rows[0].email),
  };
}

export async function setWorkbookCookie(token: string) {
  const store = await cookies();
  store.set(WORKBOOK_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function clearWorkbookCookie() {
  const store = await cookies();
  store.delete(WORKBOOK_COOKIE);
}
