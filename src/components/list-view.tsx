"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import {
  FiArrowRight,
  FiRepeat,
  FiLink,
  FiImage,
  FiFileText,
  FiFile,
  FiPlay,
  FiCamera,
} from "react-icons/fi";

interface ListViewProps {
  data: any[];
  variant?: "feed" | "default";
}

export default function ListView({ data, variant = "default" }: ListViewProps) {
  const formatDateDisplay = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "Unknown Date";
    }

    return date.toLocaleDateString(undefined, { timeZone: "UTC" });
  };

  const renderItem = (item: any, index: number) => {
    // For debugging
    // console.log(`Item ${index}:`, item);
    // console.log(`Item ${index} type:`, item.type);
    // console.log(`Item ${index} publishedAt:`, item.publishedAt);

    // Helper function to sanitize type by removing Obsidian-style brackets
    // and normalizing plural forms to singular for routing consistency
    const sanitizeType = (type: string): string => {
      let sanitized = type
        .toLowerCase()
        .replace(/\[\[/g, "")
        .replace(/\]\]/g, "")
        .trim();
      
      // Normalize plural forms to singular for routing
      const pluralToSingular: { [key: string]: string } = {
        "logs": "log",
        "journals": "journal",
        "projects": "project",
        "notes": "note",
        "fragments": "fragment",
        "studies": "study",
        "systems": "system",
        "researches": "research",
      };
      
      return pluralToSingular[sanitized] || sanitized;
    };

    // Determine item type
    let itemType = "default";
    if (item.type && typeof item.type === "string") {
      itemType = sanitizeType(item.type);
    }

    if (Array.isArray(item.metadata?.type) && item.metadata.type.length > 0) {
      itemType = sanitizeType(item.metadata.type[0]);
    } else if (
      typeof item.metadata?.type === "string" &&
      item.metadata.type.length > 0
    ) {
      itemType = sanitizeType(item.metadata.type);
    }

    const linkPath =
      itemType === "bluesky" || itemType.startsWith("arena")
        ? item.uri // Use the URI for Bluesky posts and Are.na blocks
        : itemType === "photography" && item.links?.html
        ? item.links.html // Use the Unsplash link for photos
        : itemType === "project"
        ? `/project/${item.slug}` // Use /project/ for projects
        : itemType === "note"
        ? `/note/${item.slug}` // Use /note/ for notes
        : itemType === "research"
        ? `/research/${item.slug}` // Use /research/ for research
        : itemType === "journal"
        ? `/journal/${item.slug}` // Use /journal/ for journals
        : itemType === "fragment"
        ? `/fragment/${item.slug}` // Use /fragment/ for fragments
        : itemType === "log"
        ? `/log/${item.slug}` // Use /log/ for logs
        : itemType === "study"
        ? `/study/${item.slug}` // Use /study/ for studies
        : itemType === "system"
        ? `/system/${item.slug}` // Use /system/ for systems
        : `/${itemType}/${item.slug}`; // Use the slug for other content types

    // Define grid column spans for different content types
    const gridColumnSpan: { [key: string]: string } = {
      newsletter:
        variant === "feed"
          ? "col-span-12 md:col-span-6 lg:col-span-6"
          : "col-span-12",
      log:
        variant === "feed"
          ? "col-span-12 md:col-span-6 lg:col-span-6"
          : "col-span-12 lg:col-span-6",
      note:
        variant === "feed"
          ? "col-span-12 md:col-span-6 lg:col-span-6"
          : "col-span-12",
      project:
        variant === "feed"
          ? "col-span-12 md:col-span-6 lg:col-span-6"
          : "col-span-12 lg:col-span-6",
      journal:
        variant === "feed"
          ? "col-span-12 md:col-span-6 lg:col-span-6"
          : "col-span-12 lg:col-span-6",
      research:
        variant === "feed"
          ? "col-span-12 md:col-span-6 lg:col-span-6"
          : "col-span-12",
      photography: "col-span-12 md:col-span-3 lg:col-span-3",
      bluesky: "col-span-12 md:col-span-3 lg:col-span-3",
      arena: "col-span-12 md:col-span-3 lg:col-span-3",
      "arena-image": "col-span-12 md:col-span-3 lg:col-span-3",
      "arena-text": "col-span-12 md:col-span-3 lg:col-span-3",
      "arena-link": "col-span-12 md:col-span-3 lg:col-span-3",
      "arena-attachment": "col-span-12 md:col-span-3 lg:col-span-3",
      "arena-media": "col-span-12 md:col-span-3 lg:col-span-3",
      github: "col-span-12 md:col-span-3 lg:col-span-3",
      default:
        variant === "feed"
          ? "col-span-12 md:col-span-6 lg:col-span-6"
          : "col-span-12",
    };

    // Define height classes for different content types
    const heightClass: { [key: string]: string } = {
      newsletter: "min-h-[200px]",
      log: "min-h-[200px]",
      note: "min-h-[200px]",
      journal: "min-h-[200px]",
      research: "min-h-[200px]",
      photography: "min-h-[180px]",
      project: "min-h-[200px]",
      bluesky: "min-h-[180px]",
      arena: "min-h-[180px]",
      "arena-image": "min-h-[180px]",
      "arena-text": "min-h-[120px]",
      "arena-link": "min-h-[120px]",
      "arena-attachment": "min-h-[120px]",
      "arena-media": "min-h-[180px]",
      github: "min-h-[120px]",
      default: "min-h-[200px]",
    };

    // Determine the appropriate class based on item type
    const itemColSpan = gridColumnSpan[itemType] || gridColumnSpan.default;
    const itemHeight = heightClass[itemType] || heightClass.default;

    // Render different card types based on item type
    if (itemType === "bluesky") {
      // Only show author if not gndclouds.earth
      const isOwner = item.author?.handle === "gndclouds.earth";
      const postBody = item.text || item.description || "";
      return (
        <div
          key={index}
          className={`${itemColSpan} border-2 border-blue-300 dark:border-blue-500 relative p-2 ${itemHeight} group hover:border-blue-500 dark:hover:border-blue-300 bg-blue-50 dark:bg-blue-900/20`}
        >
          {/* Repost indicator */}
          {item.isRepost && (
            <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full">
              <FiRepeat size={12} />
            </div>
          )}

          <a
            href={item.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
          >
            {/* Only show author/avatar if not owner */}
            {!isOwner && (
              <div className="flex items-center mb-1">
                {item.author?.avatar && (
                  <div className="w-5 h-5 rounded-full overflow-hidden mr-1">
                    <Image
                      src={item.author.avatar}
                      alt={item.author.handle}
                      width={20}
                      height={20}
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="text-xs font-medium truncate">
                  {item.author?.displayName || item.author?.handle || "Unknown"}
                  {item.isRepost && (
                    <span className="ml-1 text-blue-500 flex items-center text-xs">
                      <FiRepeat className="inline mr-1" size={10} />
                      repost
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className="text-xs line-clamp-2 mb-1">{postBody}</div>
            {item.images && item.images.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-1">
                {item.images.map(
                  (image: { alt: string; url: string }, idx: number) => (
                    <div key={idx} className="relative aspect-square">
                      <Image
                        src={image.url}
                        alt={image.alt || "Post image"}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )
                )}
              </div>
            )}
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-auto">
              <div className="text-[10px]">
                {String(item.publishedAt || "")}
              </div>
              <div className="flex space-x-2 text-[10px]">
                <span>♥ {item.likeCount}</span>
                <span>↻ {item.repostCount}</span>
              </div>
            </div>
          </a>
        </div>
      );
    }

    // Are.na content rendering
    if (itemType.startsWith("arena")) {
      // Determine the icon based on the specific arena type
      let TypeIcon = FiFile;
      if (itemType === "arena-image") TypeIcon = FiImage;
      if (itemType === "arena-text") TypeIcon = FiFileText;
      if (itemType === "arena-link") TypeIcon = FiLink;
      if (itemType === "arena-media") TypeIcon = FiPlay;

      // For image blocks, show the image
      if (item.imageUrl) {
        return (
          <div
            key={index}
            className={`${itemColSpan} border-2 border-gray-300 dark:border-gray-600 relative ${itemHeight} group hover:border-gray-500 dark:hover:border-gray-400 overflow-hidden`}
          >
            <a
              href={item.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full"
            >
              <div className="absolute inset-0">
                <Image
                  src={item.imageUrl}
                  alt={item.title || "Are.na image"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs truncate">{item.title}</div>
                  <div className="text-[10px] bg-gray-800 px-1 rounded">
                    {item.channel?.title || "Are.na"}
                  </div>
                </div>
              </div>
            </a>
          </div>
        );
      }

      // For other Are.na blocks
      return (
        <div
          key={index}
          className={`${itemColSpan} border-2 border-gray-300 dark:border-gray-600 relative p-2 ${itemHeight} group hover:border-gray-500 dark:hover:border-gray-400 bg-gray-50 dark:bg-gray-900/20`}
        >
          <a
            href={item.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <TypeIcon size={12} className="mr-1 text-gray-500" />
                <div className="text-xs font-medium truncate">
                  {item.author?.username || "Unknown"}
                </div>
              </div>
              <div className="text-[10px] bg-gray-200 dark:bg-gray-700 px-1 rounded">
                {item.channel?.title || "Are.na"}
              </div>
            </div>
            <div className="text-sm font-medium mb-1 truncate">
              {item.title}
            </div>
            <div className="text-xs line-clamp-2 mb-1">
              {item.description || item.content || ""}
            </div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-auto">
              {new Date(item.publishedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </div>
          </a>
        </div>
      );
    }

    if (itemType === "photography") {
      // Unsplash image card with no description overlay
      return (
        <div
          key={index}
          className={`${itemColSpan} border-2 border-gray-300 dark:border-gray-600 relative ${itemHeight} group hover:border-gray-500 dark:hover:border-gray-400 overflow-hidden`}
        >
          <a
            href={linkPath}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
          >
            {item.urls && (
              <div className="absolute inset-0">
                <Image
                  src={item.urls.regular || item.urls.small}
                  alt={item.alt_description || "Unsplash photo"}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 flex justify-end">
              <div className="text-[10px]">
                {String(item.publishedAt || "")}
              </div>
            </div>
          </a>
        </div>
      );
    }

    if (itemType === "newsletter") {
      return (
        <div
          key={index}
          className={`${itemColSpan} border-2 border-backgroundDark dark:border-backgroundLight relative p-4 ${itemHeight} group hover:border-backgroundDark dark:hover:border-backgroundLight`}
        >
          {" "}
          <div className="absolute top-0 left-0 p-2">
            <span className="bg-gray-200 text-gray-800 text-xs font-bold uppercase px-2 py-1">
              #newsletter
            </span>
          </div>
          <div className="absolute top-0 right-0 p-2">
            <span className="text-sm">
              {new Date(item.publishedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex-1 p-4 pt-8">
            <h2 className="text-2xl">
              <Link href={linkPath}>{item.title}</Link>
            </h2>
          </div>
        </div>
      );
    }

    // Add GitHub activity rendering
    if (itemType === "github") {
      // Only show author if not gndclouds
      const isOwner = item.author?.username === "gndclouds";
      return (
        <div
          key={index}
          className={`${itemColSpan} border-2 border-gray-300 dark:border-gray-600 relative p-2 ${itemHeight} group hover:border-gray-500 dark:hover:border-gray-400 bg-gray-50 dark:bg-gray-900/20`}
        >
          <a
            href={item.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
          >
            {/* Only show author/avatar if not owner */}
            {!isOwner && (
              <div className="flex items-center mb-1">
                {item.author?.avatar && (
                  <div className="w-5 h-5 rounded-full overflow-hidden mr-1">
                    <Image
                      src={item.author.avatar}
                      alt={item.author.username}
                      width={20}
                      height={20}
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="text-xs font-medium truncate">
                  {item.author?.username || "Unknown"}
                </div>
              </div>
            )}
            <div className="text-sm font-medium mb-1 truncate">
              {item.title}
            </div>
            <div className="text-xs line-clamp-2 mb-1">{item.description}</div>
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-auto">
              <div className="text-[10px]">
                {new Date(item.publishedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="text-[10px] bg-gray-200 dark:bg-gray-700 px-1 rounded">
                GitHub
              </div>
            </div>
          </a>
        </div>
      );
    }

    // Add local content rendering
    if (
      itemType === "journal" ||
      itemType === "note" ||
      itemType === "research" ||
      itemType === "project"
    ) {
      return (
        <div
          key={index}
          className={`${itemColSpan} border-2 border-backgroundDark dark:border-backgroundLight relative p-4 ${itemHeight} group hover:border-backgroundDark dark:hover:border-backgroundLight`}
        >
          <Link href={linkPath} className="block h-full">
            <div className="flex flex-col h-full">
              <h2 className="text-2xl font-bold mb-1 truncate">{item.title}</h2>
              <div className="text-xs text-gray-500 mb-2">
                {item.publishedAt
                  ? formatDateDisplay(item.publishedAt)
                  : "Unknown Date"}
              </div>
              {item.description && (
                <div className="text-sm mt-2 line-clamp-2">
                  {item.description}
                </div>
              )}
              {(item.tags?.length > 0 || item.categories?.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-auto pt-2">
                  {[...(item.tags || []), ...(item.categories || [])].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="border-2 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 text-xs uppercase hover:bg-gray-200 dark:hover:bg-gray-700/40 hover:text-gray-900 dark:hover:text-gray-100"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          </Link>
        </div>
      );
    }

    // Default card for other content types (log, note, project, etc.)
    return (
      <div
        key={index}
        className={`${itemColSpan} ${
          variant === "feed"
            ? ""
            : "border-2 border-backgroundDark dark:border-backgroundLight"
        } relative p-4 ${itemHeight} group ${
          variant === "feed"
            ? ""
            : "hover:border-backgroundDark dark:hover:border-backgroundLight"
        }`}
      >
        <Link href={linkPath} className="">
          <div className="text-sm slashed-zero lining-nums">
            {item.publishedAt
              ? new Date(item.publishedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                })
              : "Unknown Date"}
          </div>
          <div className="flex flex-row justify-between text-[2vw] md:text-[1.5vw] lg:text-[1vw] font-medium">
            <h2 className="truncate">{item.title}</h2>
            <FiArrowRight className="flex-shrink-0" />
          </div>
          {itemType === "project" && (
            <div className="text-sm mt-2">
              {item.metadata?.description || "No description available"}
            </div>
          )}
        </Link>
        {(itemType === "log" ||
          itemType === "note" ||
          itemType === "research") &&
          item.tags && (
            <div className="flex flex-wrap gap-2 p-2 mt-2">
              {item.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/tag/${tag}`}
                  className="border-2 border-backgroundDark dark:border-backgroundLight dark:hover:bg-backgroundLight hover:bg-backgroundDark dark:hover:text-textLight hover:text-textDark px-3 py-1 text-sm uppercase"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
      </div>
    );
  };

  // Helper to get year from publishedAt
  const getYear = (item: any) => {
    if (!item.publishedAt) return "";
    
    try {
      // If it's already a string, try to extract year
      if (typeof item.publishedAt === "string") {
        // Handle ISO format: "2025-02-03T01:00:00" or "2025-02-03"
        const yearMatch = item.publishedAt.match(/^(\d{4})/);
        if (yearMatch) {
          return yearMatch[1];
        }
      }
      
      // If it's a Date object or can be converted to one
      const date = new Date(item.publishedAt);
      if (!isNaN(date.getTime())) {
        return date.getFullYear().toString();
      }
    } catch (error) {
      console.warn("Error extracting year from publishedAt:", item.publishedAt);
    }
    
    return "";
  };

  let lastYear: string | null = null;

  return (
    <div className="grid grid-cols-12 gap-4">
      {data.map((item, index) => {
        const itemYear = getYear(item);
        const showYearBreak = itemYear && itemYear !== lastYear;
        if (itemYear) {
          lastYear = itemYear;
        }
        return (
          <React.Fragment key={item.id || index}>
            {showYearBreak && variant !== "feed" && (
              <div className="col-span-12 flex items-center my-8">
                <hr className="flex-grow border-t border-gray-300 dark:border-gray-700 mr-4" />
                <span className="text-lg font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {itemYear}
                </span>
                <hr className="flex-grow border-t border-gray-300 dark:border-gray-700 ml-4" />
              </div>
            )}
            {renderItem(item, index)}
          </React.Fragment>
        );
      })}
    </div>
  );
}
