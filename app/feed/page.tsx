"use client";

import { useState } from "react";
import { allNotes, allLogs, allProjects } from "@/.contentlayer/generated";
import { compareDesc, format, parseISO } from "date-fns";
import Link from "next/link";

export default function FeedPage() {
  // Combine all items and sort them by publishedAt date
  const combinedItems = [...allNotes, ...allLogs, ...allProjects].sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );

  return (
    <div className="prose dark:prose-invert">
      {combinedItems.map((item) => (
        <article key={item._id}>
          <Link href={item.slug}>
            <h2>{item.title}</h2>
          </Link>
          {/* <time dateTime={item.publishedAt}>
            {format(parseISO(item.publishedAt), "yyyy-MM-dd")}
          </time> */}
          {/* <p>{item.description}</p> */}
        </article>
      ))}
    </div>
  );
}
