import { NextRequest, NextResponse } from "next/server";

// Environment variables for GitHub API access
const GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN || "";
const GITHUB_OWNER = process.env.GITHUB_OWNER || "gndclouds";
const GITHUB_REPO = process.env.GITHUB_REPO || "db";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

// Configure for dynamic route handling
export const dynamic = "force-dynamic";

/**
 * Asset proxy endpoint to securely fetch assets from private GitHub repositories
 * This allows us to access private repo content without exposing tokens to the client
 */
export async function GET(request: NextRequest) {
  try {
    // Get the asset path from the query parameter using searchParams
    const path = request.nextUrl.searchParams.get("path");

    if (!path) {
      return NextResponse.json(
        { error: "Missing path parameter" },
        { status: 400 }
      );
    }

    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { error: "GitHub token not configured" },
        { status: 500 }
      );
    }

    // Format the path for the GitHub API
    const formattedPath = path.startsWith("/") ? path.substring(1) : path;

    // Build the URL to fetch from GitHub
    const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${formattedPath}?ref=${GITHUB_BRANCH}`;

    // Fetch the content with authentication
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw",
        "User-Agent": "gndclouds-website",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch asset: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: `Failed to fetch asset: ${response.status}` },
        { status: response.status }
      );
    }

    // Get the content type from the response
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    // Get the content as an array buffer
    const buffer = await response.arrayBuffer();

    // Return the content with the appropriate content-type
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error in asset proxy:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
