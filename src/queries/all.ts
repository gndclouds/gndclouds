import { readdir, stat } from "fs/promises";
import { readFileSync } from "fs";
import { join, resolve } from "path";
import matter from "gray-matter";
import fetch from "node-fetch";
import { getContent, getMarkdownFilePaths } from "./content-loader";

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

export interface UnsplashImage {
  id: string;
  title?: string; // Added optional title property
  created_at: string;
  updated_at: string;
  alt_description?: string; // Added alt_description property
  urls: {
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  exif: {
    make: string;
    model: string;
    exposure_time: string;
    aperture: string;
    focal_length: string;
    iso: number;
  };
}

export interface ArenaItem {
  id: string;
  title: string;
  image: string | null;
  link: string | null;
  createdAt: string;
}

interface ArenaResponse {
  blocks?: Array<{ title: string; id: string; class: string }>;
  channels?: Array<{ title: string; id: string; class: string }>;
}

export interface ActivityHubItem {
  id: string;
  title: string;
  imageUrl: string | null;
  link: string | null;
  createdAt: string;
}

interface CombinedItem {
  id: string;
  title: string;
  imageUrl: string | null;
  link: string | null; // Ensure link is explicitly typed as 'string | null'
  createdAt: string;
}

async function getMarkdownFilesRecursively(dir: string): Promise<string[]> {
  let files: string[] = [];
  try {
    const dirents = await readdir(dir, { withFileTypes: true });
    for (const dirent of dirents) {
      const res = join(dir, dirent.name);
      if (dirent.isDirectory()) {
        files = [...files, ...(await getMarkdownFilesRecursively(res))];
      } else if (res.endsWith(".md")) {
        files.push(res);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  return files;
}

export async function getAllMarkdownFiles(): Promise<Post[]> {
  try {
    // Get all content types
    const [
      projectPaths,
      notePaths,
      newsletterPaths,
      logPaths,
      journalPaths,
      studyPaths,
      systemPaths,
      fragmentPaths,
      researchPaths,
    ] = await Promise.all([
      getMarkdownFilePaths("projects"),
      getMarkdownFilePaths("notes"),
      getMarkdownFilePaths("newsletters"),
      getMarkdownFilePaths("logs"),
      getMarkdownFilePaths("journals"),
      getMarkdownFilePaths("studies"),
      getMarkdownFilePaths("systems"),
      getMarkdownFilePaths("fragments"),
      getMarkdownFilePaths("research"),
    ]);

    // Combine all paths and remove any 'default/' prefix
    const allPaths = [
      ...projectPaths,
      ...notePaths,
      ...newsletterPaths,
      ...logPaths,
      ...journalPaths,
      ...studyPaths,
      ...systemPaths,
      ...fragmentPaths,
      ...researchPaths,
    ].map((path) => path.replace(/^default\//, ""));

    // Process all files
    const posts = await Promise.all(
      allPaths.map(async (filePath) => {
        try {
          const content = await getContent(filePath);
          if (!content) return null;

          const { data: metadata, content: markdownContent } = matter(content);
          // Get the slug from the file path, removing any 'default/' prefix
          const slug = filePath.split("/").pop()?.replace(".md", "") || "";

          // Determine the type - prefer metadata.type, fallback to directory name
          // Normalize metadata type by removing Obsidian brackets and converting to array
          let type: string[] = [];
          if (metadata.type) {
            if (Array.isArray(metadata.type)) {
              type = metadata.type.map((t: string) =>
                String(t)
                  .toLowerCase()
                  .replace(/\[\[/g, "")
                  .replace(/\]\]/g, "")
                  .trim()
              );
            } else {
              type = [
                String(metadata.type)
                  .toLowerCase()
                  .replace(/\[\[/g, "")
                  .replace(/\]\]/g, "")
                  .trim(),
              ];
            }
          }

          // If no type from metadata, use directory name
          if (type.length === 0 || (type.length === 1 && type[0] === "")) {
            const dirType = filePath.split("/")[0];
            type = [dirType];
          }

          return {
            slug,
            title: metadata.title || "",
            categories: metadata.categories || [],
            tags: metadata.tags || [],
            type,
            publishedAt: metadata.publishedAt || "",
            published: metadata.published !== false,
            metadata: {
              contentHtml: markdownContent,
            },
          };
        } catch (error) {
          console.error(`Error processing file ${filePath}:`, error);
          return null;
        }
      })
    );

    // Filter out null values and sort by publishedAt
    return posts
      .filter((post): post is Post => post !== null)
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
  } catch (error) {
    console.error("Error getting all markdown files:", error);
    return [];
  }
}

export async function getAllUnsplashImages(
  username: string
): Promise<UnsplashImage[]> {
  let page = 1;
  let images: UnsplashImage[] = [];
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `https://api.unsplash.com/users/${username}/photos?client_id=${process.env.UNSPLASH_ACCESS_KEY}&page=${page}&per_page=30`
    );

    if (!response.ok) {
      // Check if the response is not OK
      if (response.status === 429) {
        // Check if the status code is 429 (Rate Limit Exceeded)
        console.error("Rate limit exceeded. Please try again later.");
        break; // Exit the loop or handle as needed
      } else {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
    }

    const data = (await response.json()) as UnsplashImage[];
    images = images.concat(
      data.map((image) => ({
        id: image.id,
        title: image.title, // Now safely accessing title due to interface update
        created_at: image.created_at,
        updated_at: image.updated_at,
        alt_description: image.alt_description,
        urls: image.urls,
        exif: image.exif || {
          make: "",
          model: "",
          exposure_time: "",
          aperture: "",
          focal_length: "",
          iso: 0,
        },
      }))
    );
    hasMore = data.length === 30;
    page++;
  }

  return images.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const formattedSlug = slug
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/^gs-/, "");
    const response = await fetch(`/api/posts/${formattedSlug}`);
    if (response.ok) {
      const post = await response.json();
      return post as Post;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
}
