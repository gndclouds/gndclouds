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
  console.log("Project data:", project);
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
          publishedAt: validPublishedAt, // Use the validated date
        }}
      />
      {project.metadata?.contentHtml ? (
        <div className="flex px-4 py-12">
          <div className="max-w-3xl">
            <ReactMarkdown>{project.metadata.contentHtml}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <p>No content available</p>
      )}
    </div>
  );
}
