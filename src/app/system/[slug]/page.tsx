import { notFound } from "next/navigation";
import { getSystemBySlug } from "@/queries/systems";
import PageHero from "@/components/page-hero";
import MarkdownContent from "@/components/MarkdownContent";

interface Params {
  params: {
    slug: string;
  };
}

export default async function SystemPage({ params }: Params) {
  const { slug } = params;
  const system = await getSystemBySlug(slug);
  if (!system) {
    notFound();
  }

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const validPublishedAt = isValidDate(system.publishedAt)
    ? system.publishedAt
    : "";

  return (
    <div>
      <PageHero
        data={{
          ...system,
          tags: [...(system.categories || []), ...(system.tags || [])].join(
            ", "
          ),
          publishedAt: validPublishedAt,
        }}
      />
      {system.metadata?.contentHtml ? (
        <MarkdownContent
          content={system.metadata.contentHtml}
          links={(system.metadata as any).links ?? []}
          footnotes={(system.metadata as any).footnotes ?? {}}
        />
      ) : (
        <p>No content available</p>
      )}
    </div>
  );
}
