import { getAllMarkdownFiles, getAllUnsplashImages } from "@/queries/all";
import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";

interface Image {
  created_at: string;
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
    }));

    const combinedData = [...data, ...enhancedImages].sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });

    // console.log("Server-rendered data:", combinedData);

    return (
      <main className="flex">
        <CollectionHero
          name="Feed"
          projects={combinedData}
          allProjects={combinedData}
        />
        <section>
          <ListView data={combinedData} />
        </section>
      </main>
    );
  } catch (error) {
    console.error("Error loading feed data:", error);
    return <div>Error loading feed data</div>;
  }
}
