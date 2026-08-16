"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PortfolioRole {
  slug: string;
  title: string;
  description: string;
  dotColor: string;
  deckUrl: string | null;
  deckHtmlPath: string | null;
}

interface PortfolioData {
  roles: PortfolioRole[];
}

export default function PortfolioPage() {
  const [roles, setRoles] = useState<PortfolioRole[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/portfolio.json")
      .then((res) => res.json())
      .then((data: PortfolioData) => setRoles(data.roles))
      .catch(() => setError("Failed to load portfolio"));
  }, []);

  if (error) {
    return (
      <main className="min-h-screen w-full flex flex-col bg-primary-gray text-primary-black font-inter overflow-x-hidden">
        <div className="flex-1 flex flex-col w-full px-4 py-4 sm:p-6 lg:py-8 lg:px-8 gap-4 sm:gap-6">
          <div className="rounded-2xl overflow-hidden bg-primary-white px-6 py-6">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col bg-primary-gray text-primary-black font-inter overflow-x-hidden">
      <div className="flex-1 flex flex-col w-full px-4 py-4 sm:p-6 lg:py-8 lg:px-8 gap-4 sm:gap-6">
        {/* Card 1: Header — matches feed layout */}
        <header className="shrink-0 rounded-2xl overflow-hidden bg-primary-white flex flex-col px-6 py-6">
          <h1 className="text-2xl sm:text-3xl mb-2">
            <Link
              href="/"
              className="font-bold text-gray-800 hover:opacity-70 transition-opacity"
            >
              gndclouds
            </Link>
            <span className="font-bold text-gray-800"> / portfolio</span>
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            <span>
              Role-specific decks to quickly tailor applications. Click a card
              to view the research deck for that focus.
            </span>
          </div>
        </header>

        {/* Card 2: Role cards grid */}
        <div className="rounded-2xl overflow-hidden bg-primary-white flex flex-col px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {roles.map((role) => (
            <Link
              key={role.slug}
              href={`/portfolio/${role.slug}`}
              className="group flex flex-col rounded-xl border border-gray-100 p-5 transition-all duration-200 hover:bg-gray-50 hover:border-gray-200"
            >
              <div
                className="flex items-center gap-2 mb-3"
                style={{ ["--role-dot" as string]: role.dotColor }}
              >
                <div
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: role.dotColor }}
                  aria-hidden
                />
                <span className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                  {role.slug.replace(/-/g, " ")}
                </span>
              </div>
              <h2 className="text-xl font-bold text-primary-black mb-2 group-hover:text-gray-700 transition-colors">
                {role.title}
              </h2>
              <p className="text-gray-600 text-[15px] leading-relaxed flex-1">
                {role.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gray-500 group-hover:text-primary-black transition-colors">
                View deck
                <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
          </div>
        </div>

        {/* Footer — matches feed footer card */}
        <footer className="shrink-0 rounded-2xl overflow-hidden bg-primary-white dark:bg-backgroundDark flex flex-wrap justify-between items-center gap-x-4 gap-y-1 px-6 py-4 text-sm text-primary-black dark:text-textDark">
          <nav className="flex flex-wrap items-center justify-start gap-x-4 gap-y-1">
            <span className="text-gray-400">portfolio</span>
            <Link
              href="https://webring.xxiivv.com/#xxiivv"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
              data-umami-event="outbound-webring"
            >
              webring <span className="font-mono">↗</span>
            </Link>
            <Link href="/cv" className="transition-opacity hover:opacity-70" data-umami-event="nav-cv">
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
        </footer>
      </div>
    </main>
  );
}
