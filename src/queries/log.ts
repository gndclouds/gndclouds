import { readdir } from "fs/promises";
import { readFileSync } from "fs";
import matter from "gray-matter";
import { getAllMarkdownFiles } from "./logs"; // Change import from projects to logs

// Define the Log type
export type Log = {
  slug: string;
  title: string;
  tags: string[];
  metadata: {
    description: string;
    contentHtml: string;
    links?: string[];
    footnotes?: string[];
  };
  publishedAt?: string;
};

export async function getLogBySlug(slug: string): Promise<Log | null> {
  const allLogs = await getAllMarkdownFiles(); // Get all logs
  const log = allLogs.find((log) => log.slug === slug); // Find the log by slug

  if (!log) {
    return null;
  }

  return {
    slug: log.slug,
    title: log.title,
    tags: log.tags || [],
    metadata: {
      description: log.metadata.description || "No description available",
      contentHtml: log.metadata.contentHtml,
      links: log.metadata.links || [],
      footnotes: log.metadata.footnotes || [],
    },
    publishedAt: log.publishedAt,
  } as Log;
}
