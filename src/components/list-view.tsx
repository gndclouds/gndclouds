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
}

export default function ListView({ data }: { data: any[] }) {
  const renderItem = (item: any, index: number) => {
    // For debugging
    // console.log(`Item ${index}:`, item);
    // console.log(`Item ${index} type:`, item.type);
    // console.log(`Item ${index} publishedAt:`, item.publishedAt);

    // Determine item type
    let itemType = "default";
    if (item.type && typeof item.type === "string") {
      itemType = item.type.toLowerCase();
    }

    if (Array.isArray(item.metadata?.type) && item.metadata.type.length > 0) {
      itemType = item.metadata.type[0].toLowerCase();
    } else if (
      typeof item.metadata?.type === "string" &&
      item.metadata.type.length > 0
    ) {
      itemType = item.metadata.type.toLowerCase();
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
        : `/${itemType}/${item.slug}`; // Use the slug for other content types

    // Define grid column spans for different content types
    const gridColumnSpan: { [key: string]: string } = {
      newsletter: "col-span-12 md:col-span-6 lg:col-span-6",
      log: "col-span-12 md:col-span-6 lg:col-span-6",
      note: "col-span-12 md:col-span-6 lg:col-span-6",
      photography: "col-span-12 md:col-span-3 lg:col-span-3", // Make photos same size as Bluesky
      project: "col-span-12 md:col-span-6 lg:col-span-6",
      bluesky: "col-span-12 md:col-span-3 lg:col-span-3", // Smaller span for Bluesky posts (4 across in a 12-column grid)
      arena: "col-span-12 md:col-span-3 lg:col-span-3", // Same size as Bluesky for Are.na content
      "arena-image": "col-span-12 md:col-span-3 lg:col-span-3",
      "arena-text": "col-span-12 md:col-span-3 lg:col-span-3",
      "arena-link": "col-span-12 md:col-span-3 lg:col-span-3",
      "arena-attachment": "col-span-12 md:col-span-3 lg:col-span-3",
      "arena-media": "col-span-12 md:col-span-3 lg:col-span-3",
      github: "col-span-12 md:col-span-3 lg:col-span-3", // Same size as Bluesky for GitHub activity
      default: "col-span-12 md:col-span-6 lg:col-span-6",
    };

    // Define height classes for different content types
    const heightClass: { [key: string]: string } = {
      newsletter: "min-h-[200px]",
      log: "min-h-[200px]",
      note: "min-h-[200px]",
      photography: "min-h-[180px]", // Taller for photos, same as arena-image
      project: "min-h-[200px]",
      bluesky: "min-h-[120px]", // Even smaller height for Bluesky posts
      arena: "min-h-[180px]", // Same height as arena-image for consistency
      "arena-image": "min-h-[180px]", // Taller for images
      "arena-text": "min-h-[120px]",
      "arena-link": "min-h-[120px]",
      "arena-attachment": "min-h-[120px]",
      "arena-media": "min-h-[180px]", // Taller for media
      github: "min-h-[120px]", // Same height as Bluesky posts
      default: "min-h-[200px]",
    };

    // Determine the appropriate class based on item type
    const itemColSpan = gridColumnSpan[itemType] || gridColumnSpan.default;
    const itemHeight = heightClass[itemType] || heightClass.default;

    // Render different card types based on item type
    if (itemType === "bluesky") {
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
            <div className="text-xs line-clamp-2 mb-1">{item.text}</div>
            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-auto">
              <div className="text-[10px]">
                {new Date(item.publishedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
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
      if (itemType === "arena-image" && item.imageUrl) {
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
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs truncate">{item.title}</div>
                  <div className="text-[10px] bg-gray-800 px-1 rounded">
                    {item.channelTitle}
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
                {item.channelTitle}
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
      // Enhanced Unsplash image card
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
                  alt={
                    item.description || item.alt_description || "Unsplash photo"
                  }
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FiCamera size={12} className="mr-1" />
                  <div className="text-xs truncate">
                    {item.description ||
                      item.alt_description ||
                      "Unsplash photo"}
                  </div>
                </div>
                <div className="text-[10px]">
                  {new Date(item.publishedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
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

    // Default card for other content types (log, note, project, etc.)
    return (
      <div
        key={index}
        className={`${itemColSpan} border-2 border-backgroundDark dark:border-backgroundLight relative p-4 ${itemHeight} group hover:border-backgroundDark dark:hover:border-backgroundLight`}
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

  return (
    <div className="grid grid-cols-12 gap-4">
      {data.map((item, index) => renderItem(item, index))}
    </div>
  );
}
