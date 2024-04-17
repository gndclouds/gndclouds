import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";

import { Metadata } from "next";
import { Mdx } from "@/app/components/mdx-components";

interface ProjectProps {
  params: {
    slug: string[];
  };
}

async function getProjectFromParams(params: ProjectProps["params"]) {
  const slug = params?.slug?.join("/");
  const project = allProjects.find((project) => project.slugAsParams === slug);

  if (!project) {
    null;
  }

  return project;
}

export async function generateMetadata({
  params,
}: ProjectProps): Promise<Metadata> {
  const project = await getProjectFromParams(params);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
  };
}

export async function generateStaticParams(): Promise<
  ProjectProps["params"][]
> {
  return allProjects.map((project) => ({
    slug: project.slugAsParams.split("/"),
  }));
}

export default async function ProjectPage({ params }: ProjectProps) {
  const project = await getProjectFromParams(params);

  if (!project) {
    notFound();
  }

  return (
    <article className="mx-4 sm:mx-6 py-6 prose dark:prose-invert">
      <h1 className="mb-2">{project.title}</h1>
      {/* {project.description && (
        <p className="text-xl mt-0 text-slate-700 dark:text-slate-200">
          {project.description}
        </p>
      )} */}
      <hr className="my-4" />
      <Mdx code={project.body.code} />
    </article>
  );
}
