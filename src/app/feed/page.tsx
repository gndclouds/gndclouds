import fs from "fs/promises";
import path from "path";
import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";
import FeedWithFilter from "@/components/feed-with-filter";

// Vercel will check daily, but won't rebuild unless the JSON file changes
export const revalidate = 86400; // 24 hours in seconds

// No revalidation needed as data is updated daily via GitHub Action
export const dynamic = "force-static";

export default async function FeedPage() {
  try {
    // Read the feed data from the JSON file
    const feedPath = path.join(process.cwd(), "public", "data", "feed.json");
    const feedData = JSON.parse(await fs.readFile(feedPath, "utf-8"));

    console.log(`Feed data last generated at: ${feedData.generatedAt}`);
    console.log(`Total items: ${feedData.items.length}`);

    return (
      <div className="flex flex-col">
        <CollectionHero
          name="Feed"
          projects={feedData.items}
          allProjects={feedData.items}
        />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Latest Updates</h2>
            <FeedWithFilter data={feedData.items} />
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error loading feed data:", error);
    return <div>Error loading feed data</div>;
  }
}
