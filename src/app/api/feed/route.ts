import { NextRequest, NextResponse } from "next/server";
import { getAllMarkdownFiles, getAllUnsplashImages } from "@/queries/all";
import { getBlueskyPosts } from "@/queries/bluesky";
import { getArenaActivity } from "@/queries/arena";
import { getAllGitHubActivity } from "@/queries/github";
import { getAllJournals } from "@/queries/journals";
import { getAllNotesAndResearch } from "@/queries/notes";
import { getAllProjects } from "@/queries/projects";
import { getAllFragments } from "@/queries/fragments";
import { getAllLogs } from "@/queries/logs";
import { getAllStudies } from "@/queries/studies";
import { getAllSystems } from "@/queries/systems";
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

// Cache file path
const CACHE_FILE_PATH = path.join(process.cwd(), "public", "data", "feed.json");
const CACHE_MAX_AGE = 15 * 60 * 1000; // 15 minutes in milliseconds

export const dynamic = "force-dynamic";

// Load cached feed data
async function loadCachedFeed(): Promise<any | null> {
  try {
    const fileContent = await fs.readFile(CACHE_FILE_PATH, "utf-8");
    const cachedData = JSON.parse(fileContent);

    // Check if cache is still valid
    const cacheTime = new Date(cachedData.generatedAt).getTime();
    const cacheAge = Date.now() - cacheTime;
    if (cacheAge < CACHE_MAX_AGE) {
      console.log(
        `Using cached feed data (age: ${Math.round(cacheAge / 1000)}s)`
      );
      return cachedData;
    }

    console.log(
      `Cache expired (age: ${Math.round(cacheAge / 1000)}s), will refresh`
    );
    return null;
  } catch (error) {
    console.log("No cache file found or error reading cache");
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const daysBack = parseInt(searchParams.get("days") || "365", 10); // Default to 1 year
    const forceRefresh = searchParams.get("refresh") === "true";
    const skipDateFilter = searchParams.get("skipDateFilter") === "true";

    // Try to load from cache first (unless force refresh)
    if (!forceRefresh) {
      const cachedData = await loadCachedFeed();
      if (cachedData) {
        // If skipDateFilter is true, return all items from cache
        if (skipDateFilter) {
          return NextResponse.json(cachedData, {
            headers: {
              "Cache-Control":
                "public, s-maxage=300, stale-while-revalidate=600",
            },
          });
        }

        // Apply date filtering if needed (but always include projects)
        const startDate = getDateNDaysAgo(daysBack);
        const filterDateStr = startDate.toISOString().split("T")[0];
        const filterDate = new Date(filterDateStr + "T00:00:00Z");

        const filteredItems = cachedData.items.filter((item: any) => {
          if (!item.publishedAt) return false;

          // Always include projects regardless of date
          if (item.type === "project") {
            return true;
          }

          const itemDateStr = item.publishedAt.split("T")[0];
          const itemDate = new Date(itemDateStr + "T00:00:00Z");
          return itemDate >= filterDate;
        });

        // Recalculate stats based on filtered items
        const filteredStats = {
          ...cachedData.stats,
          totalItems: filteredItems.length,
          byType: filteredItems.reduce(
            (acc: Record<string, number>, item: any) => {
              acc[item.type] = (acc[item.type] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>
          ),
        };

        return NextResponse.json(
          {
            ...cachedData,
            items: filteredItems,
            stats: filteredStats,
          },
          {
            headers: {
              "Cache-Control":
                "public, s-maxage=300, stale-while-revalidate=600",
            },
          }
        );
      }
    }

    const startDate = getDateNDaysAgo(daysBack);

    console.log(
      `Fetching fresh feed data for last ${daysBack} days since: ${formatDateYYYYMMDD(
        startDate
      )}`
    );

    // Fetch data from all sources with error handling
    const [
      unsplashImages,
      blueskyPosts,
      arenaActivity,
      githubActivity,
      journals,
      notes,
      projects,
      fragments,
      logs,
      studies,
      systems,
    ] = await Promise.allSettled([
      getAllUnsplashImages("gndclouds"),
      getBlueskyPosts("gndclouds.earth"),
      getArenaActivity("gndclouds"),
      getAllGitHubActivity("gndclouds"),
      getAllJournals(),
      getAllNotesAndResearch(),
      getAllProjects(),
      getAllFragments(),
      getAllLogs(),
      getAllStudies(),
      getAllSystems(),
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
            author: post.author,
            images: post.images || [],
            isRepost: post.isRepost || false,
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

    // Process local content (journals, notes, projects, fragments, logs, studies, systems)
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
      ...(fragments.status === "fulfilled"
        ? fragments.value.map((item) => ({
            id: item.slug,
            type: "fragment",
            title: item.title,
            description: item.metadata.description || "",
            publishedAt: formatDateYYYYMMDD(new Date(item.publishedAt)),
            slug: item.slug,
            tags: item.tags || [],
            categories: item.categories || [],
          }))
        : []),
      ...(logs.status === "fulfilled"
        ? logs.value.map((item) => ({
            id: item.slug,
            type: "log",
            title: item.title,
            description: item.metadata.description || "",
            publishedAt: formatDateYYYYMMDD(new Date(item.publishedAt)),
            slug: item.slug,
            tags: item.tags || [],
            categories: item.categories || [],
          }))
        : []),
      ...(studies.status === "fulfilled"
        ? studies.value.map((item) => ({
            id: item.slug,
            type: "study",
            title: item.title,
            description: item.metadata.description || "",
            publishedAt: formatDateYYYYMMDD(new Date(item.publishedAt)),
            slug: item.slug,
            tags: item.tags || [],
            categories: item.categories || [],
          }))
        : []),
      ...(systems.status === "fulfilled"
        ? systems.value.map((item) => ({
            id: item.slug,
            type: "system",
            title: item.title,
            description: item.metadata.description || "",
            publishedAt: formatDateYYYYMMDD(new Date(item.publishedAt)),
            slug: item.slug,
            tags: item.tags || [],
            categories: item.categories || [],
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

    // Filter items from the last N days (or skip if requested)
    let recentItems: typeof allItems;
    const filterDateStr = startDate.toISOString().split("T")[0];

    if (skipDateFilter) {
      console.log("Skipping date filter - showing all items");
      recentItems = allItems.filter((item) => {
        // Still exclude items without publishedAt for sorting purposes
        return !!item.publishedAt;
      });
    } else {
      const filterDate = new Date(filterDateStr + "T00:00:00Z");

      console.log(
        `Filtering items from ${filterDateStr} onwards (last ${daysBack} days)`
      );

      recentItems = allItems.filter((item) => {
        if (!item.publishedAt) {
          console.warn(`Item missing publishedAt:`, item.id, item.title);
          return false; // Exclude items without a publishedAt date
        }

        // Always include projects regardless of date (they're portfolio items, not time-sensitive)
        if (item.type === "project") {
          return true;
        }

        // Parse the date string (YYYY-MM-DD) and compare dates only (ignore time)
        const itemDateStr = item.publishedAt.split("T")[0]; // Get just the date part
        const itemDate = new Date(itemDateStr + "T00:00:00Z"); // Set to UTC midnight

        const isIncluded = itemDate >= filterDate;

        // Log first few items to debug
        if (allItems.indexOf(item) < 5) {
          console.log(
            `Item date check: ${itemDateStr} >= ${filterDateStr}? ${isIncluded} (${item.type})`
          );
        }

        return isIncluded;
      });
    }

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
        sourceStats: {
          unsplash: unsplashItems.length,
          bluesky: blueskyItems.length,
          arena: arenaItems.length,
          github: githubItems.length,
          local: localItems.length,
        },
        errors: {
          unsplash:
            unsplashImages.status === "rejected"
              ? unsplashImages.reason?.message
              : null,
          bluesky:
            blueskyPosts.status === "rejected"
              ? blueskyPosts.reason?.message
              : null,
          arena:
            arenaActivity.status === "rejected"
              ? arenaActivity.reason?.message
              : null,
          github:
            githubActivity.status === "rejected"
              ? githubActivity.reason?.message
              : null,
          journals:
            journals.status === "rejected" ? journals.reason?.message : null,
          notes: notes.status === "rejected" ? notes.reason?.message : null,
          projects:
            projects.status === "rejected" ? projects.reason?.message : null,
          fragments:
            fragments.status === "rejected"
              ? fragments.reason?.message
              : null,
          logs: logs.status === "rejected" ? logs.reason?.message : null,
          studies:
            studies.status === "rejected" ? studies.reason?.message : null,
          systems:
            systems.status === "rejected" ? systems.reason?.message : null,
        },
      },
    };

    console.log(
      `Generated ${sortedItems.length} items from the last ${daysBack} days`
    );
    console.log("Content type distribution:", feedData.stats.byType);
    console.log("Source stats:", feedData.stats.sourceStats);
    console.log("Total items before filtering:", allItems.length);
    console.log("Items after date filtering:", recentItems.length);

    // Show date range of items
    if (allItems.length > 0) {
      const dates = allItems
        .map((item) => item.publishedAt)
        .filter(Boolean)
        .sort();
      if (dates.length > 0) {
        console.log(
          `Date range in all items: ${dates[0]} to ${dates[dates.length - 1]}`
        );
        if (!skipDateFilter) {
          console.log(`Filter cutoff date: ${filterDateStr}`);
        }
      }

      // Show breakdown by source
      console.log("Items by source before filtering:", {
        unsplash: unsplashItems.length,
        bluesky: blueskyItems.length,
        arena: arenaItems.length,
        github: githubItems.length,
        journals: journals.status === "fulfilled" ? journals.value.length : 0,
        notes: notes.status === "fulfilled" ? notes.value.length : 0,
        projects: projects.status === "fulfilled" ? projects.value.length : 0,
        fragments:
          fragments.status === "fulfilled" ? fragments.value.length : 0,
        logs: logs.status === "fulfilled" ? logs.value.length : 0,
        studies: studies.status === "fulfilled" ? studies.value.length : 0,
        systems: systems.status === "fulfilled" ? systems.value.length : 0,
      });
    }

    // Log any errors
    const errors = Object.entries(feedData.stats.errors).filter(
      ([_, error]) => error
    );
    if (errors.length > 0) {
      console.warn("Feed data source errors:", errors);
    }

    // Save to cache file for future requests
    try {
      await fs.mkdir(path.dirname(CACHE_FILE_PATH), { recursive: true });
      await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(feedData, null, 2));
      console.log(`Feed data cached to ${CACHE_FILE_PATH}`);
    } catch (error) {
      console.warn("Failed to write cache file:", error);
    }

    return NextResponse.json(feedData, {
      headers: {
        "Cache-Control": forceRefresh
          ? "no-cache, no-store, must-revalidate"
          : "public, s-maxage=300, stale-while-revalidate=600", // 5 min cache, 10 min stale
      },
    });
  } catch (error) {
    console.error("Error generating feed data:", error);
    return NextResponse.json(
      {
        error: "Failed to generate feed data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
