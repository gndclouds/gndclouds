import { join } from "path";
import matter from "gray-matter";
import { readFileSync } from "fs";
import { readdir, stat } from "fs/promises";
import {
  getContent,
  getMarkdownFilePaths,
  isProduction,
} from "./content-loader";

export interface Newsletter {
  slug: string;
  title: string;
  content: string;
  publishedAt: string;
  type: string[];
  published: boolean;
  tags: string[];
}

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getNewsletterBySlug(
  slug: string
): Promise<Newsletter | null> {
  const formattedSlug = slug.toLowerCase().replace(/\s+/g, "-");

  try {
    // Build the path for the newsletter
    const filePath = isProduction
      ? `newsletters/${formattedSlug}.md`
      : join(process.cwd(), "src/app/db/newsletters", `${formattedSlug}.md`);

    // Get the content using our content loader
    const content = await getContent(filePath);

    if (!content) {
      console.warn(`Newsletter not found: ${filePath}`);
      return null;
    }

    // Parse the content with front matter
    const { data: metadata, content: markdownContent } = matter(content);

    return {
      slug: titleToSlug(metadata.title),
      title: metadata.title,
      content: markdownContent,
      publishedAt: metadata.publishedAt || "",
      type: metadata.type || [],
      published: metadata.published !== false, // Default to published unless explicitly false
      tags: metadata.tags || [],
    } as Newsletter;
  } catch (error) {
    console.error(`Unexpected error in getNewsletterBySlug:`, error);
    return null;
  }
}

export async function getAllNewsletters(): Promise<Newsletter[]> {
  try {
    // Get content from the newsletters directory
    const newsletterPaths = await getMarkdownFilePaths("newsletters");
    console.log(`Found ${newsletterPaths.length} newsletter markdown files`);

    const files = await Promise.all(
      newsletterPaths.map(async (relativePath) => {
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
              ?.replace(/\.md$/, "") // Remove .md extension
              .toLowerCase() || "";

          return {
            slug,
            title: metadata.title || "Untitled",
            content: markdownContent,
            publishedAt: metadata.publishedAt || new Date().toISOString(),
          } as Newsletter;
        } catch (error) {
          console.error(`Error processing newsletter ${relativePath}:`, error);
          return null;
        }
      })
    );

    // Filter out nulls from failed fetches
    const validFiles = files.filter(Boolean) as Newsletter[];

    // Sort by publish date
    return validFiles.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error(`Unexpected error in getAllNewsletters:`, error);
    return [];
  }
}

async function getMarkdownFilesRecursively(dir: string): Promise<string[]> {
  let files: string[] = [];
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = join(dir, dirent.name);
    if (dirent.isDirectory()) {
      files = [...files, ...(await getMarkdownFilesRecursively(res))];
    } else if (res.endsWith(".md")) {
      files.push(res);
    }
  }
  return files;
}
