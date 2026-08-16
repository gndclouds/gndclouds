import { notFound } from "next/navigation";
import { getResearchBySlug } from "@/queries/notes";
import PageHero from "@/components/page-hero";
import ReactMarkdown from "react-markdown";
import MarkdownContent from "@/components/MarkdownContent";

interface Params {
  params: {
    slug: string;
  };
}

interface ProjectMetadata {
  contentHtml: string;
  links?: string[];
  footnotes?: Record<string, any>;
}

interface Project {
  // ... other properties ...
  metadata: ProjectMetadata;
  publishedAt?: string; // Add this line to define the publishedAt property
  title: string; // Ensure title is defined in the Project interface
  categories?: string[]; // Add this line to define the categories property
}

export default async function ResearchPage({ params }: Params) {
  const { slug } = params;
  const research = await getResearchBySlug(slug);
  if (!research) {
    notFound();
  }

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const validPublishedAt = isValidDate(research.publishedAt)
    ? research.publishedAt
    : "";

  return (
    <div>
      <PageHero
        data={{
          ...research,
          tags: [...(research.categories || []), ...(research.tags || [])].join(
            ", "
          ),
          publishedAt: validPublishedAt,
        }}
      />
      {research.metadata?.contentHtml ? (
        <MarkdownContent
          content={research.metadata.contentHtml}
          links={(research.metadata as any).links ?? []}
          footnotes={(research.metadata as any).footnotes ?? {}}
        />
      ) : (
        <p>No content available</p>
      )}
    </div>
  );
}
