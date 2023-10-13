import { allNotes } from "@/.contentlayer/generated";
import { compareDesc, format, parseISO } from "date-fns";

import Link from "next/link";
import Image from "next/image";

export default function NotePage() {
  const notes = allNotes.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );
  return (
    <div className=" dark:prose-invert">
      <div className="p-4 min-w-screen flex">
        {/* Hero Section */}
        <div className="relative flex-1 h-[200px] rounded-2xl overflow-hidden">
          <Image
            src="/hero-notes.png"
            alt="Hero Image"
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="absolute top-0 left-0 p-4">
            <div className="text-white uppercase">
              <Link href="/" className="font-bold">
                gndclouds
              </Link>
            </div>
            <div className="text-white font-bold text-largest uppercase">
              Notes
            </div>
          </div>
          <div className="absolute bottom-0 p-4 w-full">
            <div className="grid grid-cols-3 text-white uppercase font-bold text-smaller items-center">
              <div className="flex justify-start items-center">
                Updated:{" "}
                <time dateTime={notes[0].publishedAt}>
                  {format(parseISO(notes[0].publishedAt), "yyyy-MM-dd")}
                </time>
              </div>
              <div className="flex justify-center items-center">
                Number of {allNotes.length}
              </div>
              <div className="flex justify-end items-center">rss</div>
            </div>
          </div>
        </div>
      </div>
      {/* Notes Section */}

      <div className="p-4 min-w-screen ">
        <div className="bg-[#f0f0f0] italic p-4">
          This page is generated with Obsidian and there are some linking
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
