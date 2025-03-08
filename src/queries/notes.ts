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
    // Get content from the notes directory
    const notePaths = await getMarkdownFilePaths("notes");
    console.log(`Found ${notePaths.length} note markdown files`);

    const files = await Promise.all(
      notePaths.map(async (relativePath) => {
        try {
          // Get and parse content
          const content = await getContent(relativePath);
          if (!content) {
            console.warn(`Empty content for ${relativePath}, skipping`);
            return null;
          }

          const { data: metadata } = matter(content);

          // Generate slug from filename (without extension)
          // Keep the original case for the slug to match the file system
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
            type: metadata.type || ["Note"],
            publishedAt: metadata.publishedAt || new Date(),
            published: metadata.published !== false, // Default to published unless explicitly false
            metadata: {
              ...metadata,
              contentHtml: metadata.contentHtml || "",
            },
          } as Post;
        } catch (error) {
          console.error(`Error processing note ${relativePath}:`, error);
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

export async function getAllResearch(): Promise<Post[]> {
  const allMarkdownFiles = await getAllMarkdownFiles();
  return allMarkdownFiles.filter((file) => file.type.includes("Research"));
}

export async function getAllNotesAndResearch(): Promise<Post[]> {
  const allMarkdownFiles = await getAllMarkdownFiles();
  return allMarkdownFiles.filter(
    (file) => file.type.includes("Note") || file.type.includes("Research")
  );
}
