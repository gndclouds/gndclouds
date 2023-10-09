import Link from "next/link";

import { compareDesc, format, parseISO } from "date-fns";
import { allLogs, Log } from "contentlayer/generated";
import { allNotes, Note } from "contentlayer/generated";
import { allNewsletters, Newsletter } from "contentlayer/generated";

import { getMDXComponent } from "next-contentlayer/hooks";

interface Data {
  url: string;
  title: string;
  publishedAt: string;
}

function Card(data: Data) {
  return (
    <div className="mb-8">
      <div className="text-xl">
        <Link href={data.url}>
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
  const notes = allNotes.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );
  const newsletters = allNewsletters.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );
  return (
    <div className="border-2">
      <div className="border-2 h-64 backdrop-blur bg-black">
        Add image
        <div className="pb-3 text-lg font-bold">Thoughts</div>
      </div>
      <div className="border-2">
        <div className="text-base">
          Sint cupidatat sunt mollit officia reprehenderit sit minim sint
          consectetur sint cillum minim nostrud duis. Culpa sunt esse eu
          occaecat nulla incididunt amet reprehenderit tempor esse sunt nisi.
          Sint mollit laborum exercitation ullamco laborum sint proident ea
          minim aute sint. Sit cupidatat nisi id excepteur tempor veniam minim
          nisi ullamco eiusmod enim magna Lorem occaecat. The list of thought is
          sorted leaste to most polished.
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3">
          <div className="p-4 border-2">
            <div className="uppercase">
              {" "}
              <Link href="logs">
                <div className="flex justify-between">
                  {" "}
                  <div>Logs</div>
                  <div>→</div>
                </div>
              </Link>
            </div>
            <div>
              {" "}
              Sint cupidatat sunt mollit officia reprehenderit sit minim sint
              consectetur sint cillum minim nostrud duis.{" "}
            </div>
            <div className="">{logs.length} </div>
          </div>
          <div className="p-4 border-2">
            <div className="uppercase">
              <Link href="note">
                <div className="flex justify-between">
                  {" "}
                  <div>Notes</div>
                  <div>→</div>
                </div>
              </Link>
            </div>
            <div>
              {" "}
              Sint cupidatat sunt mollit officia reprehenderit sit minim sint
              consectetur sint cillum minim nostrud duis.{" "}
            </div>
            <div className=""> {notes.length}</div>
          </div>
          <div className="p-4 border-2">
            <div className="uppercase">
              {" "}
              <Link href="newsletter">
                <div className="flex justify-between">
                  {" "}
                  <div>Newsletters</div>
                  <div>→</div>
                </div>
              </Link>
            </div>
            <div>
              {" "}
              Sint cupidatat sunt mollit officia reprehenderit sit minim sint
              consectetur sint cillum minim nostrud duis.{" "}
            </div>
            <div className=""> {newsletters.length} </div>
          </div>
        </div>
      </div>

      {/* Section Notes */}
      {/* <div className="mb-9">
        <div className="font-bold text-lg">note</div>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-3">
          {notes.map((data, idx) => (
            <Card key={idx} {...data} />
          ))}
        </div>
      </div> */}

      {/* Section Logs */}
      {/*<div className="mb-9">
        <div className="font-bold text-lg">log</div>
        <div className="">
          I write little learning logs daily to document my process and reflect
          on my personal growth. If they feel possibly relevant to others, I
          export them from obsidian and publish them here.
        </div>

        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-3">
          {logs.map((data, idx) => (
            <Card key={idx} {...data} />
          ))}
        </div>
      </div>*/}

      {/* Section Newsletters */}
      {/*<div className="mb-9">
        <div className="font-bold text-lg">newlsetter</div>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-3">
          {.map((data, idx) => (
            <Card key={idx} {...data} />
          ))}
        </div>
      </div>*/}
    </div>
  );
}
