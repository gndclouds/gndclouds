"use client";

import Image from "next/image";
import Link from "next/link";
import { parseISO, format } from "date-fns";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

interface PageHeroProps {
  data: {
    publishedAt: string;
    title: string;
    tags: string;
    url?: string; // Add this line
  };
}

const PageHero = ({ data }: PageHeroProps) => {
  const router = useRouter();
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const publishedAt =
    data.publishedAt && typeof data.publishedAt === "string"
      ? parseISO(data.publishedAt)
      : null;

  if (!publishedAt) {
    console.error("Invalid publishedAt value:", data.publishedAt);
  } else {
    console.log("Published At:", publishedAt);
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      // Navigate to the entered path
      router.push(`/${inputValue.trim()}`);
    } else if (e.key === "Escape") {
      setShowInput(false);
      setInputValue("");
    }
  };

  return (
    <div className="min-w-screen flex">
      {/* Hero Section */}
      <div className="relative flex-1 h-[200px] overflow-hidden">
        <Image
          src="/background.jpg"
          alt="Hero Image"
          fill
          style={{ objectFit: "cover", objectPosition: "bottom" }}
        />

        <div className="absolute inset-0 opacity-40"></div>
        <div className="absolute top-0 left-0 p-4">
          <div className="text-white uppercase font-bold flex items-center">
            <Link href="/" className="inline-flex items-center">
              <ArrowLeftIcon className="font-bold" /> gndclouds
            </Link>
            <div
              className="inline-flex items-center cursor-pointer"
              onMouseEnter={() => setShowInput(true)}
              onMouseLeave={() => !inputValue && setShowInput(false)}
            >
              <span className="px-1">/</span>
              {showInput ? (
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="type path..."
                  className="bg-transparent border-b border-white text-white outline-none w-24 placeholder-gray-400"
                  autoFocus
                />
              ) : (
                <Link href=".." className="inline">
                  perivous
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 p-4 w-full">
          <div className="grid grid-cols-3 text-white uppercase font-bold text-smaller items-center">
            <div className="flex justify-start items-center">{data.title}</div>
            <div className="flex justify-end items-center ml-auto">
              Date:{" "}
              {publishedAt ? (
                <time dateTime={data.publishedAt}>
                  v.{format(publishedAt, "yyyy-MM")}
                </time>
              ) : (
                "N/A"
              )}
            </div>
          </div>
          {data.url && (
            <div className="absolute bottom-0 right-0 p-4">
              <Link href={data.url} className="text-white underline">
                View Live Project
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHero;
