import { join } from "path";
import matter from "gray-matter";
import {
  getContent,
  getMarkdownFilePaths,
  isProduction,
} from "./content-loader";

export interface CVEntry {
  slug: string;
  title: string;
  categories: string[];
  tags: string[];
  type: string[];
  publishedAt: string;
  published: boolean;
  metadata: {
    contentHtml: string;
    start: string;
    end: string;
    company: string;
    location: string;
    role: string;
    responsibilities: string[];
    projects?: number;
    collaborators?: string[];
    [key: string]: any;
  };
}

export async function getAllMarkdownFiles(): Promise<CVEntry[]> {
  try {
    // Get content from the cv directory
    const cvPaths = await getMarkdownFilePaths("cv");
    console.log(`Found ${cvPaths.length} CV markdown files`);

    const files = await Promise.all(
      cvPaths.map(async (relativePath) => {
        try {
          // Get and parse content
          const content = await getContent(relativePath);
          if (!content) {
            console.warn(`Empty content for ${relativePath}, skipping`);
            return null;
          }

          const { data: metadata, content: markdownContent } = matter(content);

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
            type: metadata.type || ["Experience"],
            publishedAt: metadata.start || new Date().toISOString(), // Use start date as publishedAt for sorting
            published: metadata.published !== false,
            metadata: {
              ...metadata,
              contentHtml: markdownContent,
            },
          } as CVEntry;
        } catch (error) {
          console.error(`Error processing CV entry ${relativePath}:`, error);
          return null;
        }
      })
    );

    // Filter out nulls from failed fetches
    const validFiles = files.filter(Boolean) as CVEntry[];

    // Sort by start date (most recent first)
    return validFiles.sort(
      (a, b) =>
        new Date(b.metadata.start).getTime() -
        new Date(a.metadata.start).getTime()
    );
  } catch (error) {
    console.error(`Unexpected error in getAllMarkdownFiles:`, error);
    return [];
  }
}

export async function getAllCVEntries(): Promise<CVEntry[]> {
  return getAllMarkdownFiles();
}

export async function getCVEntryBySlug(slug: string): Promise<CVEntry | null> {
  const allEntries = await getAllMarkdownFiles();
  return allEntries.find((entry) => entry.slug === slug) || null;
}
