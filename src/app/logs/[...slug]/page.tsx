import { notFound } from "next/navigation";
import { getAllMarkdownFiles, getLogBySlug } from "@/queries/logs";
import Link from "next/link";
import ListView from "@/components/list-view";
import CollectionHero from "@/components/collection-hero";
import PageHero from "@/components/page-hero";
import ReactMarkdown from "react-markdown";

interface Params {
  params: {
    slug: string | string[];
  };
}

export default async function LogPage({ params }: Params) {
  const { slug } = params; // `slug` is an array of path segments
  const path = Array.isArray(slug) ? slug.join("/") : slug;

  // Fetch all logs
  const allLogs = await getAllMarkdownFiles();

  // Check if the path corresponds to a log
  const log = await getLogBySlug(path);
  if (log) {
    // Render individual log page
    return (
      <div>
        <PageHero data={{ ...log, tags: log.tags.join(", ") }} />{" "}
        {/* Convert tags array to a string */}
        <ReactMarkdown>{log.metadata.contentHtml}</ReactMarkdown>
      </div>
    );
  }

  // Filter logs that belong to the directory
  const filteredLogs = allLogs.filter((log) => log.slug.startsWith(path));

  if (!filteredLogs.length) {
    notFound();
  }

  // Render directory page
  return (
    <main>
      <CollectionHero
        name="Logs"
        projects={filteredLogs}
        allProjects={filteredLogs}
      />
      <section>
        <ListView data={filteredLogs} />
      </section>
    </main>
  );
}
