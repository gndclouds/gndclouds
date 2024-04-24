import { readdir } from "fs/promises";
import { readFileSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import fetch from "node-fetch";

export interface Post {
  slug: string;
  title: string;
  categories: string[];
  tags: string[];
  type: string[];
  publishedAt: string;
  published: boolean;
  metadata: Record<string, any>;
}

export interface UnsplashImage {
  id: string;
  created_at: string;
  updated_at: string;
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

export async function getAllMarkdownFiles(): Promise<Post[]> {
  const contentDir = "./src/app/db/content";
  const filePaths = await getMarkdownFilesRecursively(contentDir);

  const files = await Promise.all(
    filePaths.map(async (filePath) => {
      const { data: metadata } = matter(readFileSync(filePath, "utf8"));
      return {
        slug: filePath
          .substring(contentDir.length + 1)
          .replace(/\.md$/, "")
          .replace(/\//g, "-"),
        title: metadata.title,
        categories: metadata.categories || [],
        tags: metadata.tags || [],
        type: metadata.type || [],
        publishedAt: metadata.publishedAt || "",
        published: metadata.published || false,
        metadata: metadata,
      } as Post;
    })
  );

  // Sort posts by newest publishAt date
  return files.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const contentDir = "./src/app/db/content";
  const filePaths = await getMarkdownFilesRecursively(contentDir);
  const filePath = filePaths.find((path) => path.endsWith(`${slug}.md`));

  if (!filePath) {
    return null;
  }

  const { data: metadata } = matter(readFileSync(filePath, "utf8"));
  return {
    slug: filePath
      .substring(contentDir.length + 1)
      .replace(/\.md$/, "")
      .replace(/\//g, "-"),
    title: metadata.title,
    categories: metadata.categories || [],
    tags: metadata.tags || [],
    type: metadata.type || [],
    publishedAt: metadata.publishedAt || "",
    published: metadata.published || false,
    metadata: metadata,
  } as Post;
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
    const data = (await response.json()) as UnsplashImage[];
    images = images.concat(data);
    hasMore = data.length === 30;
    page++;
  }

  return images.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
