import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/queries/project";
import PageHero from "@/components/page-hero";
import ReactMarkdown from "react-markdown";
import MarkdownContent from "@/components/MarkdownContent";

interface Params {
  params: {
    slug: string;
  };
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

  const validPublishedAt = isValidDate(project.publishedAt)
    ? project.publishedAt
    : "";

  return (
    <div>
      <PageHero
        data={{
          ...project,
          tags: project.categories?.join(", ") || "",
          publishedAt: validPublishedAt,
        }}
      />
      {project.metadata?.contentHtml ? (
        <MarkdownContent content={project.metadata.contentHtml} />
      ) : (
        <p>No content available</p>
      )}
    </div>
  );
}
