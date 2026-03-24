import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Box } from "lucide-react";

const KIND_CONFIG = {
  journal: {
    label: "Journal",
    Icon: BookOpen,
    color: "#fadc4b",
    backHref: "/journals",
    backLabel: "Journals",
  },
  project: {
    label: "Project",
    Icon: Box,
    color: "#0068e2",
    backHref: "/projects",
    backLabel: "Projects",
  },
} as const;

export type LandingDetailKind = keyof typeof KIND_CONFIG;

function formatDetailDate(iso: string): string {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${day}`;
  } catch {
    return "";
  }
}

function dedupeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of tags) {
    const s = t.trim();
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

interface LandingDetailPageProps {
  kind: LandingDetailKind;
  title: string;
  publishedAt: string;
  tagList?: string[];
  externalUrl?: string;
  children: ReactNode;
}

/**
 * Article shell aligned with the home landing: primary-gray page background,
 * card panel, type badge (journal / project), back link to the listing.
 */
export default function LandingDetailPage({
  kind,
  title,
  publishedAt,
  tagList = [],
  externalUrl,
  children,
}: LandingDetailPageProps) {
  const config = KIND_CONFIG[kind];
  const dateStr = formatDetailDate(publishedAt);
  const tags = dedupeTags(tagList);

  return (
    <main className="min-h-screen w-full bg-primary-gray font-inter text-primary-black dark:bg-backgroundDark dark:text-textDark">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 md:py-10 lg:max-w-4xl">
        <div className="flex flex-col overflow-hidden bg-primary-white shadow-sm ring-1 ring-gray-200/90 dark:bg-[#242424] dark:ring-gray-600/50">
          <header className="border-b border-gray-200/90 px-6 py-8 dark:border-gray-600/50 sm:px-8">
            <Link
              href={config.backHref}
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-primary-black dark:text-gray-400 dark:hover:text-textDark"
              data-umami-event={`landing-detail-back-${kind}`}
            >
              <ArrowLeft className="size-4 shrink-0" aria-hidden />
              {config.backLabel}
            </Link>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200/90 bg-primary-gray/80 px-2.5 py-1 text-xs font-medium text-primary-black dark:border-gray-600 dark:bg-zinc-800/80 dark:text-textDark">
                <span
                  className="inline-flex size-6 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${config.color}24` }}
                >
                  <config.Icon
                    size={14}
                    style={{ color: config.color }}
                    aria-hidden
                  />
                </span>
                {config.label}
              </span>
            </div>

            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-gray-900 dark:text-textDark sm:text-3xl">
              {title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
              {dateStr ? (
                <time dateTime={publishedAt} className="tabular-nums">
                  {dateStr}
                </time>
              ) : null}
              {tags.length > 0 ? (
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {tags.map((t) => (
                    <li key={t}>
                      <span className="rounded-full border border-gray-300 bg-transparent px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:border-gray-600 dark:text-gray-300">
                        {t}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {externalUrl ? (
              <p className="mt-6">
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary-black underline underline-offset-2 hover:text-gray-800 dark:text-textDark dark:hover:text-white"
                  data-umami-event="landing-detail-external-url"
                >
                  View live project
                </a>
              </p>
            ) : null}
          </header>

          <div className="font-inter text-gray-800 dark:text-textDark">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
