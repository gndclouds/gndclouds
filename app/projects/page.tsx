import { allProjects } from "@/.contentlayer/generated";
import { compareDesc, format, parseISO } from "date-fns";

import Link from "next/link";

export default function ProjectPage() {
  const projects = allProjects.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );
  return (
    <div className=" dark:prose-invert">
      <div className="p-4 min-w-screen flex bg-gray-100">
        {/* Hero Section */}
        <div className="relative flex-1 h-[200px] rounded-2xl overflow-hidden">
          {/* <Image
            src="/path-to-your-image.jpg"
            alt="Hero Image"
            layout="fill"
            objectFit="cover"
          /> */}
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="absolute top-0 left-0 p-4">
            <div className="text-white text-largest uppercase">Project</div>
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
          <article key={project._id}>
            <Link href={project.slug}>
              <h2>{project.title}</h2>
            </Link>
            {/* {project.description && <p>{project.description}</p>} */}
          </article>
        ))}
      </div>
    </div>
  );
}
