import { NextResponse } from "next/server";

// TEMP: Skipping Readwise fetch to avoid build timeouts and API calls
export async function GET(request: Request) {
  return NextResponse.json([]);
}
