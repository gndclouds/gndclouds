import { getAllMarkdownFiles, getAllUnsplashImages } from "@/queries/all";

import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";

type Post = {
  // ... other properties ...
  description?: string; // Make description optional
};

type UnsplashImage = {
  // ... properties ...
  description: string;
};

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
      description:
        "description" in item ? item.description : "No description available", // Check if description exists
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
  console.log(combinedData);

  return (
    <main>
      <CollectionHero
        name="Projects"
        projects={combinedData}
        allProjects={combinedData}
      />
      <section className="flex flex-col gap-4">
        <ListView data={combinedData} />
      </section>
    </main>
  );
}
