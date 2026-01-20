import type { MetadataRoute } from "next";
import { getAllMarkdownFiles } from "@/queries/all";
import { getAllTagsWithCount } from "@/queries/tags";

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

const typeToRoute: Record<string, string> = {
  project: "project",
  projects: "project",
  note: "note",
  notes: "note",
  log: "log",
  logs: "log",
  journal: "journal",
  journals: "journal",
  fragment: "fragment",
  fragments: "fragment",
  study: "study",
  studies: "study",
  system: "system",
  systems: "system",
  research: "research",
  researches: "research",
  newsletter: "newsletter",
  newsletters: "newsletter",
};

function normalizeType(value: string) {
  return value
    .toLowerCase()
    .replace(/\[\[/g, "")
    .replace(/\]\]/g, "")
    .trim();
}

function getBaseUrl() {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    process.env.VERCEL_URL;

  if (!envUrl) return "http://localhost:3000";
  return envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;
}

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
    const match = (item.type || []).find((type) => {
      const normalized = normalizeType(type);
      return Boolean(typeToRoute[normalized]);
    });
    if (!match) return;

    const route = typeToRoute[normalizeType(match)];
    const slug = encodeURIComponent(item.slug);
    const url = `${baseUrl}/${route}/${slug}`;
    entries.set(url, { url, lastModified: toDate(item.publishedAt) });
  });

  tags.forEach(({ tag }) => {
    const url = `${baseUrl}/tag/${encodeURIComponent(tag)}`;
    entries.set(url, { url });
  });

  return Array.from(entries.values());
}
