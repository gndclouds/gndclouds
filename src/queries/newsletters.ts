import { readdir } from "fs/promises";
import { readFileSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { stat } from "fs/promises";

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
  const contentDir = join(process.cwd(), "src/app/db/content/newsletters");

  try {
    // Check if directory exists
    try {
      const dirStat = await stat(contentDir);
      if (!dirStat.isDirectory()) {
        console.error(`Path exists but is not a directory: ${contentDir}`);
        return null;
      }
    } catch (error) {
      console.error(`Error accessing directory ${contentDir}:`, error);
      return null;
    }

    const filePath = `${contentDir}/${formattedSlug}.md`;

    try {
      const fileContents = readFileSync(filePath, "utf8");
      const { data: metadata, content } = matter(fileContents);

      return {
        slug: titleToSlug(metadata.title),
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
  } catch (error) {
    console.error(`Unexpected error in getNewsletterBySlug:`, error);
    return null;
  }
}

export async function getAllNewsletters(): Promise<Newsletter[]> {
  const contentDir = join(process.cwd(), "src/app/db/content/newsletters");

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
        const parentDir = join(process.cwd(), "src/app/db/content");
        const parentContents = await readdir(parentDir);
        console.log(`Contents of ${parentDir}:`, parentContents);
      } catch (parentError) {
        console.error(`Error listing parent directory:`, parentError);
      }

      return [];
    }

    const filePaths = await getMarkdownFilesRecursively(contentDir);
    console.log(`Found ${filePaths.length} newsletter files in ${contentDir}`);

    const files = await Promise.all(
      filePaths.map(async (filePath) => {
        try {
          const fileContents = readFileSync(filePath, "utf8");
          const { data: metadata, content } = matter(fileContents);
          return {
            slug: titleToSlug(metadata.title),
            title: metadata.title,
            content: content,
            publishedAt: metadata.publishedAt || "",
          } as Newsletter;
        } catch (error) {
          console.error(`Error processing newsletter file ${filePath}:`, error);
          return null;
        }
      })
    );

    return files.filter(Boolean) as Newsletter[];
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
