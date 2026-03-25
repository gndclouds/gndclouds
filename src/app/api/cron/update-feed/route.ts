/**
 * API endpoint for Vercel Cron Jobs to trigger feed updates.
 * Uses the same pipeline as `npm run generate-feed` / `scripts/generate-feed.ts`.
 */

import { NextRequest, NextResponse } from "next/server";
import { generateFeedData } from "../../../../../scripts/generate-feed";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("🔄 Cron job triggered: updating feed...");
    const feedData = await generateFeedData();

    return NextResponse.json({
      success: true,
      message: "Feed updated successfully",
      stats: {
        totalItems: feedData.stats.totalItems,
        byType: feedData.stats.byType,
        sourceStats: feedData.stats.sourceStats,
      },
      generatedAt: feedData.generatedAt,
    });
  } catch (error) {
    console.error("❌ Cron job failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
