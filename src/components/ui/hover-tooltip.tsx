"use client";

import type { ReactNode } from "react";

/** Lightweight hover/focus tooltip; wraps trigger as `inline-flex` for positioning. */
export default function HoverTooltip({
  label,
  children,
  id,
}: {
  label: string;
  children: ReactNode;
  /** Stable id for aria-describedby on the trigger. */
  id: string;
}) {
  return (
    <span className="relative inline-flex group/tooltip align-middle">
      {children}
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none absolute left-1/2 bottom-[calc(100%+4px)] z-50 -translate-x-1/2 w-max rounded bg-neutral-900 px-1.5 py-0.5 text-center text-[10px] font-medium leading-none tracking-tight text-white shadow-sm opacity-0 transition-opacity duration-150 group-hover/tooltip:opacity-100 group-focus-visible/tooltip:opacity-100 dark:bg-zinc-100 dark:text-neutral-900"
      >
        {label}
      </span>
    </span>
  );
}
