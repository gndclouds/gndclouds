import HomeLanding from "@/components/landing/home-landing";
import { getAllJournals } from "@/queries/journals";
import { getAllLogs } from "@/queries/logs";
import { getAllProjects } from "@/queries/projects";

export default async function Home() {
  const [journals, logs, projects] = await Promise.all([
    getAllJournals(),
    getAllLogs(),
    getAllProjects(),
  ]);

  return (
    <HomeLanding journals={journals} logs={logs} projects={projects} />
  );
}
