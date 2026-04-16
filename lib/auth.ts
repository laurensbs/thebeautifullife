import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const secret = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "fallback-secret"
);

export async function verifyCredentials(
  username: string,
  password: string
): Promise<boolean> {
  if (username !== (process.env.ADMIN_USERNAME || "admin")) return false;
  const hash = process.env.ADMIN_PASSWORD_HASH || "";
  return bcrypt.compare(password, hash);
}

export async function createToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(secret);
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function getAuthFromCookies(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return false;
  return verifyToken(token);
}
