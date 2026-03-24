"use client";

import type { LucideIcon } from "lucide-react";

export interface IconWordTabOption {
  id: string;
  label: string;
  Icon: LucideIcon;
}

interface IconWordSegmentedToggleProps {
  options: IconWordTabOption[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
  /** Accessible name for the tab list */
  ariaLabel?: string;
  /** When false, labels are visually hidden but kept for screen readers. */
  showLabels?: boolean;
}

/**
 * Segmented control with icon + optional label per option and a sliding pill that
 * matches the home feed search field (rounded-xl inside rounded-2xl toolbar).
 */
export default function IconWordSegmentedToggle({
  options,
  value,
  onChange,
  className = "",
  ariaLabel = "View options",
  showLabels = true,
}: IconWordSegmentedToggleProps) {
  const n = options.length;
  const idx = Math.max(0, options.findIndex((o) => o.id === value));

  if (n === 0) return null;

  return (
    <div
      className={`relative min-h-[2.25rem] w-full rounded-xl bg-gray-100/85 p-1 dark:bg-zinc-800/80 ${
        showLabels ? "min-w-[10rem] sm:min-w-[11.5rem]" : "min-w-0"
      } ${className}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      <div
        className="pointer-events-none absolute top-1 bottom-1 rounded-lg bg-primary-white shadow-sm ring-1 ring-black/[0.06] transition-[left,width] duration-200 ease-out dark:bg-zinc-700 dark:ring-white/[0.08]"
        style={{
          width: `calc((100% - 0.5rem) / ${n})`,
          left: `calc(0.25rem + (100% - 0.5rem) * ${idx} / ${n})`,
        }}
        aria-hidden
      />
      <div
        className="relative z-10 grid w-full"
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
      >
        {options.map((opt) => {
          const selected = opt.id === value;
          return (
            <button
              key={opt.id}
              type="button"
              role="tab"
              aria-selected={selected}
              title={showLabels ? undefined : opt.label}
              onClick={() => onChange(opt.id)}
              className={`flex min-w-0 items-center justify-center rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-gray-500 ${
                showLabels
                  ? "gap-1.5 px-1.5 py-1.5 sm:px-2 sm:text-sm"
                  : "px-2 py-1.5"
              } ${
                selected
                  ? "text-primary-black dark:text-textDark"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <opt.Icon className="size-3.5 shrink-0 sm:size-4" aria-hidden />
              {showLabels ? (
                <span className="truncate">{opt.label}</span>
              ) : (
                <span className="sr-only">{opt.label}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
