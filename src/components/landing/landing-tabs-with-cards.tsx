"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { track } from "@/lib/umami";
import { BookOpen, Box, ScrollText, Search, type LucideIcon } from "lucide-react";
import HoverTooltip from "@/components/ui/hover-tooltip";
import type { Journal } from "@/queries/journals";
import type { Post as LogPost } from "@/queries/logs";
import type { Post as ProjectPost } from "@/queries/projects";
import type { TabItemType } from "@/components/landing/hover-preview-card";
import type { TabItem } from "@/components/landing/hover-preview-card";
import LandingItemCard from "@/components/landing/landing-item-card";

interface JournalWithDescription extends Journal {
  description?: string;
}

interface LandingTabsWithCardsProps {
  recentJournals?: JournalWithDescription[];
  recentLogs?: LogPost[];
  recentProjects?: ProjectPost[];
}

type FilterKey = "journals" | "logs" | "projects";

const FILTER_TOGGLES = [
  {
    id: "journals" as const,
    label: "Journals",
    dotColor: "#fadc4b",
    Icon: BookOpen,
  },
  {
    id: "logs" as const,
    label: "Logs",
    dotColor: "#ff6622",
    Icon: ScrollText,
  },
  {
    id: "projects" as const,
    label: "Projects",
    dotColor: "#0068e2",
    Icon: Box,
  },
] as const;

interface CardItem {
  item: JournalWithDescription | LogPost | ProjectPost;
  type: TabItemType;
}

const defaultEnabled: Record<FilterKey, boolean> = {
  journals: true,
  logs: true,
  projects: true,
};

function getItemsForFilters(
  enabled: Record<FilterKey, boolean>,
  journals: JournalWithDescription[],
  projects: ProjectPost[],
  logs: LogPost[]
): CardItem[] {
  const out: CardItem[] = [];
  if (enabled.journals) {
    journals.forEach((j) => out.push({ item: j, type: "journal" }));
  }
  if (enabled.logs) {
    logs.forEach((l) => out.push({ item: l, type: "log" }));
  }
  if (enabled.projects) {
    projects.forEach((p) => out.push({ item: p, type: "project" }));
  }
  return out.sort(
    (a, b) =>
      new Date(b.item.publishedAt).getTime() -
      new Date(a.item.publishedAt).getTime()
  );
}

function getSearchableText(item: TabItem): string {
  const desc = (item.metadata as Record<string, unknown> | undefined)?.description;
  const fromMeta =
    item.description ?? (typeof desc === "string" ? desc : null);
  const raw = item.metadata?.contentHtml;
  const content =
    typeof raw === "string"
      ? raw.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
      : "";
  return [item.title, fromMeta, content].filter(Boolean).join(" ").toLowerCase();
}

function filterBySearchQuery(items: CardItem[], query: string): CardItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(({ item }) => getSearchableText(item).includes(q));
}

/** Split into N columns in round-robin order so row-wise reading matches array order (newest → oldest left-to-right, then next row). */
function splitIntoColumns<T>(items: T[], columnCount: number): T[][] {
  const cols: T[][] = Array.from({ length: columnCount }, () => []);
  items.forEach((item, i) => {
    cols[i % columnCount]!.push(item);
  });
  return cols;
}

/** Matches Tailwind sm/md breakpoints; gated until mount to avoid SSR/client hydration mismatch. */
function useFeedColumnCount(): 1 | 2 | 3 {
  const [count, setCount] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    const mqMd = window.matchMedia("(min-width: 768px)");
    const mqSm = window.matchMedia("(min-width: 640px)");
    const read = (): 1 | 2 | 3 =>
      mqMd.matches ? 3 : mqSm.matches ? 2 : 1;
    setCount(read());
    const onChange = () => setCount(read());
    mqMd.addEventListener("change", onChange);
    mqSm.addEventListener("change", onChange);
    return () => {
      mqMd.removeEventListener("change", onChange);
      mqSm.removeEventListener("change", onChange);
    };
  }, []);

  return count;
}

function FilterToggleButton({
  id,
  label,
  dotColor,
  Icon,
  pressed,
  onToggle,
}: {
  id: FilterKey;
  label: string;
  dotColor: string;
  Icon: LucideIcon;
  pressed: boolean;
  onToggle: () => void;
}) {
  const tipId = `landing-filter-toggle-${id}`;
  return (
    <HoverTooltip label={label} id={tipId}>
      <button
        type="button"
        aria-pressed={pressed}
        aria-label={`${label}: ${pressed ? "on" : "off"}. Click to toggle.`}
        aria-describedby={tipId}
        onClick={onToggle}
        className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full border-0 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-gray-300 dark:focus-visible:ring-gray-600 ${
          pressed
            ? "bg-black/[0.04] dark:bg-white/[0.08]"
            : "bg-transparent hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
        }`}
      >
        <Icon
          size={18}
          aria-hidden
          className={
            pressed
              ? "shrink-0"
              : "shrink-0 text-gray-400 dark:text-gray-500"
          }
          style={pressed ? { color: dotColor } : undefined}
        />
      </button>
    </HoverTooltip>
  );
}

export default function LandingTabsWithCards({
  recentJournals = [],
  recentLogs = [],
  recentProjects = [],
}: LandingTabsWithCardsProps) {
  const [enabled, setEnabled] = useState<Record<FilterKey, boolean>>(defaultEnabled);
  const [searchQuery, setSearchQuery] = useState("");
  const columnCount = useFeedColumnCount();

  const itemsByType = useMemo(
    () =>
      getItemsForFilters(enabled, recentJournals, recentProjects, recentLogs),
    [enabled, recentJournals, recentProjects, recentLogs]
  );

  const items = useMemo(
    () => filterBySearchQuery(itemsByType, searchQuery),
    [itemsByType, searchQuery]
  );

  const itemColumns = useMemo(
    () => splitIntoColumns(items, columnCount),
    [items, columnCount]
  );

  const toggleFilter = useCallback((key: FilterKey) => {
    setEnabled((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      track("landing-filter-toggle", {
        journals: next.journals,
        logs: next.logs,
        projects: next.projects,
      });
      return next;
    });
  }, []);

  const noneEnabled = !enabled.journals && !enabled.logs && !enabled.projects;

  const emptyMessage = noneEnabled
    ? "Turn on at least one type (icons on the right) to see posts."
    : itemsByType.length === 0
      ? "No items yet."
      : "No results match your search.";

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      {/* One scroll surface: sticky search row, posts flow below */}
      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain max-md:grow-0 max-md:flex-none max-md:overflow-visible max-md:min-h-0"
      >
        <div
          className="sticky top-0 z-20 -mx-4 box-content border-b-0 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:-mx-6 sm:px-6"
        >
          <div
            role="search"
            aria-label="Search and filter feed"
            className="flex min-w-0 items-stretch gap-2 rounded-2xl border-0 bg-primary-white/80 px-2 py-2 text-sm text-primary-black backdrop-blur-md dark:bg-zinc-900/55 sm:gap-3 sm:px-3"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-gray-100/85 px-3 py-2 dark:bg-zinc-800/80">
              <Search
                className="size-4 shrink-0 text-gray-400 dark:text-white/40"
                aria-hidden
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search…"
                className="min-w-0 flex-1 border-0 bg-transparent text-sm text-primary-black placeholder:text-gray-400 outline-none ring-0 dark:text-textDark dark:placeholder:text-gray-500"
                aria-label="Search journals, logs, and projects"
              />
            </div>

            <div
              className="flex shrink-0 items-center gap-0.5 border-l border-gray-200/70 pl-2 dark:border-gray-600/60 sm:gap-1 sm:pl-3"
              role="group"
              aria-label="Show or hide content types"
            >
              {FILTER_TOGGLES.map((t) => (
                <FilterToggleButton
                  key={t.id}
                  id={t.id}
                  label={t.label}
                  dotColor={t.dotColor}
                  Icon={t.Icon}
                  pressed={enabled[t.id]}
                  onToggle={() => toggleFilter(t.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <section
          aria-label="Filtered posts"
          className="relative z-0 min-w-0"
        >
          {items.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm py-8">
              {emptyMessage}
            </p>
          ) : (
            <div className="flex flex-row items-start gap-4">
              {itemColumns.map((col, colIndex) => (
                <div
                  key={colIndex}
                  className="flex min-w-0 flex-1 flex-col gap-4"
                >
                  {col.map(({ item, type }) => (
                    <div key={`${type}-${item.slug}`}>
                      <LandingItemCard item={item} type={type} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
