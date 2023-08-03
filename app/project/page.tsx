import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { allProjects, Project } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";

function ProjectCard(project: Project) {
  const Content = getMDXComponent(project.body.code);

  return (
    <div className="mb-8">
      <h2 className="text-xl">
        <Link
          href={project.url}
          className="text-blue-700 hover:text-blue-900"
          legacyBehavior
        >
          {project.title}
        </Link>
      </h2>
      <time
        dateTime={project.publishedAt}
        className="block mb-2  text-gray-600"
      >
        {format(parseISO(project.publishedAt), "yyyy-MM-d, ")}
      </time>
      <div className="">
        {" "}
        <Content />{" "}
      </div>
    </div>
  );
}

export default function Home() {
  const projects = allProjects.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );

  return (
    <div className="max-w-xl py-8 mx-auto">
      <h1 className="">Projects</h1>

      {projects.map((project, idx) => (
        <ProjectCard key={idx} {...project} />
      ))}
    </div>
  );
}
