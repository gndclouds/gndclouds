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
  filePath: string; // Ensure filePath is included
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
  const contentDir = join(process.cwd(), "src/app/db/");
  try {
    // Check if directory exists
    try {
      const dirStat = await stat(contentDir);
      if (!dirStat.isDirectory()) {
        console.error(`Path exists but is not a directory: ${contentDir}`);
        return [];
      }
    } catch (error) {
      console.error(`Error accessing directory ${contentDir}:`, error);
      console.log(`Current working directory: ${process.cwd()}`);
      console.log(`Attempting to list parent directory...`);

      try {
        const parentDir = join(process.cwd(), "src/app/db");
        const parentContents = await readdir(parentDir);
        console.log(`Contents of ${parentDir}:`, parentContents);
      } catch (parentError) {
        console.error(`Error listing parent directory:`, parentError);
      }

      return [];
    }

    const filePaths = await getMarkdownFilesRecursively(contentDir);
    console.log(`Found ${filePaths.length} markdown files in ${contentDir}`);

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
  } catch (error) {
    console.error(`Unexpected error in getAllMarkdownFiles:`, error);
    return [];
  }
}

export async function getAllProjects(): Promise<Post[]> {
  const allMarkdownFiles = await getAllMarkdownFiles();
  return allMarkdownFiles.filter((file) => file.type.includes("Project"));
}
