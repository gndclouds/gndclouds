import type { Metadata } from "next";
import Link from "next/link";

import { allLogs } from "contentlayer/generated";

export default function LogPage() {
  return (
    <main className="">
      {allLogs
        .sort((a, b) => {
          if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
            return -1;
          }
          return 1;
        })
        .map((log: any) => (
          <Link
            key={log.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/newsletter/${log.slug}`}
          >
            <div className="w-full flex flex-col">
              <p>{log.title}</p>
            </div>
          </Link>
        ))}
    </main>
  );
}
