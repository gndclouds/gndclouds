import { readdir } from "fs/promises";
import { readFileSync } from "fs";
import { join, relative, dirname } from "path";
import matter from "gray-matter";

export interface Log {
  slug: string;
  title: string;
  categories: string[];
  tags: string[];
  type: string[];
  publishedAt: string;
  published: boolean;
  summary: string;
  snippet: string;
  metadata: {
    contentHtml: string;
    [key: string]: any;
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

export async function getAllMarkdownFiles(): Promise<Log[]> {
  const contentDir = "./src/app/db/content/logs";
  const filePaths = await getMarkdownFilesRecursively(contentDir);

  const files = await Promise.all(
    filePaths.map(async (filePath) => {
      const fileContent = readFileSync(filePath, "utf8");
      const { data: metadata, content } = matter(fileContent);

      // Construct the slug using the title and directory structure
      const relativePath = relative(contentDir, filePath).replace(/\.md$/, "");
      const slug = relativePath
        .split("/")
        .map((segment) => segment.toLowerCase().replace(/\s+/g, "-"))
        .join("/");

      // Extract a snippet from the content
      const snippet = content.split(" ").slice(0, 30).join(" ") + "...";

      return {
        slug,
        title: metadata.title,
        categories: metadata.categories || [],
        tags: metadata.tags || [],
        type: metadata.type || [],
        publishedAt: metadata.publishedAt || "",
        published: metadata.published || false,
        summary: metadata.summary || "",
        snippet, // Add snippet to the returned object
        metadata: {
          ...metadata,
          contentHtml: content, // Add contentHtml to the metadata
        },
      } as Log;
    })
  );

  // Sort logs by newest publishAt date
  return files.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getLogBySlug(slug: string): Promise<Log | null> {
  const allLogs = await getAllMarkdownFiles();
  console.log("Searching for slug:", slug);
  console.log(
    "Available slugs:",
    allLogs.map((log) => log.slug)
  );
  return allLogs.find((log) => log.slug === slug) || null;
}
