import { notFound } from "next/navigation";
import { getLogBySlug } from "@/queries/log";
import PageHero from "@/components/page-hero";
import ReactMarkdown from "react-markdown";

interface Params {
  params: {
    slug: string;
  };
}

type Log = {
  slug: string;
  title: string;
  tags: string[];
  metadata: {
    description: string;
    contentHtml: string;
  };
  publishedAt?: string; // Add this line to include the publishedAt property
};

export default async function LogPage({ params }: Params) {
  const { slug } = params;
  const log = await getLogBySlug(slug);

  if (!log) {
    notFound();
  }

  console.log("Log data:", log);

  return (
    <div>
      <PageHero
        data={{
          ...log,
          tags: log.tags?.join(", ") || "",
          publishedAt: log.publishedAt || "", // Ensure this property exists
        }}
      />
      {log.metadata?.contentHtml ? (
        <div className="flex px-4 py-12">
          <div className="max-w-3xl">
            <ReactMarkdown>{log.metadata.contentHtml}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <p>No content available</p>
      )}
    </div>
  );
}
