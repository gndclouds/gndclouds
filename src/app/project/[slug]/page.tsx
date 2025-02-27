import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/queries/project";
import PageHero from "@/components/page-hero";
import MarkdownContent from "@/components/MarkdownContent";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import { Node } from "unist";
import styles from "@/components/MarkdownContent.module.css";

interface Params {
  params: {
    slug: string;
  };
}

// Define the processMarkdown function
async function processMarkdown(content: string) {
  // Convert Obsidian-style image syntax to standard markdown
  const convertedContent = content
    .replace(/!\[\[(.*?)\]\]/g, (match, p1) => {
      // Remove any file extension from the path
      const cleanPath = p1.trim();

      // Encode the path properly
      const encodedPath = encodeURIComponent(cleanPath)
        .replace(/%2F/g, "/")
        .replace(/%40/g, "@");

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
    });

  // Process the markdown content
  const processor = remark().use(remarkGfm);
  const processedContent = await processor.process(convertedContent);
  return processedContent.toString();
}

// Extract links and footnotes for MarkdownContent component
function extractLinksAndFootnotes(content: string) {
  // Convert Obsidian-style image syntax to standard markdown
  const convertedContent = content
    .replace(/!\[\[(.*?)\]\]/g, (match, p1) => {
      // Remove any file extension from the path
      const cleanPath = p1.trim();

      // Encode the path properly
      const encodedPath = encodeURIComponent(cleanPath)
        .replace(/%2F/g, "/")
        .replace(/%40/g, "@");

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
    });

  const links: string[] = [];
  const footnotes: { [key: string]: string } = {};

  const processor = remark()
    .use(remarkGfm)
    .use(() => (tree) => {
      visit(tree, "link", (node: Node & { url: string }) => {
        links.push(node.url);
      });
      visit(
        tree,
        "footnoteDefinition",
        (node: Node & { identifier: string; children: any[] }) => {
          footnotes[node.identifier] = node.children?.[0]?.value || "";
        }
      );
    });

  processor.processSync(convertedContent);
  return { links, footnotes };
}

export default async function ProjectPage({ params }: Params) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const processedContent = await processMarkdown(project.metadata.contentHtml);
  const { links, footnotes } = extractLinksAndFootnotes(
    project.metadata.contentHtml
  );

  return (
    <div className="">
      <PageHero
        data={{
          title: project.title,
          publishedAt: project.publishedAt || "",
          tags: project.categories?.join(", ") || "",
          url: project.url || "",
        }}
      />
      <div className={styles.markdown}>
        <MarkdownContent
          content={processedContent}
          links={links}
          footnotes={footnotes}
        />
      </div>
    </div>
  );
}
