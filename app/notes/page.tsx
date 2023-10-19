"use client";

import { useState } from "react";
import { allNotes } from "@/.contentlayer/generated";
import { compareDesc, format, parseISO } from "date-fns";
import Link from "next/link";
import Image from "next/image";

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const unpublishedNotes = allNotes.filter((project) => project.published);

  let notes = unpublishedNotes.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );

  // Filter projects by search query
  if (searchQuery) {
    notes = notes.filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Filter projects by selected year
  if (selectedYear) {
    notes = notes.filter(
      (note) => format(parseISO(note.publishedAt), "yyyy") === selectedYear
    );
  }

  // const uniqueYears = [
  //   ...new Set(
  //     allNotes.map((note) =>
  //       format(parseISO(note.publishedAt), "yyyy")
  //     )
  //   ),
  // ];

  return (
    <div className=" dark:prose-invert">
      <div className="min-w-screen flex">
        {/* Hero Section */}
        <div className="relative flex-1 h-[200px] roverflow-hidden">
          <Image
            src="/hero-notes.png"
            alt="Hero Image"
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="absolute top-0 left-0 p-4">
            <div className="text-white uppercase font-bold">
              <Link href="/" className=""></Link>
              <Link href="/" className="font-bol">
                ← gndclouds
              </Link>
              <span className="px-1">/</span>
              <Link href="/notes" className="">
                notes
              </Link>
            </div>
            <div className="text-white font-bold text-largest uppercase"></div>
          </div>
          <div className="absolute bottom-0 p-4 w-full">
            <div className="grid grid-cols-3 text-white uppercase font-bold text-smaller items-center">
              <div className="flex flex-wrap justify-start items-center">
                <time dateTime={notes[0].publishedAt}>
                  v.{format(parseISO(notes[0].publishedAt), "yyyy-MM-dd")}
                </time>
              </div>
              <div className="flex flex-wrap justify-center items-center">
                {allNotes.length} Entries
              </div>
              <div className="flex justify-end items-center">
                <Link href="/notes/rss.xml">RSS </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Notes Section */}

      <div className="p-4 min-w-screen ">
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
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

        <div className="bg-[#f0f0f0] italic p-4">
          🙈 This page is generated with Obsidian and there are some linking
          [[bugs]] still being worked out.
        </div>
        {notes.map((note) => (
          <article key={note._id} className="py-4">
            <Link href={note.slug}>
              <div className="text-standard sm:text-large">{note.title}</div>
            </Link>
            <time dateTime={note.publishedAt}>
              {format(parseISO(note.publishedAt), "yyyy-MM-dd")}
            </time>
            {/* {note.description && <p>{note.description}</p>} */}
          </article>
        ))}
      </div>
    </div>
  );
}
