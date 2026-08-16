import Link from "next/link";
import ProjectCardMedia from "@/components/project-card-media";
import {
  formatCardHeading,
  stripMarkdownMediaEmbeds,
  stripObsidianWikiLinksForPreview,
} from "@/lib/markdown-to-card-plain-text";
import { getJournalCardMediaUrls } from "@/lib/project-card-images";
import type { Journal } from "@/queries/journals";

interface JournalWithDescription extends Journal {
  description?: string;
}

interface JournalCardProps {
  journal: JournalWithDescription;
}

export default function JournalCard({ journal }: JournalCardProps) {
  const rawDescription =
    journal.description ??
    (typeof journal.metadata?.description === "string"
      ? journal.metadata.description
      : "No description available");
  const description = stripObsidianWikiLinksForPreview(
    stripMarkdownMediaEmbeds(rawDescription).replace(/\s+/g, " ").trim()
  );

  const { displayUrl, hoverGifUrl } = getJournalCardMediaUrls(journal.metadata);

  const imgTone = "dark:brightness-[0.88] dark:contrast-[1.05]";

  return (
    <Link
      href={`/journal/${journal.slug}`}
      className="group block overflow-hidden rounded-sm bg-primary-white"
    >
      <div className="relative w-full overflow-hidden rounded-sm bg-primary-gray dark:bg-zinc-800">
        {displayUrl ? (
          <ProjectCardMedia
            displaySrc={displayUrl}
            hoverGifSrc={hoverGifUrl}
            alt=""
            sizes="(max-width: 768px) 100vw, 33vw"
            imgClassName={imgTone}
            naturalAspect
          />
        ) : (
          <div
            className="min-h-32 w-full bg-gray-200 dark:bg-zinc-800"
            aria-hidden
          />
        )}
      </div>
      <div className="rounded-b-sm bg-primary-white px-0 py-4 text-left sm:py-5 dark:bg-zinc-900">
        <h3 className="font-normal text-primary-black dark:text-textDark text-sm line-clamp-1">
          {formatCardHeading(journal.title)}
        </h3>
        <p className="text-primary-gray dark:text-gray-400 text-sm font-normal mt-1.5 line-clamp-3">
          {description}
        </p>
      </div>
    </Link>
  );
}
