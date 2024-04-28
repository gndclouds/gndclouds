import { getAllMarkdownFiles, getAllUnsplashImages } from "@/queries/all";

import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";

export default async function FeedPage() {
  const [data, images] = await Promise.all([
    getAllMarkdownFiles(),
    getAllUnsplashImages("gndclouds"),
  ]);

  const combinedData = [...data, ...images].sort((a, b) => {
    // Assuming 'Post' type has 'publishedAt' and 'UnsplashImage' has 'created_at'
    const dateA =
      "publishedAt" in a
        ? new Date(a.publishedAt).getTime()
        : new Date(a.created_at).getTime();
    const dateB =
      "publishedAt" in b
        ? new Date(b.publishedAt).getTime()
        : new Date(b.created_at).getTime();
    return dateB - dateA;
  });

  return (
    <main>
      <CollectionHero name="Logs" projects={data} allProjects={data} />
      <section>
        <ListView data={data} />
      </section>
    </main>
  );
}
