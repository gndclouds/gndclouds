import type { MetadataRoute } from "next";
import { getAllMarkdownFiles } from "@/queries/all";
import { getAllTagsWithCount } from "@/queries/tags";
import { contentUrlPath } from "@/lib/content-routes";
import { getBaseUrl } from "@/lib/site";

/** Align with GitHub content fetches in `content-loader` (ISR, not fully dynamic). */
export const revalidate = Math.max(
  60,
  Number(process.env.GITHUB_CONTENT_REVALIDATE_SECONDS ?? "300")
);

const staticPaths = [
  "/",
  "/feed",
  "/projects",
  "/notes",
  "/logs",
  "/journals",
  "/fragments",
  "/studies",
  "/systems",
  "/newsletters",
  "/tags",
  "/library",
  "/links",
  "/cv",
  "/collections",
  "/arena",
  "/arenagram",
  "/people",
  "/photography",
  "/watch-list",
];

function toDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const [content, tags] = await Promise.all([
    getAllMarkdownFiles(),
    getAllTagsWithCount(),
  ]);

  const entries = new Map<string, MetadataRoute.Sitemap[number]>();

  staticPaths.forEach((path) => {
    const url = `${baseUrl}${path}`;
    entries.set(url, { url });
  });

  content.forEach((item) => {
    const path = contentUrlPath(item.type, item.slug);
    if (!path) return;

    const url = `${baseUrl}${path}`;
    entries.set(url, { url, lastModified: toDate(item.publishedAt) });
  });

  tags.forEach(({ tag }) => {
    const url = `${baseUrl}/tag/${encodeURIComponent(tag)}`;
    entries.set(url, { url });
  });

  return Array.from(entries.values());
}
