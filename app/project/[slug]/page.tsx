import { format, parseISO } from "date-fns";
import { allProjects } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";

export const generateStaticParams = async () =>
  allProjects.map((project) => ({ slug: project._raw.flattenedPath }));

export const generateMetadata = ({ params }) => {
  const project = allProjects.find(
    (project) => project._raw.flattenedPath === params.slug
  );
  return { title: project.title };
};

const ProjectLayout = ({ params }: { params: { slug: string } }) => {
  const project = allProjects.find(
    (project) => project._raw.flattenedPath === params.slug
  );

  const Content = getMDXComponent(project.body.code);

  return (
    <article className="py-8 mx-auto max-w-xl">
      <div className="mb-8 text-center">
        <time dateTime={project.date} className="mb-1 text-xs text-gray-600">
          {format(parseISO(project.date), "LLLL d, yyyy")}
        </time>
        <h1>{project.title}</h1>
      </div>
      <Content />
    </article>
  );
};

export default ProjectLayout;
