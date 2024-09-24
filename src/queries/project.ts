import { readdir } from "fs/promises";
import { readFileSync } from "fs";
import matter from "gray-matter";
import { getAllMarkdownFiles } from "./projects"; // Import the function to get all markdown files

// Define the Post type
export type Post = {
  slug: string;
  title: string;
  categories: string[];
};

export async function getProjectBySlug(slug: string): Promise<Post | null> {
  const allProjects = await getAllMarkdownFiles(); // Get all projects
  const project = allProjects.find((project) => project.slug === slug); // Find the project by slug

  if (!project) {
    return null;
  }

  const { data: metadata, content } = matter(
    readFileSync(project.filePath, "utf8")
  ); // Read the file using the file path

  console.log("Metadata:", metadata);
  console.log("Content:", content);

  return {
    slug: project.slug,
    title: metadata.title,
    categories: metadata.categories || [],
    metadata: {
      ...metadata,
      contentHtml: content,
    },
  } as Post;
}
