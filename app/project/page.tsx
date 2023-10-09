import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { allProjects, Project } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";
import PageTitle from "../components/PageTitle";

function ProjectCard(project: Project) {
  const Content = getMDXComponent(project.body.code);
  const formattedDate = format(parseISO(project.publishedAt), "yyyy-MM-dd");
  return (
    <div className="grid grid-cols-2 gap-4 border-b-4 p-4 my-16">
      <div className="col-span-1 sm:col-span-1">
        <div className="text-large">{project.title}</div>
        <div className="">desc</div>
        <div className="grid grid-cols-2">
          <div className="col-span-1 sm:col-span-1">Link1</div>
          <div className="col-span-1 sm:col-span-1">Link2</div>
        </div>
      </div>
      <div className="col-span-1 sm:col-span-1">image</div>
      <Link
        href={project.url}
        className="text-blue-700 hover:text-blue-900"
        legacyBehavior
      >
        <div></div>
      </Link>

      <div className="text-sm">{/* <Content /> */}</div>
    </div>
  );
}

export default function Home() {
  const projects = allProjects;
  const sortedProjects = projects.sort((a, b) =>
    compareDesc(parseISO(a.publishedAt), parseISO(b.publishedAt))
  );
  return (
    <div className="mx-auto">
      <PageTitle title="Projects" />
      <div className="">
        I&apos;m working on expanding this section with more of my past work,
        but for now here are some selected projects
      </div>

      {sortedProjects.map((project, idx) => (
        <ProjectCard key={idx} {...project} />
      ))}
    </div>
  );
}
