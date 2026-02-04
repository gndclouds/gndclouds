"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ThemeMode, ThemeStyle } from "./ThemeContext";
import { useTheme } from "./ThemeContext";

const STYLE_LABELS: Record<ThemeStyle, string> = {
  minimal: "minimal",
  glass: "glass",
  retro: "retro",
};

/** Dot color per theme – minimal (neutral), glass (cool), retro (warm) */
const THEME_DOT_COLOR: Record<ThemeStyle, string> = {
  minimal: "#6b7280",
  glass: "#94a3b8",
  retro: "#e07a5f",
};

export default function ThemeChooser() {
  const { mode, setMode, style, setStyle, effectiveDark } = useTheme();
  const [open, setOpen] = useState(false);
  const effectiveLabel = effectiveDark ? "dark" : "light";
  const [menuPosition, setMenuPosition] = useState<{ bottom: number; right: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        bottom: window.innerHeight - rect.top + 8,
        right: window.innerWidth - rect.right,
      });
    } else {
      setMenuPosition(null);
    }
  }, [open]);

  const menuContent =
    open && typeof document !== "undefined" && menuPosition ? (
      <>
        <div
          className="fixed inset-0 z-[100]"
          aria-hidden
          onClick={() => setOpen(false)}
        />
        <div
          role="menu"
          className="fixed z-[110] min-w-[140px] rounded-lg border-2 border-backgroundDark dark:border-backgroundLight bg-primary-white dark:bg-backgroundDark py-2 shadow-lg"
          style={{
            bottom: menuPosition.bottom,
            right: menuPosition.right,
          }}
        >
            {/* Mode: auto / light / dark */}
            <div className="px-3 pb-1.5">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                Mode
              </p>
              <div className="flex flex-col gap-0.5">
                {(["system", "light", "dark"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMode(m);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded transition-colors flex items-center gap-2 ${
                      mode === m
                        ? "bg-primary-gray dark:bg-gray-700 text-primary-black dark:text-primary-white"
                        : "text-primary-black dark:text-primary-white hover:bg-primary-gray/50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0 opacity-60"
                      style={{ backgroundColor: THEME_DOT_COLOR[style] }}
                      aria-hidden
                    />
                    {m === "system" ? "auto" : m}
                  </button>
                ))}
              </div>
            </div>
            {/* Theme: minimal / glass / retro */}
            <div className="px-3 pt-1.5 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                Theme
              </p>
              <div className="flex flex-col gap-0.5">
                {(["minimal", "glass", "retro"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setStyle(s);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm rounded transition-colors flex items-center gap-2 ${
                      style === s
                        ? "bg-primary-gray dark:bg-gray-700 text-primary-black dark:text-primary-white"
                        : "text-primary-black dark:text-primary-white hover:bg-primary-gray/50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: THEME_DOT_COLOR[s] }}
                      aria-hidden
                    />
                    {STYLE_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
      </>
    ) : null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-primary-white dark:bg-backgroundDark text-sm text-primary-black dark:text-primary-white transition-opacity hover:opacity-90"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Theme options"
      >
        <span className="text-primary-black dark:text-primary-white opacity-70" aria-hidden>
          ▾
        </span>
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: THEME_DOT_COLOR[style] }}
          aria-hidden
        />
        <span>{effectiveLabel}</span>
      </button>
      {menuContent &&
        createPortal(menuContent, document.body)}
    </div>
  );
}
