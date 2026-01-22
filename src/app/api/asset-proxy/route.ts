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
      console.error("Asset proxy: GITHUB_ACCESS_TOKEN is not configured");
      // Return 503 Service Unavailable to indicate the service is not available
      // This allows clients to handle it as a temporary issue and fall back to alternatives
      return NextResponse.json(
        { 
          error: "GitHub token not configured",
          message: "Asset proxy service is not available. Please configure GITHUB_ACCESS_TOKEN or use local asset paths."
        },
        { status: 503 }
      );
    }

    // Format the path for the GitHub API
    let formattedPath = path.startsWith("/") ? path.substring(1) : path;

    // Build the URL to fetch from GitHub
    let apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${formattedPath}?ref=${GITHUB_BRANCH}`;
    
    // Log the path being requested for debugging nested asset issues
    console.log(`Asset proxy: requesting path="${formattedPath}" from GitHub (owner=${GITHUB_OWNER}, repo=${GITHUB_REPO}, branch=${GITHUB_BRANCH})`);

    // Fetch the content with authentication
    let response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw",
        "User-Agent": "gndclouds-website",
      },
      // Remove next.revalidate as it can cause issues with dynamic routes
      cache: "no-store",
    });

    // If the path doesn't start with assets/ and the request failed, try with assets/ prefix
    // This handles cases where paths like "child/image.png" need to become "assets/child/image.png"
    if (!response.ok && response.status === 404 && !formattedPath.startsWith("assets/")) {
      const fallbackPath = `assets/${formattedPath}`;
      const fallbackUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${fallbackPath}?ref=${GITHUB_BRANCH}`;
      
      if (process.env.NODE_ENV === "production") {
        console.log(`Asset proxy: trying fallback path="${fallbackPath}"`);
      }
      
      response = await fetch(fallbackUrl, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3.raw",
          "User-Agent": "gndclouds-website",
        },
        cache: "no-store",
      });
      
      if (response.ok) {
        formattedPath = fallbackPath;
        apiUrl = fallbackUrl;
      }
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(
        `Failed to fetch asset from ${apiUrl}: ${response.status} ${response.statusText}`,
        errorText ? `Response: ${errorText.substring(0, 500)}` : ""
      );
      // Return the GitHub API error status, but cap at 500 to avoid exposing internal errors
      const statusCode = response.status >= 500 ? 500 : response.status;
      return NextResponse.json(
        { 
          error: `Failed to fetch asset: ${response.status} ${response.statusText}`,
          path: formattedPath,
          url: apiUrl,
          details: process.env.NODE_ENV === "development" ? errorText.substring(0, 500) : undefined
        },
        { status: statusCode }
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error details:", { errorMessage, errorStack });
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}
