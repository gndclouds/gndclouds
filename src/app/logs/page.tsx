import { getAllMarkdownFiles } from "@/queries/all";
import ListView from "@/components/list-view";

export default async function Home() {
  const allData = await getAllMarkdownFiles();
  const data = allData.filter((post) => post.categories.includes("Log"));
  return (
    <main>
      <h1>Logs</h1>
      <section>
        <ListView data={data} />
      </section>
    </main>
  );
}
