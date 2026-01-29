"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type ThemeMode = "system" | "light" | "dark";

export type ThemeStyle = "minimal" | "glass" | "retro";

const STORAGE_KEY_MODE = "theme";
const STORAGE_KEY_STYLE = "theme-style";

function getSystemDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyMode(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const isDark =
    mode === "dark" || (mode === "system" && getSystemDark());
  if (isDark) document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
}

function applyStyle(style: ThemeStyle) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", style);
}

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  style: ThemeStyle;
  setStyle: (style: ThemeStyle) => void;
  effectiveDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [style, setStyleState] = useState<ThemeStyle>("minimal");
  const [effectiveDark, setEffectiveDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem(STORAGE_KEY_MODE) as ThemeMode | null;
    const storedStyle = localStorage.getItem(STORAGE_KEY_STYLE) as ThemeStyle | null;
    if (storedMode && ["system", "light", "dark"].includes(storedMode)) {
      setModeState(storedMode);
    }
    if (storedStyle && ["minimal", "glass", "retro"].includes(storedStyle)) {
      setStyleState(storedStyle);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyMode(mode);
    applyStyle(style);
    const dark =
      mode === "dark" || (mode === "system" && getSystemDark());
    setEffectiveDark(dark);
    localStorage.setItem(STORAGE_KEY_MODE, mode);
    localStorage.setItem(STORAGE_KEY_STYLE, style);
  }, [mounted, mode, style]);

  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handle = () => {
      applyMode("system");
      setEffectiveDark(getSystemDark());
    };
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
  }, []);

  const setStyle = useCallback((next: ThemeStyle) => {
    setStyleState(next);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, setMode, style, setStyle, effectiveDark }),
    [mode, setMode, style, setStyle, effectiveDark]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
