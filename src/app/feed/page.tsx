import { getAllMarkdownFiles, getAllUnsplashImages } from "@/queries/all";
import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";

interface Image {
  created_at: string;
  description?: string; // Ensure description is optional
  // include other properties that an image object might have
}

export default async function FeedPage() {
  try {
    const [data, images] = await Promise.all([
      getAllMarkdownFiles(),
      getAllUnsplashImages("gndclouds"),
    ]);

    const enhancedImages = images.map((image: Image) => ({
      ...image,
      type: "Photography",
      publishedAt: image.created_at,
      description: image.description || "No description available", // Provide a default value
    }));

    const combinedData = [...data, ...enhancedImages].sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });

    return (
      <main className="flex">
        <CollectionHero
          name="Feed"
          projects={combinedData}
          allProjects={combinedData}
        />
        <section className="p-4">
          <ListView data={combinedData} />
        </section>
      </main>
    );
  } catch (error) {
    console.error("Error loading feed data:", error);
    return <div>Error loading feed data</div>;
  }
}
