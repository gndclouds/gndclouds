import { readdir } from "fs/promises";
import { readFileSync } from "fs";
import matter from "gray-matter";
import { getAllMarkdownFiles } from "./projects"; // Ensure this function returns filePath

// Define the Log type
export type Log = {
  slug: string;
  title: string;
  tags: string[];
  filePath: string; // Ensure filePath is included
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
  const { data: metadata, content } = matter(
    readFileSync(log.filePath, "utf8")
  ); // Read the file using the file path

  return {
    slug: log.slug,
    title: metadata.title,
    tags: metadata.tags || [],
    filePath: log.filePath, // Ensure filePath is returned
    metadata: {
      description: metadata.description || "No description available",
      contentHtml: content,
      links: metadata.links || [],
      footnotes: metadata.footnotes || [],
    },
  } as Log;
}
