"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/umami";
import {
  BookOpen,
  ChevronRight,
  FolderKanban,
  LayoutGrid,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import type { Journal } from "@/queries/journals";
import type { Post as LogPost } from "@/queries/logs";
import type { Post as ProjectPost } from "@/queries/projects";
import type {
  TabItem,
  TabItemType,
} from "@/components/landing/hover-preview-card";
import {
  MorphingTitle,
  getTypewriterDuration,
} from "@/components/landing/morphing-title";

interface JournalWithDescription extends Journal {
  description?: string;
}

interface LandingTabsProps {
  recentJournals?: JournalWithDescription[];
  recentLogs?: LogPost[];
  recentProjects?: ProjectPost[];
  onHoverItem?: (item: TabItem, type: TabItemType) => void;
  onHoverEnd?: () => void;
}

const TABS = [
  {
    id: "all" as const,
    label: "All",
    href: "/feed",
    dotColor: "#94a3b8",
    Icon: LayoutGrid,
  },
  {
    id: "journals" as const,
    label: "Journals",
    href: "/journals",
    dotColor: "#fadc4b",
    Icon: BookOpen,
  },
  {
    id: "projects" as const,
    label: "Projects",
    href: "/projects",
    dotColor: "#0068e2",
    Icon: FolderKanban,
  },
  {
    id: "logs" as const,
    label: "Logs",
    href: "/logs",
    dotColor: "#ff6622",
    Icon: ScrollText,
  },
] as const;

const TYPE_PILL: Record<TabItemType, { Icon: LucideIcon; color: string }> = {
  journal: { Icon: BookOpen, color: "#fadc4b" },
  project: { Icon: FolderKanban, color: "#0068e2" },
  log: { Icon: ScrollText, color: "#ff6622" },
};

const TYPE_LABEL: Record<TabItemType, string> = {
  journal: "JOURNAL",
  project: "PROJECT",
  log: "LOG",
};

function TypePill({ type }: { type: TabItemType }) {
  const { Icon } = TYPE_PILL[type];
  return (
    <span
      className="hidden sm:inline-flex items-center gap-1 shrink-0 rounded-full bg-gray-200 px-2 py-0.5 text-gray-600"
      aria-hidden
    >
      <Icon size={12} className="shrink-0" />
      <span className="text-[10px] font-medium tracking-wide">
        {TYPE_LABEL[type]}
      </span>
    </span>
  );
}

function TabButton({
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
      className="group inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg w-fit text-left transition-colors duration-200 hover:bg-gray-100 hover:ring-1 hover:ring-gray-200"
      style={{ minHeight: "2rem", ["--tab-dot" as string]: dotColor }}
      aria-selected={isActive}
      role="tab"
    >
      <Icon
        className={`shrink-0 transition-colors duration-200 ${!isActive ? "text-gray-400 group-hover:[color:var(--tab-dot)]" : ""}`}
        size={20}
        style={isActive ? { color: dotColor } : undefined}
        aria-hidden
      />
      <span
        className={`text-lg font-normal transition-colors ${
          isActive
            ? "text-primary-black"
            : "text-gray-500 hover:text-primary-black"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function formatSlotDate(publishedAt: string): string {
  const d = new Date(publishedAt);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

const tabItemLinkClass =
  "group flex w-full items-center justify-between gap-2 rounded-lg px-3 py-1.5 min-h-9 text-primary-black transition-[background-color,opacity] hover:bg-gray-100";

function TabItemLink({
  href,
  children,
  isEmpty,
  pill,
  date,
}: {
  href: string;
  children: React.ReactNode;
  isEmpty?: boolean;
  pill?: React.ReactNode;
  date?: string;
}) {
  if (isEmpty) {
    return (
      <span className="min-w-0 truncate text-gray-400 flex items-center gap-2">
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={tabItemLinkClass}>
      <span className="flex items-center min-w-0">
        <span className="min-w-0 truncate">{children}</span>
      </span>
      <span className="flex shrink-0 items-center gap-2 text-right">
        {pill}
        {date ? (
          <time
            dateTime={date}
            className="text-sm text-gray-500 tabular-nums leading-6"
          >
            {formatSlotDate(date)}
          </time>
        ) : null}
        <ChevronRight
          className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden
        />
      </span>
    </Link>
  );
}

type TabId = "all" | "journals" | "projects" | "logs";

interface SlotItem {
  title: string;
  href: string;
  item: TabItem;
  type: TabItemType;
}

function getSlotsForTab(
  tab: TabId,
  journals: JournalWithDescription[],
  projects: ProjectPost[],
  logs: LogPost[],
): SlotItem[] {
  if (tab === "all") {
    const journalSlots: SlotItem[] = journals.slice(0, 6).map((j) => ({
      title: j.title,
      href: `/journal/${j.slug}`,
      item: j,
      type: "journal",
    }));
    const projectSlots: SlotItem[] = projects.slice(0, 6).map((p) => ({
      title: p.title,
      href: `/project/${p.slug}`,
      item: p,
      type: "project",
    }));
    const logSlots: SlotItem[] = logs.slice(0, 6).map((l) => ({
      title: l.title,
      href: `/log/${l.slug}`,
      item: l,
      type: "log",
    }));
    const combined = [...journalSlots, ...projectSlots, ...logSlots].sort(
      (a, b) =>
        new Date(b.item.publishedAt).getTime() -
        new Date(a.item.publishedAt).getTime(),
    );
    return combined;
  }
  if (tab === "journals") {
    return journals
      .slice(0, 6)
      .map((j) => ({
        title: j.title,
        href: `/journal/${j.slug}`,
        item: j,
        type: "journal",
      }));
  }
  if (tab === "projects") {
    return projects
      .slice(0, 6)
      .map((p) => ({
        title: p.title,
        href: `/project/${p.slug}`,
        item: p,
        type: "project",
      }));
  }
  return logs
    .slice(0, 6)
    .map((l) => ({
      title: l.title,
      href: `/log/${l.slug}`,
      item: l,
      type: "log",
    }));
}

const SLOT_COUNT = 12;

export default function LandingTabs({
  recentJournals = [],
  recentLogs = [],
  recentProjects = [],
  onHoverItem,
  onHoverEnd,
}: LandingTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [previousTitles, setPreviousTitles] = useState<string[]>(() =>
    Array(SLOT_COUNT).fill(""),
  );
  const [isMorphing, setIsMorphing] = useState(false);

  const currentSlots = getSlotsForTab(
    activeTab,
    recentJournals,
    recentProjects,
    recentLogs,
  );

  const handleTabClick = (newTab: TabId) => {
    if (newTab === activeTab) return;
    track("landing-tab", { tab: newTab });
    const prevSlots = getSlotsForTab(
      activeTab,
      recentJournals,
      recentProjects,
      recentLogs,
    );
    const titles = prevSlots.map((s) => s.title);
    setPreviousTitles(
      [...titles, ...Array(SLOT_COUNT).fill("")].slice(0, SLOT_COUNT),
    );
    setActiveTab(newTab);
    setIsMorphing(true);
  };

  useEffect(() => {
    if (!isMorphing) return;
    const maxDuration = Math.max(
      ...Array.from({ length: SLOT_COUNT }, (_, i) =>
        getTypewriterDuration(
          previousTitles[i]?.length ?? 0,
          currentSlots[i]?.title.length ?? 0,
        ),
      ),
      800,
    );
    const t = setTimeout(() => setIsMorphing(false), maxDuration + 120);
    return () => clearTimeout(t);
  }, [isMorphing, previousTitles, currentSlots]);

  const emptyMessage =
    activeTab === "all"
      ? "No items yet."
      : activeTab === "journals"
        ? "No journals yet."
        : activeTab === "projects"
          ? "No projects yet."
          : "No logs yet.";

  const activeDotColor =
    TABS.find((t) => t.id === activeTab)?.dotColor ?? "#eeeeee";

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div
        className="flex flex-wrap items-center gap-1 border-b pb-3 mb-4 shrink-0"
        style={{ borderBottomColor: activeDotColor }}
        role="tablist"
        aria-label="Journals and logs"
      >
        {TABS.filter((tab) => tab.id !== "projects").map((tab) => (
          <TabButton
            key={tab.id}
            dotColor={tab.dotColor}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => handleTabClick(tab.id)}
            Icon={tab.Icon}
          />
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto max-lg:overflow-visible max-lg:min-h-0">
        <section
          aria-labelledby={`tab-${activeTab}`}
          id={`tabpanel-${activeTab}`}
          role="tabpanel"
          style={{
            ["--typewriter-cursor-color" as string]: TABS.find(
              (t) => t.id === activeTab,
            )?.dotColor,
          }}
        >
          {currentSlots.length === 0 ? (
            <p className="text-gray-500 text-sm">{emptyMessage}</p>
          ) : (
            <ul className="flex flex-col gap-y-2">
              {Array.from({ length: SLOT_COUNT }, (_, i) => {
                const slot = currentSlots[i];
                const prevTitle = previousTitles[i] ?? "";
                const nextTitle = slot?.title ?? "";
                const isEmpty = !slot;
                return (
                  <li
                    key={slot ? `${slot.type}-${slot.item.slug}` : `slot-${i}`}
                    className="min-h-9 flex items-center"
                    onMouseEnter={
                      slot
                        ? () => onHoverItem?.(slot.item, slot.type)
                        : undefined
                    }
                    onMouseLeave={slot ? onHoverEnd : undefined}
                  >
                    <TabItemLink
                      href={slot?.href ?? "#"}
                      isEmpty={isEmpty}
                      pill={
                        activeTab === "all" && slot ? (
                          <TypePill type={slot.type} />
                        ) : undefined
                      }
                      date={slot?.item.publishedAt}
                    >
                      <MorphingTitle
                        prevText={prevTitle}
                        nextText={nextTitle}
                        isMorphing={isMorphing}
                      />
                    </TabItemLink>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
