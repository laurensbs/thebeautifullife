import { NextResponse } from "next/server";
import { setupDatabase } from "@/lib/setup-db";

async function runSetup() {
  try {
    await setupDatabase();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DB setup error:", error);
    return NextResponse.json(
      { error: "Database setup failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return runSetup();
}

export async function POST() {
  return runSetup();
}
