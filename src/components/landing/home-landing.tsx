"use client";

import type { Journal } from "@/queries/journals";
import type { Post as ProjectPost } from "@/queries/projects";
import LandingTabsWithCards from "@/components/landing/landing-tabs-with-cards";
import LandingSiteFooter from "@/components/landing/landing-site-footer";

interface JournalWithDescription extends Journal {
  description?: string;
}

interface HomeLandingProps {
  journals?: JournalWithDescription[];
  projects?: ProjectPost[];
}

export default function HomeLanding({
  journals = [],
  projects = [],
}: HomeLandingProps) {
  return (
    <main className="min-h-screen w-full flex flex-col overflow-x-hidden bg-primary-gray text-primary-black font-inter max-md:overflow-y-auto md:h-[100dvh] md:max-h-[100dvh] md:min-h-0 md:overflow-hidden dark:bg-backgroundDark dark:text-textDark">
      <div className="flex min-h-0 flex-1 flex-col max-md:flex-none md:flex-row">
        {/* Left: intro — scrolls inside a viewport-tall column on md+ */}
        <div className="flex w-full max-w-full flex-col bg-primary-gray md:min-h-0 md:w-1/3 md:min-w-0 md:overflow-hidden px-4 py-4 sm:p-6 max-md:pb-0 md:pt-4 md:pb-4 md:pl-2 md:pr-2 dark:bg-backgroundDark">
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-2xl bg-primary-white max-md:flex-none dark:bg-[#242424] px-6 py-6 text-gray-800 dark:text-textDark">
            <section className="animate-fade-in flex min-h-0 flex-1 flex-col pb-2 max-md:flex-none">
              <p className="text-lg sm:text-xl md:text-[1.35rem] leading-snug sm:leading-relaxed text-gray-800 dark:text-textDark">
                Will focuses on the layer where humans, AI, and the physical
                environment meet—working to make natural systems more legible so
                we can live with nature, not only adjacent to it.
              </p>
            </section>

            <LandingSiteFooter variant="home" embedded className="shrink-0" />
          </div>
        </div>

        {/* Right: filter card + grid of floating cards */}
        <div className="w-full max-w-full md:w-2/3 md:min-w-0 flex-1 min-h-0 max-md:min-h-0 px-4 pb-0 pt-0 sm:px-6 md:pb-0 md:pl-4 md:pr-4 flex flex-col">
          <LandingTabsWithCards
            recentJournals={journals}
            recentProjects={projects}
          />
        </div>
      </div>
    </main>
  );
}
