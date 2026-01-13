import { getAllSystems } from "@/queries/systems";
import ListViewWithSearch from "@/components/list-view-with-search";
import CollectionHero from "@/components/collection-hero";

export default async function SystemsPage() {
  const data = await getAllSystems();
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
        name="Systems"
        projects={combinedData}
        allProjects={combinedData}
      />
      <section className="flex flex-col gap-4 p-4">
        <ListViewWithSearch
          data={combinedData}
          placeholder="Search systems..."
        />
      </section>
    </main>
  );
}
