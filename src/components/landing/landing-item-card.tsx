"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, FolderKanban, ScrollText, ChevronRight } from "lucide-react";
import type { TabItemType } from "@/components/landing/hover-preview-card";
import type { TabItem } from "@/components/landing/hover-preview-card";

/** Single border radius for all card types so image and text cards match. */
const CARD_ROUNDED = "rounded-xl";

const TYPE_CONFIG: Record<
  TabItemType,
  { label: string; Icon: typeof BookOpen; color: string }
> = {
  journal: { label: "Journal", Icon: BookOpen, color: "#fadc4b" },
  project: { label: "Project", Icon: FolderKanban, color: "#0068e2" },
  log: { label: "Log", Icon: ScrollText, color: "#ff6622" },
};

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

/** Resolve project hero image URL (frontmatter heroImage). */
function getProjectImageUrl(item: TabItem): string | null {
  const raw =
    (item.metadata as Record<string, unknown> | undefined)?.heroImage ?? "";
  const candidate =
    typeof raw === "string" ? raw.trim() : "";
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

interface LandingItemCardProps {
  item: TabItem;
  type: TabItemType;
}

/** Project card: full-bleed image, no date; hover overlay shows title + description. */
function ProjectCardWithImage({
  item,
  href,
  imageSrc,
}: {
  item: TabItem;
  href: string;
  imageSrc: string;
}) {
  const description = getExcerpt(item, 160);

  return (
    <Link
      href={href}
      className={`group relative block aspect-[4/3] w-full overflow-hidden ${CARD_ROUNDED} bg-primary-white`}
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
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
  const config = TYPE_CONFIG.project;

  return (
    <Link
      href={href}
      className={`group flex flex-col ${CARD_ROUNDED} overflow-hidden bg-primary-white p-6 min-h-[120px] transition-colors duration-200 hover:bg-gray-50/50`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className="inline-flex items-center gap-1.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium text-gray-600"
          style={{ backgroundColor: `${config.color}20` }}
        >
          <config.Icon size={12} style={{ color: config.color }} aria-hidden />
          {config.label}
        </span>
        <ChevronRight className="size-4 shrink-0 text-gray-300 transition-colors group-hover:text-gray-500" aria-hidden />
      </div>
      <h3 className="font-medium text-primary-black text-sm sm:text-base line-clamp-2 leading-snug mb-1">
        {item.title}
      </h3>
      {excerpt ? (
        <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 leading-relaxed flex-1">
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
      className={`group flex flex-col ${CARD_ROUNDED} overflow-hidden bg-primary-white transition-colors duration-200 hover:bg-gray-50/50`}
    >
      {/* Placeholder for future preview image */}
      <div
        className="relative w-full aspect-square shrink-0 bg-gray-200 rounded-t-xl"
        aria-hidden
      />
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-medium text-primary-black text-sm sm:text-base line-clamp-2 leading-snug mt-1">
          {item.title}
        </h3>
        {dateStr ? (
          <time
            dateTime={item.publishedAt}
            className="text-xs text-gray-400 tabular-nums mt-2"
          >
            {dateStr}
          </time>
        ) : null}
      </div>
    </Link>
  );
}

/** Log card: unchanged from original style. */
function LogCard({ item, href }: { item: TabItem; href: string }) {
  const config = TYPE_CONFIG.log;
  const dateStr = formatDate(item.publishedAt);
  const excerpt = getExcerpt(item);

  return (
    <Link
      href={href}
      className={`group flex flex-col ${CARD_ROUNDED} overflow-hidden bg-primary-white p-6 min-h-[120px] transition-colors duration-200 hover:bg-gray-50/50`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className="inline-flex items-center gap-1.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium text-gray-600"
          style={{ backgroundColor: `${config.color}20` }}
        >
          <config.Icon size={12} style={{ color: config.color }} aria-hidden />
          {config.label}
        </span>
        <ChevronRight className="size-4 shrink-0 text-gray-300 transition-colors group-hover:text-gray-500" aria-hidden />
      </div>
      <h3 className="font-medium text-primary-black text-sm sm:text-base line-clamp-2 leading-snug mb-1">
        {item.title}
      </h3>
      {excerpt ? (
        <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 leading-relaxed flex-1">
          {excerpt}
        </p>
      ) : null}
      {dateStr ? (
        <time
          dateTime={item.publishedAt}
          className="text-xs text-gray-400 tabular-nums mt-2"
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
    const imageUrl = getProjectImageUrl(item);
    if (imageUrl) {
      return (
        <ProjectCardWithImage item={item} href={href} imageSrc={imageUrl} />
      );
    }
    return <ProjectCardDefault item={item} href={href} />;
  }

  if (type === "journal") {
    return <JournalCard item={item} href={href} />;
  }

  return <LogCard item={item} href={href} />;
}
