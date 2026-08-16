import type { Metadata } from "next";
import { getAllLogs } from "@/queries/logs";
import CollectionHero from "@/components/collection-hero";
import LogsLayout from "./LogsLayout";

export const metadata: Metadata = {
  title: "Logs",
  description: "Short updates, experiments, and the day-to-day stream.",
  openGraph: {
    title: "Logs",
    description: "Short updates, experiments, and the day-to-day stream.",
    url: "/logs",
  },
  twitter: {
    title: "Logs",
    description: "Short updates, experiments, and the day-to-day stream.",
  },
};

export default async function LogsPage() {
  const data = await getAllLogs();
  const combinedData = data
    .map((item) => ({
      ...item,
      description: item.metadata.description || "No description available",
    }))
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });

  return (
    <main>
      <CollectionHero
        name="Logs"
        projects={combinedData}
        allProjects={combinedData}
      />
      <section className="flex flex-col gap-4 p-4">
        <LogsLayout logs={combinedData} />
      </section>
    </main>
  );
}
