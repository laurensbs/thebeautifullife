import { cookies } from "next/headers";
import crypto from "crypto";
import { sql } from "./db";

export const CLIENT_COOKIE = "client_token";

export type ClientSession = {
  email: string;
  // primary submission used for greeting (most recent)
  firstName: string;
  submissionIds: number[];
};

// Sessions persist as their own table so we can revoke / expire.
export async function ensureClientSessionsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS client_sessions (
      token VARCHAR(120) PRIMARY KEY,
      email VARCHAR(200) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function createClientSession(email: string): Promise<string> {
  await ensureClientSessionsTable();
  const token = crypto.randomBytes(32).toString("hex");
  const lower = email.toLowerCase();
  await sql`INSERT INTO client_sessions (token, email) VALUES (${token}, ${lower})`;
  return token;
}

export async function getClientSession(): Promise<ClientSession | null> {
  const store = await cookies();
  const token = store.get(CLIENT_COOKIE)?.value;
  if (!token) return null;
  return getClientSessionByToken(token);
}

export async function getClientSessionByToken(
  token: string
): Promise<ClientSession | null> {
  await ensureClientSessionsTable();
  const rows = await sql`SELECT email FROM client_sessions WHERE token = ${token} LIMIT 1`;
  if (rows.length === 0) return null;
  const email = String(rows[0].email).toLowerCase();

  const subs = await sql`
    SELECT id, first_name FROM submissions
    WHERE LOWER(contact) = ${email}
    ORDER BY created_at DESC
  `;
  if (subs.length === 0) return null;

  await sql`UPDATE client_sessions SET last_seen_at = NOW() WHERE token = ${token}`;

  return {
    email,
    firstName: String(subs[0].first_name),
    submissionIds: subs.map((s) => Number(s.id)),
  };
}

export async function setClientCookie(token: string) {
  const store = await cookies();
  store.set(CLIENT_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function clearClientCookie() {
  const store = await cookies();
  store.delete(CLIENT_COOKIE);
}
