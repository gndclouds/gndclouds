import matter from "gray-matter";
import {
  normalizeCompanyStrings,
  normalizeLibraryFacets,
} from "@/lib/content-frontmatter-schema";
import { getContent, getMarkdownFilePaths } from "./content-loader";

export interface Journal {
  slug: string;
  title: string;
  categories: string[];
  tags: string[];
  /** Canonical landing facet ids; see `src/lib/content-frontmatter-schema.ts`. */
  facets: string[];
  /** Organization names from front matter (`companies` / `org`). */
  companies: string[];
  type: string[];
  publishedAt: string;
  published: boolean;
  metadata: {
    contentHtml: string;
    [key: string]: any;
  };
}

export async function getAllMarkdownFiles(): Promise<Journal[]> {
  try {
    // Get content from the journals directory
    const journalPaths = await getMarkdownFilePaths("journals");
    console.log(`Found ${journalPaths.length} journal markdown files`);

    const files = await Promise.all(
      journalPaths.map(async (relativePath) => {
        try {
          // Get and parse content
          const content = await getContent(relativePath);
          if (!content) {
            console.warn(`Empty content for ${relativePath}, skipping`);
            return null;
          }

          const { data: metadata, content: markdownContent } = matter(content);

          const facets = normalizeLibraryFacets(metadata.facets);
          const companies = normalizeCompanyStrings(
            metadata.companies ?? metadata.orgs ?? metadata.org
          );

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
            facets,
            companies,
            type: metadata.type || ["Journal"],
            publishedAt:
              metadata.created ||
              metadata.publishedAt ||
              new Date().toISOString(),
            published: metadata.published !== false, // Default to published unless explicitly false
            metadata: {
              ...metadata,
              contentHtml: markdownContent,
            },
          } as Journal;
        } catch (error) {
          console.error(`Error processing journal ${relativePath}:`, error);
          return null;
        }
      })
    );

    // Filter out nulls from failed fetches
    const validFiles = files.filter(Boolean) as Journal[];

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

export async function getAllJournals(): Promise<Journal[]> {
  return getAllMarkdownFiles();
}

export async function getJournalBySlug(slug: string): Promise<Journal | null> {
  const allJournals = await getAllMarkdownFiles();
  return allJournals.find((journal) => journal.slug === slug) || null;
}
