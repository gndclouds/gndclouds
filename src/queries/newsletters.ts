import { readdir } from "fs/promises";
import { readFileSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

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

export function getNewsletterBySlug(slug: string): Newsletter | null {
  const contentDir = "./src/app/db/newsletters";
  const filePath = `${contentDir}/${slug}.md`;

  try {
    const fileContents = readFileSync(filePath, "utf8");
    const { data: metadata, content } = matter(fileContents);

    return {
      slug: titleToSlug(filePath),
      title: metadata.title,
      content: content,
      publishedAt: metadata.publishedAt || "",
      type: metadata.type || [],
      published: metadata.published || false,
      tags: metadata.tags || [],
    } as Newsletter;
  } catch (error) {
    console.error(`Error reading newsletter file: ${error}`);
    return null;
  }
}

export async function getAllNewsletters(): Promise<Newsletter[]> {
  const contentDir = "./src/app/db/content/newsletters";
  const filePaths = await getMarkdownFilesRecursively(contentDir);

  const files = await Promise.all(
    filePaths.map(async (filePath) => {
      const fileContents = readFileSync(filePath, "utf8");
      const { data: metadata, content } = matter(fileContents);
      return {
        slug: titleToSlug(filePath),
        title: metadata.title,
        content: content,
        publishedAt: metadata.publishedAt || "",
      } as Newsletter;
    })
  );

  return files;
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
