import { format, parseISO } from "date-fns";
import { allProjects } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";

export const generateStaticParams = async () =>
  allProjects.map((project) => ({ slug: project._raw.flattenedPath }));

export const generateMetadata = ({
  params: { slug, title },
}: {
  params: { slug: string; title: string };
}) => {
  const project = allProjects.find(
    (project) => project._raw.flattenedPath === slug
  );
  const projectTitle = project?.title ?? "Default Title";
  return { title: projectTitle };
};

const ProjectLayout = ({ params }: { params: { slug: string } }) => {
  const project = allProjects.find(
    (project) => project._raw.flattenedPath === params.slug
  ) as (typeof allProjects)[number];

  const Content = getMDXComponent(project.body.code);

  return (
    <article className="py-8 mx-auto max-w-xl">
      <div className="mb-8 text-center">
        <time
          dateTime={project.publishedAt}
          className="mb-1 text-xs text-gray-600"
        >
          {format(parseISO(project.publishedAt), "yyyy-MM-d, ")}
        </time>
        <h1>{project.title}</h1>
      </div>
      <Content />
    </article>
  );
};

export default ProjectLayout;
