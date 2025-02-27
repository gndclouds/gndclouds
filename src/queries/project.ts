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
  url: string; // Add this line to include 'url'
};

// Define the extended interface
interface PostWithFilePath extends Post {
  filePath: string;
  metadata: {
    contentHtml: string;
  };
  publishedAt?: string; // Add this line
  url: string; // Add this line to define the 'url' property
}

export async function getProjectBySlug(
  slug: string
): Promise<PostWithFilePath | null> {
  const allProjects = (await getAllMarkdownFiles()).map((post) => ({
    ...post,
    url: "", // Provide a default or computed value for 'url'
  })) as PostWithFilePath[]; // Ensure all projects are of type PostWithFilePath
  const project: PostWithFilePath | undefined = allProjects.find(
    (project) => project.slug === slug
  );

  if (!project) {
    // Return null instead of throwing an error
    return null;
  }
  // Now `project` is guaranteed to be `PostWithFilePath`

  const { data: metadata, content } = matter(
    readFileSync(project.filePath, "utf8")
  ); // Read the file using the file path

  // Convert Obsidian-style image syntax to standard markdown
  const convertedContent = content
    .replace(/!\[\[(.*?)\]\]/g, (match, p1) => {
      // Remove any file extension from the path
      const cleanPath = p1.trim();

      // Encode the path properly
      const encodedPath = encodeURIComponent(cleanPath)
        .replace(/%2F/g, "/")
        .replace(/%40/g, "@");

      // Use the correct path for images in src/app/db/assets
      // Add a line break before and after the image to ensure it's not inside a paragraph
      return `\n\n![${cleanPath}](/db-assets/${encodedPath})\n\n`;
    })
    // Also handle standard markdown image syntax with relative paths
    .replace(/!\[(.*?)\]\((assets\/media\/.*?)\)/g, (match, alt, src) => {
      // Ensure the path starts with a slash
      // Add a line break before and after the image to ensure it's not inside a paragraph
      return `\n\n![${alt}](/db-assets/media/${src.replace(
        "assets/media/",
        ""
      )})\n\n`;
    });

  return {
    slug: project.slug,
    title: metadata.title,
    categories: metadata.categories || [],
    filePath: project.filePath, // Add this line
    publishedAt: metadata.publishedAt, // Ensure this line reads the publishedAt property
    url: metadata.url, // Ensure this line reads the url property
    metadata: {
      contentHtml: convertedContent, // Use the converted content
    },
  };
}
