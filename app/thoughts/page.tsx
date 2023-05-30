import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";

import { compareDesc, format, parseISO } from "date-fns";
import { allLogs, Log } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";

function Card(log: Log) {
  const Content = getMDXComponent(log.body.code);

  return (
    <div className="mb-8">
      {/* <h2 className="text-xl">
        <Link
          href={log.url}
          className="text-blue-700 hover:text-blue-900"
          legacyBehavior
        >
          {log.title}
        </Link>
      </h2> */}
      <time dateTime={log.publishedAt} className="block mb-2  text-gray-600">
        {format(parseISO(log.publishedAt), "yyyy-MM-d, ")}
      </time>
      <div className=""> </div>
    </div>
  );
}

export default function Home() {
  const logs = allLogs.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );
  return (
    <main className="">
      <div className="mb-9">
        <div className="pb-3 font-bold">Thoughts</div>
        <div className="">
          Dolor sint cupidatat sunt mollit officia reprehenderit sit minim sint
          consectetur sint cillum minim nostrud duis. Culpa sunt esse eu
          occaecat nulla incididunt amet reprehenderit tempor esse sunt nisi.
          Sint mollit laborum exercitation ullamco laborum sint proident ea
          minim aute sint. Sit cupidatat nisi id excepteur tempor veniam minim
          nisi ullamco eiusmod enim magna Lorem occaecat.
        </div>
      </div>

      <div className="border border-2 mb-9">
        <div className="font-bold">blog</div>
        <div className="grid gap-4 grid-cols-3 grid-rows-3">
          {logs.map((log, idx) => (
            <Card key={idx} {...log} />
          ))}
        </div>
      </div>
      <div className="border border-2 mb-9">
        <div className="font-bold">log</div>
        <div className="grid gap-4 grid-cols-3 grid-rows-3">
          {logs.map((log, idx) => (
            <Card key={idx} {...log} />
          ))}
        </div>
      </div>
      <div className="border border-2 mb-9">
        <div className="font-bold">newlsetter</div>
        <div className="grid gap-4 grid-cols-3 grid-rows-3">
          {logs.map((log, idx) => (
            <Card key={idx} {...log} />
          ))}
        </div>
      </div>
    </main>
  );
}
