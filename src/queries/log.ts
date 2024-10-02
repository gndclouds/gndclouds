import { readdir } from "fs/promises";
import { readFileSync } from "fs";
import matter from "gray-matter";
import { getAllMarkdownFiles } from "./projects"; // Import the function to get all markdown files

// Define the Log type
export type Log = {
  slug: string;
  title: string;
  tags: string[];
  metadata: {
    description: string;
    contentHtml: string;
  };
  publishedAt?: string; // Add this line to include the publishedAt property
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
    metadata: {
      description: metadata.description || "No description available",
      contentHtml: content,
    },
  } as Log;
}
