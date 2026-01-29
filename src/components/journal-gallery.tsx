"use client";

import React, { useState, useMemo } from "react";
import MarkdownContent from "@/components/MarkdownContent";
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,300px)_1fr] gap-6 min-h-0">
      {/* Left: list styled like reference – section headers + items with → */}
      <aside className="flex flex-col min-h-0 border-r-0 lg:border-r border-backgroundDark dark:border-backgroundLight pr-0 lg:pr-6 overflow-y-auto">
        <div className="list-none">
          {byYear.map(([year, items]) => (
            <section key={year} className="py-0">
              <div className="border-b border-backgroundDark dark:border-backgroundLight py-2">
                <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {year}
                </span>
              </div>
              {items.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className={`w-full text-left flex items-center justify-between gap-2 py-2.5 border-b border-backgroundDark dark:border-backgroundLight hover:bg-gray-50 dark:hover:bg-gray-900/40 ${
                    selectedSlug === item.slug
                      ? "bg-gray-100 dark:bg-gray-800/60"
                      : ""
                  }`}
                >
                  <span className="flex-1 min-w-0 truncate text-gray-900 dark:text-gray-100">
                    {item.title}
                  </span>
                  <span className="flex-shrink-0 text-gray-900 dark:text-gray-100" aria-hidden>
                    →
                  </span>
                </button>
              ))}
            </section>
          ))}
        </div>
      </aside>

      {/* Right: selected post */}
      <article className="min-h-0 flex flex-col overflow-hidden">
        {selected ? (
          <>
            <header className="flex-shrink-0 pb-4 border-b border-backgroundDark dark:border-backgroundLight">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
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
                      className="px-1.5 py-0.5 border border-backgroundDark dark:border-backgroundLight"
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
                  links={(selected.metadata as Record<string, unknown>).links ?? []}
                  footnotes={
                    (selected.metadata as Record<string, unknown>).footnotes ?? {}
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
    </div>
  );
}
