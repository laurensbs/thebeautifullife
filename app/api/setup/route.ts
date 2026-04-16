import { NextResponse } from "next/server";
import { setupDatabase } from "@/lib/setup-db";

export async function POST() {
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
