import { getAllLogs } from "@/queries/logs";

import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";

type Post = {
  description?: string;
};

export default async function LogsPage() {
  const data = await getAllLogs();
  const combinedData = data
    .map((item) => ({
      ...item,
      description:
        "description" in item ? item.description : "No description available",
    }))
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });
  console.log(combinedData);
  return (
    <main>
      <CollectionHero
        name="Logs"
        projects={combinedData}
        allProjects={combinedData}
      />
      <section className="flex flex-col gap-4 p-4 ">
        <ListView data={combinedData} />
      </section>
    </main>
  );
}
