"use client";

import React, { useState, useEffect } from "react";
import {
  allNotes,
  allLogs,
  allProjects,
  allNewsletters,
} from "@/.contentlayer/generated";
import { compareDesc } from "date-fns";
import Link from "next/link";
import Pagination from "@/app/components/pagination";
import Search from "@/app/components/search";
import { useSearchParams } from "next/navigation";

// Define a type that encompasses all item types
type FeedItem =
  | (typeof allNotes)[number]
  | (typeof allLogs)[number]
  | (typeof allProjects)[number]
  | (typeof allNewsletters)[number];

function hasPublishedAt(item: { publishedAt?: any }): item is FeedItem {
  return item.publishedAt !== undefined;
}

export default function FeedPage() {
  const itemsPerPage = 10;
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("query") || "";

  const [allItems, setAllItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    let combinedItems: FeedItem[] = [
      ...allNotes,
      ...allLogs,
      ...allProjects,
      ...allNewsletters,
    ]
      .filter(hasPublishedAt)
      .sort((a, b) =>
        compareDesc(
          new Date(a.publishedAt || ""),
          new Date(b.publishedAt || "")
        )
      );

    if (searchQuery) {
      combinedItems = combinedItems.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setAllItems(combinedItems);
  }, [searchQuery]);

  const totalPages = Math.ceil(allItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = allItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="dark:prose-invert">
      <div className="min-w-screen flex ">
        {/* Hero Section */}
        <div className="relative flex-1 h-[200px]  overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="absolute top-0 left-0 p-4">
            <div className="text-white uppercase font-bold">
              <Link href="/" className=""></Link>
              <Link href="/" className="font-bol">
                ← Home
              </Link>
              <span className="px-1">/</span>
              <Link href="/feed" className="">
                Feed
              </Link>
            </div>
            <div className="text-white text-largest uppercase"></div>
          </div>
          <div className="absolute bottom-0 p-4 w-full">
            <div className="grid grid-cols-3 text-white uppercase font-bold text-smaller items-center">
              <div className="flex justify-start items-center">
                Feed Updates
              </div>
              <div className="flex justify-center items-center">
                {allItems.length} Entries
              </div>
              <div className="flex justify-end items-center">
                <Link href="/feed/rss.xml">RSS </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Section */}
      <div className="p-4">
        <Search placeholder="Search feed..." />
        <div className="mt-8">
          {paginatedItems.map((item) => (
            <div key={item._id} className="mb-4">
              <Link href={item.slug}>
                <div className="text-lg font-semibold hover:underline">
                  {item.title}
                </div>
              </Link>
            </div>
          ))}
        </div>
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
