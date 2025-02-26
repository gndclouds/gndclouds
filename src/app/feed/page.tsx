import { getAllMarkdownFiles, getAllUnsplashImages } from "@/queries/all";
import { getBlueskyPosts } from "@/queries/bluesky";
import { getArenaActivity } from "@/queries/arena";
import { getGitHubActivity } from "@/queries/github";
import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";
import FeedWithFilter from "@/components/feed-with-filter";

interface Image {
  created_at: string;
  description?: string; // Ensure description is optional
  // include other properties that an image object might have
}

export default async function FeedPage() {
  try {
    // Fetch data from different sources with error handling for each
    const [
      markdownData,
      unsplashImages,
      blueskyPosts,
      arenaActivity,
      githubActivity,
    ] = await Promise.allSettled([
      getAllMarkdownFiles(),
      getAllUnsplashImages("gndclouds"),
      getBlueskyPosts("gndclouds.earth"), // Use the correct Bluesky handle
      getArenaActivity("gndclouds"), // Use your Are.na username
      getGitHubActivity("gndclouds"), // Use your GitHub username
    ]);

    // Process markdown data
    const data = markdownData.status === "fulfilled" ? markdownData.value : [];
    if (markdownData.status === "rejected") {
      console.error("Error loading markdown files:", markdownData.reason);
    }

    // Process Unsplash images
    const images =
      unsplashImages.status === "fulfilled" ? unsplashImages.value : [];
    if (unsplashImages.status === "rejected") {
      console.error("Error loading Unsplash images:", unsplashImages.reason);
    }

    // Process Bluesky posts
    const bskyPosts =
      blueskyPosts.status === "fulfilled" ? blueskyPosts.value : [];
    if (blueskyPosts.status === "rejected") {
      console.error("Error loading Bluesky posts:", blueskyPosts.reason);
    }

    // Process Are.na activity
    const arenaItems =
      arenaActivity.status === "fulfilled" ? arenaActivity.value : [];
    if (arenaActivity.status === "rejected") {
      console.error("Error loading Are.na activity:", arenaActivity.reason);
    }

    // Process GitHub activity
    const githubItems =
      githubActivity.status === "fulfilled" ? githubActivity.value : [];
    if (githubActivity.status === "rejected") {
      console.error("Error loading GitHub activity:", githubActivity.reason);
    }

    // Debug: Log a sample Unsplash image to check its date format
    if (images.length > 0) {
      console.log("Sample Unsplash image date:", images[0].created_at);
    }

    const enhancedImages = images.map((image: Image) => ({
      ...image,
      type: "Photography",
      publishedAt: image.created_at, // Ensure this is in a standard format
      description: image.description || "No description available", // Provide a default value
    }));

    // Format Bluesky posts to match the feed item structure
    const enhancedBlueskyPosts = bskyPosts.map((post) => ({
      ...post,
      title: post.text.substring(0, 60) + (post.text.length > 60 ? "..." : ""),
      description: post.text,
    }));

    // Format Are.na activity to match the feed item structure
    const enhancedArenaActivity = arenaItems.map((item) => ({
      ...item,
      // Ensure we have all the required fields for the feed
      title: item.title || "Untitled",
      description:
        item.description || item.content || "No description available",
    }));

    // Format GitHub activity to match the feed item structure
    const enhancedGitHubActivity = githubItems.map((item) => ({
      ...item,
      // GitHub items already have title and description from our formatting function
    }));

    // Debug: Log a sample of each data type to check date formats
    console.log("Data sources with dates:");
    if (data.length > 0) console.log("Markdown:", data[0].publishedAt);
    if (enhancedImages.length > 0)
      console.log("Unsplash:", enhancedImages[0].publishedAt);
    if (enhancedBlueskyPosts.length > 0)
      console.log("Bluesky:", enhancedBlueskyPosts[0].publishedAt);
    if (enhancedArenaActivity.length > 0)
      console.log("Are.na:", enhancedArenaActivity[0].publishedAt);
    if (enhancedGitHubActivity.length > 0)
      console.log("GitHub:", enhancedGitHubActivity[0].publishedAt);

    // Sort all data by date with improved error handling
    const combinedData = [
      ...data,
      ...enhancedImages,
      ...enhancedBlueskyPosts,
      ...enhancedArenaActivity,
      ...enhancedGitHubActivity,
    ].sort((a, b) => {
      try {
        // Ensure we have valid dates to compare
        if (!a.publishedAt) return 1; // Items without dates go to the end
        if (!b.publishedAt) return -1;

        const dateA = new Date(a.publishedAt).getTime();
        const dateB = new Date(b.publishedAt).getTime();

        // Check if dates are valid
        if (isNaN(dateA) && isNaN(dateB)) return 0;
        if (isNaN(dateA)) return 1; // Invalid dates go to the end
        if (isNaN(dateB)) return -1;

        return dateB - dateA; // Sort newest to oldest
      } catch (error) {
        console.error("Error sorting items by date:", error);
        return 0; // Keep original order if there's an error
      }
    });

    return (
      <div className="flex flex-col">
        <CollectionHero
          name="Feed"
          projects={combinedData}
          allProjects={combinedData}
        />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Latest Updates</h2>
            <FeedWithFilter data={combinedData} />
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error loading feed data:", error);
    return <div>Error loading feed data</div>;
  }
}
