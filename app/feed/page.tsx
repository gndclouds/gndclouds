"use client";

import React from "react";
import {
  allNotes,
  allLogs,
  allProjects,
  allNewsletters,
} from "@/.contentlayer/generated";
import { compareDesc } from "date-fns";
import Link from "next/link";

function hasPublishedAt(item: { publishedAt?: any }) {
  return item.publishedAt !== undefined;
}

export default function FeedPage() {
  // Combine all items, filter out those without a publishedAt date, and sort them by publishedAt date
  const combinedItems = [
    ...allNotes,
    ...allLogs,
    ...allProjects,
    ...allNewsletters,
  ]
    .filter(hasPublishedAt)
    .sort((a, b) =>
      compareDesc(new Date(a.publishedAt || ""), new Date(b.publishedAt || ""))
    );

  return (
    <div className="prose dark:prose-invert">
      {combinedItems.map((item) => (
        <div key={item._id}>
          <Link href={item.slug}>
            <a>
              <h2>{item.title}</h2>
            </a>{" "}
          </Link>
        </div>
      ))}
    </div>
  );
}
