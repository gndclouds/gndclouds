import { notFound } from "next/navigation";
import { getLogBySlug } from "@/queries/log";
import PageHero from "@/components/page-hero";
import ReactMarkdown from "react-markdown";

interface Params {
  params: {
    slug: string;
  };
}

export default async function LogPage({ params }: Params) {
  const { slug } = params;
  const log = await getLogBySlug(slug);

  if (!log) {
    notFound();
  }

  console.log("Log data:", log);

  return (
    <div>
      <PageHero data={{ ...log, tags: log.tags?.join(", ") || "" }} />
      {log.metadata?.contentHtml ? (
        <ReactMarkdown>{log.metadata.contentHtml}</ReactMarkdown>
      ) : (
        <p>No content available</p>
      )}
    </div>
  );
}
