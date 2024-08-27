import { getAllMarkdownFiles } from "@/queries/logs";
import Link from "next/link"; // Import Link from next/link
import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";

export default async function FeedPage() {
  const data = await getAllMarkdownFiles();

  const sortedData = data.sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    return dateB - dateA;
  });
  // console.log("Data count after sorting:", sortedData.length);

  return (
    <main>
      <CollectionHero
        name="Logs"
        projects={sortedData}
        allProjects={sortedData}
      />
      <section className="" style={{ display: "flex", alignItems: "center" }}>
        <div>Logs:</div>
        <Link href="/logs">
          <div className="p-2 border border-black m-1 rounded">/all</div>
        </Link>
        <Link href="/logs/gndclouds">
          <div className="p-2 border border-black m-1 rounded">/gndclouds</div>
        </Link>
        <Link href="/logs/flex-house">
          <div className="p-2 border border-black m-1 rounded">/flexhouse</div>
        </Link>
        <Link href="/logs/logolens">
          <div className="p-2 border border-black m-1 rounded">/logolens</div>
        </Link>
      </section>
      <section>
        <ListView data={sortedData} />
      </section>
    </main>
  );
}
