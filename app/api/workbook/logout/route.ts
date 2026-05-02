import { NextRequest, NextResponse } from "next/server";
import { clearWorkbookCookie } from "@/lib/workbook-auth";

export async function GET(request: NextRequest) {
  await clearWorkbookCookie();
  const origin = request.nextUrl.origin;
  return NextResponse.redirect(`${origin}/werkboek/login`);
}
