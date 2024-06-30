import { getAllMarkdownFiles } from "@/queries/logs";

import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";

export default async function FeedPage() {
  const data = await getAllMarkdownFiles();

  // console.log("Data received from getAllMarkdownFiles:", data);

  const sortedData = data.sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    return dateB - dateA;
  });

  console.log("Data count after sorting:", sortedData.length);

  return (
    <main>
      <CollectionHero
        name="Logs"
        projects={sortedData}
        allProjects={sortedData}
      />
      <section>
        <ListView data={sortedData} />
      </section>
    </main>
  );
}
