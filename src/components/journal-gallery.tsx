"use client";

import React, { useState, useMemo } from "react";
import MarkdownContent from "@/components/MarkdownContent";
import LandingListingShell from "@/components/landing/landing-listing-shell";
import type { Journal } from "@/queries/journals";

interface JournalWithDescription extends Journal {
  description?: string;
}

interface JournalGalleryProps {
  data: JournalWithDescription[];
  placeholder?: string;
  /** Called when the user selects a post (e.g. to update hero image). */
  onSelectPost?: (post: JournalWithDescription) => void;
}

function formatDateDisplay(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown Date";
  return date.toLocaleDateString(undefined, { timeZone: "UTC" });
}

function displayTags(item: JournalWithDescription): string[] {
  return [...(item.tags || []), ...(item.categories || [])]
    .filter((t): t is string => typeof t === "string")
    .map((t) => t.replace(/\[\[|\]\]/g, "").trim())
    .filter(Boolean);
}

function getYear(item: JournalWithDescription): string {
  const d = new Date(item.publishedAt);
  return Number.isNaN(d.getTime()) ? "" : String(d.getFullYear());
}

export default function JournalGallery({
  data,
  onSelectPost,
}: JournalGalleryProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    data[0]?.slug ?? null
  );
  const selected = data.find((item) => item.slug === selectedSlug) ?? data[0];

  const handleSelect = (item: JournalWithDescription) => {
    setSelectedSlug(item.slug);
    onSelectPost?.(item);
  };

  const byYear = useMemo(() => {
    const map = new Map<string, JournalWithDescription[]>();
    data.forEach((item) => {
      const y = getYear(item) || "Other";
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(item);
    });
    return Array.from(map.entries()).sort((a, b) => {
      const na = Number(a[0]);
      const nb = Number(b[0]);
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return nb - na;
      if (a[0] === "Other") return 1;
      if (b[0] === "Other") return -1;
      return b[0].localeCompare(a[0]);
    });
  }, [data]);

  const list = (
    <aside
      aria-label="Journal entries by year"
      className="mt-6 flex min-h-0 flex-col border-t border-gray-200/90 pt-6 dark:border-gray-600/50"
    >
      <div className="list-none">
        {byYear.map(([year, items]) => (
          <section key={year} className="py-0">
            <div className="border-b border-gray-200/90 py-2 dark:border-gray-600/50">
              <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {year}
              </span>
            </div>
            {items.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => handleSelect(item)}
                className={`flex w-full items-center justify-between gap-2 border-b border-gray-200/90 py-2.5 text-left hover:bg-gray-50 dark:border-gray-600/50 dark:hover:bg-gray-900/40 ${
                  selectedSlug === item.slug
                    ? "bg-gray-100 dark:bg-gray-800/60"
                    : ""
                }`}
              >
                <span className="min-w-0 flex-1 truncate text-gray-900 dark:text-gray-100">
                  {item.title}
                </span>
                <span className="shrink-0 text-gray-900 dark:text-gray-100" aria-hidden>
                  →
                </span>
              </button>
            ))}
          </section>
        ))}
      </div>
    </aside>
  );

  return (
    <LandingListingShell
      kind="journals"
      title="Journals"
      description="Daily reflections, field notes, and personal writing."
      entryCount={data.length}
      sidebarBelowNav={list}
    >
      <article className="flex min-h-0 flex-col overflow-hidden">
        {selected ? (
          <>
            <header className="shrink-0 border-b border-gray-200/90 pb-4 dark:border-gray-600/50">
              <h2 className="text-xl font-semibold leading-tight tracking-tight text-gray-900 dark:text-textDark sm:text-2xl">
                {selected.title}
              </h2>
              <time
                className="text-sm text-gray-500 dark:text-gray-400 mt-1 block"
                dateTime={selected.publishedAt}
              >
                {formatDateDisplay(selected.publishedAt)}
              </time>
              {displayTags(selected).length > 0 && (
                <span className="flex flex-wrap gap-1.5 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {displayTags(selected).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-gray-300 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:border-gray-600 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              )}
            </header>
            <div className="flex-1 overflow-y-auto pt-4 min-h-0">
              {selected.metadata?.contentHtml ? (
                <MarkdownContent
                  content={selected.metadata.contentHtml}
                  links={
                    (Array.isArray((selected.metadata as Record<string, unknown>).links)
                      ? (selected.metadata as Record<string, unknown>).links
                      : []) as string[]
                  }
                  footnotes={
                    ((selected.metadata as Record<string, unknown>).footnotes as
                      | { [key: string]: string }
                      | undefined) ?? {}
                  }
                />
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No content available.
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 py-8">
            Select a post from the list.
          </p>
        )}
      </article>
    </LandingListingShell>
  );
}
