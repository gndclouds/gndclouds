import { join } from "path";
import matter from "gray-matter";
import { getContent, getMarkdownFilePaths, isProduction } from "./content-loader";

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
    const notePaths = await getMarkdownFilePaths('notes');
    console.log(`Found ${notePaths.length} note markdown files`);

    const files = await Promise.all(
      notePaths.map(async (relativePath) => {
        // Build full path for local dev, but keep relative for production
        const filePath = isProduction
          ? relativePath
          : join(process.cwd(), "src/app/db", relativePath);
        
        // Get and parse content
        const content = await getContent(filePath);
        if (!content) {
          console.warn(`Empty content for ${filePath}, skipping`);
          return null;
        }
        
        const { data: metadata } = matter(content);
        
        // Generate slug from title or filename
        let slug = metadata.title
          ? metadata.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")
          : relativePath
              .replace(/\.md$/, "")
              .replace(/\//g, "-")
              .toLowerCase()
              .replace(/^gs-/, "")
              .replace(/\s+/g, "-");
              
        return {
          slug,
          title: metadata.title || "Untitled",
          categories: metadata.categories || [],
          tags: metadata.tags || [],
          type: metadata.type || "default",
          publishedAt: metadata.publishedAt || new Date(),
          published: metadata.published !== false, // Default to published unless explicitly false
          metadata: {
            ...metadata,
            contentHtml: metadata.contentHtml || "",
          },
          filePath: filePath,
        } as Post;
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
