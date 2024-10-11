import React from "react";
import Link from "next/link";
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
  img: ({ node, ...props }) => <img {...props} alt={props.alt || "Image"} />,
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
    return text.replace(/!\[\[(.*?)\]\]/g, (match, p1) => {
      const encodedPath = encodeURIComponent(p1)
        .replace(/%2F/g, "/")
        .replace(/%40/g, "@"); // Replace %40 with @
      return `![](/assets/media/${encodedPath})`; // Ensure only one 'assets' is included
    });
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

  // Convert image syntax and remove footnotes from the main content
  const updatedContent = convertImageSyntax(content).replace(footnoteRegex, "");

  return (
    <div className="flex">
      <div className={`w-2/3 p-4 ${styles.reactMarkDown}`}>
        {/* Apply the CSS class here */}
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
