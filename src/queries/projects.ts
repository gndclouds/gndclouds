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
            heroImage: metadata.heroImage,
            heroImagePoster: metadata.heroImagePoster,
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
            publishedAt: metadata.publishedAt || new Date().toISOString(),
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
    return validFiles.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error(`Unexpected error in getAllProjects (artifacts):`, error);
    return [];
  }
}
