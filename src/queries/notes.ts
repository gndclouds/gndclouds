import { readdir, stat } from "fs/promises";
import { readFileSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

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
  const contentDir = "./src/app/db/content";
  try {
    const dirStat = await stat(contentDir);
    if (!dirStat.isDirectory()) {
      throw new Error(`${contentDir} is not a directory`);
    }
  } catch (error) {
    console.error(`Error accessing directory ${contentDir}:`, error);
    return [];
  }

  const filePaths = await getMarkdownFilesRecursively(contentDir);

  const files = await Promise.all(
    filePaths.map(async (filePath) => {
      const { data: metadata } = matter(readFileSync(filePath, "utf8"));
      let slug = metadata.title
        ? metadata.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
        : filePath
            .substring(contentDir.length + 1)
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
        published: metadata.published || false,
        metadata: {
          ...metadata,
          contentHtml: metadata.contentHtml || "",
        },
        filePath: filePath,
      } as Post;
    })
  );

  return files.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
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
