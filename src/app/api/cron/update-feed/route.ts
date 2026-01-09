/**
 * API endpoint for Vercel Cron Jobs to trigger feed updates
 * This endpoint runs the background job to update feed.json
 *
 * Note: For Vercel, this will use the same logic as the background job script
 * but executed directly in the serverless function context.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAllMarkdownFiles, getAllUnsplashImages } from "@/queries/all";
import { getBlueskyPosts } from "@/queries/bluesky";
import { getArenaActivity } from "@/queries/arena";
import { getAllGitHubActivity } from "@/queries/github";
import { getAllJournals } from "@/queries/journals";
import { getAllNotesAndResearch } from "@/queries/notes";
import { getAllProjects } from "@/queries/projects";
import fs from "fs/promises";
import path from "path";

// Helper functions
function getDateNDaysAgo(n: number) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - n);
  return date;
}

function formatDateYYYYMMDD(date: Date) {
  return date.toISOString().split("T")[0];
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function updateFeed() {
  const FULL_IMPORT = process.env.FULL_IMPORT === "true";
  const DAYS_BACK = process.env.DAYS_BACK
    ? parseInt(process.env.DAYS_BACK, 10)
    : 365;
  const startDate = getDateNDaysAgo(DAYS_BACK);

  console.log("🔄 Starting feed update job...");
  console.log(`📅 Fetching content since: ${formatDateYYYYMMDD(startDate)}`);

  // Fetch data from all sources in parallel
  const [
    unsplashResult,
    blueskyResult,
    arenaResult,
    githubResult,
    journalsResult,
    notesResult,
    projectsResult,
  ] = await Promise.allSettled([
    getAllUnsplashImages("gndclouds"),
    getBlueskyPosts("gndclouds.earth"),
    getArenaActivity("gndclouds"),
    getAllGitHubActivity("gndclouds"),
    getAllJournals(),
    getAllNotesAndResearch(),
    getAllProjects(),
  ]);

  // Process results (same logic as background job script)
  const unsplashItems =
    unsplashResult.status === "fulfilled"
      ? unsplashResult.value.map((img) => ({
          id: `unsplash-${img.id}`,
          type: "photography" as const,
          title: img.title || "Unsplash Photo",
          description: img.alt_description || "",
          publishedAt: img.created_at.split("T")[0],
          image: img.urls.regular,
          url: `https://unsplash.com/photos/${img.id}`,
          source: "unsplash",
        }))
      : [];

  const blueskyItems =
    blueskyResult.status === "fulfilled"
      ? blueskyResult.value.map((post) => ({
          id: `bluesky-${post.uri.split("/").pop()}`,
          type: "bluesky" as const,
          title: post.text?.substring(0, 100) || "Bluesky Post",
          description: post.text || "",
          publishedAt: post.indexedAt.split("T")[0],
          url: `https://bsky.app/profile/${post.author.handle}/post/${post.uri
            .split("/")
            .pop()}`,
          source: "bluesky",
        }))
      : [];

  const arenaItems =
    arenaResult.status === "fulfilled"
      ? arenaResult.value.map((item) => ({
          id: `arena-${item.id}`,
          type: "arena" as const,
          title: item.title || "Arena Item",
          description: item.description || "",
          publishedAt: item.publishedAt.split("T")[0],
          url: item.sourceUrl || item.uri,
          image: item.imageUrl,
          source: "arena",
        }))
      : [];

  const githubItems =
    githubResult.status === "fulfilled"
      ? githubResult.value.map((activity) => ({
          id: `github-${activity.id}`,
          type: "github" as const,
          title: activity.title,
          description: activity.description,
          publishedAt: activity.publishedAt.split("T")[0],
          url: activity.repoUrl,
          source: "github",
        }))
      : [];

  const journalsItems =
    journalsResult.status === "fulfilled"
      ? journalsResult.value.map((journal) => ({
          id: `journal-${journal.slug}`,
          type: "journal" as const,
          title: journal.title,
          description: journal.metadata.description || "",
          publishedAt: journal.publishedAt.split("T")[0],
          slug: journal.slug,
          source: "local",
        }))
      : [];

  const notesItems =
    notesResult.status === "fulfilled"
      ? notesResult.value.map((note) => ({
          id: `note-${note.slug}`,
          type: (note.type[0]?.toLowerCase() || "note") as "note" | "research",
          title: note.title,
          description: note.metadata.description || "",
          publishedAt: note.publishedAt.split("T")[0],
          slug: note.slug,
          source: "local",
        }))
      : [];

  const projectsItems =
    projectsResult.status === "fulfilled"
      ? projectsResult.value.map((project) => ({
          id: `project-${project.slug}`,
          type: "project" as const,
          title: project.title,
          description: project.metadata.description || "",
          publishedAt: project.publishedAt.split("T")[0],
          slug: project.slug,
          tags: project.tags || [],
          source: "local",
        }))
      : [];

  // Combine all items
  const allItems = [
    ...unsplashItems,
    ...blueskyItems,
    ...arenaItems,
    ...githubItems,
    ...journalsItems,
    ...notesItems,
    ...projectsItems,
  ];

  // Sort by date, most recent first
  const sortedItems = allItems.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Generate feed data
  const feedData = {
    generatedAt: formatDateYYYYMMDD(new Date()),
    startDate: formatDateYYYYMMDD(startDate),
    endDate: formatDateYYYYMMDD(new Date()),
    items: sortedItems,
    stats: {
      totalItems: sortedItems.length,
      byType: sortedItems.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      sourceStats: {
        unsplash: unsplashItems.length,
        bluesky: blueskyItems.length,
        arena: arenaItems.length,
        github: githubItems.length,
        local: journalsItems.length + notesItems.length + projectsItems.length,
      },
      errors: {
        unsplash:
          unsplashResult.status === "rejected"
            ? unsplashResult.reason?.message || "Unknown error"
            : null,
        bluesky:
          blueskyResult.status === "rejected"
            ? blueskyResult.reason?.message || "Unknown error"
            : null,
        arena:
          arenaResult.status === "rejected"
            ? arenaResult.reason?.message || "Unknown error"
            : null,
        github:
          githubResult.status === "rejected"
            ? githubResult.reason?.message || "Unknown error"
            : null,
        journals:
          journalsResult.status === "rejected"
            ? journalsResult.reason?.message || "Unknown error"
            : null,
        notes:
          notesResult.status === "rejected"
            ? notesResult.reason?.message || "Unknown error"
            : null,
        projects:
          projectsResult.status === "rejected"
            ? projectsResult.reason?.message || "Unknown error"
            : null,
      },
    },
  };

  // Write to file
  const outputPath = path.join(process.cwd(), "public", "data", "feed.json");
  await fs.writeFile(outputPath, JSON.stringify(feedData, null, 2));

  console.log("✅ Feed data updated successfully!");
  console.log(`📊 Total items: ${sortedItems.length}`);

  return feedData;
}

export async function GET(request: NextRequest) {
  // Verify this is a cron request (optional security check)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("🔄 Cron job triggered: updating feed...");
    const feedData = await updateFeed();

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
