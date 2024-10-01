"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { FiArrowRight } from "react-icons/fi";

interface ListViewProps {
  data: any[];
}

export default function ListView({ data }: { data: any[] }) {
  const renderItem = (item: any, index: number) => {
    // Debugging: Log the item and its metadata
    console.log(`Item ${index}:`, item);
    console.log(`Item ${index} metadata:`, item.metadata);

    let itemType = "default";
    if (Array.isArray(item.metadata?.type) && item.metadata.type.length > 0) {
      itemType = item.metadata.type[0].toLowerCase();
    } else if (
      typeof item.metadata?.type === "string" &&
      item.metadata.type.length > 0
    ) {
      itemType = item.metadata.type.toLowerCase();
    }

    const linkPath = `/${itemType}/${item.slug}`; // Updated to use itemType

    // Print the linkPath for debugging
    console.log(`Rendering item with linkPath: ${linkPath}`);

    const gridColumnSpan: { [key: string]: string } = {
      newsletter: "span 12",
      log: "span 6",
      note: "span 6",
      photography: "span 4",
      project: "span 4",
      default: "span 12",
    };

    const contents: {
      [key: string]: { element: JSX.Element; colSpan: string };
    } = {
      newsletter: {
        element: (
          <div className="border-2 border-gray-200 rounded-lg relative">
            <div className="absolute top-0 left-0 p-2">
              <span className="bg-gray-200 text-gray-800 text-xs font-bold uppercase px-2 py-1">
                #newsletter
              </span>
            </div>
            <div className="absolute top-0 right-0 p-2">
              <span className="text-sm">
                {new Date(item.publishedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex-1 p-4 pt-8">
              <h2 className="text-2xl">
                <Link href={linkPath}>{item.title}</Link>
              </h2>
            </div>
          </div>
        ),
        colSpan: gridColumnSpan.newsletter,
      },
      log: {
        element: (
          <div className="border-2 border-gray-200 relative">
            <div>
              <div>{item.title || "Untitled"}</div>
              <div className="absolute top-0 right-0 p-2">
                <span className="text-sm">
                  {item.publishedAt
                    ? new Date(item.publishedAt).getFullYear()
                    : "Unknown Date"}
                </span>
              </div>
            </div>{" "}
            <div>
              {item.metadata?.description || "No description available"}
            </div>
            <div className="flex flex-row border-t-2 border-gray-200 absolute bottom-0 left-0 w-full">
              <div className="flex flex-wrap gap-2 p-2">
                {item.tags?.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${tag}`}
                    className="bg-gray-200 px-3 py-1 text-sm"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
              <div className="bg-gray-200 ml-auto">
                <Link href={linkPath}>→</Link>
              </div>
            </div>
            <div className="flex-1 p-4 pt-8"></div>
          </div>
        ),
        colSpan: gridColumnSpan.log,
      },
      note: {
        element: (
          <div className="border-2 border-gray-200 relative">
            <div>
              <div>{item.title}</div>
              <div className="absolute top-0 right-0 p-2">
                <span className="text-sm">
                  {item.publishedAt
                    ? new Date(item.publishedAt).getFullYear()
                    : "Unknown Date"}
                </span>
              </div>
            </div>{" "}
            <div>
              {item.metadata?.description || "No description available"}
            </div>
            <div className="flex flex-row border-t-2 border-gray-200 absolute bottom-0 left-0 w-full">
              <div className="flex flex-wrap gap-2 p-2">
                {item.tags?.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${tag}`}
                    className="bg-gray-200 px-3 py-1 text-sm"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
              <div className="bg-gray-200 ml-auto">
                <Link href={linkPath}>
                  <ArrowRightIcon className="font-bold" />
                </Link>
              </div>
            </div>
            <div className="flex-1 p-4 pt-8"></div>
          </div>
        ),
        colSpan: gridColumnSpan.note,
      },
      photography: {
        element: (
          <div className="col-span-12 md:col-span-4 lg:col-span-2 border-2 border-gray-200 relative">
            <div className="">
              {item.urls && (
                <Image
                  src={item.urls.regular}
                  alt={item.title}
                  width={100}
                  height={100}
                />
              )}
            </div>
            <div className="card-title">cae</div>
          </div>
        ),
        colSpan: gridColumnSpan.photography,
      },
      project: {
        element: (
          <div className="col-span-12 md:col-span-6 lg:col-span-4 border-2 border-gray-200 relative p-4 min-h-[50px] group hover:border-gray-300 hover:bg-[#F8F8F8]">
            <Link href={linkPath} className="">
              <div className="text-sm slashed-zero lining-nums">
                {item.publishedAt
                  ? new Date(item.publishedAt).getFullYear()
                  : "Unknown Date"}
              </div>
              <div className="flex flex-row flex justify-between text-[3vw] font-medium">
                <h2 className="">{item.title}</h2>
                <FiArrowRight className="text-[3vw]" />
              </div>
            </Link>
          </div>
        ),
        colSpan: gridColumnSpan.project,
      },
      default: {
        element: (
          <div className="border-2 border-gray-200 relative">
            <div className="flex-1 p-4 pt-8">
              <h2 className="text-2xl">
                <Link href={linkPath}>{item.title} - default</Link>
              </h2>
            </div>
          </div>
        ),
        colSpan: gridColumnSpan.default,
      },
    };

    return (
      <div
        key={index}
        className={`col-span-12 md:${
          contents[itemType]?.colSpan || contents.default.colSpan
        }`}
      >
        {contents[itemType]?.element || contents.default.element}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      {data.map((item, index) => renderItem(item, index))}
    </div>
  );
}
