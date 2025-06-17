import { join } from "path";
import matter from "gray-matter";
import {
  getContent,
  getMarkdownFilePaths,
  isProduction,
} from "./content-loader";

export interface Post {
  slug: string;
  title: string;
  categories: string[];
  tags: string[];
  type: string[];
  publishedAt: string;
  published: boolean;
  metadata: {
    contentHtml: string;
    [key: string]: any;
  };
}

export async function getAllMarkdownFiles(): Promise<Post[]> {
  try {
    // Get content from the logs directory
    const logPaths = await getMarkdownFilePaths("logs");
    console.log(`Found ${logPaths.length} log markdown files`);

    const files = await Promise.all(
      logPaths.map(async (relativePath) => {
        try {
          // Get and parse content
          const content = await getContent(relativePath);
          if (!content) {
            console.warn(`Empty content for ${relativePath}, skipping`);
            return null;
          }

          const { data: metadata } = matter(content);

          // Generate slug from filename (without extension)
          const slug =
            relativePath
              .split("/")
              .pop() // Get the filename
              ?.replace(/\.md$/, "") || ""; // Remove .md extension

          return {
            slug,
            title: metadata.title || "Untitled",
            categories: metadata.categories || [],
            tags: metadata.tags || [],
            type: metadata.type || ["Log"],
            publishedAt: metadata.publishedAt || new Date().toISOString(),
            published: metadata.published !== false, // Default to published unless explicitly false
            metadata: {
              ...metadata,
              contentHtml: metadata.contentHtml || "",
            },
          } as Post;
        } catch (error) {
          console.error(`Error processing log ${relativePath}:`, error);
          return null;
        }
      })
    );

    // Filter out nulls from failed fetches
    const validFiles = files.filter(Boolean) as Post[];

    // Sort by publish date
    return validFiles.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error(`Unexpected error in getAllMarkdownFiles:`, error);
    return [];
  }
}

export async function getAllLogs(): Promise<Post[]> {
  return getAllMarkdownFiles();
}

export async function getLogBySlug(slug: string): Promise<Post | null> {
  const allLogs = await getAllMarkdownFiles();
  return allLogs.find((log) => log.slug === slug) || null;
}
