import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Building2,
  Hash,
  Sparkles,
  Tag,
} from "lucide-react";
import { normalizeLibraryTagPath } from "@/lib/library-tag-paths";

export { normalizeLibraryTagPath } from "@/lib/library-tag-paths";

function dedupeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of tags) {
    const s = t.trim();
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

function normalizeTagGroup(prefix: string): string {
  const p = prefix.trim().toLowerCase();
  if (p === "skills") return "skill";
  if (p === "topics") return "topic";
  if (p === "orgs") return "org";
  return p;
}

const TAG_GROUP_ICONS: Record<string, LucideIcon> = {
  topic: Hash,
  skill: Sparkles,
  portfolio: Briefcase,
  org: Building2,
};

const TAG_GROUP_ORDER = ["portfolio", "topic", "skill", "org"] as const;

function iconForTagGroup(group: string): LucideIcon {
  return TAG_GROUP_ICONS[group] ?? Tag;
}

/** Split `prefix/suffix`; suffix is what we show (uppercase). */
function parseTagForDisplay(tag: string): {
  group: string;
  displaySuffix: string;
} {
  const t = normalizeLibraryTagPath(tag);
  const i = t.indexOf("/");
  if (i <= 0) {
    return { group: "_plain", displaySuffix: t };
  }
  const prefix = t.slice(0, i).trim();
  const rest = t.slice(i + 1).trim();
  if (!rest) return { group: "_plain", displaySuffix: t };
  return {
    group: normalizeTagGroup(prefix),
    displaySuffix: rest,
  };
}

function compareTagGroups(a: string, b: string): number {
  const ai = TAG_GROUP_ORDER.indexOf(a as (typeof TAG_GROUP_ORDER)[number]);
  const bi = TAG_GROUP_ORDER.indexOf(b as (typeof TAG_GROUP_ORDER)[number]);
  const aKnown = ai >= 0;
  const bKnown = bi >= 0;
  if (aKnown && bKnown) return ai - bi;
  if (aKnown) return -1;
  if (bKnown) return 1;
  return a.localeCompare(b);
}

const TAG_PILL_CLASS =
  "inline-block rounded-md border border-gray-200/20 bg-gray-50/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-gray-700 dark:border-white/[0.03] dark:bg-white/[0.04] dark:text-gray-300";

export interface LibraryTagsGroupedProps {
  tags: string[];
  /** Outer row (detail header vs feed cards). */
  className?: string;
  /** When set, tag pills are buttons and call this with the normalized full path (e.g. `topics/foo`). */
  onTagPathSelect?: (normalizedFullPath: string) => void;
}

/**
 * Grouped library tags with icon per namespace — shared by article header and feed cards.
 */
type TagPillEntry = { displaySuffix: string; fullPath: string };

export default function LibraryTagsGrouped({
  tags,
  className = "mt-3 flex flex-wrap items-start gap-x-4 gap-y-2 text-gray-600 dark:text-gray-400",
  onTagPathSelect,
}: LibraryTagsGroupedProps) {
  const list = dedupeTags(tags);
  if (list.length === 0) return null;

  const tagsByGroup = new Map<string, TagPillEntry[]>();
  for (const t of list) {
    const fullPath = normalizeLibraryTagPath(t);
    const { group, displaySuffix } = parseTagForDisplay(t);
    const g = tagsByGroup.get(group);
    const entry: TagPillEntry = { displaySuffix, fullPath };
    if (g) {
      if (!g.some((e) => e.displaySuffix === displaySuffix)) g.push(entry);
    } else {
      tagsByGroup.set(group, [entry]);
    }
  }
  const sortedGroups = [...tagsByGroup.keys()].sort(compareTagGroups);

  return (
    <div className={`relative isolate ${className}`.trim()}>
      {sortedGroups.map((group) => {
        const entries = tagsByGroup.get(group);
        if (!entries?.length) return null;
        const Icon = iconForTagGroup(group);
        return (
          <div
            key={group}
            className="flex min-w-0 max-w-full items-center gap-2"
          >
            <span
              className="inline-flex shrink-0 text-gray-500 dark:text-gray-500"
              aria-hidden
            >
              <Icon className="size-3 stroke-[1.5]" />
            </span>
            <ul className="m-0 flex list-none flex-wrap gap-x-1.5 gap-y-1.5 p-0">
              {entries.map(({ displaySuffix, fullPath }) => {
                const label = displaySuffix.replace(/-/g, " ");
                const pillKey = `${group}-${displaySuffix}`;
                return (
                  <li key={pillKey}>
                    {onTagPathSelect ? (
                      <button
                        type="button"
                        className={`${TAG_PILL_CLASS} cursor-pointer transition hover:bg-gray-200/90 dark:hover:bg-white/[0.08]`}
                        aria-label={`Filter feed by tag ${label}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onTagPathSelect(fullPath);
                        }}
                      >
                        {label}
                      </button>
                    ) : (
                      <span className={TAG_PILL_CLASS}>{label}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
