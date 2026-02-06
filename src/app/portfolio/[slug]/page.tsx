"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";

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

export default function PortfolioDeckPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const [role, setRole] = useState<PortfolioRole | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetch("/data/portfolio.json")
      .then((res) => res.json())
      .then((data: PortfolioData) => {
        const found = data.roles.find((r) => r.slug === slug);
        if (found) setRole(found);
        else setError("Role not found");
      })
      .catch(() => setError("Failed to load portfolio"));
  }, [slug]);

  if (error) {
    return (
      <main className="min-h-screen w-full flex flex-col bg-primary-gray text-primary-black font-inter overflow-x-hidden">
        <div className="flex-1 flex flex-col w-full px-4 py-4 sm:p-6 lg:py-8 lg:px-8 gap-4 sm:gap-6">
          <div className="rounded-2xl overflow-hidden bg-primary-white px-6 py-6">
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-black transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to portfolio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!role) {
    return (
      <main className="min-h-screen w-full flex flex-col bg-primary-gray text-primary-black font-inter overflow-x-hidden">
        <div className="flex-1 flex flex-col w-full px-4 py-4 sm:p-6 lg:py-8 lg:px-8 gap-4 sm:gap-6">
          <div className="rounded-2xl overflow-hidden bg-primary-white px-6 py-6">
            <div className="animate-pulse text-gray-500">Loading…</div>
          </div>
        </div>
      </main>
    );
  }

  const hasExternalDeck = role.deckUrl && role.deckUrl.startsWith("http");
  const hasHtmlDeck = role.deckHtmlPath;

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
            <span className="font-bold text-gray-800">
              {" "}
              /{" "}
              <Link
                href="/portfolio"
                className="hover:opacity-70 transition-opacity"
              >
                portfolio
              </Link>
              {" / "}
              <span className="inline-flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0 inline-block"
                  style={{ backgroundColor: role.dotColor }}
                  aria-hidden
                />
                {role.title}
              </span>
            </span>
          </h1>
        </header>

        {/* Card 2: Content area */}
        <div className="flex-1 min-h-0 flex flex-col rounded-2xl overflow-hidden bg-primary-white">
        {hasHtmlDeck ? (
          /* Embedded HTML deck (e.g. Keynote export) */
          <iframe
            src={role.deckHtmlPath!}
            title={`${role.title} deck`}
            className="flex-1 w-full min-h-0 border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : hasExternalDeck ? (
          /* External deck (e.g. LinkedIn, Notion, Google Slides) */
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
            <p className="text-gray-600 text-center max-w-md">
              This deck is hosted externally. Click below to open it in a new
              tab.
            </p>
            <a
              href={role.deckUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-black text-primary-white font-medium hover:bg-gray-800 transition-colors"
            >
              Open deck
              <ExternalLink className="size-4" />
            </a>
          </div>
        ) : (
          /* Placeholder — no deck configured yet */
          <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12">
            <div className="max-w-lg p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="size-5 text-gray-400" />
                <h2 className="text-lg font-bold text-primary-black">
                  Deck not yet configured
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                Add your research deck for the <strong>{role.title}</strong>{" "}
                role. You can:
              </p>
              <ul className="space-y-3 text-gray-600 text-sm leading-relaxed mb-6">
                <li>
                  <strong>LinkedIn:</strong> Add your LinkedIn profile URL to{" "}
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                    deckUrl
                  </code>{" "}
                  in{" "}
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                    /public/data/portfolio.json
                  </code>
                </li>
                <li>
                  <strong>Keynote → HTML:</strong> Export your deck as HTML,
                  place it in{" "}
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                    /public/decks/
                  </code>
                  , and set{" "}
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                    deckHtmlPath
                  </code>{" "}
                  to the path (e.g.{" "}
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                    /decks/researcher/index.html
                  </code>
                  )
                </li>
                <li>
                  <strong>Other:</strong> Google Slides, Notion, or any URL can
                  go in{" "}
                  <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                    deckUrl
                  </code>{" "}
                  — it will open in a new tab
                </li>
              </ul>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-black transition-colors"
              >
                <ArrowLeft className="size-4" />
                Back to portfolio
              </Link>
            </div>
          </div>
        )}
        </div>

        {/* Footer — matches feed footer card */}
        <footer className="shrink-0 rounded-2xl overflow-hidden bg-primary-white dark:bg-backgroundDark flex flex-wrap justify-between items-center gap-x-4 gap-y-1 px-6 py-4 text-sm text-primary-black dark:text-textDark">
          <nav className="flex flex-wrap items-center justify-start gap-x-4 gap-y-1">
            <Link
              href="/portfolio"
              className="text-gray-400 hover:opacity-70 transition-opacity"
            >
              portfolio
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
