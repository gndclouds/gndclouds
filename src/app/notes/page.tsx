import { getAllMarkdownFiles, getAllUnsplashImages } from "@/queries/all";

import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";

export default async function NotesPage() {
  const [data, images] = await Promise.all([
    getAllMarkdownFiles(),
    getAllUnsplashImages("gndclouds"),
  ]);
  console.log(data);
  const combinedData = [...data, ...images]
    .filter((item) => {
      if ("type" in item) {
        if (!item.type) {
          console.log("Item without type:", item);
          return false;
        }
        return true;
      }
      return false;
    })
    .map((item) => ({
      ...item,
      description: item.description || "No description available", // Provide a default value
    }))
    .sort((a, b) => {
      const dateA =
        "created_at" in a
          ? new Date(a.created_at).getTime()
          : new Date(a.publishedAt).getTime();
      const dateB =
        "created_at" in b
          ? new Date(b.created_at).getTime()
          : new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });

  return (
    <main>
      <CollectionHero
        name="Notes"
        projects={combinedData}
        allProjects={combinedData}
      />
      <section>
        <ListView data={combinedData} />
      </section>
    </main>
  );
}
