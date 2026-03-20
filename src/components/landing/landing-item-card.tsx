"use client";

import Link from "next/link";
import { BookOpen, Box, ScrollText, ChevronRight } from "lucide-react";
import ProjectCardMedia from "@/components/project-card-media";
import type { TabItemType } from "@/components/landing/hover-preview-card";
import type { TabItem } from "@/components/landing/hover-preview-card";

/** Single border radius for all card types so image and text cards match. */
const CARD_ROUNDED = "rounded-xl";

const TYPE_CONFIG: Record<
  TabItemType,
  { label: string; Icon: typeof BookOpen; color: string }
> = {
  journal: { label: "Journal", Icon: BookOpen, color: "#fadc4b" },
  project: { label: "Project", Icon: Box, color: "#0068e2" },
  log: { label: "Log", Icon: ScrollText, color: "#ff6622" },
};

function TypeIconBadge({
  type,
  className = "",
  plain = false,
}: {
  type: TabItemType;
  className?: string;
  /** No tinted circle — use when a parent supplies the backdrop. */
  plain?: boolean;
}) {
  const config = TYPE_CONFIG[type];
  return (
    <span
      className={`inline-flex size-7 shrink-0 items-center justify-center rounded-full ${className}`}
      style={plain ? undefined : { backgroundColor: `${config.color}24` }}
    >
      <config.Icon size={14} style={{ color: config.color }} aria-hidden />
      <span className="sr-only">{config.label}</span>
    </span>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${day}`;
  } catch {
    return "";
  }
}

function getExcerpt(item: TabItem, maxLength = 100): string {
  const desc = (item.metadata as Record<string, unknown> | undefined)
    ?.description;
  const fromMeta =
    item.description ?? (typeof desc === "string" ? desc : null);
  if (fromMeta) return fromMeta.slice(0, maxLength);
  const raw = item.metadata?.contentHtml;
  if (typeof raw !== "string") return "";
  const plain = raw
    .replace(/<[^>]*>/g, "")
    .replace(/^#+\s*/gm, "")
    .replace(/\*+([^*]*)\*+/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return plain.slice(0, maxLength);
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
}

/** Project card: full-bleed image, no date; hover overlay shows title + description. */
function ProjectCardWithImage({
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
  const imgTone = "object-cover dark:brightness-[0.88] dark:contrast-[1.05]";

  return (
    <Link
      href={href}
      className={`group relative block aspect-[4/3] w-full overflow-hidden ${CARD_ROUNDED} bg-primary-white dark:bg-zinc-900`}
    >
      <span className="absolute left-2 top-2 z-10 rounded-full bg-primary-white/92 p-0.5 shadow-sm dark:bg-zinc-900/92">
        <TypeIconBadge type="project" plain className="size-6" />
      </span>
      <div className="absolute inset-0 overflow-hidden">
        <ProjectCardMedia
          displaySrc={imageSrc}
          hoverGifSrc={hoverGifSrc}
          alt=""
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          className="transition-transform duration-300 group-hover:scale-105"
          imgClassName={imgTone}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <h3 className="font-semibold text-white text-sm sm:text-base line-clamp-2 drop-shadow-sm">
          {item.title}
        </h3>
        {description ? (
          <p className="mt-1 text-xs text-white/90 line-clamp-2 drop-shadow-sm">
            {description}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

/** Project card when no hero image: simple card (title + optional description). */
function ProjectCardDefault({ item, href }: { item: TabItem; href: string }) {
  const excerpt = getExcerpt(item);

  return (
    <Link
      href={href}
      className={`group flex flex-col ${CARD_ROUNDED} overflow-hidden bg-primary-white dark:bg-zinc-900 p-6 min-h-[120px] transition-colors duration-200 hover:bg-gray-50/50 dark:hover:bg-zinc-800/80`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <TypeIconBadge type="project" />
        <ChevronRight className="size-4 shrink-0 text-gray-300 dark:text-gray-500 transition-colors group-hover:text-gray-500 dark:group-hover:text-gray-400" aria-hidden />
      </div>
      <h3 className="font-medium text-primary-black dark:text-textDark text-sm sm:text-base line-clamp-2 leading-snug mb-1">
        {item.title}
      </h3>
      {excerpt ? (
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm line-clamp-2 leading-relaxed flex-1">
          {excerpt}
        </p>
      ) : null}
    </Link>
  );
}

/** Journal card: square image placeholder, title + date at bottom; slightly taller. */
function JournalCard({ item, href }: { item: TabItem; href: string }) {
  const dateStr = formatDate(item.publishedAt);

  return (
    <Link
      href={href}
      className={`group flex flex-col ${CARD_ROUNDED} overflow-hidden bg-primary-white dark:bg-zinc-900 transition-colors duration-200 hover:bg-gray-50/50 dark:hover:bg-zinc-800/80`}
    >
      {/* Placeholder for future preview image */}
      <div
        className="relative w-full aspect-square shrink-0 bg-gray-200 dark:bg-zinc-800 rounded-t-xl"
        aria-hidden
      />
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <TypeIconBadge type="journal" />
          <ChevronRight className="size-4 shrink-0 text-gray-300 dark:text-gray-500 transition-colors group-hover:text-gray-500 dark:group-hover:text-gray-400" aria-hidden />
        </div>
        <h3 className="font-medium text-primary-black dark:text-textDark text-sm sm:text-base line-clamp-2 leading-snug">
          {item.title}
        </h3>
        {dateStr ? (
          <time
            dateTime={item.publishedAt}
            className="text-xs text-gray-400 dark:text-zinc-500 tabular-nums mt-2"
          >
            {dateStr}
          </time>
        ) : null}
      </div>
    </Link>
  );
}

/** Log card with hero / first-body image; GIF defers to hover like projects. */
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
  const dateStr = formatDate(item.publishedAt);
  const description = getExcerpt(item, 160);
  const imgTone = "object-cover dark:brightness-[0.88] dark:contrast-[1.05]";

  return (
    <Link
      href={href}
      className={`group relative block aspect-[4/3] w-full overflow-hidden ${CARD_ROUNDED} bg-primary-white dark:bg-zinc-900`}
    >
      <span className="absolute left-2 top-2 z-10 rounded-full bg-primary-white/92 p-0.5 shadow-sm dark:bg-zinc-900/92">
        <TypeIconBadge type="log" plain className="size-6" />
      </span>
      <div className="absolute inset-0 overflow-hidden">
        <ProjectCardMedia
          displaySrc={imageSrc}
          hoverGifSrc={hoverGifSrc}
          alt=""
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          className="transition-transform duration-300 group-hover:scale-105"
          imgClassName={imgTone}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <h3 className="font-semibold text-white text-sm sm:text-base line-clamp-2 drop-shadow-sm">
          {item.title}
        </h3>
        {description ? (
          <p className="mt-1 text-xs text-white/90 line-clamp-2 drop-shadow-sm">
            {description}
          </p>
        ) : null}
        {dateStr ? (
          <time
            dateTime={item.publishedAt}
            className="mt-2 text-xs text-white/80 tabular-nums drop-shadow-sm"
          >
            {dateStr}
          </time>
        ) : null}
      </div>
    </Link>
  );
}

/** Log card: text-only when there is no preview image. */
function LogCard({ item, href }: { item: TabItem; href: string }) {
  const dateStr = formatDate(item.publishedAt);
  const excerpt = getExcerpt(item);

  return (
    <Link
      href={href}
      className={`group flex flex-col ${CARD_ROUNDED} overflow-hidden bg-primary-white dark:bg-zinc-900 p-6 min-h-[120px] transition-colors duration-200 hover:bg-gray-50/50 dark:hover:bg-zinc-800/80`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <TypeIconBadge type="log" />
        <ChevronRight className="size-4 shrink-0 text-gray-300 dark:text-gray-500 transition-colors group-hover:text-gray-500 dark:group-hover:text-gray-400" aria-hidden />
      </div>
      <h3 className="font-medium text-primary-black dark:text-textDark text-sm sm:text-base line-clamp-2 leading-snug mb-1">
        {item.title}
      </h3>
      {excerpt ? (
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm line-clamp-2 leading-relaxed flex-1">
          {excerpt}
        </p>
      ) : null}
      {dateStr ? (
        <time
          dateTime={item.publishedAt}
          className="text-xs text-gray-400 dark:text-zinc-500 tabular-nums mt-2"
        >
          {dateStr}
        </time>
      ) : null}
    </Link>
  );
}

export default function LandingItemCard({ item, type }: LandingItemCardProps) {
  const href = getHref(type, item.slug);

  if (type === "project") {
    const imageUrl = getSharedCardDisplayUrl(item);
    if (imageUrl) {
      return (
        <ProjectCardWithImage
          item={item}
          href={href}
          imageSrc={imageUrl}
          hoverGifSrc={getSharedCardHoverGifUrl(item)}
        />
      );
    }
    return <ProjectCardDefault item={item} href={href} />;
  }

  if (type === "journal") {
    return <JournalCard item={item} href={href} />;
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
