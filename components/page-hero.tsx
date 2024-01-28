"use client";

import Link from "next/link";
import Image from "next/image";

interface PageHeroProps {
  updated: string; // Adjust the type according to your actual data
  count: string;
  rss: string; // Example, adjust as needed
}

export function PageHero({ updated, count, rss }: PageHeroProps) {
  return (
    <div className="relative flex-1 h-[200px] overflow-hidden">
      <Image
        src="https://source.unsplash.com/user/gndclouds"
        alt="Hero Image"
        layout="fill"
        objectFit="cover"
      />

      <div className="absolute top-0 left-0 p-4">
        <div className="text-white  uppercase font-bold">
          <Link href="/" className=""></Link>
          <Link href="/" className="font-bol">
            ← gndclouds
          </Link>
          <span className="px-1">/</span>
          <Link href="/logs" className="">
            logs
          </Link>
        </div>
        {/* <div className="text-white text-largest uppercase">Log</div> */}
      </div>
      <div className="absolute bottom-0 p-4 w-full">
        <div className="grid grid-cols-3 text-white uppercase font-bold text-smaller items-center">
          <div className="flex justify-start items-center">
            Updated:{" "}
            {/* <time dateTime={updated}>
              {format(parseISO(updated), "yyyy-MM-dd")}
            </time> */}
          </div>
          <div className="flex justify-center items-center">
            Number of {typeof count === "number" ? count : "Invalid Count"}
          </div>
          <div className="flex justify-end items-center">rss</div>
        </div>
      </div>
    </div>
  );
}
