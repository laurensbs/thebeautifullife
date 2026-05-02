import { NextRequest, NextResponse } from "next/server";
import { clearClientCookie } from "@/lib/client-auth";

export async function GET(request: NextRequest) {
  await clearClientCookie();
  return NextResponse.redirect(`${request.nextUrl.origin}/mijn-pad/login`);
}
