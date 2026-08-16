import HomeLanding from "@/components/landing/home-landing";
import { getAllJournals } from "@/queries/journals";
import { getAllProjects } from "@/queries/projects";

export default async function Home() {
  const [journals, projects] = await Promise.all([
    getAllJournals(),
    getAllProjects(),
  ]);

  return <HomeLanding journals={journals} projects={projects} />;
}
