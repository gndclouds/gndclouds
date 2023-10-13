import { allProjects } from "@/.contentlayer/generated";
import { compareDesc, format, parseISO } from "date-fns";

import Link from "next/link";
import Image from "next/image";

export default function ProjectPage() {
  const unpublishedProjects = allProjects.filter(
    (project) => project.published
  );

  const projects = unpublishedProjects.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );
  return (
    <div className=" dark:prose-invert">
      <div className="p-4 min-w-screen flex ">
        {/* Hero Section */}
        <div className="relative flex-1 h-[200px] rounded-2xl overflow-hidden">
          <Image
            src="https://source.unsplash.com/user/gndclouds"
            alt="Hero Image"
            layout="fill"
            objectFit="cover"
          />

          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="absolute top-0 left-0 p-4">
            <div className="text-white uppercase">
              <Link href="/" className="font-bold">
                gndclouds
              </Link>
            </div>
            <div className="text-white text-largest uppercase">Projects</div>
          </div>
          <div className="absolute bottom-0 p-4 w-full">
            <div className="grid grid-cols-3 text-white uppercase font-bold text-smaller items-center">
              <div className="flex justify-start items-center">
                Updated:{" "}
                <time dateTime={projects[0].publishedAt}>
                  {format(parseISO(projects[0].publishedAt), "yyyy-MM-dd")}
                </time>
              </div>
              <div className="flex justify-center items-center">
                Number of {allProjects.length}
              </div>
              <div className="flex justify-end items-center">rss</div>
            </div>
          </div>
        </div>
      </div>
      {/* Projects Section */}

      <div className="p-4 min-w-screen ">
        {projects.map((project) => (
          <article
            key={project._id}
            className="grid grid-cols-1 sm:grid-cols-2 mx-2 m-20 sm:m-8 gap-4"
          >
            <div>
              <Link href={project.url || project.slug}>
                <div className="text-large flex-wrap font-bold">
                  <div className="inline-block pr-2">{project.title} </div>
                  {project.url && (
                    <div className="inline-block font-mono">↗</div>
                  )}
                </div>
              </Link>
              <div className="">
                <time dateTime={project.publishedAt}>
                  {format(parseISO(project.publishedAt), "yyyy")}
                </time>
              </div>
              <div className="mb-4 sm:mb-0">{project.description}</div>
            </div>
            <div className=" relative bg-[#f9d73b] aspect-square rounded-2xl overflow-hidden">
              <Image
                src="/content/assets/test-hero-asset.jpg"
                alt=""
                quality={100}
                fill
                sizes="100vh"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
