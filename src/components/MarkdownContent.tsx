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
}

// Use the extended type
const components: Partial<ExtendedComponents> = {
  img: ({ node, ...props }) => {
    // Extract src and alt from props
    const { src, alt } = props;
    const isProduction = process.env.NODE_ENV === 'production';
    const hasGitHubToken = !!process.env.GITHUB_ACCESS_TOKEN;

    if (!src) {
      return null;
    }

    // For SVGs, we still use the img tag as Next.js Image doesn't handle SVGs well
    if (src.endsWith(".svg")) {
      return <img {...props} alt={alt || "SVG Image"} />;
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
        .replace(/^\//, ''); // Remove leading slash
        
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

    // For standard internal images
    // Ensure src starts with a leading slash
    const imageSrc = src.startsWith("/") ? src : `/${src}`;

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
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Function to convert ![[image]] to ![](/assets/media/image) or to use asset proxy in production
  const convertImageSyntax = (text: string) => {
    return (
      text
        .replace(/!\[\[(.*?)\]\]/g, (match, p1) => {
          // Remove any file extension from the path
          const cleanPath = p1.trim();

          // Encode the path properly
          const encodedPath = encodeURIComponent(cleanPath)
            .replace(/%2F/g, "/")
            .replace(/%40/g, "@"); // Replace %40 with @

          // In production with GitHub token, use the asset proxy
          if (isProduction && process.env.GITHUB_ACCESS_TOKEN) {
            return `\n\n![${cleanPath}](/api/asset-proxy?path=assets/${encodedPath})\n\n`;
          }
          
          // Otherwise use the local path for images
          return `\n\n![${cleanPath}](/db-assets/${encodedPath})\n\n`;
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

  // Remove footnotes from the main content without re-converting image syntax
  const updatedContent = content.replace(footnoteRegex, "");

  return (
    <div className="flex">
      <div className={`w-2/3 p-4 ${styles.reactMarkDown}`}>
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
      <div className="w-1/3 p-4">
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
