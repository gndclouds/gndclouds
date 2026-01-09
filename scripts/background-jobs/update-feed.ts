/**
 * Background job to update feed data
 * This script fetches data from all sources and updates feed.json
 * Can be run via:
 * - GitHub Actions (scheduled)
 * - Vercel Cron Jobs
 * - Manual execution: npm run update-feed
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

import { getAllMarkdownFiles, getAllUnsplashImages } from "@/queries/all";
import { getBlueskyPosts } from "@/queries/bluesky";
import { getArenaActivity } from "@/queries/arena";
import { getAllGitHubActivity } from "@/queries/github";
import { getAllJournals } from "@/queries/journals";
import { getAllNotesAndResearch } from "@/queries/notes";
import { getAllProjects } from "@/queries/projects";
import fs from "fs/promises";
import path from "path";

// Helper function to get date N days ago in UTC
function getDateNDaysAgo(n: number) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - n);
  return date;
}

// Helper function to format date as yyyy-mm-dd
function formatDateYYYYMMDD(date: Date) {
  return date.toISOString().split("T")[0];
}

const FULL_IMPORT = process.env.FULL_IMPORT === "true";
const DAYS_BACK = process.env.DAYS_BACK
  ? parseInt(process.env.DAYS_BACK, 10)
  : 365; // Default to 1 year
const startDate = getDateNDaysAgo(DAYS_BACK);

async function updateFeed() {
  console.log("🔄 Starting feed update job...");
  console.log(`📅 Fetching content since: ${formatDateYYYYMMDD(startDate)}`);
  console.log(`📦 Full import mode: ${FULL_IMPORT ? "enabled" : "disabled"}`);

  const startTime = Date.now();

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

  // Process results
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

  // Store ALL items in cache (no date filtering during generation)
  // Date filtering happens when reading from cache
  const sortedItems = allItems.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Generate feed data with metadata
  const feedData = {
    generatedAt: formatDateYYYYMMDD(new Date()),
    startDate: formatDateYYYYMMDD(startDate),
    endDate: formatDateYYYYMMDD(new Date()),
    items: sortedItems, // Store ALL items, filtering happens when reading
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

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log("✅ Feed data updated successfully!");
  console.log(`📁 Saved to: ${outputPath}`);
  console.log(`📊 Total items: ${sortedItems.length}`);
  console.log(`⏱️  Duration: ${duration}s`);
  console.log("📈 Content type distribution:", feedData.stats.byType);
  console.log("🔗 Source stats:", feedData.stats.sourceStats);

  // Log any errors
  const errors = Object.entries(feedData.stats.errors).filter(
    ([_, error]) => error
  );
  if (errors.length > 0) {
    console.warn("⚠️  Errors encountered:", errors);
  }

  return feedData;
}

// Run if called directly
if (require.main === module) {
  updateFeed()
    .then(() => {
      console.log("✨ Background job completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Background job failed:", error);
      process.exit(1);
    });
}

export default updateFeed;
