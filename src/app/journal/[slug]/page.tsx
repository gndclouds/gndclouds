import { notFound } from "next/navigation";
import { getJournalBySlug, getAllJournals } from "@/queries/journals";
import LandingDetailPage from "@/components/landing/landing-detail-page";
import MarkdownContent from "@/components/MarkdownContent";
import styles from "@/components/MarkdownContent.module.css";

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

  const tagList = [
    ...new Set([
      ...(journal.categories ?? []),
      ...(journal.tags ?? []),
    ]),
  ];

  return (
    <LandingDetailPage
      kind="journal"
      title={journal.title}
      publishedAt={validPublishedAt}
      tagList={tagList}
    >
      {journal.metadata?.contentHtml ? (
        <div className={styles.markdown}>
          <MarkdownContent
            content={journal.metadata.contentHtml}
            links={(journal.metadata as { links?: string[] }).links ?? []}
            footnotes={
              (journal.metadata as { footnotes?: Record<string, string> })
                .footnotes ?? {}
            }
            innerPaddingClass="w-full max-w-[600px] text-left px-6 py-8 sm:px-8"
            hideLeadingMediaBeforeText
          />
        </div>
      ) : (
        <p className="w-full max-w-[600px] text-left px-6 py-8 text-sm text-gray-500 dark:text-gray-400 sm:px-8">
          No content available
        </p>
      )}
    </LandingDetailPage>
  );
}
