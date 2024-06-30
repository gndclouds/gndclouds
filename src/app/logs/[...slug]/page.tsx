import { getAllMarkdownFiles } from "@/queries/logs";
import ListView from "@/components/list-view";

export default async function LogDirectoryPage({ params }) {
  const { slug } = params; // `slug` is an array of path segments
  const allLogs = await getAllMarkdownFiles();
  const path = Array.isArray(slug) ? slug.join("/") : slug;
  const filteredLogs = allLogs.filter((log) => log.slug.startsWith(path));

  if (!filteredLogs.length) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <h1>Logs for {Array.isArray(slug) ? slug.join("/") : slug}</h1>
      <ListView data={filteredLogs} />
    </main>
  );
}
