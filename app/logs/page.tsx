"use client";

import { useState } from "react";
import { allLogs } from "@/.contentlayer/generated";
import { compareDesc, format, parseISO } from "date-fns";
import { PageHero } from "@/components/page-hero";
import { Mdx } from "@/components/mdx-components";

import Link from "next/link";
import Image from "next/image";

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const unpublishedLogs = allLogs.filter((log) => log.published);

  let logs = unpublishedLogs.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );
  // Filter logs by search query
  if (searchQuery) {
    logs = logs.filter((log) =>
      log.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Filter logs by selected year
  if (selectedYear) {
    logs = logs.filter(
      (log) => format(parseISO(log.publishedAt), "yyyy") === selectedYear
    );
  }

  // const uniqueYears = [
  //   ...new Set(
  //     allLogs.map((log) =>
  //       format(parseISO(log.publishedAt), "yyyy")
  //     )
  //   ),
  // ];
  const latestUpdateDate =
    logs.length > 0
      ? format(parseISO(logs[0].publishedAt ?? ""), "yyyy-MM-dd")
      : "N/A";
  const logsCount = Array.isArray(logs) ? logs.length : 0;

  return (
    <div className=" dark:prose-invert">
      <div className="min-w-screen flex">
        <PageHero updated="date" count={logsCount.toString()} rss="n" />
      </div>
      {/* Logs Section */}
      <div className="p-4 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="border border-gray-300 shadow-sm rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
        />
        {/* <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">Filter by year</option>
          {uniqueYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select> */}
      </div>
      <div className="p-4 min-w-screen ">
        {logs.map((log) => (
          <article key={log._id}>
            <Link href={log.slug}>
              <h2 className="text-lg hover:underline underline-offset-2">
                {log.title}
              </h2>
            </Link>
            {/* <Mdx code={log.body.code} /> */}
            {/* {log.description && <p>{log.description}</p>} */}
          </article>
        ))}
      </div>
    </div>
  );
}
