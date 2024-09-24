import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/queries/project";
import PageHero from "@/components/page-hero";
import ReactMarkdown from "react-markdown";

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

  console.log("Project data:", project);

  return (
    <div>
      <PageHero
        data={{
          ...project,
          tags: project.tags?.join(", ") || "",
          publishedAt: project.publishedAt || "",
        }}
      />
      {project.contentHtml ? (
        <ReactMarkdown>{project.contentHtml}</ReactMarkdown>
      ) : (
        <p>No content available</p>
      )}
    </div>
  );
}
