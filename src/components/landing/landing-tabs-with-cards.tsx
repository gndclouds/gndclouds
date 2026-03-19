"use client";

import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { track } from "@/lib/umami";
import { BookOpen, FolderKanban, ScrollText, Search, X, type LucideIcon } from "lucide-react";
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

const FILTER_PILLS = [
  { id: "journals" as const, label: "Journals", dotColor: "#fadc4b", Icon: BookOpen },
  { id: "logs" as const, label: "Logs", dotColor: "#ff6622", Icon: ScrollText },
  { id: "projects" as const, label: "Projects", dotColor: "#0068e2", Icon: FolderKanban },
] as const;

type TabId = "all" | "journals" | "logs" | "projects";

interface CardItem {
  item: JournalWithDescription | LogPost | ProjectPost;
  type: TabItemType;
}

function getItemsForTab(
  tab: TabId,
  journals: JournalWithDescription[],
  projects: ProjectPost[],
  logs: LogPost[]
): CardItem[] {
  if (tab === "all") {
    const journalItems: CardItem[] = journals.map((j) => ({ item: j, type: "journal" }));
    const logItems: CardItem[] = logs.map((l) => ({ item: l, type: "log" }));
    const projectItems: CardItem[] = projects.map((p) => ({ item: p, type: "project" }));
    const combined = [...journalItems, ...logItems, ...projectItems].sort(
      (a, b) =>
        new Date(b.item.publishedAt).getTime() -
        new Date(a.item.publishedAt).getTime()
    );
    return combined;
  }
  if (tab === "journals") {
    return journals.map((j) => ({ item: j, type: "journal" as const }));
  }
  if (tab === "logs") {
    return logs.map((l) => ({ item: l, type: "log" as const }));
  }
  return projects.map((p) => ({ item: p, type: "project" as const }));
}

function getSearchableText(item: TabItem): string {
  const desc = (item.metadata as Record<string, unknown> | undefined)?.description;
  const fromMeta = item.description ?? (typeof desc === "string" ? desc : null);
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

function FilterPill({
  dotColor,
  label,
  isActive,
  onClick,
  Icon,
}: {
  dotColor: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  Icon: LucideIcon;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors duration-200 border-0 shadow-none outline-none focus:ring-0 ${
        !isActive ? "bg-gray-100 text-gray-500 dark:bg-gray-700/60 dark:text-gray-400" : ""
      }`}
      style={isActive ? { backgroundColor: `${dotColor}28`, color: dotColor } : undefined}
      aria-pressed={isActive}
    >
      <Icon size={12} aria-hidden />
      <span className={isActive ? "font-medium" : "font-normal"}>{label}</span>
    </button>
  );
}

function RemovableFilterChip({
  dotColor,
  label,
  onRemove,
  Icon,
}: {
  dotColor: string;
  label: string;
  onRemove: () => void;
  Icon: LucideIcon;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full pl-2 pr-1 py-1 text-xs font-medium border-0"
      style={{ backgroundColor: `${dotColor}28`, color: dotColor }}
    >
      <Icon size={12} aria-hidden />
      <span>{label}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="rounded-full p-0.5 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-0"
        style={{ color: dotColor }}
        aria-label={`Remove ${label} filter`}
      >
        <X size={12} aria-hidden />
      </button>
    </span>
  );
}

/** Pills/chips as non-editable spans for use inside contenteditable (method 2) */
function FilterPillSpan({
  pillId,
  dotColor,
  label,
  Icon,
}: {
  pillId: TabId;
  dotColor: string;
  label: string;
  Icon: LucideIcon;
}) {
  return (
    <span
      contentEditable={false}
      data-pill={pillId}
      role="button"
      tabIndex={-1}
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-normal bg-gray-100 text-gray-500 dark:bg-gray-700/60 dark:text-gray-400 cursor-pointer select-none border-0"
      aria-label={`Filter by ${label}`}
    >
      <Icon size={12} aria-hidden />
      <span>{label}</span>
    </span>
  );
}

function RemovableChipSpan({
  dotColor,
  label,
  Icon,
  onRemove,
}: {
  dotColor: string;
  label: string;
  Icon: LucideIcon;
  onRemove: () => void;
}) {
  return (
    <span
      contentEditable={false}
      data-chip
      className="inline-flex items-center gap-1 rounded-full pl-2 pr-1 py-1 text-xs font-medium border-0 select-none"
      style={{ backgroundColor: `${dotColor}28`, color: dotColor }}
    >
      <Icon size={12} aria-hidden />
      <span>{label}</span>
      <button
        type="button"
        data-remove-chip
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
        className="rounded-full p-0.5 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-0"
        style={{ color: dotColor }}
        aria-label={`Remove ${label} filter`}
      >
        <X size={12} aria-hidden />
      </button>
    </span>
  );
}

function getTextFromContentEditable(editable: HTMLDivElement): string {
  let text = "";
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent ?? "";
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      if (el.getAttribute("contenteditable") === "false" || el.hasAttribute("data-pill") || el.hasAttribute("data-chip")) return;
      for (let i = 0; i < node.childNodes.length; i++) walk(node.childNodes[i]!);
    }
  };
  for (let i = 0; i < editable.childNodes.length; i++) walk(editable.childNodes[i]!);
  return text;
}

export default function LandingTabsWithCards({
  recentJournals = [],
  recentLogs = [],
  recentProjects = [],
}: LandingTabsWithCardsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const editableRef = useRef<HTMLDivElement>(null);
  const textSpanRef = useRef<HTMLSpanElement>(null);
  const isProgrammaticUpdate = useRef(false);

  const itemsByType = useMemo(
    () =>
      getItemsForTab(activeTab, recentJournals, recentProjects, recentLogs),
    [activeTab, recentJournals, recentProjects, recentLogs]
  );

  const items = useMemo(
    () => filterBySearchQuery(itemsByType, searchQuery),
    [itemsByType, searchQuery]
  );

  const handlePillClick = useCallback((pillId: TabId) => {
    const nextTab = activeTab === pillId ? "all" : pillId;
    track("landing-tab", { tab: nextTab });
    isProgrammaticUpdate.current = true;
    setActiveTab(nextTab);
    queueMicrotask(() => {
      const span = textSpanRef.current;
      if (span) span.textContent = searchQuery;
    });
  }, [activeTab, searchQuery]);

  const clearTypeFilter = useCallback(() => {
    track("landing-tab", { tab: "all" });
    isProgrammaticUpdate.current = true;
    setActiveTab("all");
    queueMicrotask(() => {
      const span = textSpanRef.current;
      if (span) span.textContent = searchQuery;
    });
  }, [searchQuery]);

  useEffect(() => {
    if (!isProgrammaticUpdate.current) return;
    isProgrammaticUpdate.current = false;
    const span = textSpanRef.current;
    if (span) span.textContent = searchQuery;
  }, [activeTab, searchQuery]);

  const syncTextFromEditable = useCallback(() => {
    const editable = editableRef.current;
    if (!editable) return "";
    return getTextFromContentEditable(editable);
  }, []);

  const handleEditableInput = useCallback(() => {
    if (isProgrammaticUpdate.current) return;
    const text = syncTextFromEditable();
    setSearchQuery(text);
    const hashtagMatch = text.match(/#(journals|logs|projects)(?:\s|$)/i);
    if (hashtagMatch) {
      const type = hashtagMatch[1].toLowerCase() as "journals" | "logs" | "projects";
      const start = text.indexOf(hashtagMatch[0]);
      const before = text.slice(0, start);
      const after = text.slice(start + hashtagMatch[0].length);
      const remaining = (before + after).trim().replace(/\s+/g, " ");
      isProgrammaticUpdate.current = true;
      setSearchQuery(remaining);
      setActiveTab(type);
      track("landing-tab", { tab: type });
      queueMicrotask(() => {
        const span = textSpanRef.current;
        if (span) span.textContent = remaining;
      });
    }
  }, [syncTextFromEditable]);

  const handleEditableKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Backspace") {
        const text = editableRef.current ? getTextFromContentEditable(editableRef.current) : "";
        if (text === "" && activeTab !== "all") {
          e.preventDefault();
          clearTypeFilter();
        }
      }
    },
    [activeTab, clearTypeFilter]
  );

  const handleEditableClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as Element;
      const removeBtn = target.closest("[data-remove-chip]");
      if (removeBtn) {
        e.preventDefault();
        clearTypeFilter();
        return;
      }
      const pill = target.closest("[data-pill]");
      if (pill) {
        const id = pill.getAttribute("data-pill") as TabId | null;
        if (id && id !== "all") {
          e.preventDefault();
          handlePillClick(id);
        }
      }
    },
    [clearTypeFilter, handlePillClick]
  );

  const activePillConfig =
    activeTab !== "all"
      ? FILTER_PILLS.find((p) => p.id === activeTab)
      : null;

  const emptyMessage =
    itemsByType.length === 0
      ? activeTab === "all"
        ? "No items yet."
        : activeTab === "journals"
          ? "No journals yet."
          : activeTab === "logs"
            ? "No logs yet."
            : "No projects yet."
      : "No results match your search.";

  return (
    <>
      {/* Method 2: contenteditable so the pill is literally inside the same element you type in */}
      <div
        role="search"
        aria-label="Search and filter"
        className="shrink-0 flex items-center gap-2 min-w-0 rounded-2xl border border-gray-200 bg-primary-white dark:bg-backgroundDark dark:border-gray-700 text-sm text-primary-black dark:text-textDark focus-within:ring-1 focus-within:ring-gray-200 dark:focus-within:ring-gray-600 cursor-text px-3 py-2.5"
      >
        <Search className="size-4 text-gray-400 shrink-0 pointer-events-none" aria-hidden />
        <div
          ref={editableRef}
          contentEditable
          suppressContentEditableWarning
          className="flex-1 min-w-[8rem] outline-none py-0.5 inline-flex flex-wrap items-center gap-1 gap-y-1"
          onInput={handleEditableInput}
          onKeyDown={handleEditableKeyDown}
          onClick={handleEditableClick}
          aria-label="Search journals, logs, and projects"
        >
          {activeTab === "all" ? (
            <>
              {FILTER_PILLS.map((pill) => (
                <FilterPillSpan
                  key={pill.id}
                  pillId={pill.id}
                  dotColor={pill.dotColor}
                  label={pill.label}
                  Icon={pill.Icon}
                />
              ))}
            </>
          ) : activePillConfig ? (
            <RemovableChipSpan
              dotColor={activePillConfig.dotColor}
              label={activePillConfig.label}
              Icon={activePillConfig.Icon}
              onRemove={clearTypeFilter}
            />
          ) : null}
          <span
            ref={textSpanRef}
            data-search-text
            data-placeholder="Search..."
            className="empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
          />
        </div>
      </div>

      {/* Column layout: consistent vertical gap between cards, height variety preserved */}
      <div className="flex-1 min-h-0 overflow-y-auto max-lg:overflow-visible max-lg:min-h-0">
        <section
          aria-labelledby={`tab-${activeTab}`}
          id={`tabpanel-${activeTab}`}
          role="tabpanel"
          className="columns-1 sm:columns-2 lg:columns-3 [column-gap:1rem]"
        >
          {items.length === 0 ? (
            <p className="text-gray-500 text-sm py-8 [column-span:all]">
              {emptyMessage}
            </p>
          ) : (
            items.map(({ item, type }) => (
              <div
                key={`${type}-${item.slug}`}
                className="mb-4 break-inside-avoid"
              >
                <LandingItemCard item={item} type={type} />
              </div>
            ))
          )}
        </section>
      </div>
    </>
  );
}
