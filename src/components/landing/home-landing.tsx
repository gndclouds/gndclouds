"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Box } from "lucide-react";
import type { Journal } from "@/queries/journals";
import type { Post as ProjectPost } from "@/queries/projects";
import LandingTabsWithCards from "@/components/landing/landing-tabs-with-cards";
import LandingSiteFooter from "@/components/landing/landing-site-footer";
import type { FeedTypeFilterKey } from "@/components/landing/landing-feed-type-filters";

interface JournalWithDescription extends Journal {
  description?: string;
}

const FEED_PROJECTS_ONLY: Record<FeedTypeFilterKey, boolean> = {
  journals: false,
  logs: false,
  projects: true,
};

const SECTION_NAV = [
  { label: "Journals", href: "/journals", umami: "listing-nav-journals" },
  { label: "Projects", href: "/projects", umami: "listing-nav-projects" },
  { label: "Logs", href: "/logs", umami: "listing-nav-logs" },
] as const;

const PROJECT_BADGE_COLOR = "#0068e2";
const COMPANY_LINKS = [
  { name: "Intel Labs", href: "https://www.intel.com", domain: "intel.com" },
  { name: "IDEO", href: "https://www.ideo.com", domain: "ideo.com" },
  { name: "CoLab", href: "https://ideocolab.com", domain: "ideocolab.com" },
  {
    name: "Protocol Labs",
    href: "https://www.protocol.ai",
    domain: "protocol.ai",
  },
  {
    name: "Dark Matter Labs",
    href: "https://www.darkmatterlabs.org",
    domain: "darkmatterlabs.org",
  },
  {
    name: "Xerox PARC",
    href: "https://www.parc.com",
    domain: "parc.com",
  },
  { name: "Fjord", href: "https://www.fjordnet.com", domain: "fjordnet.com" },
  { name: "Ezra", href: "https://ezra.fi", domain: "ezra.fi" },
  {
    name: "Maker Media",
    href: "https://makezine.com",
    domain: "makezine.com",
  },
  { name: "IFTTT", href: "https://ifttt.com", domain: "ifttt.com" },
] as const;

interface ProjectsListingMeta {
  title: string;
  description: string;
  entryCount: number;
  rssHref?: string;
}

function CompanyInlineLink({
  href,
  domain,
  children,
}: {
  href: string;
  domain: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-gray-900 underline decoration-gray-300 underline-offset-2 transition-colors hover:text-primary-black hover:decoration-gray-500 dark:text-textDark dark:decoration-gray-500 dark:hover:text-white dark:hover:decoration-gray-300"
    >
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
        alt=""
        aria-hidden
        className="size-4 shrink-0 rounded-sm"
        loading="lazy"
      />
      <span>{children}</span>
    </a>
  );
}

interface HomeLandingProps {
  journals?: JournalWithDescription[];
  projects?: ProjectPost[];
  /** `"projects"` reuses this shell with a listing sidebar and projects-only cards (same grid as home). */
  variant?: "home" | "projects";
  /** Required when `variant` is `"projects"`. */
  projectsListing?: ProjectsListingMeta;
}

export default function HomeLanding({
  journals = [],
  projects = [],
  variant = "home",
  projectsListing,
}: HomeLandingProps) {
  const isProjects = variant === "projects";
  const listing = isProjects ? projectsListing : undefined;

  return (
    <main className="min-h-screen w-full flex flex-col overflow-x-hidden bg-primary-gray text-primary-black font-inter max-md:overflow-y-auto md:h-[100dvh] md:max-h-[100dvh] md:min-h-0 md:overflow-hidden dark:bg-backgroundDark dark:text-textDark">
      <div className="flex min-h-0 flex-1 flex-col max-md:flex-none md:flex-row">
        {/* Left: intro — scrolls inside a viewport-tall column on md+ */}
        <div className="flex w-full max-w-full flex-col bg-primary-gray md:min-h-0 md:w-1/3 md:min-w-0 md:overflow-hidden px-4 py-4 sm:p-6 max-md:pb-0 md:pt-4 md:pb-4 md:pl-2 md:pr-2 dark:bg-backgroundDark">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-primary-white max-md:flex-none dark:bg-[#242424] px-6 py-8 sm:px-7 sm:py-9 text-gray-800 dark:text-textDark">
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain [scrollbar-gutter:stable]">
              {isProjects && listing ? (
              <>
                <Link
                  href="/"
                  className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-primary-black dark:text-gray-400 dark:hover:text-textDark"
                  data-umami-event="listing-back-home-projects"
                >
                  <ArrowLeft className="size-4 shrink-0" aria-hidden />
                  Home
                </Link>

                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200/90 bg-primary-gray/80 px-2.5 py-1 text-xs font-medium text-primary-black dark:border-gray-600 dark:bg-zinc-800/80 dark:text-textDark">
                    <span
                      className="inline-flex size-6 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${PROJECT_BADGE_COLOR}24` }}
                    >
                      <Box
                        size={14}
                        style={{ color: PROJECT_BADGE_COLOR }}
                        aria-hidden
                      />
                    </span>
                    Project
                  </span>
                </div>

                <h1 className="text-2xl font-semibold leading-tight tracking-tight text-gray-900 dark:text-textDark sm:text-3xl">
                  {listing.title}
                </h1>

                <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-lg">
                  {listing.description}
                </p>

                <p className="mt-6 text-sm tabular-nums text-gray-500 dark:text-gray-500">
                  {listing.entryCount}{" "}
                  {listing.entryCount === 1 ? "entry" : "entries"}
                </p>

                {listing.rssHref ? (
                  <p className="mt-4">
                    <a
                      href={listing.rssHref}
                      className="text-sm font-medium text-primary-black underline underline-offset-2 hover:text-gray-800 dark:text-textDark dark:hover:text-white"
                      data-umami-event="listing-rss"
                    >
                      RSS feed
                    </a>
                  </p>
                ) : null}

                <nav
                  aria-label="Main sections"
                  className="mt-8 border-t border-gray-200/90 pt-8 dark:border-gray-600/50"
                >
                  <ul className="m-0 flex list-none flex-col gap-3 p-0">
                    {SECTION_NAV.map((item) => (
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
              </>
              ) : (
              <section className="animate-fade-in space-y-5 sm:space-y-6 pb-2">
                <p className="text-base sm:text-lg md:text-[1.0625rem] leading-relaxed text-gray-800 dark:text-textDark">
                  Will focuses on the layer where humans, AI, and the physical
                  environment meet, working to make natural systems more
                  legible so we can live with nature, not adjacent to it.
                </p>
                <p className="text-sm sm:text-base md:text-[0.9375rem] leading-relaxed text-gray-800 dark:text-textDark [&_a_img]:size-3.5">
                  Previously, I&apos;ve worked at the intersection of design and
                  development at{" "}
                  {COMPANY_LINKS.map((company, index) => {
                    const isLast = index === COMPANY_LINKS.length - 1;
                    const isSecondToLast = index === COMPANY_LINKS.length - 2;

                    return (
                      <span key={company.name}>
                        <CompanyInlineLink
                          href={company.href}
                          domain={company.domain}
                        >
                          {company.name}
                        </CompanyInlineLink>
                        {isLast ? "." : isSecondToLast ? ", and " : ", "}
                      </span>
                    );
                  })}{" "}
                  Across these roles, I specialized in translating emerging
                  technologies into working prototypes, simplifying complexity
                  to focus on core function. Along the way, I&apos;ve managed
                  teams, led products from prototype to v0, and shipped work
                  that brought new technologies to market.
                </p>
                <p className="text-sm sm:text-base md:text-[0.9375rem] leading-relaxed text-gray-800 dark:text-textDark [&_a_img]:size-3.5">
                  Alongside this work, I cofounded{" "}
                  <CompanyInlineLink
                    href="https://tinyfactories.space/"
                    domain="tinyfactories.space"
                  >
                    Tiny Factories
                  </CompanyInlineLink>
                  , a tribe of
                  makers supporting each other to establish creative footing,
                  where I deepened my practice through personal projects and
                  climate-focused tinkering.
                </p>
                <p className="text-sm sm:text-base md:text-[0.9375rem] leading-relaxed text-gray-800 dark:text-textDark [&_a_img]:size-3.5">
                  My academic journey began at{" "}
                  <CompanyInlineLink
                    href="https://www.cca.edu"
                    domain="cca.edu"
                  >
                    California College of the Arts
                  </CompanyInlineLink>
                  , where I studied Interaction Design. Around that time, I
                  participated in{" "}
                  <CompanyInlineLink
                    href="https://www.youtube.com/watch?v=PZJoJ-b2MIY"
                    domain="youtube.com"
                  >
                    John Bielenberg
                  </CompanyInlineLink>
                  &apos;s experimental education program focused on{" "}
                  <span className="inline-flex items-center gap-1 align-baseline font-semibold tracking-[0.08em]">
                    <span>THINK</span>
                    <span className="inline-block rotate-180">WRONG</span>
                  </span>
                  , which shaped how I approach applying my capabilities to the
                  world.
                </p>
              </section>
              )}
            </div>

            <div className="relative z-10 shrink-0 bg-primary-white pt-2 dark:bg-[#242424] sm:pt-3">
              <LandingSiteFooter
                variant={isProjects ? "default" : "home"}
                embedded
                className="mt-0"
              />
            </div>
          </div>
        </div>

        {/* Right: sticky search + masonry / list (same as home) */}
        <div className="flex min-h-0 max-md:min-h-0 w-full max-w-full flex-1 flex-col px-4 pb-0 pt-0 sm:px-6 md:w-2/3 md:min-w-0 md:pb-0 md:pl-4 md:pr-0">
          <LandingTabsWithCards
            recentJournals={isProjects ? [] : journals}
            recentProjects={projects}
            feedTypesEnabled={isProjects ? FEED_PROJECTS_ONLY : undefined}
            searchPlaceholder={isProjects ? "Search projects…" : undefined}
          />
        </div>
      </div>
    </main>
  );
}
