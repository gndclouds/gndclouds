import { notFound } from "next/navigation";
import { resolveArtifactWikiAssetRepoPath } from "@/lib/artifacts-paths";
import { getProjectBySlug } from "@/queries/project";
import LandingDetailPage from "@/components/landing/landing-detail-page";
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

function normalizeTag(tag: string): string {
  return tag.replace(/\[\[|\]\]/g, "").trim();
}

function isProjectCardTag(tag: string): boolean {
  const lower = normalizeTag(tag).toLowerCase();
  return lower.startsWith("skills/") || lower.startsWith("topic/");
}

function resolveAssetPath(cleanPath: string, markdownFilePath: string): string {
  return resolveArtifactWikiAssetRepoPath(cleanPath, markdownFilePath);
}

async function processMarkdown(content: string, markdownFilePath: string) {
  const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv"];

  // Convert Obsidian-style image/video syntax to markdown or HTML
  const convertedContent = content
    .replace(/!\[\[(.*?)\]\]/g, (match, p1) => {
      const cleanPath = p1.trim();
      const resolvedPath = resolveAssetPath(cleanPath, markdownFilePath);
      const encodedPath = resolvedPath
        .split("/")
        .map((part) => encodeURIComponent(part))
        .join("/");

      const isVideo = videoExtensions.some((ext) =>
        cleanPath.toLowerCase().endsWith(ext)
      );

      if (isVideo) {
        const videoType = cleanPath.toLowerCase().endsWith(".webm")
          ? "video/webm"
          : cleanPath.toLowerCase().endsWith(".mov")
            ? "video/quicktime"
            : "video/mp4";
        const videoSrc = `/db-assets/${encodedPath}`;
        return `\n\n<div style="margin: 1rem 0;">
  <a href="${videoSrc}" target="_blank" rel="noopener noreferrer" style="display: block; text-decoration: none;">
    <video controls style="max-width: 100%; height: auto; display: block;">
      <source src="${videoSrc}" type="${videoType}">
      Your browser does not support the video tag.
    </video>
  </a>
</div>\n\n`;
      }

      return `\n\n![${cleanPath}](/db-assets/${encodedPath})\n\n`;
    })
    .replace(/!\[(.*?)\]\((assets\/media\/.*?)\)/g, (match, alt, src) => {
      return `\n\n![${alt}](/db-assets/media/${src.replace(
        "assets/media/",
        ""
      )})\n\n`;
    });

  const processor = remark().use(remarkGfm);
  const processedContent = await processor.process(convertedContent);
  return processedContent.toString();
}

function extractLinksAndFootnotes(content: string, markdownFilePath: string) {
  const convertedContent = content
    .replace(/!\[\[(.*?)\]\]/g, (match, p1) => {
      const cleanPath = p1.trim();
      const resolvedPath = resolveAssetPath(cleanPath, markdownFilePath);
      const encodedPath = resolvedPath
        .split("/")
        .map((part) => encodeURIComponent(part))
        .join("/");
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

  const processedContent = await processMarkdown(
    project.metadata.contentHtml,
    project.filePath
  );
  const { links, footnotes } = extractLinksAndFootnotes(
    project.metadata.contentHtml,
    project.filePath
  );
  const pageTags = [...(project.categories ?? []), ...(project.tags ?? [])]
    .map(normalizeTag)
    .filter((tag) => tag.length > 0 && !isProjectCardTag(tag))
    .filter((tag, index, all) => all.findIndex((t) => t.toLowerCase() === tag.toLowerCase()) === index);

  return (
    <LandingDetailPage
      kind="project"
      title={project.title}
      publishedAt={project.publishedAt || ""}
      tagList={pageTags}
      externalUrl={project.url || undefined}
    >
      <div className={styles.markdown}>
        <MarkdownContent
          content={processedContent}
          links={links}
          footnotes={footnotes}
          innerPaddingClass="px-6 py-8 sm:px-8"
        />
      </div>
    </LandingDetailPage>
  );
}
