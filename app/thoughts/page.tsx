import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";

import { compareDesc, format, parseISO } from "date-fns";
import { allLogs, Log } from "contentlayer/generated";
import { allBlogs, Blog } from "contentlayer/generated";
import { allNewsletters, Newsletter } from "contentlayer/generated";

import { getMDXComponent } from "next-contentlayer/hooks";

function Card(data: Data) {

  return (
    <div className="mb-8">
       <div className="text-xl">
        <Link
          href={data.url}
        >
         <div className="text-lg">{data.title}</div>
        </Link>
      </div>
      <time dateTime={data.publishedAt} className="text-sm">
        {format(parseISO(data.publishedAt), "yyyy-MM-d, ")}
      </time>
    </div>
  );
}

export default function Home() {
  // Sort by Date
  const logs = allLogs.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );
  const blogs = allBlogs.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );
  const newsletters = allNewsletters.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );
  return (
    <main className="">
      <div className="mb-9">
        <div className="pb-3 text-lg font-bold">Thoughts</div>
        <div className="text-base">
          Sint cupidatat sunt mollit officia reprehenderit sit minim sint
          consectetur sint cillum minim nostrud duis. Culpa sunt esse eu
          occaecat nulla incididunt amet reprehenderit tempor esse sunt nisi.
          Sint mollit laborum exercitation ullamco laborum sint proident ea
          minim aute sint. Sit cupidatat nisi id excepteur tempor veniam minim
          nisi ullamco eiusmod enim magna Lorem occaecat.
        </div>
      </div>

      {/* Section Blogs */}
      <div className="mb-9">
        <div className="font-bold text-lg">blog</div>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-3">
          {blogs.map((data, idx) => (
            <Card key={idx} {...data} />
          ))}
        </div>
      </div>

      {/* Section Logs */}
      <div className="mb-9">
        <div className="font-bold text-lg">log</div>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-3">
          {logs.map((data, idx) => (
            <Card key={idx} {...data} />
          ))}
        </div>
      </div>

      {/* Section Newsletters */}
      <div className="mb-9">
        <div className="font-bold text-lg">newlsetter</div>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-3">
          {newsletters.map((data, idx) => (
            <Card key={idx} {...data} />
          ))}
        </div>
      </div>
    </main>
  );
}
