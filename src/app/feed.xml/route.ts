import { getAllJournals } from "@/queries/journals";
import { getAllProjects } from "@/queries/projects";
import { getAllNotesAndResearch } from "@/queries/notes";
import { getAllLogs } from "@/queries/logs";
import { getAllFragments } from "@/queries/fragments";
import { getAllStudies } from "@/queries/studies";
import { getAllSystems } from "@/queries/systems";
import { getBaseUrl } from "@/lib/site";
import {
  buildRssFeed,
  markdownExcerpt,
  normalizeTitle,
  rssResponse,
  RssItem,
} from "@/lib/rss";

export const revalidate = 300;

/**
 * Section membership mirrors the site's routing: it comes from the db
 * directory each file lives in (via the per-section queries), not from the
 * `type` front matter, which is unreliable (e.g. artifacts marked `journal`).
 */
interface FeedContent {
  slug: string;
  title: string;
  publishedAt: string;
  published: boolean;
  metadata: { contentHtml: string; [key: string]: any };
  type?: string[];
}

export async function GET() {
  const baseUrl = getBaseUrl();

  const sections = await Promise.allSettled([
    getAllJournals().then((items) => ({ route: "journal", items })),
    getAllProjects().then((items) => ({ route: "project", items })),
    getAllNotesAndResearch().then((items) => ({ route: "note", items })),
    getAllLogs().then((items) => ({ route: "log", items })),
    getAllFragments().then((items) => ({ route: "fragment", items })),
    getAllStudies().then((items) => ({ route: "study", items })),
    getAllSystems().then((items) => ({ route: "system", items })),
  ]);

  const items: RssItem[] = [];
  for (const section of sections) {
    if (section.status !== "fulfilled") {
      console.error("Feed section failed:", section.reason);
      continue;
    }
    for (const item of section.value.items as FeedContent[]) {
      if (!item.published || !item.slug) continue;
      // Research shares the notes directory but renders at /research/[slug].
      const route =
        section.value.route === "note" && item.type?.includes("Research")
          ? "research"
          : section.value.route;
      items.push({
        title: normalizeTitle(item.title),
        url: `${baseUrl}/${route}/${encodeURIComponent(item.slug)}`,
        description:
          item.metadata.description ||
          markdownExcerpt(item.metadata.contentHtml || ""),
        publishedAt: item.publishedAt,
      });
    }
  }

  const xml = buildRssFeed({
    title: "gndclouds — everything",
    description:
      "Everything published on gndclouds.earth: journals, projects, notes, logs, fragments, studies, and systems.",
    siteUrl: baseUrl,
    feedUrl: `${baseUrl}/feed.xml`,
    items,
  });

  return rssResponse(xml);
}
