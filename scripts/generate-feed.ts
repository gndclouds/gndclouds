import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
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

// Helper function to get date 30 days ago in UTC
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
  : 30;
const startDate = getDateNDaysAgo(DAYS_BACK);

async function generateFeedData() {
  console.log("Starting monthly feed data generation...");
  console.log("Fetching content since:", formatDateYYYYMMDD(startDate));

  // Fetch data from all sources
  const [
    unsplashImages,
    blueskyPosts,
    arenaActivity,
    githubActivity,
    journals,
    notes,
    projects,
  ] = await Promise.allSettled([
    getAllUnsplashImages("gndclouds"),
    getBlueskyPosts("gndclouds.earth"),
    getArenaActivity("gndclouds"),
    getAllGitHubActivity("gndclouds"),
    getAllJournals(),
    getAllNotesAndResearch(),
    getAllProjects(),
  ]);

  // Process Unsplash images
  const unsplashItems =
    unsplashImages.status === "fulfilled"
      ? unsplashImages.value.map((image) => ({
          id: image.id,
          type: "photography",
          title: image.title || "Unsplash Photo",
          description: image.alt_description || "",
          publishedAt: formatDateYYYYMMDD(new Date(image.created_at)),
          urls: image.urls,
          imageUrl: image.urls.regular,
          photographer: {
            username: "gndclouds",
            name: "gndclouds",
            avatar: `https://images.unsplash.com/profile-${image.id}`,
          },
          uri: `https://unsplash.com/photos/${image.id}`,
        }))
      : [];

  // Process Bluesky posts
  const blueskyItems =
    blueskyPosts.status === "fulfilled"
      ? blueskyPosts.value.map((post) => ({
          id: post.uri,
          type: "bluesky",
          title:
            post.text.slice(0, 100) + (post.text.length > 100 ? "..." : ""),
          description: post.text,
          publishedAt: formatDateYYYYMMDD(new Date(post.indexedAt)),
          uri: `https://bsky.app/profile/${post.author.handle}/post/${post.uri
            .split("/")
            .pop()}`,
          likeCount: post.likeCount || 0,
          repostCount: post.repostCount || 0,
        }))
      : [];

  // Process Are.na activity
  const arenaItems =
    arenaActivity.status === "fulfilled"
      ? arenaActivity.value.map((item) => ({
          id: item.id.toString(),
          type: "arena",
          title: item.title,
          description: item.description,
          publishedAt: formatDateYYYYMMDD(new Date(item.publishedAt)),
          channel: {
            title: item.channelTitle,
            slug: item.channelSlug,
          },
          uri: item.uri,
          author: item.author,
          imageUrl: item.imageUrl,
          sourceUrl: item.sourceUrl,
          embedHtml: item.embedHtml,
        }))
      : [];

  // Process GitHub activity
  const githubItems =
    githubActivity.status === "fulfilled"
      ? githubActivity.value.map((event) => ({
          id: event.id,
          type: "github",
          title: event.title,
          description: event.description,
          publishedAt: formatDateYYYYMMDD(new Date(event.publishedAt)),
          repoName: event.repoName,
          repoUrl: event.repoUrl,
          uri: event.uri,
        }))
      : [];

  // Process local content (journals, notes, projects)
  const localItems = [
    ...(journals.status === "fulfilled"
      ? journals.value.map((item) => ({
          id: item.slug,
          type: "journal",
          title: item.title,
          description: item.metadata.description || "",
          publishedAt: formatDateYYYYMMDD(new Date(item.publishedAt)),
          slug: item.slug,
          tags: item.tags || [],
          categories: item.categories || [],
        }))
      : []),
    ...(notes.status === "fulfilled"
      ? notes.value.map((item) => ({
          id: item.slug,
          type: item.type[0].toLowerCase(),
          title: item.title,
          description: item.metadata.description || "",
          publishedAt: formatDateYYYYMMDD(new Date(item.publishedAt)),
          slug: item.slug,
          tags: item.tags || [],
          categories: item.categories || [],
        }))
      : []),
    ...(projects.status === "fulfilled"
      ? projects.value.map((item) => ({
          id: item.slug,
          type: "project",
          title: item.title,
          description: item.metadata.description || "",
          publishedAt: formatDateYYYYMMDD(new Date(item.publishedAt)),
          slug: item.slug,
          tags: item.tags || [],
          categories: item.categories || [],
          url: item.metadata.url || "",
          heroImage: item.metadata.heroImage || "",
        }))
      : []),
  ];

  // Combine all items and filter by date
  const allItems = [
    ...unsplashItems,
    ...blueskyItems,
    ...arenaItems,
    ...githubItems,
    ...localItems,
  ];
  console.log(`Total items before filtering: ${allItems.length}`);
  console.log(`Unsplash items: ${unsplashItems.length}`);
  console.log(`Bluesky items: ${blueskyItems.length}`);
  console.log(`Are.na items: ${arenaItems.length}`);
  console.log(`GitHub items: ${githubItems.length}`);
  console.log(`Local items: ${localItems.length}`);

  // Filter items from the last N days unless FULL_IMPORT is set
  const recentItems = FULL_IMPORT
    ? allItems
    : allItems.filter((item) => {
        const itemDate = new Date(item.publishedAt);
        const isRecent = itemDate >= startDate;
        if (!isRecent) {
          console.log(
            `Filtered out item from ${formatDateYYYYMMDD(itemDate)} (type: ${
              item.type
            })`
          );
        }
        return isRecent;
      });

  // Sort by date, most recent first
  const sortedItems = recentItems.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Generate feed data with metadata
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
    },
  };

  // Write to file
  const outputPath = path.join(process.cwd(), "public", "data", "feed.json");
  await fs.writeFile(outputPath, JSON.stringify(feedData, null, 2));
  console.log("Feed data generated successfully at", outputPath);
  console.log(
    `Generated ${sortedItems.length} items from the last ${DAYS_BACK} days`
  );
  console.log("Content type distribution:", feedData.stats.byType);
}

// Run the script
generateFeedData().catch(console.error);
