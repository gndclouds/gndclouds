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
  // Process the markdown content
  const processor = remark().use(remarkGfm);
  const processedContent = await processor.process(content);
  return processedContent.toString();
}

// Extract links and footnotes for MarkdownContent component
function extractLinksAndFootnotes(content: string) {
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

  processor.processSync(content);
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
