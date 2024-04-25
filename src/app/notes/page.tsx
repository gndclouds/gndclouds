import { getAllMarkdownFiles, getAllUnsplashImages } from "@/queries/all";

import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";

export default async function NotesPage() {
  const [data, images] = await Promise.all([
    getAllMarkdownFiles(),
    getAllUnsplashImages("gndclouds"),
  ]);

  const combinedData = [...data, ...images].sort(
    (a, b) =>
      new Date(b.publishedAt || b.created_at).getTime() -
      new Date(a.publishedAt || a.created_at).getTime()
  );

  return (
    <main>
      <CollectionHero name="Notes" projects={data} allProjects={data} />
      <section>
        <ListView data={data} />
      </section>
    </main>
  );
}
