"use client";

import Image from "next/image";
import type { Journal } from "@/queries/journals";
import type { Post as LogPost } from "@/queries/logs";
import type { Post as ProjectPost } from "@/queries/projects";

export type TabItemType = "journal" | "log" | "project";

export type TabItem = (Journal | LogPost | ProjectPost) & {
  description?: string;
};

/** Strip HTML tags or reduce markdown to plain text for excerpt. */
function toPlainExcerpt(raw: string): string {
  if (typeof document !== "undefined") {
    const div = document.createElement("div");
    div.innerHTML = raw;
    const text = div.textContent ?? div.innerText ?? "";
    if (text.trim()) return text;
  }
  return raw
    .replace(/<[^>]*>/g, "")
    .replace(/^#+\s*/gm, "")
    .replace(/\*+([^*]*)\*+/g, "$1")
    .replace(/_+([^_]*)_+/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function getExcerpt(item: TabItem, maxLength = 200): string {
  const fromMeta =
    item.description ??
    (typeof (item.metadata as { description?: string })?.description ===
    "string"
      ? (item.metadata as { description: string }).description
      : null);
  if (fromMeta) return fromMeta.slice(0, maxLength);
  const raw = item.metadata?.contentHtml;
  if (typeof raw !== "string") return "";
  return toPlainExcerpt(raw).slice(0, maxLength);
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
  const imageSummary = excerpt.slice(0, 150) || item.title;
  const imageSrc = `/api/journals/hero-image?summary=${encodeURIComponent(imageSummary)}`;
  const tags = item.tags?.slice(0, 4) ?? [];
  const publishedLabel = formatDate(item.publishedAt);

  const isFull = variant === "full";

  return (
    <article
      className={
        isFull
          ? "flex flex-col min-h-0 flex-1 animate-fade-in"
          : "rounded-2xl overflow-hidden bg-primary-white border border-[#eeeeee] shadow-sm flex flex-col min-h-0 animate-fade-in"
      }
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={
          isFull
            ? "relative w-full min-h-[55vh] bg-primary-gray shrink-0"
            : "relative w-full aspect-[4/3] bg-primary-gray shrink-0"
        }
      >
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover"
          sizes={
            isFull
              ? "(max-width: 1024px) 100vw, 50vw"
              : "(max-width: 1024px) 100vw, 33vw"
          }
          unoptimized
        />
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium bg-primary-white/90 text-primary-black">
          {TYPE_LABELS[type]}
        </span>
      </div>
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
              ? "font-medium text-primary-black text-base line-clamp-1"
              : "font-medium text-primary-black text-sm line-clamp-1"
          }
        >
          {item.title}
        </h3>
        {excerpt ? (
          <p
            className={
              isFull
                ? "text-gray-600 text-sm line-clamp-2 leading-relaxed"
                : "text-gray-600 text-xs line-clamp-3 leading-relaxed"
            }
          >
            {excerpt}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
          {publishedLabel ? (
            <time dateTime={item.publishedAt}>{publishedLabel}</time>
          ) : null}
          {tags.length > 0 ? (
            <span className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span key={tag} className="rounded bg-gray-100 px-1.5 py-0.5">
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
