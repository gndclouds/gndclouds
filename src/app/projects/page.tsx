import type { Metadata } from "next";
import { getAllProjects } from "@/queries/projects";

import ListViewWithSearch from "@/components/list-view-with-search";
import LandingListingShell from "@/components/landing/landing-listing-shell";

type Post = {
  description?: string;
};

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected work, experiments, and ongoing builds.",
  openGraph: {
    title: "Projects",
    description: "Selected work, experiments, and ongoing builds.",
    url: "/projects",
  },
  twitter: {
    title: "Projects",
    description: "Selected work, experiments, and ongoing builds.",
  },
};

export default async function ProjectsPage() {
  const data = await getAllProjects();
  const combinedData = data
    .map((item) => ({
      ...item,
      description:
        "description" in item ? item.description : "No description available",
    }))
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });

  return (
    <LandingListingShell
      kind="projects"
      title="Projects"
      description="Selected work, experiments, and ongoing builds."
      entryCount={combinedData.length}
      rssHref="/api/projects/rss.xml"
    >
      <ListViewWithSearch
        data={combinedData}
        placeholder="Search projects..."
        showProjectImages
        showFilters
      />
    </LandingListingShell>
  );
}
