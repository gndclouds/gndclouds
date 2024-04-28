import { getAllMarkdownFiles, getAllUnsplashImages } from "@/queries/all";

import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";

export default async function FeedPage() {
  const [data, images] = await Promise.all([
    getAllMarkdownFiles(),
    getAllUnsplashImages("gndclouds"),
  ]);

  const combinedData = [...data, ...images].sort((a, b) => {
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
      <CollectionHero name="Newsletters" projects={data} allProjects={data} />
      <section>
        <ListView data={data} />
      </section>
    </main>
  );
}
