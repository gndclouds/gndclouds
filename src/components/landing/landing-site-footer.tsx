import Link from "next/link";

/** Plain by default; hover matches LibraryTagsGrouped pill border/bg/text. */
const linkClass =
  "inline-flex items-center gap-0.5 rounded-md border border-transparent bg-transparent px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-inherit transition-colors hover:border-gray-200/20 hover:bg-gray-50/90 hover:text-gray-700 dark:hover:border-white/[0.03] dark:hover:bg-white/[0.04] dark:hover:text-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-black/25 dark:focus-visible:outline-white/30";

export type LandingSiteFooterVariant = "home" | "default";

interface LandingSiteFooterProps {
  /** `home` omits home/feed (redundant on landing); journals & projects live in HomeLanding. */
  variant?: LandingSiteFooterVariant;
  /** Inline under intro column: no outer card, tighter type and gaps. */
  embedded?: boolean;
  className?: string;
}

/**
 * Shared footer card used on feed, portfolio, colour palette, and home.
 * Matches the rounded white/dark card + horizontal nav from the previous landing layout.
 */
export default function LandingSiteFooter({
  variant = "default",
  embedded = false,
  className = "",
}: LandingSiteFooterProps) {
  const shell = embedded
    ? "border-t border-gray-200/90 pt-4 dark:border-gray-600/50 bg-transparent dark:bg-transparent rounded-none px-0 py-0 text-xs gap-x-0 gap-y-0"
    : "rounded-2xl overflow-hidden bg-primary-white dark:bg-backgroundDark px-6 py-4 text-sm gap-x-4 gap-y-1";

  return (
    <footer
      className={`shrink-0 flex flex-wrap items-center justify-between text-primary-black dark:text-textDark ${shell} ${className}`.trim()}
    >
      <nav
        className={`flex flex-wrap items-center justify-start ${
          embedded ? "gap-x-2 gap-y-2" : "gap-x-2 gap-y-2"
        }`}
        aria-label="Site footer"
      >
        {variant !== "home" ? (
          <>
            <Link href="/" className={linkClass} data-umami-event="nav-home">
              home
            </Link>
            <Link href="/feed" className={linkClass} data-umami-event="nav-feed">
              feed
            </Link>
          </>
        ) : null}
        <Link
          href="https://webring.xxiivv.com/#xxiivv"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          data-umami-event="outbound-webring"
        >
          webring <span className="font-mono">↗</span>
        </Link>
        <Link href="/cv" className={linkClass} data-umami-event="nav-cv">
          cv
        </Link>
        <Link
          href="https://are.na/gndclouds"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          data-umami-event="outbound-arena"
        >
          are.na <span className="font-mono">↗</span>
        </Link>
        <Link
          href="https://bsky.app/profile/gndclouds.earth"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          data-umami-event="outbound-bluesky"
        >
          bluesky <span className="font-mono">↗</span>
        </Link>
        <Link
          href="https://github.com/gndclouds"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          data-umami-event="outbound-github"
        >
          github <span className="font-mono">↗</span>
        </Link>
        <Link href="/newsletters" className={linkClass} data-umami-event="nav-newsletter">
          newsletter
        </Link>
      </nav>
    </footer>
  );
}
