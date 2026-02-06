import { getContent, getMarkdownFilePaths } from "./content-loader";
import matter from "gray-matter";

// Define the Post type
export type Post = {
  slug: string;
  title: string;
  categories: string[];
  filePath: string;
  url: string;
};

// Define the extended interface
interface PostWithFilePath extends Post {
  filePath: string;
  metadata: {
    contentHtml: string;
  };
  publishedAt?: string;
  url: string;
}

export async function getProjectBySlug(
  slug: string
): Promise<PostWithFilePath | null> {
  try {
    const filePaths = await getMarkdownFilePaths("projects");
    let projectPath = filePaths.find((path) => path.endsWith(`${slug}.md`));

    // Fallback: try direct path if not in list (handles edge cases like tree truncation)
    if (!projectPath) {
      projectPath = `projects/${slug}.md`;
    }

    const content = await getContent(projectPath);
    if (!content) {
      console.warn(`Empty content for ${projectPath}, skipping`);
      return null;
    }

    const { data: metadata, content: markdownContent } = matter(content);

    return {
      slug,
      title: metadata.title || "",
      categories: metadata.categories || [],
      filePath: projectPath,
      url: `/project/${slug}`,
      metadata: {
        contentHtml: markdownContent,
      },
      publishedAt: metadata.publishedAt,
    };
  } catch (error) {
    console.error(`Error getting project ${slug}:`, error);
    return null;
  }
}

export async function getAllProjects(): Promise<Post[]> {
  try {
    const filePaths = await getMarkdownFilePaths("projects");
    const projects = await Promise.all(
      filePaths.map(async (filePath) => {
        const content = await getContent(filePath);
        if (!content) return null;

        const { data: metadata } = matter(content);
        const slug = filePath.split("/").pop()?.replace(".md", "") || "";

        return {
          slug,
          title: metadata.title || "",
          categories: metadata.categories || [],
          filePath,
          url: `/project/${slug}`,
        };
      })
    );

    return projects.filter((project): project is Post => project !== null);
  } catch (error) {
    console.error("Error getting all projects:", error);
    return [];
  }
}
