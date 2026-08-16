import { notFound } from "next/navigation";
import { getFragmentBySlug } from "@/queries/fragments";
import PageHero from "@/components/page-hero";
import MarkdownContent from "@/components/MarkdownContent";

interface Params {
  params: {
    slug: string;
  };
}

export default async function FragmentPage({ params }: Params) {
  const { slug } = params;
  const fragment = await getFragmentBySlug(slug);
  if (!fragment) {
    notFound();
  }

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const validPublishedAt = isValidDate(fragment.publishedAt)
    ? fragment.publishedAt
    : "";

  return (
    <div>
      <PageHero
        data={{
          ...fragment,
          tags: [...(fragment.categories || []), ...(fragment.tags || [])].join(
            ", "
          ),
          publishedAt: validPublishedAt,
        }}
      />
      {fragment.metadata?.contentHtml ? (
        <MarkdownContent
          content={fragment.metadata.contentHtml}
          links={(fragment.metadata as any).links ?? []}
          footnotes={(fragment.metadata as any).footnotes ?? {}}
        />
      ) : (
        <p>No content available</p>
      )}
    </div>
  );
}
