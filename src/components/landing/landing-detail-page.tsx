"use client";

import type { ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import LibraryTagsGrouped from "@/components/landing/library-tags-grouped";

const KIND_CONFIG = {
  journal: {
    backHref: "/journals",
    pathLabel: "/journals",
  },
  project: {
    backHref: "/projects",
    pathLabel: "/projects",
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

interface LandingDetailPageProps {
  kind: LandingDetailKind;
  title: string;
  publishedAt: string;
  tagList?: string[];
  children: ReactNode;
}

/**
 * Article shell aligned with the home landing: primary-gray page background,
 * full-width card panel, fixed header with section path, title + date, tags.
 */
export default function LandingDetailPage({
  kind,
  title,
  publishedAt,
  tagList = [],
  children,
}: LandingDetailPageProps) {
  const config = KIND_CONFIG[kind];
  const dateStr = formatDetailDate(publishedAt);
  const headerRef = useRef<HTMLElement>(null);
  const [spacerHeight, setSpacerHeight] = useState(0);

  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const measure = () => setSpacerHeight(el.offsetHeight);

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [title, tagList.length, dateStr]);

  return (
    <main className="min-h-screen w-full bg-primary-gray font-inter text-primary-black dark:bg-backgroundDark dark:text-textDark">
      <div className="w-full px-4 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-6 md:pb-10">
        <div className="flex flex-col overflow-hidden rounded-2xl bg-primary-white shadow-sm ring-1 ring-gray-200/90 dark:bg-[#242424] dark:ring-gray-600/50">
          <header
            ref={headerRef}
            className="fixed left-4 right-4 top-4 z-30 rounded-t-2xl border-b border-gray-200/80 bg-primary-white/95 px-4 py-3 backdrop-blur-md dark:border-gray-600/40 dark:bg-[#242424]/95 sm:left-6 sm:right-6 sm:px-6 sm:py-3.5"
            role="banner"
          >
            <div className="mb-2 flex flex-wrap items-baseline gap-x-1.5">
              <Link
                href="/"
                className="text-xs font-medium text-gray-500 transition-colors hover:text-primary-black dark:text-gray-400 dark:hover:text-textDark"
                data-umami-event="landing-detail-site-name"
              >
                gndclouds
              </Link>
              <Link
                href={config.backHref}
                className="text-xs font-medium text-gray-500 transition-colors hover:text-primary-black dark:text-gray-400 dark:hover:text-textDark"
                data-umami-event={`landing-detail-path-${kind}`}
              >
                {config.pathLabel}
              </Link>
            </div>

            <div className="flex flex-row items-start justify-between gap-3 sm:gap-4">
              <h1 className="min-w-0 flex-1 pr-2 text-xl font-semibold leading-snug tracking-tight text-gray-900 dark:text-textDark sm:text-2xl">
                {title}
              </h1>
              {dateStr ? (
                <time
                  dateTime={publishedAt}
                  className="shrink-0 pt-0.5 tabular-nums text-xs text-gray-500 dark:text-gray-400"
                >
                  {dateStr}
                </time>
              ) : null}
            </div>

            <LibraryTagsGrouped tags={tagList} />
          </header>

          <div
            className="shrink-0"
            style={{ height: spacerHeight }}
            aria-hidden
          />

          <div className="font-inter text-gray-800 dark:text-textDark">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
