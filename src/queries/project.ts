import { readdir } from "fs/promises";
import { readFileSync } from "fs";
import matter from "gray-matter";
import { getAllMarkdownFiles } from "./projects"; // Import the function to get all markdown files

// Define the Post type
export type Post = {
  slug: string;
  title: string;
  categories: string[];
  filePath: string; // Add the filePath property
};

// Define the extended interface
interface PostWithFilePath extends Post {
  filePath: string;
  metadata: {
    contentHtml: string;
  };
  publishedAt?: string; // Add this line
}

export async function getProjectBySlug(
  slug: string
): Promise<PostWithFilePath | null> {
  const allProjects = await getAllMarkdownFiles(); // Get all projects
  const project: PostWithFilePath | undefined = allProjects.find(
    (project) => project.slug === slug
  );

  if (!project) {
    throw new Error(`Project with slug ${slug} not found`);
  }
  // Now `project` is guaranteed to be `PostWithFilePath`

  const { data: metadata, content } = matter(
    readFileSync(project.filePath, "utf8")
  ); // Read the file using the file path

  return {
    slug: project.slug,
    title: metadata.title,
    categories: metadata.categories || [],
    filePath: project.filePath, // Add this line
    publishedAt: metadata.publishedAt, // Ensure this line reads the publishedAt property
    url: metadata.url, // Ensure this line reads the url property
    metadata: {
      contentHtml: content, // Use the content from the markdown file
    },
  };
}
