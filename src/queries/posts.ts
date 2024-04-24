import { readdir } from "fs/promises";
import { readFileSync } from "fs";
import matter from "gray-matter";

export async function getAllMarkdownFiles(): Promise<Post[]> {
  const contentDir = "./src/app/db/content";
  const slugs = (await readdir(contentDir, { withFileTypes: true })).filter(
    (dirent) => dirent.isFile() && dirent.name.endsWith(".md")
  );

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
}
