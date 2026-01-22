import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

// Simple content type mapping based on file extension
function getContentType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase() || '';
  const contentTypes: Record<string, string> = {
    // Images
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    // Videos
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    'mkv': 'video/x-matroska',
    // Other
    'zip': 'application/zip',
    'pdf': 'application/pdf',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

export const dynamic = "force-dynamic";

/**
 * Route handler for /db-assets/[...path]
 * 
 * This handler:
 * 1. First tries to serve files from public/db-assets/ (if they exist locally)
 * 2. If not found locally, proxies to the asset proxy API which fetches from GitHub
 * 
 * This allows seamless fallback between local development assets and GitHub-hosted assets.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Reconstruct the full path from the catch-all segments
    const pathSegments = params.path || [];
    const assetPath = pathSegments.join("/");

    if (!assetPath) {
      return NextResponse.json(
        { error: "Missing asset path" },
        { status: 400 }
      );
    }

    // Decode the path in case it's URL-encoded
    let decodedPath: string;
    try {
      decodedPath = decodeURIComponent(assetPath);
    } catch (e) {
      decodedPath = assetPath;
    }

    // Try to serve from local public/db-assets/ directory first
    const publicPath = join(process.cwd(), "public", "db-assets", decodedPath);
    
    if (existsSync(publicPath)) {
      try {
        const fileBuffer = await readFile(publicPath);
        const contentType = getContentType(publicPath);

        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=3600", // Cache for 1 hour
          },
        });
      } catch (error) {
        console.error(`Error reading local file ${publicPath}:`, error);
        // Fall through to check other locations
      }
    }

    // If not in public/db-assets/, try src/app/db/assets/ (development fallback)
    // This handles cases where assets exist in source but haven't been copied yet
    // Try the full path first (e.g., logs/file.mp4)
    const srcAssetsPath = join(process.cwd(), "src", "app", "db", "assets", decodedPath);
    
    if (existsSync(srcAssetsPath)) {
      try {
        const fileBuffer = await readFile(srcAssetsPath);
        const contentType = getContentType(srcAssetsPath);

        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=3600", // Cache for 1 hour
          },
        });
      } catch (error) {
        console.error(`Error reading local file ${srcAssetsPath}:`, error);
        // Fall through to try filename only
      }
    }

    // If the path includes subdirectories (like "logs/file.mp4"), also try just the filename
    // Some assets might be directly in assets/ without subdirectory structure
    if (decodedPath.includes("/")) {
      const filenameOnly = decodedPath.split("/").pop() || decodedPath;
      const srcAssetsPathFilenameOnly = join(process.cwd(), "src", "app", "db", "assets", filenameOnly);
      
      if (existsSync(srcAssetsPathFilenameOnly)) {
        try {
          console.log(`Found asset at: ${srcAssetsPathFilenameOnly} (using filename only from path: ${decodedPath})`);
          const fileBuffer = await readFile(srcAssetsPathFilenameOnly);
          const contentType = getContentType(srcAssetsPathFilenameOnly);

          return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=3600", // Cache for 1 hour
            },
          });
        } catch (error) {
          console.error(`Error reading local file ${srcAssetsPathFilenameOnly}:`, error);
          // Fall through to proxy
        }
      } else {
        console.log(`Asset not found at: ${srcAssetsPathFilenameOnly} (tried filename only from: ${decodedPath})`);
      }
    }

    // Also try src/app/db/public/ as another possible location
    const srcPublicPath = join(process.cwd(), "src", "app", "db", "public", decodedPath);
    
    if (existsSync(srcPublicPath)) {
      try {
        const fileBuffer = await readFile(srcPublicPath);
        const contentType = getContentType(srcPublicPath);

        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=3600", // Cache for 1 hour
          },
        });
      } catch (error) {
        console.error(`Error reading local file ${srcPublicPath}:`, error);
        // Fall through to proxy
      }
    }

    // If file doesn't exist locally, proxy to asset proxy API
    // The asset proxy will handle GitHub fetching or return appropriate errors
    const assetProxyUrl = new URL("/api/asset-proxy", request.url);
    
    // Ensure the path starts with "assets/" for GitHub repo structure
    const githubPath = decodedPath.startsWith("assets/")
      ? decodedPath
      : `assets/${decodedPath}`;
    
    assetProxyUrl.searchParams.set("path", githubPath);

    // Fetch from asset proxy
    const proxyResponse = await fetch(assetProxyUrl.toString(), {
      headers: {
        // Forward any relevant headers
        "User-Agent": request.headers.get("User-Agent") || "gndclouds-website",
      },
      cache: "no-store",
    });

    // If proxy returns an error, handle it gracefully
    if (!proxyResponse.ok) {
      // If it's a 503 (service unavailable), we can return a more helpful message
      if (proxyResponse.status === 503) {
        return NextResponse.json(
          {
            error: "Asset not available",
            message: "Asset is not available locally and GitHub token is not configured. Please configure GITHUB_ACCESS_TOKEN or ensure assets are in public/db-assets/",
            path: decodedPath,
          },
          { status: 503 }
        );
      }

      // For 404s (file not found), log but don't break the page
      // Return a transparent 1x1 pixel for images/videos to prevent broken image icons
      if (proxyResponse.status === 404) {
        console.warn(`Asset not found: ${decodedPath} (tried GitHub path: ${githubPath})`);
        
        // Determine content type from file extension
        const ext = decodedPath.split('.').pop()?.toLowerCase();
        let contentType = "application/octet-stream";
        let placeholder: Buffer;
        
        if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext || '')) {
          // Return a transparent 1x1 PNG for images
          contentType = "image/png";
          // Base64 encoded 1x1 transparent PNG
          const transparentPng = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
          placeholder = Buffer.from(transparentPng, 'base64');
        } else if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext || '')) {
          // For videos, return a minimal valid MP4 placeholder (1x1 black frame)
          // This prevents broken/greenish video placeholders
          contentType = "video/mp4";
          // Minimal valid MP4 (~1KB) - single black frame, H.264/AVC encoded
          // Base64 encoded from: https://gist.github.com/dmlap/5643609
          const minimalMp4Base64 = "AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAr9tZGF0AAACoAYF//+c3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDEyNSAtIEguMjY0L01QRUctNCBBVkMgY29kZWMgLSBDb3B5bGVmdCAyMDAzLTIwMTIgLSBodHRwOi8vd3d3LnZpZGVvbGFuLm9yZy94MjY0Lmh0bWwgLSBvcHRpb25zOiBjYWJhYz0xIHJlZj0zIGRlYmxvY2s9MTowOjAgYW5hbHlzZT0weDM6MHgxMTMgbWU9aGV4IHN1Ym1lPTcgcHN5PTEgcHN5X3JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0xNiBjaHJvbWFfbWU9MSB0cmVsbGlzPTEgOHg4ZGN0PTEgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9LTIgdGhyZWFkcz02IGxvb2thaGVhZF90aHJlYWRzPTEgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MyBiX3B5cmFtaWQ9MiBiX2FkYXB0PTEgYl9iaWFzPTAgZGlyZWN0PTEgd2VpZ2h0Yj0xIG9wZW5fZ29wPTAgd2VpZ2h0cD0yIGtleWludD0yNTAga2V5aW50X21pbj0yNCBzY2VuZWN1dD00MCBpbnRyYV9yZWZyZXNoPTAgcmNfbG9va2FoZWFkPTQwIHJjPWNyZiBtYnRyZWU9MSBjcmY9MjMuMCBxY29tcD0wLjYwIHFwbWluPTAgcXBtYXg9NjkgcXBzdGVwPTQgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAAA9liIQAV/0TAAYdeBTXzg8AAALvbm9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAAACoAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAhl0cmFrAAAAXHRraGQAAAAPAAAAAAAAAAAAAAABAAAAAAAAACoAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAgAAAAIAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAAqAAAAAAABAAAAAAGRbWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAAwAAAAAgBVxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAABPG1pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAPxzdGJsAAAAmHN0c2QAAAAAAAAAAQAAAIhhdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAgACABIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAAMmF2Y0NBZAAK/+EAGWdkAAqs2V+WXAWyAAADAAIAAAMAYB4kSywBAAZo6+PLIsAAAAAYc3R0cwAAAAAAAAABAAAAAQAAAgAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAFHN0c3oAAAAAAAACtwAAAAEAAAAUc3RjbwAAAAAAAAABAAAAMAAAAGJ1ZHRhAAAAWm1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAALWlsc3QAAAAlqXRvbwAAAB1kYXRhAAAAAQAAAABMYXZmNTQuNjMuMTA0";
          placeholder = Buffer.from(minimalMp4Base64, 'base64');
        } else {
          // For other file types, return 404
          return NextResponse.json(
            {
              error: "Asset not found",
              message: `Asset not found: ${decodedPath}`,
              path: decodedPath,
            },
            { status: 404 }
          );
        }
        
        return new NextResponse(placeholder, {
          status: 200, // Return 200 with placeholder to prevent broken images
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=3600",
            "X-Asset-Status": "not-found", // Custom header to indicate this is a placeholder
          },
        });
      }

      // For other errors, return the proxy's response
      const errorData = await proxyResponse.json().catch(() => ({}));
      return NextResponse.json(errorData, { status: proxyResponse.status });
    }

    // Get the content type from the proxy response
    const contentType = proxyResponse.headers.get("content-type") || "application/octet-stream";
    const buffer = await proxyResponse.arrayBuffer();

    // Return the proxied content
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error in db-assets route:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to serve asset",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
