import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // On admin subdomain, redirect root to /admin
  if (host.startsWith("admin.") && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
