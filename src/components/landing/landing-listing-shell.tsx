"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Box } from "lucide-react";

const KIND_CONFIG = {
  projects: {
    badge: "Project",
    Icon: Box,
    color: "#0068e2",
  },
  journals: {
    badge: "Journal",
    Icon: BookOpen,
    color: "#fadc4b",
  },
} as const;

export type LandingListingKind = keyof typeof KIND_CONFIG;

const SECTION_NAV = [
  { label: "Journals", href: "/journals", umami: "listing-nav-journals" },
  { label: "Projects", href: "/projects", umami: "listing-nav-projects" },
  { label: "Logs", href: "/logs", umami: "listing-nav-logs" },
] as const;

interface LandingListingShellProps {
  kind: LandingListingKind;
  title: string;
  description: string;
  entryCount: number;
  children: ReactNode;
  /** e.g. /api/projects/rss.xml */
  rssHref?: string;
  /** Renders below the Journals / Projects / Logs nav in the left column. */
  sidebarBelowNav?: ReactNode;
}

/**
 * Listing layout aligned with HomeLanding (split columns, gray chrome) and
 * LandingDetailPage (card panel, type badge, typography).
 */
export default function LandingListingShell({
  kind,
  title,
  description,
  entryCount,
  children,
  rssHref,
  sidebarBelowNav,
}: LandingListingShellProps) {
  const config = KIND_CONFIG[kind];

  return (
    <main className="h-screen w-full flex flex-col bg-primary-gray font-inter text-primary-black overflow-x-hidden overflow-hidden max-md:overflow-y-auto max-md:min-h-screen dark:bg-backgroundDark dark:text-textDark">
      <div className="flex flex-1 flex-col md:flex-row min-h-0 w-full max-md:flex-none">
        {/* Left: intro — matches HomeLanding */}
        <div className="flex w-full max-w-full shrink-0 flex-col bg-primary-gray px-4 py-4 sm:p-6 md:w-1/3 md:min-h-0 md:min-w-0 md:px-4 md:py-4 md:pt-4 md:pb-4 md:pl-2 md:pr-2 dark:bg-backgroundDark">
          <div className="flex min-h-0 flex-col overflow-y-auto bg-primary-white px-6 py-6 text-gray-800 shadow-sm ring-1 ring-gray-200/90 dark:bg-[#242424] dark:text-textDark dark:ring-gray-600/50">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-primary-black dark:text-gray-400 dark:hover:text-textDark"
              data-umami-event={`listing-back-home-${kind}`}
            >
              <ArrowLeft className="size-4 shrink-0" aria-hidden />
              Home
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
                {config.badge}
              </span>
            </div>

            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-gray-900 dark:text-textDark sm:text-3xl">
              {title}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-lg">
              {description}
            </p>

            <p className="mt-6 text-sm tabular-nums text-gray-500 dark:text-gray-500">
              {entryCount} {entryCount === 1 ? "entry" : "entries"}
            </p>

            {rssHref ? (
              <p className="mt-4">
                <a
                  href={rssHref}
                  className="text-sm font-medium text-primary-black underline underline-offset-2 hover:text-gray-800 dark:text-textDark dark:hover:text-white"
                  data-umami-event="listing-rss"
                >
                  RSS feed
                </a>
              </p>
            ) : null}

            <nav
              aria-label="Main sections"
              className="mt-8 border-t border-gray-200/90 pt-8 dark:border-gray-600/50"
            >
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {SECTION_NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-base font-medium text-gray-800 transition-colors hover:text-primary-black dark:text-textDark dark:hover:text-white sm:text-lg"
                      data-umami-event={item.umami}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {sidebarBelowNav}
          </div>
        </div>

        {/* Right: list — matches HomeLanding right column */}
        <div className="flex w-full max-w-full min-h-0 flex-1 flex-col px-4 pb-4 pt-4 sm:px-6 md:w-2/3 md:min-h-0 md:px-6 md:py-4 md:pb-4 md:pl-4 md:pr-4">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-primary-white shadow-sm ring-1 ring-gray-200/90 dark:bg-[#242424] dark:ring-gray-600/50">
            <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
