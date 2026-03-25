import Link from "next/link";

/** Plain by default; hover matches LibraryTagsGrouped pill border/bg/text. */
const linkClass =
  "inline-flex items-center gap-0.5 rounded-md border border-transparent bg-transparent px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-inherit transition-colors hover:border-gray-200/20 hover:bg-gray-50/90 hover:text-gray-700 dark:hover:border-white/[0.03] dark:hover:bg-white/[0.04] dark:hover:text-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-black/25 dark:focus-visible:outline-white/30";

const linkClassEmbedded =
  "inline-flex items-center gap-0.5 rounded-md border border-transparent bg-transparent px-1 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-inherit transition-colors hover:border-gray-200/20 hover:bg-gray-50/90 hover:text-gray-700 dark:hover:border-white/[0.03] dark:hover:bg-white/[0.04] dark:hover:text-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-black/25 dark:focus-visible:outline-white/30";

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
    ? "border-t border-gray-200/90 pt-3 dark:border-gray-600/50 bg-transparent dark:bg-transparent rounded-none px-0 py-0 text-xs"
    : "rounded-2xl overflow-hidden bg-primary-white dark:bg-backgroundDark px-6 py-4 text-sm";

  const linkCn = embedded ? linkClassEmbedded : linkClass;

  const navGap = embedded ? "gap-x-1 gap-y-1" : "gap-x-2 gap-y-2";
  const rowGap = embedded ? "gap-y-1.5" : "gap-y-2";

  return (
    <footer
      className={`shrink-0 flex flex-col items-start justify-start text-primary-black dark:text-textDark ${rowGap} ${shell} ${className}`.trim()}
    >
      <nav
        className={`flex flex-wrap items-center justify-start ${navGap}`}
        aria-label="Site pages"
      >
        <Link href="/library" className={linkCn} data-umami-event="nav-bookshelf">
          bookshelf
        </Link>
        <Link href="/cv" className={linkCn} data-umami-event="nav-cv">
          cv
        </Link>
        {variant !== "home" ? (
          <>
            <Link href="/feed" className={linkCn} data-umami-event="nav-feed">
              feed
            </Link>
            <Link href="/" className={linkCn} data-umami-event="nav-home">
              home
            </Link>
          </>
        ) : null}
        <Link href="/newsletters" className={linkCn} data-umami-event="nav-newsletter">
          newsletter
        </Link>
      </nav>
      <nav
        className={`flex flex-wrap items-center justify-start ${navGap}`}
        aria-label="External links"
      >
        <Link
          href="https://are.na/gndclouds"
          target="_blank"
          rel="noopener noreferrer"
          className={linkCn}
          data-umami-event="outbound-arena"
        >
          are.na <span className="font-mono">↗</span>
        </Link>
        <Link
          href="https://bsky.app/profile/gndclouds.earth"
          target="_blank"
          rel="noopener noreferrer"
          className={linkCn}
          data-umami-event="outbound-bluesky"
        >
          bluesky <span className="font-mono">↗</span>
        </Link>
        <Link
          href="https://github.com/gndclouds"
          target="_blank"
          rel="noopener noreferrer"
          className={linkCn}
          data-umami-event="outbound-github"
        >
          github <span className="font-mono">↗</span>
        </Link>
        <Link
          href="https://webring.xxiivv.com/#xxiivv"
          target="_blank"
          rel="noopener noreferrer"
          className={linkCn}
          data-umami-event="outbound-webring"
        >
          webring <span className="font-mono">↗</span>
        </Link>
      </nav>
    </footer>
  );
}
