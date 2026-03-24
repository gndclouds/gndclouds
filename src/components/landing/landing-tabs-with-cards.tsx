"use client";

import { useCallback, useMemo, useState } from "react";
import { LayoutGrid, List, Search, X } from "lucide-react";
import type { Journal } from "@/queries/journals";
import type { Post as LogPost } from "@/queries/logs";
import type { Post as ProjectPost } from "@/queries/projects";
import type { TabItemType } from "@/components/landing/hover-preview-card";
import type { TabItem } from "@/components/landing/hover-preview-card";
import LandingItemCard from "@/components/landing/landing-item-card";
import { itemMatchesLibraryFilters } from "@/components/landing/design-skill-filters";
import {
  FEED_TYPE_DEFAULT_ENABLED,
  type FeedTypeFilterKey,
} from "@/components/landing/landing-feed-type-filters";
import IconWordSegmentedToggle from "@/components/landing/icon-word-segmented-toggle";
import {
  formatCardHeading,
  markdownBodyToCardPlainText,
  stripMarkdownMediaEmbeds,
  stripObsidianWikiLinksForPreview,
} from "@/lib/markdown-to-card-plain-text";
import {
  itemHasLibraryTagPath,
  normalizeLibraryTagPath,
} from "@/lib/library-tag-paths";

type FeedViewMode = "grid" | "list";

const VIEW_TOGGLE_OPTIONS = [
  { id: "grid" as const, label: "Grid", Icon: LayoutGrid },
  { id: "list" as const, label: "List", Icon: List },
];

interface JournalWithDescription extends Journal {
  description?: string;
}

interface LandingTabsWithCardsProps {
  recentJournals?: JournalWithDescription[];
  recentLogs?: LogPost[];
  recentProjects?: ProjectPost[];
  /** When non-empty, only posts whose tags match these design/skill groups are shown. */
  designSkillFilterIds?: string[];
  /** Which post types appear in the feed. Defaults to journals, logs, and projects enabled. */
  feedTypesEnabled?: Record<FeedTypeFilterKey, boolean>;
}

interface CardItem {
  item: JournalWithDescription | LogPost | ProjectPost;
  type: TabItemType;
}

function feedItemSortTime(item: TabItem): number {
  const created = (item.metadata as Record<string, unknown> | undefined)?.created;
  if (typeof created === "string" && created.trim()) {
    const t = new Date(created).getTime();
    if (!Number.isNaN(t)) return t;
  }
  const t = new Date(item.publishedAt).getTime();
  return Number.isNaN(t) ? 0 : t;
}

function getItemsForFilters(
  enabled: Record<FeedTypeFilterKey, boolean>,
  journals: JournalWithDescription[],
  logs: LogPost[],
  projects: ProjectPost[]
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
    (a, b) => feedItemSortTime(b.item) - feedItemSortTime(a.item)
  );
}

function getSearchableText(item: TabItem): string {
  const desc = (item.metadata as Record<string, unknown> | undefined)?.description;
  const fromMeta =
    item.description ?? (typeof desc === "string" ? desc : null);
  const raw = item.metadata?.contentHtml;
  const descPlain =
    typeof fromMeta === "string"
      ? stripObsidianWikiLinksForPreview(
          stripMarkdownMediaEmbeds(fromMeta).replace(/\s+/g, " ").trim()
        )
      : "";
  const content =
    typeof raw === "string" ? markdownBodyToCardPlainText(raw) : "";
  return [
    formatCardHeading(item.title),
    descPlain,
    content,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function filterBySearchQuery(items: CardItem[], query: string): CardItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(({ item }) => getSearchableText(item).includes(q));
}

function tagPathToChipLabel(path: string): string {
  const n = normalizeLibraryTagPath(path);
  const i = n.indexOf("/");
  const rest = i >= 0 ? n.slice(i + 1).trim() : n;
  return rest.replace(/-/g, " ");
}

function filterByLibraryTagPath(
  items: CardItem[],
  normalizedPath: string | null
): CardItem[] {
  if (!normalizedPath) return items;
  const needle = normalizeLibraryTagPath(normalizedPath).toLowerCase();
  return items.filter(({ item }) =>
    itemHasLibraryTagPath(
      item.tags,
      "categories" in item ? item.categories : undefined,
      needle
    )
  );
}

function filterByDesignSkillFilters(
  items: CardItem[],
  designSkillFilterIds: string[]
): CardItem[] {
  if (designSkillFilterIds.length === 0) return items;
  return items.filter(({ item }) =>
    itemMatchesLibraryFilters(item, designSkillFilterIds)
  );
}

export default function LandingTabsWithCards({
  recentJournals = [],
  recentLogs = [],
  recentProjects = [],
  designSkillFilterIds = [],
  feedTypesEnabled: enabled = FEED_TYPE_DEFAULT_ENABLED,
}: LandingTabsWithCardsProps) {
  const hasLogs = recentLogs.length > 0;
  const [searchQuery, setSearchQuery] = useState("");
  const [libraryTagPathFilter, setLibraryTagPathFilter] = useState<
    string | null
  >(null);
  const [viewMode, setViewMode] = useState<FeedViewMode>("grid");

  const onLibraryTagPathSelect = useCallback((path: string) => {
    const next = normalizeLibraryTagPath(path);
    const lower = next.toLowerCase();
    setLibraryTagPathFilter((cur) => {
      if (
        cur &&
        normalizeLibraryTagPath(cur).toLowerCase() === lower
      ) {
        return null;
      }
      return next;
    });
  }, []);

  const itemsByType = useMemo(
    () =>
      getItemsForFilters(
        enabled,
        recentJournals,
        recentLogs,
        recentProjects
      ),
    [enabled, recentJournals, recentLogs, recentProjects]
  );

  const itemsAfterSkill = useMemo(
    () => filterByDesignSkillFilters(itemsByType, designSkillFilterIds),
    [itemsByType, designSkillFilterIds]
  );

  const itemsAfterTag = useMemo(
    () => filterByLibraryTagPath(itemsAfterSkill, libraryTagPathFilter),
    [itemsAfterSkill, libraryTagPathFilter]
  );

  const items = useMemo(
    () => filterBySearchQuery(itemsAfterTag, searchQuery),
    [itemsAfterTag, searchQuery]
  );

  /** Split feed into two columns (even / odd index) so each column stacks under the card above — no shared row heights. */
  const gridColumns = useMemo(() => {
    const left: CardItem[] = [];
    const right: CardItem[] = [];
    items.forEach((entry, i) => {
      (i % 2 === 0 ? left : right).push(entry);
    });
    return { left, right };
  }, [items]);

  const noneEnabled = hasLogs
    ? !enabled.journals && !enabled.logs && !enabled.projects
    : !enabled.journals && !enabled.projects;

  const emptyMessage = noneEnabled
    ? "Turn on at least one content type to see posts."
    : itemsByType.length === 0
      ? "No items yet."
      : itemsAfterSkill.length === 0
        ? "No posts match these topic filters."
        : libraryTagPathFilter && itemsAfterTag.length === 0
          ? "No posts match this tag."
          : "No results match your search.";

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      {/* One scroll surface: sticky search row, posts flow below */}
      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain max-md:grow-0 max-md:flex-none max-md:overflow-visible max-md:min-h-0"
      >
        <div
          className="sticky top-0 z-20 border-b-0 pb-4 pt-[max(1rem,env(safe-area-inset-top))]"
        >
          <div className="flex flex-col gap-2 rounded-2xl border-0 bg-primary-white/80 px-2 py-2 text-sm text-primary-black backdrop-blur-md dark:bg-zinc-900/55 sm:flex-row sm:items-center sm:gap-3 sm:px-3">
            <div
              role="search"
              aria-label="Search feed"
              className="min-w-0 flex-1"
            >
              <div className="flex min-w-0 items-center gap-2 rounded-xl bg-gray-100/85 px-3 py-2 dark:bg-zinc-800/80">
                {libraryTagPathFilter ? (
                  <span className="flex min-w-0 shrink items-center gap-1">
                    <span
                      id="feed-library-tag-filter"
                      className="max-w-[min(12rem,40vw)] truncate rounded-md border border-gray-200/20 bg-gray-50/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-gray-700 dark:border-white/[0.03] dark:bg-white/[0.04] dark:text-gray-300"
                      title={tagPathToChipLabel(libraryTagPathFilter)}
                    >
                      {tagPathToChipLabel(libraryTagPathFilter)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setLibraryTagPathFilter(null)}
                      className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-200/80 hover:text-primary-black dark:text-gray-400 dark:hover:bg-white/[0.08] dark:hover:text-textDark"
                      aria-label="Clear tag filter"
                    >
                      <X className="size-3.5" strokeWidth={2} aria-hidden />
                    </button>
                  </span>
                ) : null}
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
                  aria-label={
                    hasLogs
                      ? "Search journals, logs, and projects"
                      : "Search journals and projects"
                  }
                  aria-describedby={
                    libraryTagPathFilter ? "feed-library-tag-filter" : undefined
                  }
                />
              </div>
            </div>
            <IconWordSegmentedToggle
              className="w-full shrink-0 sm:w-auto sm:max-w-none"
              options={VIEW_TOGGLE_OPTIONS}
              value={viewMode}
              onChange={(id) => setViewMode(id as FeedViewMode)}
              ariaLabel="Feed layout"
              showLabels={false}
            />
          </div>
        </div>

        <section
          aria-label="Filtered posts"
          className="relative z-0 min-w-0 px-0"
        >
          {items.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm py-8">
              {emptyMessage}
            </p>
          ) : viewMode === "list" ? (
            <ul className="flex flex-col gap-y-2">
              {items.map(({ item, type }) => (
                <li
                  key={`${type}-${item.slug}`}
                  className="min-h-9 flex min-w-0 items-center"
                >
                  <LandingItemCard
                    item={item}
                    type={type}
                    layout="list"
                    onLibraryTagPathSelect={onLibraryTagPathSelect}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <>
              <div className="flex flex-col gap-5 sm:gap-6 md:hidden">
                {items.map(({ item, type }) => (
                  <div key={`${type}-${item.slug}`} className="min-w-0">
                    <LandingItemCard
                      item={item}
                      type={type}
                      layout="grid"
                      onLibraryTagPathSelect={onLibraryTagPathSelect}
                    />
                  </div>
                ))}
              </div>
              <div className="hidden min-w-0 md:flex md:flex-row md:items-start md:gap-6">
                <div className="flex min-w-0 flex-1 flex-col gap-5 sm:gap-6">
                  {gridColumns.left.map(({ item, type }) => (
                    <div key={`${type}-${item.slug}`} className="min-w-0">
                      <LandingItemCard
                        item={item}
                        type={type}
                        layout="grid"
                        onLibraryTagPathSelect={onLibraryTagPathSelect}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-5 sm:gap-6">
                  {gridColumns.right.map(({ item, type }) => (
                    <div key={`${type}-${item.slug}`} className="min-w-0">
                      <LandingItemCard
                        item={item}
                        type={type}
                        layout="grid"
                        onLibraryTagPathSelect={onLibraryTagPathSelect}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
