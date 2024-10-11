import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/queries/project";
import PageHero from "@/components/page-hero";
import MarkdownContent from "@/components/MarkdownContent";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { remark } from "remark";
import remarkGfm from "remark-gfm"; // Add this line
import { visit } from "unist-util-visit";
import { Node } from "unist"; // Add this line
import styles from "@/app/markdown-styles.module.css";

interface Params {
  params: {
    slug: string;
  };
}

interface MarkdownContentProps {
  content: string;
  links: string[]; // Add this line
  footnotes: string[];
}

interface PostWithFilePath {
  // ... other properties ...
  url: string; // Add this line to define the 'url' property
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  const isValidDate = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const validPublishedAt = isValidDate(project.publishedAt || "")
    ? project.publishedAt || ""
    : "";

  const renderers = {
    code({
      node,
      inline,
      className,
      children,
      ...props
    }: {
      node: any;
      inline: boolean;
      className: string;
      children: React.ReactNode;
    }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={materialDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    link({ href, children }: { href: string; children: React.ReactNode }) {
      if (href.startsWith("[[") && href.endsWith("]]")) {
        const linkText = href.slice(2, -2);
        return <a href={`/some-path/${linkText}`}>{children}</a>;
      }
      return <a href={href}>{children}</a>;
    },
  };

  const extractLinksAndFootnotes = (content: string) => {
    const links: string[] = [];
    const footnotes: { [key: string]: string } = {}; // Change to an object
    const processor = remark()
      .use(remarkGfm)
      .use(() => (tree) => {
        visit(tree, "link", (node: Node & { url: string }) => {
          links.push(node.url);
        });
        visit(
          tree,
          "footnoteDefinition",
          (node: Node & { identifier: string; content: string }) => {
            footnotes[node.identifier] = node.content; // Adjust as needed
          }
        );
      });

    processor.processSync(content);
    return { links, footnotes };
  };

  const { links, footnotes } = extractLinksAndFootnotes(
    project.metadata.contentHtml
  );

  return (
    <div>
      <PageHero
        data={{
          ...project,
          tags: project.categories?.join(", ") || "",
          publishedAt: validPublishedAt,
          url: project.url, // Ensure this line is added
        }}
      />

      <MarkdownContent
        content={project.metadata.contentHtml}
        links={links}
        footnotes={footnotes}
      />
    </div>
  );
}
