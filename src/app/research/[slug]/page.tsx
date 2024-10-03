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

interface ProjectMetadata {
  contentHtml: string;
  links?: string[];
  footnotes?: Record<string, any>;
}

interface Project {
  // ... other properties ...
  metadata: ProjectMetadata;
  publishedAt?: string; // Add this line to define the publishedAt property
  title: string; // Ensure title is defined in the Project interface
  categories?: string[]; // Add this line to define the categories property
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = params;
  const project: Project | null = await getProjectBySlug(slug);
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

  return (
    <div>
      <PageHero
        data={{
          ...project,
          title: project.title, // Add title to the data object
          tags: project.categories?.join(", ") || "",
          publishedAt: validPublishedAt,
        }}
      />
      {project.metadata?.contentHtml ? (
        <MarkdownContent
          content={project.metadata.contentHtml}
          links={project.metadata?.links ?? []} // Use optional chaining and nullish coalescing
          footnotes={project.metadata?.footnotes ?? {}} // Use optional chaining and nullish coalescing
        />
      ) : (
        <p>No content available</p>
      )}
    </div>
  );
}
