import { notFound } from "next/navigation";
import { getJournalBySlug, getAllJournals } from "@/queries/journals";
import PageHero from "@/components/page-hero";
import ReactMarkdown from "react-markdown";
import MarkdownContent from "@/components/MarkdownContent";

interface Params {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const journals = await getAllJournals();
  return journals.map((journal) => ({
    slug: journal.slug,
  }));
}

export default async function JournalPage({ params }: Params) {
  const { slug } = params;
  const journal = await getJournalBySlug(slug);
  if (!journal) {
    notFound();
  }

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const validPublishedAt = isValidDate(journal.publishedAt)
    ? journal.publishedAt
    : "";

  return (
    <div>
      <PageHero
        data={{
          ...journal,
          tags: [...(journal.categories || []), ...(journal.tags || [])].join(
            ", "
          ),
          publishedAt: validPublishedAt,
        }}
      />
      {journal.metadata?.contentHtml ? (
        <MarkdownContent
          content={journal.metadata.contentHtml}
          links={(journal.metadata as any).links ?? []}
          footnotes={(journal.metadata as any).footnotes ?? {}}
        />
      ) : (
        <p>No content available</p>
      )}
    </div>
  );
}
