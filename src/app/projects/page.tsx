import { getAllMarkdownFiles, getAllUnsplashImages } from "@/queries/all";

import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";

export default async function NotesPage() {
  const [data, images] = await Promise.all([
    getAllMarkdownFiles(),
    getAllUnsplashImages("gndclouds"),
  ]);

  const combinedData = [...data, ...images]
    .filter((item) => item.type && item.type.includes("Project"))
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
