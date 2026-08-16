"use client";

import Image from "next/image";
import {
  formatCardHeading,
  markdownBodyToCardPlainText,
  stripMarkdownMediaEmbeds,
  stripObsidianWikiLinksForPreview,
} from "@/lib/markdown-to-card-plain-text";
import {
  getJournalCardMediaUrls,
  getLogCardMediaUrls,
  getProjectCardMediaUrls,
} from "@/lib/project-card-images";
import type { Journal } from "@/queries/journals";
import type { Post as LogPost } from "@/queries/logs";
import type { Post as ProjectPost } from "@/queries/projects";

export type TabItemType = "journal" | "log" | "project";

export type TabItem = (Journal | LogPost | ProjectPost) & {
  description?: string;
};

function getExcerpt(item: TabItem, maxLength = 200): string {
  const desc = (item.metadata as Record<string, unknown> | undefined)?.description;
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

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

const TYPE_LABELS: Record<TabItemType, string> = {
  journal: "Journal",
  log: "Log",
  project: "Project",
};

interface HoverPreviewCardProps {
  item: TabItem;
  type: TabItemType;
  variant?: "card" | "full";
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function HoverPreviewCard({
  item,
  type,
  variant = "card",
  onMouseEnter,
  onMouseLeave,
}: HoverPreviewCardProps) {
  const excerpt = getExcerpt(item);
  const meta = (item.metadata ?? {}) as Record<string, unknown>;
  const imageSrc = (() => {
    if (type === "journal") {
      return getJournalCardMediaUrls(meta).displayUrl;
    }
    if (type === "log") {
      return getLogCardMediaUrls(meta).displayUrl;
    }
    const filePath =
      "filePath" in item && typeof item.filePath === "string"
        ? item.filePath
        : undefined;
    return getProjectCardMediaUrls(meta, filePath).displayUrl;
  })();
  const tags = item.tags?.slice(0, 4) ?? [];
  const publishedLabel = formatDate(item.publishedAt);

  const isFull = variant === "full";

  return (
    <article
      className={
        isFull
          ? "flex flex-col min-h-0 flex-1 animate-fade-in"
          : "rounded-sm overflow-hidden bg-primary-white dark:bg-zinc-900 border border-[#eeeeee] dark:border-zinc-700 shadow-sm flex flex-col min-h-0 animate-fade-in"
      }
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {imageSrc ? (
        <div
          className={
            isFull
              ? "relative w-full min-h-[55vh] bg-primary-gray dark:bg-zinc-800 shrink-0"
              : type === "journal"
                ? "relative w-full shrink-0 bg-primary-gray dark:bg-zinc-800"
                : "relative w-full aspect-[4/3] bg-primary-gray dark:bg-zinc-800 shrink-0"
          }
        >
          {type === "journal" && !isFull ? (
            <Image
              src={imageSrc}
              alt=""
              width={1600}
              height={1067}
              className="h-auto w-full dark:brightness-[0.88] dark:contrast-[1.05]"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized
            />
          ) : (
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-cover dark:brightness-[0.88] dark:contrast-[1.05]"
              sizes={
                isFull
                  ? "(max-width: 768px) 100vw, 50vw"
                  : "(max-width: 768px) 100vw, 33vw"
              }
              unoptimized
            />
          )}
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium bg-primary-white/90 dark:bg-zinc-900/90 text-primary-black dark:text-textDark">
            {TYPE_LABELS[type]}
          </span>
        </div>
      ) : (
        <div className="shrink-0 border-b border-gray-200/90 px-4 py-3 dark:border-gray-600/50">
          <span className="inline-block rounded px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-primary-black dark:text-textDark">
            {TYPE_LABELS[type]}
          </span>
        </div>
      )}
      <div
        className={
          isFull
            ? "pt-3 flex flex-col gap-1 min-w-0 shrink-0"
            : "p-4 flex flex-col gap-2 min-w-0"
        }
      >
        <h3
          className={
            isFull
              ? "font-medium text-primary-black dark:text-textDark text-base line-clamp-1"
              : "font-medium text-primary-black dark:text-textDark text-sm line-clamp-1"
          }
        >
          {formatCardHeading(item.title)}
        </h3>
        {excerpt ? (
          <p
            className={
              isFull
                ? "text-gray-600 dark:text-gray-400 text-sm line-clamp-2 leading-relaxed"
                : "text-gray-600 dark:text-gray-400 text-xs line-clamp-3 leading-relaxed"
            }
          >
            {excerpt}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
          {publishedLabel ? (
            <time dateTime={item.publishedAt}>{publishedLabel}</time>
          ) : null}
          {tags.length > 0 ? (
            <span className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span key={tag} className="rounded bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5">
                  {tag}
                </span>
              ))}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
