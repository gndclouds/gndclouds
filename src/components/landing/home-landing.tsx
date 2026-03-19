"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import type { Journal } from "@/queries/journals";
import type { Post as LogPost } from "@/queries/logs";
import type { Post as ProjectPost } from "@/queries/projects";
import LandingTabsWithCards from "@/components/landing/landing-tabs-with-cards";
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
interface JournalWithDescription extends Journal {
  description?: string;
}

interface HomeLandingProps {
  journals?: JournalWithDescription[];
  logs?: LogPost[];
  projects?: ProjectPost[];
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

const FooterNav = () => (
  <nav className="flex flex-wrap items-center justify-start gap-x-4 gap-y-1">
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
);

export default function HomeLanding({
  journals = [],
  logs = [],
  projects = [],
}: HomeLandingProps) {
  const [scrollState, setScrollState] = useState({
    atTop: true,
    atBottom: true,
  });
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
        : prev
    );
  }, []);

  useEffect(() => {
    updateScrollState();
    const t = setTimeout(updateScrollState, 0);
    return () => clearTimeout(t);
  }, [updateScrollState]);

  const currentYear = new Date().getFullYear();
  const latestBioYear =
    BIO_YEARS.filter((y) => y <= currentYear).pop() ??
    BIO_YEARS[BIO_YEARS.length - 1];
  const LatestBio = BIO_COMPONENTS[latestBioYear];

  return (
    <main className="h-screen w-full flex flex-col bg-primary-gray text-primary-black font-inter overflow-x-hidden overflow-hidden max-lg:overflow-y-auto max-lg:min-h-screen">
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 w-full max-lg:flex-none">
        {/* Left: bio */}
        <div className="w-full max-w-full lg:w-1/3 lg:min-w-0 max-lg:min-h-screen lg:min-h-0 px-4 py-4 sm:p-6 lg:py-8 lg:pl-8 lg:pr-4 flex flex-col bg-primary-gray gap-4 sm:gap-6">
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
              <section className="group animate-fade-in flex flex-col gap-4">
                <LatestBio />
              </section>
            </div>
          </div>

          <footer className="max-lg:hidden shrink-0 rounded-2xl overflow-hidden bg-primary-white dark:bg-backgroundDark flex flex-wrap justify-between items-center gap-x-4 gap-y-1 px-6 py-4 text-sm text-primary-black dark:text-textDark">
            <FooterNav />
          </footer>
        </div>

        {/* Right: filter card + grid of floating cards */}
        <div className="w-full max-w-full lg:w-2/3 lg:min-w-0 flex-1 min-h-0 max-lg:min-h-screen px-4 pt-4 pb-0 sm:px-6 sm:pt-6 sm:pb-0 lg:pt-8 lg:pb-0 lg:pr-8 lg:pl-4 flex flex-col gap-4 sm:gap-6">
          <LandingTabsWithCards
            recentJournals={journals}
            recentLogs={logs}
            recentProjects={projects}
          />
        </div>

        <footer className="lg:hidden shrink-0 rounded-2xl overflow-hidden bg-primary-white dark:bg-backgroundDark flex flex-wrap justify-between items-center gap-x-4 gap-y-1 px-6 py-4 text-sm text-primary-black dark:text-textDark mx-4 mb-4 sm:mx-6 sm:mb-6">
          <FooterNav />
        </footer>
      </div>
    </main>
  );
}
