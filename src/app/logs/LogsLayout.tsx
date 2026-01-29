"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import MarkdownContent from "@/components/MarkdownContent";
import type { LogItem } from "./types";

const ITEMS_PER_BATCH = 8;
const SCROLL_LOAD_THRESHOLD_PX = 180;

const formatDate = (value?: string | Date) => {
  if (!value) return "Unknown Date";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown Date";
  return date.toLocaleDateString(undefined, { timeZone: "UTC" });
};

export default function LogsLayout({ logs }: { logs: LogItem[] }) {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingScrollSlug, setPendingScrollSlug] = useState<string | null>(
    null
  );
  const listRef = useRef<HTMLDivElement>(null);

  const normalizeLabel = (label: string) =>
    label.replace(/\[\[|\]\]/g, "").trim().toLowerCase();
  const cleanLabel = (label: string) => label.replace(/\[\[|\]\]/g, "").trim();

  const toArray = useCallback((value?: string | string[]) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [value];
  }, []);

  const getProjects = useCallback(
    (log: LogItem) => {
      return [
        ...toArray(log.project),
        ...toArray(log.projects),
        ...toArray(log.metadata?.project),
        ...toArray(log.metadata?.projects),
      ];
    },
    [toArray]
  );

  const tagOptions = useMemo(() => {
    const tagMap = new Map<string, string>();
    logs.forEach((log) => {
      const tags = [...(log.tags || []), ...(log.categories || [])];
      tags.forEach((tag) => {
        if (!tag || typeof tag !== "string") return;
        const normalized = normalizeLabel(tag);
        if (!normalized) return;
        if (!tagMap.has(normalized)) {
          tagMap.set(normalized, tag.replace(/\[\[|\]\]/g, "").trim());
        }
      });
    });

    return Array.from(tagMap.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [logs]);

  const projectOptions = useMemo(() => {
    const projectMap = new Map<string, string>();
    logs.forEach((log) => {
      const projects = getProjects(log);
      projects.forEach((project) => {
        if (!project || typeof project !== "string") return;
        const normalized = normalizeLabel(project);
        if (!normalized) return;
        if (!projectMap.has(normalized)) {
          projectMap.set(normalized, project.replace(/\[\[|\]\]/g, "").trim());
        }
      });
    });

    return Array.from(projectMap.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [logs, getProjects]);

  const filteredLogs = useMemo(() => {
    if (selectedTags.length === 0 && selectedProjects.length === 0) {
      if (!searchQuery.trim()) return logs;
    }
    return logs.filter((log) => {
      const logTags = [...(log.tags || []), ...(log.categories || [])]
        .filter((tag) => typeof tag === "string")
        .map((tag) => normalizeLabel(tag as string));
      const logProjects = getProjects(log)
        .filter((project) => typeof project === "string")
        .map((project) => normalizeLabel(project as string));
      const displayProjects = getProjects(log)
        .filter((project) => typeof project === "string")
        .map((project) => cleanLabel(project as string))
        .filter(Boolean);

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => logTags.includes(tag));
      const matchesProjects =
        selectedProjects.length === 0 ||
        selectedProjects.some((project) => logProjects.includes(project));

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        [log.title, ...logTags, ...displayProjects]
          .filter((value) => typeof value === "string")
          .some((value) => value.toLowerCase().includes(query));

      return matchesTags && matchesProjects && matchesSearch;
    });
  }, [logs, selectedTags, selectedProjects, searchQuery, getProjects]);

  const currentItems = useMemo(
    () => filteredLogs.slice(0, visibleCount),
    [filteredLogs, visibleCount]
  );

  useEffect(() => {
    setVisibleCount(ITEMS_PER_BATCH);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedTags, selectedProjects, searchQuery]);

  useEffect(() => {
    if (!pendingScrollSlug) return;
    const container = listRef.current;
    const target = container?.querySelector(
      `[data-log-slug="${pendingScrollSlug}"]`
    ) as HTMLElement | null;
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setPendingScrollSlug(null);
  }, [pendingScrollSlug, visibleCount]);

  useEffect(() => {
    const handleScroll = () => {
      if (visibleCount >= filteredLogs.length) return;
      const remaining =
        document.documentElement.scrollHeight -
        window.scrollY -
        window.innerHeight;
      if (remaining < SCROLL_LOAD_THRESHOLD_PX) {
        setVisibleCount((prev) =>
          Math.min(prev + ITEMS_PER_BATCH, filteredLogs.length)
        );
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [filteredLogs.length, visibleCount]);

  const handleSelectLog = (slug: string, index: number) => {
    if (index + 1 > visibleCount) {
      setVisibleCount(index + 1);
    }
    setPendingScrollSlug(slug);
  };

  return (
    <div className="space-y-6">
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Search logs, tags, descriptions"
        className="w-full border-2 border-backgroundDark dark:border-backgroundLight bg-transparent px-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_minmax(0,1fr)] md:gap-10">
        <aside className="md:sticky md:top-6 md:self-start">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-3">
                Filters
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs uppercase tracking-wide text-gray-500">
                      Tags
                    </h4>
                    {selectedTags.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedTags([])}
                        className="text-[11px] underline underline-offset-4 text-gray-500"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tagOptions.map((tag) => {
                      const isSelected = selectedTags.includes(tag.value);
                      return (
                        <button
                          key={tag.value}
                          type="button"
                          aria-pressed={isSelected}
                          className={`px-2 py-1 text-xs border-2 border-backgroundDark dark:border-backgroundLight ${
                            isSelected
                              ? "bg-black text-white dark:bg-white dark:text-black"
                              : "text-gray-700 dark:text-gray-200"
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedTags((prev) =>
                                prev.filter((value) => value !== tag.value)
                              );
                            } else {
                              setSelectedTags((prev) => [...prev, tag.value]);
                            }
                          }}
                        >
                          {tag.label}
                        </button>
                      );
                    })}
                    {tagOptions.length === 0 && (
                      <div className="text-xs text-gray-500">
                        No tags available.
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs uppercase tracking-wide text-gray-500">
                      Projects
                    </h4>
                    {selectedProjects.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedProjects([])}
                        className="text-[11px] underline underline-offset-4 text-gray-500"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {projectOptions.map((project) => {
                      const isSelected = selectedProjects.includes(
                        project.value
                      );
                      return (
                        <button
                          key={project.value}
                          type="button"
                          aria-pressed={isSelected}
                          className={`px-2 py-1 text-xs border-2 border-backgroundDark dark:border-backgroundLight ${
                            isSelected
                              ? "bg-black text-white dark:bg-white dark:text-black"
                              : "text-gray-700 dark:text-gray-200"
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedProjects((prev) =>
                                prev.filter((value) => value !== project.value)
                              );
                            } else {
                              setSelectedProjects((prev) => [
                                ...prev,
                                project.value,
                              ]);
                            }
                          }}
                        >
                          {project.label}
                        </button>
                      );
                    })}
                    {projectOptions.length === 0 && (
                      <div className="text-xs text-gray-500">
                        No projects available.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </aside>

        <div
          className="min-h-[40vh]"
          ref={listRef}
        >
          {currentItems.length === 0 ? (
            <div className="border-2 border-backgroundDark dark:border-backgroundLight p-6 text-sm text-gray-500">
              No logs match the selected filters.
            </div>
          ) : (
            <div className="space-y-10">
              {currentItems.map((log) => {
                const displayProjects = getProjects(log)
                  .filter((project) => typeof project === "string")
                  .map((project) => cleanLabel(project as string))
                  .filter(Boolean);
                return (
                  <article
                    key={log.slug}
                    data-log-slug={log.slug}
                    className="border-2 border-backgroundDark dark:border-backgroundLight"
                  >
                    <div className="border-b border-backgroundDark dark:border-backgroundLight p-4 flex flex-col gap-2">
                      <div className="flex items-baseline justify-between gap-4">
                        <h2 className="text-xl font-semibold">
                          <Link href={`/log/${log.slug}`}>{log.title}</Link>
                        </h2>
                        <span className="text-xs text-gray-500">
                          {formatDate(log.publishedAt)}
                        </span>
                      </div>
                      {displayProjects.length > 0 && (
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span className="uppercase tracking-wide text-[10px]">
                            Projects
                          </span>
                          {displayProjects.map((project) => (
                            <span
                              key={`${log.slug}-project-${project}`}
                              className="border border-backgroundDark/30 dark:border-backgroundLight/30 px-2 py-1"
                            >
                              {project}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {log.metadata?.contentHtml ? (
                      <div className="p-2">
                        <MarkdownContent
                          content={log.metadata.contentHtml}
                          links={(log.metadata as any).links ?? []}
                          footnotes={(log.metadata as any).footnotes ?? {}}
                          showReferences={false}
                          filePath={(log.metadata as any).filePath}
                        />
                      </div>
                    ) : (
                      <div className="p-4 text-sm text-gray-500">
                        No content available.
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
