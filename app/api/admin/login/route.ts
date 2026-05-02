import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, createToken } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Strikt: 8 inlogpogingen per IP per 15 min op de admin login.
    const limited = await checkRateLimit(request, {
      bucket: "admin-login",
      max: 8,
      windowMs: 15 * 60_000,
    });
    if (limited) return limited;

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Vul gebruikersnaam en wachtwoord in" },
        { status: 400 }
      );
    }

    const valid = await verifyCredentials(username, password);
    if (!valid) {
      return NextResponse.json(
        { error: "Ongeldige inloggegevens" },
        { status: 401 }
      );
    }

    const token = await createToken();

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login mislukt" }, { status: 500 });
  }
}
