import { notFound } from "next/navigation";
import { getLogBySlug } from "@/queries/log";
import PageHero from "@/components/page-hero";
import ReactMarkdown from "react-markdown";
import MarkdownContent from "@/components/MarkdownContent";

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

// Define the type for log.metadata
type Metadata = {
  description: string;
  contentHtml: string;
  links?: any[]; // Add this line
  footnotes?: any[]; // Add this line
};

// Ensure log.metadata is of type Metadata
const log: { metadata: Metadata } = {
  // ... existing log initialization ...
};

export default async function LogPage({ params }: Params) {
  const { slug } = params;
  const log = await getLogBySlug(slug);

  console.log(log); // Check the structure of the log object

  if (!log) {
    notFound();
  }

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
        <MarkdownContent
          content={log.metadata.contentHtml}
          links={log.metadata.links || []}
          footnotes={log.metadata.footnotes || []}
        />
      ) : (
        <p>No content available</p>
      )}
    </div>
  );
}
