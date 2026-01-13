import { notFound } from "next/navigation";
import { getStudyBySlug } from "@/queries/studies";
import PageHero from "@/components/page-hero";
import MarkdownContent from "@/components/MarkdownContent";

interface Params {
  params: {
    slug: string;
  };
}

export default async function StudyPage({ params }: Params) {
  const { slug } = params;
  const study = await getStudyBySlug(slug);
  if (!study) {
    notFound();
  }

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const validPublishedAt = isValidDate(study.publishedAt)
    ? study.publishedAt
    : "";

  return (
    <div>
      <PageHero
        data={{
          ...study,
          tags: [...(study.categories || []), ...(study.tags || [])].join(
            ", "
          ),
          publishedAt: validPublishedAt,
        }}
      />
      {study.metadata?.contentHtml ? (
        <MarkdownContent
          content={study.metadata.contentHtml}
          links={(study.metadata as any).links ?? []}
          footnotes={(study.metadata as any).footnotes ?? {}}
        />
      ) : (
        <p>No content available</p>
      )}
    </div>
  );
}
