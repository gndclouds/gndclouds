import React from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import styles from "./MarkdownContent.module.css"; // Import the CSS module
import { Components } from "react-markdown";

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

    // Skip Next.js Image for external URLs or SVGs
    if (!src || src.startsWith("http") || src.endsWith(".svg")) {
      return <img {...props} alt={alt || "Image"} />;
    }

    // Ensure src starts with a leading slash
    const imageSrc = src.startsWith("/") ? src : `/${src}`;

    // Return the Image component directly without wrapping it in a div
    // This prevents the hydration error when the image is inside a paragraph
    return (
      <Image
        src={imageSrc}
        alt={alt || "Image"}
        width={700}
        height={400}
        className={styles.responsiveImage}
        style={{ objectFit: "contain" }}
        sizes="(max-width: 768px) 100vw, 700px"
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
  // Function to convert ![[image]] to ![](/assets/media/image)
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

          // Use the correct path for images in src/app/db/assets
          // Add a line break before and after the image to ensure it's not inside a paragraph
          return `\n\n![${cleanPath}](/db-assets/${encodedPath})\n\n`;
        })
        // Also handle standard markdown image syntax with relative paths
        .replace(/!\[(.*?)\]\((assets\/media\/.*?)\)/g, (match, alt, src) => {
          // Ensure the path starts with a slash
          // Add a line break before and after the image to ensure it's not inside a paragraph
          return `\n\n![${alt}](/db-assets/media/${src.replace(
            "assets/media/",
            ""
          )})\n\n`;
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
        <h4 className="uppercase text-sm opacity-50">Links:</h4>
        <ul>
          {extractedLinks.map((link, index) => (
            <li
              key={index}
              className="text-sm bg-textDark dark:bg-textLight p-2 mb-4"
            >
              <Link href={link} target="_blank" rel="noopener noreferrer">
                {link}
              </Link>
            </li>
          ))}
        </ul>
        <h4 className="uppercase text-sm opacity-50">Footnotes:</h4>
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
      </div>
    </div>
  );
};

export default MarkdownContent;
