"use client";

import { useState } from "react";
import { allProjects } from "@/.contentlayer/generated";
import { compareDesc, format, parseISO } from "date-fns";
import Link from "next/link";
import Image from "next/image";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const unpublishedProjects = allProjects.filter(
    (project) => project.published
  );

  let projects = unpublishedProjects.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );

  // Filter projects by search query
  if (searchQuery) {
    projects = projects.filter((project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Filter projects by selected year
  if (selectedYear) {
    projects = projects.filter(
      (project) =>
        format(parseISO(project.publishedAt), "yyyy") === selectedYear
    );
  }

  // const uniqueYears = [
  //   ...new Set(
  //     allProjects.map((project) =>
  //       format(parseISO(project.publishedAt), "yyyy")
  //     )
  //   ),
  // ];

  return (
    <div className="dark:prose-invert">
      <div className="min-w-screen flex ">
        {/* Hero Section */}
        <div className="relative flex-1 h-[200px]  overflow-hidden">
          <Image
            src="https://source.unsplash.com/user/gndclouds"
            alt="Hero Image"
            layout="fill"
            objectFit="cover"
          />

          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="absolute top-0 left-0 p-4">
            <div className="text-white uppercase font-bold">
              <Link href="/" className=""></Link>
              <Link href="/" className="font-bol">
                ← gndclouds
              </Link>
              <span className="px-1">/</span>
              <Link href="/projects" className="">
                projects
              </Link>
            </div>
            <div className="text-white text-largest uppercase"></div>
          </div>
          <div className="absolute bottom-0 p-4 w-full">
            <div className="grid grid-cols-3 text-white uppercase font-bold text-smaller items-center">
              <div className="flex justify-start items-center">
                <time dateTime={projects[0].publishedAt}>
                  v.{format(parseISO(projects[0].publishedAt), "yyyy-MM")}
                </time>
              </div>
              <div className="flex justify-center items-center">
                {allProjects.length} Entries
              </div>
              <div className="flex justify-end items-center">
                <Link href="/projects/rss.xml">RSS </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="p-4">
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="border border-gray-300 shadow-sm rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          />
          {/* <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Filter by year</option>
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select> */}
        </div>
        {projects.map((project) => (
          <article
            key={project._id}
            className="grid grid-cols-1 sm:grid-cols-2 my-20  gap-4 "
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
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              {project.heroImage ? (
                <Image
                  src={project.heroImage}
                  alt=""
                  quality={100}
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div className="bg-[#f9d73b]"></div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
