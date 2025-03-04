import { readdir, stat } from "fs/promises";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

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

// Content directory structure - for remote fetching in production
// This lets us avoid requiring the full directory structure at build time
export const contentStructure = {
  projects: [
    // List your project files here - this is used in production to avoid needing filesystem access
    "a-eye.md",
    "arena2slides.md",
    "circulaw.md",
    "composing-sink.md",
    "earth-directory.md",
    "easy-chinese.md",
    "flexplatform.md",
    "galileo-starter-kit.md",
    "global-climate-action-summit-2018.md",
    "ifttt-maker-platform.md",
    "logolens-figma-plugin.md",
    "logolens.md",
    "palace-games.md",
    "pico-core.md",
    "planetary-software.md",
    "whole-person-care.md",
  ],
  notes: [
    // List note files
    "Research-on-Protocols.md",
    "Research-on-Soil-Standards.md",
    "Screen-Reader-B2B-Market.md",
    "Storyboarding-with-Midjourney.md",
    "The-Evolution-of-Energy-Grids-and-the-Case-for-Localization.md",
    "becoming-a-biodesign-technologist.md",
  ],
  newsletters: [
    // List newsletter files
    "Issue-2021-01.md",
    "Issue-2021-02.md",
    "Issue-2021-03.md",
    "Issue-2021-04.md",
    "Issue-2021-05.md",
    "Issue-2021-10.md",
  ],
};

// Helper to get content - works with both filesystem and remote URL
export async function getContent(path: string): Promise<string> {
  if (!isProduction) {
    // Local development - read from filesystem
    const fullPath = join(contentBaseUrl, path);
    if (existsSync(fullPath)) {
      return readFileSync(fullPath, "utf8");
    }
    console.warn(`File not found: ${fullPath}`);
    return "";
  } else {
    // Production - fetch from remote
    try {
      const headers: Record<string, string> = {};
      if (process.env.GITHUB_ACCESS_TOKEN) {
        headers["Authorization"] = `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`;
      }

      const response = await fetch(`${contentBaseUrl}/${path}`, { headers });
      if (!response.ok) {
        console.warn(
          `Failed to fetch content from ${contentBaseUrl}/${path}: ${response.statusText}`
        );
        return "";
      }

      if (useGitHubAPI) {
        const data = await response.json();
        // GitHub API returns base64 encoded content
        return Buffer.from(data.content, "base64").toString("utf8");
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error(
        `Error fetching content from ${contentBaseUrl}/${path}:`,
        error
      );
      return "";
    }
  }
}

// Get file paths either from filesystem or predefined list
export async function getMarkdownFilePaths(
  contentType: "projects" | "notes" | "newsletters"
): Promise<string[]> {
  if (!isProduction) {
    // In development, use filesystem
    const contentDir = join(contentBaseUrl, contentType);
    try {
      const files = await getMarkdownFilesRecursively(contentDir);
      // Convert absolute paths to relative paths
      return files.map((file) => file.replace(contentBaseUrl + "/", ""));
    } catch (error) {
      console.error(`Error getting markdown files from ${contentDir}:`, error);
      return [];
    }
  } else {
    // In production, use predefined list
    return contentStructure[contentType].map((filename) =>
      join(contentType, filename)
    );
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
