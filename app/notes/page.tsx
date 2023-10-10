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
            src="https://source.unsplash.com/user/gndclouds"
            alt="Hero Image"
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="absolute top-0 left-0 p-4">
            <div className="text-white  uppercase">
              <Link href="/">gndclouds</Link>
            </div>
            <div className="text-white text-largest uppercase">Note</div>
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
      {/* Logs Section */}

      <div className="p-4 min-w-screen ">
        {notes.map((note) => (
          <article key={note._id}>
            <Link href={note.slug}>
              <h2>{note.title}</h2>
            </Link>
            {/* {note.description && <p>{note.description}</p>} */}
          </article>
        ))}
      </div>
    </div>
  );
}
