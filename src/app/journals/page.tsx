import { getAllJournals } from "@/queries/journals";
import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";

export default async function JournalsPage() {
  const data = await getAllJournals();
  const combinedData = data
    .map((item) => ({
      ...item,
      description: item.metadata.description || "No description available",
    }))
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });

  return (
    <main>
      <CollectionHero
        name="Journals"
        projects={combinedData}
        allProjects={combinedData}
      />
      <section className="flex flex-col gap-4 p-4">
        <ListView data={combinedData} />
      </section>
    </main>
  );
}
