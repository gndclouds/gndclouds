import { getAllMarkdownFiles, getAllUnsplashImages } from "@/queries/all";

import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";

export default async function FeedPage() {
  // const data = await getAllMarkdownFiles();
  const [data, images] = await Promise.all([
    getAllMarkdownFiles(),
    getAllUnsplashImages("gndclouds"),
  ]);
  // console.log("data", data);

  // Enhance images with a type property and normalize date fields
  const enhancedImages = images.map((image) => ({
    ...image,
    type: "Photography",
    publishedAt: image.created_at,
  }));
  // console.log("enhancedImages", enhancedImages);

  // Combine and sort data and images based on date
  const combinedData = [...data, ...enhancedImages].sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    return dateB - dateA;
  });

  return (
    <main>
      <CollectionHero name="Feed" projects={data} allProjects={data} />
      <section>
        <ListView data={data} />
      </section>
    </main>
  );
}
