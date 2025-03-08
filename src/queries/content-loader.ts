import { readdir, stat } from "fs/promises";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import fs from "fs/promises";

// Support both local development and production deployments
export const contentMode = process.env.NEXT_PUBLIC_CONTENT_MODE || "local";
export const isProduction = contentMode === "remote";

// For private GitHub repos, we need to use the API instead of raw.githubusercontent.com
export const useGitHubAPI = !!process.env.GITHUB_ACCESS_TOKEN;
export const githubOwner = process.env.GITHUB_OWNER || "gndclouds";
export const githubRepo = process.env.GITHUB_REPO || "db";
export const githubBranch = process.env.GITHUB_BRANCH || "main";

// This URL is used to fetch content
export const contentBaseUrl = isProduction
  ? useGitHubAPI
    ? `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents`
    : process.env.NEXT_PUBLIC_CONTENT_BASE_URL ||
      `https://raw.githubusercontent.com/${githubOwner}/${githubRepo}/${githubBranch}`
  : join(process.cwd(), "src/app/db");

// Get file paths either from filesystem or GitHub API
export async function getMarkdownFilePaths(
  contentType: "projects" | "notes" | "newsletters" | "logs"
): Promise<string[]> {
  if (!isProduction) {
    // In development, use filesystem
    const contentDir = join(contentBaseUrl, contentType);
    try {
      const files = await getMarkdownFilesRecursively(contentDir);
      // Convert absolute paths to relative paths and remove any 'default/' prefix
      return files.map((file) =>
        file.replace(contentBaseUrl + "/", "").replace(/^default\//, "")
      );
    } catch (error) {
      console.error(`Error getting markdown files from ${contentDir}:`, error);
      return [];
    }
  } else {
    // In production, fetch directory contents from GitHub API
    try {
      const apiUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${contentType}?ref=${githubBranch}`;

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
          Accept: "application/vnd.github.v3.raw",
          "User-Agent": "gndclouds-website",
        },
      });

      if (!response.ok) {
        console.error(
          `Failed to fetch directory contents: ${response.statusText}`
        );
        return [];
      }

      const contents = await response.json();

      // Filter for markdown files only
      const markdownFiles = contents
        .filter(
          (item: any) => item.type === "file" && item.name.endsWith(".md")
        )
        .map((item: any) => join(contentType, item.name));

      return markdownFiles;
    } catch (error) {
      console.error(`Error fetching directory contents from GitHub:`, error);
      return [];
    }
  }
}

// Recursive function to get markdown files from filesystem - only used in development
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

// Get content from either filesystem or GitHub API
export async function getContent(filePath: string): Promise<string | null> {
  try {
    if (!isProduction) {
      // In development, read from filesystem
      const fullPath = join(process.cwd(), "src/app/db", filePath);
      const content = await fs.readFile(fullPath, "utf-8");
      return content;
    } else {
      // In production, fetch directly from GitHub API
      const apiUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${filePath}?ref=${githubBranch}`;

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
          Accept: "application/vnd.github.v3.raw",
          "User-Agent": "gndclouds-website",
        },
      });

      if (!response.ok) {
        console.error(
          `Failed to fetch content from ${apiUrl}: ${response.statusText}`
        );
        return null;
      }

      return await response.text();
    }
  } catch (error) {
    console.error(`Error getting content for ${filePath}:`, error);
    return null;
  }
}

// Fetch and parse a single markdown file
export async function getMarkdownFile(filePath: string) {
  try {
    const content = await getContent(filePath);
    if (!content) return null;

    const { data: metadata, content: markdownContent } = matter(content);
    return {
      metadata,
      content: markdownContent,
      filePath,
    };
  } catch (error) {
    console.error(`Error processing markdown file ${filePath}:`, error);
    return null;
  }
}

// Get an asset URL (for images, etc.)
export function getAssetUrl(assetPath: string): string {
  if (!isProduction) {
    // In development, serve from the local filesystem via public folder
    return `/db-assets/${assetPath.replace(/^(assets|public)\//, "")}`;
  }

  // In production with GitHub token, generate a GitHub content URL
  if (useGitHubAPI) {
    // Format asset path for GitHub API
    const apiPath = assetPath.startsWith("/")
      ? assetPath.substring(1)
      : assetPath;
    return `${contentBaseUrl}/${apiPath}?ref=${githubBranch}`;
  }

  // Otherwise use the raw GitHub URL
  return `${contentBaseUrl}/${assetPath}`;
}

// Generate a properly authenticated URL for binary assets
export function getAuthenticatedAssetUrl(assetPath: string): string {
  const url = getAssetUrl(assetPath);

  // If using a GitHub token in production, we need to use an authenticated proxy
  if (isProduction && process.env.GITHUB_ACCESS_TOKEN) {
    // Return a URL to our own API endpoint that will proxy the request with auth
    return `/api/asset-proxy?path=${encodeURIComponent(assetPath)}`;
  }

  return url;
}
