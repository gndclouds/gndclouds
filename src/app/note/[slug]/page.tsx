import { notFound } from "next/navigation";
import { getNoteBySlug } from "@/queries/notes";
import PageHero from "@/components/page-hero";
import ReactMarkdown from "react-markdown";
import MarkdownContent from "@/components/MarkdownContent";

interface Params {
  params: {
    slug: string;
  };
}

export default async function NotePage({ params }: Params) {
  const { slug } = params;
  const note = await getNoteBySlug(slug);
  if (!note) {
    notFound();
  }

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const validPublishedAt = isValidDate(note.publishedAt)
    ? note.publishedAt
    : "";

  return (
    <div>
      <PageHero
        data={{
          ...note,
          tags: [...(note.categories || []), ...(note.tags || [])].join(", "),
          publishedAt: validPublishedAt,
        }}
      />
      {note.metadata?.contentHtml ? (
        <MarkdownContent
          content={note.metadata.contentHtml}
          links={(note.metadata as any).links ?? []}
          footnotes={(note.metadata as any).footnotes ?? []}
        />
      ) : (
        <p>No content available</p>
      )}
    </div>
  );
}
