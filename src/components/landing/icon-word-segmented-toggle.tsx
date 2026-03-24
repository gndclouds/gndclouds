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
      className={`group relative min-h-[2.25rem] w-full origin-center rounded-xl bg-gray-100/85 p-1 [-webkit-tap-highlight-color:transparent] dark:bg-zinc-800/80 ${
        showLabels ? "min-w-[10rem] sm:min-w-[11.5rem]" : "min-w-0"
      } transform-gpu shadow-[inset_0_1px_0_rgb(255_255_255/0.45),inset_0_-1px_0_rgb(0_0_0/0.05)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.55),inset_0_-1px_0_rgb(0_0_0/0.06),0_6px_16px_-8px_rgb(0_0_0/0.12)] hover:[transform:perspective(520px)_rotateX(2.5deg)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06),inset_0_-1px_0_rgb(0_0_0/0.35)] dark:hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.08),inset_0_-1px_0_rgb(0_0_0/0.4),0_8px_22px_-10px_rgb(0_0_0/0.45)] has-[button:active]:shadow-[inset_0_3px_6px_rgb(0_0_0/0.1),inset_0_1px_0_rgb(255_255_255/0.3)] has-[button:active]:[transform:perspective(520px)_rotateX(0.5deg)_scale(0.985)] has-[button:active]:duration-150 motion-reduce:transform-none motion-reduce:transition-colors motion-reduce:hover:transform-none motion-reduce:hover:shadow-none motion-reduce:has-[button:active]:transform-none motion-reduce:has-[button:active]:shadow-none ${className}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      <div
        className="pointer-events-none absolute top-1 bottom-1 rounded-lg bg-primary-white shadow-[0_1px_2px_rgb(0_0_0/0.06),0_2px_6px_rgb(0_0_0/0.04)] ring-1 ring-black/[0.06] transition-[left,width,transform,box-shadow] duration-300 ease-[cubic-bezier(0.25,0.9,0.32,1.02)] group-hover:-translate-y-px group-hover:shadow-[0_2px_4px_rgb(0_0_0/0.07),0_4px_12px_rgb(0_0_0/0.06)] group-has-[button:active]:translate-y-px group-has-[button:active]:shadow-[0_1px_1px_rgb(0_0_0/0.05),inset_0_1px_2px_rgb(0_0_0/0.06)] dark:bg-zinc-700 dark:ring-white/[0.08] dark:group-hover:shadow-[0_2px_6px_rgb(0_0_0/0.35),0_6px_14px_rgb(0_0_0/0.25)] motion-reduce:transition-[left,width] motion-reduce:duration-200 motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:shadow-sm motion-reduce:group-has-[button:active]:translate-y-0 motion-reduce:group-has-[button:active]:shadow-sm"
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
              className={`flex min-w-0 origin-center items-center justify-center rounded-lg text-xs font-medium [-webkit-tap-highlight-color:transparent] transition-[transform,color,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 active:scale-[0.86] active:translate-y-[3px] active:duration-75 active:ease-[cubic-bezier(0.33,0,0.67,1)] hover:scale-[1.03] hover:-translate-y-px motion-reduce:transform-none motion-reduce:transition-colors motion-reduce:active:transform-none dark:focus-visible:ring-gray-500 ${
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
