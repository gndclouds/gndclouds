"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import type { Journal } from "@/queries/journals";
import type { Post as LogPost } from "@/queries/logs";
import type { Post as ProjectPost } from "@/queries/projects";
import LandingTabs from "@/components/landing/landing-tabs";
import HoverPreviewCard, {
  type TabItem,
  type TabItemType,
} from "@/components/landing/hover-preview-card";
import Bio1997 from "@/components/landing/bio1997";
import Bio2014 from "@/components/landing/bio2014";
import Bio2016 from "@/components/landing/bio2016";
import Bio2017 from "@/components/landing/bio2017";
import Bio2019 from "@/components/landing/bio2019";
import Bio2020 from "@/components/landing/bio2020";
import Bio2021 from "@/components/landing/bio2021";
import Bio2022 from "@/components/landing/bio2022";
import Bio2023 from "@/components/landing/bio2023";
import Bio2024 from "@/components/landing/bio2024";
import Bio2025 from "@/components/landing/bio2025";
import Bio2026 from "@/components/landing/bio2026";
import { ThemeChooser } from "@/components/theme";

/** Set to true to show the theme (mode + style) chooser in the footer */
const SHOW_THEME_CHOOSER = false;

interface JournalWithDescription extends Journal {
  description?: string;
}

interface ColourPaletteLandingProps {
  recentJournals?: JournalWithDescription[];
  recentLogs?: LogPost[];
  recentProjects?: ProjectPost[];
}

const palette = {
  primary: [
    { name: "primary-black", hex: "#000000ff" },
    { name: "primary-gray", hex: "#eeeeeeff" },
    { name: "primary-white", hex: "#ffffffff" },
  ],
  secondary: [
    { name: "secondary-yellow", hex: "#fadc4bff" },
    { name: "secondary-orange", hex: "#ff6622ff" },
    { name: "secondary-blue", hex: "#0068e2ff" },
    { name: "secondary-green", hex: "#04b53bff" },
  ],
  tertiary: [
    { name: "tertiary-pink", hex: "#fa91b7ff" },
    { name: "tertiary-lavender", hex: "#d4b8ffff" },
    { name: "tertiary-bronze", hex: "#b45e06ff" },
  ],
};

function ColorSwatch({ hex }: { hex: string }) {
  const bgHex = hex.slice(0, 7);
  const border =
    bgHex.toLowerCase() === "#ffffff" ? "border border-primary-gray" : "";
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`h-14 w-14 sm:h-16 sm:w-16 rounded-full shrink-0 ${border}`}
        style={{ backgroundColor: bgHex }}
      />
      <span className="text-primary-black font-mono text-xs sm:text-sm">
        {hex}
      </span>
    </div>
  );
}

const BIO_YEARS = [
  1997, 2014, 2016, 2017, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
] as const;

const BIO_COMPONENTS: Record<(typeof BIO_YEARS)[number], ComponentType> = {
  1997: Bio1997,
  2014: Bio2014,
  2016: Bio2016,
  2017: Bio2017,
  2019: Bio2019,
  2020: Bio2020,
  2021: Bio2021,
  2022: Bio2022,
  2023: Bio2023,
  2024: Bio2024,
  2025: Bio2025,
  2026: Bio2026,
};

const HIDE_DELAY_MS = 300;

export default function ColourPaletteLanding({
  recentJournals = [],
  recentLogs = [],
  recentProjects = [],
}: ColourPaletteLandingProps) {
  const [hoveredPreview, setHoveredPreview] = useState<{
    type: TabItemType;
    item: TabItem;
  } | null>(null);
  const [scrollState, setScrollState] = useState({
    atTop: true,
    atBottom: true,
  });
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const atTop = scrollTop <= 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
    setScrollState((prev) =>
      prev.atTop !== atTop || prev.atBottom !== atBottom
        ? { atTop, atBottom }
        : prev,
    );
  }, []);

  useEffect(() => {
    updateScrollState();
    const t = setTimeout(updateScrollState, 0);
    return () => clearTimeout(t);
  }, [updateScrollState]);

  const cancelHide = () => {
    if (hideTimeoutRef.current !== null) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const scheduleHide = () => {
    cancelHide();
    hideTimeoutRef.current = setTimeout(
      () => setHoveredPreview(null),
      HIDE_DELAY_MS,
    );
  };

  const handleHoverItem = (item: TabItem, type: TabItemType) => {
    cancelHide();
    setHoveredPreview({ type, item });
  };

  const currentYear = new Date().getFullYear();
  const latestBioYear =
    BIO_YEARS.filter((y) => y <= currentYear).pop() ??
    BIO_YEARS[BIO_YEARS.length - 1];
  const LatestBio = BIO_COMPONENTS[latestBioYear];

  return (
    <main className="h-screen w-full flex flex-col bg-primary-gray text-primary-black font-inter overflow-x-hidden overflow-hidden max-lg:overflow-y-auto max-lg:min-h-screen">
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 w-full max-lg:flex-none">
        {/* Left: preview card (when hovering list item) + text; content scrolls, footer stays at bottom */}
        <div className="w-full max-w-full lg:w-2/3 xl:w-1/2 lg:min-w-0 max-lg:min-h-screen lg:min-h-0 px-4 py-4 sm:p-6 lg:py-8 lg:pl-8 lg:pr-4 flex flex-col bg-primary-gray gap-4 sm:gap-6">
          <div className="flex-1 max-lg:min-h-screen max-lg:flex-none lg:min-h-0 rounded-2xl overflow-hidden bg-primary-white flex flex-col px-6 py-6">
            <h1 className="text-2xl sm:text-3xl mb-6 sm:mb-8 shrink-0">
              <span className="font-bold text-gray-800">gndclouds</span>
            </h1>

            <div
              ref={scrollRef}
              className="space-y-10 sm:space-y-12 flex-1 min-h-0 overflow-y-auto max-lg:overflow-y-visible max-lg:flex-none scroll-smooth"
              onScroll={updateScrollState}
              style={{
                maskImage: scrollState.atTop
                  ? scrollState.atBottom
                    ? "none"
                    : `linear-gradient(to bottom, black 0%, black calc(100% - 1.5rem), transparent 100%)`
                  : scrollState.atBottom
                    ? `linear-gradient(to bottom, transparent 0%, black 1.5rem, black 100%)`
                    : `linear-gradient(to bottom, transparent 0%, black 1.5rem, black calc(100% - 1.5rem), transparent 100%)`,
                WebkitMaskImage: scrollState.atTop
                  ? scrollState.atBottom
                    ? "none"
                    : `linear-gradient(to bottom, black 0%, black calc(100% - 1.5rem), transparent 100%)`
                  : scrollState.atBottom
                    ? `linear-gradient(to bottom, transparent 0%, black 1.5rem, black 100%)`
                    : `linear-gradient(to bottom, transparent 0%, black 1.5rem, black calc(100% - 1.5rem), transparent 100%)`,
              }}
            >
              {hoveredPreview ? (
                <HoverPreviewCard
                  variant="full"
                  item={hoveredPreview.item}
                  type={hoveredPreview.type}
                  onMouseEnter={cancelHide}
                  onMouseLeave={() => setHoveredPreview(null)}
                />
              ) : (
                <section className="group animate-fade-in flex flex-col gap-4">
                  <LatestBio />
                </section>
              )}
            </div>
          </div>

          <footer className="max-lg:hidden shrink-0 rounded-2xl overflow-hidden bg-primary-white dark:bg-backgroundDark flex flex-wrap justify-between items-center gap-x-4 gap-y-1 px-6 py-4 text-sm text-primary-black dark:text-textDark">
            <nav className="flex flex-wrap items-center justify-start gap-x-4 gap-y-1">
              <Link
                href="/feed"
                className="transition-opacity hover:opacity-70"
                data-umami-event="nav-feed"
              >
                feed
              </Link>
              <Link
                href="https://webring.xxiivv.com/#xxiivv"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-70"
                data-umami-event="outbound-webring"
              >
                webring <span className="font-mono">↗</span>
              </Link>
              <Link
                href="/cv"
                className="transition-opacity hover:opacity-70"
                data-umami-event="nav-cv"
              >
                cv
              </Link>
              <Link
                href="https://are.na/gndclouds"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-70"
                data-umami-event="outbound-arena"
              >
                are.na <span className="font-mono">↗</span>
              </Link>
              <Link
                href="https://bsky.app/profile/gndclouds.earth"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-70"
                data-umami-event="outbound-bluesky"
              >
                bluesky <span className="font-mono">↗</span>
              </Link>
              <Link
                href="https://github.com/gndclouds"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-70"
                data-umami-event="outbound-github"
              >
                github <span className="font-mono">↗</span>
              </Link>
              <Link
                href="/newsletters"
                className="transition-opacity hover:opacity-70"
                data-umami-event="nav-newsletter"
              >
                newsletter
              </Link>
            </nav>
            {SHOW_THEME_CHOOSER && <ThemeChooser />}
          </footer>
        </div>

        {/* Right: tabs — Journals, Projects, Logs */}
        <div className="w-full max-w-full lg:w-1/3 xl:w-1/2 lg:min-w-0 max-lg:min-h-screen lg:min-h-0 px-4 py-4 sm:p-6 lg:py-8 lg:pr-8 lg:pl-4 flex flex-col">
          <div className="flex-1 max-lg:min-h-screen max-lg:flex-none lg:min-h-0 rounded-2xl overflow-hidden bg-primary-white flex flex-col px-6 py-6">
            <LandingTabs
              recentJournals={recentJournals}
              recentLogs={recentLogs}
              recentProjects={recentProjects}
              onHoverItem={handleHoverItem}
              onHoverEnd={scheduleHide}
            />
          </div>
        </div>

        {/* Footer at bottom on small screens (after intro + tabs) */}
        <footer className="lg:hidden shrink-0 rounded-2xl overflow-hidden bg-primary-white dark:bg-backgroundDark flex flex-wrap justify-between items-center gap-x-4 gap-y-1 px-6 py-4 text-sm text-primary-black dark:text-textDark mx-4 mb-4 sm:mx-6 sm:mb-6">
          <nav className="flex flex-wrap items-center justify-start gap-x-4 gap-y-1">
            <Link
              href="/feed"
              className="transition-opacity hover:opacity-70"
              data-umami-event="nav-feed"
            >
              feed
            </Link>
            <Link
              href="https://webring.xxiivv.com/#xxiivv"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
              data-umami-event="outbound-webring"
            >
              webring <span className="font-mono">↗</span>
            </Link>
            <Link
              href="/cv"
              className="transition-opacity hover:opacity-70"
              data-umami-event="nav-cv"
            >
              cv
            </Link>
            <Link
              href="https://are.na/gndclouds"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
              data-umami-event="outbound-arena"
            >
              are.na <span className="font-mono">↗</span>
            </Link>
            <Link
              href="https://bsky.app/profile/gndclouds.earth"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
              data-umami-event="outbound-bluesky"
            >
              bluesky <span className="font-mono">↗</span>
            </Link>
            <Link
              href="https://github.com/gndclouds"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
              data-umami-event="outbound-github"
            >
              github <span className="font-mono">↗</span>
            </Link>
            <Link
              href="/newsletters"
              className="transition-opacity hover:opacity-70"
              data-umami-event="nav-newsletter"
            >
              newsletter
            </Link>
          </nav>
          {SHOW_THEME_CHOOSER && <ThemeChooser />}
        </footer>
      </div>
    </main>
  );
}
