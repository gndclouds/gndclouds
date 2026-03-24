"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import type { Journal } from "@/queries/journals";
import type { Post as LogPost } from "@/queries/logs";
import type { Post as ProjectPost } from "@/queries/projects";
import LandingTabsWithCards from "@/components/landing/landing-tabs-with-cards";
import { LIBRARY_FILTERS } from "@/components/landing/design-skill-filters";

interface JournalWithDescription extends Journal {
  description?: string;
}

interface HomeLandingProps {
  journals?: JournalWithDescription[];
  logs?: LogPost[];
  projects?: ProjectPost[];
}

const MAIN_NAV = [
  { label: "Journals", href: "/journals", umami: "home-nav-journals" },
  { label: "Projects", href: "/projects", umami: "home-nav-projects" },
  { label: "Logs", href: "/logs", umami: "home-nav-logs" },
] as const;

function MainPagesNav() {
  return (
    <nav
      aria-label="Main sections"
      className="border-t border-gray-200/90 pt-8 dark:border-gray-600/50"
    >
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {MAIN_NAV.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-base font-medium text-gray-800 transition-colors hover:text-primary-black dark:text-textDark dark:hover:text-white sm:text-lg"
              data-umami-event={item.umami}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function HomeLanding({
  journals = [],
  logs = [],
  projects = [],
}: HomeLandingProps) {
  const [designSkillFilterIds, setDesignSkillFilterIds] = useState<string[]>(
    []
  );

  const toggleDesignSkill = useCallback((id: string) => {
    setDesignSkillFilterIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  return (
    <main className="h-screen w-full flex flex-col bg-primary-gray text-primary-black font-inter overflow-x-hidden overflow-hidden max-md:overflow-y-auto max-md:min-h-screen dark:bg-backgroundDark dark:text-textDark">
      <div className="flex-1 flex flex-col md:flex-row min-h-0 w-full max-md:flex-none">
        {/* Left: intro */}
        <div className="w-full max-w-full md:w-1/3 md:min-w-0 max-md:min-h-screen md:min-h-0 px-4 py-4 sm:p-6 md:pt-4 md:pb-4 md:pl-2 md:pr-2 flex flex-col bg-primary-gray dark:bg-backgroundDark">
          <div className="flex-1 max-md:min-h-screen max-md:flex-none md:min-h-0 min-h-0 overflow-y-auto bg-primary-white dark:bg-[#242424] flex flex-col px-6 py-6 text-gray-800 dark:text-textDark">
            <section className="animate-fade-in flex flex-col gap-8">
              <p className="text-lg sm:text-xl md:text-[1.35rem] leading-snug sm:leading-relaxed text-gray-800 dark:text-textDark">
                Will focuses on the layer where humans, AI, and the physical
                environment meet—working to make natural systems more legible so
                we can live with nature, not only adjacent to it.
              </p>

              <MainPagesNav />

              <div className="border-t border-gray-200/90 pt-8 dark:border-gray-600/50">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-500">
                  Topics &amp; companies
                </p>
                <div
                  className="flex flex-wrap gap-2"
                  role="group"
                  aria-label="Filter feed by topic and company tags"
                >
                  {LIBRARY_FILTERS.map((f) => {
                    const pressed = designSkillFilterIds.includes(f.id);
                    return (
                      <button
                        key={f.id}
                        type="button"
                        aria-pressed={pressed}
                        onClick={() => toggleDesignSkill(f.id)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 dark:focus-visible:ring-gray-500 sm:text-sm ${
                          pressed
                            ? "border-primary-black bg-primary-black text-primary-white dark:border-white dark:bg-white dark:text-primary-black"
                            : "border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-zinc-800"
                        }`}
                        data-umami-event={`home-design-skill-${f.id}`}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>
                {designSkillFilterIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setDesignSkillFilterIds([])}
                    className="mt-3 text-xs text-gray-500 underline-offset-2 hover:text-gray-800 hover:underline dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Right: filter card + grid of floating cards */}
        <div className="w-full max-w-full md:w-2/3 md:min-w-0 flex-1 min-h-0 max-md:min-h-0 px-4 pb-0 pt-0 sm:px-6 md:pb-0 md:pl-4 md:pr-4 flex flex-col">
          <LandingTabsWithCards
            recentJournals={journals}
            recentLogs={logs}
            recentProjects={projects}
            designSkillFilterIds={designSkillFilterIds}
          />
        </div>

      </div>
    </main>
  );
}
