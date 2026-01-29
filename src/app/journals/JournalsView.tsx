"use client";

import { useState } from "react";
import CollectionHero from "@/components/collection-hero";
import JournalGallery from "@/components/journal-gallery";
import type { Journal } from "@/queries/journals";

type JournalWithDescription = Journal & { description?: string };

interface JournalsViewProps {
  initialData: JournalWithDescription[];
}

export default function JournalsView({ initialData }: JournalsViewProps) {
  const [selectedPost, setSelectedPost] = useState<JournalWithDescription | null>(
    initialData[0] ?? null
  );
  const topicSummary =
    selectedPost?.description ??
    (typeof selectedPost?.metadata?.description === "string"
      ? selectedPost.metadata.description
      : null);

  return (
    <>
      <CollectionHero
        name="Journals"
        projects={initialData}
        allProjects={initialData}
        topicSummary={topicSummary ?? null}
      />
      <section className="flex flex-col gap-4 p-4">
        <JournalGallery
          data={initialData}
          placeholder="Search journals..."
          onSelectPost={setSelectedPost}
        />
      </section>
    </>
  );
}
