import { getAllJournals } from "@/queries/journals";
import { getBaseUrl } from "@/lib/site";
import {
  buildRssFeed,
  markdownExcerpt,
  normalizeTitle,
  rssResponse,
} from "@/lib/rss";

export const revalidate = 300;

export async function GET() {
  const baseUrl = getBaseUrl();
  const journals = await getAllJournals();

  const items = journals
    .filter((journal) => journal.published && journal.slug)
    .map((journal) => ({
      title: normalizeTitle(journal.title),
      url: `${baseUrl}/journal/${encodeURIComponent(journal.slug)}`,
      description:
        journal.metadata.description ||
        markdownExcerpt(journal.metadata.contentHtml || ""),
      publishedAt: journal.publishedAt,
    }));

  const xml = buildRssFeed({
    title: "gndclouds — journal",
    description: "Writing from gndclouds.earth.",
    siteUrl: `${baseUrl}/journals`,
    feedUrl: `${baseUrl}/journals/feed.xml`,
    items,
  });

  return rssResponse(xml);
}
