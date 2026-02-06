"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import styles from "./MarkdownContent.module.css"; // Import the CSS module
import { Components } from "react-markdown";
import LinkPreview from "./LinkPreview"; // Import the LinkPreview component

// Extend the Components type
interface ExtendedComponents extends Components {
  footnoteReference?: ({ identifier }: { identifier: string }) => JSX.Element;
  footnoteDefinition?: (props: {
    identifier: string;
    children: React.ReactNode;
  }) => JSX.Element;
  a?: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => JSX.Element;
}

// Use the extended type
const components: Partial<ExtendedComponents> = {
  img: ({ node, ...props }) => {
    // Extract src and alt from props
    const { src, alt } = props;
    // In client components, we can't access server-side env vars
    // But we can check if we should use the asset proxy
    // The asset proxy will handle authentication server-side
    const isProduction = process.env.NODE_ENV === "production";
    // Use asset proxy if:
    // 1. We're in production, OR
    // 2. NEXT_PUBLIC_USE_ASSET_PROXY is explicitly set to "true"
    // This allows development to also use the proxy if files aren't local
    const useAssetProxy = isProduction || process.env.NEXT_PUBLIC_USE_ASSET_PROXY === "true";

    if (!src) {
      return null;
    }

    // For SVGs and GIFs, we still use the img tag as Next.js Image doesn't handle them well
    if (src.endsWith(".svg") || src.endsWith(".gif")) {
      // Ensure src starts with / for local paths
      let imgSrc = src.startsWith("/") ? src : `/${src}`;
      let fallbackSrc: string | null = null;
      
      // For db-assets paths, try to convert to asset proxy if enabled
      if (imgSrc.includes("/db-assets/")) {
        const pathParts = imgSrc.split("/db-assets/");
        if (pathParts.length === 2) {
          let pathAfterDbAssets = pathParts[1];
          // Decode first in case it's already encoded (to avoid double encoding)
          try {
            pathAfterDbAssets = decodeURIComponent(pathAfterDbAssets);
          } catch (e) {
            // If decoding fails, continue with original
          }
          
          // Store the original local path as fallback
          const encodedFilename = pathAfterDbAssets
            .split("/")
            .map(part => encodeURIComponent(part))
            .join("/");
          fallbackSrc = `/db-assets/${encodedFilename}`;
          
          // If asset proxy is enabled, use it; otherwise use local path
          if (useAssetProxy) {
            // Ensure it starts with assets/ for the GitHub repo structure
            const assetPath = pathAfterDbAssets.startsWith("assets/")
              ? pathAfterDbAssets
              : `assets/${pathAfterDbAssets}`;
            imgSrc = `/api/asset-proxy?path=${encodeURIComponent(assetPath)}`;
          } else {
            imgSrc = fallbackSrc;
            fallbackSrc = null; // No fallback needed if we're already using local
          }
        }
      }
      
      // Handle error: if asset proxy fails, fall back to local path
      const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        if (fallbackSrc && imgSrc.startsWith("/api/asset-proxy")) {
          const img = e.currentTarget;
          img.src = fallbackSrc;
          // Remove the error handler to prevent infinite loops
          img.onerror = null;
        }
      };
      
      // eslint-disable-next-line @next/next/no-img-element -- SVG/GIF need <img> for proper rendering
      return <img src={imgSrc} alt={alt || "Image"} onError={fallbackSrc ? handleError : undefined} {...props} />;
    }

    // For external URLs
    if (src.startsWith("http")) {
      return (
        <Image
          src={src}
          alt={alt || "External Image"}
          width={700}
          height={400}
          className={styles.responsiveImage}
          style={{ objectFit: "contain" }}
          sizes="(max-width: 768px) 100vw, 700px"
          unoptimized // Use unoptimized for external images
        />
      );
    }

    // For asset-proxy URLs (these are our authenticated GitHub requests)
    if (src.startsWith("/api/asset-proxy")) {
      // Extract the path from the proxy URL to create a fallback
      const urlParams = new URLSearchParams(src.split("?")[1] || "");
      const assetPath = urlParams.get("path");
      let fallbackSrc: string | null = null;
      
      // If we have a path, create a fallback to local db-assets
      if (assetPath) {
        try {
          // Remove "assets/" prefix if present to get the relative path
          const relativePath = assetPath.startsWith("assets/") 
            ? assetPath.substring(7) 
            : assetPath;
          // Encode each part of the path
          const encodedPath = relativePath
            .split("/")
            .map(part => encodeURIComponent(part))
            .join("/");
          fallbackSrc = `/db-assets/${encodedPath}`;
        } catch (e) {
          // If path extraction fails, no fallback
        }
      }
      
      return (
        <Image
          src={src}
          alt={alt || "Asset Image"}
          width={700}
          height={400}
          className={styles.responsiveImage}
          style={{ objectFit: "contain" }}
          sizes="(max-width: 768px) 100vw, 700px"
          unoptimized // Must use unoptimized for proxy requests
          onError={fallbackSrc ? (e) => {
            // Fallback to local path if proxy fails
            const img = e.currentTarget;
            img.src = fallbackSrc!;
            img.onerror = null; // Prevent infinite loops
          } : undefined}
        />
      );
    }

    // For db-assets paths, try to convert to asset proxy if enabled
    // Otherwise use local path directly
    if (src.includes("/db-assets/")) {
      // Extract the path after /db-assets/
      let pathAfterDbAssets = src.split("/db-assets/")[1];
      if (!pathAfterDbAssets) {
        console.warn(`Invalid db-assets path: ${src}`);
        return null;
      }
      
      // Decode the path first in case it's already URL-encoded (to avoid double encoding)
      try {
        pathAfterDbAssets = decodeURIComponent(pathAfterDbAssets);
      } catch (e) {
        // If decoding fails, it might not be encoded or might be partially encoded
        // Continue with the original path
      }
      
      // Store the local path as fallback
      const encodedPath = pathAfterDbAssets
        .split("/")
        .map(part => encodeURIComponent(part))
        .join("/");
      const localSrc = `/db-assets/${encodedPath}`;
      
      // If asset proxy is enabled, use it; otherwise use local path
      if (useAssetProxy) {
        // The path after /db-assets/ should be used as-is for GitHub
        // It might already be assets/child/image.png or just child/image.png
        // We need to ensure it starts with assets/ for the GitHub repo structure
        let assetPath = pathAfterDbAssets;
        if (!assetPath.startsWith("assets/")) {
          assetPath = `assets/${assetPath}`;
        }

        const proxySrc = `/api/asset-proxy?path=${encodeURIComponent(assetPath)}`;

        return (
          <Image
            src={proxySrc}
            alt={alt || "Asset Image"}
            width={700}
            height={400}
            className={styles.responsiveImage}
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 100vw, 700px"
            unoptimized // Must use unoptimized for proxy requests
            onError={(e) => {
              // Fallback to local path if proxy fails
              const img = e.currentTarget;
              img.src = localSrc;
              img.onerror = null; // Prevent infinite loops
            }}
          />
        );
      } else {
        // Use local path directly
        return (
          <Image
            src={localSrc}
            alt={alt || "Asset Image"}
            width={700}
            height={400}
            className={styles.responsiveImage}
            style={{ objectFit: "contain" }}
            sizes="(max-width: 768px) 100vw, 700px"
            unoptimized={isProduction}
          />
        );
      }
    }

    // For standard internal images (including db-assets with spaces/special chars)
    // Ensure src starts with a leading slash
    let imageSrc = src.startsWith("/") ? src : `/${src}`;

    // For db-assets paths, we need to properly URL encode the filename
    // Next.js Image component needs the path to be properly encoded for special chars like @, spaces, etc.
    if (imageSrc.includes("/db-assets/")) {
      // Split the path to encode just the filename part, keeping the /db-assets/ prefix
      const pathParts = imageSrc.split("/db-assets/");
      if (pathParts.length === 2) {
        let filename = pathParts[1];
        // Decode first in case it's already encoded (to avoid double encoding)
        // Then re-encode to ensure proper encoding
        try {
          filename = decodeURIComponent(filename);
        } catch (e) {
          // If decoding fails, it might not be encoded or might be partially encoded
          // Continue with the original filename
        }
        // Encode the filename but preserve forward slashes if there are any
        const encodedFilename = filename
          .split("/")
          .map(part => encodeURIComponent(part))
          .join("/");
        imageSrc = `/db-assets/${encodedFilename}`;
      }
    }

    return (
      <Image
        src={imageSrc}
        alt={alt || "Image"}
        width={700}
        height={400}
        className={styles.responsiveImage}
        style={{ objectFit: "contain" }}
        sizes="(max-width: 768px) 100vw, 700px"
        unoptimized={isProduction} // Use unoptimized in production to avoid image optimization issues
      />
    );
  },
  footnoteReference: ({ identifier }: { identifier: string }) => (
    <sup id={`fnref-${identifier}`}>
      <a href={`#fn-${identifier}`}>{identifier}</a>
    </sup>
  ),
  footnoteDefinition: ({
    identifier,
    children,
  }: {
    identifier: string;
    children: React.ReactNode;
  }) => (
    <li id={`fn-${identifier}`}>
      {children}s<a href={`#fnref-${identifier}`}>↩</a>
    </li>
  ),
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    // If href contains double brackets (dynamic route pattern), render as plain text
    if (href && (href.includes("[[") || href.includes("]]"))) {
      return <span>{children}</span>;
    }

    // If href is invalid or empty, render as plain text
    if (!href || href.trim() === "") {
      return <span>{children}</span>;
    }

    // For internal links (starting with /), use Next.js Link
    if (href.startsWith("/")) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }

    // For external links, use regular anchor tag
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
  table: ({ children }) => (
    <div className={styles.tableWrapper}>
      <table>{children}</table>
    </div>
  ),
  pre: ({ children }) => (
    <div className={styles.codeBlockWrapper}>
      <pre>{children}</pre>
    </div>
  ),
};

const MarkdownContent = ({
  content,
  links,
  footnotes,
  showReferences = true,
  filePath,
}: {
  content: string;
  links: string[];
  footnotes: { [key: string]: string };
  showReferences?: boolean;
  filePath?: string;
}) => {
  // Check if we're in production mode
  // In client components, we can't access server-side env vars
  // But we can check if we should use the asset proxy
  const isProduction = process.env.NODE_ENV === "production";
  // Use asset proxy if:
  // 1. We're in production, OR
  // 2. NEXT_PUBLIC_USE_ASSET_PROXY is explicitly set to "true"
  // This allows development to also use the proxy if files aren't local
  const useAssetProxy = isProduction || process.env.NEXT_PUBLIC_USE_ASSET_PROXY === "true";

  // Function to convert Obsidian-style internal links [[link]] to plain text
  // This prevents Next.js from interpreting them as dynamic routes
  // NOTE: This should NOT convert ![[image]] or ![[video]] patterns (those are handled by convertImageSyntax)
  const convertInternalLinks = (text: string) => {
    return text
      // Handle Obsidian links with display text: [[link|display text]] (but not ![[...]])
      .replace(/(?<!!)\[\[([^\]]+)\|([^\]]+)\]\]/g, (match, link, displayText) => {
        return displayText.trim();
      })
      // Handle simple Obsidian links: [[link]] - but NOT ![[image/video]]
      // Use negative lookbehind to skip patterns that start with !
      .replace(/(?<!!)\[\[([^\]]+)\]\]/g, (match, link) => {
        return link.trim();
      })
      // Also handle any remaining markdown links that might have been created from Obsidian syntax
      // This catches cases like [[logs]]/Footnotes that might become markdown links
      .replace(/\[([^\]]+)\]\((\/\[\[[^\]]+\]\]\/[^\)]+)\)/g, (match, text, href) => {
        // If the href contains double brackets, just return the text
        return text;
      });
  };

  // Function to resolve image path for the GitHub db repo structure
  // Images and videos live in assets/ at repo root; markdown is in journals/, logs/, projects/
  const resolveImagePath = (imageName: string): string => {
    // If path already starts with assets/, use as-is (full path from repo root)
    if (imageName.startsWith("assets/")) {
      return imageName;
    }
    // If path has subdir (e.g. "media/IFTTT.png", "decision-labs/hero.png"), it's under assets/
    if (imageName.includes("/")) {
      return `assets/${imageName}`;
    }
    // Bare filename (e.g. "CleanShot.png") - images live in assets/ in the db repo
    return `assets/${imageName}`;
  };

  // Function to convert ![[image]] or ![[video]] to markdown or HTML
  const convertImageSyntax = (text: string) => {
    // Video file extensions
    const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv"];
    
    return (
      text
        .replace(/!\[\[(.*?)\]\]/g, (match, p1) => {
          // Remove any file extension from the path
          const cleanPath = p1.trim();
          
          // Resolve the image path relative to the markdown file
          const resolvedPath = resolveImagePath(cleanPath);
          
          // Check if it's a video file
          const isVideo = videoExtensions.some(ext => 
            cleanPath.toLowerCase().endsWith(ext)
          );

          // For local development, use the path as-is (spaces and special chars need to be URL encoded in the href)
          // But we need to properly encode it for the URL
          const pathParts = resolvedPath.split("/");
          const encodedParts = pathParts.map((part: string) =>
            encodeURIComponent(part)
          );
          const encodedPath = encodedParts.join("/");

          if (isVideo) {
            // For videos, generate HTML video tag
            // resolvedPath already includes assets/ prefix; encodedPath has it encoded
            const videoSrc = useAssetProxy
              ? `/api/asset-proxy?path=${encodeURIComponent(resolvedPath)}`
              : `/db-assets/${encodedPath}`;
            
            // Determine video type from extension
            const videoType = cleanPath.toLowerCase().endsWith('.webm') ? 'video/webm' :
                             cleanPath.toLowerCase().endsWith('.mov') ? 'video/quicktime' :
                             'video/mp4';
            
            // Generate video with clickable link
            // Wrap video in a link so users can click to open/download the video
            // Video controls will still function normally
            return `\n\n<div style="margin: 1rem 0;">
  <a href="${videoSrc}" target="_blank" rel="noopener noreferrer" style="display: block; text-decoration: none;">
    <video controls style="max-width: 100%; height: auto; display: block;">
      <source src="${videoSrc}" type="${videoType}">
      Your browser does not support the video tag.
    </video>
  </a>
</div>\n\n`;
          }

          // For images, use markdown image syntax
          // resolvedPath already includes assets/; use encodeURIComponent for the path param
          if (useAssetProxy) {
            return `\n\n![${cleanPath}](/api/asset-proxy?path=${encodeURIComponent(resolvedPath)})\n\n`;
          }

          // For local development, use the db-assets path with properly encoded filename
          return `\n\n![${cleanPath}](/db-assets/${encodedPath})\n\n`;
        })
        // Also handle standard markdown image syntax with relative paths
        .replace(/!\[(.*?)\]\((assets\/media\/.*?)\)/g, (match, alt, src) => {
          const assetPath = src.replace("assets/media/", "");

          // In production with GitHub token, use the asset proxy
          if (useAssetProxy) {
            return `\n\n![${alt}](/api/asset-proxy?path=${src})\n\n`;
          }

          // Otherwise use the local path
          return `\n\n![${alt}](/db-assets/media/${assetPath})\n\n`;
        })
    );
  };

  // Extract footnotes and links from the content
  const extractedFootnotes: { [key: string]: string } = {};
  const extractedLinks: string[] = [];
  const footnoteRegex = /\[\^(\d+)\]:\s*(.*)/g;
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;

  let match;
  while ((match = footnoteRegex.exec(content)) !== null) {
    if (match) {
      extractedFootnotes[match[1]] = match[2];
    }
  }

  while ((match = linkRegex.exec(content)) !== null) {
    extractedLinks.push(match[2]);
  }

  // Remove footnotes from the main content
  const contentWithoutFootnotes = content.replace(footnoteRegex, "");

  // Convert Obsidian-style internal links [[link]] to plain text first
  const contentWithoutInternalLinks = convertInternalLinks(contentWithoutFootnotes);

  // Convert Obsidian-style image syntax ![[image]] to standard markdown
  const updatedContent = convertImageSyntax(contentWithoutInternalLinks);

  // Client-side effect to convert /db-assets/ paths in video tags to asset proxy
  // This handles cases where videos are rendered as HTML and need path conversion
  // Also handles fallback when asset proxy fails
  useEffect(() => {
    // Helper function to convert asset proxy URL back to db-assets path
    const proxyToLocalPath = (proxyUrl: string): string | null => {
      try {
        const url = new URL(proxyUrl, window.location.origin);
        const pathParam = url.searchParams.get('path');
        if (pathParam) {
          // Remove "assets/" prefix if present
          const relativePath = pathParam.startsWith('assets/') 
            ? pathParam.substring(7) 
            : pathParam;
          // Encode each part of the path
          const encodedPath = relativePath
            .split('/')
            .map(part => encodeURIComponent(part))
            .join('/');
          return `/db-assets/${encodedPath}`;
        }
      } catch (e) {
        // If URL parsing fails, return null
      }
      return null;
    };

    // Add error handlers for videos using asset proxy
    const proxyVideos = document.querySelectorAll('video[src*="/api/asset-proxy"], video source[src*="/api/asset-proxy"]');
    proxyVideos.forEach((element) => {
      const videoElement = element as HTMLVideoElement | HTMLSourceElement;
      const src = videoElement.getAttribute('src');
      if (src && src.includes('/api/asset-proxy')) {
        const fallbackSrc = proxyToLocalPath(src);
        if (fallbackSrc) {
          const handleError = () => {
            videoElement.setAttribute('src', fallbackSrc);
            if (videoElement.tagName === 'SOURCE' && videoElement.parentElement?.tagName === 'VIDEO') {
              const parentVideo = videoElement.parentElement as HTMLVideoElement;
              parentVideo.load();
            }
            videoElement.removeEventListener('error', handleError);
          };
          videoElement.addEventListener('error', handleError, { once: true });
        }
      }
    });

    // Convert /db-assets/ paths to asset proxy if enabled
    // Only convert if useAssetProxy is true (checked via NEXT_PUBLIC_USE_ASSET_PROXY or production mode)
    const shouldUseProxy = process.env.NODE_ENV === "production" || process.env.NEXT_PUBLIC_USE_ASSET_PROXY === "true";
    
    if (shouldUseProxy) {
      // Find all video and source elements with /db-assets/ paths
      const videos = document.querySelectorAll('video[src*="/db-assets/"], video source[src*="/db-assets/"]');
      videos.forEach((element) => {
        const videoElement = element as HTMLVideoElement | HTMLSourceElement;
        const src = videoElement.getAttribute('src');
        if (src && src.includes('/db-assets/')) {
          const pathAfterDbAssets = src.split('/db-assets/')[1];
          if (pathAfterDbAssets) {
            try {
              const decodedPath = decodeURIComponent(pathAfterDbAssets);
              const assetPath = decodedPath.startsWith('assets/') ? decodedPath : `assets/${decodedPath}`;
              const proxySrc = `/api/asset-proxy?path=${encodeURIComponent(assetPath)}`;
              videoElement.setAttribute('src', proxySrc);
              // Store original path as data attribute for fallback
              videoElement.setAttribute('data-fallback-src', src);
              // Also update parent video element if this is a source element
              if (videoElement.tagName === 'SOURCE' && videoElement.parentElement?.tagName === 'VIDEO') {
                const parentVideo = videoElement.parentElement as HTMLVideoElement;
                parentVideo.load(); // Reload video with new source
              }
            } catch (e) {
              // If decoding fails, skip
            }
          }
        }
      });

      // Also handle images with /db-assets/ paths
      const images = document.querySelectorAll('img[src*="/db-assets/"]');
      images.forEach((img) => {
        const imgElement = img as HTMLImageElement;
        const src = imgElement.getAttribute('src');
        if (src && src.includes('/db-assets/')) {
          const pathAfterDbAssets = src.split('/db-assets/')[1];
          if (pathAfterDbAssets) {
            try {
              const decodedPath = decodeURIComponent(pathAfterDbAssets);
              const assetPath = decodedPath.startsWith('assets/') ? decodedPath : `assets/${decodedPath}`;
              const proxySrc = `/api/asset-proxy?path=${encodeURIComponent(assetPath)}`;
              imgElement.setAttribute('src', proxySrc);
              // Store original path as data attribute for fallback
              imgElement.setAttribute('data-fallback-src', src);
            } catch (e) {
              // If decoding fails, skip
            }
          }
        }
      });

      // Also handle anchor tags that link to /db-assets/ videos
      const links = document.querySelectorAll('a[href*="/db-assets/"]');
      links.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && href.includes('/db-assets/') && /\.(mp4|webm|mov|avi|mkv|png|jpg|jpeg|gif|webp|svg)$/i.test(href)) {
          const pathAfterDbAssets = href.split('/db-assets/')[1];
          if (pathAfterDbAssets) {
            try {
              const decodedPath = decodeURIComponent(pathAfterDbAssets);
              const assetPath = decodedPath.startsWith('assets/') ? decodedPath : `assets/${decodedPath}`;
              const proxySrc = `/api/asset-proxy?path=${encodeURIComponent(assetPath)}`;
              link.setAttribute('href', proxySrc);
              // Store original path as data attribute for fallback
              link.setAttribute('data-fallback-href', href);
            } catch (e) {
              // If decoding fails, skip
            }
          }
        }
      });
    }

    // Add error handlers for images using asset proxy
    const proxyImages = document.querySelectorAll('img[src*="/api/asset-proxy"]');
    proxyImages.forEach((img) => {
      const imgElement = img as HTMLImageElement;
      const src = imgElement.getAttribute('src');
      const fallbackSrc = imgElement.getAttribute('data-fallback-src') || (src ? proxyToLocalPath(src) : null);
      if (fallbackSrc) {
        const handleError = () => {
          imgElement.setAttribute('src', fallbackSrc);
          imgElement.removeEventListener('error', handleError);
        };
        imgElement.addEventListener('error', handleError, { once: true });
      }
    });

    // Add error handlers for links using asset proxy
    const proxyLinks = document.querySelectorAll('a[href*="/api/asset-proxy"]');
    proxyLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const fallbackHref = link.getAttribute('data-fallback-href') || (href ? proxyToLocalPath(href) : null);
      if (fallbackHref) {
        // For links, we can't easily detect errors, but we can add a click handler
        // that checks if the resource exists before navigating
        // For now, just store the fallback - the video/image error handlers will handle the actual fallback
      }
    });
  }, [updatedContent]);

  const hasReferences =
    showReferences &&
    (extractedLinks.length > 0 || Object.keys(extractedFootnotes).length > 0);

  return (
    <div
      className={
        hasReferences ? "flex w-full flex-col md:flex-row" : "w-full"
      }
    >
      <div className="flex-1 min-w-0 p-4">
        <div className={styles.reactMarkDown}>
          <ReactMarkdown
            className="markdown"
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={components}
          >
            {updatedContent}
          </ReactMarkdown>
        </div>
      </div>
      {hasReferences && (
        <div className="w-full md:w-80 shrink-0 p-4 md:ml-auto">
          <h3 className="uppercase text-sm opacity-50">References</h3>
          {extractedLinks.length > 0 && (
            <>
              <h4 className="uppercase text-sm opacity-50 mb-3">Links:</h4>
              <div className="space-y-3">
                {extractedLinks.map((link, index) => (
                  <LinkPreview key={index} url={link} />
                ))}
              </div>
            </>
          )}
          {Object.keys(extractedFootnotes).length > 0 && (
            <>
              <h4 className="uppercase text-sm opacity-50 mt-6 mb-3">
                Footnotes:
              </h4>
              <ul>
                {Object.entries(extractedFootnotes).map(([key, text]) => (
                  <li
                    key={key}
                    id={`fn-${key}`}
                    className="text-sm bg-textDark dark:bg-textLight p-2 mb-4"
                  >
                    {text} <a href={`#fnref-${key}`}>↩</a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MarkdownContent;
