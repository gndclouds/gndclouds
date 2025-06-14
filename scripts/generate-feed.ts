import { getAllMarkdownFiles, getAllUnsplashImages } from "@/queries/all";
import { getBlueskyPosts } from "@/queries/bluesky";
import { getArenaActivity } from "@/queries/arena";
import { getGitHubActivity } from "@/queries/github";
import fs from "fs/promises";
import path from "path";

// Helper function to get date 30 days ago
function getDate30DaysAgo() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString();
}

async function generateFeedData() {
  try {
    console.log("Starting monthly feed data generation...");
    const startDate = getDate30DaysAgo();
    console.log(`Fetching content since: ${startDate}`);

    // Fetch data from different sources
    const [
      markdownData,
      unsplashImages,
      blueskyPosts,
      arenaActivity,
      githubActivity,
    ] = await Promise.allSettled([
      getAllMarkdownFiles(),
      getAllUnsplashImages("gndclouds"),
      getBlueskyPosts("gndclouds.earth"),
      getArenaActivity("gndclouds"),
      getGitHubActivity("gndclouds"),
    ]);

    // Process each data source
    const data = markdownData.status === "fulfilled" ? markdownData.value : [];
    const images =
      unsplashImages.status === "fulfilled" ? unsplashImages.value : [];
    const bskyPosts =
      blueskyPosts.status === "fulfilled" ? blueskyPosts.value : [];
    const arenaItems =
      arenaActivity.status === "fulfilled" ? arenaActivity.value : [];
    const githubItems =
      githubActivity.status === "fulfilled" ? githubActivity.value : [];

    // Process and enhance the data
    const enhancedImages = images.map((image: any) => ({
      ...image,
      type: "Photography",
      publishedAt: image.created_at,
      description: image.description || "No description available",
    }));

    const enhancedBlueskyPosts = bskyPosts.map((post: any) => ({
      ...post,
      title: post.text.substring(0, 60) + (post.text.length > 60 ? "..." : ""),
      description: post.text,
    }));

    const enhancedArenaActivity = arenaItems.map((item: any) => ({
      ...item,
      title: item.title || "Untitled",
      description:
        item.description || item.content || "No description available",
    }));

    // Combine all data
    const allItems = [
      ...data,
      ...enhancedImages,
      ...enhancedBlueskyPosts,
      ...enhancedArenaActivity,
      ...githubItems,
    ];

    // Filter items from the last 30 days
    const recentItems = allItems.filter((item) => {
      if (!item.publishedAt) return false;
      const itemDate = new Date(item.publishedAt);
      const cutoffDate = new Date(startDate);
      return itemDate >= cutoffDate;
    });

    // Sort by date
    const sortedItems = recentItems.sort((a, b) => {
      try {
        if (!a.publishedAt) return 1;
        if (!b.publishedAt) return -1;

        const dateA = new Date(a.publishedAt).getTime();
        const dateB = new Date(b.publishedAt).getTime();

        if (isNaN(dateA) && isNaN(dateB)) return 0;
        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;

        return dateB - dateA;
      } catch (error) {
        console.error("Error sorting items by date:", error);
        return 0;
      }
    });

    // Add metadata
    const feedData = {
      generatedAt: new Date().toISOString(),
      startDate: startDate,
      endDate: new Date().toISOString(),
      items: sortedItems,
      stats: {
        totalItems: sortedItems.length,
        byType: sortedItems.reduce((acc: any, item: any) => {
          const type = Array.isArray(item.type) ? item.type[0] : item.type;
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {}),
      },
    };

    // Write to JSON file
    const outputPath = path.join(process.cwd(), "public", "data", "feed.json");
    await fs.writeFile(outputPath, JSON.stringify(feedData, null, 2));

    console.log(`Feed data generated successfully at ${outputPath}`);
    console.log(`Generated ${sortedItems.length} items from the last 30 days`);
    console.log("Content type distribution:", feedData.stats.byType);
  } catch (error) {
    console.error("Error generating feed data:", error);
    process.exit(1);
  }
}

// Run the generation
generateFeedData();
