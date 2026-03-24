"use client";

import Link from "next/link";
import {
  ArrowBigRight,
  BookOpen,
  Box,
  ChevronRight,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import ProjectCardMedia from "@/components/project-card-media";
import {
  formatCardHeading,
  markdownBodyToCardPlainText,
  stripMarkdownMediaEmbeds,
  stripObsidianWikiLinksForPreview,
} from "@/lib/markdown-to-card-plain-text";
import LibraryTagsGrouped from "@/components/landing/library-tags-grouped";
import {
  getJournalListingRawTagPaths,
  getProjectCardRawTagPaths,
} from "@/lib/library-tag-paths";
import {
  getJournalCardMediaUrls,
  getProjectCardMediaUrls,
} from "@/lib/project-card-images";
import type { TabItemType } from "@/components/landing/hover-preview-card";
import type { TabItem } from "@/components/landing/hover-preview-card";

/** Image + text landing cards — flat surface (no drop shadow). */
const LANDING_IMAGE_CARD_LINK =
  "group box-border flex min-h-0 flex-col overflow-hidden rounded-2xl border border-primary-black/[0.08] bg-primary-white dark:border-white/[0.08] dark:bg-zinc-900";

/** Short mono tags: artifact (project), journal, log — right corner uses date, not type prefix. */
const TYPE_CONFIG: Record<TabItemType, { shortLabel: string }> = {
  project: { shortLabel: "A" },
  journal: { shortLabel: "K" },
  log: { shortLabel: "LOG" },
};

/** Natural image aspect ratio in card media; cap height so very tall assets do not dominate the feed. */
const LANDING_CARD_IMAGE_MEDIA_CLASSES =
  "max-h-[min(68vh,560px)] h-auto w-full object-contain dark:brightness-[0.88] dark:contrast-[1.05]";

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${day}`;
  } catch {
    return "";
  }
}

/** Upper-right: post date `YYYY.MM.DD`; if missing, stable numeric fallback from slug. */
function getCornerDateDisplay(publishedAt: string, slug: string): string {
  const d = formatDate(publishedAt);
  if (d) return d;
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return String(100 + (h % 900));
}

const IMAGE_CORNER_MONO =
  "pointer-events-none absolute top-2.5 z-10 max-w-[48%] font-mono text-[10px] tracking-wide text-primary-black/40 tabular-nums dark:text-textDark/45";

const CARD_TAGS_CLASS =
  "mt-2 flex flex-wrap items-start gap-x-4 gap-y-2 text-gray-600 dark:text-gray-400";

/** List row: type icon only (neutral; no tinted pill). */
const LIST_TYPE_ICON: Record<TabItemType, { Icon: LucideIcon }> = {
  journal: { Icon: BookOpen },
  project: { Icon: Box },
  log: { Icon: ScrollText },
};

const LIST_ROW_LINK_CLASS =
  "group flex w-full items-center justify-between gap-2 rounded-lg px-3 py-1.5 min-h-9 text-primary-black transition-[background-color,opacity] hover:bg-gray-100 dark:text-textDark dark:hover:bg-white/[0.06]";

function ListTypeIconOnly({ type }: { type: TabItemType }) {
  const { Icon } = LIST_TYPE_ICON[type];
  return (
    <span
      className="inline-flex size-7 shrink-0 items-center justify-center text-primary-black/55 dark:text-textDark/55"
      aria-hidden
    >
      <Icon size={14} strokeWidth={2} />
    </span>
  );
}

/** Upper-left on image: short kind tag (A / K / LOG). */
function ImageCornerKindLabel({ type }: { type: TabItemType }) {
  const config = TYPE_CONFIG[type];
  return (
    <span className={`${IMAGE_CORNER_MONO} left-2.5`} aria-hidden>
      {config.shortLabel}
    </span>
  );
}

/** Upper-right on image: publication date (no type prefix — kind is on the left). */
function ImageCornerSysId({
  publishedAt,
  slug,
}: {
  publishedAt: string;
  slug: string;
}) {
  return (
    <span
      className={`${IMAGE_CORNER_MONO} right-2.5 text-right`}
      aria-hidden
    >
      {getCornerDateDisplay(publishedAt, slug)}
    </span>
  );
}

/** Same top bar as image cards (A/K/LOG + date), without media — text-only grid cards. */
function TextCardTopChrome({
  type,
  publishedAt,
  slug,
}: {
  type: TabItemType;
  publishedAt: string;
  slug: string;
}) {
  return (
    <div className="p-3 pb-0">
      <div className="relative min-h-10 w-full shrink-0 overflow-hidden rounded-xl">
        <ImageCornerKindLabel type={type} />
        <ImageCornerSysId publishedAt={publishedAt} slug={slug} />
      </div>
    </div>
  );
}

function getExcerpt(item: TabItem, maxLength = 100): string {
  const desc = (item.metadata as Record<string, unknown> | undefined)
    ?.description;
  const fromMeta =
    item.description ?? (typeof desc === "string" ? desc : null);
  if (fromMeta) {
    return stripObsidianWikiLinksForPreview(
      stripMarkdownMediaEmbeds(fromMeta).replace(/\s+/g, " ").trim()
    ).slice(0, maxLength);
  }
  const raw = item.metadata?.contentHtml;
  if (typeof raw !== "string") return "";
  return markdownBodyToCardPlainText(raw).slice(0, maxLength);
}

function getHref(type: TabItemType, slug: string): string {
  switch (type) {
    case "journal":
      return `/journal/${slug}`;
    case "log":
      return `/log/${slug}`;
    case "project":
      return `/project/${slug}`;
    default:
      return `/${type}/${slug}`;
  }
}

/** Resolve optional hero image from front matter (projects, logs). */
function getHeroImageFromFrontmatter(item: TabItem): string | null {
  const raw =
    (item.metadata as Record<string, unknown> | undefined)?.heroImage ?? "";
  const candidate = typeof raw === "string" ? raw.trim() : "";
  if (!candidate) return null;
  const isValid =
    /(\.(png|jpe?g|gif|webp|avif|svg))$/i.test(candidate) ||
    candidate.startsWith("http") ||
    candidate.startsWith("/");
  if (!isValid) return null;
  if (
    candidate.startsWith("/") &&
    !candidate.startsWith("http") &&
    !candidate.startsWith("/api/asset-proxy") &&
    !candidate.startsWith("/db-assets/") &&
    typeof process !== "undefined" &&
    process.env.NODE_ENV === "production"
  ) {
    const pathWithoutSlash = candidate.substring(1);
    const assetPath = pathWithoutSlash.startsWith("assets/")
      ? pathWithoutSlash
      : `assets/${pathWithoutSlash}`;
    return `/api/asset-proxy?path=${encodeURIComponent(assetPath)}`;
  }
  return candidate;
}

function getSharedCardDisplayUrl(item: TabItem): string | null {
  const fromServer = (item.metadata as Record<string, unknown> | undefined)
    ?.cardImageDisplayUrl;
  if (typeof fromServer === "string" && fromServer.trim()) {
    return fromServer.trim();
  }
  return getHeroImageFromFrontmatter(item);
}

function getSharedCardHoverGifUrl(item: TabItem): string | null {
  const raw = (item.metadata as Record<string, unknown> | undefined)
    ?.cardImageHoverGifUrl;
  return typeof raw === "string" && raw.trim() ? raw.trim() : null;
}

interface LandingItemCardProps {
  item: TabItem;
  type: TabItemType;
  /** Default card grid tiles; list is a compact horizontal row. */
  layout?: "grid" | "list";
  /** Feed only: clicking a tag filters the library by normalized tag path. */
  onLibraryTagPathSelect?: (normalizedFullPath: string) => void;
}

/** Project card with lead image (before prose in body; `getProjectCardMediaUrls`). */
function ProjectCardWithImage({
  item,
  href,
  imageSrc,
  hoverGifSrc,
  onLibraryTagPathSelect,
}: {
  item: TabItem;
  href: string;
  imageSrc: string;
  hoverGifSrc?: string | null;
  onLibraryTagPathSelect?: (path: string) => void;
}) {
  const description = getExcerpt(item, 160);
  const tags = getProjectCardRawTagPaths(
    item.tags,
    "categories" in item ? item.categories : undefined
  );

  return (
    <Link href={href} className={LANDING_IMAGE_CARD_LINK}>
      <div className="p-3 pb-0">
        <div className="relative w-full shrink-0 overflow-hidden rounded-xl bg-primary-gray/60 dark:bg-zinc-800/90">
          <ImageCornerKindLabel type="project" />
          <ImageCornerSysId publishedAt={item.publishedAt} slug={item.slug} />
          <ProjectCardMedia
            displaySrc={imageSrc}
            hoverGifSrc={hoverGifSrc ?? null}
            alt=""
            sizes="(max-width: 768px) 100vw, 33vw"
            naturalAspect
            imgClassName={LANDING_CARD_IMAGE_MEDIA_CLASSES}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <h3 className="font-semibold text-primary-black dark:text-textDark text-base leading-snug line-clamp-2">
          {formatCardHeading(item.title)}
        </h3>
        <time dateTime={item.publishedAt} className="sr-only">
          {formatDate(item.publishedAt) || item.publishedAt}
        </time>
        {description ? (
          <p className="mt-1.5 text-sm leading-relaxed text-gray-500 line-clamp-2 dark:text-gray-400">
            {description}
          </p>
        ) : null}
        <LibraryTagsGrouped
          tags={tags}
          className={CARD_TAGS_CLASS}
          onTagPathSelect={onLibraryTagPathSelect}
        />
      </div>
    </Link>
  );
}

/** Project card when no hero image: simple card (title + optional description). */
function ProjectCardDefault({
  item,
  href,
  onLibraryTagPathSelect,
}: {
  item: TabItem;
  href: string;
  onLibraryTagPathSelect?: (path: string) => void;
}) {
  const excerpt = getExcerpt(item);
  const tags = getProjectCardRawTagPaths(
    item.tags,
    "categories" in item ? item.categories : undefined
  );

  return (
    <Link href={href} className={LANDING_IMAGE_CARD_LINK}>
      <TextCardTopChrome
        type="project"
        publishedAt={item.publishedAt}
        slug={item.slug}
      />
      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <h3 className="font-semibold text-primary-black dark:text-textDark text-base leading-snug line-clamp-2">
          {formatCardHeading(item.title)}
        </h3>
        <time dateTime={item.publishedAt} className="sr-only">
          {formatDate(item.publishedAt) || item.publishedAt}
        </time>
        {excerpt ? (
          <p className="mt-1.5 text-sm leading-relaxed text-gray-500 line-clamp-3 dark:text-gray-400">
            {excerpt}
          </p>
        ) : null}
        <LibraryTagsGrouped
          tags={tags}
          className={CARD_TAGS_CLASS}
          onTagPathSelect={onLibraryTagPathSelect}
        />
      </div>
    </Link>
  );
}

/** Journal with cover from first lead image (`cardImageDisplayUrl` or client fallback). */
function JournalCardWithImage({
  item,
  href,
  onLibraryTagPathSelect,
}: {
  item: TabItem;
  href: string;
  onLibraryTagPathSelect?: (path: string) => void;
}) {
  const tagPaths = getJournalListingRawTagPaths(
    item.tags,
    "categories" in item ? item.categories : undefined
  );
  const meta = (item.metadata ?? {}) as Record<string, unknown>;
  const { displayUrl, hoverGifUrl } = getJournalCardMediaUrls(meta);
  if (!displayUrl)
    return (
      <JournalCardTextOnly
        item={item}
        href={href}
        onLibraryTagPathSelect={onLibraryTagPathSelect}
      />
    );

  return (
    <Link href={href} className={LANDING_IMAGE_CARD_LINK}>
      <div className="p-3 pb-0">
        <div className="relative w-full shrink-0 overflow-hidden rounded-xl bg-primary-gray/60 dark:bg-zinc-800/90">
          <ImageCornerKindLabel type="journal" />
          <ImageCornerSysId publishedAt={item.publishedAt} slug={item.slug} />
          <ProjectCardMedia
            displaySrc={displayUrl}
            hoverGifSrc={hoverGifUrl}
            alt=""
            sizes="(max-width: 768px) 100vw, 33vw"
            naturalAspect
            imgClassName={LANDING_CARD_IMAGE_MEDIA_CLASSES}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <h3 className="font-semibold text-primary-black dark:text-textDark text-base leading-snug line-clamp-2">
          {formatCardHeading(item.title)}
        </h3>
        <time dateTime={item.publishedAt} className="sr-only">
          {formatDate(item.publishedAt) || item.publishedAt}
        </time>
        <LibraryTagsGrouped
          tags={tagPaths}
          className={CARD_TAGS_CLASS}
          onTagPathSelect={onLibraryTagPathSelect}
        />
      </div>
    </Link>
  );
}

/** Journal with no lead image: text only. */
function JournalCardTextOnly({
  item,
  href,
  onLibraryTagPathSelect,
}: {
  item: TabItem;
  href: string;
  onLibraryTagPathSelect?: (path: string) => void;
}) {
  const excerpt = getExcerpt(item, 200);
  const tagPaths = getJournalListingRawTagPaths(
    item.tags,
    "categories" in item ? item.categories : undefined
  );

  return (
    <Link href={href} className={LANDING_IMAGE_CARD_LINK}>
      <TextCardTopChrome
        type="journal"
        publishedAt={item.publishedAt}
        slug={item.slug}
      />
      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <h3 className="font-semibold text-primary-black dark:text-textDark text-base leading-snug line-clamp-2">
          {formatCardHeading(item.title)}
        </h3>
        <time dateTime={item.publishedAt} className="sr-only">
          {formatDate(item.publishedAt) || item.publishedAt}
        </time>
        {excerpt ? (
          <p className="mt-1.5 text-sm leading-relaxed text-gray-500 line-clamp-3 dark:text-gray-400">
            {excerpt}
          </p>
        ) : null}
        <LibraryTagsGrouped
          tags={tagPaths}
          className={CARD_TAGS_CLASS}
          onTagPathSelect={onLibraryTagPathSelect}
        />
      </div>
    </Link>
  );
}

/** Log card with hero / first-body image; same vertical shell as projects/journals. */
function LogCardWithImage({
  item,
  href,
  imageSrc,
  hoverGifSrc,
}: {
  item: TabItem;
  href: string;
  imageSrc: string;
  hoverGifSrc?: string | null;
}) {
  const description = getExcerpt(item, 160);

  return (
    <Link href={href} className={LANDING_IMAGE_CARD_LINK}>
      <div className="p-3 pb-0">
        <div className="relative w-full shrink-0 overflow-hidden rounded-xl bg-primary-gray/60 dark:bg-zinc-800/90">
          <ImageCornerKindLabel type="log" />
          <ImageCornerSysId publishedAt={item.publishedAt} slug={item.slug} />
          <ProjectCardMedia
            displaySrc={imageSrc}
            hoverGifSrc={hoverGifSrc}
            alt=""
            sizes="(max-width: 768px) 100vw, 33vw"
            naturalAspect
            imgClassName={LANDING_CARD_IMAGE_MEDIA_CLASSES}
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <h3 className="font-semibold text-primary-black dark:text-textDark text-base leading-snug line-clamp-2">
          {formatCardHeading(item.title)}
        </h3>
        {description ? (
          <p className="mt-1.5 text-sm leading-relaxed text-gray-500 line-clamp-2 dark:text-gray-400">
            {description}
          </p>
        ) : null}
        <time dateTime={item.publishedAt} className="sr-only">
          {formatDate(item.publishedAt) || item.publishedAt}
        </time>
      </div>
    </Link>
  );
}

function LandingItemListRow({
  item,
  type,
  href,
}: {
  item: TabItem;
  type: TabItemType;
  href: string;
}) {
  const dateStr = formatDate(item.publishedAt);

  return (
    <Link
      href={href}
      className={LIST_ROW_LINK_CLASS}
      aria-label={`${formatCardHeading(item.title)} — ${type}`}
    >
      <span className="flex min-w-0 flex-1 items-center">
        <span className="min-w-0 truncate text-lg font-normal text-primary-black dark:text-textDark">
          {formatCardHeading(item.title)}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2 text-right">
        <ListTypeIconOnly type={type} />
        {dateStr ? (
          <time
            dateTime={item.publishedAt}
            className="text-sm tabular-nums leading-6 text-gray-500 dark:text-gray-400"
          >
            {dateStr}
          </time>
        ) : null}
        <ChevronRight
          className="size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 dark:text-zinc-400"
          aria-hidden
        />
      </span>
    </Link>
  );
}

/** Log card: text-only when there is no preview image. */
function LogCard({ item, href }: { item: TabItem; href: string }) {
  const excerpt = getExcerpt(item);

  return (
    <Link href={href} className={LANDING_IMAGE_CARD_LINK}>
      <TextCardTopChrome
        type="log"
        publishedAt={item.publishedAt}
        slug={item.slug}
      />
      <div className="flex flex-1 flex-col px-4 pb-4 pt-4">
        <h3 className="font-semibold text-primary-black dark:text-textDark text-base leading-snug line-clamp-2">
          {formatCardHeading(item.title)}
        </h3>
        {excerpt ? (
          <p className="mt-1.5 text-sm leading-relaxed text-gray-500 line-clamp-3 dark:text-gray-400">
            {excerpt}
          </p>
        ) : null}
        <time dateTime={item.publishedAt} className="sr-only">
          {formatDate(item.publishedAt) || item.publishedAt}
        </time>
      </div>
    </Link>
  );
}

export default function LandingItemCard({
  item,
  type,
  layout = "grid",
  onLibraryTagPathSelect,
}: LandingItemCardProps) {
  const href = getHref(type, item.slug);

  if (layout === "list") {
    return <LandingItemListRow item={item} type={type} href={href} />;
  }

  if (type === "project") {
    const meta = (item.metadata ?? {}) as Record<string, unknown>;
    const filePath =
      "filePath" in item && typeof item.filePath === "string"
        ? item.filePath
        : undefined;
    const { displayUrl, hoverGifUrl } = getProjectCardMediaUrls(meta, filePath);
    if (!displayUrl) {
      return (
        <ProjectCardDefault
          item={item}
          href={href}
          onLibraryTagPathSelect={onLibraryTagPathSelect}
        />
      );
    }
    return (
      <ProjectCardWithImage
        item={item}
        href={href}
        imageSrc={displayUrl}
        hoverGifSrc={hoverGifUrl}
        onLibraryTagPathSelect={onLibraryTagPathSelect}
      />
    );
  }

  if (type === "journal") {
    return (
      <JournalCardWithImage
        item={item}
        href={href}
        onLibraryTagPathSelect={onLibraryTagPathSelect}
      />
    );
  }

  const logImageUrl = getSharedCardDisplayUrl(item);
  if (logImageUrl) {
    return (
      <LogCardWithImage
        item={item}
        href={href}
        imageSrc={logImageUrl}
        hoverGifSrc={getSharedCardHoverGifUrl(item)}
      />
    );
  }
  return <LogCard item={item} href={href} />;
}
