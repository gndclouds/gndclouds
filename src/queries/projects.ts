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
  filePath: string;
  metadata: {
    contentHtml: string;
    [key: string]: any;
  };
}

export async function getAllProjects(): Promise<Post[]> {
  try {
    // Get content from the projects directory
    const projectPaths = await getMarkdownFilePaths("projects");
    console.log(`Found ${projectPaths.length} project markdown files`);

    const files = await Promise.all(
      projectPaths.map(async (relativePath) => {
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
              ?.replace(/\.md$/, "") // Remove .md extension
              .toLowerCase() || "";

          return {
            slug,
            title: metadata.title || "Untitled",
            categories: metadata.categories || [],
            tags: metadata.tags || [],
            type: metadata.type || ["Project"],
            publishedAt: metadata.publishedAt || new Date(),
            published: metadata.published !== false, // Default to published unless explicitly false
            metadata: {
              ...metadata,
              contentHtml: metadata.contentHtml || "",
            },
            filePath: relativePath,
          } as Post;
        } catch (error) {
          console.error(`Error processing project ${relativePath}:`, error);
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
    console.error(`Unexpected error in getAllProjects:`, error);
    return [];
  }
}
