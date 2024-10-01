import { getAllProjects } from "@/queries/projects";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";

const generateRSS = (projects: any[]) => {
  const items = projects
    .map(
      (project) => `
    <item>
      <title>${project.title}</title>
      <link>${
        project.url || `https://gndclouds.earth/projects/${project.slug}`
      }</link>
      <description>${project.description || ""}</description>
      <pubDate>${format(
        new Date(project.publishedAt),
        "EEE, dd MMM yyyy HH:mm:ss O"
      )}</pubDate>
      <guid>${
        project.url || `https://gndclouds.earth/projects/${project.slug}`
      }</guid>
    </item>
  `
    )
    .join("");

  return `
    <rss version="2.0">
      <channel>
        <title>Projects RSS Feed</title>
        <link>https://gndclouds.earth/projects</link>
        <description>Latest projects from our site</description>
        <language>en-us</language>
        ${items}
      </channel>
    </rss>
  `;
};

export async function GET(req: NextRequest) {
  const projects = await getAllProjects();
  const rss = generateRSS(projects);

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
