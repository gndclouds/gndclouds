import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { allLogs, Log } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";

function LogCard(log: Log) {
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
      <div className="">
        {" "}
        <Content />{" "}
      </div>
    </div>
  );
}

export default function Home() {
  const logs = allLogs.sort((a, b) =>
    compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
  );

  return (
    <div className="max-w-xl py-8 mx-auto">
      <h1 className="">Logs</h1>

      {logs.map((log, idx) => (
        <LogCard key={idx} {...log} />
      ))}
    </div>
  );
}
