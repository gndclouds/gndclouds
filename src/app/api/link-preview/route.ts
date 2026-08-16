import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch the HTML content of the URL
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkPreviewBot/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract metadata
    const ogImage = $('meta[property="og:image"]').attr("content") || null;
    const metadata = {
      title:
        $("title").text() ||
        $('meta[property="og:title"]').attr("content") ||
        url,
      description:
        $('meta[name="description"]').attr("content") ||
        $('meta[property="og:description"]').attr("content") ||
        "",
      image: ogImage ? getAbsoluteUrl(ogImage, url) : null,
      siteName: $('meta[property="og:site_name"]').attr("content") || null,
      favicon: getFavicon($, url),
    };

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Error fetching link preview:", error);
    return NextResponse.json(
      { error: "Failed to fetch link preview" },
      { status: 500 }
    );
  }
}

// Helper function to convert relative URLs to absolute URLs
function getAbsoluteUrl(urlOrPath: string, baseUrl: string): string {
  // If it's already an absolute URL, return as-is
  if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
    return urlOrPath;
  }

  // If it's a relative URL (starts with /), make it absolute
  if (urlOrPath.startsWith("/")) {
    try {
      const base = new URL(baseUrl);
      return `${base.protocol}//${base.host}${urlOrPath}`;
    } catch (e) {
      return urlOrPath;
    }
  }

  // If it's a protocol-relative URL (starts with //), add the protocol
  if (urlOrPath.startsWith("//")) {
    try {
      const base = new URL(baseUrl);
      return `${base.protocol}${urlOrPath}`;
    } catch (e) {
      return urlOrPath;
    }
  }

  // Otherwise, treat as relative path and resolve against base URL
  try {
    const base = new URL(baseUrl);
    return new URL(urlOrPath, base).toString();
  } catch (e) {
    return urlOrPath;
  }
}

// Helper function to get favicon
function getFavicon($: cheerio.CheerioAPI, url: string): string | null {
  // Try to find favicon in various ways
  const faviconLink =
    $('link[rel="icon"]').attr("href") ||
    $('link[rel="shortcut icon"]').attr("href") ||
    $('link[rel="apple-touch-icon"]').attr("href");

  if (faviconLink) {
    return getAbsoluteUrl(faviconLink, url);
  }

  // Default to favicon.ico at the root of the domain
  try {
    const baseUrl = new URL(url);
    return `${baseUrl.protocol}//${baseUrl.host}/favicon.ico`;
  } catch (e) {
    return null;
  }
}
