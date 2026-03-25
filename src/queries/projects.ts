import matter from "gray-matter";
import { buildProjectCardImageFields } from "@/lib/project-card-images";
import {
  normalizeCompanyStrings,
  normalizeLibraryFacets,
} from "@/lib/content-frontmatter-schema";
import { getContent, getMarkdownFilePaths } from "./content-loader";

export interface Post {
  slug: string;
  title: string;
  categories: string[];
  tags: string[];
  facets: string[];
  companies: string[];
  type: string[];
  publishedAt: string;
  published: boolean;
  filePath: string;
  metadata: {
    contentHtml: string;
    cardImageDisplayUrl?: string | null;
    cardImageHoverGifUrl?: string | null;
    [key: string]: any;
  };
}

function toTimestamp(value: unknown): number {
  if (typeof value !== "string" || !value.trim()) return 0;
  const ts = new Date(value).getTime();
  return Number.isNaN(ts) ? 0 : ts;
}

function projectSortTimestamp(post: Post): number {
  const created = post.metadata?.created;
  if (typeof created === "string" && created.trim()) {
    return toTimestamp(created);
  }
  return toTimestamp(post.publishedAt);
}

export async function getAllProjects(): Promise<Post[]> {
  try {
    const artifactPaths = await getMarkdownFilePaths("artifacts");
    console.log(`Found ${artifactPaths.length} artifact markdown files`);

    const files = await Promise.all(
      artifactPaths.map(async (relativePath) => {
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
          const cardImages = buildProjectCardImageFields({
            markdownBody: markdownContent,
            markdownFilePath: relativePath,
          });

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
            facets,
            companies,
            type: metadata.type || ["Project"],
            publishedAt:
              metadata.created ||
              metadata.publishedAt ||
              new Date().toISOString(),
            published: metadata.published !== false, // Default to published unless explicitly false
            metadata: {
              ...metadata,
              contentHtml: markdownContent,
              cardImageDisplayUrl: cardImages.cardImageDisplayUrl,
              cardImageHoverGifUrl: cardImages.cardImageHoverGifUrl,
            },
            filePath: relativePath,
          } as Post;
        } catch (error) {
          console.error(`Error processing artifact ${relativePath}:`, error);
          return null;
        }
      })
    );

    // Filter out nulls from failed fetches
    const validFiles = files.filter(Boolean) as Post[];

    // Sort by publish date
    return validFiles.sort((a, b) => projectSortTimestamp(b) - projectSortTimestamp(a));
  } catch (error) {
    console.error(`Unexpected error in getAllProjects (artifacts):`, error);
    return [];
  }
}
