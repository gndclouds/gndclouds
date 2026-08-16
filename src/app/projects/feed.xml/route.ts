import { getAllProjects } from "@/queries/projects";
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
  const projects = await getAllProjects();

  const items = projects
    .filter((project) => project.published && project.slug)
    .map((project) => ({
      title: normalizeTitle(project.title),
      url: `${baseUrl}/project/${encodeURIComponent(project.slug)}`,
      description:
        project.metadata.description ||
        markdownExcerpt(project.metadata.contentHtml || ""),
      publishedAt: project.publishedAt,
    }));

  const xml = buildRssFeed({
    title: "gndclouds — projects",
    description: "Projects from gndclouds.earth.",
    siteUrl: `${baseUrl}/projects`,
    feedUrl: `${baseUrl}/projects/feed.xml`,
    items,
  });

  return rssResponse(xml);
}
