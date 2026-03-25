"use client";

import { BookOpen, Box, ScrollText, type LucideIcon } from "lucide-react";

export type FeedTypeFilterKey = "journals" | "logs" | "projects";

export const FEED_TYPE_DEFAULT_ENABLED: Record<FeedTypeFilterKey, boolean> = {
  journals: true,
  logs: true,
  projects: true,
};

const FILTER_TOGGLES_CONFIG = [
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

export function getVisibleFeedTypeToggles(hasLogs: boolean) {
  return hasLogs
    ? [...FILTER_TOGGLES_CONFIG]
    : FILTER_TOGGLES_CONFIG.filter((t) => t.id !== "logs");
}

/** Full-width row for sidebar: icon + label (no tooltip needed). */
export function FeedTypeFilterRow({
  label,
  dotColor,
  Icon,
  pressed,
  onToggle,
}: {
  label: string;
  dotColor: string;
  Icon: LucideIcon;
  pressed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={`${label}: ${pressed ? "on" : "off"}. Click to toggle.`}
      onClick={onToggle}
      className={`flex w-full items-center gap-3 rounded-sm border px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-gray-500 ${
        pressed
          ? "border-gray-300 bg-gray-100 text-primary-black dark:border-zinc-600 dark:bg-zinc-800 dark:text-textDark"
          : "border-transparent text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-zinc-800/80"
      }`}
    >
      <span
        className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full ${
          pressed
            ? "bg-black/[0.06] dark:bg-white/[0.1]"
            : "bg-black/[0.03] dark:bg-white/[0.05]"
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
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
}
