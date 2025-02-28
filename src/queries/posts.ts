import { readdir } from "fs/promises";
import { readFileSync } from "fs";
import matter from "gray-matter";
import { join } from "path";
import process from "process";
import { stat } from "fs/promises";

// Define the Post type
export type Post = {
  slug: string;
  title: string;
  categories: string[];
};

export async function getAllMarkdownFiles(): Promise<Post[]> {
  const contentDir = join(process.cwd(), "src/app/db");

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

    const slugs = (await readdir(contentDir, { withFileTypes: true })).filter(
      (dirent) => dirent.isFile() && dirent.name.endsWith(".md")
    );

    console.log(`Found ${slugs.length} markdown files in ${contentDir}`);

    const files = await Promise.all(
      slugs.map(async ({ name }) => {
        const { data: metadata } = matter(
          readFileSync(`${contentDir}/${name}`, "utf8")
        );
        return {
          slug: name.replace(/\.md$/, ""),
          title: metadata.title,
          categories: metadata.categories || [],
        } as Post;
      })
    );
    return files;
  } catch (error) {
    console.error(`Unexpected error in getAllMarkdownFiles:`, error);
    return [];
  }
}
