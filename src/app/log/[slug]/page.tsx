import { notFound } from "next/navigation";
import { getLogBySlug } from "@/queries/logs";
import PageHero from "@/components/page-hero";
import MarkdownContent from "@/components/MarkdownContent";

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

  // Handle both Date objects (from gray-matter) and strings
  const getPublishedAtString = (date: string | Date | undefined): string => {
    if (!date) return "";
    if (date instanceof Date) {
      return isValidDate(date) ? date.toISOString() : "";
    }
    if (typeof date === "string") {
      return isValidDate(date) ? date : "";
    }
    return "";
  };

  const isValidDate = (date: string | Date): boolean => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return !isNaN(dateObj.getTime());
  };

  const validPublishedAt = getPublishedAtString(log.publishedAt);

  return (
    <div>
      <PageHero
        data={{
          ...log,
          tags: [...(log.categories || []), ...(log.tags || [])].join(", "),
          publishedAt: validPublishedAt,
        }}
      />
      {log.metadata?.contentHtml ? (
        <MarkdownContent
          content={log.metadata.contentHtml}
          links={(log.metadata as any).links ?? []}
          footnotes={(log.metadata as any).footnotes ?? {}}
          filePath={(log.metadata as any).filePath}
        />
      ) : (
        <p>No content available</p>
      )}
    </div>
  );
}
