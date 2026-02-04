import ColourPaletteLanding from "@/components/landing/colour-palette-landing";
import { getAllJournals } from "@/queries/journals";
import { getAllLogs } from "@/queries/logs";
import { getAllProjects } from "@/queries/projects";

const RECENT_JOURNALS_COUNT = 6;
const RECENT_PROJECTS_COUNT = 6;
const RECENT_LOGS_COUNT = 6;

export default async function Home() {
  const [journals, logs, projects] = await Promise.all([
    getAllJournals(),
    getAllLogs(),
    getAllProjects(),
  ]);
  const recentJournals = journals.slice(0, RECENT_JOURNALS_COUNT);
  const recentLogs = logs.slice(0, RECENT_LOGS_COUNT);
  const recentProjects = projects.slice(0, RECENT_PROJECTS_COUNT);

  return (
    <ColourPaletteLanding
      recentJournals={recentJournals}
      recentLogs={recentLogs}
      recentProjects={recentProjects}
    />
  );
}
