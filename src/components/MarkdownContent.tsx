import React from "react";
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
    const isProduction = process.env.NODE_ENV === "production";
    const hasGitHubToken = !!process.env.GITHUB_ACCESS_TOKEN;

    if (!src) {
      return null;
    }

    // For SVGs and GIFs, we still use the img tag as Next.js Image doesn't handle them well
    if (src.endsWith(".svg") || src.endsWith(".gif")) {
      // Ensure src starts with / for local paths
      let imgSrc = src.startsWith("/") ? src : `/${src}`;
      
      // For db-assets paths, properly URL encode the filename for special chars
      if (imgSrc.includes("/db-assets/")) {
        const pathParts = imgSrc.split("/db-assets/");
        if (pathParts.length === 2) {
          const filename = pathParts[1];
          const encodedFilename = filename
            .split("/")
            .map(part => encodeURIComponent(part))
            .join("/");
          imgSrc = `/db-assets/${encodedFilename}`;
        }
      }
      
      return <img src={imgSrc} alt={alt || "Image"} {...props} />;
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
        />
      );
    }

    // For db-assets paths that may need to use the proxy in production
    if (src.includes("/db-assets/") && isProduction && hasGitHubToken) {
      // Convert from /db-assets/path to assets/path for the proxy
      const assetPath = src
        .replace("/db-assets/", "assets/")
        .replace(/^\//, ""); // Remove leading slash

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
        />
      );
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
        const filename = pathParts[1];
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
};

const MarkdownContent = ({
  content,
  links,
  footnotes,
}: {
  content: string;
  links: string[];
  footnotes: { [key: string]: string };
}) => {
  // Check if we're in production mode
  const isProduction = process.env.NODE_ENV === "production";

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

  // Function to convert ![[image]] or ![[video]] to markdown or HTML
  const convertImageSyntax = (text: string) => {
    // Video file extensions
    const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv"];
    
    return (
      text
        .replace(/!\[\[(.*?)\]\]/g, (match, p1) => {
          // Remove any file extension from the path
          const cleanPath = p1.trim();
          
          // Check if it's a video file
          const isVideo = videoExtensions.some(ext => 
            cleanPath.toLowerCase().endsWith(ext)
          );

          // For local development, use the path as-is (spaces and special chars need to be URL encoded in the href)
          // But we need to properly encode it for the URL
          const pathParts = cleanPath.split("/");
          const encodedParts = pathParts.map((part: string) =>
            encodeURIComponent(part)
          );
          const encodedPath = encodedParts.join("/");

          if (isVideo) {
            // For videos, generate HTML video tag
            // Use encoded path for proper URL handling of spaces and special chars
            const videoSrc = isProduction && process.env.GITHUB_ACCESS_TOKEN
              ? `/api/asset-proxy?path=assets/${encodedPath}`
              : `/db-assets/${encodeURIComponent(cleanPath)}`;
            
            // Determine video type from extension
            const videoType = cleanPath.toLowerCase().endsWith('.webm') ? 'video/webm' :
                             cleanPath.toLowerCase().endsWith('.mov') ? 'video/quicktime' :
                             'video/mp4';
            
            return `\n\n<video controls style="max-width: 100%; height: auto; display: block; margin: 1rem 0;">
  <source src="${videoSrc}" type="${videoType}">
  Your browser does not support the video tag.
</video>\n\n`;
          }

          // For images, use markdown image syntax
          // In production with GitHub token, use the asset proxy
          if (isProduction && process.env.GITHUB_ACCESS_TOKEN) {
            return `\n\n![${cleanPath}](/api/asset-proxy?path=assets/${encodedPath})\n\n`;
          }

          // For local development, use the db-assets path
          // The browser will handle URL encoding of spaces automatically
          return `\n\n![${cleanPath}](/db-assets/${cleanPath})\n\n`;
        })
        // Also handle standard markdown image syntax with relative paths
        .replace(/!\[(.*?)\]\((assets\/media\/.*?)\)/g, (match, alt, src) => {
          const assetPath = src.replace("assets/media/", "");

          // In production with GitHub token, use the asset proxy
          if (isProduction && process.env.GITHUB_ACCESS_TOKEN) {
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

  return (
    <div className="flex w-full">
      <div className="flex-1 min-w-0 p-4">
        <div className={styles.reactMarkDown}>
          {/* Apply the CSS class here */}
          {/* Debug: Log the content to see what's being passed to ReactMarkdown */}
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
      <div className="w-80 shrink-0 p-4 ml-auto">
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
    </div>
  );
};

export default MarkdownContent;
